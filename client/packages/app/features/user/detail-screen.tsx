import { useStore, useUserStore } from '@my/app/util'
import { createClient } from '@my/app/util/components'
import { Button, H5, Paragraph, Separator, Spinner, XStack, YStack } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'solito/navigation'

export function UserDetailScreen() {
  const store = useStore(useUserStore, (store) => store)
  const client = createClient()
  const router = useRouter()
  const { id } = useParams()

  const { data, error, isLoading } = useQuery({
    queryFn: async () => {
      const user = client.from('member').select('*').eq('id', id)
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
        .select('*')
        .order('created_at', { ascending: false })
      const { data: driverData, error: driverError } = await client.from('driver').select('*')
      return { tripData, tripError, driverData, driverError }
    },

    queryKey: ['admin-details'],
    enabled: store?.role === 'ADMIN',
  })

  return (
    <YStack f={1} jc="center" ai="center" gap="$4" bg="$background" width="90%" marginInline="auto">
      <Paragraph ta="center" fow="700" col="$blue10">{`User ID: ${id}`}</Paragraph>
      {isLoading || adminLoading ? <Spinner /> : undefined}
      <Separator />
      {error ? (
        <Paragraph
          ta="center"
          fow="700"
          col="$blue10"
        >{`Ran into an issue fetching profile details: ${error.message}`}</Paragraph>
      ) : undefined}

      {adminData && adminData.driverData ? (
        adminData.tripData?.map((item) => (
          <XStack key={item.id} gap="$3" flexWrap="wrap">
            <Paragraph>ID: {item.id}</Paragraph>
            <Paragraph>Status: {item.status}</Paragraph>
            <Paragraph>Rider: {item.rider}</Paragraph>
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
          </XStack>
        ))
      ) : adminData && adminData.tripError ? (
        <Paragraph>Error pulling trip info {adminData.tripError}</Paragraph>
      ) : undefined}
      {adminData && adminData.driverData ? (
        <YStack>
          <H5>Drivers</H5>
          {adminData.driverData?.map((item) => (
            <XStack key={item.id} gap="$3">
              <Paragraph>ID: {item.id}</Paragraph>
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
      <Button icon={ChevronLeft} onPress={() => router.back()}>
        Go Home
      </Button>
    </YStack>
  )
}
