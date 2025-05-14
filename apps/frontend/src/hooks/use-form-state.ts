import { startTransition, useEffect } from 'react'
import { useActionState } from 'react'

interface FormState {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

interface UseFormOptions<T> {
  initialState?: Awaited<T>
  onSuccess?: (state: T) => void
  onError?: (state: T) => void
}

export function useFormState<T extends FormState>(
  action: (_: Awaited<T>, formData: FormData) => Promise<T>,
  options?: UseFormOptions<T>,
) {
  const initialState =
    options?.initialState ??
    ({
      errors: null,
      message: null,
      success: false,
    } as Awaited<T>)

  const [state, formAction, isPending] = useActionState(action, initialState)

  const { onSuccess, onError } = options ?? {}

  useEffect(() => {
    if (!isPending) {
      if (state.success && onSuccess) {
        onSuccess(state)
      } else if (!state.success && onError) {
        onError(state)
      }
    }
  }, [isPending, state, onSuccess, onError])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    startTransition(() => {
      formAction(new FormData(event.currentTarget))
    })
  }

  return [state, handleSubmit, isPending] as const
}
