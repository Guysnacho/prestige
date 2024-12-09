import { RadarAddress } from 'react-native-radar'
import { create } from 'zustand'

export interface RouteState {
  pickup: RadarAddress | undefined
  destination: RadarAddress | undefined
  pickupTime: Date | null
  setPickup: (addy: RadarAddress) => void
  setDestination: (addy: RadarAddress) => void
  setPickupTime: (pickupTime: Date | undefined) => void
  clear: () => void
}

/**
 * Navigation Routing State
 *
 * @example
 * // This is how we use the user store
 * const store = useStore(useUserStore, (store) => store);
 */
export const useRouterStore = create<RouteState>((set, get) => ({
  pickupTime: null,
  pickup: undefined,
  destination: undefined,
  setPickupTime: (pickupTime) => set({ pickupTime }),
  setPickup: (pickup) => set({ pickup }),
  setDestination: (destination) => set({ destination }),
  clear: () => set({ pickupTime: null, pickup: undefined, destination: undefined }),
}))
