import { WorkbenchSidebar } from '@/components/workbench-sidebar'
import { WorkbenchToolbar } from '@/components/workbench-toolbar'
import { SheetArea } from '@/components/sheet-area'

export default function WorkbenchPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <WorkbenchSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <WorkbenchToolbar />
        <SheetArea />
      </main>
    </div>
  )
}
