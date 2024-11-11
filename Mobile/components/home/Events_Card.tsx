import React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { Card } from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";
import { images } from "@/constants"; // Import your images or data as needed
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";

const Event_Card = () => {
  const width = Dimensions.get("window").width;
  const itemHeight = width / 2;
  const events = [
    {
      id: 1,
      title: "Golf Fundraiser",
      location: "Benoni Country Club",
      date: "November 15, 2023",
      price: "R500",
      image: images.golf,
      starttime: "17:38",
      endtime: "17:38",
    },
  ];

  return (
    <View className="flex-col">
      <View className="w-full h-auto px-4 flex-row justify-between">
        <Text className="font-bold text-base">Upcoming Events</Text>
        <Text className="">See All</Text>
      </View>
      <View>
        <Carousel
          loop
          width={width}
          height={itemHeight}
          autoPlay
          data={events}
          autoPlayInterval={8000}
          scrollAnimationDuration={6000}
          snapEnabled
          pagingEnabled
          mode="parallax"
          renderItem={({ index }) => (
            <Card className="h-[25vh]">
              <Image
                source={events[index].image}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  borderRadius: 10,
                }}
              />
              <BlurView
                intensity={30}
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                className="absolute flex-row h-[13vh] justify-between p-2 bottom-2 left-2 right-2 top-15 rounded-xl overflow-hidden"
              >
                <View className="flex-col py-1">
                  <Text className="text-white text-base font-bold px-2">
                    {events[index].title}
                  </Text>
                  <View className="flex-row px-2 py-1">
                    <Ionicons name="location" size={20} color={"white"} />
                    <Text className="text-white text-sm font-bold pl-2">
                      {events[index].location}
                    </Text>
                  </View>
                  <View className="flex-row px-2 py-1">
                    <Ionicons name="calendar" size={20} color={"white"} />
                    <Text className="text-white text-sm font-bold pl-2">
                      {events[index].date}
                    </Text>
                  </View>
                  <View className="flex-row px-2 py-1">
                    <Ionicons name="time" size={20} color={"white"} />
                    <Text className="text-white text-sm font-bold pl-2">
                      {events[index].starttime} - {events[index].endtime}
                    </Text>
                  </View>
                </View>
                <View className="flex-col justify-center">
                  <Text className="text-sm text-white">Starting from:</Text>
                  <Text className="text-base font-bold text-white">
                    {events[index].price}
                  </Text>
                </View>
              </BlurView>
            </Card>
          )}
        />
      </View>
    </View>
  );
};

export default Event_Card;
