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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10" />
        <div className="container mx-auto px-4 py-16 sm:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-primary/90 font-medium uppercase tracking-wide">Contact Us – We’re Here to Help</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">Let’s Get Your Shipment Moving</h1>
            <p className="text-muted-foreground mt-3">
              Whether you have a question about our services, need a custom quote, or require support with an existing shipment — our team is available 24/7 to assist you.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
<Button asChild size="lg"><Link to="/quote">Request a Quote</Link></Button>
              <Button asChild variant="outline" size="lg"><Link to="/login">Track Shipment</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 1 – Contact Information */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-3 items-start">
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle>Head Office</CardTitle>
                <CardDescription>Visit or reach us anytime</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /><span>123 Logistics Avenue, Lagos, Nigeria</span></div>
                <div className="flex items-start gap-2"><Phone className="h-4 w-4 text-primary mt-0.5" /><span>+1 (555) 123-4567</span></div>
                <div className="flex items-start gap-2"><Mail className="h-4 w-4 text-primary mt-0.5" /><span>support@yourcompany.com</span></div>
                <div className="pt-2 border-t">
                  <div className="flex items-start gap-2"><Clock className="h-4 w-4 text-primary mt-0.5" /><span>Mon–Fri: 8:00 AM – 8:00 PM</span></div>
                  <div className="flex items-start gap-2"><Clock className="h-4 w-4 text-primary mt-0.5" /><span>Sat–Sun: 9:00 AM – 5:00 PM</span></div>
                  <p className="text-xs text-muted-foreground mt-1">24/7 support for urgent shipments</p>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-sm font-medium mb-2">Social Media</div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <a href="#" aria-label="LinkedIn" className="hover:text-foreground"><Linkedin className="h-5 w-5" /></a>
                    <a href="#" aria-label="Facebook" className="hover:text-foreground"><Facebook className="h-5 w-5" /></a>
                    <a href="#" aria-label="X" className="hover:text-foreground"><Twitter className="h-5 w-5" /></a>
                    <a href="#" aria-label="Instagram" className="hover:text-foreground"><Instagram className="h-5 w-5" /></a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2 – Contact Form */}
            <Card className="lg:col-span-2 border-border/80">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>We’ll respond within 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter your email (e.g., john@email.com)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter your phone number with country code" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="service">Select Service</Label>
                    <Select id="service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                      <option>Air Freight Inquiry</option>
                      <option>Road Logistics Inquiry</option>
                      <option>Rail Freight Inquiry</option>
                      <option>General Inquiry</option>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Tell us how we can help you" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                    {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Request'}</Button>
                    <Button type="button" variant="outline" onClick={() => { setForm({ name: '', email: '', phone: '', service: 'General Inquiry', message: '' }); setErrors({}); setSuccess('') }}>Clear Form</Button>
                  </div>
                  {success && (
                    <div className="sm:col-span-2 rounded-md border p-3 text-sm">
                      <span className="inline-flex items-center gap-2 text-green-700"><Check className="h-4 w-4" /> {success}</span>
<div className="mt-2 text-xs text-muted-foreground">While you wait, you can <Link className="underline" to="/login">Track Your Shipment</Link> or <Link className="underline" to="/quote">Request a Quote</Link>.</div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 3 – Quick Links */}
      <section className="py-10 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card><CardContent className="p-5"><div className="font-semibold">Track Shipment</div><p className="text-sm text-muted-foreground">Real‑time updates</p><div className="mt-3"><Button asChild variant="ghost"><Link to="/login">Open Tracking</Link></Button></div></CardContent></Card>
            <Card><CardContent className="p-5"><div className="font-semibold">Request a Quote</div><p className="text-sm text-muted-foreground">Instant pricing tool</p><div className="mt-3"><Button asChild variant="ghost"><Link to="/pricing#quote">Get Quote</Link></Button></div></CardContent></Card>
            <Card><CardContent className="p-5"><div className="font-semibold">FAQs</div><p className="text-sm text-muted-foreground">Pricing questions answered</p><div className="mt-3"><Button asChild variant="ghost"><Link to="/pricing#faq">View FAQs</Link></Button></div></CardContent></Card>
            <Card><CardContent className="p-5"><div className="font-semibold">Live Chat</div><p className="text-sm text-muted-foreground">Connect with an agent</p><div className="mt-3"><Button variant="ghost" disabled>Coming Soon</Button></div></CardContent></Card>
          </div>
        </div>
      </section>

      {/* Section 4 – Map & Directions */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold mb-4">Visit Us at Our Logistics Hub</h3>
          <div className="rounded-xl overflow-hidden border">
            <iframe
              title="CourierTrack HQ Map"
              src="https://www.google.com/maps?q=6.465422,3.406448&z=13&output=embed"
              className="w-full h-[360px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Section 5 – Why Reach Out to Us */}
      <section className="py-12 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold text-center">Why Reach Out to Us?</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
            <Card><CardContent className="p-5"><div className="font-medium">Quick response</div><p className="text-sm text-muted-foreground">Within 24 hours</p></CardContent></Card>
            <Card><CardContent className="p-5"><div className="font-medium">Dedicated support</div><p className="text-sm text-muted-foreground">For all customers</p></CardContent></Card>
            <Card><CardContent className="p-5"><div className="font-medium">Transparent guidance</div><p className="text-sm text-muted-foreground">No hidden charges</p></CardContent></Card>
            <Card><CardContent className="p-5"><div className="font-medium">Personalized solutions</div><p className="text-sm text-muted-foreground">Business & individuals</p></CardContent></Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="rounded-xl border bg-gradient-to-r from-primary/10 to-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Your goods deserve a partner who cares.</h3>
              <p className="text-muted-foreground">Reach out today and experience first‑class courier service.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/contact">Contact Support</Link></Button>
<Button asChild variant="outline" size="lg"><Link to="/quote">Get a Quote</Link></Button>
            </div>
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
