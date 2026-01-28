import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Package, Eye, EyeOff, Mail, Lock, ShieldCheck, Truck, ArrowRight, Globe, BarChart3 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80",
    title: "Global Logistics Network",
    desc: "Seamless shipping to over 200 countries worldwide with real-time tracking.",
    color: "bg-blue-900",
    icon: Globe
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
    title: "Real-Time Analytics",
    desc: "Monitor your supply chain performance with advanced data visualization.",
    color: "bg-indigo-900",
    icon: BarChart3
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80",
    title: "Secure Warehousing",
    desc: "State-of-the-art storage facilities ensuring your cargo is safe 24/7.",
    color: "bg-slate-900",
    icon: ShieldCheck
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
    title: "Expert Support Team",
    desc: "Dedicated logistics specialists ready to assist you at every step.",
    color: "bg-orange-900",
    icon: Truck
  }
]

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  const { login, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, authLoading, navigate])

  // Preload all carousel images
  useEffect(() => {
    let loadedCount = 0
    const totalImages = slides.length

    slides.forEach((slide) => {
      const img = new Image()
      img.src = slide.image
      img.onload = () => {
        loadedCount++
        if (loadedCount === totalImages) {
          setImagesLoaded(true)
        }
      }
      img.onerror = () => {
        loadedCount++
        if (loadedCount === totalImages) {
          setImagesLoaded(true)
        }
      }
    })
  }, [])

  // Carousel timer - only start after images loaded
  useEffect(() => {
    if (!imagesLoaded) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [imagesLoaded])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const toastId = toast.loading('Accesing secure portal...', {
      icon: '🔐',
    })
    setLoading(true)

    try {
      const result = await login(formData)
      if (result.success) {
        const userName = result.user?.name || 'User'
        toast.success(
          <div>
            <div className="font-bold">Welcome back, {userName}!</div>
            <div className="text-xs mt-1 opacity-80">Dashboard loaded successfully</div>
          </div>,
          { id: toastId, duration: 4000, icon: '👋' }
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground font-medium">Loading secure session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background font-sans selection:bg-primary/10">
      {/* Left Carousel Panel */}
      <section className="hidden lg:flex flex-col relative overflow-hidden bg-slate-900 text-primary-foreground h-full">
        <div className="absolute top-8 left-8 z-30">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all border border-white/10">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">CourierTrack</span>
          </Link>
        </div>

        {imagesLoaded ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 z-0"
              >
                {/* Background Image */}
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  className="w-full h-full object-cover"
                />

                {/* Text Content - inside same motion.div */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-16">
                  <div className="max-w-lg">
                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                      {React.createElement(slides[currentSlide].icon, { className: "h-6 w-6 text-white" })}
                    </div>
                    <h2 className="text-4xl font-bold mb-4 tracking-tight leading-tight text-white">
                      {slides[currentSlide].title}
                    </h2>
                    <p className="text-lg text-white/80 leading-relaxed">
                      {slides[currentSlide].desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide indicators - outside AnimatePresence so they don't animate */}
            <div className="absolute bottom-8 left-16 z-30 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <div className="h-12 w-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </section>

      {/* Right Form Panel */}
      <section className="flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10" />

        <div className="w-full max-w-[420px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 text-center"
          >
            <div className="flex justify-center lg:hidden mb-6">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Package className="h-6 w-6" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline underline-offset-4">
                Create one now
              </Link>
            </p>
          </motion.div>

          <Card className="border-border/40 shadow-xl bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              {error && (
                <Alert variant="destructive" className="mb-6 rounded-xl animate-in fade-in slide-in-from-top-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-semibold">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-11 h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all font-medium"
                      placeholder="name@company.com"
                    />
                    <Mail className="h-5 w-5 text-muted-foreground absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-base font-semibold">Password</Label>
                    <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-11 pr-11 h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all font-medium"
                      placeholder="••••••••"
                    />
                    <Lock className="h-5 w-5 text-muted-foreground absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="remember-me" className="text-sm cursor-pointer font-normal text-muted-foreground">Keep me signed in for 30 days</Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl text-base font-bold shadow-lg hover:shadow-primary/25 transition-all mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Signing In...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-8 max-w-xs mx-auto">
            Protected by reCAPTCHA and subject to the Google <a href="#" className="underline">Privacy Policy</a> and <a href="#" className="underline">Terms of Service</a>.
          </p>
        </div>
      </section>
    </div>
  )
}

export default LoginPage