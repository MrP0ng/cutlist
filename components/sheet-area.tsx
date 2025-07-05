'use client'

import { useState } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  Layers 
} from 'lucide-react'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SheetSvg from '@/components/SheetSvg'
import { demoPartsSet1, demoPartsSet2 } from '@/lib/demoParts'

export function SheetArea() {
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0)
  
  // Demo data - will come from optimizer results later
  const demoSheets = [
    {
      id: 'sheet-1',
      W: 2440,
      H: 1220,
      parts: demoPartsSet1,
      waste: 15.2,
      efficiency: 84.8
    },
    {
      id: 'sheet-2', 
      W: 2440,
      H: 1220,
      parts: demoPartsSet2,
      waste: 8.7,
      efficiency: 91.3
    }
  ]

  const currentSheet = demoSheets[currentSheetIndex]
  const hasMultipleSheets = demoSheets.length > 1

  const nextSheet = () => {
    setCurrentSheetIndex((prev) => (prev + 1) % demoSheets.length)
  }

  const prevSheet = () => {
    setCurrentSheetIndex((prev) => (prev - 1 + demoSheets.length) % demoSheets.length)
  }

  // Calculate summary stats
  const totalSheets = demoSheets.length
  const averageWaste = demoSheets.reduce((acc, sheet) => acc + sheet.waste, 0) / totalSheets
  const averageEfficiency = demoSheets.reduce((acc, sheet) => acc + sheet.efficiency, 0) / totalSheets
  const totalParts = demoSheets.reduce((acc, sheet) => acc + sheet.parts.length, 0)

  return (
    <div className="flex-1 overflow-auto">
      <Tabs defaultValue="sheets" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
          <TabsTrigger value="sheets" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Sheets
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sheets" className="flex-1 flex flex-col mt-4">
          {demoSheets.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div className="text-muted-foreground">
                <Layers className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No optimization results yet</h3>
                <p className="text-sm">Click "Optimize" to generate sheet layouts</p>
              </div>
            </div>
          ) : (
            <>
              {/* Sheet Navigation Header */}
              <div className="flex items-center justify-between px-4 pb-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold">
                    Sheet {currentSheetIndex + 1} of {totalSheets}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {currentSheet.W} × {currentSheet.H} mm
                    </Badge>
                    <Badge variant={currentSheet.waste <= 10 ? 'default' : 'secondary'}>
                      {currentSheet.waste.toFixed(1)}% waste
                    </Badge>
                  </div>
                </div>
                
                {hasMultipleSheets && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevSheet}
                      disabled={currentSheetIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextSheet}
                      disabled={currentSheetIndex === demoSheets.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* SVG Display */}
              <div className="flex-1 px-4 pb-4">
                <div className="bg-muted/30 rounded-lg p-4 h-full flex items-center justify-center">
                  <SheetSvg 
                    parts={currentSheet.parts}
                    sheetW={currentSheet.W}
                    sheetH={currentSheet.H}
                    kerf={3}
                  />
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="summary" className="flex-1 p-4">
          {demoSheets.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div className="text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No data to summarize</h3>
                <p className="text-sm">Optimize your parts to see the summary</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sheets</CardTitle>
                  <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSheets}</div>
                  <p className="text-xs text-muted-foreground">
                    2440 × 1220 mm each
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalParts}</div>
                  <p className="text-xs text-muted-foreground">
                    All parts placed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Waste</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageWaste.toFixed(1)}%</div>
                  <p className={`text-xs ${averageWaste <= 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {averageWaste <= 10 ? 'Excellent' : 'Good'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageEfficiency.toFixed(1)}%</div>
                  <p className={`text-xs ${averageEfficiency >= 85 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {averageEfficiency >= 85 ? 'Excellent' : 'Good'}
                  </p>
                </CardContent>
              </Card>

              {/* Detailed sheet breakdown */}
              <Card className="md:col-span-2 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Sheet Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {demoSheets.map((sheet, index) => (
                      <div key={sheet.id} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">Sheet {index + 1}</span>
                          <Badge variant="outline">{sheet.parts.length} parts</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Waste: {sheet.waste.toFixed(1)}%
                          </span>
                          <Badge variant={sheet.efficiency >= 85 ? 'default' : 'secondary'}>
                            {sheet.efficiency.toFixed(1)}% efficient
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
