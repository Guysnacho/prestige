import { useStore, useUserStore } from '@my/app/util'
import { createClient } from '@my/app/util/components'
import { Button, Card, H4, H5, Paragraph, Separator, Spinner, XStack, YStack } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

export function TripMatcherScreen() {
  const store = useStore(useUserStore, (store) => store)
  const client = createClient()
  const router = useRouter()

  const { data, error, isLoading } = useQuery({
    queryFn: async () => {
      const { data: tripData, error: tripError } = await client
        .from('trip')
        .select('*, member(*)')
        .eq('id', router.query.id ?? '')
        .single()
      const { data: driverData, error: driverError } = await client
        .from('driver')
        .select('*, ...member(*)')
      return { tripData, tripError, driverData, driverError }
    },

    queryKey: ['admin-details'],
    enabled: store?.role === 'ADMIN' && router.query.id !== undefined,
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
      <Button icon={ChevronLeft} onPress={() => router.back()}>
        Go Home
      </Button>
      <Separator />
      {error ? (
        <Paragraph
          ta="center"
          fow="700"
          col="$blue10"
        >{`Ran into an issue fetching trip details: ${error.message}`}</Paragraph>
      ) : undefined}

      {data && !data.tripError && data.tripData ? (
        <YStack gap="$4">
          <Card py="$3" w="35rem">
            <Card.Header>
              <YStack key={data.tripData.id} gap="$3" flexWrap="wrap">
                <Paragraph>
                  Rider: {`${data.tripData.member?.fname} ${data.tripData.member?.lname}`}
                </Paragraph>
                <Paragraph>Status: {data.tripData.status}</Paragraph>
                <YStack alignItems="flex-start">
                  <Paragraph>Pickup</Paragraph>
                  <Paragraph>lng: {data.tripData.pickup_lng}</Paragraph>
                  <Paragraph>lat: {data.tripData.pickup_lat}</Paragraph>
                </YStack>
                <YStack alignItems="flex-start">
                  <Paragraph>Destination</Paragraph>
                  <Paragraph>lng: {data.tripData.dest_lng}</Paragraph>
                  <Paragraph>lat: {data.tripData.dest_lat}</Paragraph>
                </YStack>
              </YStack>
            </Card.Header>
            <Card.Footer>
              <Button mx="auto" onPress={() => alert('Confirming Ride')}>
                Confirm Ride
              </Button>
            </Card.Footer>
          </Card>
        </YStack>
      ) : data && data.tripError ? (
        <Paragraph>Error pulling trip info {data.tripError}</Paragraph>
      ) : undefined}
      {data && !data.driverError && data.driverData ? (
        <YStack>
          <H5>Drivers</H5>
          {data.driverData?.map((item) => (
            <XStack key={item.id} gap="$3">
              <Paragraph>Driver: {`${item.fname} ${item.lname}`}</Paragraph>
              <Paragraph>Is Active: {item.active ? 'ACTIVE' : 'INACTIVE'}</Paragraph>
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
