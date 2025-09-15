import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

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

    // Check if email exists in our database
    const { data: subscriber, error: selectError } = await supabase
      .from('newsletter_subscribers')
      .select('email, status')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (selectError) {
      if (selectError.code === 'PGRST116') { // No rows found - idempotent response
        return NextResponse.json(
          {
            success: true,
            message: 'Email unsubscribed successfully'
          },
          { status: 200 }
        )
      }

      console.error('Database select error:', selectError)
      return NextResponse.json(
        { error: 'Database error occurred', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    if (subscriber.status === 'unsubscribed') {
      // Already unsubscribed - idempotent response
      return NextResponse.json(
        {
          success: true,
          message: 'Email unsubscribed successfully'
        },
        { status: 200 }
      )
    }

    // Update subscriber status to unsubscribed
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email.trim().toLowerCase())

    if (updateError) {
      console.error('Database update error:', updateError)

      if (updateError.message?.includes('schema cache') || updateError.message?.includes('column')) {
        return NextResponse.json(
          {
            error: 'Database schema not properly configured. Please ensure migrations have been applied.',
            code: 'SCHEMA_ERROR',
            details: updateError.message
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to unsubscribe from newsletter', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Email unsubscribed successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Unexpected error in newsletter unsubscribe API:', error)
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