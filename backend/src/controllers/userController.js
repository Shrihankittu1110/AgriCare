import { User } from '../models/User.js';
import { UserPreferences } from '../models/UserPreferences.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, preferredLanguage, location } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    if (location) user.location = location;

    await user.save();

    // Also update preference record
    await UserPreferences.findOneAndUpdate(
      { userId: user._id },
      {
        language: user.preferredLanguage,
        preferredLocation: user.location,
      },
      { upsert: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const getPreferences = async (req, res, next) => {
  try {
    let preferences = await UserPreferences.findOne({ userId: req.user._id });
    if (!preferences) {
      preferences = await UserPreferences.create({
        userId: req.user._id,
        language: req.user.preferredLanguage || 'en',
        preferredLocation: req.user.location,
      });
    }

    res.json({
      success: true,
      preferences,
    });
  } catch (err) {
    next(err);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const { language, temperatureUnit, preferredLocation, voicePreferences, notificationPreferences } = req.body;

    const preferences = await UserPreferences.findOneAndUpdate(
      { userId: req.user._id },
      {
        ...(language && { language }),
        ...(temperatureUnit && { temperatureUnit }),
        ...(preferredLocation && { preferredLocation }),
        ...(voicePreferences && { voicePreferences }),
        ...(notificationPreferences && { notificationPreferences }),
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully.',
      preferences,
    });
  } catch (err) {
    next(err);
  }
};
