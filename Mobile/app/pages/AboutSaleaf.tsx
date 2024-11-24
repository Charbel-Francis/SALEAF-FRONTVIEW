import { images } from "@/constants";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeInLeft,
  FadeInRight,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import axiosInstance from "@/utils/config";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface Director {
  directorName: string;
  directorLastName: string;
  directorImage: string;
  directorDescription: string;
}
interface BankDetails {
  branch: string;
  branchCode: string;
  accountNo: string;
}

interface HeaderProps {
  scrollY: Animated.SharedValue<number>;
  navigation: any;
}
// Header Component with blur effect and animations
const Header: React.FC<HeaderProps> = ({ scrollY, navigation }) => {
  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [0, 1],
      Extrapolate.CLAMP
    );
    return {
      backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    };
  });

  return (
    <Animated.View style={[styles.header, headerStyle]}>
      <BlurView intensity={100} style={[StyleSheet.absoluteFill]} />
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { opacity: 1 }]} // Force opacity to 1
        >
          <Ionicons name="chevron-back" size={wp("6%")} color="#1F2937" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Animated.Text
          style={[styles.headerTitle, { opacity: scrollY.value > 20 ? 1 : 0 }]}
        >
          About Us
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

// Director Card Component
const DirectorCard: React.FC<{ director: Director; index: number }> = ({
  director,
  index,
}) => {
  const AnimatedContainer = index % 2 === 0 ? FadeInLeft : FadeInRight;

  return (
    <Animated.View
      entering={AnimatedContainer.duration(800).delay(index * 200)}
      style={[styles.card, styles.directorCard]}
    >
      <View style={styles.imageContainer}>
        <LinearGradient
          colors={[
            "rgba(0,0,0,0)",
            "rgba(0,0,0,0.2)",
            "rgba(0,0,0,0.6)",
            "rgba(0,0,0,0.8)",
          ]}
          locations={[0, 0.5, 0.8, 1]}
          style={styles.imageGradient}
        />

        <Image
          source={{ uri: director.directorImage }}
          style={styles.directorImage}
          resizeMode="cover"
        />

        <View style={styles.directorOverlay}>
          <Text style={styles.directorFirstName}>{director.directorName}</Text>
          <Text style={styles.directorLastName}>
            {director.directorLastName}
          </Text>
        </View>
      </View>

      <View style={styles.directorInfo}>
        <View style={styles.pillIndicator} />

        <Text style={styles.directorDescription}>
          {director.directorDescription}
        </Text>
      </View>
    </Animated.View>
  );
};
const AboutUs: React.FC = () => {
  const navigation = useNavigation();
  const scrollY = useSharedValue(0);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetails[]>([]);
  useEffect(() => {
    axiosInstance.get("/api/Director/get-all-director").then((response) => {
      setDirectors(response.data);
    });
    axiosInstance.get("/api/BankAccountInfo").then((response) => {
      setBankDetails(response.data);
    });
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <Header scrollY={scrollY} navigation={navigation} />

      <AnimatedScrollView
        style={styles.container}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View
          entering={FadeIn.duration(1000)}
          style={styles.heroSection}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.9)", "#ffffff"]}
            style={styles.heroGradient}
          >
            <View style={styles.logoContainer}>
              <Image
                source={images.clearLogo}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.heroTitle}>Building a Better Future</Text>
            <Text style={styles.heroSubtitle}>
              Through innovation, trust, and community empowerment
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Mission Statement */}
        <View style={styles.mainContent}>
          <Animated.View
            entering={FadeIn.duration(800).delay(200)}
            style={[styles.card, styles.missionCard]}
          >
            <View style={styles.missionHeader}>
              <Ionicons name="flag-outline" size={wp("6%")} color="#10B981" />
              <Text style={styles.sectionTitle}>Our Mission</Text>
            </View>
            <Text style={styles.missionText}>
              SALEAF is a registered NPO and owes its origin to a body of the
              same name founded in the 1970's by a group of South African
              Lebanese businessmen who identified the need to raise funds to
              assist in the education of members of their community...
            </Text>
          </Animated.View>

          {/* Directors Section */}
          <View style={styles.sectionContainer}>
            <Animated.View
              entering={FadeIn.duration(800).delay(400)}
              style={[styles.sectionHeader, styles.directorsSectionHeader]}
            >
              <Ionicons name="people-outline" size={wp("6%")} color="#10B981" />
              <Text style={styles.sectionTitle}>Our Leadership</Text>
            </Animated.View>

            <View style={styles.directorsGrid}>
              {directors.map((director, index) => (
                <DirectorCard key={index} director={director} index={index} />
              ))}
            </View>
          </View>

          {/* Bank Details Section */}
          <View style={styles.sectionContainer}>
            <Animated.View
              entering={FadeIn.duration(800).delay(600)}
              style={[styles.card, styles.bankingCard]}
            >
              <LinearGradient
                colors={["#ffffff", "#f7f9fc"]}
                style={styles.bankingGradient}
              >
                <View style={styles.sectionHeader}>
                  <Ionicons
                    name="business-outline"
                    size={wp("6%")}
                    color="#10B981"
                  />
                  <Text style={styles.sectionTitle}>Banking Information</Text>
                </View>

                <View style={styles.bankDetailsContainer}>
                  <View style={styles.bankDetailsSection}>
                    <Text style={styles.bankDetailsSectionTitle}>
                      Bank Details
                    </Text>
                    {bankDetails.map((detail, index) => (
                      <Animated.View
                        key={index}
                        entering={FadeInLeft.duration(800).delay(
                          700 + index * 100
                        )}
                        style={styles.detailItem}
                      >
                        <View style={styles.detailsContainer}>
                          <Text style={styles.detailsText}></Text>

                          <Text style={styles.detailsText}>
                            Branch: {detail.branch}
                          </Text>
                          <Text style={styles.detailsText}>
                            Branch Code: {detail.branchCode}
                          </Text>
                          <Text style={styles.detailsText}>
                            Account Number: {detail.accountNo}
                          </Text>
                        </View>
                      </Animated.View>
                    ))}
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          </View>
        </View>
      </AnimatedScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: Platform.OS === "ios" ? hp("12%") : hp("8%"),
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp("4%"),
    paddingTop: Platform.OS === "ios" ? hp("4%") : hp("2%"),
  },
  backButton: {
    position: "absolute",
    left: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
    paddingTop: Platform.OS === "ios" ? hp("4%") : hp("2%"),
    // Add background for better visibility when at top
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: wp("2%"),
    borderRadius: wp("5%"),
  },
  backText: {
    fontSize: wp("4%"),
    color: "#1F2937",
    marginLeft: wp("1%"),
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: wp("5%"),
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
  },
  heroSection: {
    height: hp("45%"),
    backgroundColor: "#ffffff",
    marginTop: Platform.OS === "ios" ? hp("4%") : 0,
  },
  heroGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp("6%"),
  },
  logoContainer: {
    marginBottom: hp("4%"),
    alignItems: "center",
  },
  logo: {
    width: wp("50%"),
    height: hp("10%"),
  },
  heroTitle: {
    fontSize: wp("8%"),
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: hp("2%"),
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: wp("4.5%"),
    color: "#4B5563",
    textAlign: "center",
    lineHeight: wp("6%"),
    maxWidth: wp("80%"),
    opacity: 0.8,
  },
  mainContent: {
    padding: wp("4%"),
    paddingTop: 0,
  },
  missionCard: {
    marginTop: -hp("5%"),
    backgroundColor: "#ffffff",
    borderRadius: wp("6%"),
    padding: wp("6%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  detailsContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: wp("2.5%"),
    padding: wp("4%"),
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  detailsText: {
    fontSize: wp("3.8%"), // Reduced from 4%
    color: "#333",
    marginBottom: hp("1%"),
    lineHeight: hp("2.5%"),
  },
  missionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  missionText: {
    fontSize: wp("3.8%"),
    color: "#4B5563",
    lineHeight: wp("5.5%"),
    letterSpacing: 0.2,
  },
  sectionContainer: {
    marginTop: hp("3%"),
  },
  directorsSectionHeader: {
    marginVertical: hp("3%"),
    paddingHorizontal: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
  },
  directorsGrid: {
    flexDirection: "column",
    gap: hp("2%"),
  },
  imageContainer: {
    position: "relative",
    height: hp("30%"),
    borderRadius: wp("4%"),
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: hp("15%"),
    zIndex: 1,
  },
  bankingGradient: {
    borderRadius: wp("4%"),
    padding: wp("5%"),
  },
  card: {
    backgroundColor: "white",
    borderRadius: wp("4%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: hp("2.5%"),
  },

  directorCard: {
    overflow: "hidden",
    padding: 0,
  },

  directorImage: {
    width: "100%",
    height: "100%",
    transform: [{ scale: 1.02 }], // Slight scale for better coverage
  },

  directorOverlay: {
    position: "absolute",
    bottom: hp("2.5%"),
    left: 0,
    right: 0,
    padding: wp("5%"),
    zIndex: 2,
  },

  directorFirstName: {
    fontSize: wp("6%"),
    fontWeight: "600",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  directorLastName: {
    fontSize: wp("5%"),
    fontWeight: "600",
    color: "#ffffff",
    opacity: 0.9,
    marginTop: 4,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  directorInfo: {
    backgroundColor: "#FFFFFF",
    padding: wp("4%"),
    borderTopWidth: 1,
    borderTopColor: "rgba(229, 231, 235, 0.5)",
  },

  pillIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginBottom: hp("1.5%"),
    alignSelf: "center",
  },

  directorRole: {
    fontSize: wp("3.8%"),
    color: "#10B981",
    marginBottom: hp("1%"),
    fontWeight: "500",
    textAlign: "center",
  },

  directorDescription: {
    fontSize: wp("3.5%"),
    color: "#4B5563",
    lineHeight: wp("5.5%"),
    letterSpacing: 0.1,
    textAlign: "left",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  sectionTitle: {
    fontSize: wp("5%"),
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: wp("2%"),
  },
  bankDetailsContainer: {
    marginTop: hp("2%"),
  },
  bankDetailsSection: {
    marginBottom: hp("2.5%"),
  },
  bankDetailsSectionTitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#374151",
    marginBottom: hp("1%"),
    marginLeft: wp("1%"),
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1%"),
    paddingRight: wp("4%"),
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("2%"),
    borderRadius: wp("2%"),
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  detailText: {
    fontSize: wp("3.5%"),
    color: "#4B5563",
    marginLeft: wp("2%"),
    flex: 1,
    letterSpacing: 0.1,
  },
  bankingCard: {
    padding: 0,
    overflow: "hidden",
  },
  missionIcon: {
    width: wp("12%"),
    height: wp("12%"),
    marginRight: wp("3%"),
    tintColor: "#10B981",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: hp("2%"),
  },
  iconContainer: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("3%"),
  },
});

export default AboutUs;
