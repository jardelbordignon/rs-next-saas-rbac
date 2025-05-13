type Props = Readonly<{
  children: React.ReactNode
}>

export default function AuthLayout({ children }: Props) {
  return (
    <div className='min-h-screen flex items-center justify-center flex-col px-4'>
      <div className='w-full max-w-xs'>{children}</div>
    </div>
  )
}
