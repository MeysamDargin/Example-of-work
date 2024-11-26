import { View, Text, FlatList, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigation, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import OptionCard from "@/components/CreateTrip/OptionCard";
import { SelectBudgetList } from "@/constants/Options";
import { CreateTripContext } from "@/context/CreateTripContext";



export default function SelectBudget() {
  const navigation = useNavigation();
  const router = useRouter();
  const [SelectedOption, setSelectedOption]= useState();
  const { TripData, setTripData } = useContext(CreateTripContext);
  useEffect(() => {
    SelectedOption&&setTripData({ ...TripData, Budget: SelectedOption?.title });
  }, [SelectedOption]);

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

  const OnClickContinue = ()=> {
    if (!SelectedOption) {
        ToastAndroid.show('Select Your Budget', ToastAndroid.LONG)
        return;
    }
    router.push('/create-trip/review-trip')
  }
  useEffect(() => {
    console.log(TripData);
  }, [TripData]);
  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: Colors.White,
        height: "100%",
      }}
    >
      <Text style={{
        fontSize: 35,
        fontFamily: "Outfit-Bold",
        marginTop: 15,
      }}>Budget</Text>

      <View style={{
        marginTop:20
      }}>
        <Text style={{
            fontFamily:"Outfit-Bold",
            fontSize:20,
        }}>Choose Sepending Habits for You trips</Text>

        <FlatList
        data={SelectBudgetList}
        renderItem={({item, index})=> 
        <TouchableOpacity onPress={()=> setSelectedOption(item)} style={{
            marginVertical: 10,
        }}>
            <OptionCard option={item} SelectedOption={SelectedOption} />
        </TouchableOpacity>
    } keyExtractor={(item, index) => index.toString()}
        />
      </View>

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
}
