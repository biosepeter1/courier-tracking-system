import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Truck,
  AlertCircle,
  Calendar,
  BarChart3,
  Activity,
  TrendingDown
} from 'lucide-react'
import { shipmentAPI } from '../lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { getStatusColor } from '../lib/utils'
import Layout from '../components/Layout'

const AnalyticsPage = () => {
  const [stats, setStats] = useState({
    totalShipments: 0,
    todayShipments: 0,
    statusBreakdown: []
  })
  const [recentShipments, setRecentShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [statsRes, shipmentsRes] = await Promise.all([
        shipmentAPI.getStats(),
        shipmentAPI.getAll({ limit: 10 })
      ])

      if (statsRes.data.success) {
        setStats(statsRes.data.data)
      }

      if (shipmentsRes.data.success) {
        setRecentShipments(shipmentsRes.data.data.shipments)
      }
    } catch (err) {
      setError('Failed to load analytics data')
      console.error('Analytics error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusCount = (status) => {
    const item = stats.statusBreakdown.find(s => s._id === status)
    return item ? item.count : 0
  }

  const statusCards = [
    {
      title: 'Total Shipments',
      value: stats.totalShipments,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Today',
      value: stats.todayShipments,
      icon: Calendar,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending',
      value: getStatusCount('Pending'),
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'In Transit',
      value: getStatusCount('In Transit') + getStatusCount('Picked Up') + getStatusCount('Out for Delivery'),
      icon: Truck,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Delivered',
      value: getStatusCount('Delivered'),
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'On Hold',
      value: getStatusCount('On Hold') + getStatusCount('Cancelled'),
      icon: AlertCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ]

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Package className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="py-3 sm:py-4 md:py-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Header - Mobile Optimized */}
          <motion.div 
            className="mb-4 sm:mb-6 md:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                  Real-time insights and performance metrics
                </p>
              </div>
            </div>
          </motion.div>

          {error && (
            <Alert variant="destructive" className="mb-4 sm:mb-6">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Grid - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            {statusCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-border/50 relative overflow-hidden">
                    <motion.div 
                      className={`absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 ${stat.color} opacity-5 blur-2xl rounded-full`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <CardContent className="p-4 sm:pt-6 sm:px-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">{stat.title}</p>
                          <motion.p 
                            className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: 'spring' }}
                          >
                            {stat.value}
                          </motion.p>
                        </div>
                        <motion.div 
                          className={`${stat.bgColor} p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl shadow-lg`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 ${stat.textColor}`} />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Status Breakdown Chart - Mobile Optimized */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <CardTitle className="text-base sm:text-lg">Status Distribution</CardTitle>
                  </div>
                  <CardDescription className="text-xs sm:text-sm mt-1">Breakdown of shipments by current status</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4 md:space-y-5">
                    {stats.statusBreakdown.map((item, index) => {
                      const percentage = stats.totalShipments > 0 
                        ? Math.round((item.count / stats.totalShipments) * 100) 
                        : 0
                      
                      return (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                            <span className="text-xs sm:text-sm font-semibold text-foreground">{item._id}</span>
                            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                              {item.count} <span className="text-primary">({percentage}%)</span>
                            </span>
                          </div>
                          <div className="w-full bg-muted/50 rounded-full h-2 sm:h-2.5 md:h-3 overflow-hidden">
                            <motion.div 
                              className="bg-gradient-to-r from-primary to-primary/70 h-2 sm:h-2.5 md:h-3 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                            />
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <CardTitle className="text-base sm:text-lg">Performance Metrics</CardTitle>
                  </div>
                  <CardDescription className="text-xs sm:text-sm mt-1">Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-5 md:space-y-7">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="text-sm font-semibold text-foreground">Delivery Rate</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                          {stats.totalShipments > 0 
                            ? Math.round((getStatusCount('Delivered') / stats.totalShipments) * 100) 
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                        <motion.div 
                          className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.totalShipments > 0 ? Math.round((getStatusCount('Delivered') / stats.totalShipments) * 100) : 0}%` }}
                          transition={{ duration: 0.8, delay: 0.9 }}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.9 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-50 rounded-lg">
                            <Truck className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-semibold text-foreground">In Progress</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">
                          {stats.totalShipments > 0 
                            ? Math.round(((getStatusCount('In Transit') + getStatusCount('Picked Up') + getStatusCount('Out for Delivery')) / stats.totalShipments) * 100) 
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                        <motion.div 
                          className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.totalShipments > 0 ? Math.round(((getStatusCount('In Transit') + getStatusCount('Picked Up') + getStatusCount('Out for Delivery')) / stats.totalShipments) * 100) : 0}%` }}
                          transition={{ duration: 0.8, delay: 1.0 }}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 1.0 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-yellow-50 rounded-lg">
                            <Clock className="h-4 w-4 text-yellow-600" />
                          </div>
                          <span className="text-sm font-semibold text-foreground">Pending</span>
                        </div>
                        <span className="text-lg font-bold text-yellow-600">
                          {stats.totalShipments > 0 
                            ? Math.round((getStatusCount('Pending') / stats.totalShipments) * 100) 
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                        <motion.div 
                          className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.totalShipments > 0 ? Math.round((getStatusCount('Pending') / stats.totalShipments) * 100) : 0}%` }}
                          transition={{ duration: 0.8, delay: 1.1 }}
                        />
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <CardTitle className="text-base sm:text-lg">Recent Shipments</CardTitle>
                    </div>
                    <CardDescription className="text-xs sm:text-sm mt-0.5 sm:mt-1">Latest 10 shipments in the system</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="space-y-2 sm:space-y-3">
                  {recentShipments.map((shipment, index) => (
                    <motion.div 
                      key={shipment._id} 
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-border/50 rounded-lg sm:rounded-xl hover:bg-muted/30 hover:border-primary/20 transition-all duration-200 group cursor-pointer gap-2 sm:gap-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 1.3 + index * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="p-2 sm:p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors flex-shrink-0">
                          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {shipment.trackingNumber}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{shipment.receiver.name}</p>
                        </div>
                      </div>
                      <motion.span 
                        className={`inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)} self-start sm:self-auto`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {shipment.status}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default AnalyticsPage
