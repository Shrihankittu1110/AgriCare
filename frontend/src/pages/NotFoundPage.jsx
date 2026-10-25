import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-agri-100 text-agri-700 flex items-center justify-center mb-6 shadow-sm">
        <Sprout className="w-10 h-10" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-black text-agri-dark tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-3">
        Page Not Found
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
        The field path you followed does not exist. Let's guide you back to familiar ground.
      </p>
      <Link
        to="/"
        className="py-3 px-6 bg-agri-600 hover:bg-agri-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};
