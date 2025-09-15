'use client'

import { useState, useEffect } from 'react'

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  imageUrl?: string
  displayOrder: number
}

// Fallback static data matching seed data
const fallbackTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Will Bridges',
    role: 'Co-Founder',
    bio: 'is an engineering leader and entrepreneur with over 25 years of experience in software development, team management, and technology strategy. Known for delivering results across startups and established companies alike, Will has led agile transformations, managed global teams, and overseen the successful deployment of complex systems with a focus on reliability and efficiency. An advocate for AI-driven productivity and modern development practices, he combines deep technical expertise with strong business acumen—negotiating partnerships, optimizing processes, and launching ventures in both technology and entertainment spaces. Based in Nashville, he brings a collaborative, hands-on approach to solving real-world problems and building high-performing teams',
    imageUrl: '/images/will-headshot.png',
    displayOrder: 1
  },
  {
    id: '2',
    name: 'Joe Major',
    role: 'Co-Founder',
    bio: 'is a Chicago-born, Nashville-based host, promoter, and radio personality with over 15 years of experience in the entertainment industry. Recognized as an expert nightlife strategist and creative consultant, he has produced and hosted branded events for leading venues, developed marketing campaigns, and collaborated with top-tier artists including Megan Thee Stallion, Cardi B, Migos, and 2 Chainz. Joe is known for his ability to craft immersive, community-driven experiences that strengthen audience engagement and deliver measurable results for partners and brands alike. Currently, he curates and hosts a roster of high-profile weekly events across Nashville, bringing a professional approach and unmistakable energy to every project he touches.',
    imageUrl: '/images/joe-headshot.jpg',
    displayOrder: 2
  }
]

async function getTeamMembers(): Promise<TeamMember[]> {
  // During build time, just return fallback data
  if (!process.env.NEXT_PUBLIC_BASE_URL && process.env.NODE_ENV !== 'development') {
    return fallbackTeamMembers
  }

  try {
    // Use absolute URL for server-side fetching
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3009'
    const response = await fetch(`${baseUrl}/api/team`, {
      cache: 'no-store' // Ensure fresh data
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch team: ${response.status}`)
    }

    const data = await response.json()
    const members = data.members || []

    // Return fallback data if no members in database
    return members.length > 0 ? members : fallbackTeamMembers
  } catch (error) {
    console.error('Failed to fetch team:', error)
    // Return fallback data on error
    return fallbackTeamMembers
  }
}

export function TeamSection() {
  const [members, setMembers] = useState<TeamMember[]>(fallbackTeamMembers)

  useEffect(() => {
    getTeamMembers().then(setMembers)
  }, [])

  return (
    <section id="team" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Meet the Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our founders bring decades of combined experience in entertainment,
            technology, and business development.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-gray-50 rounded-lg p-8 hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                {/* Large photo above text - using object-contain to show full head */}
                <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-600 mb-6 overflow-hidden">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full rounded-full object-contain"
                    />
                  ) : (
                    member.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <div className="w-full">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4 font-medium">
                    {member.role}
                  </p>
                  <p className="text-gray-700 leading-relaxed text-left">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}