import { useRouterStore, useStore } from '@my/app/store'
import { Button, H6, Paragraph, YStack } from '@my/ui'
import RNDateTimePicker, {
  AndroidNativeProps,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker'
import { addHours } from 'date-fns'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Platform } from 'react-native'

export const ScheduleSelector = ({ setPage }: { setPage: Dispatch<SetStateAction<number>> }) => {
  const [mode, setMode] = useState<AndroidNativeProps['mode'] | undefined>('date')
  const [show, setShow] = useState(false)
  const [pickupTime, setPickupTime] = useState<Date | null>(new Date())
  const [minimumDate, setMinDate] = useState<Date>(new Date())

  const store = useStore(useRouterStore, (store) => store)

  useEffect(() => {
    const min = new Date()
    setMinDate(addHours(min, 1))
    setPickupTime(addHours(min, 1))
  }, [])

  const onChange = (event, selectedDate) => {
    console.debug(event)
    const currentDate = selectedDate
    setShow(false)
    if (event.type === 'set') {
      store?.setPickupTime(new Date(selectedDate))
    }
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
      <Paragraph>{`${store?.pickupTime?.toLocaleString() || 'unset'}`}</Paragraph>
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

      <Button disabled={!store?.pickupTime} onPress={() => setPage(2)}>
        Confirm
      </Button>
    </YStack>
  )
}
