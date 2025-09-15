const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Read environment variables from .env.local
const envFile = fs.readFileSync('.env.local', 'utf8')
const envVars = {}
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    envVars[key] = value
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function updateTeamImages() {
  try {
    // Update Will Bridges
    const { error: willError } = await supabase
      .from('team_members')
      .update({ image_url: '/images/will-headshot.png' })
      .eq('name', 'Will Bridges')

    if (willError) {
      console.error('Error updating Will Bridges:', willError)
      return
    }

    // Update Joe Major
    const { error: joeError } = await supabase
      .from('team_members')
      .update({ image_url: '/images/joe-headshot.jpg' })
      .eq('name', 'Joe Major')

    if (joeError) {
      console.error('Error updating Joe Major:', joeError)
      return
    }

    console.log('Successfully updated team member images!')
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

updateTeamImages()