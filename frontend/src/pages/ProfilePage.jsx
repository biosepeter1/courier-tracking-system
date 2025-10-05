import React, { useState, useEffect, useRef } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Clock, Edit, Save, X, Camera, Upload } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { authAPI } from '../lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Alert, AlertDescription } from '../components/ui/alert'
import { formatDateTime } from '../lib/utils'
import Layout from '../components/Layout'

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
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Upload image
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
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your account information
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 shadow-lg animate-fadeIn border-2">
              <AlertDescription className="font-semibold">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 shadow-lg animate-fadeIn border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
              <AlertDescription className="font-semibold text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <Card className="lg:col-span-1 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-primary/20 animate-fadeIn overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-primary via-purple-600 to-purple-700 relative">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative inline-block">
                    <div className="w-28 h-28 rounded-full overflow-hidden bg-white border-4 border-white shadow-xl flex items-center justify-center">
                      {getProfileImageUrl() ? (
                        <img
                          src={getProfileImageUrl()}
                          alt={user?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-purple-100 flex items-center justify-center">
                          <User className="h-14 w-14 text-primary" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="absolute bottom-1 right-1 bg-gradient-to-br from-primary to-purple-600 text-white p-2.5 rounded-full hover:scale-110 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                      title="Upload profile image"
                    >
                      {uploadingImage ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Camera className="h-5 w-5 group-hover:scale-110 transition-transform" />
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
              </div>
              <CardContent className="pt-16 pb-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{user?.name}</h2>
                  <p className="text-base text-gray-800 mb-3 font-bold">{user?.email}</p>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-md ${
                    user?.role === 'admin' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' 
                      : 'bg-gradient-to-r from-primary to-blue-600 text-white'
                  }`}>
                    {user?.role === 'admin' ? (
                      <>
                        <User className="h-3.5 w-3.5" />
                        Administrator
                      </>
                    ) : (
                      <>
                        <User className="h-3.5 w-3.5" />
                        User
                      </>
                    )}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-primary/5 to-purple-50 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center text-sm font-semibold text-gray-800">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mr-3">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-700 font-bold uppercase tracking-wide mb-1">Member Since</p>
                        <p className="font-extrabold text-gray-900 text-base">{formatDateTime(user?.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  {user?.lastLogin && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center text-sm font-semibold text-gray-800">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mr-3">
                          <Clock className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-700 font-bold uppercase tracking-wide mb-1">Last Active</p>
                          <p className="font-extrabold text-gray-900 text-base">{formatDateTime(user?.lastLogin)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Profile Details Card */}
            <Card className="lg:col-span-2 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-primary/20 animate-fadeIn">
              <CardHeader className="bg-gradient-to-r from-primary/5 via-purple-50 to-white border-b border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md">
                        <Edit className="h-5 w-5 text-white" />
                      </div>
                      Profile Information
                    </CardTitle>
                    <CardDescription className="mt-2 ml-12 font-bold text-gray-700">Update your personal details and contact information</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button 
                      className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPin className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                        <Textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter your address"
                          rows={3}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <>Saving...</>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-primary/5 to-purple-50 rounded-lg p-4">
                      <Label className="text-gray-700 font-bold text-sm uppercase tracking-wide mb-2 block">Email Address</Label>
                      <div className="flex items-center mt-2">
                        <Mail className="h-5 w-5 text-primary mr-3" />
                        <p className="text-gray-900 font-bold text-base">{user?.email}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                      <Label className="text-gray-700 font-bold text-sm uppercase tracking-wide mb-2 block">Full Name</Label>
                      <div className="flex items-center mt-2">
                        <User className="h-5 w-5 text-blue-600 mr-3" />
                        <p className="text-gray-900 font-bold text-base">{user?.name || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                      <Label className="text-gray-700 font-bold text-sm uppercase tracking-wide mb-2 block">Phone Number</Label>
                      <div className="flex items-center mt-2">
                        <Phone className="h-5 w-5 text-purple-600 mr-3" />
                        <p className="text-gray-900 font-bold text-base">{user?.phone || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                      <Label className="text-gray-700 font-bold text-sm uppercase tracking-wide mb-2 block">Address</Label>
                      <div className="flex items-start mt-2">
                        <MapPin className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-900 font-bold text-base leading-relaxed">{user?.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProfilePage
