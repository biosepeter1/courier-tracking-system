import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Package, 
  Edit, 
  Trash2, 
  MapPin, 
  Search,
  Filter,
  Plus,
  Eye,
  RefreshCw
} from 'lucide-react'
import { shipmentAPI } from '../lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select } from '../components/ui/select'
import { Alert, AlertDescription } from '../components/ui/alert'
import { getStatusColor, formatDateTime } from '../lib/utils'
import Layout from '../components/Layout'
import EditShipmentModal from '../components/modals/EditShipmentModal'
import UpdateStatusModal from '../components/modals/UpdateStatusModal'
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal'

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
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">Manage Shipments</h1>
              <p className="mt-1 text-sm text-gray-500">
                View, edit, and manage all shipments in the system
              </p>
            </div>
            <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
              <Button variant="outline" onClick={fetchShipments} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button asChild>
                <Link to="/admin/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Shipment
                </Link>
              </Button>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search by tracking number, receiver, email, or destination..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value)
                      setCurrentPage(1)
                    }}
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

          {/* Shipments List */}
          <Card>
            <CardHeader>
              <CardTitle>Shipments ({pagination.total})</CardTitle>
              <CardDescription>
                Showing {filteredShipments.length} of {pagination.total} shipments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Package className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredShipments.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-sm font-medium text-gray-900 mb-2">No shipments found</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new shipment.'}
                  </p>
                  {!searchTerm && (
                    <Button asChild>
                      <Link to="/admin/create">Create First Shipment</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="block lg:hidden space-y-4">
                    {filteredShipments.map((shipment) => (
                      <Card key={shipment._id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm text-gray-900 mb-1">
                                {shipment.trackingNumber}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {formatDateTime(shipment.createdAt)}
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                              {shipment.status}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">Receiver</p>
                              <p className="text-sm font-medium text-gray-900">{shipment.receiver.name}</p>
                              <p className="text-xs text-gray-500">{shipment.receiver.email}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Route</p>
                              <p className="text-sm text-gray-900">{shipment.origin}</p>
                              <p className="text-xs text-gray-500 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {shipment.destination}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                              Updated: {formatDateTime(shipment.updatedAt)}
                            </p>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStatusClick(shipment)}
                                title="Update Status"
                              >
                                <MapPin className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(shipment)}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                title="View"
                              >
                                <Link to={`/track/${shipment.trackingNumber}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(shipment)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tracking Number
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Receiver
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Route
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Updated
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredShipments.map((shipment) => (
                          <tr key={shipment._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {shipment.trackingNumber}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDateTime(shipment.createdAt)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {shipment.receiver.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {shipment.receiver.email}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {shipment.origin}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {shipment.destination}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                                {shipment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDateTime(shipment.updatedAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateStatusClick(shipment)}
                                  title="Update Status"
                                >
                                  <MapPin className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditClick(shipment)}
                                  title="Edit Details"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  title="View"
                                >
                                  <Link to={`/track/${shipment.trackingNumber}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick(shipment)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                      <div className="flex flex-1 justify-between sm:hidden">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                          disabled={currentPage === pagination.pages}
                        >
                          Next
                        </Button>
                      </div>
                      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing page <span className="font-medium">{currentPage}</span> of{' '}
                            <span className="font-medium">{pagination.pages}</span>
                          </p>
                        </div>
                        <div>
                          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            <Button
                              variant="outline"
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                              className="rounded-r-none"
                            >
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                              disabled={currentPage === pagination.pages}
                              className="rounded-l-none"
                            >
                              Next
                            </Button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
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
