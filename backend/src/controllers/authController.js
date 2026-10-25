import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { UserPreferences } from '../models/UserPreferences.js';
import { config } from '../config/env.js';

// Helper to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

// Set token in secure cookie
const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, preferredLanguage, location } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    const passwordHash = await User.hashPassword(password);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      preferredLanguage: preferredLanguage || 'en',
      location: location || {
        name: 'Guntur, Andhra Pradesh',
        latitude: 16.3067,
        longitude: 80.4365,
      },
    });

    // Create initial user preferences
    await UserPreferences.create({
      userId: user._id,
      language: user.preferredLanguage,
      preferredLocation: user.location,
    });

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        location: user.location,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        location: user.location,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const preferences = await UserPreferences.findOne({ userId: req.user.id });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        location: user.location,
      },
      preferences: preferences || {},
    });
  } catch (err) {
    next(err);
  }
};
