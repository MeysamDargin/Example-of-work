import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth } from "@/configs/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const SingIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace("/mytrip");
      }
    });
    return () => unsubscribe();
  }, [navigation, router]);

  const OnSingIn = () => {
    if (!email || !password) {
      ToastAndroid.show("Please enter Email & Password", ToastAndroid.LONG);
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        router.replace("/mytrip");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === "auth/invalid-credential") {
          ToastAndroid.show("Invalid credential", ToastAndroid.LONG);
        } else {
          ToastAndroid.show(error.message, ToastAndroid.LONG);
        }
      });
  };
  
  return (
    <View
      style={{
        padding: 25,
        paddingTop: 40,
        backgroundColor: Colors.White,
        height: "100%",
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: "Outfit-Bold",
          fontSize: 30,
          marginTop: 30,
        }}
      >
        Let's Sing You In
      </Text>
      <Text
        style={{
          fontFamily: "Outfit",
          fontSize: 30,
          color: Colors.Gray,
          marginTop: 20,
        }}
      >
        Welcome Back 👋
      </Text>
      <Text
        style={{
          fontFamily: "Outfit",
          fontSize: 30,
          color: Colors.Gray,
          marginTop: 10,
        }}
      >
        You've been missed!
      </Text>

      {/* Email */}

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
          Email
        </Text>
        <TextInput
          onChangeText={(value) => setEmail(value)}
          style={styles.input}
          placeholder="Enter Email"
        />
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
          onChangeText={(value) => setPassword(value)}
          secureTextEntry={true}
          style={styles.input}
          placeholder="Enter password"
        />
      </View>

      {/* Sing In Button */}

      <TouchableOpacity
        onPress={OnSingIn}
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
          Sing In
        </Text>
      </TouchableOpacity>

      {/* Create Account */}

      <TouchableOpacity
        onPress={() => router.replace("Auth/sing-up")}
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
          Create Account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SingIn;

const styles = StyleSheet.create({
  input: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.Gray,
    fontFamily: "Outfit",
  },
});
