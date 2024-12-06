import 'react-native-url-polyfill/auto'
import { registerRootComponent } from 'expo'
import { ExpoRoot } from 'expo-router'
import React from 'react'

React.AnimatedComponent = ({ children }) => <>{children}</>

export function App() {
  const ctx = require.context('./app')
  return <ExpoRoot context={ctx} />
}

registerRootComponent(App)
