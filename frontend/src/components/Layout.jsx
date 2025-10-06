import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  Mail
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'

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
      { name: 'Track Package', href: '/track', icon: Search },
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
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Mobile/Tablet sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-[60] lg:hidden bg-gray-900/70 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile/Tablet sidebar - NO SLIDER, just show/hide */}
      {sidebarOpen && (
        <div className="fixed inset-y-0 left-0 z-[70] lg:hidden w-full max-w-sm">
          <div className="relative flex flex-col h-full w-full bg-background shadow-2xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 pt-5 pb-4 overflow-y-auto">
            {/* Clickable Logo - Mobile - Goes to Home */}
            <Link 
              to="/"
              className="flex-shrink-0 flex items-center px-4 sm:px-6 hover:opacity-80 transition-opacity"
              onClick={() => setSidebarOpen(false)}
            >
              <Package className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">CourierTrack</span>
            </Link>
            <nav className="mt-6 px-3 sm:px-4 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
                    <span className="flex-1">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 border-t border-border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Desktop sidebar - optimized for 1204x1366 and larger */}
      <div className="hidden lg:flex lg:w-64 xl:w-72 2xl:w-80 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Clickable Logo - Desktop - Goes to Home */}
            <Link 
              to="/"
              className="flex items-center flex-shrink-0 px-4 hover:opacity-80 transition-opacity"
            >
              <Package className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">CourierTrack</span>
            </Link>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-border p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - optimized for all screen sizes including 1204x1366 */}
      <div className="lg:pl-64 xl:pl-72 2xl:pl-80 flex flex-col flex-1">
        {/* Mobile/Tablet header with dropdown menu */}
        <div className="sticky top-0 z-50 lg:hidden px-3 py-3 sm:px-4 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90 border-b border-border shadow-sm">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            {/* Mobile Logo - Goes to Home */}
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Package className="h-6 w-6 text-primary" />
              <span className="ml-2 text-base sm:text-lg font-bold">CourierTrack</span>
            </Link>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout