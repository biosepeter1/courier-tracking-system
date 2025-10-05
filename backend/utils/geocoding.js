const axios = require('axios');

// Simple in-memory cache for geocoding results
const geocodeCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Geocode address to coordinates using Google Maps Geocoding API
const geocodeAddress = async (address) => {
  try {
    if (!address || typeof address !== 'string') {
      throw new Error('Valid address is required');
    }

    const cleanAddress = address.trim();
    
    // Check cache first
    const cacheKey = cleanAddress.toLowerCase();
    if (geocodeCache.has(cacheKey)) {
      const cached = geocodeCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`Using cached geocoding result for: ${cleanAddress}`);
        return cached.data;
      } else {
        // Remove expired cache entry
        geocodeCache.delete(cacheKey);
      }
    }

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key not configured, using fallback coordinates');
      // Return fallback coordinates (Lagos, Nigeria as example)
      return { lat: 6.5244, lng: 3.3792 };
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: cleanAddress,
        key: process.env.GOOGLE_MAPS_API_KEY
      },
      timeout: 10000 // 10 seconds timeout
    });

    if (response.data.status !== 'OK') {
      console.warn(`Geocoding failed for "${cleanAddress}": ${response.data.status}`);
      
      // Return fallback coordinates for common cities/countries
      const fallbacks = {
        'lagos': { lat: 6.5244, lng: 3.3792 },
        'abuja': { lat: 9.0765, lng: 7.3986 },
        'kano': { lat: 12.0022, lng: 8.5920 },
        'ibadan': { lat: 7.3775, lng: 3.9470 },
        'nigeria': { lat: 9.0820, lng: 8.6753 },
        'ghana': { lat: 7.9465, lng: -1.0232 },
        'accra': { lat: 5.6037, lng: -0.1870 }
      };

      const key = cleanAddress.toLowerCase();
      for (const [location, coords] of Object.entries(fallbacks)) {
        if (key.includes(location)) {
          return coords;
        }
      }
      
      // Final fallback
      return { lat: 6.5244, lng: 3.3792 }; // Lagos, Nigeria
    }

    if (!response.data.results || response.data.results.length === 0) {
      throw new Error('No geocoding results found');
    }

    const location = response.data.results[0].geometry.location;
    const coordinates = {
      lat: location.lat,
      lng: location.lng
    };

    // Cache the result
    geocodeCache.set(cacheKey, {
      data: coordinates,
      timestamp: Date.now()
    });

    console.log(`Geocoded "${cleanAddress}" to:`, coordinates);
    return coordinates;

  } catch (error) {
    console.error('Geocoding error:', error.message);
    
    // Return fallback coordinates on error
    console.warn('Using fallback coordinates due to geocoding error');
    return { lat: 6.5244, lng: 3.3792 }; // Lagos, Nigeria
  }
};

// Reverse geocode coordinates to address (if needed in future)
const reverseGeocode = async (lat, lng) => {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return 'Location coordinates provided';
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.GOOGLE_MAPS_API_KEY
      },
      timeout: 10000
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    }

    return 'Unknown location';
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    return 'Unknown location';
  }
};

// Generate Google Maps link for coordinates
const generateMapsLink = (lat, lng) => {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};

// Clear expired cache entries (can be called periodically)
const clearExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of geocodeCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      geocodeCache.delete(key);
    }
  }
  console.log(`Cache cleanup completed. Current cache size: ${geocodeCache.size}`);
};

// Get cache statistics
const getCacheStats = () => {
  return {
    size: geocodeCache.size,
    entries: Array.from(geocodeCache.keys())
  };
};

module.exports = {
  geocodeAddress,
  reverseGeocode,
  generateMapsLink,
  clearExpiredCache,
  getCacheStats
};