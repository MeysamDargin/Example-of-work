import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors.ts'
import { useRouter } from 'expo-router'

const Login = () => {
  router=useRouter();
  return (
    <View>
      <Image style={{
        width:'100%',
        height:500,
      }} source={require('@/assets/images/1916750_258454-P55ZPH-322.jpg')} />

      <View style={styles.container}>
        <Text style={{
            fontFamily:"Outfit-Bold",
            fontSize:28,
            textAlign:"center",
            marginTop:10
        }}>AI Travel Planner</Text>

        <Text style={{
            fontFamily:"Outfit",
            fontSize:17,
            textAlign:"center",
            color:Colors.Gray,
            marginTop:20
        }}>Discover your next adventure effortlessly. Personalized itineraries at your fingertips. Travel smarter with AI-driven insights.</Text>
      
      <TouchableOpacity onPress={()=> router.push('Auth/sing-in')} style={styles.btn}>
        <Text style={{
            color:Colors.White,
            textAlign:"center",
            fontFamily:"Outfit-Bold",
            fontSize:17
        }}>Sing In With Google</Text>
      </TouchableOpacity>
      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        backgroundColor:Colors.White,
        marginTop:-30,
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        height:'100%',
        padding:15
    },
    btn: {
        padding:15,
        backgroundColor:Colors.Primary,
        borderRadius:99,
        marginTop:'25%'
    }
})