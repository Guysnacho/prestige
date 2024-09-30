import { Database } from '@my/app/util/schema'
import { Button, Card, H6, Paragraph, YStack } from '@my/ui'

export const TripCard = (props: {
  trip: Database['public']['Tables']['trip']['Row']
  member: Database['public']['Tables']['member']['Row'] | null
  router?: {
    push: (url: string, navigateOptions?: {}) => void
  }
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
        {props.router !== undefined ? (
          <Button mx="auto" onPress={() => props!.router!.push(`/admin/${props.trip.id}`)}>
            Confirm Ride
          </Button>
        ) : (
          <H6 mx="auto">Assign a Driver</H6>
        )}
      </Card.Footer>
    </Card>
  )
}
