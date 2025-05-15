import { EnterWithSocialAccount } from '../enter-with-social-account'
import { SignUpForm } from './form'

export default function SignUpPage() {
  return (
    <>
      <SignUpForm />
      <EnterWithSocialAccount text='up' />
    </>
  )
}
