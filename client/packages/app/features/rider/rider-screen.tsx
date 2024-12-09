import { AuthContext } from '@my/app/provider/AuthProvider'
import { useRouterStore, useStore, useUserStore } from '@my/app/store'
import { TOAST_DURATION } from '@my/app/util'
import getServerUrl from '@my/app/util/getServerUrl'
import { Button, Paragraph, Separator, YStack, useToastController } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { useMutation } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { LngLat } from 'react-map-gl'
import { useRouter } from 'solito/navigation'
import { MapBox } from '../common/MapBox'
import { ScheduleSelector } from '../common/ScheduleSelector'
import { RiderConfirm } from './rider-confirm'
import { RiderSearch } from './rider-search'

export function RiderHomeScreen() {
  const auth = useContext(AuthContext)

  const router = useRouter()
  const toast = useToastController()
  const SERVER_URL = getServerUrl()
  const [pickUplngLat, setPickUpLnglat] = useState<LngLat | undefined>()
  const [destLngLat, setDestLnglat] = useState<LngLat | undefined>()
  const [page, setPage] = useState(2)

  const store = useStore(useUserStore, (store) => store)
  const routeStore = useStore(useRouterStore, (store) => store)

  const { mutate, isPending, isIdle } = useMutation({
    mutationFn: async () =>
      fetch(`${SERVER_URL}/rider/trip`, {
        method: 'POST',
        referrer: SERVER_URL,
        body: JSON.stringify({
          id: store?.id,
          time: routeStore?.pickupTime?.toISOString(),
          pickup: {
            lng: routeStore?.pickup?.longitude.toPrecision(17),
            lat: routeStore?.pickup?.latitude.toPrecision(17),
          },
          destination: {
            lng: routeStore?.destination?.longitude.toPrecision(17),
            lat: routeStore?.destination?.latitude.toPrecision(17),
          },
        }),
        headers: {
          Authorization: auth!.session!.access_token,
        },
      }),
    onError(err, v, c) {
      console.error(err)
      toast.show('Issue while requesting your ride', {
        message: err?.message,
        duration: TOAST_DURATION,
      })
    },
    async onSuccess(data, v, c) {
      var res = await data.json()
      toast.show(res.message, {
        message: res.requestId,
        duration: TOAST_DURATION,
      })
    },
  })

  return (
    <YStack
      $platform-web={{ f: 1, mx: 'auto' }}
      px="$5"
      jc="center"
      ai="center"
      gap="$2"
      bg="$background"
      height="100%"
    >
      <MapBox
        label="Let's handle logistics"
        height="$12"
        width="90%"
        pickUplngLat={pickUplngLat}
        setPickUpLnglat={setPickUpLnglat}
        destLngLat={destLngLat}
        setDestLnglat={setDestLnglat}
      />
      <Paragraph ta="center" fow="700" col="$blue10">
        {`Rider : ${store?.name ? store.name : 'Who are you??'}`}
      </Paragraph>
      <Paragraph>Pick Up Location</Paragraph>
      <Paragraph>{routeStore?.pickup ? routeStore.pickup.formattedAddress : 'unset'}</Paragraph>
      <Paragraph>Drop Off Location</Paragraph>
      <Paragraph>
        {routeStore?.destination ? routeStore.destination.formattedAddress : 'unset'}
      </Paragraph>

      {page === 0 && <RiderSearch setPage={setPage} />}
      {page === 1 && <ScheduleSelector setPage={setPage} />}
      {page === 2 && <RiderConfirm setPage={setPage} />}

      <Separator />

      <Button
        icon={ChevronLeft}
        onPress={() => {
          if (page === 0) {
            routeStore?.clear()
            router.replace('/')
          } else if (page === 1) {
            setPage(0)
            routeStore?.setPickupTime(undefined)
          } else if (page === 2) {
            setPage(1)
          }
        }}
      >
        {page ? 'Go Back' : 'Go Home'}
      </Button>
    </YStack>
  )
}
