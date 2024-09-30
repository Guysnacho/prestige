import { useStore, useUserStore } from '@my/app/util'
import { createClient } from '@my/app/util/components'
import { Button, H4, H5, Paragraph, Separator, Spinner, XStack, YStack } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
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
      <Button icon={ChevronLeft} onPress={() => router.push('/')}>
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
        <YStack gap="$4">
          {adminData.tripData?.map((item) => (
            <TripCard member={item.member} trip={item} router={router} />
          ))}
        </YStack>
      ) : adminData && adminData.tripError ? (
        <Paragraph>Error pulling trip info {adminData.tripError}</Paragraph>
      ) : undefined}
    </YStack>
  )
}
