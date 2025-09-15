import { describe, it, expect, beforeAll } from 'vitest'

const API_BASE = 'http://localhost:3009'

describe('POST /api/newsletter/unsubscribe - Contract Tests', () => {
  beforeAll(async () => {
    // Ensure test server is running
    await new Promise(resolve => setTimeout(resolve, 1000))
  })

  describe('Valid Unsubscribe Request', () => {
    it('should accept valid email and return 200', async () => {
      const validPayload = {
        email: 'unsubscribe@example.com'
      }

      const response = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validPayload),
      })

      expect(response.status).toBe(200)

      const responseBody = await response.json()

      // Verify response structure matches OpenAPI spec
      expect(responseBody).toMatchObject({
        success: true,
        message: expect.any(String)
      })
    })

    it('should handle unsubscribe for non-subscribed email gracefully', async () => {
      const validPayload = {
        email: 'never.subscribed@example.com'
      }

      const response = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validPayload),
      })

      // Should either succeed (idempotent) or return 404
      expect([200, 404]).toContain(response.status)
    })

    it('should handle already unsubscribed email gracefully', async () => {
      const validPayload = {
        email: 'already.unsubscribed@example.com'
      }

      const response = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validPayload),
      })

      // Should be idempotent
      expect(response.status).toBe(200)

      const responseBody = await response.json()
      expect(responseBody.success).toBe(true)
    })
  })

  describe('Invalid Unsubscribe Request', () => {
    it('should reject invalid email format with 400', async () => {
      const invalidPayload = {
        email: 'not-an-email' // Invalid format
      }

      const response = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidPayload),
      })

      expect(response.status).toBe(400)

      const responseBody = await response.json()
      expect(responseBody).toMatchObject({
        error: expect.any(String),
        code: expect.any(String)
      })
    })

    it('should reject empty email with 400', async () => {
      const invalidPayload = {
        email: '' // Empty email
      }

      const response = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidPayload),
      })

      expect(response.status).toBe(400)
    })

    it('should reject missing email field with 400', async () => {
      const invalidPayload = {
        // email field missing
      }

      const response = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidPayload),
      })

      expect(response.status).toBe(400)
    })

    it('should reject email longer than 255 characters with 400', async () => {
      const longEmail = 'a'.repeat(240) + '@example.com' // Too long

      const invalidPayload = {
        email: longEmail
      }

      const response = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidPayload),
      })

      expect(response.status).toBe(400)
    })
  })

  describe('HTTP Methods', () => {
    it('should reject GET requests with 405', async () => {
      const response = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
        method: 'GET'
      })

      expect(response.status).toBe(405)
    })

    it('should reject PUT requests with 405', async () => {
      const response = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@example.com' })
      })

      expect(response.status).toBe(405)
    })

    it('should reject DELETE requests with 405', async () => {
      const response = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
        method: 'DELETE'
      })

      expect(response.status).toBe(405)
    })
  })

  describe('Content Type Validation', () => {
    it('should reject requests without Content-Type header with 400', async () => {
      const response = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
        method: 'POST',
        // No Content-Type header
        body: JSON.stringify({ email: 'test@example.com' })
      })

      expect(response.status).toBe(400)
    })

    it('should reject requests with wrong Content-Type with 400', async () => {
      const response = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain', // Wrong content type
        },
        body: JSON.stringify({ email: 'test@example.com' })
      })

      expect(response.status).toBe(400)
    })

    it('should reject malformed JSON with 400', async () => {
      const response = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{ invalid json' // Malformed JSON
      })

      expect(response.status).toBe(400)
    })
  })

  describe('Security Tests', () => {
    it('should handle email injection attempts safely', async () => {
      const maliciousEmails = [
        'test@example.com<script>alert("xss")</script>',
        'test@example.com"; DROP TABLE newsletter_subscribers; --',
        'test@example.com\r\nBcc: attacker@evil.com'
      ]

      for (const email of maliciousEmails) {
        const response = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })

        // Should either validate properly (400) or handle safely (200/404)
        expect([200, 400, 404]).toContain(response.status)
      }
    })

    it('should rate limit unsubscribe requests', async () => {
      const validPayload = {
        email: 'rate.limit.unsub@example.com'
      }

      // Make multiple rapid requests
      const promises = Array(20).fill(null).map(() =>
        fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(validPayload),
        })
      )

      const responses = await Promise.all(promises)
      const statusCodes = responses.map(r => r.status)

      // At least one should be rate limited (429)
      expect(statusCodes).toContain(429)
    })
  })

  describe('Response Format', () => {
    it('should return consistent response format for success', async () => {
      const validPayload = {
        email: 'format.test@example.com'
      }

      const response = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validPayload),
      })

      const responseBody = await response.json()

      if (response.status === 200) {
        expect(responseBody).toHaveProperty('success')
        expect(responseBody).toHaveProperty('message')
        expect(responseBody.success).toBe(true)
        expect(typeof responseBody.message).toBe('string')
      }
    })

    it('should return consistent error format for failures', async () => {
      const invalidPayload = {
        email: 'invalid-email'
      }

      const response = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidPayload),
      })

      expect(response.status).toBe(400)

      const responseBody = await response.json()
      expect(responseBody).toHaveProperty('error')
      expect(typeof responseBody.error).toBe('string')
    })
  })
})