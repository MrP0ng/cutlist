'use client'

import { useState } from 'react'
import { 
  Play, 
  Save, 
  FileText, 
  Download, 
  BarChart3, 
  TrendingUp,
  Loader2 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PricingModal } from '@/components/pricing-modal'

export function WorkbenchToolbar() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false)

  // Demo data - will come from state later
  const isProUser = false
  const optimizationStats = {
    sheets: 3,
    waste: 12.5,
    efficiency: 87.5
  }

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

  const handleExportCSV = () => {
    // TODO: Export parts list as CSV
    console.log('Export CSV')
  }

  return (
    <>
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b flex items-center gap-3 px-4 py-2">
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

        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-2" />
          CSV
        </Button>

        {/* Stats Section */}
        <div className="flex items-center gap-4 ml-auto">
          {optimizationStats.sheets > 0 && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span>{optimizationStats.sheets} sheets</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Waste: {optimizationStats.waste}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant={optimizationStats.efficiency >= 85 ? 'default' : 'secondary'}>
                  {optimizationStats.efficiency}% efficient
                </Badge>
              </div>
            </div>
          )}

          {!isProUser && (
            <Button 
              onClick={() => setShowPricingModal(true)}
              size="sm"
              className="ml-4"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Upgrade
            </Button>
          )}
        </div>
      </div>

      <PricingModal 
        open={showPricingModal} 
        onOpenChange={setShowPricingModal}
      />
    </>
  )
}
