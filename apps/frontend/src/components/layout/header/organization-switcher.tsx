import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui'

export function OrganizationSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:right-2 focus-visible:ring-primary'>
        <span className='text-muted-foreground'>Select organization</span>
        <ChevronsUpDown className='ml-auto size-3 text-muted-foreground' />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        alignOffset={-16}
        sideOffset={12}
        className='w-[200px]'
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuItem>
            <Avatar>
              <AvatarImage src='http://github.com/rocketseat.png' />
              <AvatarFallback />
            </Avatar>
            <span className='line-clamp-1'>Rocketseat</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href='/create-organization'>
              <PlusCircle className='mr-2 size-5' />
              Create new
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
