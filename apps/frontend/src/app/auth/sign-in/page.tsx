import { EnterWithSocialAccount } from '../enter-with-social-account'
import { SignInForm } from './form'

export default function SignInPage() {
  return (
    <>
      <SignInForm />
      <EnterWithSocialAccount text='in' />
    </>
  )
}
