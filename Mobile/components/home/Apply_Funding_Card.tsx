import CustomButton from "@/components/CustomButton";
import React from "react";
import { Text, View } from "react-native";
import { Card } from "react-native-paper";

const Apply_Funding_Card = () => {
  return (
    <Card
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        margin: 10,
      }}
    >
      <Card.Content>
        <View className="flex-row h-auto">
          <View className="flex-1">
            <Text className="text-xl flex-wrap">
              Are you a university student?
            </Text>
          </View>

          <View className="p-2 flex">
            <CustomButton
              title="Apply for Funding"
              className="w-25 text-xs bg-blue"
              onPress={() => {}}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default Apply_Funding_Card;
