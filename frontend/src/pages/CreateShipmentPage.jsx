import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowRight,
  Box,
  Truck,
  CheckCircle2,
  AlertCircle,
  Scale,
  DollarSign,
  FileText,
  CreditCard
} from 'lucide-react'
import { shipmentAPI, authAPI } from '../lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select } from '../components/ui/select'
import { Alert, AlertDescription } from '../components/ui/alert'
import { DatePicker } from '../components/ui/datepicker'
import Layout from '../components/Layout'
import { cn } from '../lib/utils'

const containerVideo = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVideo = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

const CreateShipmentPage = () => {
  const [formData, setFormData] = useState({
    sender: {
      name: '',
      phone: '',
      address: '',
      email: ''
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
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      const response = await authAPI.listUsers()
      if (response.data.success) {
        setUsers(response.data.data.users)
      }
    } catch (err) {
      console.error('Failed to load users:', err)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleUserSelect = (e) => {
    const userId = e.target.value
    setSelectedUserId(userId)
    if (userId) {
      const user = users.find(u => u._id === userId)
      if (user) {
        setFormData(prev => ({
          ...prev,
          receiver: {
            ...prev.receiver,
            email: user.email,
            name: user.name
          }
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        receiver: {
          name: '',
          email: '',
          phone: '',
          address: ''
        }
      }))
    }
  }

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

    const toastId = toast.loading('Creating shipment...', {
      icon: '🚚',
    })
    setLoading(true)

    try {
      // Build shipment data, omitting empty optional fields
      const shipmentData = {
        sender: {
          name: formData.sender.name,
          phone: formData.sender.phone,
          address: formData.sender.address,
          ...(formData.sender.email && { email: formData.sender.email })
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

      console.log('Sending shipment data:', JSON.stringify(shipmentData, null, 2))

      const response = await shipmentAPI.create(shipmentData)

      if (response.data.success) {
        const trackingNumber = response.data.data.shipment.trackingNumber
        setSuccess(`Shipment created successfully! Tracking number: ${trackingNumber}`)

        toast.success(
          <div>
            <div className="font-bold">Shipment Created! 🚀</div>
            <div className="text-sm mt-1">Tracking: <span className="font-mono font-semibold">{trackingNumber}</span></div>
            <div className="text-xs mt-1 text-gray-600">Email notifications sent to sender & receiver</div>
          </div>,
          {
            id: toastId,
            duration: 6000,
            icon: '✅',
          }
        )

        setTimeout(() => {
          navigate('/admin/shipments')
        }, 2000)
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

  const InputGroup = ({ icon: Icon, children, className }) => (
    <div className={cn("relative", className)}>
      <div className="absolute left-3 top-3 text-muted-foreground/50">
        <Icon className="h-5 w-5" />
      </div>
      <div className="[&>input]:pl-10 [&>textarea]:pl-10 [&>select]:pl-10">
        {children}
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="relative min-h-screen bg-background/50 pb-20">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/shipments')}
              className="pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-primary mb-4"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" /> Back to Shipments
            </Button>
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Create New Shipment
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Enter shipment details to generate a tracking number and start processing.
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8"
            >
              <Alert variant="destructive" className="border-red-500/20 bg-red-500/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <motion.div
              variants={containerVideo}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {/* Sender & Receiver Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Sender Information */}
                <motion.div variants={itemVideo}>
                  <Card className="h-full border-border/50 bg-card/50 backdrop-blur-xl shadow-lg hover:shadow-primary/5 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
                        <User className="h-6 w-6" />
                      </div>
                      <CardTitle>Sender Information</CardTitle>
                      <CardDescription>Who is sending this package?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <InputGroup icon={User}>
                          <Input
                            name="sender.name"
                            required
                            value={formData.sender.name}
                            onChange={handleChange}
                            placeholder="Sender Name"
                            className="bg-background/50 border-white/10 focus:border-primary/50 transition-all hover:bg-background/80"
                          />
                        </InputGroup>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Phone Number</Label>
                          <InputGroup icon={Phone}>
                            <Input
                              name="sender.phone"
                              required
                              value={formData.sender.phone}
                              onChange={handleChange}
                              placeholder="+1 (555)..."
                              className="bg-background/50 border-white/10"
                            />
                          </InputGroup>
                        </div>
                        <div className="space-y-2">
                          <Label>Email (Optional)</Label>
                          <InputGroup icon={Mail}>
                            <Input
                              name="sender.email"
                              type="email"
                              value={formData.sender.email}
                              onChange={handleChange}
                              placeholder="sender@email.com"
                              className="bg-background/50 border-white/10"
                            />
                          </InputGroup>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Origin City/State</Label>
                        <InputGroup icon={MapPin}>
                          <Input
                            name="origin"
                            required
                            value={formData.origin}
                            onChange={handleChange}
                            placeholder="City, State, Country"
                            className="bg-background/50 border-white/10"
                          />
                        </InputGroup>
                      </div>

                      <div className="space-y-2">
                        <Label>Full Address</Label>
                        <InputGroup icon={MapPin}>
                          <Textarea
                            name="sender.address"
                            required
                            rows={3}
                            value={formData.sender.address}
                            onChange={handleChange}
                            placeholder="Complete street address..."
                            className="bg-background/50 border-white/10 resize-none pt-3"
                          />
                        </InputGroup>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Receiver Information */}
                <motion.div variants={itemVideo}>
                  <Card className="h-full border-border/50 bg-card/50 backdrop-blur-xl shadow-lg hover:shadow-primary/5 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                        <Truck className="h-6 w-6" />
                      </div>
                      <CardTitle>Receiver Information</CardTitle>
                      <CardDescription>Where is this package going?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-4">
                        <Label className="text-secondary-foreground mb-2 block">Quick Select User</Label>
                        <Select
                          value={selectedUserId}
                          onChange={handleUserSelect}
                          disabled={loadingUsers}
                        >
                          <option value="">-- Manual Entry --</option>
                          {users.map(user => (
                            <option key={user._id} value={user._id}>
                              {user.name} ({user.email})
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <InputGroup icon={User}>
                          <Input
                            name="receiver.name"
                            required
                            value={formData.receiver.name}
                            onChange={handleChange}
                            placeholder="Receiver Name"
                            className="bg-background/50 border-white/10"
                          />
                        </InputGroup>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Phone Number</Label>
                          <InputGroup icon={Phone}>
                            <Input
                              name="receiver.phone"
                              required
                              value={formData.receiver.phone}
                              onChange={handleChange}
                              placeholder="+1 (555)..."
                              className="bg-background/50 border-white/10"
                            />
                          </InputGroup>
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <InputGroup icon={Mail}>
                            <Input
                              name="receiver.email"
                              type="email"
                              required
                              value={formData.receiver.email}
                              onChange={handleChange}
                              placeholder="receiver@email.com"
                              className="bg-background/50 border-white/10"
                            />
                          </InputGroup>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Destination City/State</Label>
                        <InputGroup icon={MapPin}>
                          <Input
                            name="destination"
                            required
                            value={formData.destination}
                            onChange={handleChange}
                            placeholder="City, State, Country"
                            className="bg-background/50 border-white/10"
                          />
                        </InputGroup>
                      </div>

                      <div className="space-y-2">
                        <Label>Full Address</Label>
                        <InputGroup icon={MapPin}>
                          <Textarea
                            name="receiver.address"
                            required
                            rows={3}
                            value={formData.receiver.address}
                            onChange={handleChange}
                            placeholder="Complete street address..."
                            className="bg-background/50 border-white/10 resize-none pt-3"
                          />
                        </InputGroup>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Package Details & Options */}
              <motion.div variants={itemVideo}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle>Shipment Details</CardTitle>
                        <CardDescription>Package specifications and delivery options</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label>Weight (kg)</Label>
                        <InputGroup icon={Scale}>
                          <Input
                            name="packageDetails.weight"
                            type="number"
                            step="0.1"
                            value={formData.packageDetails.weight}
                            onChange={handleChange}
                            placeholder="0.00"
                            className="bg-background/50 border-white/10"
                          />
                        </InputGroup>
                      </div>
                      <div className="space-y-2">
                        <Label>Declared Value</Label>
                        <InputGroup icon={DollarSign}>
                          <Input
                            name="packageDetails.value"
                            type="number"
                            value={formData.packageDetails.value}
                            onChange={handleChange}
                            placeholder="0.00"
                            className="bg-background/50 border-white/10"
                          />
                        </InputGroup>
                      </div>
                      <div className="space-y-2">
                        <Label>Dimensions (LxWxH cm)</Label>
                        <div className="flex gap-2">
                          <Input
                            name="packageDetails.dimensions.length"
                            placeholder="L"
                            className="bg-background/50 border-white/10 text-center px-1"
                            onChange={handleChange}
                          />
                          <Input
                            name="packageDetails.dimensions.width"
                            placeholder="W"
                            className="bg-background/50 border-white/10 text-center px-1"
                            onChange={handleChange}
                          />
                          <Input
                            name="packageDetails.dimensions.height"
                            placeholder="H"
                            className="bg-background/50 border-white/10 text-center px-1"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Package Description</Label>
                        <InputGroup icon={FileText}>
                          <Textarea
                            name="packageDetails.description"
                            rows={3}
                            value={formData.packageDetails.description}
                            onChange={handleChange}
                            placeholder="Describe the contents..."
                            className="bg-background/50 border-white/10 resize-none pt-3"
                          />
                        </InputGroup>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Shipping Priority</Label>
                          <div className="relative">
                            <Select
                              name="priority"
                              value={formData.priority}
                              onChange={handleChange}
                              className="bg-background/50 border-white/10 w-full"
                            >
                              <option value="Low">Low Priority</option>
                              <option value="Normal">Normal Priority</option>
                              <option value="High">High Priority</option>
                              <option value="Urgent">Urgent</option>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Estimated Delivery</Label>
                          <div className="relative">
                            <DatePicker
                              selected={formData.estimatedDelivery}
                              onChange={(date) => setFormData(prev => ({ ...prev, estimatedDelivery: date }))}
                              minDate={new Date()}
                              placeholderText="Select Date"
                              className="w-full bg-background/50 border-white/10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Actions */}
              <motion.div
                variants={itemVideo}
                className="flex items-center justify-end gap-4 pt-4"
              >
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/admin/shipments')}
                  disabled={loading}
                  className="rounded-xl px-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="rounded-xl px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/20 transition-all"
                >
                  {loading ? (
                    <>
                      <Package className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Shipment <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default CreateShipmentPage