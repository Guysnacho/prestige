import MapLibreGL from '@maplibre/maplibre-react-native'
import { H2, YStack, YStackProps } from '@my/ui'
import { MapPin } from '@tamagui/lucide-icons'
import { PMTiles, Protocol } from 'pmtiles'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { LngLat } from 'react-map-gl'

export const MapBox = (
  props: {
    setLnglat: Dispatch<SetStateAction<LngLat | undefined>>
    lngLat: LngLat | undefined
    label?: string
  } & YStackProps
) => {
  const [style, setStyle] = useState<any>({})
  const [mounted, setMounted] = useState(false)
  let protocol = new Protocol()
  let pmtiles = new PMTiles(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/map/my_area.pmtiles`
  )
  useEffect(() => {
    MapLibreGL.setAccessToken(null)
    setMounted(true)
  }, [])
  // useEffect(() => {
  //   console.log(layers('protomaps', 'dark'))
  //   // maplibregl.addProtocol('pmtiles', protocol.tile)
  //   return () => {
  //     // maplibregl.removeProtocol('pmtiles')
  //   }
  // })
  return (
    <YStack {...props}>
      <H2>{props?.label ? props?.label : 'Map Demo'}</H2>
      {mounted && (
        <MapLibreGL.MapView
          style={{
            flex: 1,
            alignSelf: 'stretch',
          }}
          styleURL={`${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/static/styles.json`}
        >
          {/* <MapLibreGL.VectorSource
            id="protomaps"
            attribution='<a href="https://github.com/protomaps/basemaps">Protomaps</a> C <a href="https://openstreetmap.org">OpenStreetMap</a>'
            url={`${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/static/styles.json`}
          />
          <MapLibreGL.Style
            json={`${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/static/styles.json`}
          /> */}
          {/* <MapLibreGL.MarkerView allowOverlap anchor={} /> */}
          <MapLibreGL.PointAnnotation coordinate={[0, 0]} id="PickUp-Pin">
            <MapPin />
          </MapLibreGL.PointAnnotation>
        </MapLibreGL.MapView>
      )}
      {/* <Map
        style={{ width: 600, height: 400 }}
        mapStyle={{
          version: 8,
          glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
          sources: {
            protomaps: {
              attribution: `<a href="https://github.com/protomaps/basemaps">Protomaps</a> C <a href="https://openstreetmap.org">OpenStreetMap</a>`,
              type: 'vector',
              url: `pmtiles://${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/map/my_area.pmtiles`,
            },
          },
          // @ts-expect-error Awkard typing on protomap use
          layers: layers('protomaps', 'dark'),
        }}
        // @ts-expect-error Awkard typing BUT RENDERS
        mapLib={maplibregl}
        onClick={(e) => {
          props?.setLnglat(e.lngLat)
        }}
      >
        {props?.lngLat ? (
          <Marker
            draggable
            longitude={props?.lngLat?.lng}
            latitude={props?.lngLat?.lat}
            onDrag={({ lngLat }) => {
              // @ts-expect-error lnglat conversion is weird
              props?.setLnglat(lngLat)
            }}
            anchor="bottom"
          >
            <Pin color="white" />
          </Marker>
        ) : undefined}
      </Map> */}
    </YStack>
  )
}
