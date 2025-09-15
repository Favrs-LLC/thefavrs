import { NextRequest, NextResponse } from 'next/server'

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

    const { level, message, timestamp, context, error } = body

    // Validate required fields
    if (!level || typeof level !== 'string') {
      return NextResponse.json(
        { error: 'Level is required and must be a string', code: 'INVALID_LEVEL' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string', code: 'INVALID_MESSAGE' },
        { status: 400 }
      )
    }

    if (!timestamp || typeof timestamp !== 'string') {
      return NextResponse.json(
        { error: 'Timestamp is required and must be a string', code: 'INVALID_TIMESTAMP' },
        { status: 400 }
      )
    }

    // Validate log level
    const validLevels = ['error', 'warn', 'info', 'debug']
    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { error: `Level must be one of: ${validLevels.join(', ')}`, code: 'INVALID_LEVEL_VALUE' },
        { status: 400 }
      )
    }

    // Validate timestamp format (ISO 8601)
    try {
      const parsedDate = new Date(timestamp)
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date')
      }
    } catch (err) {
      return NextResponse.json(
        { error: 'Timestamp must be a valid ISO 8601 date string', code: 'INVALID_TIMESTAMP_FORMAT' },
        { status: 400 }
      )
    }

    // Validate message length
    if (message.length > 10000) {
      return NextResponse.json(
        { error: 'Message must be 10000 characters or less', code: 'MESSAGE_TOO_LONG' },
        { status: 400 }
      )
    }

    // Validate optional context field
    if (context !== undefined && (typeof context !== 'object' || context === null || Array.isArray(context))) {
      return NextResponse.json(
        { error: 'Context must be an object', code: 'INVALID_CONTEXT' },
        { status: 400 }
      )
    }

    // Validate optional error field
    if (error !== undefined && (typeof error !== 'object' || error === null || Array.isArray(error))) {
      return NextResponse.json(
        { error: 'Error must be an object', code: 'INVALID_ERROR' },
        { status: 400 }
      )
    }

    // In a real implementation, you'd store this in a logging service
    // For now, we'll just log to console and return success
    const logEntry = {
      level,
      message: message.trim(),
      timestamp,
      context: context || undefined,
      error: error || undefined,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      receivedAt: new Date().toISOString()
    }

    // Log based on level
    switch (level) {
      case 'error':
        console.error('Frontend Log:', logEntry)
        break
      case 'warn':
        console.warn('Frontend Log:', logEntry)
        break
      case 'info':
        console.info('Frontend Log:', logEntry)
        break
      case 'debug':
        console.debug('Frontend Log:', logEntry)
        break
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Log entry received successfully'
      },
      { status: 202 }
    )

  } catch (error) {
    console.error('Unexpected error in logs API:', error)
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