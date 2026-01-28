import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Select } from '../components/ui/select'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Check, Package, Calculator, ArrowRight, Truck, Plane, TrainFront, Info } from 'lucide-react'
import PublicHeader from '../components/PublicHeader'

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
    if (estimate < 250) return `Estimated cost: $${currency} USD`
    return `Estimated cost: $${currency} USD`
  }, [estimate])

  // Full quote form state
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', pickup: '', delivery: '', pWeight: '', dims: '', details: ''
  })
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setStatus('')
    // simple validation
    if (!form.name || !form.email || !form.phone || !form.pickup || !form.delivery || !form.pWeight || !form.dims) {
      setStatus('Please complete all required fields.')
      return
    }

    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSubmitting(false)

    setStatus('Request sent! We will respond within 24 hours.')
    setForm({ name: '', email: '', phone: '', company: '', pickup: '', delivery: '', pWeight: '', dims: '', details: '' })
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10 text-foreground">
      {/* Header */}
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-sm bg-background/50 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2" />
              Instant Estimations Available
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              Get Your Shipping Quote
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Use our calculator for a quick rough estimate, or fill out the detailed form for a guaranteed custom rate valid for 7 days.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-5xl mx-auto border-none shadow-2xl bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden ring-1 ring-border/50">
              <div className="h-2 w-full bg-gradient-to-r from-primary to-blue-600" />
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Calculator className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">Quick Cost Estimator</CardTitle>
                      <CardDescription className="text-base">Get a rough price in seconds</CardDescription>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5" /> Data based on current market rates
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-end">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Shipment Type</Label>
                    <div className="relative">
                      <Select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all appearance-none"
                      >
                        <option>Air Freight</option>
                        <option>Road Logistics</option>
                        <option>Rail Freight</option>
                      </Select>
                      <div className="absolute right-3 top-3.5 pointer-events-none text-muted-foreground">
                        {type === 'Air Freight' && <Plane className="h-5 w-5" />}
                        {type === 'Road Logistics' && <Truck className="h-5 w-5" />}
                        {type === 'Rail Freight' && <TrainFront className="h-5 w-5" />}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Weight (kg)</Label>
                    <Input
                      inputMode="decimal"
                      placeholder="e.g., 25"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Distance (km)</Label>
                    <Input
                      inputMode="decimal"
                      placeholder="e.g., 120"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Speed</Label>
                    <Select
                      value={speed}
                      onChange={(e) => setSpeed(e.target.value)}
                      className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all appearance-none"
                    >
                      <option>Standard</option>
                      <option>Express (+40%)</option>
                    </Select>
                  </div>
                </div>

                <motion.div
                  className="mt-8 rounded-2xl p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4"
                  layout
                >
                  <div>
                    <h4 className="font-bold text-muted-foreground uppercase text-xs tracking-wider mb-1">Estimated Cost</h4>
                    {friendlyEstimate ? (
                      <p className="text-3xl font-black text-foreground tracking-tight">{friendlyEstimate}</p>
                    ) : (
                      <p className="text-xl text-muted-foreground/60 italic">Enter details to Calculate...</p>
                    )}
                  </div>
                  {estimate > 0 && (
                    <div className="text-right">
                      <Button variant="default" className="rounded-full shadow-lg h-10" onClick={() => document.getElementById('full-quote').scrollIntoView({ behavior: 'smooth' })}>
                        Lock in this Rate <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 max-w-[200px] ml-auto">
                        *Estimate only. Final price may vary by ±10%.
                      </p>
                    </div>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Full Quote Form */}
      <section id="full-quote" className="py-20 relative">
        <div className="absolute top-1/2 left-0 w-full h-[500px] bg-gradient-to-b from-transparent via-muted/20 to-transparent -z-10" />

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Request a Official Quote</h2>
              <p className="text-muted-foreground text-lg">
                Need precise numbers? Fill out the details below and our logistics specialists will create a custom shipping plan for you.
              </p>
            </div>

            <Card className="max-w-4xl mx-auto border-none shadow-2xl bg-card rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-40 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 p-40 bg-orange-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

              <CardContent className="p-8 md:p-12 relative z-10">
                <form onSubmit={handleFormSubmit} className="grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2 pb-4 border-b border-dashed mb-2">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                      Contact Details
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <Input id="name" required placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 rounded-lg bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input id="email" type="email" required placeholder="john@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11 rounded-lg bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input id="phone" required placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11 rounded-lg bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium">Company (Optional)</Label>
                    <Input id="company" placeholder="Acme Inc." value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="h-11 rounded-lg bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all" />
                  </div>

                  <div className="sm:col-span-2 pb-4 border-b border-dashed mb-2 mt-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                      Shipment Details
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pickup" className="text-sm font-medium">Pickup Location</Label>
                    <div className="relative">
                      <Input id="pickup" required placeholder="City, Zip, Country" value={form.pickup} onChange={(e) => setForm({ ...form, pickup: e.target.value })} className="pl-10 h-11 rounded-lg bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all" />
                      <div className="absolute left-3 top-3 text-muted-foreground"><Package className="h-5 w-5" /></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery" className="text-sm font-medium">Delivery Location</Label>
                    <div className="relative">
                      <Input id="delivery" required placeholder="City, Zip, Country" value={form.delivery} onChange={(e) => setForm({ ...form, delivery: e.target.value })} className="pl-10 h-11 rounded-lg bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all" />
                      <div className="absolute left-3 top-3 text-muted-foreground"><Package className="h-5 w-5" /></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pWeight" className="text-sm font-medium">Total Weight (kg)</Label>
                    <Input id="pWeight" required inputMode="decimal" placeholder="0.00" value={form.pWeight} onChange={(e) => setForm({ ...form, pWeight: e.target.value })} className="h-11 rounded-lg bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dims" className="text-sm font-medium">Dimensions (L × W × H)</Label>
                    <Input id="dims" required placeholder="e.g., 100 × 50 × 50 cm" value={form.dims} onChange={(e) => setForm({ ...form, dims: e.target.value })} className="h-11 rounded-lg bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all" />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="details" className="text-sm font-medium">Additional Instructions / Handling Requirements</Label>
                    <Textarea id="details" placeholder="E.g., Fragile, Refrigerated, Insurance needed..." rows={4} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className="rounded-lg bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all resize-none p-4" />
                  </div>

                  <div className="sm:col-span-2 pt-6">
                    <Button
                      disabled={submitting}
                      size="lg"
                      className="w-full h-14 rounded-full text-lg font-bold shadow-xl hover:shadow-primary/25 transition-all"
                    >
                      {submitting ? 'Submitting Request...' : 'Submit Quote Request'}
                    </Button>
                  </div>

                  {status && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="sm:col-span-2 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 flex items-center justify-center gap-2 text-center"
                    >
                      <Check className="h-5 w-5" /> {status}
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="border-t py-12 bg-muted/5 mt-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Package className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">CourierTrack</span>
            </div>

            <div className="flex gap-8 text-sm font-medium text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>

            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CourierTrack. All rights reserved.
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
