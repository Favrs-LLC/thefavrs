'use client'

import { useState } from 'react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Thank you! Please check your email to confirm your subscription.')
        setEmail('')
      } else {
        setMessage(`Error: ${data.error || 'Failed to subscribe'}`)
      }
    } catch (error) {
      setMessage('Error: Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Stay Updated
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Get the latest insights on entertainment industry trends,
          event planning tips, and technology updates.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>

          {message && (
            <div className={`mt-4 text-sm p-3 rounded-lg ${
              message.includes('Error')
                ? 'bg-red-900/50 text-red-200 border border-red-700'
                : 'bg-green-900/50 text-green-200 border border-green-700'
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </section>
  )
}