import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CameraCapture = ({ onCapture, onCancel }) => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
  const [cameraError, setCameraError] = useState(null);
  const [isStarting, setIsStarting] = useState(true);

  const startCamera = async (mode = facingMode) => {
    setIsStarting(true);
    setCameraError(null);

    // Stop existing stream if running
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      const constraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsStarting(false);
    } catch (err) {
      console.warn('[Camera] Failed to start stream:', err);
      setIsStarting(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access in your browser settings, or switch to file upload.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera was detected on this device. Please use the image upload option.');
      } else {
        setCameraError(`Camera error: ${err.message}. Please use file upload instead.`);
      }
    }
  };

  useEffect(() => {
    startCamera(facingMode);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const handleCapture = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `camera-scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
        }
      },
      'image/jpeg',
      0.92
    );
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center max-w-xl mx-auto border border-agri-200">
      {/* Video Viewfinder */}
      <div className="relative w-full aspect-[4/3] bg-neutral-900 flex items-center justify-center overflow-hidden">
        {isStarting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 gap-3 z-10 bg-black/60">
            <RefreshCw className="w-8 h-8 animate-spin text-agri-400" />
            <span className="text-sm font-medium">Starting camera preview...</span>
          </div>
        )}

        {cameraError ? (
          <div className="p-6 text-center text-white flex flex-col items-center max-w-xs z-10">
            <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
            <p className="text-sm text-gray-200 mb-4">{cameraError}</p>
            <button
              onClick={onCancel}
              className="py-2.5 px-5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Switch to File Upload
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Viewfinder Target Framing Guidelines */}
            <div className="absolute inset-8 pointer-events-none border-2 border-white/40 rounded-2xl flex items-center justify-center">
              <div className="w-16 h-16 border-t-2 border-l-2 border-agri-400 absolute top-0 left-0 rounded-tl-lg"></div>
              <div className="w-16 h-16 border-t-2 border-r-2 border-agri-400 absolute top-0 right-0 rounded-tr-lg"></div>
              <div className="w-16 h-16 border-b-2 border-l-2 border-agri-400 absolute bottom-0 left-0 rounded-bl-lg"></div>
              <div className="w-16 h-16 border-b-2 border-r-2 border-agri-400 absolute bottom-0 right-0 rounded-br-lg"></div>
              <span className="text-[11px] text-white/70 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs">
                Align leaf inside frame
              </span>
            </div>
          </>
        )}
      </div>

      {/* Camera Controls Bar */}
      <div className="w-full bg-neutral-950 p-4 sm:p-5 flex items-center justify-between px-6 sm:px-8">
        <button
          onClick={onCancel}
          className="p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          title="Cancel"
          aria-label="Cancel"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Snap Button */}
        <button
          onClick={handleCapture}
          disabled={Boolean(cameraError) || isStarting}
          className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-agri-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          aria-label="Capture Photo"
        >
          <div className="w-12 h-12 rounded-full bg-agri-600 flex items-center justify-center text-white">
            <Camera className="w-6 h-6" />
          </div>
        </button>

        {/* Flip Camera */}
        <button
          onClick={toggleCamera}
          disabled={Boolean(cameraError) || isStarting}
          className="p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-40"
          title="Switch Front/Back Camera"
          aria-label="Switch Camera"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
