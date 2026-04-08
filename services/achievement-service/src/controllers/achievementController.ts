import { Request, Response } from 'express';
import { Badge } from '../models/Badge.js';
import { UserAchievement } from '../models/UserAchievement.js';
import { Leaderboard } from '../models/Leaderboard.js';
import { PointTransaction } from '../models/PointTransaction.js';
import { AuthRequest } from '../middleware/auth.js';

export const getBadges = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const query: Record<string, unknown> = {};
    if (category) query.category = category;

    const badges = await Badge.find(query).sort({ rarity: 1, createdAt: -1 });

    res.json({ success: true, data: badges });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get badges' }
    });
  }
};

export const getUserBadges = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const achievements = await UserAchievement.find({ userId })
      .populate('badgeId')
      .sort({ unlockedAt: -1 });

    res.json({ success: true, data: achievements });
  } catch (error) {
    console.error('Get user badges error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get user badges' }
    });
  }
};

export const unlockBadge = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, badgeId } = req.body;

    const existing = await UserAchievement.findOne({ userId, badgeId });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: { code: 'BADGE_UNLOCKED', message: 'Badge already unlocked' }
      });
    }

    const badge = await Badge.findById(badgeId);
    if (!badge) {
      return res.status(404).json({
        success: false,
        error: { code: 'BADGE_NOT_FOUND', message: 'Badge not found' }
      });
    }

    const achievement = new UserAchievement({ userId, badgeId });
    await achievement.save();

    res.status(201).json({ success: true, data: { achievement, points: badge.points } });
  } catch (error) {
    console.error('Unlock badge error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to unlock badge' }
    });
  }
};

export const getUserLevel = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    res.json({
      success: true,
      data: {
        userId,
        level: 1,
        exp: 0,
        expToNextLevel: 100
      }
    });
  } catch (error) {
    console.error('Get user level error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get user level' }
    });
  }
};

export const addExp = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, amount, reason } = req.body;

    res.json({
      success: true,
      data: {
        userId,
        expAdded: amount,
        reason,
        newLevel: 1,
        newExp: amount
      }
    });
  } catch (error) {
    console.error('Add exp error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to add experience' }
    });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { type = 'exp', period = 'weekly' } = req.params;
    const { limit = 100 } = req.query;

    let leaderboard = await Leaderboard.findOne({ type, period })
      .populate('rankings.userId', 'nickname avatar level');

    if (!leaderboard) {
      leaderboard = new Leaderboard({
        type,
        period,
        rankings: []
      });
      await leaderboard.save();
    }

    res.json({
      success: true,
      data: leaderboard.rankings.slice(0, Number(limit))
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get leaderboard' }
    });
  }
};

export const getPoints = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { page = 1, limit = 20 } = req.query;

    const transactions = await PointTransaction.find({ userId })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await PointTransaction.countDocuments({ userId });

    res.json({
      success: true,
      data: transactions,
      meta: { page: Number(page), limit: Number(limit), total }
    });
  } catch (error) {
    console.error('Get points error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get points' }
    });
  }
};

export const usePoints = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { amount, reason, relatedId } = req.body;

    const transaction = new PointTransaction({
      userId,
      amount,
      type: 'spend',
      reason,
      relatedId
    });

    await transaction.save();

    res.json({
      success: true,
      data: { message: 'Points used successfully', amount }
    });
  } catch (error) {
    console.error('Use points error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to use points' }
    });
  }
};

export const earnPoints = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, amount, reason, relatedId } = req.body;

    const transaction = new PointTransaction({
      userId,
      amount,
      type: 'earn',
      reason,
      relatedId
    });

    await transaction.save();

    res.json({
      success: true,
      data: { message: 'Points earned successfully', amount }
    });
  } catch (error) {
    console.error('Earn points error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to earn points' }
    });
  }
};
