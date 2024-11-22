import { AdminTools } from "@/components/home/AdminTools";
import { QuickActions } from "@/components/home/QuickActions";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const AdminHome: React.FC = () => {
  const router = useRouter();
  const handleScanPress = () => {
    router.push({ pathname: "/pages/barcode" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <QuickActions onScanPress={handleScanPress} />
        <AdminTools />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp("5%"),
  },
});

export default AdminHome;
