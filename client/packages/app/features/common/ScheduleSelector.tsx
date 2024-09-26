import { Button, Paragraph, YStack } from '@my/ui'
import RNDateTimePicker, {
  AndroidNativeProps,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker'
import { Dispatch, SetStateAction, useState } from 'react'
import { Platform } from 'react-native'

export const ScheduleSelector = ({
  pickupTime,
  minimumDate,
  setPickupTime,
}: {
  pickupTime: Date | null | undefined
  minimumDate: Date
  setPickupTime: Dispatch<SetStateAction<Date | null | undefined>>
}) => {
  const [mode, setMode] = useState<AndroidNativeProps['mode'] | undefined>('date')
  const [show, setShow] = useState(false)

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
      {show && Platform.OS !== 'android' && minimumDate && (
        <>
          <Paragraph>selected: {pickupTime?.toLocaleString()}</Paragraph>
          <RNDateTimePicker
            testID="dateTimePicker"
            value={pickupTime!}
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
