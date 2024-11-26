import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { Linking } from "react-native";

export default function FlightInfo({ FlightData }) {
  const openWebsite = () => {
    const url = "https://www.google.com/flights"; // لینک وبسایت
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <View style={{
        marginTop:20,
        borderWidth:1,
        padding:10,
        borderRadius:15,
    }}>
      <View style={{display:"flex",flexDirection:"row",alignItems:"flex-end",justifyContent:"space-between"}}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image
            style={{
              width: 40,
              height: 40,
            }}
            source={require("@/assets/images/airport.png")}
          />
          <Text
            style={{
              fontFamily: "Outfit-Bold",
              fontSize: 20,
              marginTop: 15,
            }}
          >
            Flights
          </Text>
        </View>
        <View>
          {/* دکمه باز کردن وبسایت */}
          <TouchableOpacity style={styles.button} onPress={openWebsite}>
            <Text style={styles.buttonText}>Book hare</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ gap: 5, marginTop: 10 }}>
        <Text
          style={{
            fontFamily: "Outfit",
            fontSize: 17,
          }}
        >
          destination: {FlightData.sampleFlight.destination}
        </Text>
        <Text
          style={{
            fontFamily: "Outfit",
            fontSize: 17,
          }}
        >
          estimatedPrice: {FlightData.sampleFlight.estimatedPrice}
        </Text>
        <Text
          style={{
            fontFamily: "Outfit",
            fontSize: 17,
          }}
        >
          note: {FlightData.sampleFlight.note}
        </Text>
        <Text
          style={{
            fontFamily: "Outfit",
            fontSize: 17,
          }}
        >
          origin: {FlightData.sampleFlight.origin}
        </Text>
      </View>
      {/* انیمیشن بالا */}
      <View style={{ alignItems: "flex-end", marginTop: -15 }}>
        <LottieView
          source={require("@/assets/images/sdfsd.json")} // مسیر انیمیشن Lottie
          autoPlay
          loop
          style={{ width: 60, height: 60 }}
        />
      </View>

      {/* اطلاعات پرواز */}
      <View style={styles.infoContainer}>
        <Text style={styles.flightDetails}>{FlightData.details}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: "#d3d3d3",
    padding: 20,
    borderRadius: 15,
  },
  flightDetails: {
    textAlign: "center",
    fontFamily: "Outfit-Medium",
    fontSize: 15,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center", // مرکزیت در صفحه
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Outfit-Bold",
    fontSize: 13,
    textAlign: "center",
  },
});
