import { createClient } from '@my/app/util/components'
import { User } from '@supabase/supabase-js'
import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'

export default function Screen() {
  const client = createClient()
  const [user, setUser] = useState<User | null>()

  useEffect(() => {
    client.auth
      .getUser()
      .then(({ data }) => {
        if (data) {
          setUser(data.user)
        }
      })
      .catch((err) => {
        console.error('Auth Error')
        console.error(err)
      })
  }, [])
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
      <HomeScreen user={user} />
    </>
  )
}
