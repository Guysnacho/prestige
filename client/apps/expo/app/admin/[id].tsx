import { TripMatcherScreen } from '@my/app/features/admin/trip-matcher-screen'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          title: 'Rider',
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          headerShown: false,
        }}
      />
      <TripMatcherScreen />
    </SafeAreaView>
  )
}
