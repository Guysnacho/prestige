import { useStore, useUserStore } from '@my/app/util'
import { Button, H1, Paragraph, Separator, SwitchThemeButton, XStack, YStack } from '@my/ui'
import { Dispatch, SetStateAction } from 'react'
import { Platform } from 'react-native'
import { SignIn, SignUp } from './forms'

export default function AuthScreen({
  signUp,
  setSignUp,
}: {
  signUp: boolean
  setSignUp: Dispatch<SetStateAction<boolean>>
}) {
  const store = useStore(useUserStore, (store) => store)

  return (
    <YStack jc="center" ai="center" gap="$8" pb="$5" p="$4" bg="$background">
      <XStack w="100%" t="$6" gap="$6" jc="center" $sm={{ pos: 'relative', t: 0 }}>
        {Platform.OS === 'web' && (
          <>
            <SwitchThemeButton />
          </>
        )}
      </XStack>

      <YStack gap="$4">
        <H1 ta="center" col="$color12">
          {signUp ? 'Welcome to De Prestige Chauffeur.' : 'Welcome back to De Prestige Chauffeur.'}
        </H1>
        <Paragraph col="$color10" ta="center">
          “ De Prestige Chauffeur ” offers a seamless luxury on-demand transportation service
        </Paragraph>
        <Separator />
        <Paragraph ta="center">
          {signUp
            ? 'Sign up today to gain access to our services through our app!'
            : 'Login to gain access to our services through our app!'}
        </Paragraph>
        <Button
          col="$color10"
          ta="center"
          textDecorationLine="underline"
          variant="outlined"
          onPress={() => setSignUp(!signUp)}
        >
          {signUp ? 'Already signed up? Click here.' : 'Need to sign up? Click here.'}
        </Button>
        <Separator />
      </YStack>

      {signUp ? <SignUp store={store!} /> : <SignIn store={store!} />}
    </YStack>
  )
}
