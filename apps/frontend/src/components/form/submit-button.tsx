import { Loader2 } from 'lucide-react'
import { Button } from '../ui'

type Props = React.ComponentProps<'button'> & {
  children: React.ReactNode
  isSubmitting?: boolean
}

export function SubmitButton({ children, isSubmitting = false, ...rest }: Props) {
  const { className, ...props } = rest
  return (
    <Button type='submit' className={className ?? 'w-full'} {...props}>
      {isSubmitting ? <Loader2 className='size-4 animate-spin' /> : <>{children}</>}
    </Button>
  )
}
