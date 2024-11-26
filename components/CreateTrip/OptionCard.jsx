import { View, Text } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

export default function OptionCard({ option, SelectedOption }) {
  return (
    <View style={[{
        padding:25,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        borderWidth:0.1,
        borderColor:"#fff",
        backgroundColor:"#efefef",
        borderRadius:15,
        marginTop:25,
        
    },SelectedOption?.id==option?.id&&{borderWidth:3, borderColor:"#000",}]}>
      <View>
        <Text style={{
            fontSize:20,
            fontFamily:"Outfit-Bold",
        }}>{option.title}</Text>
        <Text style={{
            fontSize:17,
            fontFamily:"Outfit",
            color:Colors.Gray,
        }}>{option.desc}</Text>
      </View>
      <Text style={{
        fontSize:35
      }}>{option.icon}</Text>
    </View>
  );
}
