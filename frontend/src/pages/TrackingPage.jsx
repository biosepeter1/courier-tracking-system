import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
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
  Calendar,
  Truck,
  Box,
  Navigation,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import ShipmentMap from '../components/ShipmentMap'
import { shipmentAPI } from '../lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Alert, AlertDescription } from '../components/ui/alert'
import { getStatusColor, formatDateTime, calculateProgress } from '../lib/utils'

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
    if (isCompleted) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    }
    
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'Cancelled':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Package className="h-5 w-5 text-blue-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-primary/30 rounded-full animate-ping"></div>
            </div>
            <Package className="h-12 w-12 animate-bounce mx-auto mb-4 text-primary relative z-10" />
          </div>
          <p className="text-gray-600 font-medium mt-6">Loading tracking information...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait while we fetch your package details</p>
        </div>
      </div>
    )
  }

  if (error || !shipment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Tracking Not Found</h1>
          <p className="text-gray-600 mb-2">{error || 'No shipment found with this tracking number'}</p>
          <p className="text-sm text-gray-500 mb-6">Please check your tracking number and try again</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild>
              <Link to="/track">
                Try Again
              </Link>
            </Button>
          </div>
        </div>
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
      'Pending': 0,
      'Processing': 1,
      'Confirmed': 2,
      'Picked Up': 3,
      'In Transit': 4,
      'Out for Delivery': 5,
      'Delivered': 6,
      'Cancelled': -1,
      'On Hold': -1
    }
    return statusMap[status] ?? 0
  }

  const currentStepIndex = getCurrentStepIndex(shipment.status)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Track Package
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">Tracking: {trackingNumber}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hidden sm:inline">CourierTrack</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Hero Status Card */}
        <div className="mb-4 md:mb-6 lg:mb-8">
          <Card className="border-none shadow-xl bg-gradient-to-br from-primary/5 via-white to-purple-50 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full -ml-24 -mb-24"></div>
            <CardContent className="pt-6 pb-8 relative">
              {/* Status Badge and Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-md ${getStatusColor(shipment.status)}`}>
                      {getStatusIcon(shipment.status)}
                      <span className="ml-2">{shipment.status}</span>
                    </div>
                    {shipment.status === 'Delivered' && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {shipment.trackingNumber}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <p className="text-sm">
                      <span className="font-medium">{shipment.origin}</span>
                      <span className="mx-2">→</span>
                      <span className="font-medium">{shipment.destination}</span>
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Created On</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDateTime(shipment.createdAt)}</p>
                  {shipment.estimatedDelivery && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Est. Delivery</p>
                      <p className="text-sm font-semibold text-primary">{formatDateTime(shipment.estimatedDelivery)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Visual Progress Stepper */}
              {shipment.status !== 'Cancelled' && (
                <div className="mt-8">
                  <div className="flex items-center justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-0">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-700 ease-out"
                        style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                      ></div>
                    </div>
                    
                    {/* Step Indicators */}
                    {statusSteps.map((step, index) => {
                      const Icon = step.icon
                      const isCompleted = index <= currentStepIndex
                      const isCurrent = index === currentStepIndex
                      
                      return (
                        <div key={step.name} className="flex flex-col items-center relative z-10 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-gradient-to-br from-primary to-purple-600 shadow-lg scale-110' 
                              : 'bg-white border-2 border-gray-300'
                          } ${isCurrent ? 'ring-4 ring-primary/20 animate-pulse' : ''}`}>
                            <Icon className={`h-5 w-5 ${
                              isCompleted ? 'text-white' : 'text-gray-400'
                            }`} />
                          </div>
                          <p className={`text-xs mt-2 font-medium text-center hidden sm:block ${
                            isCompleted ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.name}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Progress Percentage */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                <span className="text-sm font-bold text-primary">{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary via-purple-500 to-purple-600 h-2 rounded-full transition-all duration-700 ease-out shadow-md" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Current Location Card - Hidden on mobile for better map visibility */}
          {shipment.currentLocation && (
            <div className="hidden md:block lg:col-span-3 animate-fadeIn mb-4 md:mb-0">
              <Card className="relative overflow-hidden border-2 border-primary/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5 group-hover:from-primary/10 group-hover:via-purple-500/10 group-hover:to-blue-500/10 transition-all duration-500"></div>
                
                {/* Animated pulse ring */}
                <div className="absolute top-4 left-4 h-14 w-14 rounded-full bg-primary/20 animate-ping"></div>
                
                <CardContent className="pt-6 pb-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Navigation className="h-7 w-7 text-white animate-pulse" />
                      </div>
                      <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1">Current Location</p>
                      <p className="text-2xl font-extrabold text-gray-900 group-hover:text-primary transition-colors duration-300">{shipment.currentLocation}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-gray-700">Live</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Shipment Details */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Sender & Receiver Card */}
            <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-primary/20 animate-fadeIn hover:scale-[1.02] group">
              <CardHeader className="pb-3 bg-gradient-to-br from-primary/5 to-purple-50 border-b border-primary/10">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Info className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-900 group-hover:text-primary transition-colors">Shipment Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-5">
                {/* Sender */}
                <div className="bg-gradient-to-br from-primary/10 to-blue-50 rounded-xl p-5 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-md group/sender">
                  <h4 className="font-bold text-gray-900 flex items-center mb-4 group-hover/sender:text-primary transition-colors">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mr-3 shadow-md group-hover/sender:scale-110 transition-transform duration-300">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-base">Sender</span>
                  </h4>
                  <div className="text-sm space-y-3 ml-13">
                    <p className="font-extrabold text-gray-900 text-lg">{shipment.sender.name}</p>
                    {shipment.sender.phone && (
                      <div className="flex items-center text-gray-900 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2">
                        <Phone className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-bold">{shipment.sender.phone}</span>
                      </div>
                    )}
                    {shipment.sender.email && (
                      <div className="flex items-center text-gray-900 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2">
                        <Mail className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-bold">{shipment.sender.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Receiver */}
                <div className="bg-gradient-to-br from-purple-100/70 to-pink-50 rounded-xl p-5 border-2 border-purple-300/40 hover:border-purple-400/60 transition-all duration-300 hover:shadow-md group/receiver">
                  <h4 className="font-bold text-gray-900 flex items-center mb-4 group-hover/receiver:text-purple-600 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mr-3 shadow-md group-hover/receiver:scale-110 transition-transform duration-300">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-base">Receiver</span>
                  </h4>
                  <div className="text-sm space-y-3 ml-13">
                    <p className="font-extrabold text-gray-900 text-lg">{shipment.receiver.name}</p>
                    <div className="flex items-center text-gray-900 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2">
                      <Phone className="h-4 w-4 mr-2 text-purple-600" />
                      <span className="font-bold">{shipment.receiver.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-900 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2">
                      <Mail className="h-4 w-4 mr-2 text-purple-600" />
                      <span className="font-bold">{shipment.receiver.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Package Info Card */}
            {shipment.packageDetails && (
              <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-primary/20 animate-fadeIn hover:scale-[1.02] group">
                <CardHeader className="pb-3 bg-gradient-to-br from-primary/5 to-purple-50 border-b border-primary/10">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Box className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-900 group-hover:text-primary transition-colors">Package Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="space-y-4">
                    {shipment.packageDetails.weight && (
                      <div className="bg-gradient-to-br from-primary/10 to-blue-50 rounded-xl p-4 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 shadow-sm flex items-center justify-center">
                              <Package className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-base font-extrabold text-gray-900 uppercase tracking-wide">Weight</span>
                          </div>
                          <span className="text-2xl font-extrabold text-gray-900 group-hover:text-primary transition-colors">{shipment.packageDetails.weight} kg</span>
                        </div>
                      </div>
                    )}
                    {shipment.packageDetails.description && (
                      <div className="bg-gradient-to-br from-purple-100/70 to-pink-50 rounded-xl p-4 border-2 border-purple-300/40 hover:border-purple-400/60 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 shadow-sm flex items-center justify-center flex-shrink-0">
                            <Info className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-base font-extrabold text-gray-900 uppercase tracking-wide mt-2">Description</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 leading-relaxed bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3">{shipment.packageDetails.description}</p>
                      </div>
                    )}
                    {(!shipment.packageDetails.weight && !shipment.packageDetails.description) && (
                      <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg">
                        <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No additional package details available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Tracking Timeline */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 border-primary/10 animate-fadeIn">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-white via-primary/5 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      Tracking Timeline
                    </CardTitle>
                    <CardDescription className="mt-1 ml-10">
                      Follow your package journey step by step
                    </CardDescription>
                  </div>
                  {shipment.history && shipment.history.length > 0 && (
                    <div className="bg-gradient-to-r from-primary to-purple-600 px-4 py-2 rounded-full shadow-md animate-pulse">
                      <span className="text-xs font-bold text-white">{shipment.history.length} Updates</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-8 pb-6">
                {shipment.history && shipment.history.length > 0 ? (
                  <div className="relative">
                    {/* Vertical Timeline Line with gradient */}
                    <div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-purple-400 to-gray-300 rounded-full shadow-sm"></div>
                    
                    <div className="space-y-8">
                      {shipment.history
                        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                        .slice(0, isTimelineExpanded ? shipment.history.length : 3)
                        .map((item, index) => {
                          const isLatest = index === 0
                          const isOldest = index === shipment.history.length - 1
                          return (
                            <div 
                              key={item._id} 
                              className={`relative flex items-start space-x-5 group animate-fadeIn`}
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              {/* Timeline Node with pulse animation */}
                              <div className="relative z-10 flex-shrink-0">
                                {isLatest && (
                                  <div className="absolute inset-0 w-10 h-10 rounded-full bg-primary/30 animate-ping"></div>
                                )}
                                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                  isLatest 
                                    ? 'bg-gradient-to-br from-primary via-purple-600 to-purple-700 shadow-xl ring-4 ring-primary/30 scale-110' 
                                    : isOldest
                                    ? 'bg-gradient-to-br from-gray-300 to-gray-400 shadow-md'
                                    : 'bg-white border-3 border-primary/50 shadow-md group-hover:scale-110 group-hover:border-primary'
                                }`}>
                                  {getStatusIcon(item.status, !isLatest)}
                                </div>
                              </div>
                              
                              {/* Content Card with hover effects */}
                              <div className={`flex-1 min-w-0 pb-2 transform transition-all duration-300 ${
                                isLatest ? 'scale-[1.02]' : 'group-hover:scale-[1.01]'
                              }`}>
                                <div className={`rounded-xl p-5 transition-all duration-300 group-hover:shadow-xl ${
                                  isLatest 
                                    ? 'bg-gradient-to-br from-primary/15 via-purple-50 to-blue-50 border-2 border-primary/40 shadow-lg' 
                                    : 'bg-white border-2 border-gray-200 group-hover:border-primary/30 group-hover:bg-gradient-to-br group-hover:from-gray-50 group-hover:to-white shadow-md'
                                }`}>
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <p className={`font-bold transition-colors ${
                                          isLatest ? 'text-primary text-lg' : 'text-gray-900 text-base group-hover:text-primary'
                                        }`}>
                                          {item.status}
                                        </p>
                                        {isLatest && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md animate-pulse">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                                            Latest
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-right bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                                      <p className="text-xs text-gray-600 font-semibold">
                                        {new Date(item.updatedAt).toLocaleDateString('en-US', { 
                                          month: 'short', 
                                          day: 'numeric',
                                          year: 'numeric'
                                        })}
                                      </p>
                                      <p className="text-xs text-primary font-medium">
                                        {new Date(item.updatedAt).toLocaleTimeString('en-US', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-start gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-3 group-hover:bg-white transition-all">
                                    <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                                    <div className="flex-1">
                                      <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-0.5">Location</p>
                                      <p className="text-base font-extrabold text-gray-900">{item.location}</p>
                                    </div>
                                  </div>
                                  
                                  {item.note && (
                                    <div className="mt-3 pt-3 border-t-2 border-dashed border-gray-200 group-hover:border-primary/30 transition-colors">
                                      <div className="flex items-start gap-2">
                                        <Info className="h-3.5 w-3.5 mt-0.5 text-primary" />
                                        <p className="text-sm text-gray-900 font-semibold leading-relaxed">{item.note}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                    
                    {/* Show More/Less Button */}
                    {shipment.history.length > 3 && (
                      <div className="mt-8 flex justify-center">
                        <button
                          onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold group"
                        >
                          {isTimelineExpanded ? (
                            <>
                              <span>Show Less</span>
                              <ChevronUp className="h-5 w-5 group-hover:animate-bounce" />
                            </>
                          ) : (
                            <>
                              <span>Show {shipment.history.length - 3} More Updates</span>
                              <ChevronDown className="h-5 w-5 group-hover:animate-bounce" />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <Package className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">No tracking history available yet</p>
                    <p className="text-sm text-gray-400 mt-1">Updates will appear here as your package moves</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Live Interactive Map - Optimized for mobile */}
        <div className="mt-6 lg:col-span-3">
          <Card className="shadow-lg hover:shadow-xl transition-shadow overflow-hidden animate-fadeIn">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-purple-50 border-b border-gray-100 p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <span className="hidden sm:inline">Live Package Tracking Map</span>
                    <span className="sm:hidden truncate">Tracking Map</span>
                  </CardTitle>
                  <CardDescription className="hidden sm:block mt-1 ml-12 font-medium">
                    Track your package journey in real-time with interactive map
                  </CardDescription>
                </div>
                {/* Hide Live Tracking badge on mobile */}
                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-md">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  <span className="text-xs font-bold text-white">Live Tracking</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 md:p-6">
              <ShipmentMap shipment={shipment} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TrackingPage