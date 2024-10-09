import getServerUrl from '@my/app/util/getServerUrl'
import { Button, Paragraph, Spinner, YStack, useToastController } from '@my/ui'
import { Car, ChevronLeft } from '@tamagui/lucide-icons'
import { useMutation } from '@tanstack/react-query'
import { useStore, useUserStore } from 'app/util'
import { useState } from 'react'
import { LngLat } from 'react-map-gl'
import { useRouter } from 'solito/navigation'
import { MapBox } from '../common/MapBox'

export function DriverHomeScreen() {
  const router = useRouter()
  const SERVER_URL = getServerUrl()
  const toast = useToastController()
  const [lngLat, setLnglat] = useState<LngLat | undefined>()
  const [method, setMethod] = useState<'POST' | 'DELETE'>('POST')
  const [isPolling, setIsPolling] = useState(false)

  const store = useStore(useUserStore, (store) => store)

  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      fetch(`${SERVER_URL}/driver/trip`, {
        method,
        referrer: SERVER_URL,
        body: JSON.stringify(
          method == 'POST'
            ? {
                id: store?.id,
                coordinateX: lngLat?.lng.toPrecision(17),
                coordinateY: lngLat?.lat.toPrecision(17),
              }
            : {
                id: store?.id,
              }
        ),
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

  return (
    <YStack f={1} jc="center" ai="center" gap="$4" bg="$background">
      <MapBox lngLat={lngLat} setLnglat={setLnglat} />
      <Paragraph ta="center" fow="700" col="$blue10">
        {`Driver : ${store?.id ? store.id : 'Who are you??'}`}
      </Paragraph>
      <Paragraph>Location: {lngLat ? lngLat.lng + ' ' + lngLat.lat : 'unset'}</Paragraph>
      {/* <XStack alignItems="center" gap="$4">
        <Label width={90} htmlFor="name">
          Name
        </Label>
        <Input
          flex={1}
          id="name"
          placeholder="Nate Wienert"
          onChange={(e) => setId(e.target.value)}
        />
      </XStack> */}
      <Button
        iconAfter={isPending && method === 'POST' ? Spinner : Car}
        variant={store?.id === '' || isPending ? 'outlined' : undefined}
        disabled={store?.id === '' || isPending}
        onPress={() => {
          setMethod('POST')
          mutate()
        }}
      >
        Start Drive
      </Button>
      <Button
        iconAfter={isPending && method === 'DELETE' ? Spinner : Car}
        variant={store?.id === '' || isPending ? 'outlined' : undefined}
        disabled={store?.id === '' || isPending}
        onPress={() => {
          setMethod('DELETE')
          mutate()
        }}
      >
        End Drive
      </Button>
      <Button icon={ChevronLeft} onPress={() => router.back()}>
        Go Home
      </Button>
    </YStack>
  )
}
