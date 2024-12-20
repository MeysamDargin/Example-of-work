import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import moment from 'moment/moment';
import { Colors } from "@/constants/Colors";
import { doc, updateDoc } from "firebase/firestore"; 
import { db } from "@/configs/FirebaseConfig";
import { useRouter } from 'expo-router'; // برای ناوبری

export default function UserTripCard({ trip }) {
  const [expanded, setExpanded] = useState(false);
  const [isActive, setIsActive] = useState(trip.status);
  const router = useRouter(); // برای ناوبری به صفحه دیگر

  const FormatData = (data) => JSON.parse(data);

  useEffect(() => {
    // Check and update trip status if it's past the end date
    const currentDate = moment();
    const tripData = FormatData(trip.TripData);
    const endDate = moment(tripData.EndDate);

    if (currentDate.isAfter(endDate)) {
      updateTripStatus(trip.Docid, false);
      setIsActive(false);
    }
  }, [trip]);

  const updateTripStatus = async (docId, status) => {
    const tripRef = doc(db, "UserTrips", docId);
    await updateDoc(tripRef, { status });
  };

  const tripData = FormatData(trip.TripData);

  return isActive ? (
    <View style={{ marginTop: 20, display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
      <Image style={{ width: 100, height: 110, borderRadius: 15 }} source={{ uri: trip.image }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: "Outfit-Medium", fontSize: 18, flexWrap: 'wrap', maxWidth: '90%'}}>
          {trip?.tripPlan?.tripDetails?.destination}
        </Text>
        <Text style={{ fontFamily: "Outfit", fontSize: 14, color: Colors.Gray }}>
          {moment(tripData.StartDate).format('DD MMM yyyy')}
        </Text>
        <Text style={{ fontFamily: "Outfit", fontSize: 14, color: Colors.Gray }}>
          Traveling: {tripData.traveler.title}
        </Text>
        {trip?.tripPlan?.tripDetails?.description && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={{ color: Colors.Blue }}>
              {expanded ? trip?.tripPlan?.tripDetails?.description : `${trip?.tripPlan?.tripDetails?.description.substring(0, 100)}...`}
            </Text>
          </TouchableOpacity>
        )}
        {/* دکمه مشاهده */}
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/trip-details",
              params: { trip: JSON.stringify(trip) }, // ارسال اطلاعات سفر به صفحه جزئیات
            })
          }
          style={{
            backgroundColor: Colors.Primary,
            padding: 10,
            borderRadius: 10,
            alignSelf: 'flex-end',
            marginTop: 10,
          }}
        >
          <Text style={{ color: Colors.White, fontFamily: "Outfit-Bold", fontSize: 14 }}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : null;
}
