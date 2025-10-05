import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Select } from '../components/ui/select'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Check, Package } from 'lucide-react'

export default function QuotePage() {
  // Calculator state
  const [type, setType] = useState('Air Freight')
  const [weight, setWeight] = useState('')
  const [distance, setDistance] = useState('')
  const [speed, setSpeed] = useState('Standard')

  const estimate = useMemo(() => {
    const w = parseFloat(weight) || 0
    const d = parseFloat(distance) || 0
    let cost = 0

    if (type === 'Air Freight') {
      cost = (speed === 'Express' ? 7.5 : 4.5) * w
    } else if (type === 'Road Logistics') {
      cost = (speed === 'Express' ? 2.5 : 1.5) * d
    } else if (type === 'Rail Freight') {
      cost = 0.1 * w * d
      if (w > 500) cost = cost * 0.9 // bulk discount 10%
    }
    return Math.max(0, cost)
  }, [type, weight, distance, speed])

  const friendlyEstimate = useMemo(() => {
    if (!estimate || estimate <= 0) return ''
    const currency = estimate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    if (estimate < 250) return `Good news! Your shipment is affordable — estimated cost: $${currency} USD 🚀`
    if (speed === 'Standard' && type !== 'Rail Freight') {
      const faster = (type === 'Air Freight' ? 7.5 * (parseFloat(weight) || 0) : 2.5 * (parseFloat(distance) || 0))
      const diff = faster.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      return `Estimated cost: $${currency} USD. Need it faster? Try Express Delivery for $${diff}.`
    }
    return `Estimated cost: $${currency} USD.`
  }, [estimate, speed, type, weight, distance])

  // Full quote form state
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', pickup: '', delivery: '', pWeight: '', dims: '', details: ''
  })
  const [status, setStatus] = useState('')

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setStatus('')
    // simple validation
    if (!form.name || !form.email || !form.phone || !form.pickup || !form.delivery || !form.pWeight || !form.dims) {
      setStatus('Please complete all required fields.')
      return
    }
    await new Promise((r) => setTimeout(r, 800))
    setStatus('Thank you! Your request has been received. Our team will respond within 24 hours.')
    setForm({ name: '', email: '', phone: '', company: '', pickup: '', delivery: '', pWeight: '', dims: '', details: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
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
              <Link to="/services" className="text-muted-foreground hover:text-foreground">Services</Link>
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

      {/* Hero */}
      <section className="relative">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Get a Shipping Quote</h1>
            <p className="text-muted-foreground mt-2">Use our instant calculator for a rough cost, or request a full customized quote.</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button asChild variant="outline"><Link to="/">Track Shipment</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>Quick Estimate – Get a Rough Cost Before You Book</CardTitle>
                <CardDescription>Enter a few details to see an instant estimate. For a full, customized quote, submit the form below.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="sm:col-span-1">
                    <Label>Shipment Type</Label>
                    <Select value={type} onChange={(e) => setType(e.target.value)}>
                      <option>Air Freight</option>
                      <option>Road Logistics</option>
                      <option>Rail Freight</option>
                    </Select>
                  </div>
                  <div>
                    <Label>Weight (kg)</Label>
                    <Input inputMode="decimal" placeholder="e.g., 25" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  </div>
                  <div>
                    <Label>Distance (km)</Label>
                    <Input inputMode="decimal" placeholder="e.g., 120" value={distance} onChange={(e) => setDistance(e.target.value)} />
                  </div>
                  <div>
                    <Label>Delivery Speed</Label>
                    <Select value={speed} onChange={(e) => setSpeed(e.target.value)}>
                      <option>Standard</option>
                      <option>Express</option>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 rounded-md border p-4 bg-muted/30">
                  {friendlyEstimate ? (
                    <p className="text-sm">{friendlyEstimate} <span className="block text-xs text-muted-foreground mt-1">This is an estimate. Final pricing will be confirmed after full quote submission.</span></p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Provide details to see your instant estimate.</p>
                  )}
                </div>
                <ul className="mt-4 text-xs text-muted-foreground space-y-1">
                  <li>Estimates are based on average rates and may vary depending on exact route, customs, and service options.</li>
                  <li>Insurance, packaging, and customs clearance are additional.</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Full Quote Form */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Card className="max-w-5xl mx-auto">
              <CardHeader>
                <CardTitle>Request a Full Quote</CardTitle>
                <CardDescription>Fill in your shipment details and we’ll send a comprehensive quote.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" required placeholder="Enter your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required placeholder="Enter your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" required placeholder="Enter your phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="company">Company (optional)</Label>
                    <Input id="company" placeholder="Your company name (optional)" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="pickup">Pickup Location</Label>
                    <Input id="pickup" required placeholder="City, Country" value={form.pickup} onChange={(e) => setForm({ ...form, pickup: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="delivery">Delivery Location</Label>
                    <Input id="delivery" required placeholder="City, Country" value={form.delivery} onChange={(e) => setForm({ ...form, delivery: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="pWeight">Package Weight (kg)</Label>
                    <Input id="pWeight" required inputMode="decimal" placeholder="e.g., 120" value={form.pWeight} onChange={(e) => setForm({ ...form, pWeight: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="dims">Package Dimensions (L × W × H)</Label>
                    <Input id="dims" required placeholder="e.g., 120 × 80 × 60 cm" value={form.dims} onChange={(e) => setForm({ ...form, dims: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="details">Additional Details</Label>
                    <Textarea id="details" placeholder="Tell us how we can help you" rows={5} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <Button size="lg" className="group">
                      <span>Request Full Quote</span>
                    </Button>
                  </div>
                  {status && (
                    <div className="sm:col-span-2 rounded-md border p-3 text-sm">
                      <span className="inline-flex items-center gap-2 text-green-700"><Check className="h-4 w-4" /> {status}</span>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
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
