// Simple test script to verify database CRUD operations
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testDatabase() {
  console.log('Testing database operations...')
  
  try {
    // Test anonymous auth
    console.log('1. Testing anonymous auth...')
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously()
    if (authError) throw authError
    console.log('✅ Anonymous auth successful')
    
    // Test creating a project
    console.log('2. Testing project creation...')
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([{ name: 'Test Project' }])
      .select()
      .single()
    
    if (projectError) throw projectError
    console.log('✅ Project created:', project)
    
    // Test creating a part
    console.log('3. Testing part creation...')
    const { data: part, error: partError } = await supabase
      .from('parts')
      .insert([{
        project_id: project.id,
        width_mm: 100,
        height_mm: 200,
        qty: 1,
        label: 'Test Part'
      }])
      .select()
      .single()
    
    if (partError) throw partError
    console.log('✅ Part created:', part)
    
    // Test creating a sheet
    console.log('4. Testing sheet creation...')
    const { data: sheet, error: sheetError } = await supabase
      .from('sheets')
      .insert([{
        project_id: project.id,
        material: 'Test Material',
        length_mm: 2440,
        width_mm: 1220,
        thickness_mm: 18
      }])
      .select()
      .single()
    
    if (sheetError) throw sheetError
    console.log('✅ Sheet created:', sheet)
    
    // Clean up
    console.log('5. Cleaning up...')
    await supabase.from('projects').delete().eq('id', project.id)
    console.log('✅ Test data cleaned up')
    
    console.log('🎉 All database operations successful!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
  }
}

testDatabase()
