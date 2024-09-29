import { useStore, useUserStore } from '@my/app/util'
import { createClient } from '@my/app/util/components'
import { Button, Card, H4, H5, Paragraph, Separator, Spinner, XStack, YStack } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'solito/navigation'

export function AdminDetailScreen() {
  const store = useStore(useUserStore, (store) => store)
  const client = createClient()
  const router = useRouter()

  const {
    data: userData,
    error,
    isLoading,
  } = useQuery({
    queryFn: async () => {
      const user = client.from('member').select('*').eq('id', store!.id!).single()
      return await user
    },
    queryKey: ['user-details'],
  })

  const {
    data: adminData,
    error: adminErr,
    isLoading: adminLoading,
  } = useQuery({
    queryFn: async () => {
      const { data: tripData, error: tripError } = await client
        .from('trip')
        .select('*, member(*)')
        .order('created_at', { ascending: false })
      const { data: driverData, error: driverError } = await client
        .from('driver')
        .select('*, ...member(*)')
      return { tripData, tripError, driverData, driverError }
    },

    queryKey: ['admin-details'],
    enabled: store?.role === 'ADMIN',
  })

  return (
    <YStack
      f={1}
      jc="center"
      ai="center"
      gap="$4"
      my="$7"
      bg="$background"
      width="90%"
      marginInline="auto"
    >
      {userData && userData.data ? (
        <H4
          ta="center"
          fow="700"
          col="$blue10"
        >{`User : ${userData?.data.fname} ${userData?.data.lname}`}</H4>
      ) : (
        <Paragraph>User not found</Paragraph>
      )}
      {isLoading || adminLoading ? <Spinner /> : undefined}
      <Button icon={ChevronLeft} onPress={() => router.back()}>
        Go Home
      </Button>
      <Separator />
      {error ? (
        <Paragraph
          ta="center"
          fow="700"
          col="$blue10"
        >{`Ran into an issue fetching profile details: ${error.message}`}</Paragraph>
      ) : undefined}

      {adminData && adminData.tripData ? (
        adminData.tripData?.map((item) => (
          <Card py="$3" w="35rem">
            <Card.Header>
              <YStack key={item.id} gap="$3" flexWrap="wrap">
                <Paragraph>Rider: {`${item.member?.fname} ${item.member?.lname}`}</Paragraph>
                <Paragraph>Status: {item.status}</Paragraph>
                <YStack alignItems="flex-start">
                  <Paragraph>Pickup</Paragraph>
                  <Paragraph>lng: {item.pickup_lng}</Paragraph>
                  <Paragraph>lat: {item.pickup_lat}</Paragraph>
                </YStack>
                <YStack alignItems="flex-start">
                  <Paragraph>Destination</Paragraph>
                  <Paragraph>lng: {item.dest_lng}</Paragraph>
                  <Paragraph>lat: {item.dest_lat}</Paragraph>
                </YStack>
              </YStack>
            </Card.Header>
            <Card.Footer>
              <Button mx="auto" onPress={() => alert('Confirming Ride')}>
                Confirm Ride
              </Button>
            </Card.Footer>
          </Card>
        ))
      ) : adminData && adminData.tripError ? (
        <Paragraph>Error pulling trip info {adminData.tripError}</Paragraph>
      ) : undefined}
      {adminData && adminData.driverData ? (
        <YStack>
          <H5>Drivers</H5>
          {adminData.driverData?.map((item) => (
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
      ) : adminData && adminData.driverError ? (
        <Paragraph>Error pulling driver info {adminData.driverError}</Paragraph>
      ) : undefined}
    </YStack>
  )
}
