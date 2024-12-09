import { useRouterStore, useStore, useUserStore } from '@my/app/store'
import { Button, Paragraph, Separator, YStack } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { LngLat } from 'react-map-gl'
import { useRouter } from 'solito/navigation'
import { MapBox } from '../common/MapBox'
import { ScheduleSelector } from '../common/ScheduleSelector'
import { RiderConfirm } from './rider-confirm'
import { RiderSearch } from './rider-search'
import { BackHandler } from 'react-native'

export function RiderHomeScreen() {
  const router = useRouter()
  const [pickUplngLat, setPickUpLnglat] = useState<LngLat | undefined>()
  const [destLngLat, setDestLnglat] = useState<LngLat | undefined>()
  const [page, setPage] = useState(0)

  const store = useStore(useUserStore, (store) => store)
  const routeStore = useStore(useRouterStore, (store) => store)

  useEffect(() => {
    // Normal back behavior if no listeners return true
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (page === 0) {
        return false
      } else if (page === 1) {
        routeStore?.clear()
      } else if (page === 2) {
        routeStore?.setPickupTime()
      }
      setPage(page - 1)
    })

    return () => backHandler.remove()
  }, [])

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
