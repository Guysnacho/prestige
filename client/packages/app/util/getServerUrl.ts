import { Platform } from 'react-native'

const getServerUrl = () => {
  if (Platform.OS === 'web') {
    return process.env.EXPO_PUBLIC_SERVER_HOST
  } else {
    return process.env.NEXT_PUBLIC_SERVER_HOST
  }
}

export default getServerUrl
