import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Card } from "react-native-paper";

const Navigation_Cards = () => {
  return (
    <View className="flex-row items-center justify-evenly">
      <TouchableOpacity onPress={() => {}}>
        <Card
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            margin: 5,
          }}
        >
          <Card.Content>
            <View className="flex-col items-center w-[8vh] h-[6vh]">
              <Image source={images.event} className="h-10 w-10" />
              <Text className="p-1 text-base font-bold">Events</Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {}}>
        <Card
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            margin: 10,
          }}
        >
          <Card.Content>
            <View className="flex-col items-center w-[8vh] h-[6vh]">
              <Image source={images.graduated} className="h-10 w-10" />
              <Text className="p-1 text-base font-bold">Students</Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </View>
  );
};

export default Navigation_Cards;
