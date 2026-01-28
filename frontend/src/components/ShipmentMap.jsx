import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet'
import { Package, MapPin, Plane, Clock, TrendingUp, Route, Target, MapPinned } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { geocodeLocation, getDefaultCoordinates, calculateDistance } from '../lib/geocoding'
import { formatDateTime } from '../lib/utils'

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// === Custom Marker Icons for Dark Theme ===

const createCustomIcon = (color, emoji, ringColor) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative; width: 44px; height: 44px;">
        <div style="
          position: absolute;
          inset: 0;
          background: ${color};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid #1a1a1a;
          box-shadow: 0 0 15px ${ringColor};
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        ">
          <div style="transform: rotate(45deg); font-size: 20px;">${emoji}</div>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44]
  })
}

const originIcon = createCustomIcon('linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', '📦', 'rgba(59, 130, 246, 0.6)')
const destinationIcon = createCustomIcon('linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', '🏁', 'rgba(168, 85, 247, 0.6)')

const createAirplaneIcon = () => {
  return L.divIcon({
    className: 'custom-airplane-marker',
    html: `
      <div style="position: relative; width: 60px; height: 60px;">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border-radius: 50%;
          border: 3px solid #1a1a1a;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        ">
           <span style="font-size: 24px; transform: rotate(-45deg);">✈️</span>
        </div>
        <!-- Pulsing Effect -->
        <div style="
           position: absolute; top: 0; left: 0; width: 100%; height: 100%;
           border-radius: 50%; background: rgba(239, 68, 68, 0.3);
           animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <style>
          @keyframes ping {
            75%, 100% { transform: scale(2); opacity: 0; }
          }
        </style>
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    popupAnchor: [0, -30]
  })
}

const airplaneIcon = createAirplaneIcon()

// Component to fit map bounds
const MapBounds = ({ positions }) => {
  const map = useMap()
  useEffect(() => {
    if (positions && positions.length > 0) {
      const validPositions = positions.filter(pos => pos && pos.lat && pos.lon)
      if (validPositions.length > 0) {
        const bounds = L.latLngBounds(validPositions.map(pos => [pos.lat, pos.lon]))
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12, animate: true })
      }
    }
  }, [positions, map])
  return null
}

// Animated Trail Component
const MovingPlane = ({ routePositions }) => {
  const [position, setPosition] = useState(null)
  const [bearing, setBearing] = useState(0)
  const requestRef = useRef()
  const previousTimeRef = useRef()
  const progressRef = useRef(0)

  // Calculate total distance for speed normalization
  const totalDistance = useRef(0)

  // Calculate segments and total distance once
  useEffect(() => {
    if (!routePositions || routePositions.length < 2) return

    let dist = 0
    for (let i = 0; i < routePositions.length - 1; i++) {
      dist += calculateDistance(
        routePositions[i][0], routePositions[i][1],
        routePositions[i + 1][0], routePositions[i + 1][1]
      )
    }
    totalDistance.current = dist
  }, [routePositions])

  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current

      // Speed: Full route in approx 10 seconds (adjust divider to change speed)
      // Faster if distance is short, slower if long? No, constant visual speed is better usually.
      // Let's go with a fixed cycling time of 12 seconds for the "looking alive" effect
      const speed = 1 / (12000)

      progressRef.current = (progressRef.current + speed * deltaTime) % 1

      if (routePositions && routePositions.length >= 2) {
        // Find current segment
        const totalSegments = routePositions.length - 1
        const scaledProgress = progressRef.current * totalSegments
        const segmentIndex = Math.floor(scaledProgress)
        const segmentProgress = scaledProgress - segmentIndex

        if (segmentIndex < totalSegments) {
          const start = routePositions[segmentIndex]
          const end = routePositions[segmentIndex + 1]

          // Interpolate Lat/Lon
          const lat = start[0] + (end[0] - start[0]) * segmentProgress
          const lon = start[1] + (end[1] - start[1]) * segmentProgress

          setPosition([lat, lon])

          // Calculate Bearing
          const y = Math.sin(end[1] * Math.PI / 180 - start[1] * Math.PI / 180) * Math.cos(end[0] * Math.PI / 180)
          const x = Math.cos(start[0] * Math.PI / 180) * Math.sin(end[0] * Math.PI / 180) -
            Math.sin(start[0] * Math.PI / 180) * Math.cos(end[0] * Math.PI / 180) * Math.cos(end[1] * Math.PI / 180 - start[1] * Math.PI / 180)
          const theta = Math.atan2(y, x)
          const brng = (theta * 180 / Math.PI + 360) % 360
          setBearing(brng)
        }
      }
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [routePositions])

  if (!position) return null

  // Custom icon with dynamic Rotation
  const planeIcon = L.divIcon({
    className: 'moving-plane',
    html: `
      <div style="transform: rotate(${bearing - 45}deg); transition: transform 0.1s linear;">
        <span style="font-size: 32px; filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.8));">✈️</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  })

  return <Marker position={position} icon={planeIcon} zIndexOffset={1000} />
}

const AnimatedTrail = ({ history }) => {
  if (!history || history.length < 2) return null

  return (
    <>
      {/* Static Background Glow */}
      <Polyline positions={history} color="#ef4444" weight={8} opacity={0.2} />
      {/* Moving Dash Animation via CSS */}
      <Polyline
        positions={history}
        pathOptions={{
          color: "#fca5a5",
          weight: 4,
          opacity: 0.8,
          dashArray: '10, 20',
          className: 'animated-dash-flow'
        }}
      />
    </>
  )
}

const ShipmentMap = ({ shipment }) => {
  const [coordinates, setCoordinates] = useState({ origin: null, current: null, destination: null })
  const [historyCoordinates, setHistoryCoordinates] = useState([])
  const [loading, setLoading] = useState(true)
  const [distance, setDistance] = useState(null)

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        setLoading(true)
        const originCoords = await geocodeLocation(shipment.origin) || getDefaultCoordinates(shipment.origin)
        const destCoords = await geocodeLocation(shipment.destination) || getDefaultCoordinates(shipment.destination)
        const currentCoords = shipment.currentLocation
          ? await geocodeLocation(shipment.currentLocation) || getDefaultCoordinates(shipment.currentLocation)
          : null

        setCoordinates({ origin: originCoords, current: currentCoords, destination: destCoords })

        // History Processing
        const historyCoords = []
        if (shipment.history && shipment.history.length > 0) {
          // 1. Always start at Origin
          historyCoords.push([originCoords.lat, originCoords.lon])

          // 2. Sort history by date to ensure correct order
          const sortedHistory = [...shipment.history].sort((a, b) => new Date(a.date || a.updatedAt) - new Date(b.date || b.updatedAt))

          // 3. Add history points
          for (const item of sortedHistory) {
            if (item.location) {
              // Skip if location is same as origin to avoid double dots
              if (item.location === shipment.origin) continue

              const coords = await geocodeLocation(item.location) || getDefaultCoordinates(item.location)
              if (coords) historyCoords.push([coords.lat, coords.lon])
            }
          }
          // REMOVED: historyCoords.push([destCoords.lat, destCoords.lon]) -> Do not force jump to destination

          setHistoryCoordinates(historyCoords)
        } else {
          // If no history, just show Origin -> Current (if exists)
          const fallbackPath = [[originCoords.lat, originCoords.lon]]
          if (currentCoords) fallbackPath.push([currentCoords.lat, currentCoords.lon])
          setHistoryCoordinates(fallbackPath)
        }

        if (originCoords && destCoords) {
          const dist = calculateDistance(originCoords.lat, originCoords.lon, destCoords.lat, destCoords.lon)
          setDistance(dist.toFixed(0))
        }

      } catch (error) {
        console.error('Error fetching coordinates:', error)
      } finally {
        setLoading(false)
      }
    }
    if (shipment) fetchCoordinates()
  }, [shipment])

  if (loading) {
    return (
      <div className="h-96 w-full rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-400 font-medium">Loading Map Data...</p>
        </div>
      </div>
    )
  }

  if (!coordinates.origin && !coordinates.destination) {
    return (
      <div className="h-96 w-full rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center">
        <p className="text-gray-500">Map data unavailable.</p>
      </div>
    )
  }

  // Prepare positions for map bounds (include history)
  const positions = [
    coordinates.origin,
    coordinates.current,
    coordinates.destination,
    ...historyCoordinates.map(coords => ({ lat: coords[0], lon: coords[1] }))
  ].filter(Boolean)

  // Calculate route line positions - Use history path if available (actual route), else direct line
  let routePositions = []
  if (historyCoordinates.length > 0) {
    routePositions = historyCoordinates.map(coords => [coords[0], coords[1]])
  } else if (coordinates.origin && coordinates.destination) {
    routePositions = [
      [coordinates.origin.lat, coordinates.origin.lon],
      [coordinates.destination.lat, coordinates.destination.lon]
    ]
  }

  // Default center (first valid position)
  const center = coordinates.current || coordinates.origin || coordinates.destination
  const mapCenter = center ? [center.lat, center.lon] : [0, 0]

  // Progress Calc
  const calcProgress = () => {
    if (!coordinates.origin || !coordinates.destination || !coordinates.current) return 0

    // If status is Delivered, it's 100%
    if (shipment.status === 'Delivered') return 100

    const total = calculateDistance(coordinates.origin.lat, coordinates.origin.lon, coordinates.destination.lat, coordinates.destination.lon)
    const remaining = calculateDistance(coordinates.current.lat, coordinates.current.lon, coordinates.destination.lat, coordinates.destination.lon)

    // Calculate progress based on how much distance is LEFT.
    // Progress = (Total - Remaining) / Total
    // If we are further away than start (deviation), progress might be 0.
    let percent = Math.round(((total - remaining) / total) * 100)

    // Clamp between 0 and 99 strictly
    return Math.max(0, Math.min(99, percent))
  }

  const progressPercent = calcProgress()
  const remaining = coordinates.current && coordinates.destination
    ? calculateDistance(coordinates.current.lat, coordinates.current.lon, coordinates.destination.lat, coordinates.destination.lon).toFixed(0)
    : null

  // Card Style
  const CardStyle = "relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-lg hover:border-blue-500/30 transition-all group overflow-hidden"

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Progress Card */}
        <div className={CardStyle}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-blue-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Progress</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{progressPercent}%</div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Total Distance Card */}
        <div className={CardStyle}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-purple-400">
              <Route className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Total Dist.</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{distance} <span className="text-sm font-medium text-gray-500">km</span></div>
          </div>
        </div>

        {/* Remaining Distance Card */}
        <div className={CardStyle}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-orange-500/20 transition-all" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-orange-400">
              <Target className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Remaining</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{remaining} <span className="text-sm font-medium text-gray-500">km</span></div>
          </div>
        </div>

        {/* Status Card */}
        <div className={CardStyle}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Package className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Status</span>
            </div>
            <div className="text-lg font-bold text-white truncate">{shipment.status}</div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[500px] md:h-[700px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
        <MapContainer
          center={mapCenter}
          zoom={6}
          className="h-full w-full"
          zoomControl={true}
          scrollWheelZoom={false}
          style={{ backgroundColor: '#0f172a' }} // Dark Slate background ensures no white flash
        >
          {/* Dark Mode Map Layer */}
          {/* CartoDB Dark Matter Tiles - Premium Dark Mode */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />

          <MapBounds positions={positions} />

          {/* Route Line - HIDDEN as per request (only movement visible) */}


          {/* Animated Moving Plane */}
          {routePositions.length > 1 && <MovingPlane routePositions={routePositions} />}

          <AnimatedTrail history={historyCoordinates} />

          {/* Markers */}
          {coordinates.origin && <Marker position={[coordinates.origin.lat, coordinates.origin.lon]} icon={originIcon} />}
          {coordinates.destination && <Marker position={[coordinates.destination.lat, coordinates.destination.lon]} icon={destinationIcon} />}
          {coordinates.current && <Marker position={[coordinates.current.lat, coordinates.current.lon]} icon={airplaneIcon} />}

          {/* Location Circles */}
          {coordinates.current && (
            <Circle
              center={[coordinates.current.lat, coordinates.current.lon]}
              radius={50000}
              pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 1 }}
            />
          )}

          {/* History markers (footprints) with Popups */}
          {shipment.history && shipment.history.map((item, index) => {
            const histCoord = historyCoordinates[index + 1] // +1 because origin is first
            if (!histCoord) return null

            return (
              <Circle
                key={`history-${index}`}
                center={histCoord}
                radius={3000}
                fillColor="#f093fb"
                fillOpacity={0.6}
                color="#f5576c"
                weight={2}
                opacity={0.8}
              >
                <Popup className="glass-popup">
                  <div className="text-center p-2">
                    <span className="text-xs font-bold uppercase text-purple-600 mb-1 block">{item.status}</span>
                    <p className="text-sm font-bold text-gray-800">{item.location}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDateTime(item.updatedAt)}</p>
                  </div>
                </Popup>
              </Circle>
            )
          })}

        </MapContainer>

        {/* CSS for Dark Map Tiles & Glass Popup */}
        <style>{`
          .glass-popup .leaflet-popup-content-wrapper {
            background: rgba(15, 23, 42, 0.95) !important;
            backdrop-filter: blur(12px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
            color: #fff;
          }
          .glass-popup .leaflet-popup-tip {
            background: rgba(15, 23, 42, 0.95) !important;
          }
          .glass-popup .leaflet-popup-close-button {
            color: rgba(255,255,255,0.5) !important;
          }
          .glass-popup .leaflet-popup-close-button:hover {
            color: #fff !important;
          }
          
          /* Flowing Dash Animation */
          @keyframes dash-flow {
            to {
              stroke-dashoffset: -30;
            }
          }
          .animated-dash-flow {
            animation: dash-flow 1s linear infinite;
          }
        `}</style>

        {/* Floating Glass Overlays - Visible on all screens */}

        {/* Route Info Overlay */}
        <div className="absolute top-4 left-4 right-4 md:right-auto md:left-4 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl z-[400] md:max-w-[240px]">
          <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
            <Route className="w-4 h-4 text-blue-500" /> Journey Path
          </h4>
          <div className="relative space-y-6">
            {/* Vertical Line */}
            <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 opacity-50" />

            <div className="relative flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center shrink-0 z-10">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              <div>
                <p className="text-xs text-blue-400 font-bold uppercase">Origin</p>
                <p className="text-white font-medium text-sm">{shipment.origin}</p>
              </div>
            </div>

            <div className="relative flex gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center shrink-0 z-10">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
              </div>
              <div>
                <p className="text-xs text-purple-400 font-bold uppercase">Destination</p>
                <p className="text-white font-medium text-sm">{shipment.destination}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Status Overlay */}
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl z-[400] md:min-w-[200px]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
              <Plane className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-red-400 font-bold uppercase tracking-wider">Live Tracking</p>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-white font-bold text-sm">Active</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-2 mb-2">
            <p className="text-xs text-gray-500 uppercase font-bold mb-0.5">Current Location</p>
            <p className="text-white font-medium text-sm truncate">{shipment.currentLocation}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            Last update: Now
          </div>
        </div>

        {/* Legend - Visible on all screens */}
        <div className="absolute bottom-4 left-4 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl z-[400] hidden sm:block">
          <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Legend</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-xs text-gray-400">Origin</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-xs text-gray-400">Destination</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-xs text-gray-400">Current</span></div>
          </div>
        </div>

      </div>
    </div >
  )
}

export default ShipmentMap
