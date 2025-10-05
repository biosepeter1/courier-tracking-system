import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, BadgeCheck, Plane, Truck, Package, DollarSign, Headphones, Globe, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const tiers = [
  {
    name: 'Starter',
    price: '$5',
    cadence: 'per shipment',
    popular: false,
    icon: Package,
    features: [
      '2-5 business days',
      'Real-time tracking',
      'Email notifications',
    ],
    cta: 'Get started',
  },
  {
    name: 'Express',
    price: '$15',
    cadence: 'per shipment',
    popular: true,
    icon: Plane,
    features: [
      '1-2 business days',
      'Priority handling',
      'Extended support',
    ],
    cta: 'Choose Express',
  },
  {
    name: 'Overnight',
    price: '$25',
    cadence: 'per shipment',
    popular: false,
    icon: Truck,
    features: [
      'Next-day delivery',
      'Highest priority',
      'Early morning option',
    ],
    cta: 'Go Overnight',
  },
]

export default function PricingPage() {
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10" />
        <div className="container mx-auto px-4 py-16 sm:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-primary/90 font-medium uppercase tracking-wide">Simple, Transparent, and Flexible Pricing</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">Pay Only for what You Ship — No Hidden Fees</h1>
            <p className="text-muted-foreground mt-3">Choose from Air, Road, or Rail freight options tailored to your needs.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
<Button asChild size="lg"><Link to="/quote">Get Instant Quote</Link></Button>
              <Button asChild variant="outline" size="lg"><Link to="/">Track Shipment</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Air Freight Pricing */}
      <section id="air" className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2"><Plane className="h-6 w-6 text-primary" /> Air Freight Pricing</h2>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Standard: From $4.50 – $6.00 per kg (economy, 5–7 days)</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Express: From $7.50 – $12.00 per kg (priority, 1–3 days)</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> High‑Value Handling: +$1.50 per kg surcharge</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Minimum charge: $60 per shipment</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">Best for international trade, urgent parcels, medical supplies, and high‑value goods.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <Card className="border-border/80 shadow-sm">
                <CardHeader>
                  <CardTitle>Air Freight — Sample Breakdown</CardTitle>
                  <CardDescription>Example for a 12 kg parcel, express</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li className="flex justify-between"><span>Chargeable Weight</span><span>12 kg</span></li>
                    <li className="flex justify-between"><span>Rate</span><span>$9.00 / kg</span></li>
                    <li className="flex justify-between"><span>High‑Value Handling</span><span>$1.50 / kg</span></li>
                    <li className="flex justify-between font-semibold"><span>Total (estimate)</span><span>$126.00</span></li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Road Logistics Pricing */}
      <section id="road" className="py-10 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2"><Truck className="h-6 w-6 text-primary" /> Road Logistics Pricing</h2>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Local (same city): From $0.70 – $1.20 per km</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Domestic inter‑city: From $1.50 – $2.50 per km</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> {'Last‑mile <10kg: Flat $10 – $20'}</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> {'Heavy goods >100kg: Negotiable, from $0.50 per kg'}</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">Best for domestic eCommerce, corporate deliveries, and nationwide distribution.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <Card className="border-border/80 shadow-sm">
                <CardHeader>
                  <CardTitle>Road — Sample Breakdown</CardTitle>
                  <CardDescription>Example for 120 km inter‑city</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li className="flex justify-between"><span>Distance</span><span>120 km</span></li>
                    <li className="flex justify-between"><span>Rate</span><span>$1.80 / km</span></li>
                    <li className="flex justify-between font-semibold"><span>Total (estimate)</span><span>$216.00</span></li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rail Freight Pricing */}
      <section id="rail" className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">🚂 Rail Freight Pricing</h2>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Bulk cargo: From $0.08 – $0.12 per kg per km</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Container (20ft): From $1,200 – $1,800</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Container (40ft): From $2,000 – $2,800</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Industrial heavy freight: Contract pricing (on request)</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">Best for heavy machinery, bulk goods, and intercity industrial logistics.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <Card className="border-border/80 shadow-sm">
                <CardHeader>
                  <CardTitle>Rail — Sample Breakdown</CardTitle>
                  <CardDescription>Example for 2,000 kg over 350 km</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li className="flex justify-between"><span>Weight</span><span>2,000 kg</span></li>
                    <li className="flex justify-between"><span>Distance</span><span>350 km</span></li>
                    <li className="flex justify-between"><span>Rate</span><span>$0.10 / kg / km</span></li>
                    <li className="flex justify-between font-semibold"><span>Total (estimate)</span><span>$70,000</span></li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value‑Added Services */}
      <section className="py-12 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold text-center">Value‑Added Services</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
            <Card><CardContent className="p-5"><div className="flex items-start gap-3"><ShieldCheck className="h-5 w-5 text-primary" /><div><div className="font-semibold">Insurance</div><p className="text-sm text-muted-foreground">1.5% of shipment value</p></div></div></CardContent></Card>
            <Card><CardContent className="p-5"><div className="flex items-start gap-3"><Package className="h-5 w-5 text-primary" /><div><div className="font-semibold">Packaging & Labeling</div><p className="text-sm text-muted-foreground">From $10 – $50</p></div></div></CardContent></Card>
            <Card><CardContent className="p-5"><div className="flex items-start gap-3"><BadgeCheck className="h-5 w-5 text-primary" /><div><div className="font-semibold">Express Handling</div><p className="text-sm text-muted-foreground">+$25 flat fee</p></div></div></CardContent></Card>
            <Card><CardContent className="p-5"><div className="flex items-start gap-3"><Globe className="h-5 w-5 text-primary" /><div><div className="font-semibold">Customs Clearance</div><p className="text-sm text-muted-foreground">From $100 per shipment</p></div></div></CardContent></Card>
          </div>
        </div>
      </section>

      {/* How Pricing Works */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold text-center">How Pricing Works</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
            {[
              { n: 1, t: 'Enter Details', d: 'Weight, size, destination' },
              { n: 2, t: 'Get Instant Quote', d: 'Transparent breakdown' },
              { n: 3, t: 'Book & Pay Securely', d: 'Multiple payment methods' },
              { n: 4, t: 'Track Your Delivery', d: 'Real‑time monitoring' },
            ].map((s) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
                <Card className="h-full"><CardContent className="p-5">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">{s.n}</div>
                  <div className="mt-3 font-semibold">{s.t}</div>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
                </CardContent></Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Customers Choose Us */}
      <section className="py-12 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold text-center">Why Customers Choose Us</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mt-6">
            <Card><CardContent className="p-5"><div className="font-medium">Transparent rates</div><p className="text-sm text-muted-foreground">No hidden fees</p></CardContent></Card>
            <Card><CardContent className="p-5"><div className="font-medium">Competitive pricing</div><p className="text-sm text-muted-foreground">Local & international</p></CardContent></Card>
            <Card><CardContent className="p-5"><div className="font-medium">Bulk discounts</div><p className="text-sm text-muted-foreground">Corporate clients</p></CardContent></Card>
            <Card><CardContent className="p-5"><div className="font-medium">24/7 support</div><p className="text-sm text-muted-foreground">Billing & shipping</p></CardContent></Card>
            <Card><CardContent className="p-5"><div className="font-medium">Multimodal logistics</div><p className="text-sm text-muted-foreground">Air + Road + Rail</p></CardContent></Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold text-center">Pricing FAQ</h3>
          <div className="max-w-3xl mx-auto mt-6 space-y-3">
            {faqItems.map((f, idx) => (
              <details key={idx} className="group rounded-lg border p-4 open:shadow-sm">
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <span className="font-medium">{f.q}</span>
                  <span className="text-muted-foreground group-open:rotate-90 transition-transform">›</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="quote" className="py-12">
        <div className="container mx-auto px-4">
          <div className="rounded-xl border bg-gradient-to-r from-primary/10 to-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Move Smarter. Pay Less. Ship with Confidence.</h3>
              <p className="text-muted-foreground">Let’s tailor a plan for your shipments today.</p>
            </div>
            <div className="flex gap-3">
<Button asChild size="lg"><Link to="/quote">Get Instant Quote</Link></Button>
              <Button asChild variant="outline" size="lg"><Link to="/contact">Contact Sales</Link></Button>
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

const faqItems = [
  { q: 'How is my shipping cost calculated?', a: 'It depends on weight, dimensions, distance/destination, and transport mode (Air, Road, Rail). Optional services like insurance or express may add to the cost.' },
  { q: 'Is there a minimum charge for shipments?', a: 'Yes. Air Freight minimum is $60 per shipment. Road small parcels under 10kg start from $10–$20. Rail usually requires bulk/container base rates.' },
  { q: 'Do you charge extra for express or urgent deliveries?', a: 'Yes. Express Air Freight is typically $7.50–$12.00 per kg compared to economy. Road express can add a +$25 flat fee depending on distance.' },
  { q: 'Can I insure my shipment?', a: 'Absolutely. Insurance is available at 1.5% of the shipment value and is recommended for high‑value goods.' },
  { q: 'Are there any hidden fees?', a: 'No. All costs are clearly communicated upfront. Add‑ons like packaging, customs, or express handling are only added if you select them.' },
  { q: 'Do you offer discounts for bulk shipments or long‑term contracts?', a: 'Yes. Bulk (500kg+/month) or corporate contracts enjoy discounted rates. Contact sales for a tailored package.' },
  { q: 'What payment options are available?', a: 'We accept cards, bank transfers, and corporate billing agreements. Flexible terms possible for repeat customers.' },
  { q: 'What happens if my shipment is delayed?', a: 'We provide full tracking updates and proactive communication. For express shipments, partial refunds/discounts may apply per service terms.' },
]
