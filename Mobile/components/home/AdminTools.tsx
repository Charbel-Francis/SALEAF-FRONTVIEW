import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";

interface ToolCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  onPress: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.toolCard} onPress={onPress}>
    <MaterialIcons name={icon} size={wp("6%")} color="#1a1a1a" />
    <Text style={styles.toolCardText}>{title}</Text>
  </TouchableOpacity>
);

export const AdminTools: React.FC = () => {
  const router = useRouter();
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Admin Tools</Text>
      <View style={styles.adminTools}>
        <ToolCard
          icon="people"
          title="Student Management"
          onPress={() =>
            router.navigate(
              "/pages/AdminWebView?url=https://saleaffrontend-production.up.railway.app/apps/studentMarkList/studentMarkList"
            )
          }
        />
        <ToolCard
          icon="event"
          title="Event Management"
          onPress={() =>
            router.navigate(
              "/pages/AdminWebView?url=https://saleaffrontend-production.up.railway.app/apps/event/event-list"
            )
          }
        />
        <ToolCard
          icon="assessment"
          title="Reports"
          onPress={() =>
            router.navigate(
              "/pages/AdminWebView?url=https://saleaffrontend-production.up.railway.app/dashboard/default"
            )
          }
        />
        <ToolCard
          icon="money"
          title="Bank Details"
          onPress={() =>
            router.navigate(
              "/pages/AdminWebView?url=https://saleaffrontend-production.up.railway.app/apps/banking-info/banking-info"
            )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: hp("3%"),
    paddingHorizontal: wp("5%"),
  },
  sectionTitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#666666",
    marginBottom: hp("2%"),
  },
  adminTools: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: wp("3%"),
  },
  toolCard: {
    backgroundColor: "#ffffff",
    width: wp("42%"),
    padding: wp("4%"),
    borderRadius: wp("3%"),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: hp("2%"),
  },
  toolCardText: {
    color: "#1a1a1a",
    fontSize: wp("3.5%"),
    fontWeight: "500",
    marginTop: hp("1%"),
    textAlign: "center",
  },
});
