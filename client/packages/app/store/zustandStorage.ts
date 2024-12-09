import AsyncStorage from '@react-native-async-storage/async-storage'
import { StateStorage } from 'zustand/middleware'

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return AsyncStorage.setItem(name, value)
  },
  getItem: (name) => {
    return AsyncStorage.getItem(name)
  },
  removeItem: (name) => {
    return AsyncStorage.removeItem(name)
  },
}
