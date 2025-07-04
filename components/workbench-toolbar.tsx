'use client'

import { useState } from 'react'
import { 
  Play, 
  Save, 
  FileText, 
  Loader2,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthModal } from '@/components/auth-modal'
import { useAuth } from '@/hooks/useAuth'

export function WorkbenchToolbar() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const { isAnonymous } = useAuth()

  const handleOptimize = async () => {
    setIsOptimizing(true)
    // TODO: Call optimizer via Web Worker
    await new Promise(resolve => setTimeout(resolve, 2000)) // Demo delay
    setIsOptimizing(false)
  }

  const handleSave = () => {
    // TODO: Save to Supabase
    console.log('Save project')
  }

  const handleExportPDF = () => {
    // TODO: Export to PDF
    console.log('Export PDF')
  }

  return (
    <>
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b flex items-center px-4 py-2">
        <div className="ml-auto flex gap-2">
          {isAnonymous && (
            <Button 
              variant="outline" 
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Sign In
            </Button>
          )}
          
          <Button 
            onClick={handleOptimize} 
            disabled={isOptimizing}
            className="flex items-center gap-2"
          >
            {isOptimizing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isOptimizing ? 'Optimizing...' : 'Optimize'}
          </Button>

          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>

          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  )
}
