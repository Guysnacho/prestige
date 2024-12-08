import { AuthContext } from '@my/app/provider/AuthProvider'
import { useStore, useUserStore } from '@my/app/store'
import { TOAST_DURATION } from '@my/app/util'
import getServerUrl from '@my/app/util/getServerUrl'
import {
  Button,
  H6,
  Input,
  Label,
  ListItem,
  Paragraph,
  Separator,
  Spinner,
  XStack,
  YGroup,
  YStack,
  useToastController,
} from '@my/ui'
import { ChevronLeft, HandMetal, Star } from '@tamagui/lucide-icons'
import { useMutation } from '@tanstack/react-query'
import { addHours } from 'date-fns'
import { useContext, useEffect, useState } from 'react'
import { LngLat } from 'react-map-gl'
import { Platform } from 'react-native'
import { useRouter } from 'solito/navigation'
import { MapBox } from '../common/MapBox'
import { ScheduleSelector } from '../common/ScheduleSelector'

export function RiderHomeScreen() {
  const auth = useContext(AuthContext)

  const router = useRouter()
  const toast = useToastController()
  const SERVER_URL = getServerUrl()
  const [pickUplngLat, setPickUpLnglat] = useState<LngLat | undefined>()
  const [destLngLat, setDestLnglat] = useState<LngLat | undefined>()
  const [pickUp, setPickUp] = useState<string | undefined>()
  const [dest, setDest] = useState<string | undefined>()
  const [pickupTime, setPickupTime] = useState<Date | null>(new Date())
  const [minimumDate, setMinDate] = useState<Date>(new Date())
  const [isPickupSet, setIsPickupSet] = useState(false)

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
    <YStack
      f={Platform.OS === 'web' ? 1 : 0}
      mx={Platform.OS === 'web' ? 'auto' : undefined}
      jc="center"
      ai="center"
      gap="$4"
      bg="$background"
      height="100%"
    >
      <MapBox
        label="Let's handle logistics"
        height="$20"
        width="90%"
        pickUplngLat={pickUplngLat}
        setPickUpLnglat={setPickUpLnglat}
        destLngLat={destLngLat}
        setDestLnglat={setDestLnglat}
      />
      <Paragraph ta="center" fow="700" col="$blue10">
        {`Rider : ${store?.name ? store.name : 'Who are you??'}`}
      </Paragraph>
      <Paragraph>
        Pick Up Location: {pickUplngLat ? pickUplngLat.lng + ' ' + pickUplngLat.lat : 'unset'}
      </Paragraph>
      <Paragraph>
        Drop Off Location: {destLngLat ? destLngLat.lng + ' ' + destLngLat.lat : 'unset'}
      </Paragraph>
      <XStack alignItems="center" gap="$4">
        <Label width={90} htmlFor="pickup">
          Pickup
        </Label>
        <Input
          flex={1}
          id="pickup"
          disabled={isPickupSet}
          placeholder="1600 Pennsylvania Avenue NW"
          onChange={(e) => setPickUp(e.target.value)}
        />
      </XStack>
      <XStack alignItems="center" gap="$4">
        <Label width={90} htmlFor="destination">
          Drop Off
        </Label>
        <Input
          flex={1}
          id="destination"
          disabled={!isPickupSet}
          placeholder="1600 Pennsylvania Avenue NW"
          onChange={(e) => setDest(e.target.value)}
        />
      </XStack>

      <Separator />

      {/* Search Results */}
      <Paragraph>
        Drop Off Location: {destLngLat ? destLngLat.lng + ' ' + destLngLat.lat : 'unset'}
      </Paragraph>

      <YGroup alignSelf="center" bordered size="$2">
        <YGroup.Item>
          <ListItem hoverTheme icon={Star} title="Star" subTitle="Twinkles" />
        </YGroup.Item>
      </YGroup>

      <Separator />

      {/* Pickup Time */}
      <H6>Pickup Time</H6>
      <Paragraph>{`${pickupTime?.toLocaleString()}`}</Paragraph>

      <ScheduleSelector
        minimumDate={minimumDate}
        pickupTime={pickupTime}
        setPickupTime={setPickupTime}
      />
      <Separator />
      <Button
        iconAfter={isPending ? Spinner : HandMetal}
        variant={isInvalid ? 'outlined' : undefined}
        disabled={isInvalid}
        onPress={() => mutate()}
      >
        Request Trip
      </Button>
      <Button icon={ChevronLeft} onPress={() => router.replace('/')}>
        Go Home
      </Button>
    </YStack>
  )
}
