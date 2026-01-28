import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Eye,
  TrendingUp,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { shipmentAPI } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Alert, AlertDescription } from '../components/ui/alert'
import { getStatusColor, formatDateTime } from '../lib/utils'
import Layout from '../components/Layout'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

const DashboardPage = () => {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0
  })

  const { user, isAdmin } = useAuth()

  useEffect(() => {
    fetchShipments()
    if (isAdmin) {
      fetchStats()
    }
  }, [])

  const fetchShipments = async () => {
    try {
      setLoading(true)
      const response = await shipmentAPI.getAll({ limit: 10 })
      if (response.data.success) {
        setShipments(response.data.data.shipments)
      }
    } catch (err) {
      setError('Failed to load shipments')
      console.error('Fetch shipments error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await shipmentAPI.getStats()
      if (response.data.success) {
        const statusBreakdown = response.data.data.statusBreakdown
        const pendingCount = statusBreakdown
          .filter(s => ['Pending', 'Processing', 'Confirmed'].includes(s._id))
          .reduce((sum, s) => sum + s.count, 0)

        const inTransitCount = statusBreakdown
          .filter(s => ['Picked Up', 'In Transit', 'Out for Delivery'].includes(s._id))
          .reduce((sum, s) => sum + s.count, 0)

        const stats = {
          total: response.data.data.totalShipments,
          pending: pendingCount,
          inTransit: inTransitCount,
          delivered: statusBreakdown.find(s => s._id === 'Delivered')?.count || 0
        }
        setStats(stats)
      }
    } catch (err) {
      console.error('Fetch stats error:', err)
    }
  }

  const filteredShipments = shipments.filter(shipment =>
    shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
      case 'Processing':
      case 'Confirmed':
        return <Clock className="h-4 w-4" />
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'Cancelled':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-primary/20 animate-pulse" />
              <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-t-primary animate-spin" />
              <Package className="absolute inset-0 m-auto h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground font-medium animate-pulse">Loading Dashboard...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="relative min-h-screen bg-background/50">
        {/* Decorative Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative py-6 sm:py-8 md:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  {isAdmin ? 'Overview' : 'My Dashboard'}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>! Here's what's happening with your shipments.
                </p>
              </div>


            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              <motion.div variants={item}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl hover:shadow-lg transition-all duration-300 group overflow-hidden relative">

                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Shipments</CardTitle>
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Package className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight mb-1">{isAdmin ? stats.total : shipments.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {isAdmin ? 'All time processing' : 'Lifetime shipments'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl hover:shadow-lg transition-all duration-300 group overflow-hidden relative">

                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                    <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <Clock className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight mb-1">
                      {isAdmin
                        ? stats.pending
                        : shipments.filter(s => ['Pending', 'Processing', 'Confirmed'].includes(s.status)).length
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">Needs attention</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl hover:shadow-lg transition-all duration-300 group overflow-hidden relative">

                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">In Transit</CardTitle>
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight mb-1">
                      {isAdmin ? stats.inTransit : shipments.filter(s => ['Picked Up', 'In Transit', 'Out for Delivery'].includes(s.status)).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Currently moving</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl hover:shadow-lg transition-all duration-300 group overflow-hidden relative">

                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
                    <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight mb-1">
                      {isAdmin ? stats.delivered : shipments.filter(s => s.status === 'Delivered').length}
                    </div>
                    <p className="text-xs text-muted-foreground">Successfully completed</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Recent Shipments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-xl font-bold">Recent Activity</h3>
                </div>

                <div className="relative w-full sm:w-auto">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Search className="h-4 w-4" />
                  </div>
                  <Input
                    placeholder="Search tracking numbers..."
                    className="pl-9 w-full sm:w-[300px] bg-background/50 backdrop-blur-sm border-border/50 focus:bg-background transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="rounded-xl border-red-500/20 bg-red-500/10 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {filteredShipments.length === 0 ? (
                <Card className="border-dashed border-2 bg-transparent shadow-none">
                  <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
                      <Package className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No shipments found</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first shipment request.'}
                    </p>
                    {!searchTerm && !isAdmin && (
                      <Button asChild className="mt-6 rounded-full" variant="outline">
                        <Link to="/shipment/create">Create Shipment</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredShipments.map((shipment, index) => (
                    <motion.div
                      key={shipment._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                    >
                      <Card className="group overflow-hidden border-border/40 bg-card/40 backdrop-blur-sm hover:bg-card hover:shadow-lg transition-all cursor-pointer">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="p-0">
                          <Link to={`/track/${shipment.trackingNumber}`} className="flex flex-col sm:flex-row items-center p-4 sm:p-6 gap-6">
                            {/* Status Icon */}
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${shipment.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                              shipment.status === 'Pending' ? 'bg-orange-500/10 text-orange-500' :
                                'bg-blue-500/10 text-blue-500'
                              }`}>
                              {getStatusIcon(shipment.status)}
                            </div>

                            {/* Main Info */}
                            <div className="flex-1 min-w-0 text-center sm:text-left grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Tracking ID</p>
                                <p className="font-bold font-mono text-lg">{shipment.trackingNumber}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Destination</p>
                                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 text-primary" />
                                  <p className="font-medium truncate">{shipment.destination}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(shipment.status)}`}>
                                  {shipment.status}
                                </div>
                              </div>
                            </div>

                            {/* Arrow/Action */}
                            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <ArrowRight className="h-5 w-5" />
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  {filteredShipments.length > 0 && (
                    <div className="text-center pt-4">
                      <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary">
                        <Link to={isAdmin ? "/admin/shipments" : "/shipments"}>
                          View Full History <ArrowRight className="h-4 w-4 base-4" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DashboardPage