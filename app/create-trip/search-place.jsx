import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { HfInference } from "@huggingface/inference";
import { CreateTripContext } from "@/context/CreateTripContext";
import { useNavigation, useRouter } from "expo-router";
import axios from "axios";
import LottieView from 'lottie-react-native';

const SearchPlace = () => {
  const { TripData, setTripData } = useContext(CreateTripContext);
  const [inputLocation, setInputLocation] = useState("");
  const [response, setResponse] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showContinueButton, setShowContinueButton] = useState(false);

  const navigation = useNavigation();
  const router = useRouter();

  const fetchLocationData = async () => {
    if (!inputLocation) {
      setError("Please enter a location.");
      return;
    }
    setLoading(true);
    setError("");
    setResponse("");
    setImages([]);
    setShowContinueButton(false);

    const client = new HfInference("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");

    try {
      const locationResponse = await client.chatCompletion({
        model: "Qwen/Qwen2.5-72B-Instruct",
        messages: [
          {
            role: "system",
            content:
              "You are a location assistant. Provide full address (city, state and country) such as (Las Vegas/ NV/ USA) and geographic coordinates (latitude and longitude) without additional text. Separate them with a new line.",
          },
          {
            role: "user",
            content: `${inputLocation}.`,
          },
        ],
        temperature: 0.2,
        max_tokens: 2048,
        top_p: 0.7,
      });

      const locationDetails = locationResponse.choices[0]?.message?.content;
      console.log("Location details response: ", locationDetails);

      if (locationDetails) {
        setResponse(locationDetails);

        const [address, coordinates] = locationDetails.split("\n");
        const [latitude, longitude] = coordinates
          ?.split(",")
          .map((coord) => coord.trim());

        if (address && latitude && longitude) {
          setTripData((prevData) => ({
            ...prevData,
            location: {
              address,
              latitude,
              longitude,
            },
          }));
          setShowContinueButton(true);
        } else {
          setError("Couldn't parse the response correctly.");
        }
      } else {
        setError("No details found for the location.");
      }

      fetchImages(inputLocation);
    } catch (err) {
      setError("Error fetching location info: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (location) => {
    const GOOGLE_API_KEY = "AIzaSyAJV6OyDRVLKYKwmmlvxc5bra0k7YSgIls";
    const GOOGLE_CX = "d193796fe95604c83";
  
    try {
      const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
        params: {
          key: GOOGLE_API_KEY,
          cx: GOOGLE_CX,
          q: location,
          searchType: "image",
          num: 5,
        },
      });
  
      const imageResults = response.data.items?.map((item) => item.link) || [];
      setImages(imageResults);
  
      // فقط اولین عکس را به TripData اضافه کن
      if (imageResults.length > 0) {
        setTripData((prevData) => ({
          ...prevData,
          image: imageResults[0], // ذخیره اولین عکس
        }));
      }
    } catch (error) {
      setError("Error fetching images: " + error.message);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Search",
      headerTransparent: true,
    });
  }, []);

  useEffect(() => {
    console.log("TripData on render: ", TripData);
  }, [TripData]);
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter location (e.g., Tehran)"
        value={inputLocation}
        onChangeText={(text) => setInputLocation(text)}
      />
      <TouchableOpacity style={styles.button} onPress={fetchLocationData}>
        <Text style={styles.buttonText}>Choose a location</Text>
      </TouchableOpacity>

      {loading && (
        <LottieView
          source={require('@/assets/images/Animation - 1731955078972 (1).json')} // مسیر انیمیشن Lottie
          autoPlay
          loop
          style={styles.animation}
        />
      )}

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        response && (
          <View style={styles.responseBox}>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        )
      )}

      {images.length > 0 && (
        <ScrollView contentContainerStyle={styles.imageContainer}>
          {images.map((imageUrl, index) => (
            <Image key={index} source={{ uri: imageUrl }} style={styles.image} />
          ))}
        </ScrollView>
      )}

      {showContinueButton && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push('/create-trip/select-traveler')}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    width: "90%",
    marginBottom: 20,
    paddingHorizontal: 10,
    fontFamily: "Outfit",
    marginTop: '25%',
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 108,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Outfit-Bold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    fontFamily: "Outfit-Bold",
  },
  responseBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#EFEFEF",
    borderRadius: 5,
  },
  responseText: {
    fontSize: 20,
    color: "#333",
    fontFamily: "Outfit-Bold",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 5,
  },
  animation: {
    width: 300,
    height: 300,
  },
  continueButton: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    paddingHorizontal: 135,
  },
  continueButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Outfit-Bold",
  },
});

export default SearchPlace;
