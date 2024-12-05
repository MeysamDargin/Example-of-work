import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";

const flights = () => {
  return (
    <WebView
      style={styles.container}
      source={{ uri: "https://www.google.com/travel/flights" }}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
export default flights;
