import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
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
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const LandingPage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
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
    // Keep a margin so control points stay inside the view box
    const marginX = 24;
    const marginY = 32;
    const from = { x: rand(marginX, VIEW_W - marginX), y: rand(marginY, VIEW_H - marginY) };
    const to = { x: rand(marginX, VIEW_W - marginX), y: rand(marginY, VIEW_H - marginY) };
    // Control points to make a nice curve between from and to
    const c1 = { x: (from.x + to.x) / 2 + rand(-60, 60), y: rand(marginY, VIEW_H / 2) };
    const c2 = { x: (from.x + to.x) / 2 + rand(-60, 60), y: rand(VIEW_H / 2, VIEW_H - marginY) };
    const d = `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
    const duration = rand(6, 12); // seconds
    return { d, from, to, key: Date.now(), duration };
  };

  // Timed status progression within a leg
  const timersRef = useRef([]);
  const scheduleStatuses = (durationSec) => {
    // Clear existing timers
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
    // Start at Picked Up
    setStatusIdx(0);
    // Move to In Transit after ~1.2s
    timersRef.current.push(setTimeout(() => setStatusIdx(1), 1200));
    // Move to Out for Delivery near the end of the leg
    const lastPhaseMs = Math.max(1500, (durationSec * 1000) - 2000);
    timersRef.current.push(setTimeout(() => setStatusIdx(2), lastPhaseMs));
  };

  useEffect(() => {
    const r = genRoute();
    setRoute(r);
    scheduleStatuses(r.duration || 8);
    return () => {
      timersRef.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  // Reschedule statuses whenever a new route is set
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const handleTrack = (e) => {
    e.preventDefault();
    // Redirect to login page when Track Package is clicked
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
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

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div ref={sectionRef} initial="hidden" animate={controls} variants={fadeInUp}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground mb-4"
              >
                <Zap className="h-3.5 w-3.5 text-primary" />
                Lightning-fast courier delivery across the globe
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6"
              >
                Reliable shipping for
                <span className="mx-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">businesses</span>
                and <span className="bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">people</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-lg text-muted-foreground max-w-xl mb-8"
              >
                From instant pickups to real-time tracking and secure delivery, we make shipping effortless so you can focus on what matters.
              </motion.p>

              {/* Tracking Form */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                onSubmit={handleTrack}
                className="flex flex-col sm:flex-row gap-3 max-w-xl"
              >
                <Input
                  placeholder="Enter tracking number..."
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="lg" className="group">
                  <Search className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Track Package
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Button>
              </motion.form>

              {/* Trust signals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-muted-foreground"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-md border border-border p-3 text-center hover:border-primary/50 transition-colors"
                >
                  <Truck className="h-4 w-4 mx-auto mb-1 text-primary" />
                  10k+ daily deliveries
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-md border border-border p-3 text-center hover:border-primary/50 transition-colors"
                >
                  <Globe className="h-4 w-4 mx-auto mb-1 text-primary" />
                  50+ countries
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-md border border-border p-3 text-center hover:border-primary/50 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4 mx-auto mb-1 text-primary" />
                  Insured packages
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-md border border-border p-3 text-center hover:border-primary/50 transition-colors"
                >
                  <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
                  On-time guarantee
                </motion.div>
              </motion.div>
            </motion.div>
            {/* Right visuals */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <Card className="overflow-hidden shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Live Tracking Preview
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-xs text-primary"
                    >
                      Live Demo
                    </motion.span>
                  </CardTitle>
                  <CardDescription>Track your package in real-time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-64 rounded-md overflow-hidden bg-gradient-to-br from-muted to-background">
                    {/* Status badge */}
                    <motion.div
                      className="absolute z-10 left-3 top-3 text-xs rounded-full px-2 py-1 bg-primary text-primary-foreground shadow"
                      key={statusIdx}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      Status: {statuses[statusIdx]}
                    </motion.div>
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }}
                    />

                    <svg viewBox="0 0 400 256" className="absolute inset-0 w-full h-full">
                      {/* Lat/Lon lines for map feel */}
                      <g stroke="rgba(0,0,0,0.08)" strokeWidth="1" fill="none">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <path key={`lon-${i}`} d={`M ${50 + i*60} 0 C ${50 + i*60} 64, ${50 + i*60} 192, ${50 + i*60} 256`} />
                        ))}
                        {Array.from({ length: 4 }).map((_, i) => (
                          <path key={`lat-${i}`} d={`M 0 ${40 + i*50} C 133 ${40 + i*50}, 267 ${40 + i*50}, 400 ${40 + i*50}`} />
                        ))}
                      </g>
                      <defs>
                        <linearGradient id="routeGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>
                      {/* Base glow route */}
                      {/* Base glow route */}
                      <path d={route.d || 'M 24 200 C 100 60 300 60 376 200'} stroke="rgba(255,255,255,0.4)" strokeWidth="8" fill="none" strokeLinecap="round" />
                      {/* Colored route */}
                      <path d={route.d || 'M 24 200 C 100 60 300 60 376 200'} stroke="url(#routeGradient)" strokeWidth="4" fill="none" strokeLinecap="round" />
                      {/* Animated dash to imply movement */}
                      <motion.path
                        d={route.d || 'M 24 200 C 100 60 300 60 376 200'}
                        stroke="currentColor"
                        className="text-primary"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="12 10"
                        animate={{ strokeDashoffset: [0, -88] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                      />
                    </svg>

                    {/* Origin and destination pins */}
                    <div
                      className="absolute"
                      style={{ left: `${((route.from.x || 24) / VIEW_W) * 100}%`, top: `${((route.from.y || 200) / VIEW_H) * 100}%`, transform: 'translate(-50%, -100%)' }}
                    >
                      <MapPin className="h-5 w-5 text-primary drop-shadow" />
                      {statusIdx === 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.95 }}
                          animate={{ opacity: 1, y: -10, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="mt-1 -ml-2 inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-[10px] shadow border border-border"
                        >
                          <Package className="h-3 w-3 text-primary" />
                          Picked Up
                        </motion.div>
                      )}
                    </div>
                    <div
                      className="absolute"
                      style={{ left: `${((route.to.x || 376) / VIEW_W) * 100}%`, top: `${((route.to.y || 200) / VIEW_H) * 100}%`, transform: 'translate(-50%, -100%)' }}
                    >
                      <MapPin className="h-5 w-5 text-primary drop-shadow" />
                      {statusIdx === 3 && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.95 }}
                          animate={{ opacity: 1, y: -10, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="mt-1 -ml-2 inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-[10px] shadow border border-border"
                        >
                          <Check className="h-3 w-3 text-primary" />
                          Delivered
                        </motion.div>
                      )}
                    </div>

                    {/* Moving tracker plane along the path using CSS offset-path */}
                    <motion.div
                      key={route.key}
                      className="absolute"
                      style={{
                        offsetPath: `path("${route.d || 'M 24 200 C 100 60 300 60 376 200'}")`,
                        offsetRotate: 'auto'
                      }}
                      animate={{ offsetDistance: ['0%', '100%'] }}
                      transition={{ duration: route.duration || 8, ease: 'linear' }}
                      onAnimationComplete={() => {
                        // Show Delivered badge briefly, then start a new leg
                        setStatusIdx(3);
                        setTimeout(() => {
                          setRoute(genRoute());
                        }, 1000);
                      }}
                    >
                      <div className="-translate-x-1/2 -translate-y-1/2">
                        <Plane className="h-5 w-5 text-primary drop-shadow" />
                      </div>
                      <motion.div
                        className="absolute inset-0 -m-3 rounded-full"
                        animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.8, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
              <motion.div
                className="absolute -bottom-6 -left-6 w-56"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <Card className="shadow-lg">
                  <CardContent className="p-4">
                    <motion.div
                      className="text-sm text-muted-foreground"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Average delivery time
                    </motion.div>
                    <motion.div
                      className="text-2xl font-bold text-primary"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      24-48 hrs
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-10 border-t border-border bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: '250k+', label: 'Shipments delivered' },
              { number: '8,000+', label: 'Active businesses' },
              { number: '98%', label: 'On-time rate' },
              { number: '4.9/5', label: 'Customer rating' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="text-3xl font-extrabold text-primary"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                </motion.div>
                <motion.div
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        id="features"
        className="py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Powerful features built for speed
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: 'Door-to-door pickup', desc: 'Schedule pickups at your convenience and we’ll handle the rest.' },
              { icon: Rocket, title: 'Express shipping', desc: 'Priority handling ensures your package gets there faster.' },
              { icon: ShieldCheck, title: 'Secure & insured', desc: 'All packages are handled with care and insurance options.' },
              { icon: Globe, title: 'Global coverage', desc: 'Ship to 50+ countries with transparent customs support.' },
              { icon: Clock, title: 'Real-time tracking', desc: 'Know where your package is at every moment of the journey.' },
              { icon: Zap, title: 'Instant notifications', desc: 'Get SMS/email alerts at every delivery milestone.' },
            // eslint-disable-next-line no-unused-vars
            ].map(({ icon: Icon, title, desc }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <motion.div
                      className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3"
                      whileHover={{
                        scale: 1.2,
                        rotate: 360,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Services/Pricing */}
      <motion.section
        id="services"
        className="py-16 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-3"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Services that fit your needs
          </motion.h2>
          <motion.p
            className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            From same-day to economy shipping, choose the service level that matches your timeline and budget.
          </motion.p>
          <div id="pricing" className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Standard', price: 'From $5', features: ['2-5 business days', 'Tracking updates', 'Doorstep delivery'] },
              { name: 'Express', price: 'From $15', featured: true, features: ['1-2 business days', 'Priority handling', 'Extended support'] },
              { name: 'Overnight', price: 'From $25', features: ['Next-day delivery', 'Highest priority', 'Early morning option'] },
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="h-full"
              >
                <Card className={`h-full transition-shadow duration-300 ${plan.featured ? 'border-primary shadow-lg hover:shadow-xl' : 'hover:shadow-md'}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{plan.name}</CardTitle>
                      {plan.featured && (
                        <motion.span
                          className="text-xs rounded-full px-2 py-1 bg-primary text-primary-foreground"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Popular
                        </motion.span>
                      )}
                    </div>
                    <motion.div
                      className="text-2xl font-extrabold"
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.2 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      {plan.price}
                    </motion.div>
                    <CardDescription>Transparent rates. No surprises.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      {plan.features.map((f, i) => (
                        <motion.li
                          key={f}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.2 + i * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-2"
                        >
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Check className="h-4 w-4 text-primary mt-0.5" />
                          </motion.div>
                          <span>{f}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Button asChild size="lg" className="group">
                <Link to="/pricing">
                  View All Pricing Plans
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* How it works */}
      <motion.section
        id="how-it-works"
        className="py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How it works
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-4 gap-6 relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Progress Line */}
            <motion.div
              className="absolute top-7 left-0 right-0 h-0.5 bg-primary/20"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
              style={{ transformOrigin: 'left' }}
            />
            {[
              { step: 1, title: 'Create order', desc: 'Enter pickup and destination details.' },
              { step: 2, title: 'We pick up', desc: 'A courier collects your package on time.' },
              { step: 3, title: 'Track in real-time', desc: 'Follow your parcel on its journey.' },
              { step: 4, title: 'Delivered safely', desc: 'Confirm delivery and rate your experience.' },
            ].map(({ step, title, desc }, index) => (
              <motion.div
                key={step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold relative z-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 10,
                    delay: 0.5 + index * 0.1,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                >
                  {step}
                </motion.div>
                <motion.h3
                  className="font-semibold mb-1"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {title}
                </motion.h3>
                <motion.p
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {desc}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        id="testimonials"
        className="py-16 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Loved by customers worldwide
          </motion.h2>
          <motion.div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Amara U.', text: 'Super fast and reliable. The tracking updates kept me informed every step of the way.', rating: 5 },
              { name: 'David O.', text: 'Amazing experience! Overnight option saved my project timeline.', rating: 5 },
              { name: 'Lina K.', text: 'Great customer support and on-time delivery. Highly recommend!', rating: 4 },
            ].map(({ name, text, rating }, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                        >
                          {name.charAt(0)}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                        >
                          <div className="font-medium">{name}</div>
                          <div className="text-xs text-muted-foreground">Business customer</div>
                        </motion.div>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                      >
                        <Quote className="h-5 w-5 text-primary" />
                      </motion.div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <motion.p
                      className="text-sm mb-3"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    >
                      {text}
                    </motion.p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 + i * 0.1 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <Star className={`h-4 w-4 ${i < rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        id="faq"
        className="py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Frequently asked questions
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { q: 'Which countries do you ship to?', a: 'We currently ship to over 50 countries across Africa, Europe, and North America.' },
              { q: 'How do I get a tracking number?', a: 'After creating a shipment, you will receive a unique tracking number via email and on your dashboard.' },
              { q: 'Are packages insured?', a: 'Yes. All shipments include basic insurance, with optional add-ons for high-value items.' },
              { q: 'What if I need to change the delivery address?', a: 'Contact support as soon as possible—address changes are possible prior to the "Out for Delivery" stage.' },
            ].map(({ q, a }, index) => (
              <motion.div
                key={q}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="shadow-sm hover:shadow-md transition-all duration-300">
                  <details className="group/item rounded-lg p-4">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <motion.span
                        className="font-medium"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                      >
                        {q}
                      </motion.span>
                      <motion.div
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.2 }}
                        className="group-open/item:rotate-180"
                      >
                        <ChevronDown className="h-4 w-4 text-primary transition-colors" />
                      </motion.div>
                    </summary>
                    <motion.p
                      className="mt-3 text-sm text-muted-foreground"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      {a}
                    </motion.p>
                  </details>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Background Animations */}
        <motion.div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <div className="container mx-auto px-4 text-center relative">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to ship with confidence?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 opacity-90"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Join thousands of satisfied customers who trust us with their deliveries.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="secondary" asChild className="shadow-lg group">
                <Link to="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary shadow-lg"
                asChild
              >
                <Link to="/login">Login to Account</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

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
  );
};

export default LandingPage;