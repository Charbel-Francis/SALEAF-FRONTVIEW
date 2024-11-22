import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface QuickActionsProps {
  onScanPress: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onScanPress }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.scannerButton} onPress={onScanPress}>
          <View style={styles.iconContainer}>
            <MaterialIcons
              name="qr-code-scanner"
              size={wp("8%")}
              color="#ffffff"
            />
          </View>
          <Text style={styles.scannerButtonText}>Scan Event QR Code</Text>
          <Text style={styles.scannerButtonSubText}>Verify Event Entry</Text>
        </TouchableOpacity>
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
  quickActions: {
    backgroundColor: "#ffffff",
    borderRadius: wp("3%"),
    padding: wp("4%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scannerButton: {
    backgroundColor: "#007AFF",
    borderRadius: wp("3%"),
    padding: wp("4%"),
  },
  iconContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: wp("3%"),
    borderRadius: wp("2%"),
    alignSelf: "flex-start",
    marginBottom: hp("1%"),
  },
  scannerButtonText: {
    color: "#ffffff",
    fontSize: wp("4.5%"),
    fontWeight: "600",
    marginTop: hp("1%"),
  },
  scannerButtonSubText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: wp("3.5%"),
    marginTop: hp("0.5%"),
  },
});
