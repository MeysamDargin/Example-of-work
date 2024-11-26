import { View, Text, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Colors } from "@/constants/Colors";
import moment from "moment/moment";
import FlightInfo from "../../components/TripDetails/FlightInfo";
import HotelList from "../../components/TripDetails/HotelList";
import PlannedTrip from "../../components/TripDetails/PlannedTrip";

export default function TripDetails() {
  const FormatData = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  };

  const { trip } = useLocalSearchParams();
  const navigation = useNavigation();
  const [tripDetails, setTripDetails] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });

    const parsedTrip = FormatData(trip);
    if (parsedTrip) {
      setTripDetails(parsedTrip);
    } else {
      console.error("Failed to parse trip details.");
    }
  }, [trip, navigation]);

  return (
    tripDetails && (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          style={{ width: "100%", height: 330 }}
          source={{ uri: tripDetails.image }}
        />
        <View
          style={{
            padding: 15,
            backgroundColor: Colors.White,
            height: "100%",
            marginTop: -30,
            borderRadius: 30,
          }}
        >
          <Text
            style={{
              fontFamily: "Outfit-Bold",
              fontSize: 25,
            }}
          >
            {tripDetails?.tripPlan?.tripDetails?.destination}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              marginTop: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Outfit",
                fontSize: 18,
                color: Colors.Gray,
              }}
            >
              {moment(FormatData(tripDetails.TripData).StartDate).format(
                "DD MMM yy"
              )}
            </Text>
            <Text
              style={{
                fontFamily: "Outfit",
                fontSize: 18,
                color: Colors.Gray,
              }}
            >
              -{" "}
              {moment(FormatData(tripDetails.TripData).EndDate).format(
                "DD MMM yyyy"
              )}
            </Text>
          </View>
          <Text
            style={{ fontFamily: "Outfit", fontSize: 17, color: Colors.Gray }}
          >
            🚌 {FormatData(tripDetails.TripData).traveler?.title}
          </Text>

          {/* Flight info */}

          <FlightInfo FlightData={tripDetails.tripPlan.flights} />

          {/* Hotels List */}
          <HotelList hotelList={tripDetails?.tripPlan?.hotels} />
          {/* Trip Day Planner Info */}
          <PlannedTrip datails={tripDetails?.tripPlan?.itinerary} />
        </View>
      </ScrollView>
    )
  );
}
