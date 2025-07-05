'use client'

import { useState } from 'react'
import { Settings, Package, TrendingUp, Layers } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PartsTable } from '@/components/parts-table'
import { SheetsTable } from '@/components/sheets-table'
import { PricingModal } from '@/components/pricing-modal'

export function WorkbenchSidebar() {
  const [projectName, setProjectName] = useState('My Project')
  const [unit, setUnit] = useState('mm')
  const [kerf, setKerf] = useState('3')
  const [materialType, setMaterialType] = useState('sheet')
  const [showPricingModal, setShowPricingModal] = useState(false)

  // Demo quota data (will be from useQuota hook later)
  const sheetsUsed = 2
  const sheetsLimit = 5
  const partsUsed = 15
  const partsLimit = 50
  const sheetsProgress = (sheetsUsed / sheetsLimit) * 100
  const partsProgress = (partsUsed / partsLimit) * 100

  return (
    <div className="w-[480px] min-w-[300px] border-r bg-background h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-6 w-6" />
          <span className="font-semibold">Cutlist</span>
        </div>
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="font-medium mb-2"
          placeholder="Project name"
        />
        <a href="#" className="text-xs underline text-muted-foreground hover:text-foreground">
          Create a new project
        </a>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <Accordion type="multiple" defaultValue={["settings", "sheets"]} className="w-full">
          <AccordionItem value="settings">
            <AccordionTrigger className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Unit
                </label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mm">mm (millimeters)</SelectItem>
                    <SelectItem value="cm">cm (centimeters)</SelectItem>
                    <SelectItem value="inches">inches</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Kerf width ({unit})
                </label>
                <Input
                  value={kerf}
                  onChange={(e) => setKerf(e.target.value)}
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="3.0"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Material type
                </label>
                <Select value={materialType} onValueChange={setMaterialType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sheet">Sheet material</SelectItem>
                    <SelectItem value="linear">Linear material</SelectItem>
                    <SelectItem value="roll">Roll material</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sheets">
            <AccordionTrigger className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Sheets
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <SheetsTable />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="parts">
            <AccordionTrigger className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Parts list
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <PartsTable />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Footer */}
      <div className="border-t p-4 space-y-3">
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Sheets used</span>
              <span className="font-medium">{sheetsUsed}/{sheetsLimit}</span>
            </div>
            <Progress value={sheetsProgress} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Parts used</span>
              <span className="font-medium">{partsUsed}/{partsLimit}</span>
            </div>
            <Progress value={partsProgress} className="h-2" />
          </div>
        </div>
        
        <Button 
          onClick={() => setShowPricingModal(true)}
          className="w-full"
          variant="default"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Upgrade to Pro
        </Button>
      </div>

      <PricingModal 
        open={showPricingModal} 
        onOpenChange={setShowPricingModal}
      />
    </div>
  )
}
