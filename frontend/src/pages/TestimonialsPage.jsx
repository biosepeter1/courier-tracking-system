import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Quote,
  BadgeCheck,
  Package,
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  Upload,
  TrendingUp,
  Users,
  ShieldCheck,
  CreditCard,
  Plane,
  Truck,
  Award as TrainIcon,
  X,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Select } from '../components/ui/select'
import { Label } from '../components/ui/label'

// Mock data for testimonials
const allTestimonials = [
  {
    id: 1,
    name: 'Aisha Bello',
    role: 'Operations Lead',
    company: 'FreshMart',
    service: 'Road',
    industry: 'eCommerce',
    rating: 5,
    date: '2025-09-15',
    quote: 'CourierTrack has transformed our last-mile deliveries. The real-time tracking and their on-time rate are fantastic.',
    fullText: 'CourierTrack has transformed our last-mile deliveries. The real-time tracking and their on-time rate are fantastic. We reduced delivery times by 35% and customer complaints dropped by 60%. Their Road Logistics service is perfect for our fresh produce delivery needs.',
    verified: true,
    route: 'Lagos → Abuja',
    weight: '50-100kg',
    featured: true,
  },
  {
    id: 2,
    name: 'James Okoro',
    role: 'Founder & CEO',
    company: 'TechHub Store',
    service: 'Air',
    industry: 'eCommerce',
    rating: 5,
    date: '2025-09-10',
    quote: 'We ship thousands of orders every month. The Express Air service gives us speed without breaking the bank.',
    fullText: 'We ship thousands of orders every month internationally. The Express Air service gives us speed without breaking the bank. Customs clearance was seamless, and the packaging protection for electronics is top-notch. Highly recommend for tech businesses.',
    verified: true,
    route: 'Lagos → London',
    weight: '10-25kg',
    featured: true,
  },
  {
    id: 3,
    name: 'Amara Mensah',
    role: 'Logistics Manager',
    company: 'BuildCo Industries',
    service: 'Rail',
    industry: 'Manufacturing',
    rating: 5,
    date: '2025-08-28',
    quote: 'Reliable tracking, clear notifications, and great support. Rail freight saved us 40% on heavy machinery transport.',
    fullText: 'Reliable tracking, clear notifications, and great support. Rail freight saved us 40% on heavy machinery transport costs. The bulk discounts and eco-friendly transport align with our sustainability goals. Their team handled all logistics planning for us.',
    verified: true,
    route: 'Port Harcourt → Kano',
    weight: '2000kg+',
    featured: true,
  },
  {
    id: 4,
    name: 'Dr. Chioma Nwosu',
    role: 'Supply Chain Director',
    company: 'MediCare Plus',
    service: 'Air',
    industry: 'Healthcare',
    rating: 5,
    date: '2025-08-20',
    quote: 'Time-critical medical supplies delivered safely. Temperature-controlled packaging and express air service were perfect.',
    fullText: 'Time-critical medical supplies delivered safely every time. Temperature-controlled packaging and express air service were perfect for our pharma shipments. The verified handling certification and insurance coverage give us peace of mind.',
    verified: true,
    route: 'Accra → Lagos',
    weight: '5-15kg',
    featured: false,
  },
  {
    id: 5,
    name: 'Michael Adeyemi',
    role: 'Operations Manager',
    company: 'FastFood Co.',
    service: 'Road',
    industry: 'eCommerce',
    rating: 4,
    date: '2025-08-15',
    quote: 'Great for daily deliveries across the city. Real-time updates help us manage customer expectations efficiently.',
    fullText: 'Great for daily deliveries across the city. Real-time updates help us manage customer expectations efficiently. Had one delayed shipment during rush hour, but customer support proactively reached out and resolved it. Overall excellent service.',
    verified: true,
    route: 'Lagos → Ikeja',
    weight: '10-30kg',
    featured: false,
  },
  {
    id: 6,
    name: 'Fatima Mohammed',
    role: 'Procurement Head',
    company: 'GreenTech Solutions',
    service: 'Rail',
    industry: 'Manufacturing',
    rating: 5,
    date: '2025-08-05',
    quote: 'Eco-friendly rail freight for our solar panels. Cost-effective and aligns with our environmental commitments.',
    fullText: 'Eco-friendly rail freight for our solar panels. Cost-effective and aligns with our environmental commitments. The team handled fragile cargo with care, and the bulk pricing made it affordable. Delivery was on schedule despite long distance.',
    verified: true,
    route: 'Johannesburg → Lagos',
    weight: '5000kg+',
    featured: false,
  },
  {
    id: 7,
    name: 'Emmanuel Okafor',
    role: 'Small Business Owner',
    company: 'Crafts & More',
    service: 'Road',
    industry: 'SMEs',
    rating: 4,
    date: '2025-07-30',
    quote: 'Affordable and reliable for my small business. Road logistics helped me expand to three new cities.',
    fullText: 'Affordable and reliable for my small business. Road logistics helped me expand to three new cities without huge upfront costs. The only issue was slightly delayed delivery during holiday season, but they kept me informed throughout.',
    verified: true,
    route: 'Abuja → Ibadan',
    weight: '5-20kg',
    featured: false,
  },
  {
    id: 8,
    name: 'Sarah Chen',
    role: 'Import Manager',
    company: 'Global Fashion Ltd',
    service: 'Air',
    industry: 'eCommerce',
    rating: 5,
    date: '2025-07-22',
    quote: 'Customs clearance was seamless. Air freight made international sourcing fast and predictable for fashion inventory.',
    fullText: 'Customs clearance was seamless. Air freight made international sourcing fast and predictable for fashion inventory. Their customs team handled all paperwork, and shipments arrived within the quoted timeframe. Insurance and tracking gave full visibility.',
    verified: true,
    route: 'Guangzhou → Lagos',
    weight: '100-200kg',
    featured: false,
  },
]

// Client logos (mock data)
const clientLogos = [
  { name: 'TechHub', color: 'text-blue-600' },
  { name: 'FreshMart', color: 'text-green-600' },
  { name: 'BuildCo', color: 'text-orange-600' },
  { name: 'MediCare', color: 'text-red-600' },
  { name: 'GreenTech', color: 'text-emerald-600' },
]

// Stats
const stats = [
  { label: 'On-time delivery', value: '98%', icon: TrendingUp },
  { label: 'Shipments delivered', value: '1.2M+', icon: Package },
  { label: 'Enterprises served', value: '450+', icon: Users },
]

// Helper Components
function Stars({ count = 5, interactive = false, onRate = null }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 transition-colors ${
            i < count ? 'text-primary fill-primary' : 'text-muted-foreground'
          } ${interactive ? 'cursor-pointer hover:text-primary' : ''}`}
          onClick={() => interactive && onRate && onRate(i + 1)}
        />
      ))}
    </div>
  )
}

function ServiceBadge({ service }) {
  const config = {
    Air: { icon: Plane, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    Road: { icon: Truck, color: 'bg-green-100 text-green-700 border-green-200' },
    Rail: { icon: TrainIcon, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  }
  const { icon: Icon, color } = config[service] || config.Road
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      <Icon className="h-3 w-3" />
      {service}
    </span>
  )
}

export default function TestimonialsPage() {
  // State
  const [currentSlide, setCurrentSlide] = useState(0)
  const [serviceFilter, setServiceFilter] = useState('All')
  const [ratingFilter, setRatingFilter] = useState('All')
  const [industryFilter, setIndustryFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCards, setExpandedCards] = useState(new Set())
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'Air',
    rating: 5,
    testimonial: '',
    consent: false,
  })
  const [formErrors, setFormErrors] = useState({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Featured testimonials for carousel
  const featuredTestimonials = allTestimonials.filter((t) => t.featured)

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredTestimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [featuredTestimonials.length])

  // Filtered testimonials
  const filteredTestimonials = useMemo(() => {
    return allTestimonials.filter((t) => {
      // Service filter
      if (serviceFilter !== 'All' && t.service !== serviceFilter) return false
      // Rating filter
      if (ratingFilter === '5★' && t.rating !== 5) return false
      if (ratingFilter === '4★+' && t.rating < 4) return false
      if (ratingFilter === '3★+' && t.rating < 3) return false
      // Industry filter
      if (industryFilter !== 'All' && t.industry !== industryFilter) return false
      // Search query
      if (searchQuery && !t.fullText.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [serviceFilter, ratingFilter, industryFilter, searchQuery])

  // Toggle expanded card
  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCards(newExpanded)
  }

  // Form validation
  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Please enter a valid email.'
    if (!formData.testimonial.trim()) errors.testimonial = 'Please share your experience.'
    if (formData.testimonial.length < 200) errors.testimonial = 'Please write at least 200 characters.'
    if (formData.testimonial.length > 800) errors.testimonial = 'Please keep it under 800 characters.'
    if (!formData.rating) errors.rating = 'Please select a rating.'
    if (!formData.consent) errors.consent = 'Please agree to have your testimonial published.'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800))
    setFormSubmitted(true)
    setFormData({
      name: '',
      email: '',
      company: '',
      service: 'Air',
      rating: 5,
      testimonial: '',
      consent: false,
    })
    setFormErrors({})
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">CourierTrack</span>
          </motion.div>
          <nav className="hidden md:flex items-center space-x-6">
            {[
              { label: 'Pricing', to: '/pricing', delay: 0.1 },
              { label: 'Testimonials', to: '/testimonials', delay: 0.15 },
              { label: 'Contact', to: '/contact', delay: 0.2 },
            ].map((link) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: link.delay }}
                whileHover={{ scale: 1.05 }}
              >
                <Link to={link.to} className="text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/services" className="text-muted-foreground hover:text-foreground">
                Services
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </motion.div>
          </nav>
        </div>
      </motion.header>

      {/* Hero / Summary */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10" />
        <div className="container mx-auto px-4 py-16 sm:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">What Our Customers Say</h1>
            <p className="text-lg text-muted-foreground mt-3">
              Real feedback from businesses and individuals who trust us with their shipments.
            </p>

            {/* Aggregate Rating */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center justify-center gap-3 mt-6"
            >
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-primary fill-primary" />
                <span className="text-3xl font-bold">4.8</span>
                <span className="text-muted-foreground">/ 5</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <span className="text-muted-foreground">from 1,234 reviews</span>
            </motion.div>

            {/* Client Logos */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-8 mt-8"
            >
              {clientLogos.map((logo, i) => (
                <motion.div
                  key={logo.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className={`text-sm font-semibold ${logo.color}`}
                >
                  {logo.name}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Verified Highlights Strip */}
      <section className="py-8 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-3">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Testimonials Carousel */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold">Featured Success Stories</h2>
            <p className="text-muted-foreground mt-2">
              Hear from industry leaders who transformed their logistics with CourierTrack
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 sm:p-12"
                >
                  {featuredTestimonials[currentSlide] && (
                    <>
                      <Quote className="h-12 w-12 text-primary/30 mb-4" />
                      <p className="text-xl sm:text-2xl font-medium mb-6">
                        "{featuredTestimonials[currentSlide].quote}"
                      </p>
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                            {featuredTestimonials[currentSlide].name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              {featuredTestimonials[currentSlide].name}
                              {featuredTestimonials[currentSlide].verified && (
                                <BadgeCheck className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {featuredTestimonials[currentSlide].role}, {featuredTestimonials[currentSlide].company}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <ServiceBadge service={featuredTestimonials[currentSlide].service} />
                          <Stars count={featuredTestimonials[currentSlide].rating} />
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentSlide((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length)
                }
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-2">
                {featuredTestimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredTestimonials.length)}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonial Grid with Filters */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold">All Customer Reviews</h2>
            <p className="text-muted-foreground mt-2">Filter by service, rating, or industry</p>
          </motion.div>

          {/* Filters */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews (e.g., fragile, express)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Service Filter */}
              <Select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
                <option value="All">All Services</option>
                <option value="Air">Air Freight</option>
                <option value="Road">Road Logistics</option>
                <option value="Rail">Rail Freight</option>
              </Select>

              {/* Rating Filter */}
              <Select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                <option value="All">All Ratings</option>
                <option value="5★">5★ Only</option>
                <option value="4★+">4★ and up</option>
                <option value="3★+">3★ and up</option>
              </Select>

              {/* Industry Filter */}
              <Select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}>
                <option value="All">All Industries</option>
                <option value="eCommerce">eCommerce</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Healthcare">Healthcare</option>
                <option value="SMEs">SMEs</option>
              </Select>
            </div>

            {/* Active Filters Display */}
            {(serviceFilter !== 'All' || ratingFilter !== 'All' || industryFilter !== 'All' || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {serviceFilter !== 'All' && (
                  <button
                    onClick={() => setServiceFilter('All')}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {serviceFilter}
                    <X className="h-3 w-3" />
                  </button>
                )}
                {ratingFilter !== 'All' && (
                  <button
                    onClick={() => setRatingFilter('All')}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {ratingFilter}
                    <X className="h-3 w-3" />
                  </button>
                )}
                {industryFilter !== 'All' && (
                  <button
                    onClick={() => setIndustryFilter('All')}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {industryFilter}
                    <X className="h-3 w-3" />
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    "{searchQuery}"
                    <X className="h-3 w-3" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setServiceFilter('All')
                    setRatingFilter('All')
                    setIndustryFilter('All')
                    setSearchQuery('')
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="max-w-6xl mx-auto mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTestimonials.length} of {allTestimonials.length} reviews
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {filteredTestimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm flex items-center gap-1">
                            {testimonial.name}
                            {testimonial.verified && <BadgeCheck className="h-3 w-3 text-primary" />}
                          </div>
                          <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                      <Stars count={testimonial.rating} />
                    </div>
                    <div className="flex items-center gap-2">
                      <ServiceBadge service={testimonial.service} />
                      <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {expandedCards.has(testimonial.id) ? testimonial.fullText : testimonial.quote}
                    </p>
                    {testimonial.fullText !== testimonial.quote && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(testimonial.id)}
                        className="mt-2 p-0 h-auto text-primary hover:bg-transparent"
                      >
                        {expandedCards.has(testimonial.id) ? 'Show less' : 'Read full review'}
                      </Button>
                    )}
                    {expandedCards.has(testimonial.id) && (
                      <div className="mt-3 pt-3 border-t text-xs text-muted-foreground space-y-1">
                        <div>Route: {testimonial.route}</div>
                        <div>Weight: {testimonial.weight}</div>
                        <div>Industry: {testimonial.industry}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTestimonials.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No reviews match your filters. Try adjusting your search criteria.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Submit Testimonial Form */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold">Share Your Experience</h2>
              <p className="text-muted-foreground mt-2">Help Others Ship Smarter — Submit Your Review</p>
            </motion.div>

            <Card>
              <CardContent className="pt-6">
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Thanks for Your Feedback!</h3>
                    <p className="text-muted-foreground mb-4">
                      We've received your testimonial and will verify it within 48 hours.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      We verify reviews to keep things honest — publication may take up to 48 hours.
                    </p>
                    <Button onClick={() => setFormSubmitted(false)} variant="outline" className="mt-6">
                      Submit Another Review
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        {formErrors.name && <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>}
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email (we'll verify ownership)"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {formErrors.email && <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company">Company (optional)</Label>
                      <Input
                        id="company"
                        placeholder="Company name (optional)"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="service">Service Used *</Label>
                        <Select
                          id="service"
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        >
                          <option value="Air">Air Freight</option>
                          <option value="Road">Road Logistics</option>
                          <option value="Rail">Rail Freight</option>
                        </Select>
                      </div>

                      <div>
                        <Label>Your Rating *</Label>
                        <div className="mt-2">
                          <Stars
                            count={formData.rating}
                            interactive
                            onRate={(rating) => setFormData({ ...formData, rating })}
                          />
                        </div>
                        {formErrors.rating && <p className="text-xs text-red-600 mt-1">{formErrors.rating}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="testimonial">Your Testimonial *</Label>
                      <Textarea
                        id="testimonial"
                        placeholder="Tell us about your experience (200–800 characters)"
                        rows={6}
                        value={formData.testimonial}
                        onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                      />
                      <div className="flex justify-between mt-1">
                        {formErrors.testimonial && (
                          <p className="text-xs text-red-600">{formErrors.testimonial}</p>
                        )}
                        <p className="text-xs text-muted-foreground ml-auto">
                          {formData.testimonial.length} / 800 characters
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="upload" className="flex items-center gap-2 cursor-pointer">
                        <Upload className="h-4 w-4" />
                        Upload Photo / Video (optional, max 50MB)
                      </Label>
                      <Input id="upload" type="file" accept="image/*,video/*" className="mt-2" />
                    </div>

                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="consent"
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="mt-1"
                      />
                      <Label htmlFor="consent" className="text-sm cursor-pointer">
                        I agree to have my testimonial published (name/company may be shown). *
                      </Label>
                    </div>
                    {formErrors.consent && <p className="text-xs text-red-600">{formErrors.consent}</p>}

                    <Button type="submit" size="lg" className="w-full sm:w-auto">
                      Submit Testimonial
                    </Button>

                    <p className="text-xs text-muted-foreground">
                      We verify reviews to keep things honest — publication may take up to 48 hours.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & CTA Panel */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Trust Badges */}
            <div className="grid gap-6 sm:grid-cols-3 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">Verified Reviews</h3>
                <p className="text-sm text-muted-foreground">All reviews verified by email</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">PCI-DSS compliant processing</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <BadgeCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">SLA-Backed Delivery</h3>
                <p className="text-sm text-muted-foreground">98% on-time guarantee</p>
              </motion.div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border bg-gradient-to-r from-primary/10 to-primary/5 p-8 text-center"
            >
              <h3 className="text-2xl font-bold mb-2">Ready to Experience World-Class Logistics?</h3>
              <p className="text-muted-foreground mb-6">
                Join 1,200+ satisfied customers shipping smarter across Air, Road, and Rail.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/quote">Request a Quote</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">Contact Support</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="border-t py-8 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              className="flex items-center space-x-2 mb-4 md:mb-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Package className="h-6 w-6 text-primary" />
              <span className="font-semibold">CourierTrack</span>
            </motion.div>
            <motion.div
              className="flex space-x-6 text-sm text-muted-foreground"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="hover:text-foreground transition-colors"
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
            </motion.div>
          </div>
          <motion.div
            className="mt-4 pt-4 border-t text-center text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            © {new Date().getFullYear()} CourierTrack. All rights reserved.
          </motion.div>
        </div>
      </motion.footer>

    </div>
  )
}
