import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from "@/constants/Colors";
import Ionicons from '@expo/vector-icons/Ionicons';
import { CreateTripContext } from "@/context/CreateTripContext";
import moment from "moment";

export default function ReviewTrip() {
  const router = useRouter();
    const { TripData, setTripData } = useContext(CreateTripContext);
    const navigation = useNavigation();
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
      }}>
      <Text style={{
          fontSize: 35,
          fontFamily: "Outfit-Bold",
          marginTop: 15,
        }}>Review Your Trip</Text>

        <View style={{
          marginTop: 20,
        }}>
            <Text style={{
            fontSize: 23,
            fontFamily: "Outfit-Bold",
          }}>Before generation your trip , please Review your selection</Text>

          <View style={{
            marginTop:20,
            display:"flex",
            flexDirection:"row",
            borderWidth:0.1,
            gap:20
          }}>
          <Text style={{
            fontSize:30
          }}>📌</Text>
          <View>
            <Text style={{
                fontFamily:"Outfit",
                fontSize:20,
                color:Colors.Gray
            }}>Destination</Text>
            <Text style={{
                fontFamily:"Outfit-Medium",
                fontSize:19,
            }}>{TripData?.location.address}</Text>
          </View>
          </View>
          <View style={{
            marginTop:30,
            display:"flex",
            flexDirection:"row",
            borderWidth:0.1,
            gap:20
          }}>
          <Text style={{
            fontSize:30
          }}>🗓</Text>
          <View>
            <Text style={{
                fontFamily:"Outfit",
                fontSize:20,
                color:Colors.Gray
            }}>Travel Date</Text>
            <Text style={{
                fontFamily:"Outfit-Medium",
                fontSize:20,
            }}>{moment(TripData?.StartDate).format('DD MMM')+ ' To '+moment(TripData?.EndDate).format('DD MMM')}  ({TripData?.totalNoOfDays} days)</Text>
          </View>
          </View>
          <View style={{
            marginTop:30,
            display:"flex",
            flexDirection:"row",
            borderWidth:0.1,
            gap:20
          }}>
          <Text style={{
            fontSize:30
          }}>🚌</Text>
          <View>
            <Text style={{
                fontFamily:"Outfit",
                fontSize:20,
                color:Colors.Gray
            }}>Who is Traveling</Text>
            <Text style={{
                fontFamily:"Outfit-Medium",
                fontSize:20,
            }}>{TripData?.traveler.title} ({TripData?.traveler.peple})</Text>
          </View>
          </View>
          <View style={{
            marginTop:30,
            display:"flex",
            flexDirection:"row",
            borderWidth:0.1,
            gap:20
          }}>
          <Text style={{
            fontSize:30
          }}>💰</Text>
          <View>
            <Text style={{
                fontFamily:"Outfit",
                fontSize:20,
                color:Colors.Gray
            }}>Budget</Text>
            <Text style={{
                fontFamily:"Outfit-Medium",
                fontSize:20,
            }}>{TripData?.Budget}</Text>
          </View>
          </View>
          <TouchableOpacity
      onPress={()=> router.replace('/create-trip/gnerate-trip')}
          style={{
            padding: 15,
            backgroundColor: Colors.Primary,
            borderRadius: 15,
            marginTop: 40,
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
            Build My Trip
          </Text>
        </TouchableOpacity>
        </View>
    </View>
  )
}