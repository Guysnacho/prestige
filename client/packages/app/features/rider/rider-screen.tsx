import { useStore, useUserStore } from '@my/app/util'
import getServerUrl from '@my/app/util/getServerUrl'
import { Button, Paragraph, Spinner, YStack, useToastController } from '@my/ui'
import { ChevronLeft, HandMetal } from '@tamagui/lucide-icons'
import { useMutation } from '@tanstack/react-query'
import { addHours } from 'date-fns'
import { useEffect, useState } from 'react'
import { LngLat } from 'react-map-gl'
import { useRouter } from 'solito/navigation'
import { MapBox } from '../common/MapView'
import { ScheduleSelector } from '../common/ScheduleSelector'

export function RiderHomeScreen() {
  const router = useRouter()
  const toast = useToastController()
  const SERVER_URL = getServerUrl()
  const [pickUplngLat, setPickUpLnglat] = useState<LngLat | undefined>()
  const [destLngLat, setDestLnglat] = useState<LngLat | undefined>()
  const [pickupTime, setPickupTime] = useState<Date | null>(new Date())
  const [minimumDate, setMinDate] = useState<Date>(new Date())
  const [isPolling, setIsPolling] = useState(false)

  const store = useStore(useUserStore, (store) => store)

  const { mutate, isPending, isIdle } = useMutation({
    mutationFn: async () =>
      fetch(`${SERVER_URL}/rider/trip`, {
        method: 'POST',
        referrer: SERVER_URL,
        body: JSON.stringify({
          id: store?.id,
          time: pickupTime?.toISOString(),
          pickup: {
            lng: pickUplngLat?.lng.toPrecision(17),
            lat: pickUplngLat?.lat.toPrecision(17),
          },
          destination: {
            lng: destLngLat?.lng.toPrecision(17),
            lat: destLngLat?.lat.toPrecision(17),
          },
        }),
      }),
    onError(err, v, c) {
      console.error(err)
      toast.show('Issue while requesting your ride', { message: err?.message })
    },
    async onSuccess(data, v, c) {
      var res = await data.json()
      toast.show(res.message, {
        message: res.requestId,
      })
    },
  })

  useEffect(() => {
    const min = new Date()
    setMinDate(addHours(min, 1))
    setPickupTime(addHours(min, 1))
  }, [])

  const isInvalid =
    !store?.id ||
    isPending ||
    !pickUplngLat ||
    !destLngLat ||
    minimumDate.toISOString() > pickupTime!.toISOString()

  return (
    <YStack f={1} jc="center" ai="center" gap="$4" bg="$background">
      <MapBox label="Pickup" height="$20" lngLat={pickUplngLat} setLnglat={setPickUpLnglat} />
      <MapBox label="Drop Off" height="$20" lngLat={destLngLat} setLnglat={setDestLnglat} />
      <Paragraph ta="center" fow="700" col="$blue10">
        {`Rider : ${store?.id ? store.id : 'Who are you??'}`}
      </Paragraph>
      <Paragraph>
        Pick Up Location: {pickUplngLat ? pickUplngLat.lng + ' ' + pickUplngLat.lat : 'unset'}
      </Paragraph>
      <Paragraph>
        Drop Off Location: {destLngLat ? destLngLat.lng + ' ' + destLngLat.lat : 'unset'}
      </Paragraph>
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

      <ScheduleSelector
        minimumDate={minimumDate}
        pickupTime={pickupTime}
        setPickupTime={setPickupTime}
      />
      <Button
        iconAfter={isPending ? Spinner : HandMetal}
        variant={isInvalid ? 'outlined' : undefined}
        disabled={isInvalid}
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
