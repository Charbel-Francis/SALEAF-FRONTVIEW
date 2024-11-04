import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import React from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import { Card, Searchbar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
const Home = () => {
  return (
    <View>
      <LinearGradient
        colors={["#15783D", "#15783D", "black"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ borderRadius: 40, margin: 10 }}
      >
        <Card
          style={{
            backgroundColor: "transparent",
            borderRadius: 40,
          }}
        >
          <Card.Content>
            <Image
              source={images.clearLogo}
              style={{ width: 100, height: 50 }}
            />
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "white" }}>Home</Text>
              <CustomButton title="Logout" onPress={() => {}} />
            </View>
          </Card.Content>
        </Card>
      </LinearGradient>
    </View>
  );
};

export default Home;
