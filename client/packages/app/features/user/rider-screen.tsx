import {
  Button,
  Input,
  Label,
  Paragraph,
  Spinner,
  XStack,
  YStack,
  useToastController,
} from '@my/ui'
import { ChevronLeft, HandMetal } from '@tamagui/lucide-icons'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useRouter } from 'solito/navigation'

export function RiderHomeScreen() {
  const router = useRouter()
  const toast = useToastController()
  const [user, setUser] = useState('')
  const [isPolling, setIsPolling] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/rider/trip`, {
        method: 'POST',
        referrer: process.env.NEXT_PUBLIC_SERVER_HOST,
        body: JSON.stringify({ name: 'Tunji' }),
      }),
    onError(err, v, c) {
      console.error(err)
      toast.show('Issue while requesting your ride', { message: err?.message })
    },
    async onSuccess(data, v, c) {
      var res = await data.json()
      toast.show('Successfully requested your ride', {
        message: `${res.message}\n${res.requestId}`,
      })
    },
  })

  // const { id } = useParams()

  return (
    <YStack f={1} jc="center" ai="center" gap="$4" bg="$background">
      <Paragraph ta="center" fow="700" col="$blue10">
        {`Rider : ${user ? user : 'Who are you??'}`}
      </Paragraph>
      <XStack alignItems="center" gap="$4">
        <Label width={90} htmlFor="name">
          Name
        </Label>
        <Input
          flex={1}
          id="name"
          placeholder="Nate Wienert"
          onChange={(e) => setUser(e.target.value)}
        />
      </XStack>
      <Button
        iconAfter={isPending ? Spinner : HandMetal}
        variant={user === '' || isPending ? 'outlined' : undefined}
        disabled={user === '' || isPending}
        onPress={() => mutate()}
      >
        Request Trip
      </Button>
      <Button icon={ChevronLeft} onPress={() => router.back()}>
        Go Home
      </Button>
    </YStack>
  )
}
