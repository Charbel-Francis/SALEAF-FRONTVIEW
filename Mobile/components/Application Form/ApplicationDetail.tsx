import Apply_Funding_Card from "@/components/home/Apply_Funding_Card";
import Event_Card from "@/components/home/Events_Card";
import Login_Card from "@/components/home/Login_Card";
import Navigation_Cards from "@/components/home/Navigations_Card";
import Student_Profile_Card from "@/components/home/Student_Profile_Card";
import { SafeAreaView, ScrollView, View } from "react-native";
const Applicants_Details = () => {
  return (
    <View>
      <Login_Card />

      <View>
        <ScrollView className="flex-grow-1 h-[66vh]">
          <Apply_Funding_Card />
          <Navigation_Cards />
          <Event_Card />
          <Student_Profile_Card />
        </ScrollView>
      </View>
    </View>
  );
};

export default Applicants_Details;
