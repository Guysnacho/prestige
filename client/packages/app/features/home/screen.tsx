import { useStore, useUserStore } from '@my/app/store'
import {
  Anchor,
  Button,
  H1,
  Paragraph,
  Separator,
  Sheet,
  SwitchThemeButton,
  XStack,
  YStack,
  useToastController,
} from '@my/ui'
import { User } from '@supabase/supabase-js'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { useLink, useRouter } from 'solito/navigation'

export type HomeProps = {
  user?: User | null
}

export default function HomeScreen({ user }: HomeProps) {
  const store = useStore(useUserStore, (store) => store)
  const router = useRouter()

  useEffect(() => {
    if (user == null) {
      router.replace('/')
    }
  }, [])

  return (
    <YStack f={1} jc="center" ai="center" gap="$8" p="$4" bg="$background">
      <XStack
        pos="absolute"
        w="100%"
        t="$6"
        gap="$6"
        jc="center"
        fw="wrap"
        $sm={{ pos: 'relative', t: 0 }}
      >
        {Platform.OS === 'web' && (
          <>
            <SwitchThemeButton />
          </>
        )}
      </XStack>

      <YStack gap="$4">
        <H1 ta="center" col="$color12">
          Welcome to De Prestige Chauffeur.
        </H1>
        <Paragraph col="$color10" ta="center">
          “ De Prestige Chauffeur ” offers a seamless luxury on-demand transportation service
        </Paragraph>
        <Separator />
        <Paragraph ta="center">
          Sign up today to gain access to our services through our app!
        </Paragraph>
        <Separator />
      </YStack>

      <Button
        {...useLink({
          href: `/user/${store?.id}`,
        })}
      >
        Link to user
      </Button>
      <Button
        {...useLink({
          href: `/admin`,
        })}
      >
        Admin Page
      </Button>
      <Button
        {...useLink({
          href: `/driver?id=${user?.id}`,
        })}
      >
        Driver Page
      </Button>
      <Button
        {...useLink({
          href: `/rider?id=${user?.id}`,
        })}
      >
        Rider Page
      </Button>

      <SheetDemo />
    </YStack>
  )
}

function SheetDemo() {
  const toast = useToastController()

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  return (
    <>
      <Button
        size="$6"
        icon={open ? ChevronDown : ChevronUp}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle bg="$gray8" />
        <Sheet.Frame ai="center" jc="center" gap="$10" bg="$color2">
          <XStack gap="$2">
            <Paragraph ta="center">Made by</Paragraph>
            <Anchor col="$blue10" href="https://twitter.com/natebirdman" target="_blank">
              @natebirdman,
            </Anchor>
            <Anchor
              color="$purple10"
              href="https://github.com/tamagui/tamagui"
              target="_blank"
              rel="noreferrer"
            >
              give it a ⭐️
            </Anchor>
          </XStack>

          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              toast.show('Sheet closed!', {
                message: 'Just showing how toast works...',
              })
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
