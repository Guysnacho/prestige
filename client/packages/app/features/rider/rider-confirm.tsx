import { useRouterStore, useStore } from '@my/app/store'
import { Button, Paragraph, Spinner, YStack, useToastController } from '@my/ui'
import { HandMetal } from '@tamagui/lucide-icons'
import { Dispatch, SetStateAction } from 'react'

export function RiderConfirm({ setPage }: { setPage: Dispatch<SetStateAction<number>> }) {
  const toast = useToastController()

  const store = useStore(useRouterStore, (store) => store)

  // const isInvalid =
  //   !store?.id ||
  //   isPending ||
  //   !pickUplngLat ||
  //   !destLngLat ||
  //   minimumDate.toISOString() > pickupTime!.toISOString()
  const isInvalid = false

  return (
    <YStack $gtMd={{ w: '50%' }} w="75%" gap="$4">
      <Paragraph>Please confirm these details</Paragraph>
      <Button
        // iconAfter={isPending ? Spinner : HandMetal}
        variant={isInvalid ? 'outlined' : undefined}
        disabled={isInvalid}
        // onPress={() => mutate()}
      >
        Request Trip
      </Button>
    </YStack>
  )
}
