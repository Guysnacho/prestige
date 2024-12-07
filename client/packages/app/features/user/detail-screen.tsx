import { useStore, useUserStore } from '@my/app/store'
import { createClient } from '@my/app/util/components'
import { Button, H4, Paragraph, Separator, Spinner, YStack } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams, useRouter } from 'solito/navigation'

export function UserDetailScreen() {
  const store = useStore(useUserStore, (store) => store)
  const client = createClient()
  const router = useRouter()
  const { id } = useParams()

  const {
    data: userData,
    error,
    isLoading,
  } = useQuery({
    queryFn: async () => {
      const user = client.from('member').select('*').eq('id', id).single()
      return await user
    },
    queryKey: ['user-details'],
  })

  // TODO - we need to not do this here
  useEffect(() => {
    if (userData && userData.data && userData.data.id === store?.id) {
      store?.setName(userData.data.fname + ' ' + userData.data.lname)
    }
  }, [userData])

  return (
    <YStack
      f={1}
      jc="center"
      ai="center"
      gap="$4"
      mt="$10"
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
      {isLoading ? <Spinner /> : undefined}
      <Separator />
      {error ? (
        <Paragraph
          ta="center"
          fow="700"
          col="$blue10"
        >{`Ran into an issue fetching profile details: ${error.message}`}</Paragraph>
      ) : undefined}

      <Button icon={ChevronLeft} onPress={() => router.replace('/')}>
        Go Home
      </Button>
    </YStack>
  )
}
