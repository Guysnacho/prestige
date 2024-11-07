import MapLibreGL from '@maplibre/maplibre-react-native'
import OnPressEvent from '@maplibre/maplibre-react-native/javascript/types/OnPressEvent'
import { H2, YStack, YStackProps } from '@my/ui'
import { MapPin } from '@tamagui/lucide-icons'
import layers from 'protomaps-themes-base'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { LngLat } from 'react-map-gl'
import { usePathname } from 'solito/navigation'

const StyleJSON = require('./styles.json')

export const MapBox = (
  props: {
    setPickUpLnglat: Dispatch<SetStateAction<LngLat>>
    pickUplngLat: LngLat
    setDestLnglat?: Dispatch<SetStateAction<LngLat>>
    destLngLat?: LngLat
    label?: string
  } & YStackProps
) => {
  const [mounted, setMounted] = useState(false)
  const [locSelect, setLocSelect] = useState<'pickup' | 'destination'>('pickup')
  const path = usePathname()
  const [isDriver, setIsDriver] = useState(false)

  useEffect(() => {
    MapLibreGL.setAccessToken(null)
    setMounted(true)
  }, [])

  useEffect(() => (path?.includes('/driver') ? setIsDriver(true) : setIsDriver(false)), [path])

  const selectLocation = (e: OnPressEvent): void => {
    console.log('loc set. isDriver: ', isDriver)
    if (isDriver) {
      props?.setPickUpLnglat({
        lng: e.coordinates.longitude,
        lat: e.coordinates.latitude,
      } as LngLat)
    } else {
      switch (locSelect) {
        case 'destination':
          {
            setLocSelect('pickup')
            props?.setDestLnglat({
              lng: e.coordinates.longitude,
              lat: e.coordinates.latitude,
            } as LngLat)
          }
          break
        case 'pickup':
          {
            setLocSelect('destination')
            props?.setPickUpLnglat({
              lng: e.coordinates.longitude,
              lat: e.coordinates.latitude,
            } as LngLat)
          }
          break

        default:
          break
      }
    }
  }

  const selectDriverLocation = (e: OnPressEvent): void => {}

  return (
    <YStack {...props}>
      <H2>{props?.label ? props?.label : 'Map Demo'}</H2>
      {mounted && (
        <MapLibreGL.MapView
          // styleURL="https://d1umd3779acasn.cloudfront.net/my_area.json"
          // styleJSON={`${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/map/styles.json`}
          style={{
            flex: 1,
            alignSelf: 'stretch',
          }}
          surfaceView
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <MapLibreGL.VectorSource
            id="protomaps"
            onPress={(e) => selectLocation(e)}
            tileUrlTemplates={['https://d1umd3779acasn.cloudfront.net/my_area/{z}/{x}/{y}.mvt']}
          />
          {props?.pickUplngLat && (
            <MapLibreGL.PointAnnotation
              id="PickUp-Pin"
              coordinate={[props?.pickUplngLat.lng, props?.pickUplngLat.lat]}
            >
              <MapPin color="whitesmoke" outlineColor="white" />
            </MapLibreGL.PointAnnotation>
          )}
          {props?.destLngLat && (
            <MapLibreGL.PointAnnotation
              id="Destination-Pin"
              coordinate={[props?.destLngLat.lng, props?.destLngLat.lat]}
            >
              <MapPin />
            </MapLibreGL.PointAnnotation>
          )}
          {/* <MapLibreGL.Camera
            zoomLevel={10}
            centerCoordinate={[props?.lngLat?.lng, props?.lngLat?.lat]}
          /> */}
          {/* // TODO - Fix dark map
          <MapLibreGL.Style json={{ ...StyleJSON, layers: layers('protomaps', 'dark') }} /> */}
        </MapLibreGL.MapView>
      )}
    </YStack>
  )
}
