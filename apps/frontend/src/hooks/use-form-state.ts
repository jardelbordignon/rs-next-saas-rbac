import { useState, useTransition } from 'react'
import type { FormEvent } from 'react'

interface FormState {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export function useFormState(
  action: (data: FormData) => Promise<FormState>,
  options?: {
    initialState?: FormState
    onSuccess?: (state: FormState) => void
    onError?: (state: FormState) => void
  },
) {
  const [isPending, startTransition] = useTransition()

  const [formState, setFormState] = useState(
    options?.initialState ?? { success: false, message: null, errors: null },
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget

    startTransition(async () => {
      const state = await action(new FormData(form))

      if (state.success) {
        form.reset()
        if (options?.onSuccess) {
          options.onSuccess(state)
        }
      } else if (options?.onError) {
        options.onError(state)
      }

      setFormState(state)
    })
  }

  return [formState, handleSubmit, isPending] as const
}
