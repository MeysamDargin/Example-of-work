import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";
import axios from "axios";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/configs/FirebaseConfig"; // تنظیمات Firestore

export default function HotelList({ hotelList }) {
  const [hotelsWithImages, setHotelsWithImages] = useState([]);
  const defaultImageUrl = "https://via.placeholder.com/150"; // تصویر پیش‌فرض
  const [error, setError] = useState("");

  // دریافت کلیدهای API از Firestore
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
    const fetchHotelImages = async () => {
      const apiKeys = await fetchAPIKeysFromFirestore();

      if (!apiKeys || !apiKeys.GOOGLE_API_KEY || !apiKeys.GOOGLE_CX) {
        setError("Google API keys not found.");
        return;
      }

      const updatedHotels = [];

      for (const hotel of hotelList) {
        if (hotel.imageUrl) {
          updatedHotels.push(hotel);
          continue;
        }

        try {
          const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
            params: {
              key: apiKeys.GOOGLE_API_KEY,
              cx: apiKeys.GOOGLE_CX,
              q: hotel.name,
              searchType: "image",
              num: 1,
            },
          });

          const imageUrl = response.data.items?.[0]?.link || defaultImageUrl;

          updatedHotels.push({
            ...hotel,
            imageUrl,
          });
        } catch (error) {
          console.error(`Error fetching image for hotel ${hotel.name}:`, error.message);
          updatedHotels.push({
            ...hotel,
            imageUrl: defaultImageUrl, // استفاده از تصویر پیش‌فرض در صورت خطا
          });
        }
      }

      setHotelsWithImages(updatedHotels);
    };

    if (hotelsWithImages.length === 0) {
      fetchHotelImages();
    }
  }, [hotelList]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.headerImage}
          source={require("@/assets/images/5-stars.png")}
        />
        <Text style={styles.headerText}>Hotel Recommendation</Text>
      </View>
      <FlatList
        data={hotelsWithImages}
        style={{ marginTop: 10 }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <HotelCard hotel={item} />}
      />
    </View>
  );
}

function HotelCard({ hotel }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [opacity] = useState(new Animated.Value(0));

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.cardContainer}>
      {hotel.imageUrl ? (
        <Image source={{ uri: hotel.imageUrl }} style={styles.hotelImage} />
      ) : (
        <Text style={styles.noImageText}>No image available</Text>
      )}
      <Text style={styles.hotelName}>{hotel.name}</Text>
      <Text>⭐ {hotel.rating}</Text>
      <TouchableOpacity onPress={openModal}>
        <Text style={styles.moreButton}>View hotel</Text>
      </TouchableOpacity>

      {/* Modal */}
      {modalVisible && (
        <Modal transparent={true} animationType="none">
          <Animated.View style={[styles.modalBackground, { opacity }]}>
            <View style={styles.modalContent}>
              <Image source={{ uri: hotel.imageUrl }} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{hotel.name}</Text>
              <Text style={styles.modalText}>⭐ {hotel.rating}</Text>
              <Text style={styles.modalText}>Address: {hotel.address}</Text>
              <Text style={styles.modalText}>Description: {hotel.description}</Text>
              <Text style={styles.modalText}>Price: {hotel.price}</Text>
              <Text style={styles.modalText}>Nearby Places:</Text>
              {hotel.nearbyPlaces?.map((place, index) => (
                <View key={index}>
                  <Text style={styles.modalText}>- {place.name}</Text>
                </View>
              ))}
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  cardContainer: {
    marginRight: 20,
    width: 180,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerImage: {
    width: 40,
    height: 40,
  },
  headerText: {
    fontFamily: "Outfit-Bold",
    fontSize: 20,
    marginTop: 15,
  },
  hotelImage: {
    width: 180,
    height: 120,
    borderRadius: 15,
  },
  noImageText: {
    fontSize: 14,
    color: "gray",
  },
  hotelName: {
    fontSize: 17,
    fontFamily: "Outfit-Bold",
    marginTop: 5,
  },
  moreButton: {
    fontSize: 16,
    fontFamily: "Outfit-Bold",
    color: "#007BFF",
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalImage: {
    width: 250,
    height: 150,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Outfit-Bold",
    marginTop: 10,
  },
  modalText: {
    fontSize: 14,
    fontFamily: "Outfit",
    color: "#333",
    marginTop: 5,
  },
  closeButton: {
    fontSize: 16,
    fontFamily: "Outfit-Bold",
    color: "#FF0000",
    marginTop: 20,
  },
});
