import { ChevronDown, LogOut } from 'lucide-react'
import { authProfile } from '@/auth/auth'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui'
import { getInitials } from '@/lib/utils'

export async function ProfileButton() {
  const { user } = await authProfile()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex items-center gap-3 outline-none'>
        <div className='flex flex-col gap-1 items-end'>
          <span className='text-sm font-medium'>{user.name}</span>
          <span className='text-xs text-muted-foreground'>{user.email}</span>
        </div>

        <Avatar>
          {user.avatarUrl && <AvatarImage src={user.avatarUrl + 's'} />}
          {user.name && <AvatarFallback>{getInitials(user.name)}</AvatarFallback>}
        </Avatar>

        <ChevronDown className='size-4 text-muted-foreground' />
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
          <a href='/api/auth/sign-out'>
            {/* usando tag <a> e não <Link> para evitar o prefetch pois é logout */}
            <LogOut className='mr-2 size-4' />
            Sign Out
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
