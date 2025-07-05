'use client'

import { useState } from 'react'
import { Plus, X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { demoWorkbenchParts } from '@/lib/demoParts'

interface Part {
  id: string
  w: number
  h: number
  qty: number
  label: string
}

export function PartsTable() {
  const [parts, setParts] = useState<Part[]>(demoWorkbenchParts)

  const addPart = () => {
    const newPart: Part = {
      id: `part-${Date.now()}`,
      w: 100,
      h: 100,
      qty: 1,
      label: 'New Part'
    }
    setParts([...parts, newPart])
  }

  const removePart = (id: string) => {
    setParts(parts.filter(part => part.id !== id))
  }

  const updatePart = (id: string, field: keyof Part, value: string | number) => {
    setParts(parts.map(part => 
      part.id === id ? { ...part, [field]: value } : part
    ))
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        Enter part sizes below (mm)
      </div>
      
      <div className="flex gap-2">
        <Button onClick={addPart} size="sm" className="flex-1">
          <Plus className="h-3 w-3 mr-1" />
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
              onChange={(e) => updatePart(part.id, 'label', e.target.value)}
              placeholder="Label"
              className="h-8 text-xs"
            />
            <Input
              value={part.w}
              onChange={(e) => updatePart(part.id, 'w', parseInt(e.target.value) || 0)}
              type="number"
              placeholder="W"
              className="h-8 text-xs"
              min="1"
              required
            />
            <Input
              value={part.h}
              onChange={(e) => updatePart(part.id, 'h', parseInt(e.target.value) || 0)}
              type="number"
              placeholder="H"
              className="h-8 text-xs"
              min="1"
              required
            />
            <div className="flex gap-1">
              <Input
                value={part.qty}
                onChange={(e) => updatePart(part.id, 'qty', parseInt(e.target.value) || 1)}
                type="number"
                placeholder="Q"
                className="h-8 text-xs flex-1"
                min="1"
              />
              <Button
                onClick={() => removePart(part.id)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="h-3 w-3" />
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
