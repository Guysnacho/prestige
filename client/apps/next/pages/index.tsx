import { AuthScreen } from '@my/app/features/auth/auth-screen'
import { createClient } from '@my/app/util/server-props'
import { User } from '@supabase/supabase-js'
import { HomeScreen } from 'app/features/home/screen'
import { GetServerSidePropsContext } from 'next/types'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { useState } from 'react'

export type HomeProps = {
  user: User | null
}

export const getServerSideProps = (async (context: GetServerSidePropsContext) => {
  // Fetch data from external API
  const client = createClient(context)
  const { data, error } = await client.auth.getUser()

  if (error?.message) {
    return { props: { user: null } }
  } else {
    return { props: { user: data.user } }
  }
}) satisfies GetServerSideProps<HomeProps>

export default function Page({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [signUp, setSignUp] = useState(false)

  return (
    <>
      {user?.id ? <HomeScreen user={user} /> : <AuthScreen signUp={signUp} setSignUp={setSignUp} />}
    </>
  )
}
