import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard,
} from "react-native";
import { DualInputField, InputField } from "../InputField";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Switch, Card } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AppUser } from "@/constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    borderRadius: wp("4%"),
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: wp("2%"), // Reduced from 4%
    paddingBottom: hp("15%"),
    gap: hp("2%"),
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "700",
    textAlign: "center",
    marginVertical: hp("2%"),
    color: "#15783D",
    letterSpacing: 0.5,
  },
  card: {
    marginBottom: hp("1.5%"),
    borderRadius: wp("3%"),
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E8EFF5",
    width: wp("75%"), // Reduced from 85%
    alignSelf: "center",
  },
  cardContent: {
    padding: wp("3%"), // Reduced from 4%
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("3%"), // Reduced from 4%
    borderBottomWidth: 1,
    borderBottomColor: "#E8EFF5",
    backgroundColor: "#FAFBFD",
    borderTopLeftRadius: wp("3%"),
    borderTopRightRadius: wp("3%"),
  },
  cardTitle: {
    fontSize: wp("3.8%"), // Reduced from 4%
    fontWeight: "600",
    color: "#15783D",
    letterSpacing: 0.3,
  },
  cardHint: {
    fontSize: wp("2.8%"), // Reduced from 3%
    color: "#94A3B8",
    fontStyle: "italic",
    fontWeight: "500",
  },
  inputWrapper: {
    paddingVertical: hp("1.5%"),
    gap: hp("1%"),
  },
  input: {
    height: hp("6%"),
    borderRadius: wp("2.5%"),
    marginBottom: hp("1.5%"),
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E9ECEF",
    paddingHorizontal: wp("3%"),
    fontSize: wp("3.5%"), // Reduced from 3.8%
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp("2%"),
    backgroundColor: "#F8FAFC",
    borderRadius: wp("2.5%"),
    paddingHorizontal: wp("3%"), // Reduced from 4%
    marginVertical: hp("1%"),
    borderWidth: 1,
    borderColor: "#E8EFF5",
  },
  switchLabel: {
    fontSize: wp("3.5%"), // Reduced from 3.8%
    color: "#334155",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  expandedCard: {
    borderColor: "#15783D",
    borderWidth: 1.5,
    transform: [{ scale: 1.01 }],
  },
  labelText: {
    fontSize: wp("3.2%"), // Reduced from 3.5%
    color: "#334155",
    fontWeight: "600",
    marginBottom: hp("0.8%"),
    marginLeft: wp("1%"),
    letterSpacing: 0.2,
  },
  errorText: {
    color: "#DC2626",
    fontSize: wp("3%"), // Reduced from 3.2%
    marginTop: hp("0.5%"),
    marginLeft: wp("1%"),
    fontWeight: "500",
  },
});

interface AnimationState {
  height: Animated.Value;
  opacity: Animated.Value;
}

const Applicants_Details = ({
  updateState,
  application,
}: {
  updateState: (updates: Partial<AppUser>) => void;
  application: AppUser;
}) => {
  // State
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [isSameAddressChecked, setIsSameAddressChecked] = useState(false);
  const [disabilities, setDisabilities] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [homeAddress, setHomeAddress] = useState<string>("");
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation refs
  const animations = useRef<{ [key: string]: AnimationState }>({}).current;

  useEffect(() => {
    // Initialize animations for each field
    const fields = [
      "name",
      "dateOfBirth",
      "idNumber",
      "address",
      "postal",
      "contact",
      "email",
      "disabilities",
    ];

    fields.forEach((field) => {
      animations[field] = {
        height: new Animated.Value(0),
        opacity: new Animated.Value(0),
      };
    });
  }, []);

  // Keyboard handlers
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // Animation handler
  const toggleField = (fieldName: string) => {
    const isExpanding = expandedField !== fieldName;

    if (expandedField) {
      // Collapse the currently expanded field
      Animated.parallel([
        Animated.timing(animations[expandedField].height, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(animations[expandedField].opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }

    // Expand the new field
    setExpandedField(isExpanding ? fieldName : null);
    Animated.parallel([
      Animated.timing(animations[fieldName].height, {
        toValue: isExpanding ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animations[fieldName].opacity, {
        toValue: isExpanding ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();

    // Scroll to the expanded field
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: Object.keys(animations).indexOf(fieldName) * hp("10%"),
        animated: true,
      });
    }, 100);
  };

  const renderCard = (
    fieldName: string,
    title: string,
    content: React.ReactNode,
    contentHeight: number
  ) => {
    const isExpanded = expandedField === fieldName;
    const icon = getIconForField(fieldName);

    // Ensure animations[fieldName] exists before using it
    if (!animations[fieldName]) {
      animations[fieldName] = {
        height: new Animated.Value(0),
        opacity: new Animated.Value(0),
      };
    }

    const cardStyle = [styles.card, isExpanded && styles.expandedCard];

    const iconStyle = {
      width: wp("7%"),
      height: wp("7%"),
      borderRadius: wp("3.5%"),
      backgroundColor: isExpanded ? "#E8F5EE" : "#F0F7F4",
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginRight: wp("2%"),
    };

    return (
      <View style={cardStyle}>
        <TouchableOpacity
          onPress={() => toggleField(fieldName)}
          activeOpacity={0.7}
          style={{ overflow: "hidden", borderRadius: wp("3%") }}
        >
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {icon && <View style={iconStyle}>{icon}</View>}
              <View>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={[styles.cardHint, { marginTop: hp("0.5%") }]}>
                  {isExpanded ? "Tap to close" : "Tap to edit"}
                </Text>
              </View>
            </View>
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: animations[fieldName].height.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "180deg"],
                    }),
                  },
                ],
              }}
            >
              <Ionicons
                name="chevron-down"
                size={wp("4.5%")}
                color={isExpanded ? "#15783D" : "#94A3B8"}
              />
            </Animated.View>
          </View>

          <Animated.View
            style={{
              opacity: animations[fieldName].opacity,
              maxHeight: animations[fieldName].height.interpolate({
                inputRange: [0, 1],
                outputRange: [0, contentHeight],
              }),
            }}
          >
            <View style={[styles.cardContent, { paddingTop: hp("2%") }]}>
              {content}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  // Helper function to get the appropriate icon for each field
  const getIconForField = (fieldName: string) => {
    const iconSize = wp("6%");
    const iconColor = "#666";

    const iconMap = {
      name: <Ionicons name="person" size={iconSize} color={iconColor} />,
      dateOfBirth: (
        <Ionicons name="calendar" size={iconSize} color={iconColor} />
      ),
      idNumber: <Ionicons name="card" size={iconSize} color={iconColor} />,
      address: <Ionicons name="home" size={iconSize} color={iconColor} />,
      postal: <Ionicons name="mail" size={iconSize} color={iconColor} />,
      contact: <Ionicons name="call" size={iconSize} color={iconColor} />,
      email: <Ionicons name="mail" size={iconSize} color={iconColor} />,
      disabilities: (
        <Ionicons name="information-circle" size={iconSize} color={iconColor} />
      ),
    };

    return iconMap[fieldName as keyof typeof iconMap];
  };

  const handleSameAddressChange = () => {
    setIsSameAddressChecked((prev) => !prev);
    if (!isSameAddressChecked) {
      updateState({ homePostalAddress: homeAddress });
    } else {
      updateState({ homePostalAddress: "" });
    }
  };

  const handleDisabilitiesChange = () => {
    setDisabilities((prev) => !prev);
    if (!disabilities) {
      updateState({ disabilityExplanation: "" });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Text style={styles.title}>Application Details</Text>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: keyboardHeight + hp("10%") },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Name Fields */}
        {renderCard(
          "name",
          "First Name and Surname",

          <DualInputField
            label1="First Name"
            label2="Surname"
            placeholder1="FirstName"
            placeholder2="Surname"
            className="h-8"
            value1={application.name}
            value2={application.surname}
            onChange1={(value) => {
              updateState({ name: value });
            }}
            onChange2={(value) => {
              updateState({ surname: value });
            }}
            icon1={<Ionicons name="person" size={20} color="gray" />}
            icon2={<Ionicons name="person" size={20} color="gray" />}
          />,
          hp("20%")
        )}

        {/* Date of Birth */}
        {renderCard(
          "dateOfBirth",
          "Date of Birth",
          <InputField
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            value={application.dateOfBirth}
            onChange={(event) =>
              updateState({ dateOfBirth: event.nativeEvent.text })
            }
            icon={<Ionicons name="calendar" size={wp("4.5%")} color="#666" />}
            style={styles.input}
          />,
          hp("30%")
        )}

        {/* ID Number */}
        {renderCard(
          "idNumber",
          "SA ID Number",
          <InputField
            label="ID Number"
            placeholder="Enter ID Number"
            value={application.saIdNumber}
            onChange={(event) =>
              updateState({ saIdNumber: event.nativeEvent.text })
            }
            icon={<Ionicons name="card" size={wp("4.5%")} color="#666" />}
            style={styles.input}
          />,
          hp("20%")
        )}

        {/* Lebanese Origin Switch */}
        <Card style={styles.card}>
          <View style={[styles.cardContent, styles.switchContainer]}>
            <Text style={styles.cardTitle}>Lebanese Origin</Text>
            <Switch
              value={application.isOfLebaneseOrigin}
              onValueChange={(value) =>
                updateState({ isOfLebaneseOrigin: value })
              }
              color="#2ecc71"
            />
          </View>
        </Card>

        {/* Home Physical Address */}
        {renderCard(
          "address",
          "Home Address",
          <InputField
            label="Home Physical Address"
            placeholder="Enter Physical Address"
            textContentType="addressCity"
            value={application.homePhysicalAddress}
            onChange={(event) => {
              updateState({ homePhysicalAddress: event.nativeEvent.text });
              setHomeAddress(event.nativeEvent.text);
            }}
            icon={<Ionicons name="home" size={wp("4.5%")} color="#666" />}
            style={styles.input}
          />,
          hp("20%")
        )}

        {/* Postal Address */}
        {renderCard(
          "postal",
          "Postal Address",
          <View>
            <View style={[styles.switchContainer, { marginBottom: hp("1%") }]}>
              <Text style={styles.switchLabel}>Same as Above</Text>
              <Switch
                value={isSameAddressChecked}
                onValueChange={() => {
                  handleSameAddressChange();
                  updateState({
                    homePostalAddress: isSameAddressChecked ? homeAddress : "",
                  });
                }}
                color="#2ecc71"
              />
            </View>
            {!isSameAddressChecked && (
              <InputField
                label="Home Postal Address"
                placeholder="Enter Postal Address"
                textContentType="addressCity"
                value={application.homePostalAddress}
                onChange={(event) => {
                  updateState({
                    homePostalAddress: event.nativeEvent.text,
                  });
                }}
                icon={<Ionicons name="home" size={wp("4.5%")} color="#666" />}
                style={styles.input}
              />
            )}
          </View>,
          isSameAddressChecked ? hp("10%") : hp("50%")
        )}

        {/* Contact Number */}
        {renderCard(
          "contact",
          "Contact Number",
          <InputField
            label="Contact Number"
            placeholder="Enter Contact Number"
            textContentType="telephoneNumber"
            value={application.contactNumber}
            onChange={(event) => {
              updateState({ contactNumber: event.nativeEvent.text });
            }}
            icon={<Ionicons name="call" size={wp("4.5%")} color="#666" />}
            style={styles.input}
          />,
          hp("20%")
        )}

        {/* Email Address */}
        {renderCard(
          "email",
          "Email Address",
          <InputField
            label="Email Address"
            placeholder="Enter Email Address"
            textContentType="emailAddress"
            value={application.email}
            onChange={(event) => {
              updateState({ email: event.nativeEvent.text });
            }}
            icon={<Ionicons name="mail" size={wp("4.5%")} color="#666" />}
            style={styles.input}
          />,
          hp("20%")
        )}

        {/* Disabilities */}
        {renderCard(
          "disabilities",
          "Disabilites",
          <View>
            <View style={[styles.switchContainer, { marginBottom: hp("1%") }]}>
              <Text style={styles.switchLabel}>
                Do you have any Disabilites
              </Text>
              <Switch
                value={application.hasDisabilities}
                onValueChange={(value) => {
                  handleDisabilitiesChange();
                  updateState({ hasDisabilities: value });
                }}
                color="#2ecc71"
              />
            </View>
            {disabilities && (
              <InputField
                label="Disabilities Description"
                placeholder="Enter Details"
                textContentType="none"
                onChange={(event) => {
                  updateState({
                    disabilityExplanation: event.nativeEvent.text,
                  });
                }}
                icon={
                  <Ionicons
                    name="information-circle"
                    size={wp("4.5%")}
                    color="#666"
                  />
                }
                style={styles.input}
              />
            )}
          </View>,
          disabilities ? hp("50%") : hp("10%")
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Applicants_Details;
