import React from "react";
import { Text, View } from "react-native";
import { Card } from "react-native-paper";
import CustomButton from "@/components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useAuth } from "@/context/JWTContext";
import { useAuthVisibility } from "@/context/AuthVisibilityContext";
import { useRouter } from "expo-router";

const Apply_Funding_Card = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const { showSignIn } = useAuthVisibility();
  const isAuthenticated = () => {
    return authState?.authenticated === true;
  };

  return (
    <Card
      style={{
        backgroundColor: "white",
        borderRadius: wp("2.5%"),
        margin: wp("2.5%"),
        minHeight: hp("12%"),
      }}
    >
      <Card.Content>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: hp("1%"),
            gap: wp("4%"),
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: wp("4.5%"),
                flexWrap: "wrap",
                fontWeight: "600",
              }}
            >
              Are you a university student?
            </Text>
          </View>

          {/* Button container */}
          <View style={{ minWidth: wp("35%") }}>
            <CustomButton
              title="Apply for Funding"
              style={{
                backgroundColor: "blue",
                paddingVertical: hp("1%"),
                paddingHorizontal: wp("3%"),
                borderRadius: wp("1.5%"),
              }}
              textStyle={{
                fontSize: wp("3.5%"),
                color: "white",
                textAlign: "center",
              }}
              onPress={() => {
                isAuthenticated()
                  ? router.navigate("/pages/Application_Form")
                  : showSignIn();
              }}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default Apply_Funding_Card;
