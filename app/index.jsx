import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Login from "@/components/Login";
import { auth } from "@/configs/FirebaseConfig";
import { Redirect } from "expo-router";
import LottieView from "lottie-react-native";

const Index = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase authentication state changes
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false); // Stop the loading spinner
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out from Firebase
      setUser(null); // Reset user state
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <View style={{
        alignItems:"center",
        justifyContent:"center",
        marginTop:"80%"
      }}>
        <LottieView
          source={require("@/assets/images/lod.json")}
          autoPlay
          loop
          style={{ width: 90, height: 90 }}
        />
      </View>
    );
  }

  return (
    <View>
      {user ? (
        <>
          <Redirect href={"/mytrip"} />
        </>
      ) : (
        <Login />
      )}
    </View>
  );
};

export default Index;
