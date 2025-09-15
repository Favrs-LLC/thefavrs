import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required', code: 'MISSING_SLUG' },
        { status: 400 }
      )
    }

    // Validate slug format (lowercase, hyphens, alphanumeric)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Slug must contain only lowercase letters, numbers, and hyphens.', code: 'INVALID_SLUG_FORMAT' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const { data: content, error: selectError } = await supabase
      .from('page_content')
      .select('slug, title, content, updated_at')
      .eq('slug', slug)
      .single()

    if (selectError) {
      if (selectError.code === 'PGRST116') { // No rows found
        return NextResponse.json(
          { error: 'Content not found', code: 'CONTENT_NOT_FOUND' },
          { status: 404 }
        )
      }

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
        slug: content.slug,
        title: content.title,
        content: content.content,
        updatedAt: content.updated_at
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=600' // 5 min client, 10 min CDN
        }
      }
    )

  } catch (error) {
    console.error('Unexpected error in content API:', error)
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