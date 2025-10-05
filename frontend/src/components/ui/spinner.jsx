import React from 'react'

export function Spinner({ className = '' }) {
  return (
    <div className={`inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent ${className}`} />
  )
}