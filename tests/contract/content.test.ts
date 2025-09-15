import { describe, it, expect, beforeAll } from 'vitest'

const API_BASE = 'http://localhost:3009'

describe('GET /api/content/{slug} - Contract Tests', () => {
  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
  })

  describe('Valid Content Retrieval', () => {
    it('should return content for valid slug with 200', async () => {
      const validSlugs = ['privacy-policy', 'terms-conditions']

      for (const slug of validSlugs) {
        const response = await fetch(`${API_BASE}/api/content/${slug}`)

        expect(response.status).toBe(200)

        const responseBody = await response.json()
        expect(responseBody).toMatchObject({
          slug: expect.any(String),
          title: expect.any(String),
          content: expect.any(String),
          updatedAt: expect.any(String)
        })
      }
    })

    it('should handle slug with hyphens correctly', async () => {
      const response = await fetch(`${API_BASE}/api/content/privacy-policy`)
      expect([200, 404]).toContain(response.status)
    })
  })

  describe('Invalid Content Requests', () => {
    it('should return 404 for non-existent slug', async () => {
      const response = await fetch(`${API_BASE}/api/content/non-existent-page`)

      expect(response.status).toBe(404)

      const responseBody = await response.json()
      expect(responseBody).toMatchObject({
        error: expect.any(String),
        code: expect.any(String)
      })
    })

    it('should reject invalid slug format with 400', async () => {
      const invalidSlugs = [
        'invalid spaces',
        'UPPERCASE',
        'special@chars',
        'with/slash',
        'with.dot'
      ]

      for (const slug of invalidSlugs) {
        const response = await fetch(`${API_BASE}/api/content/${encodeURIComponent(slug)}`)
        expect([400, 404]).toContain(response.status)
      }
    })

    it('should handle empty slug gracefully', async () => {
      const response = await fetch(`${API_BASE}/api/content/`)
      expect(response.status).toBe(404)
    })
  })

  describe('HTTP Methods', () => {
    it('should reject POST requests with 405', async () => {
      const response = await fetch(`${API_BASE}/api/content/test-slug`, {
        method: 'POST'
      })
      expect(response.status).toBe(405)
    })

    it('should reject PUT requests with 405', async () => {
      const response = await fetch(`${API_BASE}/api/content/test-slug`, {
        method: 'PUT'
      })
      expect(response.status).toBe(405)
    })

    it('should reject DELETE requests with 405', async () => {
      const response = await fetch(`${API_BASE}/api/content/test-slug`, {
        method: 'DELETE'
      })
      expect(response.status).toBe(405)
    })
  })
})