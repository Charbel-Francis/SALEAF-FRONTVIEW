import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import React from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Login_Card = () => {
  const styles = StyleSheet.create({
    gradient: {
      borderRadius: wp("10%"),
      margin: wp("2%"),
      position: "relative",
      minHeight: hp("30%"),
    },
    leftCircle: {
      position: "absolute",
      bottom: hp("-2.5%"),
      left: wp("-2.5%"),
      width: wp("30%"),
      height: wp("30%"),
      borderWidth: 1,
      borderColor: "white",
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
      borderColor: "white",
      borderRadius: wp("25%"),
    },
    nestedCircle2: {
      position: "absolute",
      bottom: hp("-5%"),
      left: wp("-7.5%"),
      width: wp("27.5%"),
      height: wp("25%"),
      borderWidth: 1,
      borderColor: "white",
      borderRadius: wp("37.5%"),
    },
    nestedCircle3: {
      position: "absolute",
      bottom: hp("-10%"),
      left: wp("-12.5%"),
      width: wp("25%"),
      height: wp("25%"),
      borderWidth: 1,
      borderColor: "white",
      borderRadius: wp("25%"),
    },
    rightCircleGroup: {
      position: "absolute",
      right: wp("-5%"),
      top: "35%",
    },
    rightCircle1: {
      width: wp("25%"),
      height: wp("25%"),
      borderWidth: 1,
      borderColor: "white",
      borderRadius: wp("25%"),
      position: "absolute",
    },
    rightCircle2: {
      width: wp("25%"),
      height: wp("25%"),
      borderWidth: 1,
      borderColor: "white",
      borderRadius: wp("25%"),
      position: "absolute",
      right: wp("-5%"),
    },
    rightCircle3: {
      width: wp("25%"),
      height: wp("25%"),
      borderWidth: 1,
      borderColor: "white",
      borderRadius: wp("25%"),
      position: "absolute",
      right: wp("5%"),
    },
    card: {
      backgroundColor: "transparent",
      borderRadius: wp("10%"),
    },
    contentContainer: {
      height: hp("20%"),
      justifyContent: "space-between",
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: hp("1%"),
    },
    logo: {
      height: hp("10%"),
      width: wp("30%"),
      resizeMode: "contain",
    },
    iconsContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: wp("2%"),
    },
    icon: {
      padding: wp("2%"),
    },
    welcomeContainer: {
      paddingHorizontal: wp("5%"),
      paddingBottom: hp("2%"),
    },
    welcomeText: {
      fontSize: wp("5%"),
      color: "white",
      paddingBottom: hp("2%"),
    },
  });

  return (
    <LinearGradient
      colors={[
        "rgba(21, 120, 61, 0.4)",
        "rgba(21, 120, 61, 0.8)",
        "rgba(0, 0, 0, 0.8)",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
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
        <Card.Content>
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Image source={images.clearLogo} style={styles.logo} />
              <View style={styles.iconsContainer}>
                <TouchableOpacity style={styles.icon} onPress={() => {}}>
                  <Ionicons
                    name="notifications"
                    size={wp("8%")}
                    color="black"
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.icon} onPress={() => {}}>
                  <Ionicons name="settings" size={wp("8%")} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.welcomeContainer}>
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
                onPress={() => {}}
              />
            </View>
          </View>
        </Card.Content>
      </Card>
    </LinearGradient>
  );
};

export default Login_Card;
