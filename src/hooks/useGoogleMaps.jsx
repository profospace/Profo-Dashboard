import { useState, useEffect } from 'react';

/**
 * Custom hook to load the Google Maps API
 * @param {string} apiKey - Your Google Maps API key
 * @returns {{ isLoaded: boolean, loadError: Error | null }}
 */
const useGoogleMaps = (apiKey) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        // Skip if API is already loaded
        if (window.google && window.google.maps) {
            setIsLoaded(true);
            return;
        }

        // Skip if we're already loading the API
        if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
            return;
        }

        const googleMapScript = document.createElement('script');
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.GOOGLE_API_KEY}&libraries=places`;
        googleMapScript.async = true;
        googleMapScript.defer = true;

        // Handle successful loading
        googleMapScript.addEventListener('load', () => {
            setIsLoaded(true);
            // Dispatch custom event for other components to listen to
            window.dispatchEvent(new Event('google-maps-loaded'));
        });

        // Handle loading error
        googleMapScript.addEventListener('error', (error) => {
            setLoadError(error);
            console.error('Google Maps API failed to load', error);
        });

        // Add script to document
        document.head.appendChild(googleMapScript);

        // Cleanup function
        return () => {
            // We don't remove the script tag, as it might be used by other components
        };
    }, [apiKey]);

    return { isLoaded, loadError };
};

export default useGoogleMaps;