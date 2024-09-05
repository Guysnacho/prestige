import { useEffect, useState } from 'react'
import { Protocol } from 'pmtiles'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { default as layers } from 'protomaps-themes-base'
import { H2, YStack, createSelectItemParentScope } from '@my/ui'
import { Map } from 'react-map-gl'

export const MapBox = () => {
  useEffect(() => {
    let protocol = new Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)

    return () => {
      maplibregl.removeProtocol('pmtiles')
    }
  })
  return (
    <YStack>
      <H2>Map Demo</H2>
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
        // @ts-expect-error Awkard typing BUT RENDERS
        mapLib={maplibregl}
      ></Map>
    </YStack>
  )
}
