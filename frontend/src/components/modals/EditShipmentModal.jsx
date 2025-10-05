import React, { useState } from 'react'
import { X, Package, Save } from 'lucide-react'
import { shipmentAPI } from '../../lib/api'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Alert, AlertDescription } from '../ui/alert'

const EditShipmentModal = ({ shipment, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    sender: {
      name: shipment.sender.name,
      phone: shipment.sender.phone,
      address: shipment.sender.address,
      email: shipment.sender.email || ''
    },
    receiver: {
      name: shipment.receiver.name,
      email: shipment.receiver.email,
      phone: shipment.receiver.phone,
      address: shipment.receiver.address
    },
    origin: shipment.origin,
    destination: shipment.destination,
    packageDetails: {
      weight: shipment.packageDetails?.weight || '',
      description: shipment.packageDetails?.description || '',
      value: shipment.packageDetails?.value || ''
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Clean up the data - only send fields that have values
      const updateData = {
        sender: {
          name: formData.sender.name,
          phone: formData.sender.phone,
          address: formData.sender.address,
          ...(formData.sender.email && { email: formData.sender.email })
        },
        receiver: formData.receiver,
        origin: formData.origin,
        destination: formData.destination
      }

      // Only include packageDetails if there are values
      if (formData.packageDetails.weight || formData.packageDetails.description || formData.packageDetails.value) {
        updateData.packageDetails = {}
        if (formData.packageDetails.weight) {
          updateData.packageDetails.weight = parseFloat(formData.packageDetails.weight)
        }
        if (formData.packageDetails.description) {
          updateData.packageDetails.description = formData.packageDetails.description
        }
        if (formData.packageDetails.value) {
          updateData.packageDetails.value = parseFloat(formData.packageDetails.value)
        }
      }

      const response = await shipmentAPI.updateDetails(shipment._id, updateData)
      if (response.data.success) {
        onSuccess(response.data.data.shipment)
      } else {
        setError(response.data.message || 'Failed to update shipment')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update shipment')
      console.error('Edit shipment error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Edit Shipment Details</h3>
              <p className="text-sm text-gray-500 mt-1">{shipment.trackingNumber}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Sender Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Sender Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sender.name">Name *</Label>
                  <Input
                    id="sender.name"
                    name="sender.name"
                    value={formData.sender.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sender.phone">Phone *</Label>
                  <Input
                    id="sender.phone"
                    name="sender.phone"
                    value={formData.sender.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sender.email">Email</Label>
                  <Input
                    id="sender.email"
                    name="sender.email"
                    type="email"
                    value={formData.sender.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="origin">Origin *</Label>
                  <Input
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="sender.address">Address *</Label>
                  <Textarea
                    id="sender.address"
                    name="sender.address"
                    value={formData.sender.address}
                    onChange={handleChange}
                    rows={2}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Receiver Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Receiver Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="receiver.name">Name *</Label>
                  <Input
                    id="receiver.name"
                    name="receiver.name"
                    value={formData.receiver.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="receiver.email">Email *</Label>
                  <Input
                    id="receiver.email"
                    name="receiver.email"
                    type="email"
                    value={formData.receiver.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="receiver.phone">Phone *</Label>
                  <Input
                    id="receiver.phone"
                    name="receiver.phone"
                    value={formData.receiver.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="destination">Destination *</Label>
                  <Input
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="receiver.address">Address *</Label>
                  <Textarea
                    id="receiver.address"
                    name="receiver.address"
                    value={formData.receiver.address}
                    onChange={handleChange}
                    rows={2}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Package Details (Optional)</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="packageDetails.weight">Weight (kg)</Label>
                  <Input
                    id="packageDetails.weight"
                    name="packageDetails.weight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.packageDetails.weight}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="packageDetails.value">Value</Label>
                  <Input
                    id="packageDetails.value"
                    name="packageDetails.value"
                    type="number"
                    min="0"
                    value={formData.packageDetails.value}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor="packageDetails.description">Description</Label>
                  <Textarea
                    id="packageDetails.description"
                    name="packageDetails.description"
                    value={formData.packageDetails.description}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Package className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditShipmentModal
