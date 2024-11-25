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
import axiosInstance from "@/utils/config";
import { EventInterface } from "@/types/types";
import { ActivityIndicator } from "react-native-paper";

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

export default function EventsScreen() {
  const [events, setEvents] = useState<EventInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getEvents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/Event/userevents");
      setEvents(response.data);
      setError(null);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="calendar-outline" size={wp("20%")} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Events Found</Text>
      <Text style={styles.emptyStateText}>
        There are currently no upcoming events
      </Text>
      <Pressable style={styles.retryButton} onPress={getEvents}>
        <Text style={styles.retryButtonText}>Refresh</Text>
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#3949ab" size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyStateContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={wp("20%")}
          color="#ff6b6b"
        />
        <Text style={styles.emptyStateTitle}>Something went wrong</Text>
        <Text style={styles.emptyStateText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={getEvents}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        ListHeaderComponent={() => (
          <Text style={styles.header}>Upcoming Events</Text>
        )}
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => <EventCard event={item} />}
        keyExtractor={(item) => item.eventId.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: hp("20%") },
          events.length === 0 && { flex: 1 },
        ]}
        removeClippedSubviews={false}
        initialNumToRender={events.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
  },
  emptyStateTitle: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: "#333",
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
  },
  emptyStateText: {
    fontSize: wp("4%"),
    color: "#666",
    textAlign: "center",
    marginBottom: hp("2%"),
  },
  retryButton: {
    backgroundColor: "#3949ab",
    paddingHorizontal: wp("8%"),
    paddingVertical: hp("1.5%"),
    borderRadius: wp("2%"),
    marginTop: hp("2%"),
  },
  retryButtonText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
});
