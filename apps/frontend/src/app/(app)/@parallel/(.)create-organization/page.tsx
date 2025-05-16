import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { OrganizationForm } from '../../create-organization/form'

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
