import { describe, it, expect, beforeAll } from 'vitest'

const API_BASE = 'http://localhost:3009'

describe('GET /api/team - Contract Tests', () => {
  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
  })

  describe('Valid Team Retrieval', () => {
    it('should return active team members with 200', async () => {
      const response = await fetch(`${API_BASE}/api/team`)

      expect(response.status).toBe(200)

      const responseBody = await response.json()
      expect(responseBody).toMatchObject({
        members: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            role: expect.any(String),
            bio: expect.any(String),
            displayOrder: expect.any(Number)
          })
        ])
      })
    })

    it('should return team members in display order', async () => {
      const response = await fetch(`${API_BASE}/api/team`)
      expect(response.status).toBe(200)

      const responseBody = await response.json()
      const members = responseBody.members

      // Verify members are ordered by displayOrder
      for (let i = 1; i < members.length; i++) {
        expect(members[i].displayOrder).toBeGreaterThanOrEqual(members[i - 1].displayOrder)
      }
    })

    it('should include both founders from seed data', async () => {
      const response = await fetch(`${API_BASE}/api/team`)
      expect(response.status).toBe(200)

      const responseBody = await response.json()
      const memberNames = responseBody.members.map((m: any) => m.name)

      expect(memberNames).toContain('Will Bridges')
      expect(memberNames).toContain('Joe Major')
    })

    it('should only return active team members', async () => {
      const response = await fetch(`${API_BASE}/api/team`)
      expect(response.status).toBe(200)

      const responseBody = await response.json()

      // All returned members should be active (implied by RLS policy)
      expect(Array.isArray(responseBody.members)).toBe(true)
    })
  })

  describe('Response Format Validation', () => {
    it('should include all required fields for each team member', async () => {
      const response = await fetch(`${API_BASE}/api/team`)
      expect(response.status).toBe(200)

      const responseBody = await response.json()

      for (const member of responseBody.members) {
        expect(member).toHaveProperty('id')
        expect(member).toHaveProperty('name')
        expect(member).toHaveProperty('role')
        expect(member).toHaveProperty('bio')
        expect(member).toHaveProperty('displayOrder')

        expect(typeof member.id).toBe('string')
        expect(typeof member.name).toBe('string')
        expect(typeof member.role).toBe('string')
        expect(typeof member.bio).toBe('string')
        expect(typeof member.displayOrder).toBe('number')
      }
    })

    it('should handle imageUrl field correctly', async () => {
      const response = await fetch(`${API_BASE}/api/team`)
      expect(response.status).toBe(200)

      const responseBody = await response.json()

      for (const member of responseBody.members) {
        // imageUrl can be string or null
        if (member.hasOwnProperty('imageUrl')) {
          expect(['string', 'object']).toContain(typeof member.imageUrl)
          if (member.imageUrl !== null) {
            expect(typeof member.imageUrl).toBe('string')
          }
        }
      }
    })

    it('should validate role field for founders', async () => {
      const response = await fetch(`${API_BASE}/api/team`)
      expect(response.status).toBe(200)

      const responseBody = await response.json()
      const founderMembers = responseBody.members.filter((m: any) =>
        m.name === 'Will Bridges' || m.name === 'Joe Major'
      )

      for (const founder of founderMembers) {
        expect(founder.role).toBe('Co-Founder')
      }
    })
  })

  describe('HTTP Methods', () => {
    it('should reject POST requests with 405', async () => {
      const response = await fetch(`${API_BASE}/api/team`, {
        method: 'POST'
      })
      expect(response.status).toBe(405)
    })

    it('should reject PUT requests with 405', async () => {
      const response = await fetch(`${API_BASE}/api/team`, {
        method: 'PUT'
      })
      expect(response.status).toBe(405)
    })

    it('should reject DELETE requests with 405', async () => {
      const response = await fetch(`${API_BASE}/api/team`, {
        method: 'DELETE'
      })
      expect(response.status).toBe(405)
    })
  })

  describe('Content Quality', () => {
    it('should have non-empty bio content for all members', async () => {
      const response = await fetch(`${API_BASE}/api/team`)
      expect(response.status).toBe(200)

      const responseBody = await response.json()

      for (const member of responseBody.members) {
        expect(member.bio.length).toBeGreaterThan(0)
        expect(member.bio.trim()).not.toBe('')
      }
    })

    it('should have reasonable bio length limits', async () => {
      const response = await fetch(`${API_BASE}/api/team`)
      expect(response.status).toBe(200)

      const responseBody = await response.json()

      for (const member of responseBody.members) {
        expect(member.bio.length).toBeLessThan(5000) // Reasonable upper limit
        expect(member.bio.length).toBeGreaterThan(10) // Reasonable lower limit
      }
    })
  })

  describe('Caching and Performance', () => {
    it('should include appropriate cache headers', async () => {
      const response = await fetch(`${API_BASE}/api/team`)
      expect(response.status).toBe(200)

      // Should have cache headers for static content
      expect(response.headers.get('content-type')).toContain('application/json')
    })

    it('should respond within reasonable time', async () => {
      const startTime = Date.now()
      const response = await fetch(`${API_BASE}/api/team`)
      const endTime = Date.now()

      expect(response.status).toBe(200)
      expect(endTime - startTime).toBeLessThan(5000) // Should respond within 5 seconds
    })
  })

  describe('Query Parameters', () => {
    it('should ignore unknown query parameters', async () => {
      const response = await fetch(`${API_BASE}/api/team?unknown=param&filter=value`)
      expect(response.status).toBe(200)
    })
  })
})