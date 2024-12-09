import { useRouterStore, useStore } from '@my/app/store'
import { Button, H6, Paragraph, useToastController, YStack } from '@my/ui'
import { Dispatch, SetStateAction, useState } from 'react'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

export const ScheduleSelector = ({ setPage }: { setPage: Dispatch<SetStateAction<number>> }) => {
  const toast = useToastController()
  const [minimumDate, _] = useState<Date>(new Date())

  const store = useStore(useRouterStore, (store) => store)
  const isInvalid =
    !store?.pickupTime || minimumDate.toISOString() > store?.pickupTime!.toISOString()

  const onChange = (currentDate) => {
    store?.setPickupTime(currentDate)
    if (minimumDate.toISOString() > currentDate.toISOString()) {
      toast.show(
        `Make sure you schedule a trip after ${minimumDate.toDateString()} ${minimumDate.toLocaleTimeString()}`
      )
    }
  }

  return (
    <YStack gap="$5">
      <H6 textAlign="center">Pickup Date</H6>
      <Paragraph>{`${store?.pickupTime?.toLocaleString() || 'unset'}`}</Paragraph>
      <Paragraph>
        selected:{' '}
        {
          <DatePicker
            selected={store?.pickupTime || minimumDate}
            minTime={minimumDate!}
            minDate={new Date()}
            showTimeInput
            title="When is your Trip?"
            showYearPicker={false}
            showPreviousMonths={false}
            timeCaption="Pickup Time"
            onChange={onChange}
          />
        }
      </Paragraph>

      <Button
        disabled={isInvalid}
        variant={isInvalid ? 'outlined' : undefined}
        onPress={() => setPage(2)}
      >
        Confirm
      </Button>
    </YStack>
  )
}
