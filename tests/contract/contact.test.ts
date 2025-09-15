import { describe, it, expect, beforeAll, afterAll } from 'vitest'

const API_BASE = 'http://localhost:3009'

describe('POST /api/contact - Contract Tests', () => {
  beforeAll(async () => {
    // Ensure test server is running
    await new Promise(resolve => setTimeout(resolve, 1000))
  })

  describe('Valid Contact Form Submission', () => {
    it('should accept valid contact form data and return 201', async () => {
      const validPayload = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (615) 555-0123',
        message: 'I would like to discuss a custom event for my venue',
        honeypot: '' // Anti-spam field must be empty
      }

      const response = await fetch(`${API_BASE}/api/contact`, {
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
        submissionId: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) // UUID format
      })
    })

    it('should accept contact form without optional message', async () => {
      const validPayload = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '615-555-0124'
        // message intentionally omitted
      }

      const response = await fetch(`${API_BASE}/api/contact`, {
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

  describe('Invalid Contact Form Submission', () => {
    it('should reject empty first name with 400', async () => {
      const invalidPayload = {
        firstName: '', // Invalid: empty
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (615) 555-0123'
      }

      const response = await fetch(`${API_BASE}/api/contact`, {
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

    it('should reject invalid email format with 400', async () => {
      const invalidPayload = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'not-an-email', // Invalid format
        phone: '+1 (615) 555-0123'
      }

      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidPayload),
      })

      expect(response.status).toBe(400)

      const responseBody = await response.json()
      expect(responseBody.error).toContain('email')
    })

    it('should reject invalid phone number with 400', async () => {
      const invalidPayload = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123' // Too short
      }

      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidPayload),
      })

      expect(response.status).toBe(400)
    })

    it('should reject names with invalid characters with 400', async () => {
      const invalidPayload = {
        firstName: 'John123', // Numbers not allowed
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (615) 555-0123'
      }

      const response = await fetch(`${API_BASE}/api/contact`, {
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
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (615) 555-0123',
        honeypot: 'spam-content' // Should be empty
      }

      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spamPayload),
      })

      expect(response.status).toBe(400)
    })

    it('should reject message longer than 5000 characters with 400', async () => {
      const longMessage = 'A'.repeat(5001) // Too long

      const invalidPayload = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (615) 555-0123',
        message: longMessage
      }

      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidPayload),
      })

      expect(response.status).toBe(400)
    })
  })

  describe('Rate Limiting', () => {
    it('should enforce rate limiting after multiple rapid submissions', async () => {
      const validPayload = {
        firstName: 'Rate',
        lastName: 'Test',
        email: 'rate.test@example.com',
        phone: '+1 (615) 555-0125'
      }

      // Make multiple rapid requests
      const promises = Array(10).fill(null).map(() =>
        fetch(`${API_BASE}/api/contact`, {
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

  describe('Missing Required Fields', () => {
    it('should reject missing firstName with 400', async () => {
      const invalidPayload = {
        // firstName missing
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (615) 555-0123'
      }

      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidPayload),
      })

      expect(response.status).toBe(400)
    })

    it('should reject missing email with 400', async () => {
      const invalidPayload = {
        firstName: 'John',
        lastName: 'Doe',
        // email missing
        phone: '+1 (615) 555-0123'
      }

      const response = await fetch(`${API_BASE}/api/contact`, {
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
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'GET'
      })

      expect(response.status).toBe(405)
    })

    it('should reject PUT requests with 405', async () => {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })

      expect(response.status).toBe(405)
    })
  })
})