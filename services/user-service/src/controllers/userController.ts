import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import { config } from '../../shared/config.js';

const generateTokens = (userId: string, email: string) => {
  const accessToken = jwt.sign({ userId, email }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  const refreshToken = jwt.sign({ userId, email }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, nickname, language = 'zh' } = req.body;

    if (!email || !password || !nickname) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'Email, password and nickname are required' }
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: 'Email already registered' }
      });
    }

    const passwordHash = await bcrypt.hash(password, config.bcrypt.saltRounds);
    
    const user = new User({
      email,
      passwordHash,
      nickname,
      language,
      avatar: `/avatars/${Math.floor(Math.random() * 10) + 1}.png`
    });

    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.email);

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
          language: user.language,
          level: user.level,
          exp: user.exp,
          points: user.points
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Registration failed' }
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'Email and password are required' }
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.email);

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
          language: user.language,
          level: user.level,
          exp: user.exp,
          points: user.points
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Login failed' }
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_TOKEN', message: 'Refresh token is required' }
      });
    }

    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: string; email: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid refresh token' }
      });
    }

    const tokens = generateTokens(user._id.toString(), user.email);

    res.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired refresh token' }
    });
  }
};

export const oauthLogin = async (req: Request, res: Response) => {
  try {
    const { provider } = req.params;
    const { code, state } = req.query;

    if (!['wechat', 'qq', 'weibo', 'google'].includes(provider)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PROVIDER', message: 'Invalid OAuth provider' }
      });
    }

    let oauthUser: { id: string; name: string; avatar?: string } | null = null;

    switch (provider) {
      case 'wechat':
        oauthUser = await handleWechatOAuth(code as string);
        break;
      case 'qq':
        oauthUser = await handleQQOAuth(code as string);
        break;
      case 'weibo':
        oauthUser = await handleWeiboOAuth(code as string);
        break;
      case 'google':
        oauthUser = await handleGoogleOAuth(code as string);
        break;
    }

    if (!oauthUser) {
      return res.status(401).json({
        success: false,
        error: { code: 'OAUTH_FAILED', message: 'OAuth authentication failed' }
      });
    }

    let user = await User.findOne({
      'oauthProviders.provider': provider,
      'oauthProviders.providerId': oauthUser.id
    });

    if (!user) {
      user = new User({
        email: `${provider}_${oauthUser.id}@doraemon.temp`,
        passwordHash: await bcrypt.hash(uuidv4(), config.bcrypt.saltRounds),
        nickname: oauthUser.name,
        avatar: oauthUser.avatar || `/avatars/${Math.floor(Math.random() * 10) + 1}.png`,
        oauthProviders: [{ provider: provider as 'wechat' | 'qq' | 'weibo' | 'google', providerId: oauthUser.id }]
      });
      await user.save();
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.email);

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
          language: user.language,
          level: user.level,
          exp: user.exp,
          points: user.points
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'OAuth authentication failed' }
    });
  }
};

const handleWechatOAuth = async (code: string) => {
  return { id: 'wechat_test_id', name: 'WeChat User', avatar: '/avatars/wechat.png' };
};

const handleQQOAuth = async (code: string) => {
  return { id: 'qq_test_id', name: 'QQ User', avatar: '/avatars/qq.png' };
};

const handleWeiboOAuth = async (code: string) => {
  return { id: 'weibo_test_id', name: 'Weibo User', avatar: '/avatars/weibo.png' };
};

const handleGoogleOAuth = async (code: string) => {
  return { id: 'google_test_id', name: 'Google User', avatar: '/avatars/google.png' };
};

export const sendPhoneVerification = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_PHONE', message: 'Phone number is required' }
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log(`SMS verification code for ${phone}: ${code}`);

    res.json({
      success: true,
      data: { message: 'Verification code sent' }
    });
  } catch (error) {
    console.error('Send phone verification error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to send verification code' }
    });
  }
};

export const verifyPhone = async (req: AuthRequest, res: Response) => {
  try {
    const { phone, code } = req.body;
    const userId = req.user?.userId;

    if (!phone || !code) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'Phone and code are required' }
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    user.phone = phone;
    user.phoneVerified = true;
    await user.save();

    res.json({
      success: true,
      data: { message: 'Phone verified successfully' }
    });
  } catch (error) {
    console.error('Verify phone error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Phone verification failed' }
    });
  }
};

export const sendEmailVerification = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Email verification code for ${user.email}: ${code}`);

    res.json({
      success: true,
      data: { message: 'Verification email sent' }
    });
  } catch (error) {
    console.error('Send email verification error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to send verification email' }
    });
  }
};

export const verifyEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.body;
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    user.emailVerified = true;
    await user.save();

    res.json({
      success: true,
      data: { message: 'Email verified successfully' }
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Email verification failed' }
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get user' }
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (userId !== id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only update your own profile' }
      });
    }

    const { nickname, avatar, language } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { nickname, avatar, language },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update user' }
    });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.userId;

    if (userId !== id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only change your own password' }
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_PASSWORD', message: 'Current password is incorrect' }
      });
    }

    user.passwordHash = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
    await user.save();

    res.json({
      success: true,
      data: { message: 'Password changed successfully' }
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to change password' }
    });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (userId !== id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only delete your own account' }
      });
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      data: { message: 'Account deleted successfully' }
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to delete account' }
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get user info' }
    });
  }
};
