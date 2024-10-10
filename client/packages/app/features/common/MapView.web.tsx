import { H2, YStack, YStackProps } from '@my/ui'
import { Pin } from '@tamagui/lucide-icons'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Protocol } from 'pmtiles'
import { default as layers } from 'protomaps-themes-base'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { LngLat, Map, Marker } from 'react-map-gl'

export const MapBox = (
  props: {
    setLnglat: Dispatch<SetStateAction<LngLat | undefined>>
    lngLat: LngLat | undefined
    label?: string
  } & YStackProps
) => {
  useEffect(() => {
    let protocol = new Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)

    return () => {
      maplibregl.removeProtocol('pmtiles')
    }
  })
  return (
    <YStack {...props}>
      <H2>{props?.label ? props?.label : 'Map Demo'}</H2>
      <Map
        style={{ width: 600, height: 400 }}
        mapStyle={{
          version: 8,
          glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
          sources: {
            protomaps: {
              attribution: `<a href="https://github.com/protomaps/basemaps">Protomaps</a> C <a href="https://openstreetmap.org">OpenStreetMap</a>`,
              type: 'vector',
              url: `pmtiles://${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/map/my_area.pmtiles`,
            },
          },
          // @ts-expect-error Awkard typing on protomap use
          layers: layers('protomaps', 'dark'),
        }}
        // @ts-expect-error Awkard typing on protomap use
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
      </Map>
    </YStack>
  )
}
