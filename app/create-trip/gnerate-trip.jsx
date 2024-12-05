import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import LottieView from "lottie-react-native";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { CreateTripContext } from "@/context/CreateTripContext";
import { AI_PROMPT } from "../../constants/Options";
import { chatSession } from "../../configs/AiModel";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/configs/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GenerateTrip() {
  const { TripData, setTripData } = useContext(CreateTripContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); // مدیریت خطا
  const [user, setUser] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await AsyncStorage.setItem("user", JSON.stringify(currentUser));
        setUser(currentUser);
      } else {
        await AsyncStorage.removeItem("user");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (TripData && user && !hasGenerated) {
      GenerateAiTrip();
    }
  }, [TripData, user, hasGenerated]);

  const sanitizeResponse = (response) => {
    return response.replace(/[^a-zA-Z0-9{}:,"[\].\- ]/g, "");
  };

  const validateJSON = (response) => {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("Invalid JSON:", error);
      return null;
    }
  };

  const GenerateAiTrip = async () => {
    setLoading(true);
    setError(false); // بازنشانی خطا
    setHasGenerated(true);
    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      TripData?.location?.address || "Unknown Location"
    )
      .replace("{totalDay}", TripData?.totalNoOfDays || 1)
      .replace("{totalNight}", (TripData?.totalNoOfDays || 1) - 1)
      .replace("{Budget}", TripData?.Budget || "No Budget Provided")
      .replace("{traveler}", TripData?.traveler?.title || "Traveler");

    console.log(FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);

      const sanitizedResponse = sanitizeResponse(result.response.text());
      const tripResp = validateJSON(sanitizedResponse);

      if (!tripResp) {
        throw new Error("Trip response is not a valid JSON.");
      }

      const Docid = Date.now().toString();
      await setDoc(doc(db, "UserTrips", Docid), {
        userEmail: user.email,
        tripPlan: tripResp,
        TripData: JSON.stringify(TripData),
        image: TripData.image,
        Docid: Docid,
        status: true,
      });

      router.push("(tabs)/mytrip");
    } catch (error) {
      console.error("Error generating trip:", error);
      setError(true); // تنظیم خطا
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {loading && (
        <>
          <Text style={styles.title}>Please Wait...</Text>
          <Text style={styles.subtitle}>
            We are working to Generate Your dream trip
          </Text>
          <LottieView
            source={require("@/assets/images/Animation.json")}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.note}>Do not Go Back</Text>
        </>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Something went wrong. Please try again.
          </Text>
          <Button title="Try Again" onPress={GenerateAiTrip} color={Colors.Primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingTop: 75,
    backgroundColor: Colors.White,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Outfit-Bold",
    fontSize: 35,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Outfit-Medium",
    fontSize: 20,
    marginTop: 40,
    textAlign: "center",
  },
  animation: {
    width: 300,
    height: 300,
  },
  note: {
    fontFamily: "Outfit-Medium",
    textAlign: "center",
    color: Colors.Gray,
    fontSize: 20,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontFamily: "Outfit-Medium",
    textAlign: "center",
    color: Colors.Red,
    fontSize: 18,
    marginBottom: 20,
  },
});
