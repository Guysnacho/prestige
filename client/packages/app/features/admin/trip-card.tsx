import { Database } from '@my/app/util/schema'
import { Card, YStack, Paragraph } from '@my/ui'
import { Dispatch, SetStateAction } from 'react'
import { Button } from 'react-native'

export const TripCard = (props: {
  trip: Database['public']['Tables']['trip']['Row']
  member: Database['public']['Tables']['member']['Row'] | null
  select: Dispatch<SetStateAction<string>>
}) => {
  return (
    <Card py="$3" w="35rem">
      <Card.Header>
        <YStack key={props.trip.id} gap="$3" flexWrap="wrap">
          <Paragraph>Rider: {`${props.member?.fname} ${props.member?.lname}`}</Paragraph>
          <Paragraph>Status: {props.trip.status}</Paragraph>
          <YStack alignItems="flex-start">
            <Paragraph>Pickup</Paragraph>
            <Paragraph>lng: {props.trip.pickup_lng}</Paragraph>
            <Paragraph>lat: {props.trip.pickup_lat}</Paragraph>
          </YStack>
          <YStack alignItems="flex-start">
            <Paragraph>Destination</Paragraph>
            <Paragraph>lng: {props.trip.dest_lng}</Paragraph>
            <Paragraph>lat: {props.trip.dest_lat}</Paragraph>
          </YStack>
        </YStack>
      </Card.Header>
      <Card.Footer>
        <Button mx="auto" onPress={() => props.select(props.trip.id)}>
          Confirm Ride
        </Button>
      </Card.Footer>
    </Card>
  )
}
