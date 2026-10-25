import mongoose from 'mongoose';

const cropScanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
      default: '',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    crop: {
      name: { type: String, required: true },
      scientificName: { type: String, default: '' },
      confidence: { type: Number, default: 0 },
    },
    disease: {
      name: { type: String, required: true },
      scientificName: { type: String, default: '' },
      confidence: { type: Number, default: 0 },
    },
    healthStatus: {
      type: String,
      default: 'Healthy',
      index: true,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    severityEstimate: {
      type: String,
      default: 'Low',
    },
    visibleSymptoms: {
      type: [String],
      default: [],
    },
    likelyCauses: {
      type: [String],
      default: [],
    },
    recommendations: {
      cultural: { type: [String], default: [] },
      organic: { type: [String], default: [] },
      preventive: { type: [String], default: [] },
      cautiousChemicalNotes: { type: [String], default: [] },
    },
    weatherContext: {
      temperature: { type: Number, default: null },
      humidity: { type: Number, default: null },
      rainfallProbability: { type: Number, default: null },
      weatherAssessment: { type: String, default: '' },
    },
    climateActionPlan: {
      climateSummary: { type: String, default: '' },
      predictedImpact: { type: String, default: '' },
      immediateNaturalAction: { type: String, default: '' },
      chemicalAction: { type: String, default: '' },
      irrigationGuidance: { type: String, default: '' },
      timelineGuidance: { type: String, default: '' },
    },
    expertConsultationNote: {
      type: String,
      default: 'Consult a local agricultural extension officer or certified agronomist if chlorosis or defoliation spreads rapidly beyond 15% of the canopy.',
    },
    disclaimer: {
      type: String,
      default: 'AI-generated results provide preliminary guidance, not a certified laboratory diagnosis. Consult a qualified agricultural expert when symptoms are unclear or the crop is seriously affected.',
    },
    providerMetadata: {
      provider: { type: String, default: 'agricare-vision-engine' },
      model: { type: String, default: 'standard-v1' },
      isDemoMode: { type: Boolean, default: false },
      fallbackReason: { type: String, default: '' },
    },
    language: {
      type: String,
      enum: ['en', 'te', 'hi'],
      default: 'en',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying a user's recent scans quickly
cropScanSchema.index({ userId: 1, createdAt: -1 });

export const CropScan = mongoose.model('CropScan', cropScanSchema);
