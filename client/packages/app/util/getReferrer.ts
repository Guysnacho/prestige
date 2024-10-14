import { Platform } from 'react-native'

const getReferrer = () => {
  if (Platform.OS === 'web') {
    return process.env.NEXT_PUBLIC_SERVER_HOST
  } else if (process.env.NODE_ENV === 'development' && Platform.OS === 'android') {
    return 'http://10.0.2.2:8080'
  }
  return process.env.EXPO_PUBLIC_SERVER_HOST
}

export default getReferrer
