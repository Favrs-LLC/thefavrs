import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const { data: members, error: selectError } = await supabase
      .from('team_members')
      .select('id, name, role, bio, image_url, display_order')
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

    // Ensure imageUrl field is properly handled (convert null to null, keep strings as strings)
    const formattedMembers = (members || []).map(member => ({
      id: member.id,
      name: member.name,
      role: member.role,
      bio: member.bio,
      displayOrder: member.display_order,
      imageUrl: member.image_url
    }))

    return NextResponse.json(
      {
        members: formattedMembers
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=600' // 5 min client, 10 min CDN
        }
      }
    )

  } catch (error) {
    console.error('Unexpected error in team API:', error)
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