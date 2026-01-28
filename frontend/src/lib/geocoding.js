// Simple geocoding utility using Nominatim (OpenStreetMap)
// This is free and doesn't require an API key

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search'

// Cache to store geocoded locations
const geocodeCache = new Map()

/**
 * Geocode a location string to coordinates
 * @param {string} location - Location name (e.g., "New York, USA")
 * @returns {Promise<{lat: number, lon: number} | null>}
 */
export const geocodeLocation = async (location) => {
  if (!location) return null
  const cacheKey = `geo_cache_${location.toLowerCase()}`

  // 1. Check Memory Cache
  if (geocodeCache.has(location)) {
    return geocodeCache.get(location)
  }

  // 2. Check LocalStorage
  try {
    const stored = localStorage.getItem(cacheKey)
    if (stored) {
      const parsed = JSON.parse(stored)
      geocodeCache.set(location, parsed) // Sync to memory
      return parsed
    }
  } catch (e) {
    console.warn('LocalStorage error:', e)
  }

  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}?q=${encodeURIComponent(location)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'CourierTrackingSystem/1.0'
        }
      }
    )

    if (!response.ok) {
      console.error('Geocoding failed:', response.statusText)
      return null
    }

    const data = await response.json()

    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      }

      // Cache the result (Memory + LocalStorage)
      geocodeCache.set(location, result)
      try {
        localStorage.setItem(cacheKey, JSON.stringify(result))
      } catch (e) {
        // Ignore quota errors
      }

      return result
    }

    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

/**
 * Geocode multiple locations at once
 * @param {string[]} locations - Array of location names
 * @returns {Promise<Object>} - Object with location names as keys and coordinates as values
 */
export const geocodeMultipleLocations = async (locations) => {
  const results = {}

  for (const location of locations) {
    if (location) {
      // Add small delay between requests to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000))
      results[location] = await geocodeLocation(location)
    }
  }

  return results
}

/**
 * Get default coordinates for common cities (fallback)
 */
export const getDefaultCoordinates = (location) => {
  const defaults = {
    'New York': { lat: 40.7128, lon: -74.0060 },
    'Los Angeles': { lat: 34.0522, lon: -118.2437 },
    'Chicago': { lat: 41.8781, lon: -87.6298 },
    'Houston': { lat: 29.7604, lon: -95.3698 },
    'London': { lat: 51.5074, lon: -0.1278 },
    'Paris': { lat: 48.8566, lon: 2.3522 },
    'Tokyo': { lat: 35.6762, lon: 139.6503 },
    'Sydney': { lat: -33.8688, lon: 151.2093 },
    'Dubai': { lat: 25.2048, lon: 55.2708 },
    'Singapore': { lat: 1.3521, lon: 103.8198 }
  }

  // Try to find a match (case-insensitive, partial match)
  const locationLower = location.toLowerCase()
  for (const [city, coords] of Object.entries(defaults)) {
    if (locationLower.includes(city.toLowerCase())) {
      return coords
    }
  }

  // Default to center of USA
  return { lat: 39.8283, lon: -98.5795 }
}

/**
 * Calculate distance between two coordinates (in km)
 * Using Haversine formula
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
