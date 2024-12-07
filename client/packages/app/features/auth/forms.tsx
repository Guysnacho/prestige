import { UserState } from '@my/app/store'
import { createClient } from '@my/app/util/components'
import { Button, Form, H4, Input, Label, Spinner, YStack } from '@my/ui'
import { useEffect, useState } from 'react'
import { useRouter } from 'solito/navigation'

type AuthProps = {
  store: UserState
}

export const SignIn = ({ store }: AuthProps) => {
  const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (status === 'submitting') {
      const timer = setTimeout(() => setStatus('off'), 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [status])

  const signIn = async () => await handleSignIn(email, password, router, store)

  return (
    <Form
      minWidth={300}
      gap="$2"
      onSubmit={() => setStatus('submitting')}
      borderWidth={1}
      borderRadius="$4"
      backgroundColor="$background"
      borderColor="$borderColor"
      padding="$8"
    >
      <H4>Log In</H4>
      <YStack>
        <Label>Email</Label>
        <Input placeholder="test@gmail.com" onChangeText={setEmail} />
        <Label>Password</Label>
        <Input placeholder="dont_use_password123" secureTextEntry onChangeText={setPassword} />
      </YStack>

      <Form.Trigger onPress={signIn} asChild disabled={status !== 'off'}>
        <Button icon={status === 'submitting' ? () => <Spinner /> : undefined}>Submit</Button>
      </Form.Trigger>
    </Form>
  )
}

export const SignUp = ({ store }: AuthProps) => {
  const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off')
  const [email, setEmail] = useState('')
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (status === 'submitting') {
      const timer = setTimeout(() => setStatus('off'), 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [status])

  const signUp = async () => await handleSignUp(email, password, fname, lname, router, store)

  return (
    <Form
      alignItems="center"
      minWidth={300}
      gap="$2"
      onSubmit={() => setStatus('submitting')}
      borderWidth={1}
      borderRadius="$4"
      backgroundColor="$background"
      borderColor="$borderColor"
      padding="$8"
    >
      <H4>Sign Up</H4>
      <YStack>
        <Label>First Name</Label>
        <Input placeholder="Warren" onChangeText={setFname} />
        <Label>Last Name</Label>
        <Input placeholder="Buffette" onChangeText={setLname} />
        <Label>Email</Label>
        <Input placeholder="test@gmail.com" onChangeText={setEmail} />
        <Label>Password</Label>
        <Input
          placeholder="dont_use_password123"
          secureTextEntry
          onChangeText={(e) => setPassword(e)}
        />
      </YStack>

      <Form.Trigger onPress={signUp} asChild disabled={status !== 'off'}>
        <Button icon={status === 'submitting' ? () => <Spinner /> : undefined}>Submit</Button>
      </Form.Trigger>
    </Form>
  )
}

const handleSignIn = async (
  email: string,
  password: string,
  router: {
    push: (url: string, navigateOptions?: any | undefined) => void
  },
  store: UserState
) => {
  const client = createClient()
  const { data: authRes, error } = await client.auth.signInWithPassword({ email, password })
  if (error) {
    console.error(error)
    alert('Ran into an issue signing in')
    throw error
  } else {
    store.setId(authRes.user?.id)
    const { data } = await client.from('member').select('type').eq('id', authRes.user!.id).single()
    if (data) {
      store.setRole(data.type)
    }
    router.push('/')
  }
}

const handleSignUp = async (
  email: string,
  password: string,
  fname: string,
  lname: string,
  router: {
    push: (url: string, navigateOptions?: any | undefined) => void
  },
  store: UserState
) => {
  const client = createClient()
  const { data: authRes, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: { fname, lname },
    },
  })
  if (error) {
    console.error(error)
    alert('Ran into an issue signing up')
    throw error
  } else {
    store.setId(authRes.user?.id)
    const { data } = await client.from('member').select('type').eq('id', authRes.user!.id).single()
    if (data) {
      store.setRole(data.type)
    }
    router.push('/')
  }
}
