import fs from 'fs';
import path from 'path';
import { CropScan } from '../models/CropScan.js';
import { detectCropDisease } from '../services/cropDetection/index.js';

export const analyzeScan = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a clear crop leaf image for analysis.',
      });
    }

    const { language = 'en', latitude, longitude, locationName } = req.body;
    const targetLanguage = ['en', 'te', 'hi'].includes(language) ? language : req.user.preferredLanguage || 'en';

    const imagePath = req.file.path;
    const mimeType = req.file.mimetype;
    const filename = req.file.filename;
    const imageUrl = `/uploads/${filename}`;

    // Perform AI analysis
    const diagnostic = await detectCropDisease({
      imagePath,
      mimeType,
      targetLanguage,
      latitude: latitude ? parseFloat(latitude) : req.user.location?.latitude,
      longitude: longitude ? parseFloat(longitude) : req.user.location?.longitude,
      locationName: locationName || req.user.location?.name,
    });

    // Create database record
    const scan = await CropScan.create({
      userId: req.user._id,
      imagePath,
      imageUrl,
      originalFilename: req.file.originalname,
      fileSize: req.file.size,
      crop: diagnostic.crop,
      disease: diagnostic.disease,
      healthStatus: diagnostic.healthStatus,
      confidenceScore: diagnostic.confidenceScore,
      severityEstimate: diagnostic.severityEstimate,
      visibleSymptoms: diagnostic.visibleSymptoms,
      likelyCauses: diagnostic.likelyCauses,
      recommendations: diagnostic.recommendations,
      weatherContext: diagnostic.weatherContext || {},
      expertConsultationNote: diagnostic.expertConsultationNote,
      disclaimer: diagnostic.disclaimer,
      providerMetadata: diagnostic.providerMetadata,
      language: targetLanguage,
    });

    res.status(201).json({
      success: true,
      message: 'Crop leaf analyzed successfully.',
      scan,
    });
  } catch (err) {
    // If error occurs, clean up uploaded file to prevent orphan files
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error('[ScanController] Failed to unlink temp file:', unlinkErr.message);
      }
    }
    next(err);
  }
};

export const getScans = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const query = { userId: req.user._id };

    if (req.query.status) {
      query.healthStatus = req.query.status;
    }

    const scans = await CropScan.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CropScan.countDocuments(query);

    res.json({
      success: true,
      count: scans.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      scans,
    });
  } catch (err) {
    next(err);
  }
};

export const getScanById = async (req, res, next) => {
  try {
    const scan = await CropScan.findById(req.params.id);

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan record not found.',
      });
    }

    // Ensure authorization (user can only view their own scans)
    if (scan.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view this scan.',
      });
    }

    res.json({
      success: true,
      scan,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteScan = async (req, res, next) => {
  try {
    const scan = await CropScan.findById(req.params.id);

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan record not found.',
      });
    }

    if (scan.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to delete this scan.',
      });
    }

    // Safely delete image file from storage if it exists
    if (scan.imagePath && fs.existsSync(scan.imagePath)) {
      try {
        fs.unlinkSync(scan.imagePath);
      } catch (fileErr) {
        console.warn('[ScanController] Could not delete image file from disk:', fileErr.message);
      }
    }

    await scan.deleteOne();

    res.json({
      success: true,
      message: 'Scan record and associated image removed successfully.',
    });
  } catch (err) {
    next(err);
  }
};
