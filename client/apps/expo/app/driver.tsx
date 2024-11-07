import { DriverHomeScreen } from '@my/app/features/driver/driver-screen'
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
          presentation: 'fullScreenModal',
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          headerShown: false,
        }}
      />
      <DriverHomeScreen />
    </SafeAreaView>
  )
}
