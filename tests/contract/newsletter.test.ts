import { describe, it, expect, beforeAll } from 'vitest'

const API_BASE = 'http://localhost:3009'

describe('POST /api/newsletter - Contract Tests', () => {
  beforeAll(async () => {
    // Ensure test server is running
    await new Promise(resolve => setTimeout(resolve, 1000))
  })

  describe('Valid Newsletter Subscription', () => {
    it('should accept valid email and return 201', async () => {
      const validPayload = {
        email: 'newsletter@example.com',
        honeypot: '' // Anti-spam field must be empty
      }

      const response = await fetch(`${API_BASE}/api/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validPayload),
      })

      expect(response.status).toBe(201)

      const responseBody = await response.json()

      // Verify response structure matches OpenAPI spec
      expect(responseBody).toMatchObject({
        success: true,
        message: expect.any(String),
        requiresConfirmation: true
      })
    })

    it('should accept email without honeypot field', async () => {
      const validPayload = {
        email: 'simple@example.com'
        // honeypot field omitted
      }

      const response = await fetch(`${API_BASE}/api/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validPayload),
      })

      expect(response.status).toBe(201)

      const responseBody = await response.json()
      expect(responseBody.success).toBe(true)
    })
  })

  describe('Invalid Newsletter Subscription', () => {
    it('should reject invalid email format with 400', async () => {
      const invalidPayload = {
        email: 'not-an-email' // Invalid format
      }

      const response = await fetch(`${API_BASE}/api/newsletter`, {
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
        code: 'VALIDATION_ERROR',
        details: expect.any(Object)
      })
    })

    it('should reject empty email with 400', async () => {
      const invalidPayload = {
        email: '' // Empty email
      }

      const response = await fetch(`${API_BASE}/api/newsletter`, {
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
        honeypot: ''
      }

      const response = await fetch(`${API_BASE}/api/newsletter`, {
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

      const response = await fetch(`${API_BASE}/api/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidPayload),
      })

      expect(response.status).toBe(400)
    })

    it('should reject submission with honeypot filled (spam protection)', async () => {
      const spamPayload = {
        email: 'spam@example.com',
        honeypot: 'spam-content' // Should be empty
      }

      const response = await fetch(`${API_BASE}/api/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spamPayload),
      })

      expect(response.status).toBe(400)
    })
  })

  describe('Duplicate Email Handling', () => {
    it('should handle duplicate email subscription gracefully with 409', async () => {
      const email = 'duplicate.test@example.com'

      // First subscription
      const firstPayload = { email }
      await fetch(`${API_BASE}/api/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(firstPayload),
      })

      // Second subscription with same email
      const secondResponse = await fetch(`${API_BASE}/api/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(firstPayload),
      })

      expect(secondResponse.status).toBe(409)

      const responseBody = await secondResponse.json()
      expect(responseBody).toMatchObject({
        error: expect.any(String),
        code: expect.any(String)
      })
    })
  })

  describe('Rate Limiting', () => {
    it('should enforce rate limiting after multiple rapid submissions', async () => {
      const validPayload = {
        email: 'rate.limit.test@example.com'
      }

      // Make multiple rapid requests
      const promises = Array(15).fill(null).map((_, index) =>
        fetch(`${API_BASE}/api/newsletter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: `rate${index}@example.com`
          }),
        })
      )

      const responses = await Promise.all(promises)
      const statusCodes = responses.map(r => r.status)

      // At least one should be rate limited (429)
      expect(statusCodes).toContain(429)
    })
  })

  describe('HTTP Methods', () => {
    it('should reject GET requests with 405', async () => {
      const response = await fetch(`${API_BASE}/api/newsletter`, {
        method: 'GET'
      })

      expect(response.status).toBe(405)
    })

    it('should reject PUT requests with 405', async () => {
      const response = await fetch(`${API_BASE}/api/newsletter`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@example.com' })
      })

      expect(response.status).toBe(405)
    })

    it('should reject DELETE requests with 405', async () => {
      const response = await fetch(`${API_BASE}/api/newsletter`, {
        method: 'DELETE'
      })

      expect(response.status).toBe(405)
    })
  })

  describe('Content Type Validation', () => {
    it('should reject requests without Content-Type header with 400', async () => {
      const response = await fetch(`${API_BASE}/api/newsletter`, {
        method: 'POST',
        // No Content-Type header
        body: JSON.stringify({ email: 'test@example.com' })
      })

      expect(response.status).toBe(400)
    })

    it('should reject requests with wrong Content-Type with 400', async () => {
      const response = await fetch(`${API_BASE}/api/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain', // Wrong content type
        },
        body: JSON.stringify({ email: 'test@example.com' })
      })

      expect(response.status).toBe(400)
    })
  })
})