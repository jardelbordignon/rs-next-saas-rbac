import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui-custom/intercepted-sheet'
import { OrganizationForm } from '../../org/form'

export default function CreateOrganization() {
  return (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetTitle></SheetTitle>
        <SheetHeader>Create organization</SheetHeader>

        <div className='px-4'>
          <OrganizationForm />
        </div>
      </SheetContent>
    </Sheet>
  )
}
