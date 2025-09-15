import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Confirmation token is required', code: 'MISSING_TOKEN' },
        { status: 400 }
      )
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(token)) {
      return NextResponse.json(
        { error: 'Invalid token format', code: 'INVALID_TOKEN_FORMAT' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // In a real implementation, you'd have a separate confirmation_tokens table
    // For now, we'll simulate this by checking if the token matches a subscriber ID
    const { data: subscriber, error: selectError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, status')
      .eq('id', token)
      .single()

    if (selectError) {
      if (selectError.code === 'PGRST116') { // No rows found
        return NextResponse.json(
          { error: 'Invalid or expired confirmation token', code: 'INVALID_TOKEN' },
          { status: 404 }
        )
      }

      console.error('Database select error:', selectError)
      return NextResponse.json(
        { error: 'Database error occurred', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    if (subscriber.status === 'confirmed') {
      return NextResponse.json(
        {
          success: true,
          message: 'Email is already confirmed',
          email: subscriber.email
        },
        { status: 200 }
      )
    }

    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json(
        { error: 'Cannot confirm unsubscribed email', code: 'EMAIL_UNSUBSCRIBED' },
        { status: 400 }
      )
    }

    // Update subscriber status to confirmed
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      })
      .eq('id', token)

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to confirm subscription', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Email successfully confirmed for newsletter subscription',
        email: subscriber.email
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Unexpected error in newsletter confirm API:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

export async function POST() {
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