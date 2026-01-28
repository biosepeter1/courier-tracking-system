import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Edit,
  Trash2,
  MapPin,
  Search,
  Filter,
  Plus,
  Eye,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Box,
  User,
  Mail
} from 'lucide-react'
import { shipmentAPI } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select } from '../components/ui/select'
import { Alert, AlertDescription } from '../components/ui/alert'

import { getStatusColor, formatDateTime } from '../lib/utils'
import Layout from '../components/Layout'
import EditShipmentModal from '../components/modals/EditShipmentModal'
import UpdateStatusModal from '../components/modals/UpdateStatusModal'
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
}

const AdminShipmentsPage = () => {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 10 })

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState(null)

  useEffect(() => {
    fetchShipments()
  }, [currentPage, statusFilter])

  const fetchShipments = async () => {
    try {
      setLoading(true)
      setError('')
      const params = {
        page: currentPage,
        limit: pagination.limit,
        ...(statusFilter !== 'all' && { status: statusFilter })
      }
      const response = await shipmentAPI.getAll(params)
      if (response.data.success) {
        setShipments(response.data.data.shipments)
        setPagination(response.data.data.pagination)
      }
    } catch (err) {
      setError('Failed to load shipments')
      console.error('Fetch shipments error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (shipment) => {
    setSelectedShipment(shipment)
    setEditModalOpen(true)
  }

  const handleUpdateStatusClick = (shipment) => {
    setSelectedShipment(shipment)
    setStatusModalOpen(true)
  }

  const handleDeleteClick = (shipment) => {
    setSelectedShipment(shipment)
    setDeleteModalOpen(true)
  }

  const handleEditSuccess = (updatedShipment) => {
    setShipments(shipments.map(s =>
      s._id === updatedShipment._id ? updatedShipment : s
    ))
    setEditModalOpen(false)
    setSuccess('Shipment updated successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleStatusSuccess = (updatedShipment) => {
    setShipments(shipments.map(s =>
      s._id === updatedShipment._id ? updatedShipment : s
    ))
    setStatusModalOpen(false)
    setSuccess('Shipment status updated successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleDeleteSuccess = () => {
    setShipments(shipments.filter(s => s._id !== selectedShipment._id))
    setDeleteModalOpen(false)
    setSuccess('Shipment deleted successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = !searchTerm ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.receiver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  // Helper for status styling (consistent with other pages)
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
      case 'Processing':
      case 'Confirmed':
        return <Clock className="h-4 w-4" />
      case 'Delivered':
        return <CheckCircle2 className="h-4 w-4" />
      case 'Cancelled':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Truck className="h-4 w-4" />
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
      case 'Processing':
      case 'Confirmed':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'Delivered':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'Cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    }
  }

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Picked Up', label: 'Picked Up' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Out for Delivery', label: 'Out for Delivery' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'On Hold', label: 'On Hold' }
  ]

  return (
    <Layout>
      <div className="relative min-h-screen bg-background/50 pb-20">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:flex md:items-center md:justify-between mb-8"
          >
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-2">
                Manage Shipments
              </h1>
              <p className="text-muted-foreground text-lg">
                Admin control center for all system shipments
              </p>
            </div>
            <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
              <Button
                variant="outline"
                onClick={fetchShipments}
                disabled={loading}
                className="rounded-xl border-white/10 hover:bg-white/5"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button asChild className="rounded-xl shadow-lg hover:shadow-primary/20 transition-all">
                <Link to="/admin/create">
                  <Plus className="h-4 w-4 mr-2" />
                  New Shipment
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Alert variant="destructive" className="border-red-500/20 bg-red-500/10 backdrop-blur">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Alert variant="success" className="border-green-500/20 bg-green-500/10 backdrop-blur">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="backdrop-blur-xl bg-card/50 border-border/50 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 relative group">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Search tracking, email, destination..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 bg-background/50 border-white/10 text-base"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                      <Filter className="h-4 w-4" />
                    </div>
                    <Select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="pl-10 h-12 bg-background/50 border-white/10 w-full"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Shipments List */}
          <Card className="backdrop-blur-xl bg-card/40 border-border/50 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <p className="text-muted-foreground animate-pulse">Loading data...</p>
                </div>
              ) : filteredShipments.length === 0 ? (
                <div className="text-center py-20">
                  <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <Package className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No matching shipments</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new shipment.'}
                  </p>
                  {!searchTerm && (
                    <Button asChild className="rounded-full">
                      <Link to="/admin/create">Create First Shipment</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Tracking Number</th>
                          <th className="px-6 py-4 font-semibold">Receiver</th>
                          <th className="px-6 py-4 font-semibold">Route</th>
                          <th className="px-6 py-4 font-semibold">Status</th>
                          <th className="px-6 py-4 font-semibold">Updated</th>
                          <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {filteredShipments.map((shipment) => (
                          <motion.tr
                            variants={item}
                            key={shipment._id}
                            className="hover:bg-muted/30 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                  <Box className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="font-mono font-bold text-base group-hover:text-primary transition-colors">
                                    {shipment.trackingNumber}
                                  </div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDateTime(shipment.createdAt)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-medium">{shipment.receiver.name}</div>
                              <div className="text-xs text-muted-foreground">{shipment.receiver.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                                  {shipment.origin}
                                </div>
                                <div className="text-sm font-medium flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 text-primary" />
                                  {shipment.destination}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border gap-1.5 ${getStatusStyle(shipment.status)}`}>
                                {getStatusIcon(shipment.status)}
                                {shipment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {formatDateTime(shipment.updatedAt)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleUpdateStatusClick(shipment)}
                                  className="h-8 w-8 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
                                  title="Update Status"
                                >
                                  <Truck className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditClick(shipment)}
                                  className="h-8 w-8 rounded-full hover:bg-orange-500/10 hover:text-orange-500 transition-colors"
                                  title="Edit Details"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                                  title="View Details"
                                >
                                  <Link to={`/track/${shipment.trackingNumber}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteClick(shipment)}
                                  className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden space-y-4 p-4">
                    {filteredShipments.map((shipment) => (
                      <motion.div variants={item} key={shipment._id}>
                        <Card className="hover:shadow-md transition-all border-border/50 bg-card/50">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                  <Box className="h-5 w-5" />
                                </div>
                                <div>
                                  <h3 className="font-mono font-bold text-sm text-foreground">
                                    {shipment.trackingNumber}
                                  </h3>
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDateTime(shipment.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(shipment.status)}`}>
                                {shipment.status}
                              </span>
                            </div>

                            <div className="space-y-3 mb-4 p-3 bg-muted/20 rounded-lg">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <User className="h-3 w-3" /> Receiver
                                  </p>
                                  <p className="text-sm font-medium">{shipment.receiver.name}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground mb-1 flex items-center justify-end gap-1">
                                    <MapPin className="h-3 w-3" /> Destination
                                  </p>
                                  <p className="text-sm font-medium">{shipment.destination}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <span className="text-xs text-muted-foreground">
                                Updated: {formatDateTime(shipment.updatedAt)}
                              </span>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateStatusClick(shipment)}
                                  className="h-8 w-8 rounded-full"
                                >
                                  <Truck className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditClick(shipment)}
                                  className="h-8 w-8 rounded-full"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="h-8 w-8 rounded-full"
                                >
                                  <Link to={`/track/${shipment.trackingNumber}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick(shipment)}
                                  className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex justify-center items-center gap-4 py-6 border-t border-border/50">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="h-10 w-10 rounded-full hover:bg-primary/10"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center px-4 font-medium text-sm bg-card/50 backdrop-blur rounded-full h-10 border border-border/50">
                        Page <span className="text-primary font-bold mx-1">{currentPage}</span> of {pagination.pages}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === pagination.pages}
                        onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                        className="h-10 w-10 rounded-full hover:bg-primary/10"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {editModalOpen && selectedShipment && (
        <EditShipmentModal
          shipment={selectedShipment}
          onClose={() => setEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {statusModalOpen && selectedShipment && (
        <UpdateStatusModal
          shipment={selectedShipment}
          onClose={() => setStatusModalOpen(false)}
          onSuccess={handleStatusSuccess}
        />
      )}

      {deleteModalOpen && selectedShipment && (
        <DeleteConfirmModal
          shipment={selectedShipment}
          onClose={() => setDeleteModalOpen(false)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </Layout>
  )
}

export default AdminShipmentsPage
