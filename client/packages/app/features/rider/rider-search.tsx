import { useRouterStore, useStore } from '@my/app/store'
import {
  Button,
  Input,
  Label,
  ListItem,
  Paragraph,
  Separator,
  XStack,
  YGroup,
  YStack,
  useDebounceValue,
  useToastController,
} from '@my/ui'
import { House } from '@tamagui/lucide-icons'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Radar, { RadarAddress } from 'react-native-radar'

export function RiderSearch({ setPage }: { setPage: Dispatch<SetStateAction<number>> }) {
  const toast = useToastController()
  const [pickUp, setPickUp] = useState<string | undefined>()
  const [dest, setDest] = useState<string | undefined>()
  const [isPickupSet, setIsPickupSet] = useState(false)
  const [pickupList, setPickupList] = useState<RadarAddress[] | undefined>(undefined)
  const [destList, setDestList] = useState<RadarAddress[] | undefined>(undefined)

  const store = useStore(useRouterStore, (store) => store)

  const memoedPickup = useDebounceValue(pickUp, 350)
  const memoedDest = useDebounceValue(dest, 350)

  useEffect(() => {
    // Search pickup address
    if (pickUp) {
      Radar.autocomplete({
        query: pickUp,
        limit: 5,
      }).then((res) => {
        if (!res.addresses) {
          toast.show('Address search failed, try again later', {
            message: res.status,
          })
          setPickupList([])
        } else {
          setPickupList(res.addresses)
        }
      })
    }
  }, [memoedPickup])

  useEffect(() => {
    // Search destination address
    if (dest) {
      Radar.autocomplete({
        query: dest,
        limit: 5,
      }).then((res) => {
        if (!res.addresses) {
          toast.show('Address search failed, try again later', {
            message: res.status,
          })
          setDestList([])
        } else {
          setDestList(res.addresses)
        }
      })
    }
  }, [memoedDest])

  return (
    <YStack $gtMd={{ w: '50%' }} w="100%" gap="$4">
      <XStack alignItems="center" gap="$4">
        <Label width={90} htmlFor="pickup location">
          Pickup
        </Label>
        <Input
          flex={1}
          id="pickup"
          disabled={isPickupSet}
          placeholder={store?.pickup?.formattedAddress ?? '1600 Pennsylvania Avenue NW'}
          onChangeText={setPickUp}
        />
      </XStack>
      <XStack alignItems="center" gap="$4">
        <Label width={90} htmlFor="destination location">
          Drop Off
        </Label>
        <Input
          flex={1}
          id="destination location"
          disabled={!isPickupSet}
          placeholder={store?.destination?.formattedAddress ?? '1600 Pennsylvania Avenue NW'}
          onChangeText={setDest}
        />
      </XStack>
      <Separator />
      {/* Search Results */}
      {!isPickupSet && pickupList && (
        <YStack w="100%" h="$10">
          <YGroup alignSelf="center" bordered size="$2">
            {pickupList.map((addy) => (
              <YGroup.Item key={addy.latitude}>
                <ListItem
                  hoverTheme
                  icon={House}
                  title={addy.formattedAddress}
                  onPress={() => {
                    setIsPickupSet(true)
                    store?.setPickup(addy)
                  }}
                />
              </YGroup.Item>
            ))}
          </YGroup>
        </YStack>
      )}
      {isPickupSet && destList && (
        <YStack w="100%" h="$10">
          <YGroup alignSelf="center" bordered size="$2">
            {destList.map((addy) => (
              <YGroup.Item key={addy.latitude}>
                <ListItem
                  hoverTheme
                  icon={House}
                  title={addy.formattedAddress}
                  onPress={() => {
                    store?.setDestination(addy)
                    setPage(1)
                  }}
                />
              </YGroup.Item>
            ))}
          </YGroup>
        </YStack>
      )}
      <Button mx="auto" px="$6" disabled={!store?.destination} onPress={() => setPage(1)}>
        Confirm
      </Button>
    </YStack>
  )
}
