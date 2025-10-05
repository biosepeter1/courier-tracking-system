import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

export default function NotFoundPage(){
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-6">
        <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-6">The page you’re looking for doesn’t exist.</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}