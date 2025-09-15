interface Service {
  id: string
  title: string
  description: string
  icon: string
  display_order: number
}

// Fallback static data
const fallbackServices: Service[] = [
  {
    id: '1',
    title: 'Event Planning & Management',
    description: 'From intimate gatherings to large-scale productions, we handle every detail to ensure your event is unforgettable.',
    icon: 'calendar',
    display_order: 1
  },
  {
    id: '2',
    title: 'Technology Solutions',
    description: 'Custom software development and technology consulting to streamline your entertainment business operations.',
    icon: 'code',
    display_order: 2
  },
  {
    id: '3',
    title: 'Creative Services',
    description: 'Comprehensive creative services including content creation, marketing strategy, and brand development.',
    icon: 'globe',
    display_order: 3
  }
]

async function getServices(): Promise<Service[]> {
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

export async function ServicesSection() {
  const services = await getServices()

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