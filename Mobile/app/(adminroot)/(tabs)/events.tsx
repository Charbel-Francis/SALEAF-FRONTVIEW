import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import Animated from "react-native-reanimated";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Link } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { sharedTransition } from "@/components/transitions/sharedTransitions";
import axios from "axios";
import axiosInstance from "@/utils/config";
import { EventInterface } from "@/types/types";
import { ActivityIndicator } from "react-native-paper";

// const events = [
//   {
//     id: "1",
//     title: "Golf Championships 2024",
//     date: "March 15, 2024",
//     location: "Royal Golf Club",
//     imageUrl: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa",
//     price: "R2,500",
//     starttime: "08:00",
//     endtime: "17:00",
//     description:
//       "Join us for the prestigious Golf Championships 2024. Experience world-class golfing at its finest with professional players from around the globe competing for the championship title.",
//     capacity: "150 participants",
//   },
//   {
//     id: "2",
//     title: "Tennis Open Tournament",
//     date: "April 5, 2024",
//     location: "Central Tennis Arena",
//     imageUrl: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6",
//     price: "R1,800",
//     starttime: "09:00",
//     endtime: "18:00",
//     description:
//       "Watch top tennis players compete in this exciting open tournament. Featuring both singles and doubles matches throughout the day.",
//     capacity: "200 spectators",
//   },
//   {
//     id: "3",
//     title: "Marathon City Run",
//     date: "May 20, 2024",
//     location: "City Center",
//     imageUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3",
//     price: "R350",
//     starttime: "06:00",
//     endtime: "12:00",
//     description:
//       "Join thousands of runners in this annual city marathon. Perfect for both professional athletes and enthusiastic amateurs.",
//     capacity: "5000 runners",
//   },
//   {
//     id: "4",
//     title: "Swimming Championship",
//     date: "June 8, 2024",
//     location: "Olympic Pool Complex",
//     imageUrl: "https://images.unsplash.com/photo-1519315901367-f34ff9154487",
//     price: "R900",
//     starttime: "10:00",
//     endtime: "16:00",
//     description:
//       "National swimming championship featuring multiple categories and age groups. Come witness record-breaking performances!",
//     capacity: "300 participants",
//   },
// ];

const EventCard = ({ event }: { event: EventInterface }) => {
  return (
    <Link
      href={{
        pathname: "/pages/event_details",
        params: {
          ...event,
          packages: JSON.stringify(event.packages),
        },
      }}
      asChild
    >
      <Pressable style={styles.cardContainer}>
        <Animated.View
          sharedTransitionTag={`card-container-${event.eventId}`}
          sharedTransitionStyle={sharedTransition}
          style={[styles.cardInner]}
        >
          <Animated.Image
            source={{ uri: event.eventImageUrl }}
            sharedTransitionTag={`card-image-${event.eventId}`}
            sharedTransitionStyle={sharedTransition}
            style={[styles.cardImage]}
            resizeMode="cover"
          />
          <BlurView
            intensity={30}
            style={[
              styles.blurContainer,
              { backgroundColor: "rgba(0, 0, 0, 0.3)" },
            ]}
            tint="dark"
          >
            <View style={styles.contentWrapper}>
              <View style={styles.infoContainer}>
                <Animated.Text
                  sharedTransitionTag={`event-title-${event.eventId}`}
                  sharedTransitionStyle={sharedTransition}
                  style={styles.title}
                  numberOfLines={1}
                >
                  {event.eventName}
                </Animated.Text>

                <View style={styles.detailsContainer}>
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="location"
                      size={wp("4%")}
                      color="white"
                      style={styles.icon}
                    />
                    <Animated.Text
                      sharedTransitionTag={`event-location-${event.eventId}`}
                      sharedTransitionStyle={sharedTransition}
                      style={styles.infoText}
                      numberOfLines={1}
                    >
                      {event.location}
                    </Animated.Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="calendar"
                      size={wp("4%")}
                      color="white"
                      style={styles.icon}
                    />
                    <Animated.Text
                      sharedTransitionTag={`event-date-${event.eventId}`}
                      sharedTransitionStyle={sharedTransition}
                      style={styles.infoText}
                      numberOfLines={1}
                    >
                      {event.startDate}-{event.endDate}
                    </Animated.Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="time"
                      size={wp("4%")}
                      color="white"
                      style={styles.icon}
                    />
                    <Text style={styles.infoText} numberOfLines={1}>
                      {event.startTime} - {event.endTime}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Starting from:</Text>
                <Text style={styles.priceValue}>
                  {event?.packages?.[0]?.packagePrice}
                </Text>
              </View>
            </View>
          </BlurView>
        </Animated.View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: hp("80%"), // This ensures it's vertically centered in the visible area
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: "#1a1a1a",
    marginVertical: hp("2%"),
    marginHorizontal: wp("4%"),
  },
  cardContainer: {
    height: hp("25%"),
    marginHorizontal: wp("4%"),
    marginBottom: hp("2%"),
    borderRadius: wp("3%"),
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: hp("0.25%"),
    },
    shadowOpacity: 0.25,
    shadowRadius: wp("1%"),
  },
  cardInner: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  blurContainer: {
    position: "absolute",
    height: wp("25%"),
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  contentWrapper: {
    flex: 1,
    flexDirection: "row",
    padding: wp("3%"),
    justifyContent: "space-between",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingRight: wp("2%"),
  },
  detailsContainer: {
    justifyContent: "space-between",
  },
  title: {
    fontSize: wp("4%"),
    fontWeight: "700",
    color: "white",
    marginBottom: hp("0.5%"),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("0.5%"),
  },
  icon: {
    width: wp("4%"),
    marginRight: wp("1%"),
  },
  infoText: {
    color: "white",
    fontSize: wp("3.2%"),
    flex: 1,
  },
  priceContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  priceLabel: {
    color: "white",
    fontSize: wp("3%"),
    opacity: 0.9,
  },
  priceValue: {
    color: "white",
    fontSize: wp("3.8%"),
    fontWeight: "700",
  },
});

export default function EventsScreen() {
  const [events, setEvents] = useState<EventInterface[]>([]);
  const getEvents = () => {
    try {
      axiosInstance.get("/api/Event/userevents").then((response) => {
        setEvents(response.data);
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getEvents();
  }, []);
  return (
    <View style={styles.container}>
      {events.length !== 0 && (
        <FlatList
          data={events}
          ListHeaderComponent={() => (
            <Text style={styles.header}>Upcoming Events</Text>
          )}
          renderItem={({ item }) => <EventCard event={item} />}
          keyExtractor={(item) => item.eventId.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp("20%") }}
          removeClippedSubviews={false}
          initialNumToRender={events.length}
        />
      )}

      {events.length === 0 && (
        <ActivityIndicator
          color="green"
          size="large"
          style={styles.loadingContainer}
        />
      )}
    </View>
  );
}
