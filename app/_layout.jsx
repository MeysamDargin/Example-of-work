import {Stack} from "expo-router"
import {useFonts} from "expo-font"
import {CreateTripContext} from '@/context/CreateTripContext'
import { useState } from "react"
const Rootlayout = () => {
  useFonts({
    'Outfit':require('@/assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Medium':require('@/assets/fonts/Outfit-Medium.ttf'),
    'Outfit-Bold':require('@/assets/fonts/Outfit-Bold.ttf'),
  })

  const [TripData, setTripData] = useState([]);
  
  return (
    <CreateTripContext.Provider value={{TripData, setTripData}}>
    <Stack>
      <Stack.Screen options={{
        headerShown:false
      }} name="index" />

      <Stack.Screen options={{
        headerShown:false
      }} name="(tabs)" />
    </Stack>
    </CreateTripContext.Provider>
  )
}

export default Rootlayout