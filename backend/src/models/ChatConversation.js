import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    cropContext: {
      cropName: String,
      diseaseName: String,
      healthStatus: String,
    },
    weatherContext: {
      temperature: Number,
      condition: String,
      humidity: Number,
    },
  },
  { _id: true }
);

const chatConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    selectedLanguage: {
      type: String,
      enum: ['en', 'te', 'hi'],
      default: 'en',
    },
    cropScanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CropScan',
      default: null,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

chatConversationSchema.index({ userId: 1, updatedAt: -1 });

export const ChatConversation = mongoose.model('ChatConversation', chatConversationSchema);
