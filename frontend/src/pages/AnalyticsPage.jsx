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
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Real-time insights and performance metrics
                </p>
              </div>
            </div>
          </motion.div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                      className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-5 blur-2xl rounded-full`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <CardContent className="pt-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</p>
                          <motion.p 
                            className="text-4xl font-extrabold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: 'spring' }}
                          >
                            {stat.value}
                          </motion.p>
                        </div>
                        <motion.div 
                          className={`${stat.bgColor} p-4 rounded-2xl shadow-lg`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className={`h-7 w-7 ${stat.textColor}`} />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Status Breakdown Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <CardTitle>Status Distribution</CardTitle>
                  </div>
                  <CardDescription>Breakdown of shipments by current status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
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
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-foreground">{item._id}</span>
                            <span className="text-sm font-medium text-muted-foreground">
                              {item.count} <span className="text-primary">({percentage}%)</span>
                            </span>
                          </div>
                          <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                            <motion.div 
                              className="bg-gradient-to-r from-primary to-primary/70 h-3 rounded-full"
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
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle>Performance Metrics</CardTitle>
                  </div>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-7">
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

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      <CardTitle>Recent Shipments</CardTitle>
                    </div>
                    <CardDescription className="mt-1">Latest 10 shipments in the system</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentShipments.map((shipment, index) => (
                    <motion.div 
                      key={shipment._id} 
                      className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:bg-muted/30 hover:border-primary/20 transition-all duration-200 group cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 1.3 + index * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {shipment.trackingNumber}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{shipment.receiver.name}</p>
                        </div>
                      </div>
                      <motion.span 
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}
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
