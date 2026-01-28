import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  Search,
  ArrowRight,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import PublicHeader from '../components/PublicHeader'


function ServicesPage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const navigate = useNavigate()

  const handleTrack = (e) => {
    e.preventDefault()
    if (trackingNumber.trim()) {
      navigate(`/track/${trackingNumber.trim().toUpperCase()}`)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
      {/* Header with Mobile Menu */}
      <PublicHeader />

      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-sm bg-background/50 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
                Premium Logistics Services
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
                Global Logistics, <br />
                <span className="text-primary">Simplified.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                Experience seamless shipping solutions across air, road, and rail. We deliver speed, safety, and reliability—customized for your business needs.
              </p>

              {/* Inline Tracking Form */}
              <div className="bg-background/80 backdrop-blur-md p-2 rounded-full border shadow-lg max-w-lg flex items-center gap-2 mb-8 relative z-20">
                <div className="pl-4 text-muted-foreground">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Enter tracking number..."
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/70 h-10"
                />
                <Button onClick={handleTrack} size="lg" className="rounded-full px-6 shadow-md">
                  Track
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-lg hover:translate-y-[-2px] transition-all">
                  <Link to="/quote">Get a Quote <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <div className="flex gap-2 text-sm font-medium text-muted-foreground ml-2">
                  <a href="#air" className="hover:text-primary transition-colors">Air</a> •
                  <a href="#road" className="hover:text-primary transition-colors">Road</a> •
                  <a href="#rail" className="hover:text-primary transition-colors">Rail</a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-background">
                <img
                  src="https://wowtheme7.com/tf/logistick/logistick/assets/images/thumbs/project-two-img1.png"
                  alt="Logistics containers"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-background/90 backdrop-blur border p-4 rounded-xl shadow-xl hidden sm:flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Check className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-sm">98% On-Time</p>
                  <p className="text-xs text-muted-foreground">Delivery Rate</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Why Choose CourierTrack?</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We combine advanced technology with a trusted global network to ensure your goods move swiftly, securely, and affordably.
            Whether it's a small parcel or bulk cargo, we have the right solution for you.
          </p>
        </div>
      </section>

      <div id="flight" className="h-0" />

      {/* Air Freight */}
      <section id="air" className="py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Plane className="h-6 w-6" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Fast, Reliable Air Cargo</h2>
              <p className="text-muted-foreground text-lg mb-8">
                When speed is critical, our air freight services deliver. We offer comprehensive solutions for your time-sensitive shipments across the globe.
              </p>
              <ul className="space-y-4">
                {[
                  "Global partnership network",
                  "Express & Next-Flight-Out options",
                  "Secure handling & packaging",
                  "Customs clearance support"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-border/50 group">
                <img
                  src="https://wowtheme7.com/tf/logistick/logistick/assets/images/thumbs/project-two-img2.png"
                  alt="Air freight"
                  className="w-full transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Road Logistics */}
      <section id="road" className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="order-2 lg:order-1 relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-border/50 group">
                <img
                  src="https://wowtheme7.com/tf/logistick/logistick/assets/images/thumbs/project-two-img6.png"
                  alt="Road logistics truck"
                  className="w-full transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </motion.div>
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Truck className="h-6 w-6" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Nationwide Road Transport</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Flexible and cost-effective ground shipping for any cargo size. From last-mile delivery to cross-country haulage, we keep your business moving.
              </p>
              <ul className="space-y-4">
                {[
                  "Extensive fleet network",
                  "Real-time GPS tracking",
                  "FTL (Full Truckload) & LTL options",
                  "Door-to-door distribution"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rail Freight */}
      <section id="rail" className="py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Package className="h-6 w-6" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Sustainable Rail Freight</h2>
              <p className="text-muted-foreground text-lg mb-8">
                An efficient, eco-friendly choice for bulk shipments. Rail freight offers high capacity and reliability for your long-distance logistics needs.
              </p>
              <ul className="space-y-4">
                {[
                  "Cost-effective bulk solution",
                  "Reliable scheduled departures",
                  "Lower carbon footprint",
                  "Multimodal integration"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-border/50 group">
                <img
                  src="https://i.pinimg.com/736x/f2/e6/76/f2e67684f1dd79571430ff413660b440.jpg"
                  alt="Rail freight"
                  className="w-full transition-transform duration-500 group-hover:scale-105 object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1474487548417-781cb714d22d?q=80&w=2070&auto=format&fit=crop'; }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Your Trusted Partner</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We deliver more than just packages. We deliver promises with a commitment to excellence in every mile.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Globe, title: "Global Reach", desc: "Connecting you to over 150 countries." },
              { icon: ShieldCheck, title: "Secure Cargo", desc: "Top-tier security for peace of mind." },
              { icon: Headphones, title: "24/7 Support", desc: "Expert assistance whenever you need it." },
              { icon: DollarSign, title: "Best Rates", desc: "Premium service at competitive prices." },
            ].map((card, idx) => (
              <Card key={idx} className="border-border/60 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="h-12 w-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                  <p className="text-muted-foreground">{card.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden text-primary-foreground">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Ready to Ship?</h2>
            <p className="text-xl opacity-90 mb-10 max-w-xl mx-auto">
              Get a free quote in seconds or speak to our logistics experts today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="secondary" className="rounded-full px-8 h-14 text-lg font-bold shadow-lg" asChild>
                <Link to="/quote">Get a Quote</Link>
              </Button>
              <Button size="xl" className="rounded-full px-8 h-14 text-lg font-bold bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm" asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/20">
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
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Help Center</Link>
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

export default ServicesPage
