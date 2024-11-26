import { View, Text, FlatList, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { SelectTravelesList } from "@/constants/Options";
import OptionCard from "@/components/CreateTrip/OptionCard";
import { Link, useNavigation, useRouter } from "expo-router";
import { CreateTripContext } from "@/context/CreateTripContext";

const SelectTraveler = () => {
  const navigation = useNavigation();
  const [selectedTraveles, setselectedTraveles] = useState();
  const { TripData, setTripData } = useContext(CreateTripContext);

  const router = useRouter();

  useEffect(() => {
    setTripData({ ...TripData, traveler: selectedTraveles });
  }, [selectedTraveles]);

  useEffect(() => {
    console.log(TripData);
  }, [TripData]);

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

  const OnClickContinue = ()=> {
    if (!selectedTraveles) {
        ToastAndroid.show('Select Your Traveles', ToastAndroid.LONG)
        return;
    }
    router.push('/create-trip/select-dates')
  }
  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: Colors.White,
        height: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 35,
          fontFamily: "Outfit-Bold",
          marginTop: 15,
        }}
      >
        Who's Traveling
      </Text>

      <View
        style={{
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontSize: 23,
            fontFamily: "Outfit-Bold",
          }}
        >
          Choose your Traveles
        </Text>
      </View>

      <FlatList
        data={SelectTravelesList}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => setselectedTraveles(item)}
            style={{
              marginVertical: 10,
            }}
          >
            <OptionCard option={item} SelectedOption={selectedTraveles} />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()} // یا استفاده از یک شناسه یکتا
      />
      
        <TouchableOpacity
        onPress={()=> OnClickContinue()}
          style={{
            padding: 15,
            backgroundColor: Colors.Primary,
            borderRadius: 15,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#fff",
              fontFamily: "Outfit-Bold",
              fontSize: 20,
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
    </View>
  );
};

export default SelectTraveler;
