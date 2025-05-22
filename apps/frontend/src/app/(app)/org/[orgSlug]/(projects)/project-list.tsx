import { ArrowRight } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui'

export async function ProjectList() {
  return (
    <div className='grid grid-cols-3 gap-4'>
      <Card>
        <CardHeader>
          <CardTitle>Proj Title</CardTitle>
          <CardDescription className='line-clamp-3 leading-relax'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere,
            cupiditate eveniet quod nostrum earum soluta dignissimos atque quam
            excepturi a adipisci dolor doloribus est placeat recusandae? Maiores ipsa
            porro vero.
          </CardDescription>
        </CardHeader>

        <CardFooter className='flex items-center gap-1.5'>
          <Avatar className='size-4'>
            <AvatarImage src='https:/github.com/jardelbordignon.png' alt='Avatar' />
            <AvatarFallback />
          </Avatar>

          <span className='text-xs text-muted-foreground'>
            Created by{' '}
            <span className='font-medium text-foreground'>Jardel Bordignon</span> a
            day ago
          </span>

          <Button size='xs' variant='outline' className='ml-auto'>
            View <ArrowRight className='size-3 ml-2' />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
