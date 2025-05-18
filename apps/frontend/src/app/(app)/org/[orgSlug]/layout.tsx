import { Header } from '@/components/layout'
import { Tabs } from '@/components/org/layout/tabs'

type Props = Readonly<{
  children: React.ReactNode
}>

export default async function OrgLayout({ children }: Props) {
  return (
    <div className='space-y-4'>
      <Header />
      <Tabs />

      <main>{children}</main>
    </div>
  )
}
