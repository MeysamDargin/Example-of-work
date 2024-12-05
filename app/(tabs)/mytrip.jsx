import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import StartNewTripCard from "@/components/MyTrips/StartNewTripCard";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "@/configs/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import LottieView from "lottie-react-native";
import UserTripList from "../../components/MyTrips/UserTripList";
import { Redirect, useRouter } from "expo-router";
import * as Updates from "expo-updates";

const MyTrip = () => {
  const [user, setUser] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true); // For user authentication state
  const [loadingTrips, setLoadingTrips] = useState(false); // For trips data loading
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0); // Percent progress of update download
  const router = useRouter();

  // Check user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false); // Authentication check completed
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  // Check for updates when the component mounts
  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          setIsUpdateAvailable(true);
        }
      } catch (error) {
        console.error("Error checking for update:", error);
      }
    }

    checkForUpdates(); // Check for update on component mount
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

  // Handle update download and reload
  const handleUpdate = async () => {
    if (!isUpdateAvailable) return;

    try {
      setIsUpdating(true);

      // Download the update
      await Updates.fetchUpdateAsync({
        onDownloadProgress: (progress) => {
          setUpdateProgress(Math.round((progress.totalBytesWritten / progress.totalBytesExpectedToWrite) * 100));
        },
      });

      // Reload the app after downloading the update
      await Updates.reloadAsync();
    } catch (error) {
      console.error("Error during update:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: Colors.White,
        height: "100%",
      }}
    >
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
          <TouchableOpacity
            onPress={() => router.push("/create-trip/search-place")}
          >
            <Ionicons name="add-circle" size={50} color="black" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loadingUser ? (
          <Text style={{fontFamily:"Outfit-Bold"}}>Checking user authentication...</Text>
        ) : !user ? (
          <Redirect href="/" />
        ) : loadingTrips ? (
          <View style={{ alignItems: "center", marginTop: "50%" }}>
            <LottieView
              source={require("@/assets/images/awf.json")} // مسیر انیمیشن Lottie
              autoPlay
              loop
              style={{ width: 90, height: 90 }}
            />
          </View>
        ) : userTrips.length === 0 ? (
          <StartNewTripCard />
        ) : (
          <View>
            <UserTripList userTrips={userTrips} />
          </View>
        )}

        {/* Update Section */}
        {isUpdateAvailable && !isUpdating ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{fontFamily:"Outfit-Bold"}}>New update available!</Text>
            <TouchableOpacity onPress={handleUpdate}>
              <View
                style={{
                  backgroundColor: Colors.Primary,
                  padding: 10,
                  borderRadius: 5,
                  marginTop: 10,
                }}
              >
                <Text style={{ color: Colors.White, fontFamily:"Outfit-Bold" }}>Download Update</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : isUpdating ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{fontFamily:"Outfit-Bold"}}>Downloading update...</Text>
            <Text>{updateProgress}%</Text>
          </View>
        ) : null}
      </ScrollView>
    </ScrollView>
  );
};

export default MyTrip;
