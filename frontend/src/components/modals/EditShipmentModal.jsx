import React, { useState } from 'react'
import { X, Package, Save, User, MapPin, Phone, Mail, Box } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 }
  }

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

      if (formData.packageDetails.weight || formData.packageDetails.description || formData.packageDetails.value) {
        updateData.packageDetails = {}
        if (formData.packageDetails.weight) updateData.packageDetails.weight = parseFloat(formData.packageDetails.weight)
        if (formData.packageDetails.description) updateData.packageDetails.description = formData.packageDetails.description
        if (formData.packageDetails.value) updateData.packageDetails.value = parseFloat(formData.packageDetails.value)
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

  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
      <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <h4 className="text-sm font-semibold text-white">{title}</h4>
    </div>
  )

  const InputField = ({ label, id, ...props }) => (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-gray-400">{label}</Label>
      <Input
        id={id}
        {...props}
        className="bg-black/40 border-white/10 text-white focus:border-primary/50 h-10 placeholder:text-gray-600 transition-all hover:border-white/20"
      />
    </div>
  )

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
          className="relative bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 flex-shrink-0">
            <div>
              <h3 className="text-xl font-bold text-white">Edit Shipment Details</h3>
              <p className="text-sm text-gray-400 mt-1">Tracking ID: <span className="font-mono text-primary">{shipment.trackingNumber}</span></p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
            <form id="edit-form" onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Sender Info */}
                  <div className="bg-white/[0.02] rounded-xl p-5 border border-white/5">
                    <SectionHeader icon={User} title="Sender Information" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField label="Name *" id="sender.name" name="sender.name" value={formData.sender.name} onChange={handleChange} required />
                      <InputField label="Phone *" id="sender.phone" name="sender.phone" value={formData.sender.phone} onChange={handleChange} required />
                      <div className="sm:col-span-2">
                        <InputField label="Email" id="sender.email" name="sender.email" type="email" value={formData.sender.email} onChange={handleChange} />
                      </div>
                      <div className="sm:col-span-2 space-y-1.5">
                        <Label htmlFor="origin" className="text-xs font-medium text-gray-400">Origin Location *</Label>
                        <div className="relative">
                          <MapPin className="h-4 w-4 absolute left-3 top-3 text-gray-500" />
                          <Input id="origin" name="origin" value={formData.origin} onChange={handleChange} required className="pl-9 bg-black/40 border-white/10 text-white focus:border-primary/50" />
                        </div>
                      </div>
                      <div className="sm:col-span-2 space-y-1.5">
                        <Label htmlFor="sender.address" className="text-xs font-medium text-gray-400">Full Address *</Label>
                        <Textarea id="sender.address" name="sender.address" value={formData.sender.address} onChange={handleChange} rows={2} required className="bg-black/40 border-white/10 text-white focus:border-primary/50 resize-none" />
                      </div>
                    </div>
                  </div>

                  {/* Package Details */}
                  <div className="bg-white/[0.02] rounded-xl p-5 border border-white/5">
                    <SectionHeader icon={Package} title="Package Details" />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Weight (kg)" id="packageDetails.weight" name="packageDetails.weight" type="number" step="0.1" value={formData.packageDetails.weight} onChange={handleChange} />
                      <InputField label="Declared Value ($)" id="packageDetails.value" name="packageDetails.value" type="number" value={formData.packageDetails.value} onChange={handleChange} />
                      <div className="col-span-2 space-y-1.5">
                        <Label htmlFor="packageDetails.description" className="text-xs font-medium text-gray-400">Content Description</Label>
                        <Textarea id="packageDetails.description" name="packageDetails.description" value={formData.packageDetails.description} onChange={handleChange} rows={2} className="bg-black/40 border-white/10 text-white focus:border-primary/50 resize-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Receiver Info */}
                  <div className="bg-white/[0.02] rounded-xl p-5 border border-white/5 h-full">
                    <SectionHeader icon={User} title="Receiver Information" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField label="Name *" id="receiver.name" name="receiver.name" value={formData.receiver.name} onChange={handleChange} required />
                      <div className="sm:col-span-2">
                        <InputField label="Email *" id="receiver.email" name="receiver.email" type="email" value={formData.receiver.email} onChange={handleChange} required />
                      </div>
                      <InputField label="Phone *" id="receiver.phone" name="receiver.phone" value={formData.receiver.phone} onChange={handleChange} required />

                      <div className="sm:col-span-2 space-y-1.5">
                        <Label htmlFor="destination" className="text-xs font-medium text-gray-400">Destination *</Label>
                        <div className="relative">
                          <MapPin className="h-4 w-4 absolute left-3 top-3 text-gray-500" />
                          <Input id="destination" name="destination" value={formData.destination} onChange={handleChange} required className="pl-9 bg-black/40 border-white/10 text-white focus:border-primary/50" />
                        </div>
                      </div>
                      <div className="sm:col-span-2 space-y-1.5">
                        <Label htmlFor="receiver.address" className="text-xs font-medium text-gray-400">Full Address *</Label>
                        <Textarea id="receiver.address" name="receiver.address" value={formData.receiver.address} onChange={handleChange} rows={2} required className="bg-black/40 border-white/10 text-white focus:border-primary/50 resize-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-white/10 bg-white/5 flex-shrink-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="bg-transparent border-white/10 text-gray-300 hover:bg-white/5 hover:text-white">
              Cancel
            </Button>
            <Button form="edit-form" type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
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
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default EditShipmentModal
