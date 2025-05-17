import { Label, Textarea } from '../ui'

type Props = React.ComponentProps<'textarea'> & {
  id: string
  label?: string
  error?: string
}

export function TextArea({ id, error, label, ...rest }: Props) {
  return (
    <div className='space-y-1'>
      <Label htmlFor={id}>
        {label || id.slice(0, 1).toUpperCase() + id.slice(1)}
      </Label>
      <Textarea id={id} name={id} {...rest} />

      {error && (
        <p className='text-xs font-medium text-red-500 dark:text-red-400'>{error}</p>
      )}
    </div>
  )
}
