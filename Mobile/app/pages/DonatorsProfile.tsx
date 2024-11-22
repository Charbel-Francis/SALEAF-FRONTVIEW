import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { DualInputField, InputField } from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styled } from "nativewind";
import axiosInstance from "@/utils/config";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "expo-router";

const DonatorProfile = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [donations, setDonations] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [statistics, setStatistics] = useState({
    totalDonated: 0,
    averageDonation: 0,
    certificatesIssued: 0,
  });

  const editAnimation = useRef(new Animated.Value(0)).current;

  const [form, setForm] = useState({
    identityNoOrCompanyRegNo: "",
    incomeTaxNumber: "",
    address: "",
    phoneNumber: "",
    email: "",
    preferredCommunication: "email",
  });

  // Animation for edit mode
  useEffect(() => {
    Animated.spring(editAnimation, {
      toValue: editMode ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [editMode]);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const BackButton = () => (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{
        position: "absolute",
        left: wp("4%"),
        top: hp("4%"),
        zIndex: 10,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: wp("10%"),
        padding: wp("2%"),
      }}
    >
      <Ionicons name="arrow-back" size={wp("6%")} color="white" />
    </TouchableOpacity>
  );
  const YearSelector = () => (
    <View className="flex-row justify-center space-x-4 mb-4">
      {[2024, 2023, 2022].map((year) => (
        <TouchableOpacity
          key={year}
          className={`px-4 py-2 rounded-lg ${
            selectedYear === year ? "bg-mainColor" : "bg-gray-100"
          }`}
          onPress={() => setSelectedYear(year)}
        >
          <Text
            style={{ fontSize: wp(3.5) }}
            className={selectedYear === year ? "text-white" : "text-gray-600"}
          >
            {year}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const StatisticCard = ({
    icon,
    title,
    value,
  }: {
    icon: string;
    title: string;
    value: string | number;
  }) => (
    <View style={{ width: wp("28%") }} className="bg-white rounded-xl p-3">
      <View className="items-center">
        <View className="bg-mainColor/10 rounded-full p-2 mb-2">
          <Ionicons name={icon} size={wp("6%")} color="#333" />
        </View>
        <Text className="text-xs text-gray-600 text-center">{title}</Text>
        <Text className="text-base font-bold text-mainColor mt-1">{value}</Text>
      </View>
    </View>
  );

  interface Donation {
    amount: number;
    date: string;
    reference: string;
  }

  const DonationCard = ({ donation }: { donation: Donation }) => (
    <View style={{ width: wp("90%") }} className="bg-white rounded-xl p-4 mb-3">
      <View className="flex-row justify-between items-center">
        <View>
          <Text
            style={{ fontSize: wp("4.5%") }}
            className="font-semibold text-gray-800"
          >
            R {donation.amount.toLocaleString()}
          </Text>
          <Text style={{ fontSize: wp("3.5%") }} className="text-gray-600">
            {new Date(donation.date).toLocaleDateString()}
          </Text>
          <Text style={{ fontSize: wp("3%") }} className="text-gray-500 mt-1">
            Reference: {donation.reference}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            className="bg-mainColor px-4 py-2 rounded-lg mb-2"
            style={{ width: wp("25%") }}
            onPress={() => console.log("View Certificate")}
          >
            <Text
              style={{ fontSize: wp("3%") }}
              className="text-white text-center"
            >
              Section 18A
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-100 px-4 py-2 rounded-lg"
            style={{ width: wp("25%") }}
          >
            <Text
              style={{ fontSize: wp("3%") }}
              className="text-gray-600 text-center"
            >
              Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Profile Header */}
        <View style={{ height: hp("25%") }} className="bg-mainColor p-6">
          <BackButton />
          <View className="items-center">
            <View
              style={{
                width: wp("20%"),
                height: wp("20%"),
                justifyContent: "center",
                alignItems: "center",
              }}
              className="bg-white rounded-full p-4"
            >
              <Ionicons name="person" size={wp("10%")} color="#333" />
            </View>
            <Text
              style={{ fontSize: wp("5%") }}
              className="text-white mt-2 font-semibold"
            >
              {form.identityNoOrCompanyRegNo}
            </Text>
            <Text style={{ fontSize: wp("3.5%") }} className="text-white/80">
              Valued Donor Since 2022
            </Text>
          </View>
        </View>

        {/* Statistics Section */}
        <View className="flex-row justify-between px-4 -mt-8">
          <StatisticCard
            icon="cash"
            title="Total Donated"
            value={`R ${statistics.totalDonated.toLocaleString()}`}
          />
          <StatisticCard
            icon="trending-up"
            title="Average"
            value={`R ${statistics.averageDonation.toLocaleString()}`}
          />
          <StatisticCard
            icon="document-text"
            title="Certificates"
            value={statistics.certificatesIssued}
          />
        </View>

        {/* Details Section */}
        <View
          style={{ width: wp("90%") }}
          className="bg-white mx-4 mt-4 rounded-xl"
        >
          <View className="p-4">
            {/* ... rest of your details section content ... */}
          </View>
        </View>

        {/* Donation History */}
        <View style={{ paddingHorizontal: wp("4%") }}>
          <Text
            style={{ fontSize: wp("4.5%") }}
            className="font-semibold text-gray-800 mb-4"
          >
            Donation History
          </Text>
          <YearSelector />
          {donations.map((donation, index) => (
            <DonationCard key={index} donation={donation} />
          ))}
        </View>

        <View style={{ height: hp("10%") }} />
      </ScrollView>
    </View>
  );
};

export default DonatorProfile;
