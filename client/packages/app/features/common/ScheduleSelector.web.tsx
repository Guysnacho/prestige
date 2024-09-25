import { Dispatch, SetStateAction } from 'react'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

const ONE_HOUR = 1 * 1000 * 60 * 60

export const ScheduleSelector = ({
  pickupTime,
  minimumDate,
  setPickupTime,
}: {
  pickupTime: Date | null | undefined
  minimumDate: Date
  setPickupTime: Dispatch<SetStateAction<Date | null | undefined>>
}) => {
  return minimumDate ? (
    <DatePicker
      selected={pickupTime}
      minTime={minimumDate!}
      minDate={new Date()}
      showTimeInput
      title="When is your Trip?"
      showYearPicker={false}
      showPreviousMonths={false}
      timeCaption="Pickup Time"
      onChange={(date) => setPickupTime(date)}
    />
  ) : undefined
}
