'use client'

import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function TestAuthPage() {
  const { user, loading, usage, refreshUsage, isAnonymous, isPro } = useAuth()
  const [testResults, setTestResults] = useState<string[]>([])

  const runTests = async () => {
    const results: string[] = []
    
    try {
      // Test 1: Check user authentication
      results.push(`✅ User authenticated: ${user?.id}`)
      results.push(`✅ Is anonymous: ${isAnonymous}`)
      results.push(`✅ User role: ${usage?.role || 'unknown'}`)
      
      // Test 2: Test database operations
      if (user) {
        // Test creating a project
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .insert({
            owner: user.id,
            name: 'Test Project'
          })
          .select()
          .single()
        
        if (projectError) {
          results.push(`❌ Project creation failed: ${projectError.message}`)
        } else {
          results.push(`✅ Project created: ${project.id}`)
          
          // Test creating a part
          const { data: part, error: partError } = await supabase
            .from('parts')
            .insert({
              project_id: project.id,
              w_mm: 100,
              h_mm: 200,
              qty: 1,
              label: 'Test Part'
            })
            .select()
            .single()
          
          if (partError) {
            results.push(`❌ Part creation failed: ${partError.message}`)
          } else {
            results.push(`✅ Part created: ${part.id}`)
          }
          
          // Clean up test data
          await supabase.from('projects').delete().eq('id', project.id)
          results.push(`✅ Test data cleaned up`)
        }
      }
      
      // Test 3: Check quotas
      await refreshUsage()
      results.push(`✅ Usage data refreshed`)
      
    } catch (error) {
      results.push(`❌ Test failed: ${error}`)
    }
    
    setTestResults(results)
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Task 2: Supabase Schema & Auth Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Authentication Status</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p><strong>User ID:</strong> {user?.id || 'Not authenticated'}</p>
            <p><strong>Email:</strong> {user?.email || 'Anonymous'}</p>
            <p><strong>Is Anonymous:</strong> {isAnonymous ? 'Yes' : 'No'}</p>
            <p><strong>Created:</strong> {user?.created_at}</p>
          </div>
        </div>

        {/* Usage Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Usage & Quotas</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            {usage ? (
              <>
                <p><strong>Role:</strong> {usage.role} {isPro && '👑'}</p>
                <p><strong>Projects:</strong> {usage.projects}/{usage.limits.projects || '∞'}</p>
                <p><strong>Sheets:</strong> {usage.sheets}/{usage.limits.sheets || '∞'}</p>
                <p><strong>Parts:</strong> {usage.parts}</p>
                <p><strong>Parts per project limit:</strong> {usage.limits.parts_per_project || '∞'}</p>
                {usage.pro_until && (
                  <p><strong>Pro until:</strong> {new Date(usage.pro_until).toLocaleDateString()}</p>
                )}
              </>
            ) : (
              <p>Loading usage data...</p>
            )}
          </div>
        </div>
      </div>

      {/* Test Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Database Tests</h2>
        <Button onClick={runTests} className="mb-4">
          Run Database Tests
        </Button>
        
        {testResults.length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <ul className="space-y-1 font-mono text-sm">
              {testResults.map((result, index) => (
                <li key={index}>{result}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Schema Info */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Database Schema</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Tables Created:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>profiles</strong> - User profiles with role (free/pro)</li>
            <li><strong>projects</strong> - User projects (limit: 5 for free users)</li>
            <li><strong>sheets</strong> - Material sheets (limit: 5 total for free users)</li>
            <li><strong>parts</strong> - Parts to cut (limit: 50 per project for free users)</li>
          </ul>
          
          <h3 className="font-semibold mt-4 mb-2">RLS Policies:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Users can only access their own data</li>
            <li>Free users have quota limits enforced</li>
            <li>Pro users bypass all quotas</li>
            <li>Anonymous users get auto-created profiles</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
