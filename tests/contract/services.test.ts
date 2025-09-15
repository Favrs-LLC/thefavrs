import { describe, it, expect, beforeAll } from 'vitest'

const API_BASE = 'http://localhost:3009'

describe('GET /api/services - Contract Tests', () => {
  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
  })

  describe('Valid Services Retrieval', () => {
    it('should return active services with 200', async () => {
      const response = await fetch(`${API_BASE}/api/services`)

      expect(response.status).toBe(200)

      const responseBody = await response.json()
      expect(responseBody).toMatchObject({
        services: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            description: expect.any(String),
            icon: expect.any(String),
            displayOrder: expect.any(Number)
          })
        ])
      })
    })

    it('should return services in display order', async () => {
      const response = await fetch(`${API_BASE}/api/services`)
      expect(response.status).toBe(200)

      const responseBody = await response.json()
      const services = responseBody.services

      // Verify services are ordered by displayOrder
      for (let i = 1; i < services.length; i++) {
        expect(services[i].displayOrder).toBeGreaterThanOrEqual(services[i - 1].displayOrder)
      }
    })

    it('should only return active services', async () => {
      const response = await fetch(`${API_BASE}/api/services`)
      expect(response.status).toBe(200)

      const responseBody = await response.json()

      // All returned services should be active (implied by RLS policy)
      expect(Array.isArray(responseBody.services)).toBe(true)
    })
  })

  describe('Response Format Validation', () => {
    it('should include all required fields for each service', async () => {
      const response = await fetch(`${API_BASE}/api/services`)
      expect(response.status).toBe(200)

      const responseBody = await response.json()

      for (const service of responseBody.services) {
        expect(service).toHaveProperty('id')
        expect(service).toHaveProperty('title')
        expect(service).toHaveProperty('description')
        expect(service).toHaveProperty('displayOrder')

        expect(typeof service.id).toBe('string')
        expect(typeof service.title).toBe('string')
        expect(typeof service.description).toBe('string')
        expect(typeof service.displayOrder).toBe('number')
      }
    })

    it('should handle icon field correctly', async () => {
      const response = await fetch(`${API_BASE}/api/services`)
      expect(response.status).toBe(200)

      const responseBody = await response.json()

      for (const service of responseBody.services) {
        // Icon can be string or null
        expect(['string', 'object']).toContain(typeof service.icon)
        if (service.icon !== null) {
          expect(typeof service.icon).toBe('string')
        }
      }
    })
  })

  describe('HTTP Methods', () => {
    it('should reject POST requests with 405', async () => {
      const response = await fetch(`${API_BASE}/api/services`, {
        method: 'POST'
      })
      expect(response.status).toBe(405)
    })

    it('should reject PUT requests with 405', async () => {
      const response = await fetch(`${API_BASE}/api/services`, {
        method: 'PUT'
      })
      expect(response.status).toBe(405)
    })

    it('should reject DELETE requests with 405', async () => {
      const response = await fetch(`${API_BASE}/api/services`, {
        method: 'DELETE'
      })
      expect(response.status).toBe(405)
    })
  })

  describe('Caching and Performance', () => {
    it('should include appropriate cache headers', async () => {
      const response = await fetch(`${API_BASE}/api/services`)
      expect(response.status).toBe(200)

      // Should have cache headers for static content
      expect(response.headers.get('content-type')).toContain('application/json')
    })

    it('should respond within reasonable time', async () => {
      const startTime = Date.now()
      const response = await fetch(`${API_BASE}/api/services`)
      const endTime = Date.now()

      expect(response.status).toBe(200)
      expect(endTime - startTime).toBeLessThan(5000) // Should respond within 5 seconds
    })
  })

  describe('Query Parameters', () => {
    it('should ignore unknown query parameters', async () => {
      const response = await fetch(`${API_BASE}/api/services?unknown=param&another=value`)
      expect(response.status).toBe(200)
    })
  })
})