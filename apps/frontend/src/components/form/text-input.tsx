import { Input, Label } from '../ui'

type Props = React.ComponentProps<'input'> & {
  id: string
  label?: string | boolean
  error?: string
}

export function TextInput({ id, error, label, ...rest }: Props) {
  if (label !== false) {
    label =
      typeof label === 'string' ? label : id.slice(0, 1).toUpperCase() + id.slice(1)
  }
  return (
    <div className='space-y-1 w-full'>
      {label && <Label htmlFor={id}>{label}</Label>}

      <Input id={id} name={id} {...rest} />

      {error && (
        <p className='text-xs font-medium text-red-500 dark:text-red-400'>{error}</p>
      )}
    </div>
  )
}
