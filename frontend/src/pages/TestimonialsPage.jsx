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
  MessageSquare,
  ArrowRight
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Select } from '../components/ui/select'
import { Label } from '../components/ui/label'
import PublicHeader from '../components/PublicHeader'

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
          className={`h-4 w-4 transition-all ${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'
            } ${interactive ? 'cursor-pointer hover:scale-110' : ''}`}
          onClick={() => interactive && onRate && onRate(i + 1)}
        />
      ))}
    </div>
  )
}

function ServiceBadge({ service }) {
  const config = {
    Air: { icon: Plane, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    Road: { icon: Truck, color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    Rail: { icon: TrainIcon, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  }
  const { icon: Icon, color } = config[service] || config.Road
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      <Icon className="h-3.5 w-3.5" />
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
    if (formData.testimonial.length < 20) errors.testimonial = 'Please write at least 20 characters.'
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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
      {/* Header */}
      <PublicHeader />

      {/* Hero / Summary */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-sm bg-background/50 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2" />
              Trusted by Industry Leaders
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              What Our Customers Say
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Real feedback from businesses and individuals who trust us with their shipments every day.
            </p>

            {/* Aggregate Rating */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center justify-center gap-6 mt-8 p-4 rounded-2xl bg-muted/30 backdrop-blur-sm inline-flex border border-border/50"
            >
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                <div>
                  <div className="text-3xl font-bold leading-none">4.8</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Average Rating</div>
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-left">
                <div className="text-xl font-bold leading-none">1,234+</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Verified Reviews</div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Verified Highlights Strip */}
      <section className="py-12 bg-muted/20 border-y">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-3">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 justify-center sm:justify-start"
                >
                  <div className="h-14 w-14 rounded-2xl bg-background shadow-sm border flex items-center justify-center">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Testimonials Carousel */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Featured Success Stories</h2>
            <p className="text-muted-foreground text-lg">
              Hear from industry leaders who transformed their logistics with CourierTrack.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-[2.5rem] border bg-card shadow-2xl overflow-hidden min-h-[400px] flex items-center">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Quote className="h-64 w-64 rotate-12" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                  className="p-8 sm:p-16 w-full relative z-10"
                >
                  {featuredTestimonials[currentSlide] && (
                    <div className="grid md:grid-cols-[1fr,300px] gap-12 items-center">
                      <div className="space-y-8">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <blockquote className="text-2xl sm:text-3xl font-medium leading-relaxed">
                          "{featuredTestimonials[currentSlide].quote}"
                        </blockquote>
                        <div>
                          <div className="font-bold text-xl flex items-center gap-2">
                            {featuredTestimonials[currentSlide].name}
                            {featuredTestimonials[currentSlide].verified && (
                              <BadgeCheck className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div className="text-muted-foreground">
                            {featuredTestimonials[currentSlide].role}, {featuredTestimonials[currentSlide].company}
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-2xl p-6 border border-border/50">
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Shipment Details</h4>
                        <div className="space-y-4 text-sm">
                          <div className="flex justify-between items-center pb-3 border-b border-border/50">
                            <span className="text-muted-foreground">Service</span>
                            <ServiceBadge service={featuredTestimonials[currentSlide].service} />
                          </div>
                          <div className="flex justify-between items-center pb-3 border-b border-border/50">
                            <span className="text-muted-foreground">Route</span>
                            <span className="font-medium">{featuredTestimonials[currentSlide].route}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Weight</span>
                            <span className="font-medium">{featuredTestimonials[currentSlide].weight}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center justify-center gap-6 mt-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                onClick={() =>
                  setCurrentSlide((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length)
                }
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex gap-3">
                {featuredTestimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-10 bg-primary' : 'w-2 bg-muted hover:bg-primary/30'
                      }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredTestimonials.length)}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Grid with Filters */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-4">All Customer Reviews</h2>
            <p className="text-muted-foreground text-lg">Filter by service, rating, or industry to find relevant feedback.</p>
          </motion.div>

          {/* Filters */}
          <div className="max-w-6xl mx-auto mb-10 sticky top-20 z-20 bg-background/80 backdrop-blur-md p-4 rounded-2xl border shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 items-center">
              {/* Search */}
              <div className="lg:col-span-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-muted/30 border-transparent focus:bg-background transition-all"
                  />
                </div>
              </div>

              {/* Filters Group */}
              <div className="lg:col-span-8 flex flex-wrap gap-2 lg:justify-end">
                <Select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
                  <option value="All">All Services</option>
                  <option value="Air">Air Freight</option>
                  <option value="Road">Road Logistics</option>
                  <option value="Rail">Rail Freight</option>
                </Select>

                <Select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                  <option value="All">All Ratings</option>
                  <option value="5★">5★ Only</option>
                  <option value="4★+">4★ and up</option>
                  <option value="3★+">3★ and up</option>
                </Select>

                <Select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}>
                  <option value="All">All Industries</option>
                  <option value="eCommerce">eCommerce</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="SMEs">SMEs</option>
                </Select>

                {(serviceFilter !== 'All' || ratingFilter !== 'All' || industryFilter !== 'All' || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setServiceFilter('All')
                      setRatingFilter('All')
                      setIndustryFilter('All')
                      setSearchQuery('')
                    }}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center border-b pb-4">
            <p className="text-sm font-medium text-muted-foreground">
              Showing <span className="text-foreground font-bold">{filteredTestimonials.length}</span> results
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
                <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/60 rounded-2xl group">
                  <CardHeader className="p-6 pb-2">
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm flex items-center gap-1.5">
                            {testimonial.name}
                            {testimonial.verified && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
                          </div>
                          <div className="text-xs text-muted-foreground font-medium">{testimonial.role}</div>
                        </div>
                      </div>
                      <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                        <Stars count={testimonial.rating} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <ServiceBadge service={testimonial.service} />
                      <span className="text-xs text-muted-foreground font-medium">{testimonial.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-2">
                    <div className="relative">
                      <Quote className="absolute -top-1 -left-1 h-6 w-6 text-muted-foreground/10 rotate-180" />
                      <p className="text-sm text-muted-foreground/90 leading-relaxed pl-4 border-l-2 border-primary/20">
                        {expandedCards.has(testimonial.id) ? testimonial.fullText : testimonial.quote}
                      </p>
                    </div>

                    {testimonial.fullText !== testimonial.quote && (
                      <button
                        onClick={() => toggleExpanded(testimonial.id)}
                        className="mt-3 text-xs font-semibold text-primary hover:underline flex items-center"
                      >
                        {expandedCards.has(testimonial.id) ? 'Show less' : 'Read full review'}
                      </button>
                    )}

                    {expandedCards.has(testimonial.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-dashed bg-muted/20 -mx-6 -mb-6 p-4 rounded-b-2xl"
                      >
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground block">Route</span>
                            <span className="font-medium">{testimonial.route}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Weight</span>
                            <span className="font-medium">{testimonial.weight}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground block">Industry</span>
                            <span className="font-medium">{testimonial.industry}</span>
                          </div>
                        </div>
                      </motion.div>
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
              className="text-center py-20"
            >
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No reviews found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                No reviews match your specific filters. Try adjusting your search criteria or clearing filters.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setServiceFilter('All')
                  setRatingFilter('All')
                  setIndustryFilter('All')
                  setSearchQuery('')
                }}
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Submit Testimonial Form */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-top-left transform scale-110"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold mb-4">Share Your Experience</h2>
              <p className="text-muted-foreground text-lg">Help others ship smarter. Your feedback drives our innovation.</p>
            </motion.div>

            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm bg-background/80">
              <CardContent className="p-8 sm:p-10">
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                      <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Thanks for Your Feedback!</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      We've received your testimonial and will verify it within 48 hours. Thank you for helping us improve.
                    </p>
                    <div className="p-4 bg-muted/50 rounded-xl max-w-sm mx-auto mb-8 text-sm text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 inline mr-2 text-primary" />
                      We verify reviews to ensure authenticity.
                    </div>
                    <Button onClick={() => setFormSubmitted(false)} variant="outline" size="lg" className="rounded-full px-8">
                      Submit Another Review
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base font-semibold">Full Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="name"
                          className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all"
                          placeholder="Ex. John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        {formErrors.name && <p className="text-xs text-red-600 font-medium">{formErrors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base font-semibold">Email Address <span className="text-red-500">*</span></Label>
                        <Input
                          id="email"
                          type="email"
                          className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all"
                          placeholder="john@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {formErrors.email && <p className="text-xs text-red-600 font-medium">{formErrors.email}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-base font-semibold">Company Name (Optional)</Label>
                      <Input
                        id="company"
                        className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all"
                        placeholder="Ex. Acme Logistics Ltd."
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="service" className="text-base font-semibold">Service Used <span className="text-red-500">*</span></Label>
                        <Select
                          id="service"
                          className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all"
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        >
                          <option value="Air">Air Freight</option>
                          <option value="Road">Road Logistics</option>
                          <option value="Rail">Rail Freight</option>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base font-semibold">Your Rating <span className="text-red-500">*</span></Label>
                        <div className="h-12 flex items-center px-4 rounded-xl bg-muted/30 border border-transparent">
                          <Stars
                            count={formData.rating}
                            interactive
                            onRate={(rating) => setFormData({ ...formData, rating })}
                          />
                          <span className="ml-3 text-sm font-bold text-muted-foreground">{formData.rating}/5</span>
                        </div>
                        {formErrors.rating && <p className="text-xs text-red-600 font-medium">{formErrors.rating}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="testimonial" className="text-base font-semibold">Your Review <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="testimonial"
                        className="min-h-[150px] rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all resize-y p-4"
                        placeholder="Share details about your shipping experience, delivery speed, and customer service..."
                        value={formData.testimonial}
                        onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                      />
                      <div className="flex justify-between mt-1 px-1">
                        {formErrors.testimonial ? (
                          <p className="text-xs text-red-600 font-medium">{formErrors.testimonial}</p>
                        ) : (
                          <span></span>
                        )}
                        <p className={`text-xs font-medium ${formData.testimonial.length > 800 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {formData.testimonial.length} / 800
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center h-5">
                          <input
                            id="consent"
                            type="checkbox"
                            checked={formData.consent}
                            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                        <label htmlFor="consent" className="text-sm text-muted-foreground leading-tight">
                          I confirm that this review is based on my genuine experience and I authorize CourierTrack to publish this testimonial.
                        </label>
                      </div>
                      {formErrors.consent && <p className="text-xs text-red-600 font-medium ml-7">{formErrors.consent}</p>}
                    </div>

                    <Button type="submit" size="lg" className="w-full h-14 rounded-xl text-lg font-bold shadow-lg hover:shadow-primary/25 transition-all">
                      Submit Review <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Package className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">CourierTrack</span>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground font-medium">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link>
            </div>

            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CourierTrack. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
