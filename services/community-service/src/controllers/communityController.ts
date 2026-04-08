import { Request, Response } from 'express';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';
import { Circle } from '../models/Circle.js';
import { AuthRequest } from '../middleware/auth.js';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      circleId, 
      authorId, 
      tag,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const query: Record<string, unknown> = {};
    if (circleId) query.circleId = circleId;
    if (authorId) query.authorId = authorId;
    if (tag) query.tags = tag;

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj: Record<string, number> = { [sort as string]: sortOrder };

    const posts = await Post.find(query)
      .sort(sortObj)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get posts' }
    });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        error: { code: 'POST_NOT_FOUND', message: 'Post not found' }
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get post' }
    });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, images = [], videos = [], circleId, tags = [], language = 'zh' } = req.body;
    const authorId = req.user?.userId;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'Title and content are required' }
      });
    }

    const post = new Post({
      authorId,
      title,
      content,
      images,
      videos,
      circleId,
      tags,
      language
    });

    await post.save();

    if (circleId) {
      await Circle.findByIdAndUpdate(circleId, { $inc: { posts: 1 } });
    }

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create post' }
    });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, images, videos, tags, language } = req.body;
    const userId = req.user?.userId;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: { code: 'POST_NOT_FOUND', message: 'Post not found' }
      });
    }

    if (post.authorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only edit your own posts' }
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, images, videos, tags, language },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update post' }
    });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: { code: 'POST_NOT_FOUND', message: 'Post not found' }
      });
    }

    if (post.authorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only delete your own posts' }
      });
    }

    await Post.findByIdAndDelete(id);
    await Comment.deleteMany({ postId: id });

    if (post.circleId) {
      await Circle.findByIdAndUpdate(post.circleId, { $inc: { posts: -1 } });
    }

    res.json({
      success: true,
      data: { message: 'Post deleted successfully' }
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to delete post' }
    });
  }
};

export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: { code: 'POST_NOT_FOUND', message: 'Post not found' }
      });
    }

    const hasLiked = post.likedBy.some(id => id.toString() === userId);

    if (hasLiked) {
      await Post.findByIdAndUpdate(id, {
        $pull: { likedBy: userId },
        $inc: { likes: -1 }
      });
    } else {
      await Post.findByIdAndUpdate(id, {
        $addToSet: { likedBy: userId },
        $inc: { likes: 1 }
      });
    }

    res.json({
      success: true,
      data: { liked: !hasLiked }
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to like post' }
    });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const comments = await Comment.find({ postId, parentId: { $exists: false } })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    for (const comment of comments) {
      const replies = await Comment.find({ parentId: comment._id })
        .sort({ createdAt: 1 })
        .limit(3)
        .lean();
      (comment as Record<string, unknown>).replies = replies;
    }

    const total = await Comment.countDocuments({ postId, parentId: { $exists: false } });

    res.json({
      success: true,
      data: comments,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get comments' }
    });
  }
};

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const { content, parentId } = req.body;
    const authorId = req.user?.userId;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_CONTENT', message: 'Comment content is required' }
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: { code: 'POST_NOT_FOUND', message: 'Post not found' }
      });
    }

    const comment = new Comment({
      postId,
      authorId,
      parentId,
      content
    });

    await comment.save();

    await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } });

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create comment' }
    });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: { code: 'COMMENT_NOT_FOUND', message: 'Comment not found' }
      });
    }

    if (comment.authorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only delete your own comments' }
      });
    }

    await Comment.findByIdAndDelete(id);
    await Post.findByIdAndUpdate(comment.postId, { $inc: { comments: -1 } });

    res.json({
      success: true,
      data: { message: 'Comment deleted successfully' }
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to delete comment' }
    });
  }
};

export const getCircles = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, language } = req.query;

    const query: Record<string, unknown> = {};
    if (language) query.language = language;

    const circles = await Circle.find(query)
      .sort({ posts: -1, createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    const total = await Circle.countDocuments(query);

    res.json({
      success: true,
      data: circles,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total
      }
    });
  } catch (error) {
    console.error('Get circles error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get circles' }
    });
  }
};

export const getCircle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const circle = await Circle.findById(id).lean();

    if (!circle) {
      return res.status(404).json({
        success: false,
        error: { code: 'CIRCLE_NOT_FOUND', message: 'Circle not found' }
      });
    }

    res.json({
      success: true,
      data: circle
    });
  } catch (error) {
    console.error('Get circle error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get circle' }
    });
  }
};

export const createCircle = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, cover, language = 'zh', isPublic = true } = req.body;
    const ownerId = req.user?.userId;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_NAME', message: 'Circle name is required' }
      });
    }

    const existingCircle = await Circle.findOne({ name });
    if (existingCircle) {
      return res.status(409).json({
        success: false,
        error: { code: 'NAME_EXISTS', message: 'Circle name already exists' }
      });
    }

    const circle = new Circle({
      name,
      description,
      cover,
      ownerId,
      members: [ownerId],
      language,
      isPublic
    });

    await circle.save();

    res.status(201).json({
      success: true,
      data: circle
    });
  } catch (error) {
    console.error('Create circle error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create circle' }
    });
  }
};

export const joinCircle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const circle = await Circle.findById(id);
    if (!circle) {
      return res.status(404).json({
        success: false,
        error: { code: 'CIRCLE_NOT_FOUND', message: 'Circle not found' }
      });
    }

    const isMember = circle.members.some(member => member.toString() === userId);

    if (isMember) {
      await Circle.findByIdAndUpdate(id, { $pull: { members: userId } });
    } else {
      await Circle.findByIdAndUpdate(id, { $addToSet: { members: userId } });
    }

    res.json({
      success: true,
      data: { joined: !isMember }
    });
  } catch (error) {
    console.error('Join circle error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to join circle' }
    });
  }
};

export const updateCircle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, cover, language, isPublic } = req.body;
    const userId = req.user?.userId;

    const circle = await Circle.findById(id);
    if (!circle) {
      return res.status(404).json({
        success: false,
        error: { code: 'CIRCLE_NOT_FOUND', message: 'Circle not found' }
      });
    }

    if (circle.ownerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only circle owner can update' }
      });
    }

    const updatedCircle = await Circle.findByIdAndUpdate(
      id,
      { name, description, cover, language, isPublic },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedCircle
    });
  } catch (error) {
    console.error('Update circle error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update circle' }
    });
  }
};

export const deleteCircle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const circle = await Circle.findById(id);
    if (!circle) {
      return res.status(404).json({
        success: false,
        error: { code: 'CIRCLE_NOT_FOUND', message: 'Circle not found' }
      });
    }

    if (circle.ownerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only circle owner can delete' }
      });
    }

    await Post.deleteMany({ circleId: id });
    await Circle.findByIdAndDelete(id);

    res.json({
      success: true,
      data: { message: 'Circle deleted successfully' }
    });
  } catch (error) {
    console.error('Delete circle error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to delete circle' }
    });
  }
};
