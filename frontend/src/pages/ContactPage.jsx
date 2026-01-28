import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Check,
  Plane,
  Truck,
  TrainFront,

  Package,
  ArrowRight,
  MessageSquare
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Select } from '../components/ui/select'
import { Label } from '../components/ui/label'
import { contactAPI } from '../lib/api'
import PublicHeader from '../components/PublicHeader'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'General Inquiry',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 7) e.phone = 'Please enter a valid phone number.'
    if (!form.message.trim()) e.message = 'Don’t forget to tell us what you need.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    setSuccess('')
    if (!validate()) return

    const toastId = toast.loading('Sending your message...')

    try {
      setSubmitting(true)

      // Submit the contact form to the backend
      const response = await contactAPI.submit({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.service,
        message: form.message
      })

      if (response.data.success) {
        toast.success(
          'Message sent successfully! We\'ll get back to you within 24 hours.',
          { id: toastId, duration: 5000 }
        )
        setSuccess(response.data.message || 'Thank you for contacting us! Our logistics team will get back to you within 24 hours.')
        setForm({ name: '', email: '', phone: '', service: 'General Inquiry', message: '' })
        setErrors({})
      } else {
        toast.error('Failed to send message. Please try again.', { id: toastId })
        setSuccess('Something went wrong. Please try again later or contact us directly at support@yourcompany.com.')
      }
    } catch (err) {
      console.error('Contact form error:', err)
      toast.error(
        err.response?.data?.message || 'Failed to send message. Please try again.',
        { id: toastId }
      )
      setSuccess('Something went wrong. Please try again later or contact us directly at support@yourcompany.com.')
    } finally {
      setSubmitting(false)
    }
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
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2" />
              24/7 Support Available
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              Let’s Get Your Shipment Moving
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you have a question about our services, need a custom quote, or require support with an existing shipment — our team is here to help.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-primary/20 px-8 h-12 text-base">
                <Link to="/quote">Request a Free Quote <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base">
                <a href="#contact-form">Send Message</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 1 – Contact Information */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3 items-start">
            {/* Contact Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm sticky top-24 rounded-3xl overflow-hidden">
                <div className="h-2 w-full bg-gradient-to-r from-primary to-primary/50" />
                <CardHeader className="p-8 pb-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Head Office</CardTitle>
                  <CardDescription className="text-base">Visit or reach us anytime</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-2 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                      <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                      <div>
                        <div className="font-semibold mb-1">Visit Us</div>
                        <span className="text-muted-foreground text-sm leading-relaxed">
                          123 Logistics Avenue,<br />
                          Lagos, Nigeria
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                      <Phone className="h-5 w-5 text-primary mt-1 shrink-0" />
                      <div>
                        <div className="font-semibold mb-1">Call Us</div>
                        <span className="text-muted-foreground text-sm block mb-1">+234 (0) 123 456 7890</span>
                        <span className="text-muted-foreground text-sm">+1 (555) 123-4567</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                      <Mail className="h-5 w-5 text-primary mt-1 shrink-0" />
                      <div>
                        <div className="font-semibold mb-1">Email Us</div>
                        <span className="text-muted-foreground text-sm block">support@couriertrack.com</span>
                        <span className="text-muted-foreground text-sm">sales@couriertrack.com</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-dashed">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" /> Operating Hours
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Mon – Fri</span>
                        <span className="font-medium text-foreground">8:00 AM – 8:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Sat – Sun</span>
                        <span className="font-medium text-foreground">9:00 AM – 5:00 PM</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="flex items-center gap-4 text-muted-foreground justify-center">
                      <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                        <Facebook className="h-5 w-5" />
                      </a>
                      <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                        <Twitter className="h-5 w-5" />
                      </a>
                      <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                        <Instagram className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 2 – Contact Form */}
            <motion.div
              id="contact-form"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <CardHeader className="p-8 pb-4 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider">Get in Touch</h3>
                  </div>
                  <CardTitle className="text-3xl font-bold">Send Us a Message</CardTitle>
                  <CardDescription className="text-lg">Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-4 relative z-10">
                  <form onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-semibold">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Ex. John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all"
                      />
                      {errors.name && <p className="text-xs text-red-600 font-medium ml-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base font-semibold">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Ex. john@company.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all"
                      />
                      {errors.email && <p className="text-xs text-red-600 font-medium ml-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base font-semibold">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+234..."
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all"
                      />
                      {errors.phone && <p className="text-xs text-red-600 font-medium ml-1">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service" className="text-base font-semibold">Department</Label>
                      <div className="relative">
                        <Select
                          id="service"
                          value={form.service}
                          onChange={(e) => setForm({ ...form, service: e.target.value })}
                          className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all appearance-none"
                        >
                          <option>General Inquiry</option>
                          <option>Air Freight Support</option>
                          <option>Road Logistics Support</option>
                          <option>Rail Freight Support</option>
                          <option>Sales & Partnerships</option>
                        </Select>
                      </div>
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="message" className="text-base font-semibold">How can we help?</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us details about your shipment or inquiry..."
                        rows={6}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="min-h-[150px] rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all p-4 resize-y"
                      />
                      {errors.message && <p className="text-xs text-red-600 font-medium ml-1">{errors.message}</p>}
                    </div>

                    <div className="sm:col-span-2 pt-4 flex flex-col sm:flex-row items-center gap-4">
                      <Button
                        type="submit"
                        disabled={submitting}
                        size="lg"
                        className="w-full sm:w-auto min-w-[180px] h-12 rounded-full font-bold shadow-lg hover:shadow-primary/25 transition-all"
                      >
                        {submitting ? 'Sending...' : 'Send Message'}
                        {!submitting && <ArrowRight className="ml-2 h-5 w-5" />}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => { setForm({ name: '', email: '', phone: '', service: 'General Inquiry', message: '' }); setErrors({}); setSuccess('') }}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        Clear Form
                      </Button>
                    </div>

                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="sm:col-span-2 mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 flex items-start gap-3"
                      >
                        <div className="h-6 w-6 rounded-full bg-green-200 flex items-center justify-center shrink-0">
                          <Check className="h-4 w-4 text-green-700" />
                        </div>
                        <div>
                          <p className="font-semibold">{success}</p>
                          <p className="text-sm text-green-700/80 mt-1">
                            While you wait, you can <Link to="/track" className="underline hover:text-green-900">Track a Package</Link> or <Link to="/services" className="underline hover:text-green-900">Browse Services</Link>.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map & Directions */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-3">Visit Our Logistics Hub</h3>
            <p className="text-muted-foreground">Conveniently located in the heart of the business district for easy access.</p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-background h-[450px] relative group">
            <iframe
              title="CourierTrack HQ Map"
              src="https://www.google.com/maps?q=6.465422,3.406448&z=13&output=embed"
              className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute bottom-6 left-6 p-4 bg-background/90 backdrop-blur-md rounded-2xl shadow-lg max-w-xs border">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="font-bold text-sm">Main Distribution Center</div>
              </div>
              <p className="text-xs text-muted-foreground">Open for drop-offs and consultations during business hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl font-black tracking-tight mb-6">Still have questions?</h2>
          <p className="text-lg text-primary-foreground/80 mb-10 leading-relaxed">
            Our support team is just a message away. Or if you're ready to start shipping, get an instant quote now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="h-14 px-8 rounded-full text-primary font-bold shadow-lg hover:shadow-black/20 text-lg w-full sm:w-auto">
              <Link to="/quote">Get Instant Quote</Link>
            </Button>
            <Button asChild size="lg" className="h-14 px-8 rounded-full border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold text-lg w-full sm:w-auto bg-transparent">
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="border-t py-12 bg-muted/5"
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
              <Link to="/about" className="hover:text-primary transition-colors">About</Link>
              <Link to="/careers" className="hover:text-primary transition-colors">Careers</Link>
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
