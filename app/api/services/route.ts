import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const { data: services, error: selectError } = await supabase
      .from('service_offerings')
      .select('id, title, description, icon, display_order')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (selectError) {
      console.error('Database select error:', selectError)

      if (selectError.message?.includes('schema cache') || selectError.message?.includes('column')) {
        return NextResponse.json(
          {
            error: 'Database schema not properly configured. Please ensure migrations have been applied.',
            code: 'SCHEMA_ERROR',
            details: selectError.message
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { error: 'Database error occurred', code: 'DATABASE_ERROR' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        services: services || []
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=600' // 5 min client, 10 min CDN
        }
      }
    )

  } catch (error) {
    console.error('Unexpected error in services API:', error)
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