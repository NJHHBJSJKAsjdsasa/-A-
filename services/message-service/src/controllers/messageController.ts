import { Request, Response } from 'express';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { AuthRequest } from '../middleware/auth';

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { page = 1, limit = 20 } = req.query;

    const conversations = await Conversation.find({
      participants: userId
    })
      .sort({ updatedAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('participants', 'nickname avatar')
      .populate('lastMessage.senderId', 'nickname avatar')
      .lean();

    const total = await Conversation.countDocuments({ participants: userId });

    res.json({
      success: true,
      data: conversations,
      meta: { page: Number(page), limit: Number(limit), total }
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get conversations' }
    });
  }
};

export const getConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const conversation = await Conversation.findOne({
      _id: id,
      participants: userId
    })
      .populate('participants', 'nickname avatar')
      .populate('lastMessage.senderId', 'nickname avatar');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: { code: 'CONVERSATION_NOT_FOUND', message: 'Conversation not found' }
      });
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get conversation' }
    });
  }
};

export const createConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { type = 'private', participants, name, avatar } = req.body;
    const userId = req.user?.userId;

    if (!participants || participants.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_PARTICIPANTS', message: 'Participants are required' }
      });
    }

    const allParticipants = [...new Set([userId, ...participants])];

    if (type === 'private' && allParticipants.length === 2) {
      const existingConversation = await Conversation.findOne({
        type: 'private',
        participants: { $all: allParticipants, $size: 2 }
      });

      if (existingConversation) {
        return res.json({ success: true, data: existingConversation });
      }
    }

    const conversation = new Conversation({
      type,
      participants: allParticipants,
      name,
      avatar,
      createdBy: userId
    });

    await conversation.save();

    res.status(201).json({ success: true, data: conversation });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create conversation' }
    });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50, before } = req.query;
    const userId = req.user?.userId;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: { code: 'CONVERSATION_NOT_FOUND', message: 'Conversation not found' }
      });
    }

    const query: Record<string, unknown> = { conversationId };
    if (before) {
      query.createdAt = { $lt: new Date(before as string) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('senderId', 'nickname avatar')
      .lean();

    res.json({
      success: true,
      data: messages.reverse(),
      meta: { page: Number(page), limit: Number(limit) }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get messages' }
    });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { type = 'text', content } = req.body;
    const userId = req.user?.userId;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_CONTENT', message: 'Message content is required' }
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: { code: 'CONVERSATION_NOT_FOUND', message: 'Conversation not found' }
      });
    }

    const message = new Message({
      conversationId,
      senderId: userId,
      type,
      content,
      readBy: [userId]
    });

    await message.save();

    conversation.lastMessage = {
      content: type === 'text' ? content : `[${type}]`,
      senderId: userId as unknown as typeof conversation.lastMessage.senderId,
      createdAt: new Date()
    };
    await conversation.save();

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to send message' }
    });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.userId;

    await Message.updateMany(
      { conversationId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );

    res.json({ success: true, data: { message: 'Messages marked as read' } });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to mark messages as read' }
    });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const conversations = await Conversation.find({ participants: userId });
    const conversationIds = conversations.map(c => c._id);

    const unreadCounts = await Message.aggregate([
      {
        $match: {
          conversationId: { $in: conversationIds },
          senderId: { $ne: userId },
          readBy: { $ne: userId }
        }
      },
      {
        $group: {
          _id: '$conversationId',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalUnread = unreadCounts.reduce((sum, item) => sum + item.count, 0);

    res.json({
      success: true,
      data: {
        total: totalUnread,
        byConversation: unreadCounts.reduce((acc, item) => {
          acc[item._id.toString()] = item.count;
          return acc;
        }, {} as Record<string, number>)
      }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get unread count' }
    });
  }
};
