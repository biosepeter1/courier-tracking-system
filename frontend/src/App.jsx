import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'
import ProtectedRoute from './components/ProtectedRoute'
import { Spinner } from './components/ui/spinner'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const CreateShipmentPage = lazy(() => import('./pages/CreateShipmentPage'))
const UserCreateShipmentPage = lazy(() => import('./pages/UserCreateShipmentPage'))
const AdminShipmentsPage = lazy(() => import('./pages/AdminShipmentsPage'))
const TrackPackagePage = lazy(() => import('./pages/TrackPackagePage'))
const TrackingPage = lazy(() => import('./pages/TrackingPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const QuotePage = lazy(() => import('./pages/QuotePage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const MessagesPage = lazy(() => import('./pages/admin/MessagesPage'))
const DebugPage = lazy(() => import('./pages/Debug'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#363636',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Router>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner className="h-8 w-8" /></div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/quote" element={<QuotePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/debug" element={<DebugPage />} />
            <Route path="/track/:trackingNumber" element={<TrackingPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/track" element={
              <ProtectedRoute>
                <TrackPackagePage />
              </ProtectedRoute>
            } />
            
            <Route path="/create-shipment" element={
              <ProtectedRoute>
                <UserCreateShipmentPage />
              </ProtectedRoute>
            } />
            
            {/* Admin Only Routes */}
            <Route path="/admin/create" element={
              <ProtectedRoute requireAdmin>
                <CreateShipmentPage />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/shipments" element={
              <ProtectedRoute requireAdmin>
                <AdminShipmentsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/analytics" element={
              <ProtectedRoute requireAdmin>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/messages" element={
              <ProtectedRoute requireAdmin>
                <MessagesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        </Router>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
