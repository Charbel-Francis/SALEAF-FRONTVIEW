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

const Student_Profile_Card = () => {
  const width = Dimensions.get("window").width;
  const itemHeight = hp("30%"); // Increased from 30% to 35%

  const styles = StyleSheet.create({
    container: {
      marginBottom: hp("1%"), // Reduced bottom margin
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
      fontSize: wp("4.5%"), // Slightly larger header
      fontWeight: "700",
    },
    headerSeeAll: {
      fontSize: wp("3.8%"), // Slightly larger "See All"
      fontWeight: "600",
      textDecorationLine: "underline",
    },
    cardContainer: {
      height: hp("32%"), // Increased from 25% to 32%
      marginHorizontal: wp("2%"), // Added horizontal margin
    },
    cardImage: {
      width: "100%",
      height: "100%",
      position: "relative",
      borderRadius: wp("2.5%"),
    },
    blurContainer: {
      position: "absolute",
      height: hp("18%"), // Increased from 16% to 18%
      bottom: hp("0.5%"),
      left: wp("0.5%"),
      right: wp("0.5%"),
      borderRadius: wp("3%"),
      overflow: "hidden",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: wp("2%"),
    },
    studentInfoContainer: {
      flex: 1,
      paddingVertical: hp("0.8%"), // Slightly more vertical padding
    },
    studentName: {
      color: "white",
      fontSize: wp("4.5%"), // Larger student name
      fontWeight: "700",
      paddingHorizontal: wp("2%"),
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: wp("2%"),
      paddingVertical: hp("0.8%"), // Slightly more vertical padding
    },
    infoText: {
      color: "white",
      fontSize: wp("3.8%"), // Slightly larger info text
      fontWeight: "700",
      paddingLeft: wp("2%"),
    },
    graduationContainer: {
      justifyContent: "center",
      paddingHorizontal: wp("2%"),
    },
    graduationLabel: {
      fontSize: wp("3.8%"), // Slightly larger graduation label
      color: "white",
    },
    graduationYear: {
      fontSize: wp("4.2%"), // Slightly larger graduation year
      fontWeight: "700",
      color: "white",
    },
    icon: {
      width: wp("5.5%"), // Slightly larger icons
      height: wp("5.5%"),
    },
  });

  const students = [
    {
      id: 1,
      title: "John Doe",
      location: "University Of pretoria",
      date: "Bachelor of Computer Science",
      price: "500",
      image: images.students,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Final Year Students</Text>
        <Text style={styles.headerSeeAll}>See All</Text>
      </View>

      <View>
        <Carousel
          loop
          width={width}
          height={itemHeight}
          autoPlay
          data={students}
          autoPlayInterval={2000}
          scrollAnimationDuration={1000}
          snapEnabled
          pagingEnabled
          mode="parallax"
          renderItem={({ index }) => (
            <Card style={styles.cardContainer}>
              <Image source={students[index].image} style={styles.cardImage} />
              <BlurView
                intensity={30}
                style={[
                  styles.blurContainer,
                  { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                ]}
              >
                <View style={styles.studentInfoContainer}>
                  <Text style={styles.studentName}>
                    {students[index].title}
                  </Text>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="location"
                      size={wp("5.5%")} // Slightly larger icon size
                      color="white"
                      style={styles.icon}
                    />
                    <Text style={styles.infoText}>
                      {students[index].location}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="school-outline"
                      size={wp("5.5%")} // Slightly larger icon size
                      color="white"
                      style={styles.icon}
                    />
                    <Text style={styles.infoText}>{students[index].date}</Text>
                  </View>
                </View>

                <View style={styles.graduationContainer}>
                  <Text style={styles.graduationLabel}>Graduation Year:</Text>
                  <Text style={styles.graduationYear}>
                    {students[index].price}
                  </Text>
                </View>
              </BlurView>
            </Card>
          )}
        />
      </View>
    </View>
  );
};

export default Student_Profile_Card;
