import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors.ts";
import Ionicons from '@expo/vector-icons/Ionicons';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/configs/FirebaseConfig'

const SingUp = () => {
  
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [Fullname, setFullname] = useState();

  const navigation = useNavigation();
  const router= useRouter();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const OnCreateAccont = ()=> {
    if (!email || !password || !Fullname) {
      ToastAndroid.show('Please enter all details!', ToastAndroid.LONG);
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    router.replace("/mytrip");
    console.log(user);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage, errorCode);
    // ..
  });
  }
  return (
    <View
      style={{
        padding: 25,
        paddingTop: 40,
        backgroundColor:Colors.White,
        height:'100%',
      }}
    >
      <TouchableOpacity onPress={()=> router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: "Outfit-Bold",
          fontSize: 30,
          marginTop:30
        }}
      >
        Create New Account
      </Text>

      {/* Fullname */}

      <View
        style={{
          marginTop: 50,
        }}
      >
        <Text
          style={{
            fontFamily: "Outfit",
          }}
        >
          Fullname
        </Text>
        <TextInput onChangeText={(value)=>setFullname(value)} style={styles.input} placeholder="Enter Fullname" />
      </View>
      {/* Email */}

      <View
        style={{
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "Outfit",
          }}
        >
          Email
        </Text>
        <TextInput onChangeText={(value)=>setEmail(value)} style={styles.input} placeholder="Enter Email" />
      </View>

      {/* password */}

      <View
        style={{
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "Outfit",
          }}
        >
          password
        </Text>
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          onChangeText={(value)=>setPassword(value)}
          placeholder="Enter password"
        />
      </View>
      {/* Create Account */}

      <TouchableOpacity
      onPress={OnCreateAccont}
        style={{
          padding: 20,
          backgroundColor: Colors.Primary,
          borderRadius: 15,
          marginTop: 50,
        }}
      >
        <Text
          style={{
            color: Colors.White,
            fontFamily: "Outfit-Bold",
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Create Account
        </Text>
      </TouchableOpacity>

      {/* Sing In */}

      <TouchableOpacity
        onPress={() => router.replace("Auth/sing-in")}
        style={{
          padding: 20,
          backgroundColor: Colors.White,
          borderRadius: 15,
          marginTop: 20,
          borderWidth: 1,
        }}
      >
        <Text
          style={{
            color: Colors.Primary,
            fontFamily: "Outfit-Bold",
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Sing In
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SingUp;

const styles = StyleSheet.create({
  input: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.Gray,
    fontFamily: "Outfit",
  },
});
