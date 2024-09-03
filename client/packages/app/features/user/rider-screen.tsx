import { Button, Paragraph, YStack } from '@my/ui'
import { Car, ChevronLeft } from '@tamagui/lucide-icons'
import { useParams, useRouter } from 'solito/navigation'

export function RiderHomeScreen() {
  const router = useRouter()
  function requestTrip() {
    console.error('Function not implemented.')
  }

  // const { id } = useParams()

  return (
    <YStack f={1} jc="center" ai="center" gap="$4" bg="$background">
      <Paragraph ta="center" fow="700" col="$blue10">
        {`Rider : ` + '${id}'}
      </Paragraph>
      <Button iconAfter={Car} onPress={() => requestTrip()}>
        Request Trip
      </Button>
      <Button icon={ChevronLeft} onPress={() => router.back()}>
        Go Home
      </Button>
    </YStack>
  )
}
