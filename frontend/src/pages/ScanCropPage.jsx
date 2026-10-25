import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, UploadCloud, RefreshCw, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { CameraCapture } from '../components/scan/CameraCapture';
import { ImageUploader } from '../components/scan/ImageUploader';
import { ScanGuidance } from '../components/scan/ScanGuidance';
import { ScanResultCard } from '../components/scan/ScanResultCard';
import { PermissionModal } from '../components/common/PermissionModal';
import { scanService } from '../services/scanService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ScanCropPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'camera'
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedScan, setAnalyzedScan] = useState(null);
  const [error, setError] = useState(null);

  // Permission modal for camera
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [cameraGranted, setCameraGranted] = useState(false);

  const handleTabChange = (tab) => {
    if (tab === 'camera') {
      const hasAllowed = localStorage.getItem('agricare_camera_permission_prompted');
      if (!hasAllowed && !cameraGranted) {
        setCameraModalOpen(true);
        return;
      }
    }
    setActiveTab(tab);
  };

  const handleAllowCamera = () => {
    localStorage.setItem('agricare_camera_permission_prompted', 'true');
    setCameraGranted(true);
    setCameraModalOpen(false);
    setActiveTab('camera');
  };

  const handleDenyCamera = () => {
    localStorage.setItem('agricare_camera_permission_prompted', 'true');
    setCameraModalOpen(false);
    setActiveTab('upload');
  };

  const handleImageCaptureOrSelect = (file) => {
    setSelectedFile(file);
    setActiveTab('upload'); // Switch to preview in upload tab
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select or capture a crop leaf image first.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('language', i18n.language);
    if (user?.location?.latitude) {
      formData.append('latitude', user.location.latitude);
      formData.append('longitude', user.location.longitude);
      formData.append('locationName', user.location.name);
    }

    try {
      const res = await scanService.analyzeCrop(formData);
      if (res.success && res.scan) {
        setAnalyzedScan(res.scan);
        showToast('Crop leaf analyzed successfully!', 'success');
      }
    } catch (err) {
      console.error('[ScanCropPage] Analysis failed:', err);
      const msg = err.response?.data?.message || 'Failed to complete leaf analysis. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResetScan = () => {
    setSelectedFile(null);
    setAnalyzedScan(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-100 text-agri-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-agri-600" />
          <span>Computer Vision Pathology</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-agri-dark tracking-tight">
          {t('scan.title')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          {t('scan.subtitle')}
        </p>
      </div>

      {analyzedScan ? (
        /* Diagnostic Result Card */
        <ScanResultCard
          scan={analyzedScan}
          onScanAnother={handleResetScan}
        />
      ) : (
        /* Capture & Upload Interface */
        <div className="space-y-6">
          {/* Mode Switch Tabs */}
          <div className="flex bg-white p-1.5 rounded-2xl border border-agri-100 max-w-xs mx-auto shadow-xs">
            <button
              type="button"
              onClick={() => handleTabChange('upload')}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-agri-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-agri-800'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>{t('scan.uploadTab')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('camera')}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'camera'
                  ? 'bg-agri-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-agri-800'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{t('scan.cameraTab')}</span>
            </button>
          </div>

          {/* Active Mode Component */}
          {activeTab === 'camera' ? (
            <CameraCapture
              onCapture={handleImageCaptureOrSelect}
              onCancel={() => setActiveTab('upload')}
            />
          ) : (
            <div className="space-y-6">
              <ImageUploader
                selectedFile={selectedFile}
                onImageSelected={(file) => setSelectedFile(file)}
                onClear={() => setSelectedFile(null)}
              />

              {/* Action Analyze Button */}
              {selectedFile && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full sm:w-auto px-8 py-3.5 bg-agri-600 hover:bg-agri-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-soft hover:shadow-soft-lg transition-all active:scale-95 flex items-center justify-center gap-2.5 mx-auto text-sm"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>{t('scan.analyzing')}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-accent-gold" />
                        <span>{t('scan.analyzeBtn')}</span>
                      </>
                    )}
                  </button>

                  {isAnalyzing && (
                    <p className="text-xs text-gray-500 mt-3 animate-pulse">
                      {t('scan.analyzingDesc')}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-medium flex items-center gap-2 max-w-md mx-auto">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Guidelines Checklist */}
          <ScanGuidance />
        </div>
      )}

      {/* Camera Permission Modal */}
      <PermissionModal
        isOpen={cameraModalOpen}
        type="camera"
        onAllow={handleAllowCamera}
        onDeny={handleDenyCamera}
        onClose={() => setCameraModalOpen(false)}
      />
    </div>
  );
};
