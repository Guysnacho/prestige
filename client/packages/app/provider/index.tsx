import { CustomToast, TamaguiProvider, TamaguiProviderProps, ToastProvider, config } from '@my/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useColorScheme } from 'react-native'
import { ToastViewport } from './ToastViewport'

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const colorScheme = useColorScheme()
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider
        config={config}
        defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}
        {...rest}
      >
        <ToastProvider
          swipeDirection="horizontal"
          duration={6000}
          native={
            [
              /* uncomment the next line to do native toasts on mobile. NOTE: it'll require you making a dev build and won't work with Expo Go */
              // 'mobile'
            ]
          }
        >
          {children}
          <CustomToast />
          <ToastViewport />
        </ToastProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  )
}
