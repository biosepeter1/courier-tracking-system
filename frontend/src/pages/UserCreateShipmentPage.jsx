import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Package, User, Mail, Phone, MapPin, Calendar, AlertCircle } from 'lucide-react'
import { shipmentAPI } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select } from '../components/ui/select'
import { Alert, AlertDescription } from '../components/ui/alert'
import { DatePicker } from '../components/ui/datepicker'
import Layout from '../components/Layout'

const UserCreateShipmentPage = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    sender: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      email: user?.email || ''
    },
    receiver: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    origin: '',
    destination: '',
    packageDetails: {
      weight: '',
      dimensions: {
        length: '',
        width: '',
        height: ''
      },
      description: '',
      value: ''
    },
    estimatedDelivery: null,
    priority: 'Normal'
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.')
      if (grandchild) {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [grandchild]: value
            }
          }
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    const toastId = toast.loading('Creating your shipment request...', {
      icon: '📦',
    })
    setLoading(true)

    try {
      // Build shipment data
      const shipmentData = {
        sender: {
          name: formData.sender.name,
          phone: formData.sender.phone,
          address: formData.sender.address,
          email: formData.sender.email
        },
        receiver: {
          name: formData.receiver.name,
          email: formData.receiver.email,
          phone: formData.receiver.phone,
          address: formData.receiver.address
        },
        origin: formData.origin,
        destination: formData.destination,
        ...(formData.priority && { priority: formData.priority }),
        ...(formData.estimatedDelivery && { estimatedDelivery: formData.estimatedDelivery.toISOString() })
      }

      // Only include packageDetails if at least one field has a value
      const hasPackageDetails = 
        formData.packageDetails.weight ||
        formData.packageDetails.value ||
        formData.packageDetails.description ||
        formData.packageDetails.dimensions.length ||
        formData.packageDetails.dimensions.width ||
        formData.packageDetails.dimensions.height

      if (hasPackageDetails) {
        shipmentData.packageDetails = {}
        
        if (formData.packageDetails.weight) {
          shipmentData.packageDetails.weight = parseFloat(formData.packageDetails.weight)
        }
        if (formData.packageDetails.value) {
          shipmentData.packageDetails.value = parseFloat(formData.packageDetails.value)
        }
        if (formData.packageDetails.description) {
          shipmentData.packageDetails.description = formData.packageDetails.description
        }
        
        const hasDimensions = 
          formData.packageDetails.dimensions.length ||
          formData.packageDetails.dimensions.width ||
          formData.packageDetails.dimensions.height
        
        if (hasDimensions) {
          shipmentData.packageDetails.dimensions = {}
          if (formData.packageDetails.dimensions.length) {
            shipmentData.packageDetails.dimensions.length = parseFloat(formData.packageDetails.dimensions.length)
          }
          if (formData.packageDetails.dimensions.width) {
            shipmentData.packageDetails.dimensions.width = parseFloat(formData.packageDetails.dimensions.width)
          }
          if (formData.packageDetails.dimensions.height) {
            shipmentData.packageDetails.dimensions.height = parseFloat(formData.packageDetails.dimensions.height)
          }
        }
      }
      
      const response = await shipmentAPI.create(shipmentData)
      
      if (response.data.success) {
        const trackingNumber = response.data.data.shipment.trackingNumber
        setSuccess(`Shipment request created successfully! Tracking number: ${trackingNumber}. Your shipment is now pending admin approval.`)
        
        toast.success(
          <div>
            <div className="font-bold">Shipment Created Successfully! 🎉</div>
            <div className="text-sm mt-1">Tracking: <span className="font-mono font-semibold">{trackingNumber}</span></div>
            <div className="text-xs mt-1 text-gray-600">Pending admin approval • Email notification sent</div>
          </div>,
          {
            id: toastId,
            duration: 6000,
            icon: '✅',
          }
        )
        
        setTimeout(() => {
          navigate('/dashboard')
        }, 3000)
      } else {
        setError(response.data.message)
        toast.error(response.data.message || 'Failed to create shipment', { id: toastId })
      }
    } catch (err) {
      console.error('Create shipment error:', err)
      
      let errorMessage = 'Failed to create shipment'
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        errorMessage = err.response.data.errors.map(e => `${e.field}: ${e.message}`).join(', ')
        setError(`Validation failed: ${errorMessage}`)
      } else {
        errorMessage = err.response?.data?.message || 'Failed to create shipment'
        setError(errorMessage)
      }
      
      toast.error(
        <div>
          <div className="font-bold">Failed to Create Shipment</div>
          <div className="text-sm mt-1">{errorMessage}</div>
        </div>,
        { id: toastId, duration: 5000 }
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create Shipment Request</h1>
            <p className="text-sm text-gray-500 mt-1">
              Submit a shipment request for admin processing and confirmation
            </p>
          </div>

          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your shipment request will be reviewed and confirmed by an administrator before processing. You'll be notified via email once it's approved.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-6">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sender Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Your Information (Sender)
                </CardTitle>
                <CardDescription>
                  Your details as the sender of this package
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sender.name">Full Name *</Label>
                  <Input
                    id="sender.name"
                    name="sender.name"
                    required
                    value={formData.sender.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="sender.phone">Phone Number *</Label>
                  <Input
                    id="sender.phone"
                    name="sender.phone"
                    type="tel"
                    required
                    value={formData.sender.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="sender.email">Email Address *</Label>
                  <Input
                    id="sender.email"
                    name="sender.email"
                    type="email"
                    required
                    value={formData.sender.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="origin">Pickup Location *</Label>
                  <Input
                    id="origin"
                    name="origin"
                    required
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="e.g., Lagos, Nigeria"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="sender.address">Pickup Address *</Label>
                  <Textarea
                    id="sender.address"
                    name="sender.address"
                    required
                    rows={3}
                    value={formData.sender.address}
                    onChange={handleChange}
                    placeholder="Enter complete pickup address"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Receiver Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Receiver Information
                </CardTitle>
                <CardDescription>
                  Details of the person receiving the package
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="receiver.name">Full Name *</Label>
                  <Input
                    id="receiver.name"
                    name="receiver.name"
                    required
                    value={formData.receiver.name}
                    onChange={handleChange}
                    placeholder="Enter receiver's name"
                  />
                </div>
                <div>
                  <Label htmlFor="receiver.phone">Phone Number *</Label>
                  <Input
                    id="receiver.phone"
                    name="receiver.phone"
                    type="tel"
                    required
                    value={formData.receiver.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="receiver.email">Email Address *</Label>
                  <Input
                    id="receiver.email"
                    name="receiver.email"
                    type="email"
                    required
                    value={formData.receiver.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="destination">Delivery Location *</Label>
                  <Input
                    id="destination"
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g., Abuja, Nigeria"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="receiver.address">Delivery Address *</Label>
                  <Textarea
                    id="receiver.address"
                    name="receiver.address"
                    required
                    rows={3}
                    value={formData.receiver.address}
                    onChange={handleChange}
                    placeholder="Enter complete delivery address"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Package Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Package Details
                </CardTitle>
                <CardDescription>
                  Information about the package being shipped
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="e.g., 2.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="packageDetails.value">Declared Value</Label>
                    <Input
                      id="packageDetails.value"
                      name="packageDetails.value"
                      type="number"
                      min="0"
                      value={formData.packageDetails.value}
                      onChange={handleChange}
                      placeholder="Package value"
                    />
                  </div>
                </div>

                <div>
                  <Label>Dimensions (cm)</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <Input
                      name="packageDetails.dimensions.length"
                      type="number"
                      min="0"
                      value={formData.packageDetails.dimensions.length}
                      onChange={handleChange}
                      placeholder="Length"
                    />
                    <Input
                      name="packageDetails.dimensions.width"
                      type="number"
                      min="0"
                      value={formData.packageDetails.dimensions.width}
                      onChange={handleChange}
                      placeholder="Width"
                    />
                    <Input
                      name="packageDetails.dimensions.height"
                      type="number"
                      min="0"
                      value={formData.packageDetails.dimensions.height}
                      onChange={handleChange}
                      placeholder="Height"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="packageDetails.description">Description *</Label>
                  <Textarea
                    id="packageDetails.description"
                    name="packageDetails.description"
                    required
                    rows={3}
                    value={formData.packageDetails.description}
                    onChange={handleChange}
                    placeholder="Brief description of package contents"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipment Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Shipment Options
                </CardTitle>
                <CardDescription>
                  Priority and delivery preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Normal">Normal Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="estimatedDelivery">Preferred Delivery Date</Label>
                  <DatePicker
                    id="estimatedDelivery"
                    selected={formData.estimatedDelivery}
                    onChange={(date) => setFormData(prev => ({ ...prev, estimatedDelivery: date }))}
                    minDate={new Date()}
                    placeholderText="Select your preferred delivery date"
                    isClearable
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Package className="h-4 w-4 animate-spin mr-2" />
                    Submitting Request...
                  </>
                ) : (
                  'Submit Shipment Request'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default UserCreateShipmentPage
