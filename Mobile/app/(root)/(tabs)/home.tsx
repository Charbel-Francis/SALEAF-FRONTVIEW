import Apply_Funding_Card from "@/components/home/Apply_Funding_Card";
import Event_Card from "@/components/home/Events_Card";
import Login_Card from "@/components/home/Login_Card";
import Navigation_Cards from "@/components/home/Navigations_Card";
import Student_Profile_Card from "@/components/home/Student_Profile_Card";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Home = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    scrollContainer: {
      flexGrow: 1,
      height: hp("65%"), // Reduced height to account for tab bar
    },
    scrollContent: {
      paddingBottom: hp("1%"), // Added significant bottom padding to prevent content from hiding under tab bar
    },
    cardSpacing: {
      marginVertical: hp("1%"),
    },
    safeArea: {
      flex: 1,
      paddingTop: Platform.OS === "android" ? hp("0%") : 0,
    },
    contentWrapper: {
      flex: 1,
      // Ensure the content doesn't extend under the tab bar
      paddingBottom: Platform.OS === "ios" ? hp("8%") : hp("10%"),
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.cardSpacing}>
            <Apply_Funding_Card />
          </View>

          <View style={styles.cardSpacing}>
            <Navigation_Cards />
          </View>

          <View style={styles.cardSpacing}>
            <Event_Card />
          </View>

          <View style={styles.cardSpacing}>
            <Student_Profile_Card />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;
