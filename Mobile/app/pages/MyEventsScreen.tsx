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
import { useState } from "react";
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const MyEventsScreen = () => {
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "past">(
    "upcoming"
  );
  const [showQR, setShowQR] = useState(false);
  const [selectedEventQR, setSelectedEventQR] = useState("");
  const router = useRouter();

  const myEvents = {
    upcoming: [
      {
        id: 1,
        eventName: "Tech Conference 2024",
        date: "Apr 15, 2024",
        time: "09:00 AM",
        location: "Convention Center",
        status: "confirmed",
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example`,
        gradient: ["#4158D0", "#C850C0"],
      },
      {
        id: 2,
        eventName: "Networking Mixer",
        date: "Apr 20, 2024",
        time: "06:30 PM",
        location: "Downtown Hub",
        status: "pending",
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example`,
        gradient: ["#0093E9", "#80D0C7"],
      },
    ],
    past: [
      {
        id: 3,
        eventName: "Workshop Series",
        date: "Mar 10, 2024",
        time: "02:00 PM",
        location: "Innovation Lab",
        status: "completed",
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example`,
        gradient: ["#8EC5FC", "#E0C3FC"],
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          bg: "rgba(52, 199, 89, 0.1)",
          text: "#34C759",
        };
      case "pending":
        return {
          bg: "rgba(255, 149, 0, 0.1)",
          text: "#FF9500",
        };
      default:
        return {
          bg: "rgba(142, 142, 147, 0.1)",
          text: "#8E8E93",
        };
    }
  };

  const renderEventCard = (event: any) => (
    <Animatable.View
      animation="fadeInUp"
      duration={800}
      delay={event.id * 100}
      key={event.id}
      style={styles.eventCard}
    >
      <LinearGradient
        colors={event.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardHeader}
      >
        <View style={styles.eventTitleContainer}>
          <Text style={styles.eventName}>{event.eventName}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(event.status).bg },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(event.status).text },
              ]}
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
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
            <Text style={styles.detailText}>{event.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="time-outline" size={wp("5%")} color="#007AFF" />
            </View>
            <Text style={styles.detailText}>{event.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="location-outline"
                size={wp("5%")}
                color="#007AFF"
              />
            </View>
            <Text style={styles.detailText}>{event.location}</Text>
          </View>
        </View>

        <Pressable
          style={styles.qrButton}
          onPress={() => {
            setSelectedEventQR(event.qrCode);
            setShowQR(true);
          }}
        >
          <Text style={styles.qrButtonText}>View QR Code</Text>
          <Ionicons name="qr-code-outline" size={wp("5%")} color="white" />
        </Pressable>
      </View>
    </Animatable.View>
  );

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
        {myEvents[selectedTab].map((event) => renderEventCard(event))}

        {myEvents[selectedTab].length === 0 && (
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
              <Image
                source={{ uri: selectedEventQR }}
                style={styles.qrImage}
                resizeMode="contain"
              />
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
