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
import { Car, ChevronLeft } from '@tamagui/lucide-icons'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { LngLat } from 'react-map-gl'
import { useRouter } from 'solito/navigation'
import { MapBox } from '../common/MapView'

export function DriverHomeScreen() {
  const router = useRouter()
  const toast = useToastController()
  const [id, setId] = useState('')
  const [lngLat, setLnglat] = useState<LngLat | undefined>()
  const [isPolling, setIsPolling] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/driver/trip`, {
        method: 'POST',
        referrer: process.env.NEXT_PUBLIC_SERVER_HOST,
        body: JSON.stringify({ id }),
      }),
    onError(err, v, c) {
      console.error(err)
      toast.show('Issue while joining the driver pool', { message: err?.message })
    },
    onSuccess(data, v, c) {
      data
        .json()
        .then((res) => toast.show(`${res.message}\n${res.requestId}`))
        .catch((err) => {
          toast.show('Issue speaking with the server')
          console.error(err)
        })
    },
  })

  // const { id } = useParams()

  return (
    <YStack f={1} jc="center" ai="center" gap="$4" bg="$background">
      <MapBox setLnglat={setLnglat} />
      <Paragraph ta="center" fow="700" col="$blue10">
        {`Driver : ${id ? id : 'Who are you??'}`}
      </Paragraph>
      <Paragraph>Location: {lngLat ? lngLat.lng + ' ' + lngLat.lat : 'unset'}</Paragraph>
      <XStack alignItems="center" gap="$4">
        <Label width={90} htmlFor="name">
          Name
        </Label>
        <Input
          flex={1}
          id="name"
          placeholder="Nate Wienert"
          onChange={(e) => setId(e.target.value)}
        />
      </XStack>
      <Button
        iconAfter={isPending ? Spinner : Car}
        variant={id === '' || isPending ? 'outlined' : undefined}
        disabled={id === '' || isPending}
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
