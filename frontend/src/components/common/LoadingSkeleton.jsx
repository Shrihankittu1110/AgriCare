import React from 'react';

export const LoadingSkeleton = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      <div className="h-6 bg-agri-100 rounded-lg w-3/4"></div>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded-md"
          style={{ width: `${Math.max(40, 95 - i * 15)}%` }}
        ></div>
      ))}
    </div>
  );
};

export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`p-6 bg-white rounded-3xl border border-agri-100 shadow-card animate-pulse ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-agri-100"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-agri-100 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full"></div>
        <div className="h-3 bg-gray-100 rounded w-4/5"></div>
      </div>
    </div>
  );
};
