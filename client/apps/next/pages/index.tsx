import { AuthScreen } from '@my/app/features/auth/auth-screen'
import { createClient } from '@my/app/util/server-props'
import { User } from '@supabase/supabase-js'
import { HomeScreen } from 'app/features/home/screen'
import { GetServerSidePropsContext } from 'next/types'
import { useState } from 'react'

type HomeProps = {
  user?: User
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Fetch data from external API
  const client = createClient(context)
  const { data, error } = await client.auth.getUser()
  if (error) {
    return { props: { user: null } }
  } else {
    return { props: { user: data.user } }
  }
}

export default function Page({ user }: HomeProps) {
  const [signUp, setSignUp] = useState(false)

  return user ? <HomeScreen /> : <AuthScreen signUp={signUp} setSignUp={setSignUp} />
}
