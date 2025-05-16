import { Loader2 } from 'lucide-react'
import { Button } from '../ui'

type Props = {
  children: React.ReactNode
  isSubmitting?: boolean
}

export function SubmitButton({ children, isSubmitting }: Props) {
  return (
    <Button type='submit' className='w-full'>
      {isSubmitting ? <Loader2 className='size-4 animate-spin' /> : <>{children}</>}
    </Button>
  )
}
