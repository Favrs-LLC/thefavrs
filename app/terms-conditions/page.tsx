import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-stone-100">
      <Navigation />
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Messaging Terms & Conditions</h1>

          <div className="prose prose-lg max-w-none text-gray-700">
            <div className="mb-6">
              <p className="mb-2"><strong>Favrs, LLC</strong></p>
              <p className="mb-2">4015 TRAVIS DRIVE STE 211 1976, NASHVILLE, TN 37211</p>
              <p className="mb-2">will@thefavrs.com</p>
              <p className="mb-2">6159448853</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">General</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>When you opt-in, a confirmation message will be sent</li>
              <li>Agree to receive recurring automated marketing and informational text messages</li>
              <li>Messages may use automatic telephone dialing system</li>
              <li>Message frequency varies</li>
              <li>Favrs, LLC reserves right to alter message frequency and sender</li>
              <li>Standard message and data rates apply</li>
              <li>Consent to marketing messages is not a condition of purchase</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Carriers</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Carriers not liable for delayed or undelivered messages</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Cancellation</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Can unsubscribe by texting STOP or using included link</li>
              <li>Confirmation message sent after unsubscribing</li>
              <li>Can re-subscribe by signing up again</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Info</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Support via email: will@thefavrs.com</li>
              <li>Can text &quot;HELP&quot; for instructions</li>
              <li>Unsubscribe instructions available via link in messages</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Transfer of Number</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Must notify company before changing/transferring mobile number</li>
              <li>Can reply &quot;STOP&quot; or email old number</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Privacy</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Privacy questions: <a href="http://eepurl.com/jiEuX-" className="text-blue-600 hover:underline">http://eepurl.com/jiEuX-</a></li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Messaging Terms Changes</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Company reserves right to change/terminate messaging program</li>
              <li>Changes effective immediately</li>
              <li>Continued enrollment constitutes acceptance of changes</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}