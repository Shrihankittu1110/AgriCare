import { useState, useEffect, useCallback } from 'react';

const DEFAULT_LOCATION = {
  name: 'Guntur, Andhra Pradesh',
  latitude: 16.3067,
  longitude: 80.4365,
  isDefault: true,
};

export const useGeolocation = (initialLocation = null) => {
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('agricare_saved_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return initialLocation || DEFAULT_LOCATION;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const requestBrowserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLoc = {
          name: 'Current GPS Location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isDefault: false,
        };
        setLocation(newLoc);
        localStorage.setItem('agricare_saved_location', JSON.stringify(newLoc));
        setIsLoading(false);
        setPermissionDenied(false);
      },
      (err) => {
        console.warn('[Geolocation] Browser location error:', err.message);
        setIsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true);
          setError('Location permission was denied. You can manually search for your town or district.');
        } else {
          setError(`Unable to retrieve location: ${err.message}`);
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes cache
      }
    );
  }, []);

  const setManualLocation = useCallback((manualLoc) => {
    setLocation(manualLoc);
    localStorage.setItem('agricare_saved_location', JSON.stringify(manualLoc));
    setError(null);
  }, []);

  return {
    location,
    isLoading,
    error,
    permissionDenied,
    requestBrowserLocation,
    setManualLocation,
  };
};
