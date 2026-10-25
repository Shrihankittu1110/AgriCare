import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { scanService } from '../services/scanService';
import { ScanResultCard } from '../components/scan/ScanResultCard';
import { useToast } from '../context/ToastContext';

export const ScanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [scan, setScan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchScan = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await scanService.getScanById(id);
        if (data.success && data.scan) {
          setScan(data.scan);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load diagnostic record.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScan();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this scan record and associated image?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await scanService.deleteScan(id);
      if (res.success) {
        showToast('Scan record deleted successfully', 'success');
        navigate('/history');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete scan record', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-agri-600 mx-auto mb-3" />
        <span className="text-xs text-gray-500">Loading diagnostic report...</span>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-gray-800">Diagnostic Record Not Found</h3>
        <p className="text-xs text-gray-500">{error || 'The requested scan record does not exist or access was denied.'}</p>
        <Link
          to="/history"
          className="inline-flex items-center gap-2 px-4 py-2 bg-agri-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to History</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/history"
          className="flex items-center gap-1.5 text-xs font-bold text-agri-700 hover:text-agri-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scan History</span>
        </Link>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-all"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Record</span>
        </button>
      </div>

      <ScanResultCard scan={scan} />
    </div>
  );
};
