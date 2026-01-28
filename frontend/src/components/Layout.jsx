import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Home,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Search,
  User,
  Mail,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    ...(!isAdmin ? [
      { name: 'Create Shipment', href: '/create-shipment', icon: Plus },
      { name: 'My Shipments', href: '/shipments', icon: Package },
    ] : []),
    ...(isAdmin ? [
      { name: 'Create Shipment', href: '/admin/create', icon: Plus },
      { name: 'All Shipments', href: '/admin/shipments', icon: Package },
      { name: 'Messages', href: '/admin/messages', icon: Mail },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ] : []),
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      {/* Mobile/Tablet sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-background border-r shadow-2xl lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <Link to="/" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl font-bold tracking-tight">CourierTrack</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary transition-colors'}`} />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            <div className="p-4 border-t bg-muted/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card/50 backdrop-blur-xl border-r border-border/50 shadow-sm">
          {/* Logo Area */}
          <div className="flex items-center h-20 px-6 border-b border-border/50">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="h-10 w-10 bg-gradient-to-tr from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight leading-none">CourierTrack</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Global Logistics</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                    }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'
                    }`} />
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white/40" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* User Profile Section */}
          <div className="p-4 mx-4 mb-4">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-4 border border-border/50 shadow-inner group">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-primary font-bold text-lg ring-2 ring-white dark:ring-slate-800">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role} Account</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-red-600 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all shadow-sm border border-transparent hover:border-border/50"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-h-screen">
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 lg:hidden px-4 py-3 bg-background/80 backdrop-blur-md border-b flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="h-10 w-10 -ml-2 flex items-center justify-center rounded-xl hover:bg-muted text-muted-foreground"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-bold text-lg">CourierTrack</span>
          <div className="w-8" />
        </div>

        <main className="flex-1 p-0">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout