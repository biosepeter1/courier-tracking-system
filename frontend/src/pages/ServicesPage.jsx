import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plane,
  Truck,
  ShieldCheck,
  Globe,
  Check,
  ChevronRight,
  MapPin,
  DollarSign,
  Headphones,
  Package,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'


function ServicesPage() {
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

      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="container mx-auto px-4 py-16 sm:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-primary/90 font-medium uppercase tracking-wide">Services – Air, Road & Rail Logistics You Can Trust</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">Seamless Courier & Logistics Solutions Across Air, Road & Rail</h1>
              <p className="text-muted-foreground mt-3 max-w-2xl">We deliver speed, safety, and reliability—no matter the distance.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" className="group">
                  <Link to="/login">
                    Track Shipment
                    <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
<Link to="/quote">Request a Quote</Link>
                </Button>
              </div>
              {/* Quick section links */}
              <div className="mt-6 flex flex-wrap gap-2 text-sm">
                <a href="#air" className="inline-flex items-center rounded-full border px-3 py-1 hover:bg-muted transition-colors">✈️ Air</a>
                <a href="#road" className="inline-flex items-center rounded-full border px-3 py-1 hover:bg-muted transition-colors">🚛 Road</a>
                <a href="#rail" className="inline-flex items-center rounded-full border px-3 py-1 hover:bg-muted transition-colors">🚂 Rail</a>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <motion.img
                src="https://wowtheme7.com/tf/logistick/logistick/assets/images/thumbs/project-two-img1.png"
                alt="Logistics containers"
                className="w-full rounded-xl shadow-lg border"
                initial={{ y: 8 }}
                animate={{ y: [8, 0, 8] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 1 – Introduction */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-foreground font-medium">Welcome to CourierTrack</p>
            <p className="text-muted-foreground mt-2">
              At <span className="font-semibold">CourierTrack</span>, we combine advanced logistics technology with a trusted
              transport network to ensure your goods move swiftly, securely, and affordably—across air, road, and rail.
            </p>
          </div>
        </div>
      </section>

      {/* Allow alias anchor for "flight" */}
      <div id="flight" className="h-0" />
      {/* Section 2 – Air Freight Services */}
      <section id="air" className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <p className="text-primary/90 font-medium uppercase tracking-wide">Air Freight</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Fast, Reliable Air Cargo Delivery</h2>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Global air cargo routes & partnerships</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Express delivery for urgent shipments</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Secure handling with advanced packaging</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Door-to-door delivery & customs support</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">Ideal for international trade, urgent parcels, and high-value goods.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <img
                src="https://wowtheme7.com/tf/logistick/logistick/assets/images/thumbs/project-two-img2.png"
                alt="Air freight"
                className="w-full rounded-xl border shadow"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3 – Road Logistics */}
      <section id="road" className="py-12 sm:py-16 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div className="order-2 lg:order-1" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <img
                src="https://wowtheme7.com/tf/logistick/logistick/assets/images/thumbs/project-two-img6.png"
                alt="Road logistics truck"
                className="w-full rounded-xl border shadow"
                loading="lazy"
              />
            </motion.div>
            <motion.div className="order-1 lg:order-2" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <p className="text-primary/90 font-medium uppercase tracking-wide">Road Logistics</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Nationwide Road Transportation</h2>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Extensive fleet for all cargo sizes</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Flexible, cost-efficient delivery routes</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Real-time tracking and monitoring</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Last-mile delivery solutions</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">Perfect for domestic distribution, city-to-city delivery, and business logistics.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4 – Rail Freight */}
      <section id="rail" className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <p className="text-primary/90 font-medium uppercase tracking-wide">Rail Freight</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Efficient & Sustainable Rail Movement</h2>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Cost-effective bulk cargo solution</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Reliable scheduled timetables</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Environmentally friendly transport</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Smooth integration with road/air services</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">Best for industrial goods, heavy shipments, and long-distance freight.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <img
                src="https://i.pinimg.com/736x/f2/e6/76/f2e67684f1dd79571430ff413660b440.jpg"
                alt="Rail freight"
                className="w-full rounded-xl border shadow object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1503751071777-d2918b21bbd9?q=80&w=1200&auto=format&fit=crop'; }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 5 – Why Choose Us */}
      <section className="py-12 sm:py-16 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Your Logistics Partner for Every Mile</h2>
            <p className="text-muted-foreground">One trusted provider for air, road, and rail—backed by smart tracking and dedicated support.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <Card className="border-border/80"><CardContent className="p-5"><div className="flex items-start gap-3"><Globe className="h-5 w-5 text-primary" /><div><div className="font-semibold">One‑stop logistics</div><p className="text-sm text-muted-foreground">Air, road & rail under one roof</p></div></div></CardContent></Card>
            <Card className="border-border/80"><CardContent className="p-5"><div className="flex items-start gap-3"><MapPin className="h-5 w-5 text-primary" /><div><div className="font-semibold">End‑to‑end visibility</div><p className="text-sm text-muted-foreground">Smart tracking at every step</p></div></div></CardContent></Card>
            <Card className="border-border/80"><CardContent className="p-5"><div className="flex items-start gap-3"><Headphones className="h-5 w-5 text-primary" /><div><div className="font-semibold">24/7 support</div><p className="text-sm text-muted-foreground">Dedicated customer care</p></div></div></CardContent></Card>
            <Card className="border-border/80"><CardContent className="p-5"><div className="flex items-start gap-3"><ShieldCheck className="h-5 w-5 text-primary" /><div><div className="font-semibold">Safe & compliant</div><p className="text-sm text-muted-foreground">Global standards & handling</p></div></div></CardContent></Card>
            <Card className="border-border/80"><CardContent className="p-5"><div className="flex items-start gap-3"><DollarSign className="h-5 w-5 text-primary" /><div><div className="font-semibold">Competitive pricing</div><p className="text-sm text-muted-foreground">World‑class service</p></div></div></CardContent></Card>
          </div>
        </div>
      </section>

      {/* Section 6 – CTA */}
      <section id="quote" className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-xl border bg-gradient-to-r from-primary/10 to-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Ready to Move Your Shipment?</h3>
              <p className="text-muted-foreground">From small parcels to large consignments, we handle every delivery with first-class care.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/quote">Request a Quote</Link></Button>
              <Button asChild variant="outline" size="lg"><Link to="/login">Track Your Shipment</Link></Button>
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
              {[
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Terms of Service', to: '/terms' },
                { label: 'Contact Us', to: '/contact' }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.to}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
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

export default ServicesPage
