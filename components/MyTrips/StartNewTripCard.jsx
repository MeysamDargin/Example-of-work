import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from "@/constants/Colors";
import { useRouter } from 'expo-router';


export default function StartNewTripCard() {

  const router = useRouter();

  return (
    <View style={{
        padding:20,
        paddingTop:50,
        display:"flex",
        alignItems:"center",
        gap:25
    }}>
      
      <Ionicons name="location-sharp" size={30} color="black" />

       <Text style={{
        fontFamily:"Outfit-Medium",
        fontSize:25,
       }}>
        No trips planned yet
       </Text>

       <Text style={{
        fontFamily:"Outfit",
        fontSize:25,
        textAlign:"center",
        color:Colors.Gray
       }}>
        Looks like its time to plan a
        new travel experinece! Get
        Started below
       </Text>

       <TouchableOpacity onPress={()=> router.push('/create-trip/search-place')} style={{
        padding:15,
        backgroundColor:Colors.Primary,
        borderRadius:15,
        paddingHorizontal:30
       }}>
        <Text style={{
            fontFamily:"Outfit-Bold",
            color:Colors.White,
            fontSize:17
        }}>Start a New trip</Text>
       </TouchableOpacity>
    </View>
  )
}
