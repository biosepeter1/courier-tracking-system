import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, BadgeCheck, Plane, Truck, Package, DollarSign, Headphones, Globe, ShieldCheck, ChevronRight, ArrowRight, HelpCircle } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import PublicHeader from '../components/PublicHeader'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
      {/* Header */}
      <PublicHeader />

      {/* Hero */}
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
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
              Transparent Pricing
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              Pay Only for What You Ship.<br />
              <span className="text-primary">No Hidden Fees.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Flexible freight rates tailored to your business. Whether it's Air, Road, or Rail, get a clear cost breakdown instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-lg hover:translate-y-[-2px] transition-all">
                <Link to="/quote">Get Instant Quote <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base">
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Sections */}
      <div className="space-y-24 pb-24">

        {/* Air Freight */}
        <section id="air">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Plane className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Air Freight Pricing</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Best for international trade, urgent parcels, medical supplies, and high‑value goods.
                </p>
                <ul className="space-y-4">
                  {[
                    "Standard: $4.50 – $6.00 / kg (5–7 days)",
                    "Express: $7.50 – $12.00 / kg (1–3 days)",
                    "High‑Value Handling: +$1.50 / kg surcharge",
                    "Minimum charge: $60 per shipment"
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
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <Card className="border-border/60 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-muted/30 border-b p-6">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      Sample Breakdown <span className="text-xs font-normal px-2 py-1 bg-primary/10 text-primary rounded-full">Expression</span>
                    </CardTitle>
                    <CardDescription>Estimation for a 12 kg parcel</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-4 text-sm">
                      <li className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Chargeable Weight</span>
                        <span className="font-medium">12 kg</span>
                      </li>
                      <li className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Base Rate ($9.00/kg)</span>
                        <span className="font-medium">$108.00</span>
                      </li>
                      <li className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Handling Fee</span>
                        <span className="font-medium">$18.00</span>
                      </li>
                      <li className="flex justify-between items-center pt-2 text-lg font-bold text-primary">
                        <span>Total Estimate</span>
                        <span>$126.00</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-6 rounded-xl" asChild>
                      <Link to="/quote">Calculate Your Rate</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Road Logistics */}
        <section id="road" className="bg-muted/30 py-24 -mx-4 px-4 sm:mx-0 sm:px-0 sm:rounded-[3rem]">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                className="order-2 lg:order-1"
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <Card className="border-border/60 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 bg-background">
                  <CardHeader className="bg-primary/5 border-b p-6">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      Sample Breakdown <span className="text-xs font-normal px-2 py-1 bg-orange-100 text-orange-600 rounded-full">Inter-city</span>
                    </CardTitle>
                    <CardDescription>Estimation for 120 km delivery</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-4 text-sm">
                      <li className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Distance</span>
                        <span className="font-medium">120 km</span>
                      </li>
                      <li className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Rate ($1.80/km)</span>
                        <span className="font-medium">$216.00</span>
                      </li>
                      <li className="flex justify-between items-center pt-2 text-lg font-bold text-primary">
                        <span>Total Estimate</span>
                        <span>$216.00</span>
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full mt-6 rounded-xl" asChild>
                      <Link to="/quote">Get Road Quote</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                className="order-1 lg:order-2"
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                  <Truck className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Road Logistics Pricing</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Perfect for domestic eCommerce, corporate deliveries, and nationwide distribution. Cost-effective and flexible.
                </p>
                <ul className="space-y-4">
                  {[
                    "Local (Same City): $0.70 – $1.20 / km",
                    "Inter-city: $1.50 – $2.50 / km",
                    "Last-mile (<10kg): Flat $10 – $20",
                    "Heavy Goods (>100kg): from $0.50 / kg"
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
        <section id="rail">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Package className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Rail Freight Pricing</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  The most economical choice for heavy machinery, bulk goods, and long-distance industrial logistics.
                </p>
                <ul className="space-y-4">
                  {[
                    "Bulk Cargo: $0.08 – $0.12 / kg / km",
                    "20ft Container: $1,200 – $1,800 flat",
                    "40ft Container: $2,000 – $2,800 flat",
                    "Industrial Heavy Freight: Contract pricing"
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
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <Card className="border-border/60 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-muted/30 border-b p-6">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      Sample Breakdown <span className="text-xs font-normal px-2 py-1 bg-purple-100 text-purple-600 rounded-full">Bulk</span>
                    </CardTitle>
                    <CardDescription>Estimation for 2,000 kg over 350 km</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-4 text-sm">
                      <li className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Weight</span>
                        <span className="font-medium">2,000 kg</span>
                      </li>
                      <li className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Distance</span>
                        <span className="font-medium">350 km</span>
                      </li>
                      <li className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Rate ($0.10/kg/km)</span>
                        <span className="font-medium">$70,000</span>
                      </li>
                      <li className="flex justify-between items-center pt-2 text-lg font-bold text-primary">
                        <span>Total Estimate</span>
                        <span>$70,000</span>
                      </li>
                    </ul>
                    <Button variant="secondary" className="w-full mt-6 rounded-xl" asChild>
                      <Link to="/contact">Request Rail Quote</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

      </div>

      {/* Value Added Services */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Value-Added Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Enhance your shipping experience with our optional add-ons. Pay only for what you need.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: "Insurance", price: "1.5% of value", desc: "Full coverage for peace of mind." },
              { icon: Package, title: "Packaging", price: "From $10", desc: "Professional packing & labeling." },
              { icon: BadgeCheck, title: "Express Handling", price: "+$25 flat", desc: "Priority processing & dispatch." },
              { icon: Globe, title: "Customs Clearance", price: "From $100", desc: "Hassle-free border crossing." },
            ].map((item, idx) => (
              <Card key={idx} className="border-border/60 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="h-12 w-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <div className="text-primary font-semibold text-sm mb-2">{item.price}</div>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about our pricing and billing.</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((f, idx) => (
              <details key={idx} className="group rounded-2xl border bg-card px-6 py-4 [&_summary::-webkit-details-marker]:hidden open:shadow-md transition-all duration-300">
                <summary className="cursor-pointer flex items-center justify-between text-lg font-medium">
                  {f.q}
                  <span className="ml-4 shrink-0 rounded-full bg-muted p-1.5 text-muted-foreground sm:p-3 group-open:bg-primary/10 group-open:text-primary transition-colors">
                    <ChevronRight className="h-4 w-4 group-open:rotate-90 transition-transform" />
                  </span>
                </summary>
                <div className="mt-4 text-muted-foreground leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="quote" className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-primary px-6 py-16 sm:px-16 sm:py-24 text-center text-primary-foreground shadow-2xl">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay"></div>
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 tracking-tight">Move Smarter. Pay Less.</h2>
              <p className="text-lg opacity-90 mb-10">
                Stop overpaying for logistics. Get a tailored plan that fits your budget and schedule perfectly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="rounded-full px-8 h-14 text-lg font-bold shadow-lg" asChild>
                  <Link to="/quote">Get Instant Quote</Link>
                </Button>
                <Button size="xl" className="rounded-full px-8 h-14 text-lg font-bold bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm" asChild>
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
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
