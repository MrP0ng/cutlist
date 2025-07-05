'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createSheet, getSheets, updateSheet, deleteSheet } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface Sheet {
  id: string
  length: number
  width: number
  thickness: number
  price?: number
  material: string
}

const demoSheets: Sheet[] = [
  { id: 'sheet-1', length: 2440, width: 1220, thickness: 18, price: 45.99, material: 'MDF' },
  { id: 'sheet-2', length: 2440, width: 1220, thickness: 12, price: 32.50, material: 'Plywood' },
]

interface SheetsTableProps {
  projectId?: string
}

export function SheetsTable({ projectId }: SheetsTableProps) {
  const [sheets, setSheets] = useState<Sheet[]>(demoSheets)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const { user } = useAuth()

  // Load sheets from database when projectId is available
  useEffect(() => {
    if (projectId && user && !user.is_anonymous) {
      loadSheets()
    }
  }, [projectId, user])

  const loadSheets = async () => {
    if (!projectId) return
    
    try {
      setLoading(true)
      const dbSheets = await getSheets(projectId)
      
      // Convert database sheets to component format
      const convertedSheets: Sheet[] = dbSheets.map(sheet => ({
        id: sheet.id,
        length: sheet.length_mm,
        width: sheet.width_mm,
        thickness: sheet.thickness_mm || 18,
        material: sheet.material || 'MDF'
      }))
      
      setSheets(convertedSheets)
    } catch (error) {
      console.error('Error loading sheets:', error)
      // Keep demo data if loading fails
    } finally {
      setLoading(false)
    }
  }

  const addSheet = async () => {
    const newLocalSheet: Sheet = {
      id: `temp-${Date.now()}`,
      length: 2440,
      width: 1220,
      thickness: 18,
      material: 'MDF'
    }

    // Add locally first for immediate UI feedback
    setSheets(prev => [...prev, newLocalSheet])

    // Save to database if we have a project
    if (projectId && user && !user.is_anonymous) {
      try {
        setSaving(newLocalSheet.id)
        const dbSheet = await createSheet(projectId, {
          length_mm: newLocalSheet.length,
          width_mm: newLocalSheet.width,
          thickness_mm: newLocalSheet.thickness,
          material: newLocalSheet.material
        })

        // Update with real database ID
        setSheets(prev => prev.map(sheet => 
          sheet.id === newLocalSheet.id 
            ? { ...sheet, id: dbSheet.id }
            : sheet
        ))
      } catch (error) {
        console.error('Error saving sheet:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        const errorMessage = error instanceof Error ? error.message : 
                            (error as any)?.message || 
                            JSON.stringify(error, null, 2)
        alert(`Failed to save sheet: ${errorMessage}`)
        // Remove the sheet if saving failed
        setSheets(prev => prev.filter(sheet => sheet.id !== newLocalSheet.id))
      } finally {
        setSaving(null)
      }
    }
  }

  const removeSheet = async (id: string) => {
    // Remove locally first for immediate UI feedback
    setSheets(prev => prev.filter(sheet => sheet.id !== id))

    // Delete from database if it's a real sheet
    if (projectId && user && !user.is_anonymous && !id.startsWith('temp-')) {
      try {
        await deleteSheet(id)
      } catch (error) {
        console.error('Error deleting sheet:', error)
        // Reload sheets to restore state
        await loadSheets()
      }
    }
  }

  const updateSheetField = async (id: string, field: keyof Sheet, value: string | number | undefined) => {
    // Update locally first for immediate UI feedback
    setSheets(prev => prev.map(sheet => 
      sheet.id === id ? { ...sheet, [field]: value } : sheet
    ))

    // Save to database if it's a real sheet
    if (projectId && user && !user.is_anonymous && !id.startsWith('temp-')) {
      try {
        setSaving(id)
        
        // Convert UI fields to database fields
        const dbUpdates: any = {}
        if (field === 'length') dbUpdates.length_mm = Number(value)
        else if (field === 'width') dbUpdates.width_mm = Number(value)
        else if (field === 'thickness') dbUpdates.thickness_mm = Number(value)
        else if (field === 'material') dbUpdates.material = String(value)

        await updateSheet(id, dbUpdates)
      } catch (error) {
        console.error('Error updating sheet:', error)
        // Reload sheets to restore state
        await loadSheets()
      } finally {
        setSaving(null)
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button onClick={addSheet} size="sm" className="flex-1" disabled={loading}>
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
      <div className="grid grid-cols-6 gap-1 text-xs font-medium text-muted-foreground px-1">
        <span>Material</span>
        <span>Length</span>
        <span>Width</span>
        <span>Thick.</span>
        <span>Price</span>
        <span></span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {sheets.map((sheet) => (
          <div key={sheet.id} className="grid grid-cols-6 gap-1 items-center text-xs">
            <Input
              value={sheet.material}
              onChange={(e) => updateSheetField(sheet.id, 'material', e.target.value)}
              placeholder="Material"
              className="h-8 text-xs"
              disabled={saving === sheet.id}
            />
            <Input
              value={sheet.length}
              onChange={(e) => updateSheetField(sheet.id, 'length', parseInt(e.target.value) || 0)}
              type="number"
              placeholder="L"
              className="h-8 text-xs"
              min="1"
              required
              disabled={saving === sheet.id}
            />
            <Input
              value={sheet.width}
              onChange={(e) => updateSheetField(sheet.id, 'width', parseInt(e.target.value) || 0)}
              type="number"
              placeholder="W"
              className="h-8 text-xs"
              min="1"
              required
              disabled={saving === sheet.id}
            />
            <Input
              value={sheet.thickness}
              onChange={(e) => updateSheetField(sheet.id, 'thickness', parseInt(e.target.value) || 0)}
              type="number"
              placeholder="T"
              className="h-8 text-xs"
              min="1"
              required
              disabled={saving === sheet.id}
            />
            <Input
              value={sheet.price || ''}
              onChange={(e) => updateSheetField(sheet.id, 'price', parseFloat(e.target.value) || undefined)}
              type="number"
              step="0.01"
              placeholder="$"
              className="h-8 text-xs"
              min="0"
              disabled={saving === sheet.id}
            />
            <Button
              onClick={() => removeSheet(sheet.id)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={saving === sheet.id}
            >
              {saving === sheet.id ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </Button>
          </div>
        ))}
      </div>

      {sheets.length === 0 && (
        <div className="text-center text-muted-foreground text-sm py-4">
          No sheets added yet
        </div>
      )}
    </div>
  )
}
