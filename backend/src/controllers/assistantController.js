import { ChatConversation } from '../models/ChatConversation.js';
import { CropScan } from '../models/CropScan.js';
import { askAssistant } from '../services/ai/index.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { message, language = 'en', cropScanId = null, weatherContext = null } = req.body;
    const targetLanguage = ['en', 'te', 'hi'].includes(language) ? language : 'en';

    let cropContext = null;

    // If crop scan ID is provided, verify scan ownership
    if (cropScanId) {
      const scan = await CropScan.findById(cropScanId);
      if (scan && scan.userId.toString() === req.user._id.toString()) {
        cropContext = {
          cropName: scan.crop.name,
          diseaseName: scan.disease.name,
          healthStatus: scan.healthStatus,
        };
      }
    }

    // Find existing conversation for user or create one
    let conversation = await ChatConversation.findOne({ userId: req.user._id }).sort({ updatedAt: -1 });

    if (!conversation) {
      conversation = await ChatConversation.create({
        userId: req.user._id,
        selectedLanguage: targetLanguage,
        cropScanId: cropScanId || null,
        messages: [],
      });
    }

    // Append user message
    const userMessageObj = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
      cropContext,
      weatherContext,
    };
    conversation.messages.push(userMessageObj);

    // Prepare context window for model (last 8 messages)
    const recentMessages = conversation.messages.slice(-8).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Query assistant service
    const assistantResult = await askAssistant({
      messages: recentMessages,
      targetLanguage,
      cropContext,
      weatherContext,
    });

    // Append assistant response
    const assistantMessageObj = {
      role: 'assistant',
      content: assistantResult.content,
      timestamp: new Date(),
      cropContext,
      weatherContext,
    };
    conversation.messages.push(assistantMessageObj);
    conversation.selectedLanguage = targetLanguage;
    if (cropScanId) {
      conversation.cropScanId = cropScanId;
    }
    await conversation.save();

    res.json({
      success: true,
      conversationId: conversation._id,
      userMessage: userMessageObj,
      assistantMessage: assistantMessageObj,
      providerMetadata: assistantResult.providerMetadata,
    });
  } catch (err) {
    next(err);
  }
};

export const getConversation = async (req, res, next) => {
  try {
    const conversation = await ChatConversation.findOne({ userId: req.user._id })
      .populate('cropScanId', 'crop disease healthStatus imageUrl')
      .sort({ updatedAt: -1 });

    if (!conversation) {
      return res.json({
        success: true,
        conversation: {
          messages: [],
          selectedLanguage: req.user.preferredLanguage || 'en',
        },
      });
    }

    res.json({
      success: true,
      conversation,
    });
  } catch (err) {
    next(err);
  }
};

export const clearConversation = async (req, res, next) => {
  try {
    await ChatConversation.deleteMany({ userId: req.user._id });

    res.json({
      success: true,
      message: 'Chat conversation cleared successfully.',
    });
  } catch (err) {
    next(err);
  }
};
