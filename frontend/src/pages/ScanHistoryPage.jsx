import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  History,
  ScanLine,
  Filter,
  Search,
  Calendar,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Bug,
  RefreshCw,
} from 'lucide-react';
import { scanService } from '../services/scanService';
import { useToast } from '../context/ToastContext';
import { resolveImageUrl } from '../utils/imageUrl';

export const ScanHistoryPage = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [scans, setScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchScans = async () => {
    setIsLoading(true);
    try {
      const data = await scanService.getScans({ limit: 50 });
      if (data.success) {
        setScans(data.scans || []);
      }
    } catch (err) {
      console.warn('Failed to fetch scans:', err);
      showToast('Could not load scan history', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this scan record?')) {
      return;
    }

    try {
      const res = await scanService.deleteScan(id);
      if (res.success) {
        setScans((prev) => prev.filter((s) => s._id !== id));
        showToast('Scan deleted successfully', 'success');
      }
    } catch (err) {
      showToast('Could not delete scan', 'error');
    }
  };

  const filteredScans = scans.filter((scan) => {
    const matchesStatus = statusFilter === 'All' || scan.healthStatus === statusFilter;
    const matchesQuery =
      !searchQuery.trim() ||
      scan.crop?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.disease?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-agri-dark tracking-tight flex items-center gap-2.5">
            <History className="w-7 h-7 text-agri-600" />
            <span>Field Diagnostic History</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review past leaf diagnoses, compare observations over time, and monitor treatment outcomes.
          </p>
        </div>

        <Link
          to="/scan"
          className="inline-flex items-center gap-2 py-2.5 px-5 bg-agri-600 hover:bg-agri-700 text-white font-bold rounded-2xl text-xs shadow-sm transition-all active:scale-95 self-start sm:self-auto"
        >
          <ScanLine className="w-4 h-4" />
          <span>New Leaf Scan</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-agri-100 shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop or disease name..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-cream-50/70 border border-agri-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['All', 'Healthy', 'Suspected Disease', 'Pest Damage'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-agri-700 text-white shadow-xs'
                  : 'bg-cream-50 text-gray-600 hover:bg-agri-50 hover:text-agri-800 border border-cream-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Scans Grid */}
      {isLoading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-agri-600 mx-auto mb-3" />
          <span className="text-xs text-gray-500">Loading diagnostic history...</span>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-agri-100 shadow-card max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-agri-50 text-agri-600 flex items-center justify-center mx-auto mb-4">
            <ScanLine className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-agri-dark mb-1">No Scans Recorded</h3>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            {searchQuery || statusFilter !== 'All'
              ? 'No historical records matched your active search or filter.'
              : 'You have not uploaded any crop scans yet. Capture an image of a plant leaf to start tracking health.'}
          </p>
          <Link
            to="/scan"
            className="inline-flex items-center gap-2 py-2.5 px-6 bg-agri-600 hover:bg-agri-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
          >
            <ScanLine className="w-4 h-4" />
            <span>Scan First Crop</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScans.map((scan) => {
            const isHealthy = scan.healthStatus === 'Healthy';
            return (
              <Link
                key={scan._id}
                to={`/history/${scan._id}`}
                className="group bg-white rounded-3xl border border-agri-100 shadow-card hover:shadow-soft-lg hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Photo Banner */}
                  <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                    {scan.imageUrl ? (
                      <img
                        src={resolveImageUrl(scan.imageUrl)}
                        alt="Crop leaf observation"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        No Image Preview
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-md border ${
                          isHealthy
                            ? 'bg-emerald-100/90 text-emerald-800 border-emerald-300'
                            : 'bg-amber-100/90 text-amber-800 border-amber-300'
                        }`}
                      >
                        {scan.healthStatus}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDelete(e, scan._id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors shadow-xs"
                      title="Delete scan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(scan.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-base font-bold text-agri-dark group-hover:text-agri-700 transition-colors">
                      {scan.crop?.name}
                    </h3>
                    <p className="text-xs text-agri-800 font-medium truncate mt-0.5">
                      {scan.disease?.name}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                      <span>Confidence: {scan.confidenceScore}%</span>
                      <span className="font-semibold text-agri-600 flex items-center gap-1">
                        <span>Details</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
