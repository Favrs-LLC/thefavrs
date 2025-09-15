'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

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
        setMessage('Thank you for subscribing!')
        setEmail('')
      } else {
        setMessage(data.error || 'Failed to subscribe')
      }
    } catch (error) {
      setMessage('Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            We&apos;ll Make Sure You Have a Good Time, All The Time
          </h2>

          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-6">
              Get exclusive access to our new products and services before they are launched.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
            {message && (
              <div className={`mt-4 text-sm p-2 rounded ${
                message.includes('Thank you')
                  ? 'bg-green-800/50 text-green-200'
                  : 'bg-red-800/50 text-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Navigation Links */}
            <div className="flex space-x-6 text-sm mb-4 md:mb-0">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <span className="text-gray-500">|</span>
              <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-500">|</span>
              <Link href="/terms-conditions" className="text-gray-300 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              Copyright © Favrs, LLC {new Date().getFullYear()} Designed by Favrs
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}