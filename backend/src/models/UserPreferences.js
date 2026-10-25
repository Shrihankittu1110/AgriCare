import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    language: {
      type: String,
      enum: ['en', 'te', 'hi'],
      default: 'en',
    },
    temperatureUnit: {
      type: String,
      enum: ['C', 'F'],
      default: 'C',
    },
    preferredLocation: {
      name: { type: String, default: 'Guntur, Andhra Pradesh' },
      latitude: { type: Number, default: 16.3067 },
      longitude: { type: Number, default: 80.4365 },
    },
    voicePreferences: {
      voiceEnabled: { type: Boolean, default: true },
      autoPlayAudio: { type: Boolean, default: false },
    },
    notificationPreferences: {
      weatherAlerts: { type: Boolean, default: true },
      pestRiskWarnings: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

export const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);
