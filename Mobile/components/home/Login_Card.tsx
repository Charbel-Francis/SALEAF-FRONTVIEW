import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import React from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Searchbar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

const Login_Card = () => {
  return (
    <LinearGradient
      colors={[
        "rgba(21, 120, 61, 0.4)",
        "rgba(21, 120, 61, 0.8)",
        "rgba(0, 0, 0, 0.8)",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        borderRadius: 40,
        margin: 10,
        position: "relative",
      }}
    >
      <View
        style={{
          position: "absolute",
          bottom: -20,
          left: -10,
          width: 120,
          height: 115,
          borderWidth: 1,
          borderColor: "white",
          borderRadius: 120,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            position: "absolute",
            bottom: -60,
            left: -40,
            width: 100,
            height: 100,
            borderWidth: 1,
            borderColor: "white",
            borderRadius: 100,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: -40,
            left: -30,
            width: 110,
            height: 100,
            borderWidth: 1,
            borderColor: "white",
            borderRadius: 150,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: -80,
            left: -50,
            width: 100,
            height: 100,
            borderWidth: 1,
            borderColor: "white",
            borderRadius: 100,
          }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          right: -20,
          top: "35%",
          width: 100,
          height: 100,
          borderWidth: 1,
          borderColor: "white",
          borderRadius: 100,
        }}
      />
      <View
        style={{
          position: "absolute",
          right: -40,
          top: "35%",
          width: 100,
          height: 100,
          borderWidth: 1,
          borderColor: "white",
          borderRadius: 100,
        }}
      />

      <View
        style={{
          position: "absolute",
          right: 0,
          top: "35%",
          width: 100,
          height: 100,
          borderWidth: 1,
          borderColor: "white",
          borderRadius: 100,
        }}
      />

      <Card
        style={{
          backgroundColor: "transparent",
          borderRadius: 40,
        }}
      >
        <Card.Content>
          <View className="flex-col h-[18vh]">
            <View className="flex-row top-0 w-full justify-between">
              <Image source={images.clearLogo} className=" h-[8vh] w-[10vh] " />
              <View className="flex-3 p-3 flex-row justify-between">
                <View className="p-2">
                  <TouchableOpacity onPress={() => {}}>
                    <Ionicons name="notifications" size={32} />
                  </TouchableOpacity>
                </View>
                <View className="p-2">
                  <TouchableOpacity onPress={() => {}}>
                    <Ionicons name="settings" size={32} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View className="flex-col px-5">
              <Text className="text-2xl text-white overflow-hidden pb-5">
                Welcome to SALEAF mobile app
              </Text>
              <CustomButton
                title="Click Here to Login or SignUp"
                className="bg- bg-black h-15"
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
