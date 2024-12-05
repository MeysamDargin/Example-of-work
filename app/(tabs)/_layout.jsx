import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000",
      }}
    >
      <Tabs.Screen
        options={{
          tabBarLabel: "My Trip",
          tabBarIcon: ({ color }) => (
            <Image
              style={{ width: 25, height: 25 }}
              source={require("@/assets/images/pin.png")}
            />
          ),
        }}
        name="mytrip"
      />
      <Tabs.Screen
        options={{
          tabBarLabel: "Discover",
          tabBarIcon: ({ color }) => (
            <Image
              style={{ width: 25, height: 25 }}
              source={require("@/assets/images/compass.png")}
            />
          ),
        }}
        name="discover"
      />
      <Tabs.Screen
        options={{
          tabBarLabel: "Flights",
          tabBarIcon: ({ color }) => (
            <Image
              style={{ width: 33, height: 33 }}
              source={require("@/assets/images/plane.png")}
            />
          ),
        }}
        name="flights"
      />
      <Tabs.Screen
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => (
            <FontAwesome6 name="circle-user" size={24} color={"#000"} />
          ),
        }}
        name="profile"
      />
    </Tabs>
  );
};

export default TabLayout;
