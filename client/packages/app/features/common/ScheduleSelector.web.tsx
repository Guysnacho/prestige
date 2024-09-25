import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

const ONE_HOUR = 1 * 1000 * 60 * 60
const ONE_MINUTE = 1 * 1000 * 60

export const ScheduleSelector = ({}) => {
  const [pickupTime, setPickupTime] = useState<Date | null>()
  const [minTime, setMinTime] = useState<Date>(new Date())

  useEffect(() => {
    const min = new Date()
    min.setTime(min.getTime() + ONE_HOUR)
    setMinTime(min)
    setPickupTime(min)
  }, [])

  return minTime ? (
    <DatePicker
      selected={pickupTime}
      minTime={minTime!}
      minDate={new Date()}
      showTimeInput
      showYearPicker={false}
      showPreviousMonths={false}
      timeCaption="Pickup Time"
      onChange={(date) => setPickupTime(date)}
    />
  ) : undefined
}
