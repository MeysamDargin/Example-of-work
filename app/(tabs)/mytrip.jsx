import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import StartNewTripCard from "@/components/MyTrips/StartNewTripCard";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "@/configs/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import LottieView from 'lottie-react-native';
import UserTripList from "../../components/MyTrips/UserTripList";
import { useRouter } from "expo-router";


const MyTrip = () => {
  const [user, setUser] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true); // For user authentication state
  const [loadingTrips, setLoadingTrips] = useState(false); // For trips data loading
  const router = useRouter();
  // Check user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false); // Authentication check completed
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  // Fetch trips when user is authenticated
  useEffect(() => {
    if (user && user.email) {
      GetMyTrips();
    }
  }, [user]);

  const GetMyTrips = async () => {
    setLoadingTrips(true);

    try {
      const q = query(
        collection(db, "UserTrips"),
        where("userEmail", "==", user.email) // Ensure user.email exists
      );
      const querySnapshot = await getDocs(q);

      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push(doc.data());
      });

      setUserTrips(trips); // Update trips state
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoadingTrips(false);
    }
  };

  return (
    <ScrollView
    showsVerticalScrollIndicator={false}
      style={{
        padding: 25,
        paddingTop: 25,
        backgroundColor: Colors.White,
        height: "100%",
      }}
    >
      {/* Header */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: 1,
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontFamily: "Outfit-Bold",
            fontSize: 35,
          }}
        >
          My Trips
        </Text>
        <TouchableOpacity onPress={()=> router.push('/create-trip/search-place')}>
        <Ionicons name="add-circle" size={50} color="black" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loadingUser ? (
        <Text>Checking user authentication...</Text>
      ) : !user ? (
        <Text>User not logged in. Please log in to see your trips.</Text>
      ) : loadingTrips ? (
        <View style={{alignItems:"center",marginTop:'50%'}}><LottieView
        source={require('@/assets/images/awf.json')} // مسیر انیمیشن Lottie
        autoPlay
        loop
        style={{width: 90,
          height: 90,}}
      /></View>
      ) : userTrips.length === 3 ? (
        <StartNewTripCard />
      ) : (
        <View>
          {/* <View style={{display:"flex",flexDirection:"row",paddingTop:20,marginLeft:-10,
        alignItems:"center"}}>
            <LottieView
          source={require('@/assets/images/sefsfe.json')} // مسیر انیمیشن Lottie
          autoPlay
          loop
          style={{width: 50,
            height: 50,}}
        /><Text style={{
          fontSize:20,
          fontFamily:"Outfit-Bold",
          paddingTop:15
        }}>Trips: {userTrips.length}</Text>
          </View> */}
          
          <View>
            <UserTripList userTrips={userTrips} />
          </View>
        </View>
        
        
      )}
    </ScrollView>
  );
};

export default MyTrip;
