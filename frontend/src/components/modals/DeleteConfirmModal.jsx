import React, { useState } from 'react'
import { X, AlertTriangle, Trash2 } from 'lucide-react'
import { shipmentAPI } from '../../lib/api'
import { Button } from '../ui/button'
import { Alert, AlertDescription } from '../ui/alert'

const DeleteConfirmModal = ({ shipment, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await shipmentAPI.delete(shipment._id)
      if (response.data.success) {
        onSuccess()
      } else {
        setError(response.data.message || 'Failed to delete shipment')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete shipment')
      console.error('Delete shipment error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Shipment
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this shipment? This action cannot be undone.
                  </p>
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{shipment.trackingNumber}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      To: {shipment.receiver.name} ({shipment.receiver.email})
                    </p>
                    <p className="text-xs text-gray-500">
                      {shipment.origin} → {shipment.destination}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Trash2 className="h-4 w-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Shipment
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
