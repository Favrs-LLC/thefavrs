import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Two-image hero layout - Events left, Tech right */}
      <div className="absolute inset-0 flex">
        {/* Left side - Events/Entertainment image */}
        <div className="w-1/2 relative">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/images/hero-bg-2.jpg)'
            }}
          ></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Right side - Tech/Coding image */}
        <div className="w-1/2 relative">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/images/hero-bg-1.jpg)'
            }}
          ></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight italic">
            We build creative branded events and tech solutions for the entertainment industry.
          </h1>

          {/* CTA Button */}
          <div className="mt-12">
            <Link
              href="#contact"
              className="inline-flex items-center px-8 py-4 bg-black/80 text-white text-lg font-medium rounded-full hover:bg-black/90 transition-colors border border-white/20 backdrop-blur-sm"
            >
              Contact Us To Learn How We Can Help You
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}