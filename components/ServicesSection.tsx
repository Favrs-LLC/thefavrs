'use client'

import { useState, useEffect } from 'react'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  display_order: number
}

// Fallback static data matching seed data
const fallbackServices: Service[] = [
  {
    id: '1',
    title: 'Custom Branded Events For Venues',
    description: 'We create unforgettable branded experiences that strengthen venue identity and build loyal audiences. From concept to execution, our team handles event planning, artist coordination, and marketing campaigns that deliver measurable results for entertainment venues.',
    icon: 'calendar',
    display_order: 1
  },
  {
    id: '2',
    title: 'Software That Helps You Reach Your Customers',
    description: 'Custom software solutions designed to connect businesses with their target audiences. We build applications, platforms, and tools that streamline operations while enhancing customer engagement and driving growth.',
    icon: 'code',
    display_order: 2
  },
  {
    id: '3',
    title: 'Build You a Beautiful & Professional Website',
    description: 'Modern, responsive websites that represent your brand professionally online. Our web development services focus on performance, user experience, and conversion optimization to help your business succeed in the digital space.',
    icon: 'globe',
    display_order: 3
  },
  {
    id: '4',
    title: 'We Help You Make More Sales',
    description: 'Strategic sales and marketing consulting that drives revenue growth. We analyze your current processes, identify opportunities, and implement systems that increase conversion rates and customer lifetime value.',
    icon: 'trending-up',
    display_order: 4
  }
]

async function getServices(): Promise<Service[]> {
  // During build time, just return fallback data
  if (!process.env.NEXT_PUBLIC_BASE_URL && process.env.NODE_ENV !== 'development') {
    return fallbackServices
  }

  try {
    // Use absolute URL for server-side fetching
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3009'
    const response = await fetch(`${baseUrl}/api/services`, {
      cache: 'no-store' // Ensure fresh data
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.status}`)
    }

    const data = await response.json()
    const services = data.services || []

    // Return fallback data if no services in database
    return services.length > 0 ? services : fallbackServices
  } catch (error) {
    console.error('Failed to fetch services:', error)
    // Return fallback data on error
    return fallbackServices
  }
}

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>(fallbackServices)

  useEffect(() => {
    getServices().then(setServices)
  }, [])

  const iconMap: Record<string, string> = {
    calendar: '📅',
    code: '💻',
    globe: '🌐',
    'trending-up': '📈'
  }

  return (
    <section id="services" className="py-16 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What We Do
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We specialize in creating memorable experiences and powerful technology solutions
            that help entertainment businesses thrive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start">
                <div className="text-4xl mr-4 flex-shrink-0">
                  {iconMap[service.icon] || '🔧'}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
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