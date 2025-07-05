'use client'

import { useState } from 'react'
import { ChevronDown, Settings, Package, TrendingUp } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PartsTable } from '@/components/parts-table'
import { PricingModal } from '@/components/pricing-modal'

export function WorkbenchSidebar() {
  const [projectName, setProjectName] = useState('My Project')
  const [sheetLength, setSheetLength] = useState('2440')
  const [sheetWidth, setSheetWidth] = useState('1220')
  const [kerf, setKerf] = useState('3')
  const [showPricingModal, setShowPricingModal] = useState(false)

  // Demo quota data (will be from useQuota hook later)
  const partsUsed = 15
  const partsLimit = 50
  const quotaProgress = (partsUsed / partsLimit) * 100

  return (
    <div className="w-[320px] min-w-[260px] border-r bg-background h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-6 w-6" />
          <span className="font-semibold">Cutlist</span>
        </div>
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="font-medium"
          placeholder="Project name"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <Accordion type="single" defaultValue="sheet" className="w-full">
          <AccordionItem value="sheet">
            <AccordionTrigger className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Sheet settings
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Length (mm)
                </label>
                <Input
                  value={sheetLength}
                  onChange={(e) => setSheetLength(e.target.value)}
                  type="number"
                  placeholder="2440"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Width (mm)
                </label>
                <Input
                  value={sheetWidth}
                  onChange={(e) => setSheetWidth(e.target.value)}
                  type="number"
                  placeholder="1220"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Kerf (mm)
                </label>
                <Input
                  value={kerf}
                  onChange={(e) => setKerf(e.target.value)}
                  type="number"
                  step="0.1"
                  placeholder="3.0"
                />
              </div>
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
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Parts used</span>
            <span className="font-medium">{partsUsed}/{partsLimit}</span>
          </div>
          <Progress value={quotaProgress} className="h-2" />
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
