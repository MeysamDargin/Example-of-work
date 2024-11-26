import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useNavigation, useRouter } from "expo-router";
import CalendarPicker from "react-native-calendar-picker";
import { CreateTripContext } from "@/context/CreateTripContext";
import moment from "moment";

export default function SelectDates() {
  const router = useRouter();
  const navigation = useNavigation();
  const [StartDate, setStartDate] = useState();
  const [EndDate, setEndDate] = useState();
  const { TripData, setTripData } = useContext(CreateTripContext);

  const onDateChange = (data, type) => {
    console.log(data, type);
    if (type == "START_DATE") {
      setStartDate(moment(data));
    } else {
      setEndDate(moment(data));
    }
  };
  const OnDateSelectionContinue = () => {
    if (!StartDate && !EndDate) {
      ToastAndroid.show("Please select Start and End Date", ToastAndroid.LONG);
      return;
    }
    const totalNoOfDays = EndDate.diff(StartDate, "Days");
    console.log(totalNoOfDays);
    setTripData({
      ...TripData,
      StartDate:StartDate,
      EndDate:EndDate,
      totalNoOfDays:totalNoOfDays+1

    });
    router.push('/create-trip/select-budget')
  };
  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);
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
        Travel dates
      </Text>

      <View
        style={{
          marginTop: 30,
        }}
      >
        <CalendarPicker
          onDateChange={onDateChange}
          allowRangeSelection={true}
          minDate={new Date()}
          maxRangeDuration={5}
          selectedRangeStyle={{
            backgroundColor: Colors.Primary,
          }}
          selectedDayTextStyle={{
            color: Colors.White,
          }}
        />
      </View>

      <TouchableOpacity
        onPress={OnDateSelectionContinue}
        style={{
          padding: 15,
          backgroundColor: Colors.Primary,
          borderRadius: 15,
          marginTop: 35,
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
