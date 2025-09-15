import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { sendNewsletterSignupEmail, sendNewsletterWelcomeEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json', code: 'INVALID_CONTENT_TYPE' },
        { status: 400 }
      )
    }

    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON format', code: 'INVALID_JSON' },
        { status: 400 }
      )
    }

    const { email } = body

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json(
        { error: 'Email is required and must be a non-empty string', code: 'INVALID_EMAIL' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Email must be a valid email address', code: 'INVALID_EMAIL_FORMAT' },
        { status: 400 }
      )
    }

    if (email.length > 255) {
      return NextResponse.json(
        { error: 'Email must be 255 characters or less', code: 'EMAIL_TOO_LONG' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Check if email already exists
    const { data: existingSubscriber, error: selectError } = await supabase
      .from('newsletter_subscribers')
      .select('email, status')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Database select error:', selectError)
      return NextResponse.json(
        { error: 'Database error occurred', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    if (existingSubscriber) {
      if (existingSubscriber.status === 'confirmed') {
        return NextResponse.json(
          { error: 'Email is already subscribed to the newsletter', code: 'ALREADY_SUBSCRIBED' },
          { status: 409 }
        )
      } else if (existingSubscriber.status === 'pending') {
        return NextResponse.json(
          { error: 'Email subscription is pending confirmation', code: 'PENDING_CONFIRMATION' },
          { status: 409 }
        )
      }
    }

    // Insert new subscriber or reactivate unsubscribed one
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .upsert({
        email: email.trim().toLowerCase(),
        status: 'pending',
        subscribed_at: new Date().toISOString(),
        confirmed_at: null,
        unsubscribed_at: null
      }, {
        onConflict: 'email'
      })

    if (insertError) {
      console.error('Database insert error:', insertError)

      if (insertError.message?.includes('schema cache') || insertError.message?.includes('column')) {
        return NextResponse.json(
          {
            error: 'Database schema not properly configured. Please ensure migrations have been applied.',
            code: 'SCHEMA_ERROR',
            details: insertError.message
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    // Send email notifications
    try {
      // Send notification to admin team
      await sendNewsletterSignupEmail({ email: email.trim().toLowerCase() })

      // Send welcome email to subscriber
      await sendNewsletterWelcomeEmail(email.trim().toLowerCase())
    } catch (emailError) {
      console.error('Error sending email notifications:', emailError)
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter. Please check your email for confirmation.'
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Unexpected error in newsletter API:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
    { status: 405 }
  )
}