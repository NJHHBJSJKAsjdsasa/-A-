import { Request, Response } from 'express';
import { Course } from '../models/Course';
import { Lesson } from '../models/Lesson';
import { UserProgress } from '../models/UserProgress';
import { Enrollment } from '../models/Enrollment';
import { AuthRequest } from '../middleware/auth';

export const getCourses = async (req: Request, res: Response) => {
  try {
    const { language, level, page = 1, limit = 20 } = req.query;

    const query: Record<string, unknown> = {};
    if (language) query.language = language;
    if (level) query.level = level;

    const courses = await Course.find(query)
      .sort({ enrolled: -1, createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .select('-lessons');

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      data: courses,
      meta: { page: Number(page), limit: Number(limit), total }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get courses' }
    });
  }
};

export const getCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate({
        path: 'lessons',
        select: 'title titleZh titleEn titleJa titleKo order duration',
        options: { sort: { order: 1 } }
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: { code: 'COURSE_NOT_FOUND', message: 'Course not found' }
      });
    }

    res.json({ success: true, data: course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get course' }
    });
  }
};

export const enrollCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: { code: 'COURSE_NOT_FOUND', message: 'Course not found' }
      });
    }

    const existingEnrollment = await Enrollment.findOne({ userId, courseId: id });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_ENROLLED', message: 'Already enrolled in this course' }
      });
    }

    const totalLessons = course.lessons.length;

    const enrollment = new Enrollment({
      userId,
      courseId: id,
      totalLessons
    });

    await enrollment.save();

    await Course.findByIdAndUpdate(id, { $inc: { enrolled: 1 } });

    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to enroll course' }
    });
  }
};

export const getLessons = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const lessons = await Lesson.find({ courseId })
      .sort({ order: 1 })
      .select('-exercises');

    res.json({ success: true, data: lessons });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get lessons' }
    });
  }
};

export const getLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: { code: 'LESSON_NOT_FOUND', message: 'Lesson not found' }
      });
    }

    res.json({ success: true, data: lesson });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get lesson' }
    });
  }
};

export const completeLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { score, exerciseResults } = req.body;
    const userId = req.user?.userId;

    // Score validation
    if (score === undefined || typeof score !== 'number') {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_SCORE', message: 'Score is required and must be a number' }
      });
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_SCORE', message: 'Score must be between 0 and 100' }
      });
    }

    // Exercise results validation if provided
    if (exerciseResults && !Array.isArray(exerciseResults)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_EXERCISE_RESULTS', message: 'Exercise results must be an array' }
      });
    }

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: { code: 'LESSON_NOT_FOUND', message: 'Lesson not found' }
      });
    }

    let progress = await UserProgress.findOne({ userId, lessonId: id });

    if (progress) {
      progress.score = score;
      progress.exerciseResults = exerciseResults || [];
      progress.completed = true;
      progress.completedAt = new Date();
    } else {
      progress = new UserProgress({
        userId,
        courseId: lesson.courseId,
        lessonId: id,
        score,
        exerciseResults: exerciseResults || [],
        completed: true,
        completedAt: new Date()
      });
    }

    await progress.save();

    const enrollment = await Enrollment.findOne({ userId, courseId: lesson.courseId });
    if (enrollment) {
      const completedCount = await UserProgress.countDocuments({
        userId,
        courseId: lesson.courseId,
        completed: true
      });

      enrollment.completedLessons = completedCount;
      enrollment.progress = Math.round((completedCount / enrollment.totalLessons) * 100);
      enrollment.lastAccessedAt = new Date();

      if (completedCount === enrollment.totalLessons) {
        enrollment.completedAt = new Date();
      }

      await enrollment.save();
    }

    // TODO: Update user points and exp - would need to call user service or have shared database access
    // For now, we'll just log that this needs to be done
    const pointsEarned = Math.floor(score / 20); // Example: 1 point per 20% score
    const expEarned = pointsEarned * 5; // Example: 5 exp per point
    console.log(`Need to update user ${userId} - add ${pointsEarned} points and ${expEarned} exp for completing lesson`);

    res.json({
      success: true,
      data: {
        progress,
        courseProgress: enrollment ? enrollment.progress : 0,
        pointsEarned,
        expEarned
      }
    });
  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to complete lesson' }
    });
  }
};

export const getProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { courseId } = req.query;

    if (courseId) {
      const enrollment = await Enrollment.findOne({ userId, courseId })
        .populate('courseId', 'title titleZh titleEn titleJa titleKo cover');

      const progress = await UserProgress.find({ userId, courseId })
        .populate('lessonId', 'title titleZh titleEn titleJa titleKo order');

      res.json({
        success: true,
        data: { enrollment, progress }
      });
    } else {
      const enrollments = await Enrollment.find({ userId })
        .populate('courseId', 'title titleZh titleEn titleJa titleKo cover language level');

      res.json({ success: true, data: enrollments });
    }
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get progress' }
    });
  }
};

export const submitExercise = async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId, exerciseId } = req.params;
    const { answer } = req.body;
    const userId = req.user?.userId;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: { code: 'LESSON_NOT_FOUND', message: 'Lesson not found' }
      });
    }

    const exercise = lesson.exercises.find(
      e => e._id.toString() === exerciseId
    );

    if (!exercise) {
      return res.status(404).json({
        success: false,
        error: { code: 'EXERCISE_NOT_FOUND', message: 'Exercise not found' }
      });
    }

    const isCorrect = exercise.answer.toLowerCase().trim() === answer.toLowerCase().trim();

    res.json({
      success: true,
      data: {
        correct: isCorrect,
        correctAnswer: isCorrect ? undefined : exercise.answer,
        points: isCorrect ? exercise.points : 0
      }
    });
  } catch (error) {
    console.error('Submit exercise error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to submit exercise' }
    });
  }
};
