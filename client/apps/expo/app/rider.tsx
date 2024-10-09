import { RiderHomeScreen } from '@my/app/features/rider/rider-screen'
import { useTheme } from '@my/ui'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native'

export default function Screen() {
  const theme = useTheme()

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          title: 'Rider',
          presentation: 'fullScreenModal',
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          headerShown: false,
        }}
      />
      <RiderHomeScreen />
    </SafeAreaView>
  )
}
