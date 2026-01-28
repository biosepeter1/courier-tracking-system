import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Calendar, Clock, Edit, Save, X, Camera, Shield, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { authAPI } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Alert, AlertDescription } from '../components/ui/alert'
import { formatDateTime } from '../lib/utils'
import Layout from '../components/Layout'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

const ProfilePage = () => {
  const { user, setUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await authAPI.updateProfile(formData)
      if (response.data.success) {
        setUser(response.data.data.user)
        setSuccess('Profile updated successfully!')
        setIsEditing(false)
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || ''
    })
    setIsEditing(false)
    setError('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      handleImageUpload(file)
    }
  }

  const handleImageUpload = async (file) => {
    setUploadingImage(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('profileImage', file)

      const response = await authAPI.uploadProfileImage(formData)
      if (response.data.success) {
        setUser(response.data.data.user)
        setSuccess('Profile image updated successfully!')
        setImagePreview(null)
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image')
      setImagePreview(null)
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const getProfileImageUrl = () => {
    if (imagePreview) return imagePreview
    if (user?.profileImage) {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'
      return `${apiBaseUrl}${user.profileImage}`
    }
    return null
  }

  return (
    <Layout>
      <div className="relative min-h-screen bg-background/50 py-8">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your profile and preferences</p>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Alert className="border-green-500/20 bg-green-500/10 text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column: Profile Card */}
            <motion.div variants={item} className="lg:col-span-1">
              <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-xl sticky top-24">
                <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent relative">
                  <div className="absolute inset-0 bg-grid-white/10" />
                </div>
                <div className="px-6 pb-6 relative">
                  <div className="-mt-16 mb-4 flex justify-center">
                    <div className="relative group">
                      <div className="h-32 w-32 rounded-2xl bg-card p-1 shadow-2xl ring-1 ring-border/50 overflow-hidden">
                        {getProfileImageUrl() ? (
                          <img
                            src={getProfileImageUrl()}
                            alt={user?.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center">
                            <User className="h-12 w-12 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="absolute bottom-2 right-2 h-8 w-8 bg-primary text-primary-foreground rounded-lg shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                      >
                        {uploadingImage ? (
                          <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold">{user?.name}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <Shield className="h-3 w-3 mr-1" />
                      {user?.role === 'admin' ? 'Administrator' : 'Verified User'}
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        Member Since
                      </div>
                      <span className="font-medium">{formatDateTime(user?.createdAt).split(',')[0]}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        Last Active
                      </div>
                      <span className="font-medium">{user?.lastLogin ? formatDateTime(user?.lastLogin).split(',')[0] : 'Now'}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Right Column: Edit Form */}
            <motion.div variants={item} className="lg:col-span-2">
              <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="pl-9"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="pl-9"
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Shipping Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="pl-9 min-h-[100px] resize-none"
                            placeholder="Enter your full shipping address"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={handleCancel} disabled={loading}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Email Address</Label>
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                            <Mail className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">{user?.email}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Phone</Label>
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                            <Phone className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">{user?.phone || 'Not provided'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Address</Label>
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                          <MapPin className="h-4 w-4 text-primary mt-0.5" />
                          <span className="font-medium text-sm">{user?.address || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default ProfilePage
