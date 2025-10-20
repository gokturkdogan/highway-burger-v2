'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function TestSessionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Logged In</h1>
          <button 
            onClick={() => router.push('/auth/login')}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Session Debug Info</h1>
        
        <div className="space-y-4">
          <div>
            <strong className="text-lg">User ID:</strong>
            <p className="text-gray-700">{session.user.id}</p>
          </div>
          
          <div>
            <strong className="text-lg">Name:</strong>
            <p className="text-gray-700">{session.user.name}</p>
          </div>
          
          <div>
            <strong className="text-lg">Email:</strong>
            <p className="text-gray-700">{session.user.email}</p>
          </div>
          
          <div>
            <strong className="text-lg">Role:</strong>
            <p className="text-gray-700 text-2xl font-bold">
              {session.user.role || 'NOT SET'}
            </p>
          </div>
          
          <div className="mt-8 p-4 bg-gray-100 rounded">
            <strong className="text-lg">Full Session Object:</strong>
            <pre className="mt-2 text-sm overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          <div className="mt-8 flex gap-4">
            <button 
              onClick={() => router.push('/admin')}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Go to Admin Panel
            </button>
            
            <button 
              onClick={() => router.push('/')}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

