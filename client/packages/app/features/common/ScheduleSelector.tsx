import { Button, H6, Paragraph, YStack } from '@my/ui'
import RNDateTimePicker, {
  AndroidNativeProps,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker'
import { Dispatch, SetStateAction, useState } from 'react'
import { Platform } from 'react-native'

export const ScheduleSelector = ({
  setPage,
  pickupTime,
  minimumDate,
  setPickupTime,
}: {
  setPage: Dispatch<SetStateAction<number>>
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
    <YStack gap="$5">
      <H6 textAlign="center">Pickup Date</H6>
      <Paragraph>{`${pickupTime?.toLocaleString()}`}</Paragraph>
      <Button onPress={showDatepicker}>Select Date</Button>
      <Button onPress={showTimepicker}>Select Time</Button>
      {show && Platform.OS !== 'android' && minimumDate && (
        <>
          <Paragraph>selected: {pickupTime?.toLocaleString()}</Paragraph>
          <RNDateTimePicker
            testID="dateTimePicker"
            value={pickupTime!}
            mode={mode}
            is24Hour={false}
            minuteInterval={15}
            onChange={onChange}
            minimumDate={minimumDate}
          />
        </>
      )}

      <Button disabled={!pickupTime} onPress={() => setPage(2)}>
        Confirm
      </Button>
    </YStack>
  )
}
