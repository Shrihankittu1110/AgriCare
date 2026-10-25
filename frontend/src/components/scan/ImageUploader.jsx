import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ImageUploader = ({ onImageSelected, selectedFile, onClear }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const validateAndSelect = (file) => {
    setError(null);
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setError('Please upload a valid JPEG, PNG, or WebP image.');
      return;
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size exceeds the 10MB limit. Please choose a smaller photo.');
      return;
    }

    onImageSelected(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      {selectedFile ? (
        <div className="relative rounded-3xl overflow-hidden bg-white border border-agri-200 shadow-card p-4">
          <div className="relative aspect-[4/3] w-full max-h-[380px] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected crop leaf preview"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="mt-4 flex items-center justify-between px-2">
            <div>
              <div className="text-sm font-bold text-agri-900 truncate max-w-[200px]">
                {selectedFile.name}
              </div>
              <div className="text-xs text-gray-400">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type.split('/')[1]?.toUpperCase()}
              </div>
            </div>

            <button
              type="button"
              onClick={onClear}
              className="py-2 px-4 text-xs font-semibold text-agri-700 bg-agri-50 hover:bg-agri-100 border border-agri-200 rounded-xl transition-all"
            >
              {t('scan.changeImage')}
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-agri-600 bg-agri-50 scale-[1.01]'
              : 'border-agri-200 bg-white hover:border-agri-400 hover:bg-agri-50/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleChange}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-agri-100 text-agri-700 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h4 className="text-base sm:text-lg font-bold text-agri-dark mb-1">
            {t('scan.chooseFile')}
          </h4>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-4">
            {t('scan.dragDrop')}
          </p>

          <span className="inline-block py-2.5 px-5 bg-agri-600 hover:bg-agri-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
            Browse Leaf Image
          </span>

          <div className="mt-4 text-[11px] text-gray-400">
            Supports JPEG, PNG, WebP up to 10MB
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
