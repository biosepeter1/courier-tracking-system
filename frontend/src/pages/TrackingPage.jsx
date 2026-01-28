import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Mail,
  Phone,
  User,
  Truck,
  Box,
  Navigation,
  Info,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react'
import ShipmentMap from '../components/ShipmentMap'
import { shipmentAPI } from '../lib/api'
import { Button } from '../components/ui/button'
import { formatDateTime, calculateProgress } from '../lib/utils'

const TrackingPage = () => {
  const { trackingNumber } = useParams()
  const [shipment, setShipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false)

  useEffect(() => {
    if (trackingNumber) {
      fetchShipment()
    }
  }, [trackingNumber])

  const fetchShipment = async () => {
    try {
      setLoading(true)
      const response = await shipmentAPI.getByTrackingNumber(trackingNumber)
      if (response.data.success) {
        setShipment(response.data.data.shipment)
      } else {
        setError('Shipment not found')
      }
    } catch (err) {
      setError('Failed to load tracking information')
      console.error('Fetch shipment error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status, isCompleted = false) => {
    const iconProps = { className: `h-5 w-5 ${isCompleted ? 'text-white' : 'text-gray-400'}` }

    switch (status) {
      case 'Pending': return <Clock {...iconProps} />
      case 'Processing': return <AlertCircle {...iconProps} />
      case 'Delivered': return <CheckCircle {...iconProps} />
      case 'Cancelled': return <AlertCircle {...iconProps} className="h-5 w-5 text-red-500" />
      default: return <Package {...iconProps} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Confirmed': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
      case 'Picked Up': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'In Transit': return 'bg-violet-500/20 text-violet-400 border-violet-500/30'
      case 'Out for Delivery': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'Delivered': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'Cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-b-2 border-l-2 border-purple-500 rounded-full animate-spin-reverse"></div>
            </div>
            <Package className="h-10 w-10 text-white/50 animate-pulse mx-auto translate-y-5" />
          </div>
          <p className="text-gray-400 font-medium tracking-wider">LOCATING PACKAGE...</p>
        </div>
      </div>
    )
  }

  if (error || !shipment) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md relative z-10"
        >
          <div className="bg-red-500/10 border border-red-500/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Tracking Not Found</h1>
          <p className="text-gray-400 mb-8 text-lg">{error || 'No shipment found with this tracking number'}</p>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild className="border-white/10 hover:bg-white/5 text-white hover:text-white">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return Home
              </Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white border-0">
              <Link to="/track">Try Again</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const progress = calculateProgress(shipment.status)
  const statusSteps = [
    { name: 'Pending', icon: Clock },
    { name: 'Processing', icon: AlertCircle },
    { name: 'Confirmed', icon: CheckCircle },
    { name: 'Picked Up', icon: Box },
    { name: 'In Transit', icon: Truck },
    { name: 'Out for Delivery', icon: Navigation },
    { name: 'Delivered', icon: CheckCircle }
  ]

  const getCurrentStepIndex = (status) => {
    const statusMap = {
      'Pending': 0, 'Processing': 1, 'Confirmed': 2, 'Picked Up': 3,
      'In Transit': 4, 'Out for Delivery': 5, 'Delivered': 6,
      'Cancelled': -1, 'On Hold': -1
    }
    return statusMap[status] ?? 0
  }

  const currentStepIndex = getCurrentStepIndex(shipment.status)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                <Box className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
                Courier<span className="text-blue-500">Track</span>
              </span>
            </Link>

            <Link
              to="/"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5"
            >
              <Search className="w-4 h-4" />
              <span>Track Another</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Status & Map */}
          <div className="lg:col-span-2 space-y-8">

            {/* Main Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl"
            >
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/0 blur-3xl rounded-full pointer-events-none" />

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getStatusColor(shipment.status)} mb-4`}>
                    {getStatusIcon(shipment.status)}
                    <span className="ml-2 font-semibold text-sm tracking-wide uppercase">{shipment.status}</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-mono">
                    {shipment.trackingNumber}
                  </h1>
                  <div className="flex items-center gap-3 mt-4 text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-gray-300">{shipment.origin}</span>
                    </div>
                    <span className="text-gray-600">→</span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      <span className="font-medium text-gray-300">{shipment.destination}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left md:text-right bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Created On</p>
                    <p className="text-white font-medium">{formatDateTime(shipment.createdAt)}</p>
                  </div>
                  {shipment.estimatedDelivery && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Est. Delivery</p>
                      <p className="text-blue-400 font-medium">{formatDateTime(shipment.estimatedDelivery)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Stepper used only if not cancelled */}
              {shipment.status !== 'Cancelled' && (
                <div className="mt-12 mb-4">
                  <div className="relative flex items-center justify-between w-full">
                    {/* Background Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full" />

                    {/* Active Line */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 -translate-y-1/2 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    />

                    {/* Steps */}
                    {statusSteps.map((step, index) => {
                      const Icon = step.icon
                      const isCompleted = index <= currentStepIndex
                      const isCurrent = index === currentStepIndex

                      return (
                        <div key={step.name} className="relative z-10 group">
                          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                            ? 'bg-[#0a0a0a] border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                            : 'bg-[#0a0a0a] border-2 border-white/10'
                            }`}>
                            <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isCompleted ? 'text-blue-400' : 'text-gray-600'}`} />
                          </div>

                          {/* Tooltip for step name on mobile, visible text on desktop */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap">
                            <span className={`block text-xs font-bold tracking-wide transition-colors duration-300 ${isCompleted ? 'text-white' : 'text-gray-600'
                              }`}>
                              {step.name}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Map Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  Live Location
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-green-400 tracking-wide uppercase">Live Tracking</span>
                </div>
              </div>
              <div className="h-[700px] w-full relative">
                <ShipmentMap shipment={shipment} />
                {/* Map overlay gradient to blend with dark theme */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(10,10,10,0.5)]" />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Details & History */}
          <div className="space-y-8">

            {/* Details Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-500" />
                Shipment Details
              </h3>

              <div className="space-y-6">
                {/* Sender */}
                <div className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Sender</p>
                  </div>
                  <p className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{shipment.sender.name}</p>
                  {shipment.sender.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                      <Phone className="w-3 h-3" /> {shipment.sender.phone}
                    </div>
                  )}
                  {shipment.sender.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Mail className="w-3 h-3" /> {shipment.sender.email}
                    </div>
                  )}
                </div>

                {/* Receiver */}
                <div className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-purple-400" />
                    </div>
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Receiver</p>
                  </div>
                  <p className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{shipment.receiver.name}</p>
                  {shipment.receiver.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                      <Phone className="w-3 h-3" /> {shipment.receiver.phone}
                    </div>
                  )}
                  {shipment.receiver.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Mail className="w-3 h-3" /> {shipment.receiver.email}
                    </div>
                  )}
                </div>

                {/* Package Info */}
                {shipment.packageDetails && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Box className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Package Info</p>
                    </div>

                    <div className="space-y-3">
                      {shipment.packageDetails.weight && (
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-sm text-gray-400">Weight</span>
                          <span className="text-white font-medium">{shipment.packageDetails.weight} kg</span>
                        </div>
                      )}

                      {shipment.packageDetails.description && (
                        <div className="pt-2">
                          <span className="text-sm text-gray-400 block mb-1">Description</span>
                          <p className="text-white text-sm leading-relaxed opacity-90">{shipment.packageDetails.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* History Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                History
              </h3>

              <div className="relative pl-4 border-l-2 border-white/10 space-y-8">
                {shipment.history && shipment.history.length > 0 ? (
                  shipment.history
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .slice(0, isTimelineExpanded ? shipment.history.length : 3)
                    .map((item, index) => {
                      const isLatest = index === 0;
                      return (
                        <div key={item._id} className="relative">
                          {/* Dot */}
                          <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 ${isLatest ? 'bg-blue-500 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-[#0a0a0a] border-gray-600'
                            }`} />

                          <div>
                            <span className={`text-sm font-bold ${isLatest ? 'text-blue-400' : 'text-white'}`}>
                              {item.status}
                            </span>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatDateTime(item.updatedAt)}
                            </p>

                            <div className="mt-2 text-sm text-gray-400">
                              <p className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-gray-500" />
                                {item.location}
                              </p>
                              {item.note && (
                                <p className="mt-1 pl-4 border-l border-white/10 italic opacity-80">
                                  "{item.note}"
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                ) : (
                  <p className="text-gray-500 italic">No history available.</p>
                )}
              </div>

              {shipment.history.length > 3 && (
                <button
                  onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
                  className="w-full mt-6 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
                >
                  {isTimelineExpanded ? (
                    <>Show Less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Show Complete History <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  )
}

export default TrackingPage