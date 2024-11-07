import { create } from 'apisauce'
import { useContext } from 'react'
import { AuthContext } from '../provider/AuthProvider'
import getServerUrl from '../util/getServerUrl'
import { Platform } from 'react-native'

// define the api
export const useApi = () => {
  const auth = useContext(AuthContext)
  return create({
    baseURL: getServerUrl(),
    headers: {
      Referer: getServerUrl(),
      env: process.env.NODE_ENV,
      Authorization: auth?.session?.access_token,
    },
    httpAgent: Platform.OS + ' ' + Platform.Version,
  })
}

// export const useApi = () => {
//   const auth = useContext(AuthContext)

//   return {
//     fetch: (path: string, method: 'POST', body?: BodyInit) =>
//       fetch(`${getServerUrl()}${path}`, {
//         method,
//         body,
//         referrerPolicy: 'origin',
//         headers: {
//           Authorization: auth!.session!.access_token,
//         },
//       }),
//   }
// }
