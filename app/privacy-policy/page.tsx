import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-stone-100">
      <Navigation />
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6">
              <strong>Effective: July 6, 2025</strong>
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">About Us</h2>
            <p className="mb-4">
              &quot;We&quot;, &quot;us&quot; or &quot;our&quot; means Favrs, LLC, with its principal place of business located at
              4015 TRAVIS DRIVE STE 211 1976, NASHVILLE, TN US 37211.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">About This Privacy Policy</h2>
            <p className="mb-4">
              Your privacy is important to us, so we&apos;ve developed this Privacy Policy, which explains
              how we collect, use, and disclose your personal information. We collect personal information
              when you use our website(s), mobile apps, and other online and offline products, services
              and experiences (collectively, the &quot;Services&quot;). Please take a moment to read through this
              Policy in its entirety.
            </p>
            <p className="mb-4">
              If you have any questions, concerns or complaints regarding this Privacy Policy or how we
              use your personal information please contact us via e-mail at will@thefavrs.com.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              What Personal Information We Collect and How We Collect It?
            </h2>
            <p className="mb-4">
              We collect personal information that you provide directly to us:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Contact information</li>
              <li>Payment information</li>
              <li>Survey information</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              How We Use Your Personal Information?
            </h2>
            <p className="mb-4">
              We use the personal information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Sending newsletters and marketing information</li>
              <li>Replying to inquiries</li>
              <li>Providing service information</li>
              <li>Monitoring and analyzing service usage</li>
              <li>Facilitating promotions</li>
              <li>Detecting and preventing fraud</li>
              <li>Fulfilling contractual obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              How We Share Your Personal Information?
            </h2>
            <p className="mb-4">
              We may share your personal information:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>With vendors and service providers</li>
              <li>During business transactions like mergers</li>
              <li>When legally required by court order or law enforcement</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Your Marketing Choices</h2>
            <p className="mb-4">
              You can opt out of marketing messages and unsubscribe at any time by contacting
              will@thefavrs.com.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Retention of Your Data and Deletion
            </h2>
            <p className="mb-4">
              Personal information will be kept only as long as necessary, considering legal requirements
              and potential risks.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">International Transfers</h2>
            <p className="mb-4">
              Transfers of personal information outside the US will follow appropriate safeguards.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="mb-4">
              The policy may be updated periodically, and users are encouraged to review it.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="mb-4">
              Favrs, LLC<br />
              4015 TRAVIS DRIVE STE 211 1976,<br />
              NASHVILLE, TN 37211<br />
              Email: will@thefavrs.com
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}