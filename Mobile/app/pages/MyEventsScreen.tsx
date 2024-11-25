import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  Image,
  Platform,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useState, useEffect } from "react";
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import axiosInstance, { API_URL } from "@/utils/config";
import { ActivityIndicator } from "react-native-paper";

interface Event {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  numberOfParticipant: number;
  eventId: number;
  event: {
    eventId: number;
    eventName: string;
    eventDescription: string;
    location: string;
    eventImageUrl: string | null;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    status: string;
  };
  pacakageName: string;
  registrationDate: string;
  currency: string;
  amount: number;
  isPaid: boolean;
  paymentId: string;
}

const MyEventsScreen = () => {
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "past">(
    "upcoming"
  );
  const [showQR, setShowQR] = useState(false);
  const [selectedEventQR, setSelectedEventQR] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();
  const [isQRLoading, setIsQRLoading] = useState(false);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get(
          "/EventRegistration/get-logged-register-event"
        );
        if (response.data) {
          // Access the data array from the response
          setEvents(response.data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);
  // Define gradient colors for different package types
  const getGradientColors = (packageName: string) => {
    switch (packageName.toLowerCase()) {
      case "vip":
        return ["#FFD700", "#FFA500"];
      case "standard":
        return ["#4158D0", "#C850C0"];
      default:
        return ["#0093E9", "#80D0C7"];
    }
  };

  const getPaymentStatusColor = (isPaid: boolean) => {
    return isPaid
      ? {
          bg: "rgba(52, 199, 89, 0.1)",
          text: "#34C759",
        }
      : {
          bg: "rgba(255, 149, 0, 0.1)",
          text: "#FF9500",
        };
  };

  const generateQRData = async (event: Event) => {
    setIsQRLoading(true); // Start loading
    console.log("Generating QR code for event:", event.id);
    try {
      const response = await axiosInstance.get(
        `${API_URL}/EventRegistration/generate-qr-code/?eventId=${event.id.toString()}`,
        {
          responseType: "blob",
        }
      );
      console.log("QR code response:", response);
      if (response.status === 200) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(response.data);
          reader.onloadend = () => {
            const base64data = reader.result;
            setSelectedEventQR(base64data as string);
            setIsQRLoading(false); // Stop loading
            resolve(base64data);
          };
          reader.onerror = (error) => {
            setIsQRLoading(false); // Stop loading on error
            reject(error);
          };
        });
      }
    } catch (error) {
      setIsQRLoading(false); // Stop loading on error
      console.error("Error fetching QR code:", error);
    }
  };

  const renderEventCard = (event: Event) => (
    <Animatable.View
      animation="fadeInUp"
      duration={800}
      delay={event.id * 100}
      key={event.id}
      style={styles.eventCard}
    >
      <LinearGradient
        colors={getGradientColors(event.pacakageName)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardHeader}
      >
        <View style={styles.eventTitleContainer}>
          <Text style={styles.eventName}>{event.event.eventName}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getPaymentStatusColor(event.isPaid).bg },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getPaymentStatusColor(event.isPaid).text },
              ]}
            >
              {event.isPaid ? "Paid" : "Pending Payment"}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.eventContent}>
        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="calendar-outline"
                size={wp("5%")}
                color="#007AFF"
              />
            </View>
            <Text style={styles.detailText}>
              {formatDateTime(event.event.startDate, event.event.startTime)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="ticket-outline" size={wp("5%")} color="#007AFF" />
            </View>
            <Text style={styles.detailText}>
              {event.pacakageName} - {event.numberOfParticipant}{" "}
              {event.numberOfParticipant > 1 ? "tickets" : "ticket"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="location-outline"
                size={wp("5%")}
                color="#007AFF"
              />
            </View>
            <Text style={styles.detailText}>{event.event.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="cash-outline" size={wp("5%")} color="#007AFF" />
            </View>
            <Text style={styles.detailText}>
              {event.currency} {event.amount.toFixed(2)}
            </Text>
          </View>
        </View>

        {event.isPaid && (
          <Pressable
            style={styles.qrButton}
            onPress={() => {
              generateQRData(event);
              setShowQR(true);
            }}
          >
            <Text style={styles.qrButtonText}>View Ticket QR</Text>
            <Ionicons name="qr-code-outline" size={wp("5%")} color="white" />
          </Pressable>
        )}
      </View>
    </Animatable.View>
  );

  // Replace your current filterEvents function with this:
  const filterEvents = () => {
    const currentDate = new Date();

    return events.filter((event) => {
      try {
        const monthMap: { [key: string]: number } = {
          January: 0,
          February: 1,
          March: 2,
          April: 3,
          May: 4,
          June: 5,
          July: 6,
          August: 7,
          September: 8,
          October: 9,
          November: 10,
          December: 11,
        };

        const [day, month, year] = event.event.startDate.split(" ");
        const eventDate = new Date(
          parseInt(year),
          monthMap[month],
          parseInt(day)
        );
        if (isNaN(eventDate.getTime())) {
          console.error("Invalid date for event:", event.event.eventName);
          return false;
        }

        const isUpcoming = eventDate >= currentDate;

        return selectedTab === "upcoming" ? isUpcoming : !isUpcoming;
      } catch (error) {
        console.error(
          "Error parsing date for event:",
          event.event.eventName,
          error
        );
        return false;
      }
    });
  };

  // Update the formatDateTime function as well:
  const formatDateTime = (dateStr: string, timeStr: string) => {
    try {
      const [day, month, year] = dateStr.split(" ");
      return `${day} ${month} ${year} at ${timeStr}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateStr + " at " + timeStr;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <BlurView intensity={80} tint="light" style={styles.backButtonBlur}>
            <Ionicons name="arrow-back" size={wp("6%")} color="#007AFF" />
          </BlurView>
        </Pressable>
        <Text style={styles.headerTitle}>My Events</Text>
      </View>

      <View style={styles.tabContainer}>
        {["upcoming", "past"].map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab as "upcoming" | "past")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            {selectedTab === tab && (
              <Animatable.View
                animation="fadeIn"
                duration={400}
                style={styles.activeTabIndicator}
              />
            )}
          </Pressable>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {filterEvents().map((event) => renderEventCard(event))}

        {filterEvents().length === 0 && (
          <Animatable.View
            animation="fadeIn"
            duration={800}
            style={styles.emptyState}
          >
            <Ionicons name="calendar" size={wp("20%")} color="#E5E5EA" />
            <Text style={styles.emptyStateTitle}>No {selectedTab} events</Text>
            <Text style={styles.emptyStateSubtitle}>
              Your {selectedTab} events will appear here
            </Text>
          </Animatable.View>
        )}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showQR}
        onRequestClose={() => setShowQR(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowQR(false)}>
          <BlurView intensity={90} tint="light" style={styles.modalContent}>
            <Animatable.View
              animation="zoomIn"
              duration={300}
              style={styles.qrContainer}
            >
              {isQRLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#0000ff" />
                  <Text style={styles.loadingText}>Loading QR Code...</Text>
                </View>
              ) : (
                <Image
                  source={{ uri: selectedEventQR }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              )}
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowQR(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </Animatable.View>
          </BlurView>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? hp("6%") : hp("4%"),
    paddingHorizontal: wp("4%"),
    paddingBottom: hp("2%"),
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: wp("6%"),
    fontWeight: "800",
    color: "#000",
    marginLeft: wp("4%"),
  },
  backButton: {
    zIndex: 1,
  },
  backButtonBlur: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: wp("4%"),
    backgroundColor: "white",
    paddingBottom: hp("2%"),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 100, // match this with your QR image height
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  tab: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    alignItems: "center",
    position: "relative",
  },
  activeTab: {
    backgroundColor: "transparent",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: -hp("0.5%"),
    width: wp("10%"),
    height: 3,
    backgroundColor: "#007AFF",
    borderRadius: 1.5,
  },
  tabText: {
    fontSize: wp("4%"),
    color: "#8E8E93",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#007AFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: wp("4%"),
  },
  eventCard: {
    backgroundColor: "white",
    borderRadius: wp("5%"),
    marginBottom: wp("4%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  cardHeader: {
    padding: wp("4%"),
  },
  eventTitleContainer: {
    flex: 1,
  },
  eventName: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: "white",
    marginBottom: hp("1%"),
  },
  eventContent: {
    padding: wp("4%"),
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("4%"),
  },
  statusText: {
    fontSize: wp("3.5%"),
    fontWeight: "600",
  },
  eventDetails: {
    marginTop: hp("1%"),
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1.5%"),
  },
  iconContainer: {
    width: wp("10%"),
    height: wp("10%"),
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: wp("5%"),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp("3%"),
  },
  detailText: {
    fontSize: wp("4%"),
    color: "#3A3A3C",
    fontWeight: "500",
  },
  qrButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: hp("1.5%"),
    borderRadius: wp("3%"),
    marginTop: hp("2%"),
  },
  qrButtonText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "600",
    marginRight: wp("2%"),
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("10%"),
  },
  emptyStateTitle: {
    fontSize: wp("5%"),
    fontWeight: "600",
    color: "#3A3A3C",
    marginTop: hp("2%"),
  },
  emptyStateSubtitle: {
    fontSize: wp("4%"),
    color: "#8E8E93",
    marginTop: hp("1%"),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: wp("80%"),
    padding: wp("8%"),
    borderRadius: wp("5%"),
    alignItems: "center",
    overflow: "hidden",
  },
  qrContainer: {
    alignItems: "center",
    backgroundColor: "white",
    padding: wp("5%"),
    borderRadius: wp("4%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  qrImage: {
    width: wp("60%"),
    height: wp("60%"),
    marginBottom: hp("2%"),
  },
  closeButton: {
    marginTop: hp("2%"),
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("8%"),
    backgroundColor: "#007AFF",
    borderRadius: wp("3%"),
  },
  closeButtonText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
});

export default MyEventsScreen;
