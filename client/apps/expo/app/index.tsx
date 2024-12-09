import AuthScreen from '@my/app/features/auth/auth-screen'
import { useUserStore } from '@my/app/store'
import { createClient } from '@my/app/util/components'
import { ScrollView } from '@my/ui'
import { User } from '@supabase/supabase-js'
import HomeScreen from 'app/features/home/screen'
import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  const client = createClient()
  const store = useUserStore()
  const [user, setUser] = useState<User | null>()
  const [signUp, setSignUp] = useState(false)

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
  }, [store.id])

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      <SafeAreaView edges={['left', 'right']}>
        <ScrollView>
          {user?.id ? (
            <HomeScreen user={user} />
          ) : (
            <AuthScreen signUp={signUp} setSignUp={setSignUp} />
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  )
}
