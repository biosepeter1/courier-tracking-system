import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Package, Eye, EyeOff, Mail, Lock, ShieldCheck, Truck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, authLoading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const toastId = toast.loading('Signing in...', {
      icon: '🔑',
    })
    setLoading(true)

    try {
      const result = await login(formData)
      if (result.success) {
        const userName = result.user?.name || 'User'
        const userRole = result.user?.role || 'user'
        
        toast.success(
          <div>
            <div className="font-bold">Welcome back, {userName}! 🎉</div>
            <div className="text-xs mt-1 text-gray-600">Logged in as {userRole}</div>
          </div>,
          {
            id: toastId,
            duration: 4000,
            icon: '✅',
          }
        )
        
        navigate('/dashboard')
      } else {
        setError(result.message)
        toast.error(result.message || 'Login failed', { id: toastId })
      }
    } catch (err) {
      const errorMsg = 'An unexpected error occurred'
      setError(errorMsg)
      toast.error(errorMsg, { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left brand panel */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-between p-12 border-r relative overflow-hidden bg-background/60"
        >
          {/* Background accents */}
          <motion.div
            className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
            animate={{ y: [0, 12, 0], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
            animate={{ y: [0, -12, 0], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <Package className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">CourierTrack</span>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight">
              Fast, secure, reliable delivery
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md">
              Track your shipments in real‑time and manage everything from one dashboard.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-2"><ShieldCheck className="h-5 w-5 text-primary mt-0.5" /> 98% on‑time delivery with SLA‑backed service</li>
              <li className="flex items-start gap-2"><Truck className="h-5 w-5 text-primary mt-0.5" /> Door‑to‑door pickup and delivery</li>
              <li className="flex items-start gap-2"><Package className="h-5 w-5 text-primary mt-0.5" /> Insurance and real‑time notifications</li>
            </ul>
          </div>

          <div className="relative z-10 text-sm text-muted-foreground">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="underline">Terms</Link> and{' '}
            <Link to="/privacy" className="underline">Privacy Policy</Link>.
          </div>
        </motion.section>

        {/* Right form panel */}
        <section className="flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="flex justify-center lg:hidden mb-4">
                <Package className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-center text-2xl font-bold">Sign in to your account</h2>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Or{' '}
                <Link to="/register" className="font-medium text-primary hover:text-primary/80">
                  create a new account
                </Link>
              </p>
            </motion.div>

            <Card className="mt-6 shadow-sm">
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="Enter your email"
                      />
                      <Mail className="h-5 w-5 text-muted-foreground absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 pr-10"
                        placeholder="Enter your password"
                      />
                      <Lock className="h-5 w-5 text-muted-foreground absolute left-3 top-2.5" />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                      />
                      <Label htmlFor="remember-me" className="ml-2 text-sm">Remember me</Label>
                    </div>

                    <div className="text-sm">
                      <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Package className="h-4 w-4 animate-spin mr-2" /> Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to home</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LoginPage