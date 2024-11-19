import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { Card } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  isExpanded,
  onToggle,
}) => {
  const styles = StyleSheet.create({
    card: {
      marginBottom: hp("1%"),
      borderRadius: wp("2%"),
      backgroundColor: "#fff",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: hp("1.5%"),
      paddingHorizontal: wp("3%"),
      borderBottomWidth: isExpanded ? 0.5 : 0,
      borderBottomColor: "#e0e0e0",
    },
    cardTitle: {
      fontSize: wp("4%"),
      fontWeight: "600",
      color: "#2c3e50",
    },
    cardHint: {
      fontSize: wp("2.8%"),
      color: "#e74c3c",
      fontStyle: "italic",
    },
    content: {
      padding: wp("3%"),
      display: isExpanded ? "flex" : "none",
    },
  });

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardHint}>
            {isExpanded ? "tap to close" : "tap to open"}
          </Text>
        </View>
      </TouchableOpacity>
      {isExpanded && <View style={styles.content}>{children}</View>}
    </Card>
  );
};

export default FormSection;
