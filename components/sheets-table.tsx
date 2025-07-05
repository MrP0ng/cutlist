'use client'

import { useState } from 'react'
import { Plus, X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

export function SheetsTable() {
  const [sheets, setSheets] = useState<Sheet[]>(demoSheets)

  const addSheet = () => {
    const newSheet: Sheet = {
      id: `sheet-${Date.now()}`,
      length: 2440,
      width: 1220,
      thickness: 18,
      material: 'MDF'
    }
    setSheets([...sheets, newSheet])
  }

  const removeSheet = (id: string) => {
    setSheets(sheets.filter(sheet => sheet.id !== id))
  }

  const updateSheet = (id: string, field: keyof Sheet, value: string | number | undefined) => {
    setSheets(sheets.map(sheet => 
      sheet.id === id ? { ...sheet, [field]: value } : sheet
    ))
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button onClick={addSheet} size="sm" className="flex-1">
          <Plus className="h-3 w-3 mr-1" />
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
              onChange={(e) => updateSheet(sheet.id, 'material', e.target.value)}
              placeholder="Material"
              className="h-8 text-xs"
            />
            <Input
              value={sheet.length}
              onChange={(e) => updateSheet(sheet.id, 'length', parseInt(e.target.value) || 0)}
              type="number"
              placeholder="L"
              className="h-8 text-xs"
              min="1"
              required
            />
            <Input
              value={sheet.width}
              onChange={(e) => updateSheet(sheet.id, 'width', parseInt(e.target.value) || 0)}
              type="number"
              placeholder="W"
              className="h-8 text-xs"
              min="1"
              required
            />
            <Input
              value={sheet.thickness}
              onChange={(e) => updateSheet(sheet.id, 'thickness', parseInt(e.target.value) || 0)}
              type="number"
              placeholder="T"
              className="h-8 text-xs"
              min="1"
              required
            />
            <Input
              value={sheet.price || ''}
              onChange={(e) => updateSheet(sheet.id, 'price', parseFloat(e.target.value) || undefined)}
              type="number"
              step="0.01"
              placeholder="$"
              className="h-8 text-xs"
              min="0"
            />
            <Button
              onClick={() => removeSheet(sheet.id)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="h-3 w-3" />
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
