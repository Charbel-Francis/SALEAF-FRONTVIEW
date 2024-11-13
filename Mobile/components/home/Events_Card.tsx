import React from "react";
import { Dimensions, Image, Text, View, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";
import { images } from "@/constants";
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Event_Card = () => {
  const width = Dimensions.get("window").width;
  const itemHeight = hp("30%"); // Increased from 30% to 35%

  const styles = StyleSheet.create({
    container: {
      marginBottom: hp("0"), // Reduced bottom margin
    },
    headerContainer: {
      width: "100%",
      paddingHorizontal: wp("4%"),
      paddingVertical: hp("1%"),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: wp("4.5%"), // Increased from 4%
      fontWeight: "700",
    },
    headerSeeAll: {
      fontSize: wp("3.8%"), // Increased from 3.5%
    },
    cardContainer: {
      height: hp("32%"), // Increased from 25%
      marginHorizontal: wp("1%"), // Added horizontal margin
    },
    cardImage: {
      width: "100%",
      height: "100%",
      position: "relative",
      borderRadius: wp("2.5%"),
    },
    blurContainer: {
      position: "absolute",
      height: hp("18%"), // Increased from 16%
      bottom: hp("0.5%"),
      left: wp("0.5%"),
      right: wp("0.5%"),
      borderRadius: wp("3%"),
      overflow: "hidden",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: wp("2%"),
    },
    eventInfoContainer: {
      flex: 1,
      paddingVertical: hp("0.8%"), // Increased padding
    },
    eventTitle: {
      color: "white",
      fontSize: wp("4.5%"), // Increased from 4%
      fontWeight: "700",
      paddingHorizontal: wp("2%"),
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: wp("2%"),
      paddingVertical: hp("0.8%"), // Increased from 0.5%
    },
    infoText: {
      color: "white",
      fontSize: wp("3.8%"), // Increased from 3.5%
      fontWeight: "700",
      paddingLeft: wp("2%"),
    },
    priceContainer: {
      justifyContent: "center",
      paddingHorizontal: wp("2%"),
    },
    priceLabel: {
      fontSize: wp("3.8%"), // Increased from 3.5%
      color: "white",
    },
    priceValue: {
      fontSize: wp("4.2%"), // Increased from 4%
      fontWeight: "700",
      color: "white",
    },
    icon: {
      width: wp("5.5%"), // Increased from 5%
      height: wp("5.5%"),
    },
  });

  const events = [
    {
      id: 1,
      title: "Golf Fundraiser",
      location: "Benoni Country Club",
      date: "November 15, 2023",
      price: "R500",
      image: images.golf,
      starttime: "17:38",
      endtime: "17:38",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
        <Text style={styles.headerSeeAll}>See All</Text>
      </View>

      <View>
        <Carousel
          loop
          width={width}
          height={itemHeight}
          autoPlay
          data={events}
          autoPlayInterval={2000}
          scrollAnimationDuration={1000} // Reduced from 6000 for smoother transitions
          snapEnabled
          pagingEnabled
          mode="parallax"
          renderItem={({ index }) => (
            <Card style={styles.cardContainer}>
              <Image source={events[index].image} style={styles.cardImage} />
              <BlurView
                intensity={30}
                style={[
                  styles.blurContainer,
                  { backgroundColor: "rgba(0, 0, 0, 0.8)" },
                ]}
              >
                <View style={styles.eventInfoContainer}>
                  <Text style={styles.eventTitle}>{events[index].title}</Text>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="location"
                      size={wp("5.5%")}
                      color="white"
                      style={styles.icon}
                    />
                    <Text style={styles.infoText}>
                      {events[index].location}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="calendar"
                      size={wp("5.5%")}
                      color="white"
                      style={styles.icon}
                    />
                    <Text style={styles.infoText}>{events[index].date}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="time"
                      size={wp("5.5%")}
                      color="white"
                      style={styles.icon}
                    />
                    <Text style={styles.infoText}>
                      {events[index].starttime} - {events[index].endtime}
                    </Text>
                  </View>
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Starting from:</Text>
                  <Text style={styles.priceValue}>{events[index].price}</Text>
                </View>
              </BlurView>
            </Card>
          )}
        />
      </View>
    </View>
  );
};

export default Event_Card;
