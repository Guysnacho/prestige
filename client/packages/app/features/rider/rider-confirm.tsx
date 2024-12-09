import { AuthContext } from '@my/app/provider/AuthProvider'
import { useRouterStore, useStore, useUserStore } from '@my/app/store'
import { TOAST_DURATION } from '@my/app/util'
import getServerUrl from '@my/app/util/getServerUrl'
import { Button, Paragraph, Spinner, YStack, useToastController } from '@my/ui'
import { HandMetal } from '@tamagui/lucide-icons'
import { useMutation } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useContext } from 'react'

export function RiderConfirm({ setPage }: { setPage: Dispatch<SetStateAction<number>> }) {
  const auth = useContext(AuthContext)
  const toast = useToastController()
  const SERVER_URL = getServerUrl()

  const store = useStore(useRouterStore, (store) => store)
  const user = useStore(useUserStore, (store) => store)

  const { mutate, isPending, isIdle } = useMutation({
    mutationFn: async () =>
      fetch(`${SERVER_URL}/rider/trip`, {
        method: 'POST',
        referrer: SERVER_URL,
        body: JSON.stringify({
          id: user?.id,
          time: store?.pickupTime?.toISOString(),
          pickup: {
            lng: store?.pickup?.longitude.toPrecision(17),
            lat: store?.pickup?.latitude.toPrecision(17),
          },
          destination: {
            lng: store?.destination?.longitude.toPrecision(17),
            lat: store?.destination?.latitude.toPrecision(17),
          },
        }),
        headers: {
          Authorization: auth!.session!.access_token,
        },
      }),
    onError(err, v, c) {
      console.error(err)
      toast.show('Issue while requesting your ride', {
        message: err?.message,
        duration: TOAST_DURATION,
      })
    },
    async onSuccess(data, v, c) {
      var res = await data.json()
      toast.show(res.message, {
        message: res.requestId,
        duration: TOAST_DURATION,
      })
    },
  })

  const isInvalid = !user?.id || isPending || !store?.pickup || !store?.destination

  return (
    <YStack $gtMd={{ w: '50%' }} w="75%" gap="$4" mt="$5">
      <Paragraph>Please confirm the above details for your trip</Paragraph>
      <Button
        iconAfter={isPending ? Spinner : HandMetal}
        variant={isInvalid ? 'outlined' : undefined}
        disabled={isInvalid}
        onPress={() => mutate()}
      >
        Request Trip
      </Button>
    </YStack>
  )
}
