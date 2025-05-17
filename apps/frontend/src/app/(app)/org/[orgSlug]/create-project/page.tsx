import { Header } from '@/components/layout'
import { ProjectForm } from './form'

export default function CreateProject() {
  return (
    <div className='space-y-4'>
      <Header />

      <h1 className='text-2xl font-bold'>Create project</h1>
      <ProjectForm />
    </div>
  )
}
