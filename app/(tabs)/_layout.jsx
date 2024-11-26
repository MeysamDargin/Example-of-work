import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Colors } from '@/constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


const TabLayout = () => {
  return (
    <Tabs screenOptions={{
      headerShown:false,
      tabBarActiveTintColor:Colors.Primary
    }}>
        <Tabs.Screen options={{
          tabBarLabel:"My Trip",
          tabBarIcon:({color})=><Ionicons name="location-sharp"
          size={24} color={color} />
        }} name='mytrip'/>
        <Tabs.Screen options={{
          tabBarLabel:"Discover",
          tabBarIcon:({color})=><Ionicons name="globe-sharp"
          size={24} color={color} />
        }} name='discover'/>
        <Tabs.Screen options={{
          tabBarLabel:"Profile",
          tabBarIcon:({color})=><FontAwesome6 name="circle-user" 
          size={24} color={color} />
        }} name='profile'/>
    </Tabs>
  )
}

export default TabLayout