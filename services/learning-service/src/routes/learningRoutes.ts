import { Router } from 'express';
import { body } from 'express-validator';
import {
  getCourses,
  getCourse,
  enrollCourse,
  getLessons,
  getLesson,
  completeLesson,
  getProgress,
  submitExercise
} from '../controllers/learningController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/courses', getCourses);
router.get('/courses/:id', getCourse);
router.post('/courses/:id/enroll', authenticate, enrollCourse);

router.get('/courses/:courseId/lessons', getLessons);
router.get('/lessons/:id', getLesson);
router.post(
  '/lessons/:id/complete',
  authenticate,
  [
    body('score').isInt({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100')
  ],
  completeLesson
);

router.post(
  '/lessons/:lessonId/exercises/:exerciseId/submit',
  authenticate,
  [body('answer').notEmpty().withMessage('Answer is required')],
  submitExercise
);

router.get('/progress', authenticate, getProgress);

export default router;
