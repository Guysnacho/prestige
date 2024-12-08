import { RiderHomeScreen } from '@my/app/features/rider/rider-screen'
import { useTheme } from '@my/ui'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  const theme = useTheme()

  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Rider',
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
