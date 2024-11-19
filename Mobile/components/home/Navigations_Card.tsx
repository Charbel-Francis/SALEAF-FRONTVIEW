import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Navigation_Cards = () => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      paddingVertical: hp("1%"),
    },
    card: {
      backgroundColor: "white",
      borderRadius: wp("2.5%"),
      margin: wp("1.25%"),
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    cardContent: {
      flexDirection: "column",
      alignItems: "center",
      width: wp("20%"), // Adjusted from 8vh
      height: hp("12%"), // Adjusted from 6vh
      justifyContent: "center",
      padding: wp("2%"),
    },
    image: {
      width: wp("12%"),
      height: wp("12%"),
      resizeMode: "contain",
    },
    text: {
      paddingTop: hp("1%"),
      fontSize: wp("3.5%"),
      fontWeight: "700",
      textAlign: "center",
    },
    touchable: {
      minWidth: wp("20%"),
    },
  });

  const cards = [
    {
      icon: images.event,
      title: "Events",
      navigate: "(tabs)/events",
    },
    {
      icon: images.graduated,
      title: "Students",
      navigate: "(tabs)/students",
    },
  ];

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            router.navigate(card.navigate as any);
          }}
          style={styles.touchable}
        >
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardContent}>
                <Image source={card.icon} style={styles.image} />
                <Text style={styles.text}>{card.title}</Text>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Navigation_Cards;
