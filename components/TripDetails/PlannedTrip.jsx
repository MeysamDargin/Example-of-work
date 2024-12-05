import { View, Text, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/configs/FirebaseConfig"; // Firebase configuration

export default function PlannedTrip({ datails }) {
  const [dayImages, setDayImages] = useState({});
  const [error, setError] = useState("");

  // Fetch API keys from Firestore
  const fetchAPIKeysFromFirestore = async () => {
    try {
      const docRef = doc(db, "ApiHGF", "eorOBs1O6i7QVKt2hUxQ");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.error("No API keys document found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching API keys:", error.message);
      return null;
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      const apiKeys = await fetchAPIKeysFromFirestore();
      if (!apiKeys || !apiKeys.GOOGLE_API_KEY || !apiKeys.GOOGLE_CX) {
        setError("Google API keys not found.");
        return;
      }

      const newImages = {};
      const defaultImageUrl = "https://via.placeholder.com/150";

      for (const [day, details] of Object.entries(datails)) {
        const location = details.plan || "unknown location"; // Default to "unknown location" if no plan exists
        try {
          const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
            params: {
              key: apiKeys.GOOGLE_API_KEY,
              cx: apiKeys.GOOGLE_CX,
              q: location,
              searchType: "image",
              num: 1,
            },
          });

          const imageUrl = response.data.items?.[0]?.link || defaultImageUrl;
          newImages[day] = imageUrl;
        } catch (error) {
          console.error(`Error fetching image for ${day}:`, error.message);
          newImages[day] = defaultImageUrl;
        }
      }

      setDayImages(newImages);
    };

    fetchImages();
  }, [datails]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.headerImage} source={require("@/assets/images/ascasc.png")} />
        <Text style={styles.headerText}>PlannedTrip</Text>
      </View>
      {Object.entries(datails)
        .sort(([keyA], [keyB]) => {
          if (keyA.includes("Day") && keyB.includes("Night")) return -1;
          if (keyA.includes("Night") && keyB.includes("Day")) return 1;
          return keyA.localeCompare(keyB, undefined, { numeric: true });
        })
        .map(([day, details]) => (
          <View key={day} style={styles.dayContainer}>
            <View style={{ backgroundColor: "#e7f4fd", padding: 10, borderRadius: 15 }}>
              {/* Display the image related to the day */}
              <Image
                source={{ uri: dayImages[day] || "https://via.placeholder.com/150" }}
                style={styles.dayImage}
              />
              <View style={styles.dayDetails}>
                {details.plan && <Text style={styles.planText}>{details.plan}</Text>}
                <View style={{ marginTop: 10 }}>
                  {details.bestTimeToVisit && (
                    <Text style={styles.detailText}>Best Time To Visit: {details.bestTimeToVisit}</Text>
                  )}
                  {details.travelTime && (
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 3 }}>
                      <Text style={{ fontSize: 16, fontFamily: "Outfit-Bold" }}>⏱️ Travel Time:</Text>
                      <Text style={styles.detailText}>{details.travelTime}</Text>
                    </View>
                  )}
                </View>

                {details.note && <Text style={styles.detailText}>Note: {details.note}</Text>}
                <Text style={styles.dayTitle}>
                  ({day.charAt(0).toUpperCase() + day.slice(1)})
                </Text>
              </View>
            </View>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headerImage: {
    width: 60,
    height: 60,
  },
  headerText: {
    fontFamily: "Outfit-Bold",
    fontSize: 20,
    marginTop: 20,
  },
  dayContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  dayImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  dayTitle: {
    fontFamily: "Outfit",
    textAlign: "right",
    fontSize: 14,
    marginTop: 10,
  },
  dayDetails: {
    marginTop: 5,
  },
  detailText: {
    fontFamily: "Outfit-Medium",
    flexShrink: 1,
    fontSize: 16,
  },
  planText: {
    fontSize: 18,
    fontFamily: "Outfit-Bold",
  },
});
