import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Text,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { Card } from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, {
  SharedTransition,
  withSpring,
} from "react-native-reanimated";
import { StudentInterface } from "@/types/types";
import { Link } from "expo-router";
import axiosInstance from "@/utils/config";
import { sharedTransition } from "../transitions/sharedTransitions";

const Student_Profile_Card = () => {
  const width = Dimensions.get("window").width;
  const itemHeight = hp("30%");
  const [students, setStudents] = useState<StudentInterface[]>([]);

  const getStudents = () => {
    try {
      axiosInstance
        .get("/api/StudentProfile/all-studentprofiles")
        .then((response) => {
          const finalYearStudents = response.data.filter(
            (student: StudentInterface) => student.isFinalYear
          );
          setStudents(finalYearStudents);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  const styles = StyleSheet.create({
    container: {
      marginBottom: hp("1%"),
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
      fontSize: wp("4.5%"),
      fontWeight: "700",
    },
    headerSeeAll: {
      fontSize: wp("3.8%"),
      fontWeight: "600",
      textDecorationLine: "underline",
    },
    cardWrapper: {
      marginHorizontal: wp("2%"),
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: hp("0.25%"),
      },
      shadowOpacity: 0.25,
      shadowRadius: wp("1%"),
    },
    cardContainer: {
      height: hp("32%"),
    },
    cardContent: {
      height: "100%",
      borderRadius: wp("2.5%"),
      overflow: "hidden",
    },
    cardImage: {
      width: "100%",
      height: "100%",
      borderRadius: wp("2.5%"),
    },
    blurContainer: {
      position: "absolute",
      height: hp("15%"),
      bottom: hp("0%"),
      left: wp("0%"),
      right: wp("0%"),
      borderRadius: wp("3%"),
      overflow: "hidden",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: wp("2%"),
    },
    studentInfoContainer: {
      flex: 1,
      paddingVertical: hp("0.8%"),
    },
    studentName: {
      color: "white",
      fontSize: wp("4.5%"),
      fontWeight: "700",
      paddingHorizontal: wp("2%"),
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: wp("2%"),
      width: wp("50%"),
      paddingVertical: hp("0.8%"),
    },
    infoText: {
      color: "white",
      fontSize: wp("3.8%"),
      fontWeight: "700",
      paddingLeft: wp("2%"),
    },
    graduationContainer: {
      justifyContent: "center",
      paddingHorizontal: wp("2%"),
    },
    graduationLabel: {
      fontSize: wp("3.8%"),
      color: "white",
      opacity: 0.9,
    },
    graduationYear: {
      fontSize: wp("4.2%"),
      fontWeight: "700",
      color: "white",
    },
    icon: {
      width: wp("5.5%"),
      height: wp("5.5%"),
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Final Year Students</Text>
        <Link href={{ pathname: "/(root)/(tabs)/students" }} asChild>
          <Pressable>
            <Text style={styles.headerSeeAll}>See All</Text>
          </Pressable>
        </Link>
      </View>

      {students.length > 0 && (
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
          renderItem={({ item: student }) => (
            <Link
              href={{
                pathname: "/pages/student_details",
                params: {
                  ...student,
                  skills: JSON.stringify(student.skills),
                  achievements: JSON.stringify(student.achievements),
                  isFinalYear: student.isFinalYear.toString(),
                  graduationDate: new Date(
                    student.graduationDate
                  ).toISOString(),
                  studentImageUrl: student.imageUrl,
                },
              }}
              asChild
            >
              <Pressable style={styles.cardWrapper}>
                <Card style={styles.cardContainer}>
                  <View style={styles.cardContent}>
                    <Animated.View
                      sharedTransitionTag={`student-container-${student.id}`}
                      sharedTransitionStyle={sharedTransition}
                    >
                      <Animated.Image
                        source={{ uri: student.imageUrl }}
                        sharedTransitionTag={`student-image-${student.imageUrl}`}
                        sharedTransitionStyle={sharedTransition}
                        style={styles.cardImage}
                        resizeMode="cover"
                      />
                    </Animated.View>
                    <BlurView
                      intensity={30}
                      style={[
                        styles.blurContainer,
                        { backgroundColor: "rgba(0, 0, 0, 0.8)" },
                      ]}
                    >
                      <View style={styles.studentInfoContainer}>
                        <Animated.Text
                          sharedTransitionTag={`card-name-${student.firstName}`}
                          sharedTransitionStyle={sharedTransition}
                          style={styles.studentName}
                          numberOfLines={1}
                        >
                          {student.firstName} {student.lastName}
                        </Animated.Text>

                        <View style={styles.infoRow}>
                          <Ionicons
                            name="school"
                            size={wp("5.5%")}
                            color="white"
                            style={styles.icon}
                          />
                          <Animated.Text
                            sharedTransitionTag={`card-university-${student.university}`}
                            sharedTransitionStyle={sharedTransition}
                            style={styles.infoText}
                            numberOfLines={1}
                          >
                            {student.university}
                          </Animated.Text>
                        </View>

                        <View style={styles.infoRow}>
                          <Ionicons
                            name="book"
                            size={wp("5.5%")}
                            color="white"
                            style={styles.icon}
                          />
                          <Text style={styles.infoText} numberOfLines={1}>
                            {student.degree}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.graduationContainer}>
                        <Text style={styles.graduationLabel}>
                          Graduation Year
                        </Text>
                        <Text style={styles.graduationYear}>
                          {new Date(student.graduationDate).getFullYear()}
                        </Text>
                      </View>
                    </BlurView>
                  </View>
                </Card>
              </Pressable>
            </Link>
          )}
        />
      )}
    </View>
  );
};

export default Student_Profile_Card;
