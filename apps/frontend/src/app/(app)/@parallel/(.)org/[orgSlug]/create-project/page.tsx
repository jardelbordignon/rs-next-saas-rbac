import { ProjectForm } from '@/app/(app)/org/[orgSlug]/create-project/form'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui-custom/intercepted-sheet'

export default function CreateProject() {
  return (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetTitle></SheetTitle>
        <SheetHeader>Create project</SheetHeader>

        <div className='px-4'>
          <ProjectForm />
        </div>
      </SheetContent>
    </Sheet>
  )
}
