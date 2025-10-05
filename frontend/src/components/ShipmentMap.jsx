import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet'
import { Package, MapPin, Flag, Navigation, Plane, Clock, TrendingUp, MapPinned, Route, Target } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { geocodeLocation, getDefaultCoordinates, calculateDistance } from '../lib/geocoding'
import { formatDateTime } from '../lib/utils'

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom marker icons
const createCustomIcon = (color, emoji) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          font-size: 20px;
        ">${emoji}</div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  })
}

const originIcon = createCustomIcon('linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '📦')
const destinationIcon = createCustomIcon('linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', '🏁')

// Create airplane icon for current location
const createAirplaneIcon = () => {
  return L.divIcon({
    className: 'custom-airplane-marker',
    html: `
      <div style="
        position: relative;
        width: 50px;
        height: 50px;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          border-radius: 50%;
          box-shadow: 0 8px 20px rgba(245, 87, 108, 0.5);
          animation: pulse 2s ease-in-out infinite;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 28px;
          z-index: 10;
        ">✈️</div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.4; }
        }
      </style>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -25]
  })
}

const airplaneIcon = createAirplaneIcon()

// Component to fit map bounds to show all markers
const MapBounds = ({ positions }) => {
  const map = useMap()

  useEffect(() => {
    if (positions && positions.length > 0) {
      const validPositions = positions.filter(pos => pos && pos.lat && pos.lon)
      if (validPositions.length > 0) {
        const bounds = L.latLngBounds(validPositions.map(pos => [pos.lat, pos.lon]))
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 })
      }
    }
  }, [positions, map])

  return null
}

// Animated Movement Trail Component
const AnimatedTrail = ({ history }) => {
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    // Animate the trail drawing
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0 // Loop animation
        return prev + 0.5
      })
    }, 50)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [history])

  if (!history || history.length < 2) return null

  const visibleSegments = Math.floor((history.length - 1) * (progress / 100))
  const displayPath = history.slice(0, visibleSegments + 1)

  return (
    <>
      {displayPath.length > 1 && (
        <>
          {/* Shadow/glow effect for the trail */}
          <Polyline
            positions={displayPath}
            color="#f5576c"
            weight={8}
            opacity={0.3}
          />
          {/* Main animated trail */}
          <Polyline
            positions={displayPath}
            color="#f093fb"
            weight={5}
            opacity={0.9}
            dashArray="10, 10"
            className="animate-pulse"
          />
        </>
      )}
    </>
  )
}

const ShipmentMap = ({ shipment }) => {
  const [coordinates, setCoordinates] = useState({
    origin: null,
    current: null,
    destination: null
  })
  const [historyCoordinates, setHistoryCoordinates] = useState([])
  const [loading, setLoading] = useState(true)
  const [distance, setDistance] = useState(null)

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        setLoading(true)

        // Geocode all locations
        const originCoords = await geocodeLocation(shipment.origin) || getDefaultCoordinates(shipment.origin)
        const destCoords = await geocodeLocation(shipment.destination) || getDefaultCoordinates(shipment.destination)
        const currentCoords = shipment.currentLocation
          ? await geocodeLocation(shipment.currentLocation) || getDefaultCoordinates(shipment.currentLocation)
          : null

        setCoordinates({
          origin: originCoords,
          current: currentCoords,
          destination: destCoords
        })

        // Geocode tracking history locations
        if (shipment.history && shipment.history.length > 0) {
          const historyCoords = []
          
          // Always start with origin
          historyCoords.push([originCoords.lat, originCoords.lon])
          
          // Add history locations
          for (const item of shipment.history) {
            if (item.location) {
              const coords = await geocodeLocation(item.location) || getDefaultCoordinates(item.location)
              if (coords) {
                historyCoords.push([coords.lat, coords.lon])
              }
            }
          }
          
          // Add destination at the end
          historyCoords.push([destCoords.lat, destCoords.lon])
          
          setHistoryCoordinates(historyCoords)
        } else {
          // If no history, just draw line from origin to destination
          setHistoryCoordinates([
            [originCoords.lat, originCoords.lon],
            currentCoords ? [currentCoords.lat, currentCoords.lon] : [destCoords.lat, destCoords.lon],
            [destCoords.lat, destCoords.lon]
          ])
        }

        // Calculate distance between origin and destination
        if (originCoords && destCoords) {
          const dist = calculateDistance(
            originCoords.lat,
            originCoords.lon,
            destCoords.lat,
            destCoords.lon
          )
          setDistance(dist.toFixed(0))
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error)
      } finally {
        setLoading(false)
      }
    }

    if (shipment) {
      fetchCoordinates()
    }
  }, [shipment])

  if (loading) {
    return (
      <div className="relative bg-gradient-to-br from-blue-100 via-purple-50 to-pink-50 h-96 rounded-xl flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-white rounded-full p-6 shadow-2xl">
              <MapPin className="h-12 w-12 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-gray-700 font-semibold">Loading map...</p>
        </div>
      </div>
    )
  }

  if (!coordinates.origin && !coordinates.destination) {
    return (
      <div className="relative bg-gradient-to-br from-blue-100 via-purple-50 to-pink-50 h-96 rounded-xl flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Unable to load map coordinates</p>
        </div>
      </div>
    )
  }

  // Prepare positions for map bounds
  const positions = [
    coordinates.origin,
    coordinates.current,
    coordinates.destination
  ].filter(Boolean)

  // Calculate route line positions - always show full planned route
  const routePositions = []
  if (coordinates.origin && coordinates.destination) {
    routePositions.push([coordinates.origin.lat, coordinates.origin.lon])
    routePositions.push([coordinates.destination.lat, coordinates.destination.lon])
  }

  // Default center (first valid position)
  const center = coordinates.current || coordinates.origin || coordinates.destination
  const mapCenter = [center.lat, center.lon]
  
  // Debug logging
  console.log('Map Debug:', {
    origin: coordinates.origin,
    current: coordinates.current,
    destination: coordinates.destination,
    routePositions,
    historyCoordinates,
    mapCenter
  })

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!coordinates.origin || !coordinates.destination) return 0
    if (!coordinates.current) return 0
    
    const totalDistance = calculateDistance(
      coordinates.origin.lat,
      coordinates.origin.lon,
      coordinates.destination.lat,
      coordinates.destination.lon
    )
    
    const coveredDistance = calculateDistance(
      coordinates.origin.lat,
      coordinates.origin.lon,
      coordinates.current.lat,
      coordinates.current.lon
    )
    
    return Math.min(100, Math.round((coveredDistance / totalDistance) * 100))
  }
  
  const progress = calculateProgress()
  const remainingDistance = coordinates.current && coordinates.destination 
    ? calculateDistance(
        coordinates.current.lat,
        coordinates.current.lon,
        coordinates.destination.lat,
        coordinates.destination.lon
      ).toFixed(0)
    : null

  return (
    <div className="space-y-4">
      {/* Enhanced Info Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {/* Journey Progress Card */}
        {coordinates.current && (
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-xl p-3 md:p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs font-bold text-white/80 uppercase tracking-wide">Progress</div>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-white mb-1">{progress}%</div>
            <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-700 shadow-md"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-white/90 mt-2 font-medium">Journey completed</p>
          </div>
        )}
        
        {/* Total Distance Card */}
        {distance && (
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg md:rounded-xl p-3 md:p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Route className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs font-bold text-white/80 uppercase tracking-wide">Total</div>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-white mb-1">{distance}</div>
            <p className="text-xs text-white/90 font-medium">Kilometers</p>
          </div>
        )}
        
        {/* Remaining Distance Card */}
        {remainingDistance && coordinates.current && (
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg md:rounded-xl p-3 md:p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs font-bold text-white/80 uppercase tracking-wide">Remaining</div>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-white mb-1">{remainingDistance}</div>
            <p className="text-xs text-white/90 font-medium">Kilometers to go</p>
          </div>
        )}
        
        {/* Current Status Card */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg md:rounded-xl p-3 md:p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
          <div className="flex items-center justify-between mb-2">
            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
          </div>
          <div className="text-base md:text-lg font-extrabold text-white mb-1 line-clamp-1">{shipment.status}</div>
          <p className="text-xs text-white/90 font-medium">Current status</p>
        </div>
      </div>

      {/* Map Container with Enhanced Details */}
      <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white">
        <MapContainer
          center={mapCenter}
          zoom={6}
          className="h-[300px] md:h-[400px] lg:h-[500px] w-full"
          style={{ zIndex: 0 }}
          zoomControl={true}
          scrollWheelZoom={true}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fit bounds to show all markers */}
        <MapBounds positions={positions} />

        {/* Static planned route (visible dashed line) */}
        {routePositions.length > 1 && (
          <>
            {/* Background line for better visibility */}
            <Polyline
              positions={routePositions}
              color="#ffffff"
              weight={8}
              opacity={0.8}
            />
            {/* Foreground dashed line */}
            <Polyline
              positions={routePositions}
              color="#3b82f6"
              weight={5}
              opacity={0.9}
              dashArray="20, 12"
            />
          </>
        )}

        {/* Animated Movement History Trail */}
        <AnimatedTrail history={historyCoordinates} />

        {/* History markers (footprints) */}
        {shipment.history && shipment.history.map((item, index) => {
          const histCoord = historyCoordinates[index + 1] // +1 because origin is first
          if (!histCoord) return null
          
          return (
            <Circle
              key={`history-${index}`}
              center={histCoord}
              radius={800}
              fillColor="#f093fb"
              fillOpacity={0.3}
              color="#f5576c"
              weight={2}
              opacity={0.6}
            />
          )
        })}

        {/* Origin marker - Enhanced visibility */}
        {coordinates.origin && (
          <>
            <Marker position={[coordinates.origin.lat, coordinates.origin.lon]} icon={originIcon}>
              <Popup>
                <div className="text-center p-2">
                  <div className="font-bold text-lg text-purple-700 mb-1">📦 Origin</div>
                  <div className="text-sm font-semibold text-gray-800">{shipment.origin}</div>
                </div>
              </Popup>
            </Marker>
            {/* Origin area circle */}
            <Circle
              center={[coordinates.origin.lat, coordinates.origin.lon]}
              radius={5000}
              fillColor="#667eea"
              fillOpacity={0.15}
              color="#667eea"
              weight={2}
              opacity={0.6}
            />
          </>
        )}

        {/* Current location marker with airplane icon */}
        {coordinates.current && (
          <>
            <Marker position={[coordinates.current.lat, coordinates.current.lon]} icon={airplaneIcon}>
              <Popup>
                <div className="text-center p-3">
                  <div className="font-bold text-xl text-pink-700 mb-2 flex items-center justify-center gap-2">
                    <Plane className="h-5 w-5" />
                    Current Location
                  </div>
                  <div className="text-sm font-semibold text-gray-800">{shipment.currentLocation}</div>
                  <div className="mt-2 px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full">
                    Status: {shipment.status}
                  </div>
                </div>
              </Popup>
            </Marker>
            {/* Pulsing radar effect around airplane */}
            <Circle
              center={[coordinates.current.lat, coordinates.current.lon]}
              radius={5000}
              fillColor="#f5576c"
              fillOpacity={0.1}
              stroke={true}
              color="#f5576c"
              weight={2}
              opacity={0.5}
              className="animate-pulse"
            />
            <Circle
              center={[coordinates.current.lat, coordinates.current.lon]}
              radius={8000}
              fillColor="transparent"
              stroke={true}
              color="#f093fb"
              weight={2}
              opacity={0.3}
              dashArray="10, 10"
              className="animate-pulse"
            />
          </>
        )}

        {/* Destination marker - Always visible */}
        {coordinates.destination && (
          <>
            <Marker position={[coordinates.destination.lat, coordinates.destination.lon]} icon={destinationIcon}>
              <Popup>
                <div className="text-center p-2">
                  <div className="font-bold text-lg text-blue-700 mb-1">🏁 Destination</div>
                  <div className="text-sm font-semibold text-gray-800">{shipment.destination}</div>
                </div>
              </Popup>
            </Marker>
            {/* Destination area circle */}
            <Circle
              center={[coordinates.destination.lat, coordinates.destination.lon]}
              radius={5000}
              fillColor="#4facfe"
              fillOpacity={0.15}
              color="#4facfe"
              weight={2}
              opacity={0.6}
            />
          </>
        )}
        </MapContainer>

        {/* Enhanced Current Location Info Overlay */}
        {coordinates.current && (
          <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/95 backdrop-blur-md rounded-lg md:rounded-xl shadow-2xl p-3 md:p-4 border-2 border-primary/30 max-w-[200px] md:max-w-xs" style={{ zIndex: 1000 }}>
            <div className="flex items-center gap-3 mb-3 pb-3 border-b-2 border-gray-100">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-red-600 flex items-center justify-center shadow-lg animate-pulse">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">Package Location</div>
                <div className="text-sm font-extrabold text-gray-900">Live Tracking</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-3">
                <MapPinned className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-0.5">Current</div>
                  <div className="text-sm font-extrabold text-gray-900 leading-tight">{shipment.currentLocation}</div>
                </div>
              </div>
              
              {shipment.history && shipment.history.length > 0 && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-900">
                      {formatDateTime(shipment.history[0].updatedAt)}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-xs font-semibold text-gray-600">Status</span>
                <span className="text-xs font-bold px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full">
                  {shipment.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Route Information Panel */}
        <div className="hidden md:block absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-4 border-2 border-primary/30 max-w-sm" style={{ zIndex: 1000 }}>
          <div className="flex items-center gap-2 mb-3 pb-3 border-b-2 border-gray-100">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md">
              <Route className="h-5 w-5 text-white" />
            </div>
            <div className="text-sm font-extrabold text-gray-900">Route Information</div>
          </div>
          
          <div className="space-y-3">
            {/* Origin */}
            <div className="flex items-start gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-sm">📦</span>
              </div>
              <div className="flex-1">
                <div className="text-xs text-purple-600 font-bold uppercase tracking-wide">Origin</div>
                <div className="text-sm font-extrabold text-gray-900 leading-tight">{shipment.origin}</div>
              </div>
            </div>
            
            {/* Divider with arrow */}
            <div className="flex items-center pl-4">
              <div className="flex-1 border-l-2 border-dashed border-gray-300 h-6 relative">
                <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
              </div>
            </div>
            
            {/* Destination */}
            <div className="flex items-start gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-sm">🏁</span>
              </div>
              <div className="flex-1">
                <div className="text-xs text-blue-600 font-bold uppercase tracking-wide">Destination</div>
                <div className="text-sm font-extrabold text-gray-900 leading-tight">{shipment.destination}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Legend */}
        <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 bg-white/95 backdrop-blur-md rounded-lg md:rounded-xl shadow-2xl p-2 md:p-4 border-2 border-primary/30" style={{ zIndex: 1000 }}>
          <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 md:mb-3">Map Legend</div>
          <div className="space-y-1.5 md:space-y-2.5 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 shadow-md"></div>
              <span className="font-semibold text-gray-800">Origin Point</span>
            </div>
            {coordinates.current && (
              <div className="flex items-center gap-2">
                <div className="text-lg leading-none">✈️</div>
                <span className="font-semibold text-gray-800">Live Position</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-pink-400 opacity-60 shadow-sm"></div>
              <span className="font-semibold text-gray-800">Movement Trail</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-md"></div>
              <span className="font-semibold text-gray-800">Destination</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-1">
                <div className="absolute inset-0 bg-white rounded"></div>
                <div className="absolute inset-0 bg-blue-500 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #3b82f6 0, #3b82f6 10px, transparent 10px, transparent 16px)' }}></div>
              </div>
              <span className="font-semibold text-gray-800 text-xs">Planned Route</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShipmentMap
