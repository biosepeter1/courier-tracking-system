import React, { useState } from 'react'
import { X, MapPin, Package, Save, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { shipmentAPI } from '../../lib/api'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Alert, AlertDescription } from '../ui/alert'

const UpdateStatusModal = ({ shipment, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    status: shipment.status,
    location: shipment.currentLocation || '',
    note: ''
  })

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 }
  }

  const statusOptions = [
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await shipmentAPI.update(shipment._id, formData)
      if (response.data.success) {
        onSuccess(response.data.data.shipment)
      } else {
        setError(response.data.message || 'Failed to update status')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update shipment status')
      console.error('Update status error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
            <div>
              <h3 className="text-xl font-bold text-white">Update Status</h3>
              <p className="text-sm text-gray-400 mt-1">
                Tracking ID: <span className="font-mono text-primary">{shipment.trackingNumber}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium text-gray-300">New Status</Label>
                <div className="relative">
                  <Select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                    className="bg-black/40 border-white/10 text-white focus:border-primary/50 h-11"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value} className="bg-gray-900 text-white">
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-gray-300">Current Location</Label>
                <div className="relative group">
                  <MapPin className="h-4 w-4 absolute left-3 top-3.5 text-gray-500 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Lagos Warehouse, Nigeria"
                    className="pl-10 bg-black/40 border-white/10 text-white focus:border-primary/50 h-11 placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-medium text-gray-300">Optional Note</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Add any relevant details about this update..."
                  rows={3}
                  className="bg-black/40 border-white/10 text-white focus:border-primary/50 placeholder:text-gray-600 resize-none"
                />
              </div>

              {/* Current Status Card */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Current State</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    {shipment.status}
                  </span>
                  {shipment.currentLocation && (
                    <span className="text-xs text-gray-400 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-500" />
                      {shipment.currentLocation}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="bg-transparent border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <>
                    <Package className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Update Status
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default UpdateStatusModal
