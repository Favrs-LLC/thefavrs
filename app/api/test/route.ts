import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test basic connection
    const { data: teamMembers, error: teamError } = await supabase
      .from('team_members')
      .select('name, role')
      .eq('is_active', true)
      .order('display_order')

    if (teamError) {
      console.error('Team query error:', teamError)
      return NextResponse.json(
        { error: 'Failed to fetch team members', details: teamError.message },
        { status: 500 }
      )
    }

    // Test service offerings
    const { data: services, error: servicesError } = await supabase
      .from('service_offerings')
      .select('title, icon')
      .eq('is_active', true)
      .order('display_order')

    if (servicesError) {
      console.error('Services query error:', servicesError)
      return NextResponse.json(
        { error: 'Failed to fetch services', details: servicesError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection working!',
      data: {
        teamMembers: teamMembers || [],
        services: services || [],
        timestamp: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error('API test error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}