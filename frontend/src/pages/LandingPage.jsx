import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useAnimation, useInView } from 'framer-motion';
import {
  Search,
  Package,
  Truck,
  Globe,
  ShieldCheck,
  Clock,
  Zap,
  Rocket,
  MapPin,
  Star,
  Quote,
  Check,
  ChevronDown,
  ArrowRight,
  Plane,
  Menu,
  BarChart,
  Navigation
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const LandingPage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Live tracking demo state
  const VIEW_W = 400;
  const VIEW_H = 256;
  const [route, setRoute] = useState({ d: '', from: { x: 24, y: 200 }, to: { x: 376, y: 200 }, key: 0, duration: 8 });
  const statuses = ['Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
  const [statusIdx, setStatusIdx] = useState(0);

  const rand = (min, max) => Math.random() * (max - min) + min;

  const genRoute = () => {
    const marginX = 24;
    const marginY = 32;
    // Smoother arc - less randomness
    const from = { x: rand(marginX, 80), y: rand(150, 220) };
    const to = { x: rand(320, VIEW_W - marginX), y: rand(150, 220) };
    // Control points for a nice arc
    const c1 = { x: from.x + 50, y: rand(20, 80) };
    const c2 = { x: to.x - 50, y: rand(20, 80) };

    const d = `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
    const duration = rand(6, 8);
    return { d, from, to, key: Date.now(), duration };
  };

  const timersRef = useRef([]);
  const scheduleStatuses = (durationSec) => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
    setStatusIdx(0);

    // Calculate timing for each step
    const stepDuration = (durationSec * 1000) / 4;

    // Step through all 4 statuses
    timersRef.current.push(setTimeout(() => setStatusIdx(1), stepDuration));       // In Transit
    timersRef.current.push(setTimeout(() => setStatusIdx(2), stepDuration * 2));   // Out for Delivery
    timersRef.current.push(setTimeout(() => setStatusIdx(3), stepDuration * 3));   // Delivered

    // Loop: Reset after showing "Delivered" for a moment
    timersRef.current.push(setTimeout(() => {
      setStatusIdx(0);
      // Restart the animation cycle
      setTimeout(() => scheduleStatuses(durationSec), 500);
    }, stepDuration * 4));
  };

  useEffect(() => {
    const r = genRoute();
    setRoute(r);
    scheduleStatuses(r.duration || 8);
    return () => {
      timersRef.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (route && route.key) {
      scheduleStatuses(route.duration || 8);
      return () => {
        timersRef.current.forEach((id) => clearTimeout(id));
      };
    }
  }, [route.key]);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/track/${trackingNumber.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 border-b bg-background/80 backdrop-blur-md z-50 transition-all duration-300"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground">
              <Package className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">CourierTrack</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {[
              { label: 'Services', to: '/services' },
              { label: 'Pricing', to: '/pricing' },
              { label: 'Testimonials', to: '/testimonials' },
              { label: 'Contact', to: '/contact' },
            ].map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pl-4 border-l">
              <Button variant="ghost" asChild className="hover:bg-muted">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              {['Services', 'Pricing', 'Testimonials', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="block px-4 py-3 text-sm font-medium hover:bg-muted/50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <div className="flex gap-3 pt-3 mt-3 border-t">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
        {/* Subtle Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-foreground">
                Logistics that <br />
                <span className="text-primary">move with you</span>.
              </h1>

              <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Experience the future of shipping. Real-time tracking, AI-optimized routes, and 24/7 premium support.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <form onSubmit={handleTrack} className="flex-1 max-w-md relative flex items-center shadow-lg rounded-full bg-background border p-1 pl-4 transition-all focus-within:ring-2 ring-primary/20">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter tracking number..."
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="border-0 shadow-none bg-transparent focus-visible:ring-0 h-12 text-base px-4"
                  />
                  <Button type="submit" size="lg" className="rounded-full h-10 px-8">
                    Track
                  </Button>
                </form>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Fully Insured
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" /> 24/7 Support
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" /> 150+ Countries
                </div>
              </div>
            </motion.div>

            {/* Right Visual - Clean Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-lg mx-auto lg:max-w-none hidden lg:block"
            >
              <Card className="relative overflow-hidden border shadow-xl bg-card text-card-foreground rounded-[2rem]">
                <CardContent className="p-0">
                  <div className="relative h-[400px] w-full p-6 flex flex-col">
                    {/* Header of Card */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="text-base font-bold">Shipment #TRK-8829</div>
                          <div className="text-sm text-muted-foreground">In Transit • 2.4kg</div>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
                        ON TIME
                      </div>
                    </div>

                    {/* Journey Tracker Visualization */}
                    <div className="flex-1 relative rounded-xl overflow-hidden bg-muted/20 border shadow-inner flex flex-col justify-center px-6 py-8">
                      {/* Status Float */}
                      <motion.div
                        className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur shadow-sm rounded-lg p-3 border"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Current Status</div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          <span className="font-bold text-sm text-foreground">{statuses[statusIdx]}</span>
                        </div>
                      </motion.div>

                      {/* Step-by-step Journey Tracker */}
                      <div className="flex items-center justify-between w-full mt-8">
                        {[
                          { icon: Package, label: 'Pickup' },
                          { icon: Truck, label: 'In Transit' },
                          { icon: Navigation, label: 'Out for Delivery' },
                          { icon: Check, label: 'Delivered' }
                        ].map((step, index) => {
                          const StepIcon = step.icon;
                          const isCompleted = statusIdx >= index;
                          const isCurrent = statusIdx === index;

                          return (
                            <React.Fragment key={step.label}>
                              {/* Milestone Node */}
                              <div className="flex flex-col items-center z-10">
                                <motion.div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCompleted
                                    ? 'bg-primary border-primary shadow-lg'
                                    : 'bg-background border-muted-foreground/30'
                                    } ${isCurrent ? 'ring-4 ring-primary/30 scale-110' : ''}`}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: isCurrent ? 1.1 : 1, opacity: 1 }}
                                  transition={{ delay: index * 0.1, duration: 0.3 }}
                                >
                                  <StepIcon className={`h-5 w-5 ${isCompleted ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                                </motion.div>
                                <span className={`text-[10px] mt-2 font-medium text-center max-w-[60px] leading-tight ${isCompleted ? 'text-foreground' : 'text-muted-foreground'
                                  }`}>
                                  {step.label}
                                </span>
                              </div>

                              {/* Connecting Line (except after last node) */}
                              {index < 3 && (
                                <div className="flex-1 h-1 bg-muted-foreground/20 rounded-full mx-1 relative overflow-hidden">
                                  <motion.div
                                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: statusIdx > index ? '100%' : '0%' }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                  />
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    {/* Timeline / Progress Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between text-xs font-medium text-muted-foreground mb-2">
                        <span>Started</span>
                        <span>{Math.round((statusIdx / 3) * 100)}% Complete</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: "0%" }}
                          animate={{ width: `${(statusIdx / 3) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Strip - Cleaner */}
      <section className="relative px-4 -mt-10 lg:-mt-16 z-20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border bg-card border shadow-xl rounded-2xl overflow-hidden"
          >
            {[
              { number: '250k+', label: 'Delivered', icon: Package },
              { number: '150+', label: 'Countries', icon: Globe },
              { number: '99.9%', label: 'On Time', icon: Clock },
              { number: '24/7', label: 'Support', icon: ShieldCheck },
            ].map((stat, i) => (
              <div key={i} className="p-6 text-center hover:bg-muted/30 transition-colors group">
                <div className="mx-auto w-10 h-10 mb-3 bg-secondary rounded-full flex items-center justify-center text-primary">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.number}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <motion.section
        id="features"
        className="py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-primary font-medium mb-3 uppercase tracking-wider text-xs">Why Choose Us</div>
            <motion.h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Powerful features built for modern logistics
            </motion.h2>
            <p className="text-lg text-muted-foreground">Weve reimagined how shipping works, giving you total control and visibility.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: 'Door-to-door pickup', desc: 'Schedule pickups at your convenience and we’ll handle the rest.' },
              { icon: Rocket, title: 'Express shipping', desc: 'Priority handling ensures your package gets there faster.' },
              { icon: ShieldCheck, title: 'Secure & insured', desc: 'All packages are handled with care and insurance options.' },
              { icon: Globe, title: 'Global coverage', desc: 'Ship to 50+ countries with transparent customs support.' },
              { icon: Clock, title: 'Real-time tracking', desc: 'Know where your package is at every moment of the journey.' },
              { icon: Zap, title: 'Instant notifications', desc: 'Get SMS/email alerts at every delivery milestone.' },
            ].map(({ icon: Icon, title, desc }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg mb-2">{title}</CardTitle>
                    <CardDescription className="text-base">{desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Services/Pricing */}
      <section id="services" className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground">Choose the service speed that matches your business needs.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Standard', price: 'From $5', features: ['3-5 business days', 'Basic Tracking', 'Doorstep delivery'], color: 'border-border' },
              { name: 'Express', price: 'From $15', featured: true, features: ['1-2 business days', 'Priority handling', 'Premium Support'], color: 'border-primary ring-1 ring-primary' },
              { name: 'Overnight', price: 'From $25', features: ['Next-day delivery', 'Money-back guarantee', 'Early morning option'], color: 'border-border' },
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="relative"
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center z-20">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">Most Popular</span>
                  </div>
                )}
                <Card className={`h-full ${plan.featured ? 'shadow-xl scale-105 z-10' : 'shadow-md'} ${plan.color} flex flex-col bg-card`}>
                  <CardHeader className="text-center pb-8 pt-10">
                    <CardTitle className="text-xl font-medium text-muted-foreground mb-2">{plan.name}</CardTitle>
                    <div className="text-4xl font-extrabold text-foreground mb-4">{plan.price}</div>
                    <p className="text-sm text-muted-foreground">per shipment</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm">
                          <Check className="h-5 w-5 text-primary shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${plan.featured ? '' : 'variant-outline'}`} variant={plan.featured ? 'default' : 'outline'} asChild>
                      <Link to="/pricing">Choose {plan.name}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">How it works</h2>

          <div className="relative">
            {/* Line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-muted" />

            <div className="grid md:grid-cols-4 gap-12 relative z-10">
              {[
                { step: 1, title: 'Book Order', desc: 'Enter shipment details and get an instant quote.' },
                { step: 2, title: 'We Collect', desc: 'A courier picks up your package from your door.' },
                { step: 3, title: 'Live Tracking', desc: 'Follow your shipment in real-time on our map.' },
                { step: 4, title: 'Delivered', desc: 'Safe delivery with digital signature confirmation.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-24 h-24 mx-auto bg-card border-4 border-muted rounded-full flex items-center justify-center mb-6 shadow-sm relative z-10">
                    <span className="text-3xl font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight">Ready to verify our speed?</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">Join thousands of businesses who trust CourierTrack for their critical deliveries.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="secondary" className="h-14 px-8 text-lg rounded-full shadow-lg" asChild>
                <Link to="/register">Get Started Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="xl" className="h-14 px-8 text-lg rounded-full bg-white text-primary hover:bg-white/90 shadow-lg" asChild>
                <Link to="/contact">Contact Sales</Link>
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

            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
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
  );
};

export default LandingPage;