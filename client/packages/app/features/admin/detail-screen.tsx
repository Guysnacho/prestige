import { useStore, useUserStore } from '@my/app/store'
import { createClient } from '@my/app/util/components'
import { Button, H4, Paragraph, ScrollView, Separator, Spinner, YStack } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'solito/navigation'
import { TripCard } from './trip-card'

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
      return { tripData, tripError }
    },

    queryKey: ['admin-details'],
    enabled: store?.role === 'ADMIN',
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
      height="100%"
      mx="auto"
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
      <Button icon={ChevronLeft} onPress={() => router.replace('/')}>
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

      {adminData && adminData.tripData && adminData.tripData.length ? (
        <ScrollView>
          {adminData.tripData?.map((item) => (
            <TripCard key={item.id} member={item.member} trip={item} router={router} />
          ))}
        </ScrollView>
      ) : adminData && adminData.tripError ? (
        <Paragraph>Error pulling trip info {adminData.tripError}</Paragraph>
      ) : undefined}
    </YStack>
  )
}
