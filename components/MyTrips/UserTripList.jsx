import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import { Colors } from "@/constants/Colors";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/configs/FirebaseConfig";
import UserTripCard from "./UserTripCard";
import { useRouter } from "expo-router";
import LottieView from 'lottie-react-native';

export default function UserTripList({ userTrips }) {
  const router = useRouter();
  const [closestTrip, setClosestTrip] = useState(null);

  useEffect(() => {
    const currentDate = moment();

    // Filter and sort trips
    const filteredTrips = userTrips
      .filter((trip) => {
        const tripData = JSON.parse(trip.TripData);
        const endDate = moment(tripData.EndDate);

        // Update status if the trip has ended
        if (currentDate.isAfter(endDate)) {
          updateTripStatus(trip.Docid, false);
          return false; // Exclude trip
        }

        return trip.status; // Include only active trips
      })
      .sort((a, b) => {
        const tripA = JSON.parse(a.TripData);
        const tripB = JSON.parse(b.TripData);
        return moment(tripA.StartDate) - moment(tripB.StartDate);
      });

    // Set the closest trip
    if (filteredTrips.length > 0) {
      setClosestTrip(filteredTrips[0]);
    } else {
      setClosestTrip(null);
    }
  }, [userTrips]);

  const updateTripStatus = async (docId, status) => {
    const tripRef = doc(db, "UserTrips", docId);
    await updateDoc(tripRef, { status });
  };

  if (!closestTrip) {
    return (
      <View style={{
        marginTop:'50%',
        alignItems:"center",
        justifyContent:"center",
      }}>
        <LottieView
        source={require('@/assets/images/sad1.json')} // مسیر انیمیشن Lottie
        autoPlay
        loop
        style={{width: 150,
          height: 150,

        }}
      />
        <Text style={{
          fontFamily:"Outfit-Medium",
          textAlign:"center"
        }}>No active trips available</Text>
      </View>
    );
  }

  const tripData = JSON.parse(closestTrip.TripData);

  return (
    <ScrollView>
      <View style={{ marginTop: 25 }}>
        <Image
          style={{
            width: "100%",
            height: 240,
            objectFit: "cover",
            borderRadius: 15,
          }}
          source={{ uri: closestTrip.image }}
        />
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontFamily: "Outfit-Medium", fontSize: 20 }}>
            {closestTrip.tripPlan?.tripDetails?.destination}
          </Text>
          <View style={{ gap: 15, display: "flex", flexDirection: "row" }}>
            <Text
              style={{ fontFamily: "Outfit", fontSize: 17, color: Colors.Gray }}
            >
              {moment(tripData.StartDate).format("DD MMM yyyy")}
            </Text>
            <Text
              style={{ fontFamily: "Outfit", fontSize: 17, color: Colors.Gray }}
            >
              🚌 {closestTrip.tripPlan?.tripDetails?.travelers}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/trip-details",
              params: { trip: JSON.stringify(closestTrip) },
            })
          }
          style={{
            backgroundColor: Colors.Primary,
            padding: 15,
            borderRadius: 15,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              color: Colors.White,
              textAlign: "center",
              fontFamily: "Outfit-Bold",
              fontSize: 15,
            }}
          >
            See your plan
          </Text>
        </TouchableOpacity>
      </View>
      {userTrips.map((trip, index) => (
        <UserTripCard trip={trip} key={index} />
      ))}
    </ScrollView>
  );
}
