import MapLibreGL from '@maplibre/maplibre-react-native'
import OnPressEvent from '@maplibre/maplibre-react-native/javascript/types/OnPressEvent'
import { H2, YStack, YStackProps } from '@my/ui'
import { MapPin } from '@tamagui/lucide-icons'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { LngLat } from 'react-map-gl'

export const MapBox = (
  props: {
    setPickUpLnglat: Dispatch<SetStateAction<LngLat | undefined>>
    pickUplngLat: LngLat | undefined
    setDestLnglat: Dispatch<SetStateAction<LngLat | undefined>>
    destLngLat: LngLat | undefined
    label?: string
  } & YStackProps
) => {
  const [mounted, setMounted] = useState(false)
  const [locSelect, setLocSelect] = useState<'pickup' | 'destination'>('pickup')

  useEffect(() => {
    MapLibreGL.setAccessToken(null)
    setMounted(true)
  }, [])

  const selectLocation = (e: OnPressEvent): void => {
    switch (locSelect) {
      case 'destination':
        {
          setLocSelect('pickup')
          props.setDestLnglat({
            lng: e.coordinates.longitude,
            lat: e.coordinates.latitude,
          } as LngLat)
        }
        break
      case 'pickup':
        {
          setLocSelect('destination')
          props.setPickUpLnglat({
            lng: e.coordinates.longitude,
            lat: e.coordinates.latitude,
          } as LngLat)
        }
        break

      default:
        break
    }
  }

  return (
    <YStack {...props}>
      <H2>{props?.label ? props?.label : 'Map Demo'}</H2>
      {mounted && (
        <MapLibreGL.MapView
          style={{
            flex: 1,
            alignSelf: 'stretch',
          }}
          // styleURL="https://d1umd3779acasn.cloudfront.net/my_area/{z}/{x}/{y}.pbf"
          // styleJSON={`${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/map/styles.json`}
          surfaceView
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <MapLibreGL.VectorSource
            id="protomaps"
            onPress={(e) => selectLocation(e)}
            tileUrlTemplates={['https://d1umd3779acasn.cloudfront.net/my_area/{z}/{x}/{y}.pbf']}
          />
          {props.lngLat && (
            <MapLibreGL.PointAnnotation
              coordinate={[props.lngLat.lng, props.lngLat.lat]}
              id="PickUp-Pin"
            >
              <MapPin color="whitesmoke" outlineColor="white" />
            </MapLibreGL.PointAnnotation>
          )}
          {/* <MapLibreGL.Camera
            zoomLevel={10}
            centerCoordinate={[props.lngLat?.lng, props.lngLat?.lat]}
          /> */}
        </MapLibreGL.MapView>
      )}
    </YStack>
  )
}
