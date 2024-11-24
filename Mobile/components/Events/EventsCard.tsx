import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import Animated from "react-native-reanimated";
import { View, StyleSheet, Pressable, Text, Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  containerTransition,
  sharedTransition,
} from "../transitions/sharedTransitions";

export default function EventDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { id, title, location, date, packages, imageUrl, starttime, endtime } =
    params;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    imageContainer: {
      height: hp("50%"),
      width: "100%",
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    backButton: {
      position: "absolute",
      top: hp("6%"),
      left: wp("4%"),
      backgroundColor: "rgba(255,255,255,0.9)",
      borderRadius: wp("6%"),
      padding: wp("2%"),
    },
    blurContainer: {
      position: "absolute",
      height: hp("25%"),
      bottom: 0,
      left: 0,
      right: 0,
      overflow: "hidden",
      padding: wp("4%"),
    },
    infoContainer: {
      flex: 1,
    },
    title: {
      fontSize: wp("6%"),
      fontWeight: "700",
      color: "white",
      marginBottom: hp("2%"),
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp("1.5%"),
    },
    infoText: {
      color: "white",
      fontSize: wp("4%"),
      marginLeft: wp("2%"),
    },
    priceContainer: {
      position: "absolute",
      bottom: hp("4%"),
      right: wp("4%"),
    },
    priceLabel: {
      color: "white",
      fontSize: wp("3.8%"),
    },
    priceValue: {
      color: "white",
      fontSize: wp("5%"),
      fontWeight: "700",
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.imageContainer}>
        <Animated.View
          sharedTransitionTag={`event-container-${id}`}
          sharedTransitionStyle={containerTransition}
          style={{ flex: 1 }}
        >
          <Animated.Image
            source={{ uri: imageUrl as string }}
            sharedTransitionTag={`event-image-${id}`}
            sharedTransitionStyle={sharedTransition}
            style={styles.image}
          />
        </Animated.View>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="close" size={wp("6%")} color="black" />
        </Pressable>

        <BlurView
          intensity={30}
          style={[
            styles.blurContainer,
            { backgroundColor: "rgba(0, 0, 0, 0.8)" },
          ]}
        >
          <View style={styles.infoContainer}>
            <Animated.Text
              sharedTransitionTag={`event-title-${id}`}
              sharedTransitionStyle={sharedTransition}
              style={styles.title}
            >
              {title}
            </Animated.Text>

            <View style={styles.infoRow}>
              <Ionicons name="location" size={wp("5.5%")} color="white" />
              <Animated.Text
                sharedTransitionTag={`event-location-${id}`}
                sharedTransitionStyle={sharedTransition}
                style={styles.infoText}
              >
                {location}
              </Animated.Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={wp("5.5%")} color="white" />
              <Animated.Text
                sharedTransitionTag={`event-date-${id}`}
                sharedTransitionStyle={sharedTransition}
                style={styles.infoText}
              >
                {date}
              </Animated.Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time" size={wp("5.5%")} color="white" />
              <Text style={styles.infoText}>
                {starttime} - {endtime}
              </Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Starting from:</Text>
            <Text style={styles.priceValue}>{packages[0]}</Text>
          </View>
        </BlurView>
      </View>
    </View>
  );
}
