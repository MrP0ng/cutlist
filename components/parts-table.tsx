'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { demoWorkbenchParts } from '@/lib/demoParts'
import { createPart, getParts, updatePart, deletePart } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface Part {
  id: string
  w: number
  h: number
  qty: number
  label: string
}

interface PartsTableProps {
  projectId?: string
}

export function PartsTable({ projectId }: PartsTableProps) {
  const [parts, setParts] = useState<Part[]>(demoWorkbenchParts)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const { user } = useAuth()

  // Load parts from database when projectId is available
  useEffect(() => {
    if (projectId && user && !user.is_anonymous) {
      loadParts()
    }
  }, [projectId, user])

  const loadParts = async () => {
    if (!projectId) return
    
    try {
      setLoading(true)
      const dbParts = await getParts(projectId)
      
      // Convert database parts to component format
      const convertedParts: Part[] = dbParts.map(part => ({
        id: part.id,
        w: part.width_mm,
        h: part.height_mm,
        qty: part.qty,
        label: part.label || `Part ${part.id.slice(-4)}`
      }))
      
      setParts(convertedParts)
    } catch (error) {
      console.error('Error loading parts:', error)
      // Keep demo data if loading fails
    } finally {
      setLoading(false)
    }
  }

  const addPart = async () => {
    console.log('Adding part:', { projectId, user: user?.id, isAnonymous: user?.is_anonymous })
    
    const newLocalPart: Part = {
      id: `temp-${Date.now()}`,
      w: 100,
      h: 100,
      qty: 1,
      label: 'New Part'
    }

    // Add locally first for immediate UI feedback
    setParts(prev => [...prev, newLocalPart])

    // Save to database if we have a project
    if (projectId && user && !user.is_anonymous) {
      try {
        console.log('Saving part to database:', newLocalPart)
        setSaving(newLocalPart.id)
        const dbPart = await createPart(projectId, {
          width_mm: newLocalPart.w,
          height_mm: newLocalPart.h,
          qty: newLocalPart.qty,
          label: newLocalPart.label
        })
        console.log('Part saved to database:', dbPart)

        // Update with real database ID
        setParts(prev => prev.map(part => 
          part.id === newLocalPart.id 
            ? { ...part, id: dbPart.id }
            : part
        ))
      } catch (error) {
        console.error('Error saving part:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        const errorMessage = error instanceof Error ? error.message : 
                            (error as any)?.message || 
                            JSON.stringify(error, null, 2)
        alert(`Failed to save part: ${errorMessage}`)
        // Remove the part if saving failed
        setParts(prev => prev.filter(part => part.id !== newLocalPart.id))
      } finally {
        setSaving(null)
      }
    } else {
      console.log('Not saving to database - no project or user not authenticated')
    }
  }

  const removePart = async (id: string) => {
    // Remove locally first for immediate UI feedback
    setParts(prev => prev.filter(part => part.id !== id))

    // Delete from database if it's a real part
    if (projectId && user && !user.is_anonymous && !id.startsWith('temp-')) {
      try {
        await deletePart(id)
      } catch (error) {
        console.error('Error deleting part:', error)
        // Reload parts to restore state
        await loadParts()
      }
    }
  }

  const updatePartField = async (id: string, field: keyof Part, value: string | number) => {
    // Update locally first for immediate UI feedback
    setParts(prev => prev.map(part => 
      part.id === id ? { ...part, [field]: value } : part
    ))

    // Save to database if it's a real part
    if (projectId && user && !user.is_anonymous && !id.startsWith('temp-')) {
      try {
        setSaving(id)
        
        // Convert UI fields to database fields
        const dbUpdates: any = {}
        if (field === 'w') dbUpdates.width_mm = Number(value)
        else if (field === 'h') dbUpdates.height_mm = Number(value)
        else if (field === 'qty') dbUpdates.qty = Number(value)
        else if (field === 'label') dbUpdates.label = String(value)

        await updatePart(id, dbUpdates)
      } catch (error) {
        console.error('Error updating part:', error)
        // Reload parts to restore state
        await loadParts()
      } finally {
        setSaving(null)
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        Enter part sizes below (mm)
      </div>
      
      <div className="flex gap-2">
        <Button onClick={addPart} size="sm" className="flex-1" disabled={loading}>
          {loading ? (
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <Plus className="h-3 w-3 mr-1" />
          )}
          Add
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Upload className="h-3 w-3 mr-1" />
          CSV
        </Button>
      </div>

      {/* Header Labels */}
      <div className="grid grid-cols-4 gap-1 text-xs font-medium text-muted-foreground px-1">
        <span>Label</span>
        <span>Width</span>
        <span>Height</span>
        <span>Qty</span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {parts.map((part) => (
          <div key={part.id} className="grid grid-cols-4 gap-1 items-center text-xs">
            <Input
              value={part.label}
              onChange={(e) => updatePartField(part.id, 'label', e.target.value)}
              placeholder="Label"
              className="h-8 text-xs"
              disabled={saving === part.id}
            />
            <Input
              value={part.w}
              onChange={(e) => updatePartField(part.id, 'w', parseInt(e.target.value) || 0)}
              type="number"
              placeholder="W"
              className="h-8 text-xs"
              min="1"
              required
              disabled={saving === part.id}
            />
            <Input
              value={part.h}
              onChange={(e) => updatePartField(part.id, 'h', parseInt(e.target.value) || 0)}
              type="number"
              placeholder="H"
              className="h-8 text-xs"
              min="1"
              required
              disabled={saving === part.id}
            />
            <div className="flex gap-1">
              <Input
                value={part.qty}
                onChange={(e) => updatePartField(part.id, 'qty', parseInt(e.target.value) || 1)}
                type="number"
                placeholder="Q"
                className="h-8 text-xs flex-1"
                min="1"
                disabled={saving === part.id}
              />
              <Button
                onClick={() => removePart(part.id)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={saving === part.id}
              >
                {saving === part.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {parts.length === 0 && (
        <div className="text-center text-muted-foreground text-sm py-4">
          No parts added yet
        </div>
      )}
    </div>
  )
}
