import React, { useState } from 'react'
import { X, AlertTriangle, Trash2, MapPin, User, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { shipmentAPI } from '../../lib/api'
import { Button } from '../ui/button'
import { Alert, AlertDescription } from '../ui/alert'

const DeleteConfirmModal = ({ shipment, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 }
  }

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          {/* Header */}
          <div className="absolute top-4 right-4 z-10">
            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 rounded-full bg-red-500/10 p-4 border border-red-500/20">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Delete Shipment?
              </h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                This action cannot be undone. This will permanently delete the shipment
                <span className="font-mono text-white mx-1.5 font-medium">{shipment.trackingNumber}</span>
                and remove all associated data from our servers.
              </p>

              {/* Shipment snapshot */}
              <div className="w-full bg-white/5 rounded-xl p-4 border border-white/5 mb-6 text-left">
                <div className="flex items-start gap-4 mb-3 pb-3 border-b border-white/5">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Receiver</p>
                    <p className="text-white font-medium text-sm">{shipment.receiver.name}</p>
                    <p className="text-gray-400 text-xs">{shipment.receiver.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 flex-shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Route</p>
                    <p className="text-white text-xs truncate">
                      {shipment.origin} <span className="text-gray-500 mx-1">→</span> {shipment.destination}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 text-red-400 text-left">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="w-full bg-transparent border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
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
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default DeleteConfirmModal
