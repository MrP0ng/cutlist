'use client'

import { useState, useEffect } from 'react'
import { Settings, Package, TrendingUp, Layers, Loader2 } from 'lucide-react'
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
import { createProject, getProjects, updateProject } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export function WorkbenchSidebar() {
  const [projectName, setProjectName] = useState('My Project')
  const [currentProject, setCurrentProject] = useState<string | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [unit, setUnit] = useState('mm')
  const [kerf, setKerf] = useState('3')
  const [materialType, setMaterialType] = useState('sheet')
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [loadingProject, setLoadingProject] = useState(false)
  const { user, usage } = useAuth()

  // Load projects when user is authenticated
  useEffect(() => {
    if (user && !user.is_anonymous) {
      loadProjects()
    }
  }, [user])

  const loadProjects = async () => {
    try {
      const projectsList = await getProjects()
      setProjects(projectsList)
      
      // Set current project to the first one or create a new one
      if (projectsList.length > 0) {
        const firstProject = projectsList[0]
        setCurrentProject(firstProject.id)
        setProjectName(firstProject.name || 'Untitled Project')
      } else {
        // Create a default project for new users
        await createNewProject()
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  const createNewProject = async () => {
    try {
      setLoadingProject(true)
      const project = await createProject('My Project')
      setCurrentProject(project.id)
      setProjectName(project.name || 'My Project')
      await loadProjects() // Refresh the projects list
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setLoadingProject(false)
    }
  }

  const updateProjectName = async (newName: string) => {
    setProjectName(newName)
    
    if (currentProject && user && !user.is_anonymous) {
      try {
        await updateProject(currentProject, { name: newName })
      } catch (error) {
        console.error('Error updating project name:', error)
      }
    }
  }

  // Demo quota data (will be from usage hook later)
  const sheetsUsed = usage?.sheets || 0
  const sheetsLimit = usage?.limits.sheets || 10
  const partsUsed = usage?.parts || 0
  const partsLimit = usage?.limits.parts_per_project || 100
  const sheetsProgress = sheetsLimit ? (sheetsUsed / sheetsLimit) * 100 : 0
  const partsProgress = partsLimit ? (partsUsed / partsLimit) * 100 : 0

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
          onChange={(e) => updateProjectName(e.target.value)}
          className="font-medium mb-2"
          placeholder="Project name"
          disabled={loadingProject}
        />
        <button 
          onClick={createNewProject}
          disabled={loadingProject || (user?.is_anonymous ?? true)}
          className="text-xs underline text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingProject ? (
            <>
              <Loader2 className="h-3 w-3 inline mr-1 animate-spin" />
              Creating...
            </>
          ) : (
            'Create a new project'
          )}
        </button>
        {user?.is_anonymous && (
          <p className="text-xs text-muted-foreground mt-1">
            Sign in to save projects
          </p>
        )}
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
              <SheetsTable projectId={currentProject || undefined} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="parts">
            <AccordionTrigger className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Parts list
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <PartsTable projectId={currentProject || undefined} />
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
