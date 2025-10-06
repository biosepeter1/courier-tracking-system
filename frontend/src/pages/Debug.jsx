import React from 'react'

const Debug = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'NOT SET'
  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'NOT SET'
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Environment Debug Info</h1>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">API Base URL</h2>
            <p className="text-2xl font-mono text-blue-600 break-all">{apiBaseUrl}</p>
          </div>
          
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Socket URL</h2>
            <p className="text-2xl font-mono text-blue-600 break-all">{socketUrl}</p>
          </div>
          
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Mode</h2>
            <p className="text-2xl font-mono text-green-600">{import.meta.env.MODE}</p>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-semibold text-yellow-800 mb-2">Expected Production Values:</h3>
            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
              <li>API Base URL: https://courier-tracking-system-nkdz.onrender.com/api</li>
              <li>Socket URL: https://courier-tracking-system-nkdz.onrender.com</li>
              <li>Mode: production</li>
            </ul>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">If showing "NOT SET" or "localhost":</h3>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
              <li>Go to Vercel Dashboard → Your Project</li>
              <li>Settings → Environment Variables</li>
              <li>Add: VITE_API_BASE_URL = https://courier-tracking-system-nkdz.onrender.com/api</li>
              <li>Redeploy your application</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Debug
