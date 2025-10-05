import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function formatDateTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short", 
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function getStatusColor(status) {
  const colors = {
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Processing': 'bg-amber-100 text-amber-800 border-amber-200',
    'Confirmed': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Picked Up': 'bg-blue-100 text-blue-800 border-blue-200',
    'In Transit': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Out for Delivery': 'bg-purple-100 text-purple-800 border-purple-200',
    'Delivered': 'bg-green-100 text-green-800 border-green-200',
    'Cancelled': 'bg-red-100 text-red-800 border-red-200',
    'On Hold': 'bg-gray-100 text-gray-800 border-gray-200'
  }
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

export function calculateProgress(status) {
  const statusOrder = ['Pending', 'Processing', 'Confirmed', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']
  const currentIndex = statusOrder.indexOf(status)
  return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0
}
