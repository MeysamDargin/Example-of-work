import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from '@/components/Login';
import { auth } from "@/configs/FirebaseConfig";
import { Redirect } from "expo-router";

const Index = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
              AsyncStorage.setItem('user', JSON.stringify(authUser));
              setUser(authUser);
            }
            setLoading(false);
          });
          return () => unsubscribe();
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking user session:", error);
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      {user ? (
        <>
          <Redirect href={'/mytrip'} />
        </>
      ) : (
        <Login />
      )}
    </View>
  );
}

export default Index;
