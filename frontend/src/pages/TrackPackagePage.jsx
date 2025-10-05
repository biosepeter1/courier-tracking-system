import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Package, MapPin, Clock, Truck, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Alert, AlertDescription } from '../components/ui/alert'
import Layout from '../components/Layout'

const TrackPackagePage = () => {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (trackingNumber.trim()) {
      navigate(`/track/${trackingNumber.trim().toUpperCase()}`)
    }
  }

  const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]').slice(0, 5)

  const handleRecentClick = (number) => {
    setTrackingNumber(number)
    navigate(`/track/${number}`)
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Package</h1>
            <p className="text-gray-600">
              Enter your tracking number to get real-time updates on your shipment
            </p>
          </div>

          {/* Search Card */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label htmlFor="tracking-input" className="sr-only">Tracking Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="tracking-input"
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number (e.g., CT123456ABCD)"
                      className="pl-10 text-lg h-14"
                      autoFocus
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-lg" disabled={!trackingNumber.trim()}>
                  <Search className="mr-2 h-5 w-5" />
                  Track Package
                </Button>
              </form>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Searches</CardTitle>
                <CardDescription>Your recently tracked packages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentSearches.map((number, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(number)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="font-medium text-gray-900">{number}</span>
                      </div>
                      <Search className="h-4 w-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Real-Time Tracking</h3>
                <p className="text-sm text-gray-600">Get live updates on your package location and status</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Detailed History</h3>
                <p className="text-sm text-gray-600">View complete journey of your shipment with timestamps</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive automatic updates when status changes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default TrackPackagePage
