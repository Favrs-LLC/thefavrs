import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { sendContactFormEmail } from '@/lib/email'

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

    const { firstName, lastName, email, phone, message, honeypot } = body

    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
      return NextResponse.json(
        { error: 'First name is required and must be a non-empty string', code: 'INVALID_FIRST_NAME' },
        { status: 400 }
      )
    }

    if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Last name is required and must be a non-empty string', code: 'INVALID_LAST_NAME' },
        { status: 400 }
      )
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
      return NextResponse.json(
        { error: 'Phone is required and must be a non-empty string', code: 'INVALID_PHONE' },
        { status: 400 }
      )
    }

    // Anti-spam honeypot validation
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json(
        { error: 'Spam detected', code: 'SPAM_DETECTED' },
        { status: 400 }
      )
    }

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

    if (firstName.length > 100) {
      return NextResponse.json(
        { error: 'First name must be 100 characters or less', code: 'FIRST_NAME_TOO_LONG' },
        { status: 400 }
      )
    }

    if (lastName.length > 100) {
      return NextResponse.json(
        { error: 'Last name must be 100 characters or less', code: 'LAST_NAME_TOO_LONG' },
        { status: 400 }
      )
    }

    if (phone.length > 20) {
      return NextResponse.json(
        { error: 'Phone must be 20 characters or less', code: 'PHONE_TOO_LONG' },
        { status: 400 }
      )
    }

    if (email.length > 255) {
      return NextResponse.json(
        { error: 'Email must be 255 characters or less', code: 'EMAIL_TOO_LONG' },
        { status: 400 }
      )
    }

    if (message && typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message must be a string', code: 'INVALID_MESSAGE' },
        { status: 400 }
      )
    }

    if (message && message.length > 10000) {
      return NextResponse.json(
        { error: 'Message must be 10000 characters or less', code: 'MESSAGE_TOO_LONG' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const { data: insertData, error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        message: message?.trim() || null,
        submitted_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)

      // Check if it's a schema issue and provide helpful error
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
        { error: 'Failed to submit contact form', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    // Send email notification to admin team
    try {
      await sendContactFormEmail({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        message: message?.trim()
      })
    } catch (emailError) {
      console.error('Error sending email notification:', emailError)
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Contact form submitted successfully',
        submissionId: insertData.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Unexpected error in contact API:', error)
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