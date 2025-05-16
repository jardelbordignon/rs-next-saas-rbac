import { Input, Label } from '../ui'

type Props = React.ComponentProps<'input'> & {
  id: string
  label?: string
  error?: string
  type?: 'text' | 'password'
}

export function TextInput({ id, error, label, type = 'text', ...rest }: Props) {
  return (
    <div className='space-y-1'>
      <Label htmlFor={id}>
        {label || id.slice(0, 1).toUpperCase() + id.slice(1)}
      </Label>
      <Input id={id} name={id} type={type} {...rest} />

      {error && (
        <p className='text-xs font-medium text-red-500 dark:text-red-400'>{error}</p>
      )}
    </div>
  )
}
