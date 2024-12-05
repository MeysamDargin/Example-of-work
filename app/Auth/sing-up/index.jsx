import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors.ts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/configs/FirebaseConfig";

const SingUp = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [fullName, setFullName] = useState();

  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const OnCreateAccount = () => {
    if (!email || !password || !fullName) {
      ToastAndroid.show("Please enter all details!", ToastAndroid.LONG);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // کاربر ثبت‌نام شد
        const user = userCredential.user;

        // به‌روزرسانی پروفایل کاربر
        updateProfile(user, {
          displayName: fullName,
        })
          .then(() => {
            // نمایش موفقیت
            console.log("Profile updated successfully:", user);
            router.replace("/mytrip");
          })
          .catch((error) => {
            console.error("Error updating profile:", error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage, errorCode);
        ToastAndroid.show("Error creating account. Please try again!", ToastAndroid.LONG);
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
        Create New Account
      </Text>

      {/* Fullname */}
      <View style={{ marginTop: 50 }}>
        <Text style={{ fontFamily: "Outfit" }}>Fullname</Text>
        <TextInput
          onChangeText={(value) => setFullName(value)}
          style={styles.input}
          placeholder="Enter Fullname"
        />
      </View>

      {/* Email */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontFamily: "Outfit" }}>Email</Text>
        <TextInput
          onChangeText={(value) => setEmail(value)}
          style={styles.input}
          placeholder="Enter Email"
        />
      </View>

      {/* Password */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontFamily: "Outfit" }}>Password</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          onChangeText={(value) => setPassword(value)}
          placeholder="Enter Password"
        />
      </View>

      {/* Create Account */}
      <TouchableOpacity
        onPress={OnCreateAccount}
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

      {/* Sign In */}
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
          Sign In
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
