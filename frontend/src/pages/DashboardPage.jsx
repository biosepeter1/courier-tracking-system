import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Eye,
  TrendingUp
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { shipmentAPI } from '../lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Alert, AlertDescription } from '../components/ui/alert'
import { getStatusColor, formatDateTime } from '../lib/utils'
import Layout from '../components/Layout'

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
        // Calculate pending count including Processing and Confirmed
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
          <div className="md:flex md:items-center md:justify-between mb-4 sm:mb-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-7 text-gray-900">
                {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Welcome back, {user?.name}!
              </p>
            </div>
          </div>

          {/* Stats Cards - Mobile Optimized */}
          <div className="mt-4 sm:mt-6 md:mt-8">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-5">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    Total Shipments
                  </CardTitle>
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{isAdmin ? stats.total : shipments.length}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {isAdmin ? 'All shipments in system' : 'Your shipments'}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    Pending Approval
                  </CardTitle>
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    {isAdmin 
                      ? stats.pending 
                      : shipments.filter(s => ['Pending', 'Processing', 'Confirmed'].includes(s.status)).length
                    }
                  </div>
                  {!isAdmin && (() => {
                    const pendingCount = shipments.filter(s => s.status === 'Pending').length
                    const processingCount = shipments.filter(s => s.status === 'Processing').length
                    const confirmedCount = shipments.filter(s => s.status === 'Confirmed').length
                    const parts = []
                    if (pendingCount > 0) parts.push(`${pendingCount} Pending`)
                    if (processingCount > 0) parts.push(`${processingCount} Processing`)
                    if (confirmedCount > 0) parts.push(`${confirmedCount} Confirmed`)
                    return (
                      <p className="text-xs text-muted-foreground">
                        {parts.length > 0 ? parts.join(' • ') : 'No pending shipments'}
                      </p>
                    )
                  })()}
                  {isAdmin && (
                    <p className="text-xs text-muted-foreground">
                      Awaiting confirmation
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    In Transit
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    {isAdmin ? stats.inTransit : shipments.filter(s => ['Picked Up', 'In Transit', 'Out for Delivery'].includes(s.status)).length}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Currently moving
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    Delivered
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    {isAdmin ? stats.delivered : shipments.filter(s => s.status === 'Delivered').length}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Successfully delivered
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Shipments - Mobile Optimized */}
          <div className="mt-4 sm:mt-6 md:mt-8">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base sm:text-lg">Recent Shipments</CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1">
                      {isAdmin ? 'Latest shipments in the system' : 'Your recent shipment activity'}
                    </CardDescription>
                  </div>
                  <div className="w-full sm:w-auto">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-48 md:w-64 h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                {error && (
                  <Alert variant="destructive" className="mb-3 sm:mb-4">
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                {filteredShipments.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <Package className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">No shipments found</h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {searchTerm ? 'Try adjusting your search terms.' : 'No shipments available at the moment.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <div className="space-y-2 sm:space-y-3">
                      {filteredShipments.map((shipment) => (
                        <div
                          key={shipment._id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-2 sm:gap-0"
                        >
                          <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                                {getStatusIcon(shipment.status)}
                                <span className="ml-1 hidden sm:inline">{shipment.status}</span>
                                <span className="ml-1 sm:hidden">{shipment.status.substring(0, 3)}</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                {shipment.trackingNumber}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
                                To: {shipment.receiver.name}
                              </p>
                              <p className="text-xs text-gray-400 truncate mt-0.5">
                                {shipment.destination}
                              </p>
                              {shipment.currentLocation && (
                                <div className="flex items-center mt-1 text-xs text-gray-400">
                                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">{shipment.currentLocation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                            <p className="text-xs text-gray-500">
                              {formatDateTime(shipment.updatedAt)}
                            </p>
                            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                              <Link to={`/track/${shipment.trackingNumber}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {filteredShipments.length > 0 && (
                      <div className="mt-3 sm:mt-4 text-center">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                          <Link to={isAdmin ? "/admin/shipments" : "/shipments"}>
                            View All Shipments
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DashboardPage