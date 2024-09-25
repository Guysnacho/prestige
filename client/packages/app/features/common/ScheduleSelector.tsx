import { Button, Paragraph, YStack } from '@my/ui'
import RNDateTimePicker, {
  DateTimePickerAndroid,
  AndroidNativeProps,
} from '@react-native-community/datetimepicker'
import { useEffect, useState } from 'react'
import { Platform } from 'react-native'

const ONE_HOUR = 1 * 1000 * 60 * 60
const ONE_MINUTE = 1 * 1000 * 60

export const ScheduleSelector = ({}) => {
  const [pickupTime, setPickupTime] = useState<Date | null>()
  const [minimumDate, setMinDate] = useState<Date>(new Date())

  const [mode, setMode] = useState<AndroidNativeProps['mode'] | undefined>('date')
  const [show, setShow] = useState(false)

  useEffect(() => {
    const min = new Date()
    min.setTime(min.getTime() + ONE_HOUR)
    setMinDate(min)
    setPickupTime(min)
  }, [])

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate
    setShow(false)
    setPickupTime(currentDate)
  }

  const showMode = (currentMode) => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: pickupTime!,
        onChange,
        mode: currentMode,
        is24Hour: true,
        minimumDate,
      })
    } else {
      setShow(true)
      setMode(currentMode)
    }
  }

  const showDatepicker = () => {
    showMode('date')
  }

  const showTimepicker = () => {
    showMode('time')
  }

  return (
    <YStack>
      <Button onPress={showDatepicker} title="Show date picker!" />
      <Button onPress={showTimepicker} title="Show time picker!" />
      {show && Platform.OS !== 'android' && pickupTime && (
        <>
          <Paragraph>selected: {pickupTime.toLocaleString()}</Paragraph>
          <RNDateTimePicker
            testID="dateTimePicker"
            value={pickupTime}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
            minimumDate={minimumDate}
          />
        </>
      )}
    </YStack>
  )
}
