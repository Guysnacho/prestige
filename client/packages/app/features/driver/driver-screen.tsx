import { AuthContext } from '@my/app/provider/AuthProvider'
import getServerUrl from '@my/app/util/getServerUrl'
import { Button, Paragraph, Spinner, View, XStack, YStack, useToastController } from '@my/ui'
import { Car, ChevronLeft } from '@tamagui/lucide-icons'
import { useMutation } from '@tanstack/react-query'
import { useStore, useUserStore } from 'app/util'
import { useContext, useState } from 'react'
import { LngLat } from 'react-map-gl'
import { Platform } from 'react-native'
import { useRouter } from 'solito/navigation'
import { MapBox } from '../common/MapBox'

export function DriverHomeScreen() {
  const auth = useContext(AuthContext)

  const router = useRouter()
  const SERVER_URL = getServerUrl()
  const toast = useToastController()
  const [lngLat, setLnglat] = useState<LngLat | undefined>()
  const [method, setMethod] = useState<'POST' | 'DELETE'>('POST')
  const [isPolling, setIsPolling] = useState(false)
  const isWeb = Platform.OS === 'web'

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
        headers: {
          Authorization: auth!.session!.access_token,
        },
      }),
    onError(err, v, c) {
      console.error(err)
      toast.show('Issue while joining the driver pool', { message: err?.message })
    },
    async onSuccess(data, v, c) {
      await data
        .json()
        .then((res) => {
          toast.show(`${res.message}\n${res.requestId}`)
        })
        .catch((err) => {
          toast.show('Issue speaking with the server')
          console.error(err)
        })
    },
  })

  return (
    <YStack f={isWeb ? 1 : undefined} jc="center" ai="center" gap="$4">
      <XStack h="$20" w="100%">
        {isWeb ? (
          <MapBox
            label="Let's handle logistics"
            height="$20"
            setPickUpLnglat={setLnglat}
            pickUplngLat={lngLat!}
          />
        ) : (
          <MapBox
            label="Let's handle logistics"
            mt="$10"
            height="$16"
            width="100%"
            setPickUpLnglat={setLnglat}
            pickUplngLat={lngLat!}
          />
        )}
      </XStack>
      <Paragraph ta="center" fow="700" col="$blue10">
        {`Driver : ${store?.id ? store.id : 'Who are you??'}`}
      </Paragraph>
      <Paragraph>Location: {lngLat ? lngLat.lng + ' ' + lngLat.lat : 'unset'}</Paragraph>

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
      <Button icon={ChevronLeft} onPress={() => router.replace('/')}>
        Go Home
      </Button>
    </YStack>
  )
}
