import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import React, { useCallback, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import { Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "@/context/JWTContext";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuthVisibility } from "@/context/AuthVisibilityContext";

// Define ProfileMenu as a named component
const ProfileMenu = React.memo(() => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const { onLogout } = useAuth();
  const { authState } = useAuth();
  const { showSignIn } = useAuthVisibility();
  const router = useRouter();

  const isAuthenticated = () => {
    return authState?.authenticated === true;
  };

  const menuOptions = [
    {
      icon: "person",
      label: "Profile",
      onPress: () => {
        isAuthenticated()
          ? router.navigate("/pages/DonatorsProfile")
          : showSignIn();
        setMenuVisible(false);
      },
    },
    {
      icon: "calendar",
      label: "Events",
      onPress: () => {
        isAuthenticated()
          ? router.navigate("/pages/MyEventsScreen")
          : showSignIn();
        setMenuVisible(false);
      },
    },
    {
      icon: "information-circle",
      label: "About SALEAF",
      onPress: () => {
        router.navigate("/pages/AboutSaleaf");
        setMenuVisible(false);
      },
    },
    isAuthenticated()
      ? {
          icon: "log-out",
          label: "Logout",
          onPress: () => {
            if (onLogout) {
              onLogout();
            }
            setMenuVisible(false);
          },
        }
      : {
          icon: "log-in",
          label: "Login",
          onPress: () => {
            showSignIn();
            setMenuVisible(false);
          },
        },
  ];

  return (
    <View>
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.icon}
      >
        <Ionicons name="person-circle" size={wp("8%")} color="black" />
      </TouchableOpacity>

      <Modal
        visible={isMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          <View style={styles.menuContainer}>
            {menuOptions.map((option, index) => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.menuItem,
                  index !== menuOptions.length - 1 && styles.menuItemBorder,
                ]}
                onPress={option.onPress}
              >
                <Ionicons
                  name={option.icon}
                  size={wp("6%")}
                  color={option.icon === "log-out" ? "#FF4444" : "#4CAF50"}
                />
                <Text
                  style={[
                    styles.menuText,
                    option.icon === "log-out" && styles.logoutText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
});

// Define LoginCard as a named component
const LoginCard = React.memo(() => {
  const route = useRoute();
  const isHomeScreen = route.name === "home";
  const { authState } = useAuth();
  const { showSignIn } = useAuthVisibility();

  const isAuthenticated = () => {
    return authState?.authenticated === true;
  };

  const animatedHeight = new Animated.Value(
    isHomeScreen ? (isAuthenticated() ? 0.8 : 1) : 0
  );

  useFocusEffect(
    useCallback(() => {
      const targetValue = isHomeScreen ? (isAuthenticated() ? 0.6 : 1) : 0;
      animatedHeight.stopAnimation(() => {
        Animated.timing(animatedHeight, {
          toValue: targetValue,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    }, [isHomeScreen, authState?.authenticated])
  );

  return (
    <Animated.View
      style={{
        height: isAuthenticated()
          ? isHomeScreen
            ? hp("20%")
            : hp("10%")
          : isHomeScreen
          ? hp("25%")
          : hp("10%"),
        margin: wp("2%"),
        borderRadius: wp("10%"),
        overflow: "hidden",
      }}
    >
      <LinearGradient
        colors={[
          "rgba(21, 120, 61, 0.4)",
          "rgba(21, 120, 61, 0.8)",
          "rgba(21, 120, 61, 0.8)",
          "rgba(0, 0, 0, 0.8)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.gradient]}
      >
        <View style={styles.leftCircle} />
        <View style={styles.nestedCirclesContainer}>
          <View style={styles.nestedCircle1} />
          <View style={styles.nestedCircle2} />
          <View style={styles.nestedCircle3} />
        </View>

        <View style={styles.rightCircleGroup}>
          <View style={styles.rightCircle1} />
          <View style={styles.rightCircle2} />
          <View style={styles.rightCircle3} />
        </View>

        <Card style={styles.card}>
          <Card.Content style={{ height: "100%" }}>
            <View style={styles.contentContainer}>
              <View style={styles.headerContainer}>
                <Image source={images.clearLogo} style={styles.logo} />
                <View style={styles.iconsContainer}>
                  <TouchableOpacity style={styles.icon} onPress={() => {}}>
                    <Ionicons
                      name="notifications"
                      size={isHomeScreen ? wp("8%") : wp("8%")}
                      color="black"
                    />
                  </TouchableOpacity>
                  <ProfileMenu />
                </View>
              </View>
              {isHomeScreen && (
                <View style={styles.welcomeContainer}>
                  {isAuthenticated() ? (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressHeader}>
                        <Text style={styles.percentageText}>75%</Text>
                      </View>
                      <View style={styles.progressBarContainer}>
                        <Ionicons
                          name="leaf"
                          size={wp("5%")}
                          style={styles.leafIcon}
                        />
                        <View style={styles.progressBarWrapper}>
                          <Animated.View
                            style={[styles.progressBar, { width: "75%" }]}
                          />
                        </View>
                        <Ionicons
                          name="leaf"
                          size={wp("5%")}
                          style={styles.leafIcon}
                        />
                      </View>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.welcomeText}>
                        Welcome to SALEAF mobile app
                      </Text>
                      <CustomButton
                        title="Click Here to Login or SignUp"
                        style={{
                          backgroundColor: "black",
                          minHeight: hp("6%"),
                        }}
                        textStyle={{
                          fontSize: wp("4%"),
                        }}
                        onPress={() => {
                          showSignIn();
                        }}
                      />
                    </>
                  )}
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      </LinearGradient>
    </Animated.View>
  );
});

export default LoginCard;
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    ...Platform.select({
      android: {
        elevation: 0,
      },
    }),
  },
  leftCircle: {
    position: "absolute",
    bottom: hp("-2.5%"),
    left: wp("-2.5%"),
    width: wp("30%"),
    height: wp("30%"),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: wp("30%"),
  },
  nestedCirclesContainer: {
    position: "absolute",
    bottom: hp("1.25%"),
    left: wp("2.5%"),
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  nestedCircle1: {
    position: "absolute",
    bottom: hp("-7.5%"),
    left: wp("-10%"),
    width: wp("25%"),
    height: wp("25%"),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: wp("25%"),
  },
  nestedCircle2: {
    position: "absolute",
    bottom: hp("-5%"),
    left: wp("-7.5%"),
    width: wp("27.5%"),
    height: wp("25%"),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: wp("37.5%"),
  },
  nestedCircle3: {
    position: "absolute",
    bottom: hp("-10%"),
    left: wp("-12.5%"),
    width: wp("25%"),
    height: wp("25%"),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: wp("25%"),
  },
  rightCircleGroup: {
    position: "absolute",
    right: wp("-5%"),
    top: "25%",
  },
  rightCircle1: {
    width: wp("25%"),
    height: wp("25%"),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: wp("25%"),
    position: "absolute",
  },
  rightCircle2: {
    width: wp("25%"),
    height: wp("25%"),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: wp("25%"),
    position: "absolute",
    right: wp("-5%"),
  },
  rightCircle3: {
    width: wp("25%"),
    height: wp("25%"),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: wp("25%"),
    position: "absolute",
    right: wp("5%"),
  },
  card: {
    backgroundColor: "transparent",
    borderRadius: wp("10%"),
    height: "100%",
    ...Platform.select({
      android: {
        elevation: 0,
        shadowColor: "transparent",
      },
      ios: {
        shadowColor: "transparent",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      },
    }),
  },
  contentContainer: {
    height: "100%",
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("2%"),
  },
  logo: {
    height: hp("8%"),
    width: wp("25%"),
    resizeMode: "contain",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1%"),
  },
  icon: {
    padding: wp("1%"),
  },
  welcomeContainer: {
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("2%"),
    backgroundColor: "transparent",
  },
  welcomeText: {
    fontSize: wp("5%"),
    color: "white",
    paddingBottom: hp("2%"),
  },
  progressContainer: {
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("2%"),
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  percentageText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
  },
  progressBarWrapper: {
    flex: 1,
    height: hp("1.5%"),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: wp("2%"),
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: wp("2%"),
  },
  leafIcon: {
    color: "#4CAF50",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: hp("8%"),
    paddingRight: wp("4%"),
  },
  menuContainer: {
    backgroundColor: "white",
    borderRadius: wp("4%"),
    width: wp("45%"),
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("4%"),
    gap: wp("3%"),
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  menuText: {
    fontSize: wp("4%"),
    color: "#333",
    fontWeight: "500",
  },
  logoutText: {
    color: "#FF4444",
  },
});
