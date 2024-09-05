# Prestige

## Tooling

Standing on the shoulders of giants as per usual.

This app uses (or more like will eventually use)

- [React Native](https://reactnative.dev/)
- [Expo ✨](https://expo.dev/)
- [Protomaps](https://protomaps.com/)
- Unintentional [Next.Js](https://nextjs.org/)
- [Tamagui](https://tamagui.dev/)
  - and their [free starter](https://github.com/tamagui/starter-free)
- [RabbitMQ](https://www.rabbitmq.com/)
- Golang
  - [Gin](https://gin-gonic.com/)
- [Supabase](https://supabase.com/)
  - Supabase Edge Functions

## Dev notes

Helpful notes, for fresh eyes and for local development.

### Edge Functions

I'm using Supabase Edge Functions for serving up the map. Cached results, edge response times, and cheeeaaaaap.

#### Helpful CLI Commands

Deploy an edge function
`supabase functions deploy get-private-asset --project-ref`

### Protomaps Tiles

Protomaps comes with a pretty cool CLI. Makes life, map updates, and downloads easy.

#### Helpful CLI Commands

Show file details for a map bundle.
`pmtiles show https://build.protomaps.com/20230925.pmtiles`

Download a bundle using specified bounding boxes
`pmtiles.exe  extract https://build.protomaps.com/20240812.pmtiles my_area.pmtiles --bbox=-99.986572,31.212801,-79.365234,42.179688 --bbox=-99.986572,31.212801,-79.365234,42.179688`

[Thank you Bbox Finder](https://github.com/aaronr/bboxfinder.com)
Testing (and probably production) bounding box - [Link](http://bboxfinder.com/#31.212801,-99.986572,42.179688,-79.365234)
