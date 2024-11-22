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
import Animated, {
  SharedTransition,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Link } from "expo-router";
import { EventInterface } from "@/types/types";
import axiosInstance from "@/utils/config";
import { sharedTransition } from "../transitions/sharedTransitions";

const Event_Card = () => {
  const width = Dimensions.get("window").width;
  const itemHeight = hp("30%");
  const [events, setEvents] = useState<EventInterface[]>([]);

  const getEvents = () => {
    try {
      axiosInstance
        .get("/api/Event/get-three-latest-events")
        .then((response) => {
          setEvents(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getEvents();
  }, []);
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
      fontSize: wp("3.8%"), // Slightly larger "See All"
      fontWeight: "600",
      textDecorationLine: "underline",
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
      bottom: hp("0%"),
      left: wp("0%"),
      right: wp("0%"),
      borderRadius: wp("3%"),
      overflow: "hidden",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: wp("2%"),
    },
    eventInfoContainer: {
      flex: 1,
      paddingVertical: hp("0%"), // Increased padding
    },
    eventTitle: {
      color: "white",
      fontSize: wp("4%"), // Increased from 4%
      fontWeight: "700",
      paddingHorizontal: wp("2%"),
      width: hp("100%"),
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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
        <Link href={{ pathname: "/(root)/(tabs)/events" }} asChild>
          <Pressable>
            <Text style={styles.headerSeeAll}>See All</Text>
          </Pressable>
        </Link>
      </View>

      <View>
        <Carousel
          loop
          width={width}
          height={itemHeight}
          autoPlay
          data={events}
          autoPlayInterval={2000}
          scrollAnimationDuration={1000}
          snapEnabled
          pagingEnabled
          mode="parallax"
          renderItem={({ item, index }) => (
            <Link
              href={{
                pathname: "/pages/event_details",
                params: events[index],
              }}
              asChild
            >
              <Pressable>
                <Card style={styles.cardContainer}>
                  <Animated.View
                    sharedTransitionTag={`event-container-${item.eventId}1`}
                    sharedTransitionStyle={sharedTransition}
                  >
                    <Animated.Image
                      source={{ uri: item.eventImageUrl }}
                      sharedTransitionTag={`event-image-${item.eventImageUrl}`}
                      sharedTransitionStyle={sharedTransition}
                      style={styles.cardImage}
                    />
                  </Animated.View>
                  <BlurView
                    intensity={30}
                    style={[
                      styles.blurContainer,
                      { backgroundColor: "rgba(0, 0, 0, 0.8)" },
                    ]}
                  >
                    <View style={styles.eventInfoContainer}>
                      <Animated.Text
                        sharedTransitionTag={`event-title-${item.eventName}`}
                        sharedTransitionStyle={sharedTransition}
                        style={styles.eventTitle}
                      >
                        {item.eventName}
                      </Animated.Text>

                      <View style={styles.infoRow}>
                        <Ionicons
                          name="location"
                          size={wp("5.5%")}
                          color="white"
                          style={styles.icon}
                        />
                        <Animated.Text
                          sharedTransitionTag={`event-location-${item.location}`}
                          sharedTransitionStyle={sharedTransition}
                          style={styles.infoText}
                        >
                          {item.location}
                        </Animated.Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Ionicons
                          name="calendar"
                          size={wp("5.5%")}
                          color="white"
                          style={styles.icon}
                        />
                        <Animated.Text
                          sharedTransitionTag={`event-date-${item.startDate}`}
                          sharedTransitionStyle={sharedTransition}
                          style={styles.infoText}
                        >
                          {item.startDate}
                        </Animated.Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Ionicons
                          name="time"
                          size={wp("5.5%")}
                          color="white"
                          style={styles.icon}
                        />
                        <Text style={styles.infoText}>
                          {item.startTime} - {item.endTime}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>Starting from:</Text>
                      <Text style={styles.priceValue}>{item.eventPrice}</Text>
                    </View>
                  </BlurView>
                </Card>
              </Pressable>
            </Link>
          )}
        />
      </View>
    </View>
  );
};

export default Event_Card;
