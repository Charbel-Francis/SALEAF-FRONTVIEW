import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import Animated from "react-native-reanimated";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { sharedTransition } from "@/components/transitions/sharedTransitions";
import { useState, useEffect } from "react";
import RegistrationDialog from "@/components/Events/Register_Dialog";
import { useAuth } from "@/context/JWTContext";
import { useAuthVisibility } from "@/context/AuthVisibilityContext";
import { EventInterface } from "@/types/types";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

interface RegistrationData {
  package: string;
  quantity: number;
  totalPrice: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function EventDetailScreen() {
  const params = useLocalSearchParams();
  const { authState } = useAuth();
  const { showSignIn } = useAuthVisibility();
  const router = useRouter();
  const [registrationVisible, setRegistrationVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [evtPackages, setevtPackages] = useState<EventInterface["packages"]>(
    []
  );
  const [eventPackages, setEventPackages] = useState<
    EventInterface["packages"]
  >([]);

  const {
    eventId,
    eventName,
    eventDescription,
    location,
    eventImageUrl,
    startDate,
    endDate,
    startTime,
    endTime,
    status,
    packages,
  } = params as unknown as EventInterface;

  useEffect(() => {
    if (params) {
      try {
        const parsedPackages = Array.isArray(packages)
          ? packages.map((pkg) =>
              typeof pkg === "string" ? JSON.parse(pkg) : pkg
            )
          : [];

        setEventPackages(parsedPackages);
        getPackages();
        console.log(eventImageUrl);
      } catch (error) {
        console.error("Error parsing packages:", error);
        setEventPackages([]);
      }
      setIsLoading(false);
    }
  }, []);

  const handleRegistration = (registrationData: RegistrationData) => {
    setRegistrationVisible(false);
  };

  const openRegistration = () => {
    try {
      if (authState?.authenticated) {
        setRegistrationVisible(true);
      } else {
        showSignIn();
      }
    } catch (error) {
      console.error("Error in openRegistration:", error);
    }
  };

  const getPackages = () => {
    try {
      let eventPackages;
      if (typeof packages === "string") {
        eventPackages = JSON.parse(packages);
      } else if (Array.isArray(packages)) {
        eventPackages = packages;
      }

      setevtPackages(eventPackages);
    } catch (error) {
      console.error("Error getting packages:", error);
    }
  };

  const getStartingPrice = () => {
    try {
      let parsedPackages;
      if (typeof packages === "string") {
        parsedPackages = JSON.parse(packages);
      } else if (Array.isArray(packages)) {
        parsedPackages = packages;
      } else {
        return "N/A";
      }
      if (parsedPackages && parsedPackages.length > 0) {
        const prices: number[] = (parsedPackages as { packagePrice: number }[])
          .map((pkg) => pkg.packagePrice)
          .filter((price): price is number => Boolean(price));
        if (prices.length > 0) {
          const minPrice = Math.min(...prices);
          return `R${minPrice.toFixed(2)}`;
        }
      }
      return "N/A";
    } catch (error) {
      console.error("Error processing price:", error);
      return "N/A";
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.scrollView} bounces={false}>
        <View style={styles.imageContainer}>
          <Animated.View
            sharedTransitionTag={`card-container-${eventId}`}
            sharedTransitionStyle={sharedTransition}
            style={[StyleSheet.absoluteFill, { overflow: "hidden" }]}
          >
            <Animated.Image
              source={{ uri: eventImageUrl as string }}
              sharedTransitionTag={`card-image-${eventId}`}
              sharedTransitionStyle={sharedTransition}
              style={[StyleSheet.absoluteFill]}
              resizeMode="cover"
            />
          </Animated.View>

          <BlurView
            intensity={30}
            style={[
              styles.blurContainer,
              { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            ]}
          >
            <View style={styles.infoTextContainer}>
              <Animated.Text
                sharedTransitionTag={`event-title-${eventId}`}
                sharedTransitionStyle={sharedTransition}
                style={styles.title}
              >
                {eventName}
              </Animated.Text>
            </View>
          </BlurView>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.detailsCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="location" size={wp("6%")} color="#007AFF" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Location</Text>
                <Animated.Text
                  sharedTransitionTag={`event-location-${eventId}`}
                  sharedTransitionStyle={sharedTransition}
                  style={styles.infoText}
                >
                  {location}
                </Animated.Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar" size={wp("6%")} color="#007AFF" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Date</Text>
                <Animated.Text
                  sharedTransitionTag={`event-date-${eventId}`}
                  sharedTransitionStyle={sharedTransition}
                  style={styles.infoText}
                >
                  {startDate} - {endDate}
                </Animated.Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="time" size={wp("6%")} color="#007AFF" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoText}>
                  {startTime} - {endTime}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="people" size={wp("6%")} color="#007AFF" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Capacity</Text>
                <Text style={styles.infoText}>200</Text>
              </View>
            </View>
          </View>

          {eventDescription && (
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionTitle}>About Event</Text>
              <Text style={styles.descriptionText}>{eventDescription}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Starting from</Text>
          <Text style={styles.priceValue}>{getStartingPrice()}</Text>
        </View>
        <Pressable style={styles.bookButton} onPress={openRegistration}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </Pressable>
      </View>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <BlurView intensity={80} style={styles.backButtonBlur}>
          <Ionicons name="arrow-back" size={wp("6%")} color="black" />
        </BlurView>
      </Pressable>

      <RegistrationDialog
        visible={registrationVisible}
        onDismiss={() => setRegistrationVisible(false)}
        onSubmit={handleRegistration}
        eventTitle={eventName}
        packages={evtPackages}
        cancelUrl={`http://localhost:3000/cancel`}
        successUrl={`http://localhost:3000/success`}
        failureUrl={`http://localhost:3000/failure`}
        currency="ZAR"
        eventId={eventId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: hp("45%"),
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  blurContainer: {
    position: "absolute",
    height: hp("15%"),
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    padding: wp("4%"),
    justifyContent: "flex-end",
  },
  contentContainer: {
    padding: wp("4%"),
    paddingBottom: hp("12%"),
  },
  detailsCard: {
    backgroundColor: "white",
    borderRadius: wp("4%"),
    padding: wp("4%"),
    marginBottom: wp("4%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  descriptionCard: {
    backgroundColor: "white",
    borderRadius: wp("4%"),
    padding: wp("4%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: wp("7%"),
    fontWeight: "800",
    color: "white",
    marginBottom: hp("1%"),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  iconContainer: {
    width: wp("12%"),
    height: wp("12%"),
    backgroundColor: "#F0F8FF",
    borderRadius: wp("6%"),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp("3%"),
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: wp("3.5%"),
    color: "#666",
    marginBottom: hp("0.5%"),
  },
  infoText: {
    fontSize: wp("4%"),
    color: "#333",
    fontWeight: "600",
  },
  descriptionTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "700",
    color: "#333",
    marginBottom: hp("1%"),
  },
  descriptionText: {
    fontSize: wp("4%"),
    color: "#666",
    lineHeight: wp("6%"),
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: wp("3.5%"),
    color: "#666",
  },
  priceValue: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: "#333",
  },
  bookButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: wp("8%"),
    paddingVertical: hp("1.5%"),
    borderRadius: wp("3%"),
    marginLeft: wp("4%"),
  },
  bookButtonText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
  backButton: {
    position: "absolute",
    top: hp("6%"),
    left: wp("4%"),
    zIndex: 1,
  },
  backButtonBlur: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
