import { useStore, useUserStore } from '@my/app/util'
import { createClient } from '@my/app/util/components'
import {
  Button,
  H5,
  Paragraph,
  Separator,
  Spinner,
  XStack,
  YStack,
  useToastController,
} from '@my/ui'
import { ChevronLeft, UsersRound } from '@tamagui/lucide-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'solito/navigation'
import { useState } from 'react'
import { TripCard } from './trip-card'

export function TripMatcherScreen() {
  const store = useStore(useUserStore, (store) => store)
  const client = createClient()
  const toast = useToastController()
  const router = useRouter()
  const params = useSearchParams()
  const [driver, setDriver] = useState<string | undefined>()

  const { data, error, isLoading } = useQuery({
    queryFn: async () => {
      const { data: tripData, error: tripError } = await client
        .from('trip')
        .select('*, member(*)')
        .eq('id', params?.get('id') ?? '')
        .single()
      const { data: driverData, error: driverError } = await client.rpc('get_closest_drivers', {
        rider_x: tripData!.pickup_lng.toPrecision(17),
        rider_y: tripData!.pickup_lat.toPrecision(17),
      })
      return { tripData, tripError, driverData, driverError }
    },

    queryKey: ['admin-details'],
    enabled: store?.role === 'ADMIN' && params?.get('id') !== undefined,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return client.from('trip').update({ driver, status: 'ASSIGNED' }).eq('id', data!.tripData!.id)
    },
    onSettled(data, error, variables, context) {
      if (data?.error) {
        toast.show('Issue assigning driver', { message: data.error.message })
      } else if (error) {
        toast.show('Issue assigning driver', { message: error.message })
      } else {
        toast.show('Driver assigned!', { message: data?.statusText })
        router.replace('/admin')
      }
    },
  })

  return (
    <YStack
      // f={1}
      jc="center"
      ai="center"
      gap="$4"
      my="$7"
      bg="$background"
      width="90%"
      marginInline="auto"
    >
      {isLoading ? <Spinner /> : undefined}
      <Button
        icon={ChevronLeft}
        onPress={() =>
          router.replace('/admin', {
            experimental: { isNestedNavigator: true, nativeBehavior: 'stack-replace' },
          })
        }
      >
        Go Back
      </Button>
      <Separator />
      {error ? (
        <Paragraph
          ta="center"
          fow="700"
          col="$blue10"
        >{`Ran into an issue fetching trip details: ${error.message}`}</Paragraph>
      ) : undefined}

      {isLoading ? (
        <Spinner />
      ) : data && !data.tripError && data.tripData ? (
        <YStack gap="$4">
          <TripCard member={data.tripData.member} trip={data.tripData} />
        </YStack>
      ) : data && data.tripError ? (
        <Paragraph>Error pulling trip info {data.tripError}</Paragraph>
      ) : undefined}
      {isLoading ? (
        <Spinner />
      ) : data && !data.driverError && data.driverData ? (
        <YStack my="$4" gap="$2">
          <H5 size="$7" mx="auto">
            Drivers
          </H5>
          {data.driverData?.map((item) => (
            <XStack key={item.driver_id} alignItems="center" gap="$3">
              <Button
                icon={isPending ? <Spinner /> : <UsersRound />}
                onPress={() => {
                  setDriver(item.driver_id)
                  mutate()
                }}
              >
                {isPending ? undefined : 'Assign'}
              </Button>
              <YStack alignItems="flex-start">
                <Paragraph>ID: {item.driver_id}</Paragraph>
                <Paragraph>Driver: {`${item.fname} ${item.lname}`}</Paragraph>
                <Paragraph>Is Active: {item.active ? 'ACTIVE' : 'INACTIVE'}</Paragraph>
              </YStack>
              <YStack alignItems="flex-start">
                <Paragraph>Pickup</Paragraph>
                <Paragraph>lng: {item.coordinate_x}</Paragraph>
                <Paragraph>lat: {item.coordinate_y}</Paragraph>
              </YStack>
            </XStack>
          ))}
        </YStack>
      ) : data && data.driverError ? (
        <Paragraph>Error pulling driver info {data.driverError}</Paragraph>
      ) : undefined}
    </YStack>
  )
}
