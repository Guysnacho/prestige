import { Button, Paragraph, Spinner, YStack, useToastController } from '@my/ui'
import { Car, ChevronLeft } from '@tamagui/lucide-icons'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useRouter } from 'solito/navigation'

export function DriverHomeScreen() {
  const router = useRouter()
  const toast = useToastController()
  const [user, setUser] = useState('')
  const [isPolling, setIsPolling] = useState(false)

  const { mutate, data, isIdle, isPending } = useMutation({
    mutationFn: async () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/driver/trip`, {
        method: 'POST',
        referrer: process.env.NEXT_PUBLIC_SERVER_HOST,
        body: JSON.stringify({ name: user }),
      }),
    onError(err, v, c) {
      console.error(err)
      toast.show('Issue while joining pool', { message: err?.message })
    },
    async onSuccess(data, v, c) {
      var res = await data.json()
      toast.show('Successfully joined pool', {
        message: `${res.message}\n${res.requestId}`,
      })
    },
  })

  function joinDriverPool() {
    console.error('Function not implemented.')
  }

  // const { id } = useParams()

  return (
    <YStack f={1} jc="center" ai="center" gap="$4" bg="$background">
      <Paragraph ta="center" fow="700" col="$blue10">
        {`Driver : ` + '${id}'}
      </Paragraph>
      <Button
        iconAfter={isPending ? Spinner : Car}
        variant={isPending ? 'outlined' : undefined}
        disabled={isPending}
        onPress={() => mutate()}
      >
        Join Pool
      </Button>
      <Button icon={ChevronLeft} onPress={() => router.back()}>
        Go Home
      </Button>
    </YStack>
  )
}
