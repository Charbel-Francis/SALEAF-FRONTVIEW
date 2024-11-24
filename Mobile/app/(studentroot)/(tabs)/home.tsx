import Apply_Funding_Card from "@/components/home/Apply_Funding_Card";
import Event_Card from "@/components/home/Events_Card";
import Login_Card from "@/components/home/Login_Card";
import Navigation_Cards from "@/components/home/Navigations_Card";
import Student_Profile_Card from "@/components/home/Student_Profile_Card";
import StudentMarksUpload from "@/components/home/UploadMarks";
import axiosInstance from "@/utils/config";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Platform,
  Text,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Home = () => {
  const [canUpload, setCanUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    scrollContainer: {
      flexGrow: 1,
      height: hp("65%"),
    },
    scrollContent: {
      paddingBottom: hp("1%"),
    },
    cardSpacing: {
      marginVertical: hp("1%"),
    },
    contentWrapper: {
      flex: 1,
      paddingBottom: Platform.OS === "ios" ? hp("8%") : hp("10%"),
    },
    errorContainer: {
      padding: 16,
      backgroundColor: "#ffebee",
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 8,
    },
    errorText: {
      color: "#d32f2f",
      fontSize: 14,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.cardSpacing}>
            <StudentMarksUpload />
          </View>

          <View style={styles.cardSpacing}>
            <Event_Card />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;
