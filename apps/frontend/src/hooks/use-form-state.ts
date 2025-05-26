import { useState, useTransition } from 'react'
import type { FormEvent } from 'react'

interface FormState {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export function useFormState<T extends object>(
  action: (data: FormData) => Promise<FormState>,
  options?: {
    initialState?: FormState
    onSuccess?: (state: FormState, data: T) => void
    onError?: (state: FormState, data: T) => void
  },
) {
  const [isPending, startTransition] = useTransition()

  const [formState, setFormState] = useState(
    options?.initialState ?? { success: false, message: null, errors: null },
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const state = await action(data)

      const dataEntries = Object.fromEntries(data.entries()) as T

      if (state.success) {
        form.reset()
        if (options?.onSuccess) {
          options.onSuccess(state, dataEntries)
        }
      } else if (options?.onError) {
        options.onError(state, dataEntries)
      }

      setFormState(state)
    })
  }

  return [formState, handleSubmit, isPending] as const
}
