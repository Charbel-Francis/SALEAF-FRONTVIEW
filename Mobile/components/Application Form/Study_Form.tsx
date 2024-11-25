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
import { DonateInputField, InputField } from "../InputField";
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
    paddingHorizontal: wp("2%"),
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
    width: wp("75%"),
    alignSelf: "center",
  },
  cardContent: {
    padding: wp("3%"),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("3%"),
    borderBottomWidth: 1,
    borderBottomColor: "#E8EFF5",
    backgroundColor: "#FAFBFD",
    borderTopLeftRadius: wp("3%"),
    borderTopRightRadius: wp("3%"),
  },
  cardTitle: {
    fontSize: wp("3.8%"),
    fontWeight: "600",
    color: "#15783D",
    letterSpacing: 0.3,
  },
  cardHint: {
    fontSize: wp("2.8%"),
    color: "#94A3B8",
    fontStyle: "italic",
    fontWeight: "500",
  },
  input: {
    height: hp("6%"),
    borderRadius: wp("2.5%"),
    marginBottom: hp("1.5%"),
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E9ECEF",
    paddingHorizontal: wp("3%"),
    fontSize: wp("3.5%"),
  },
  expandedCard: {
    borderColor: "#15783D",
    borderWidth: 1.5,
    transform: [{ scale: 1.01 }],
  },
  labelText: {
    fontSize: wp("3.2%"),
    color: "#334155",
    fontWeight: "600",
    marginBottom: hp("0.8%"),
    marginLeft: wp("1%"),
    letterSpacing: 0.2,
  },
});

interface AnimationState {
  height: Animated.Value;
  opacity: Animated.Value;
}

const Study_Form = ({
  updateState,
  application,
}: {
  updateState: (updates: Partial<AppUser>) => void;
  application: AppUser;
}) => {
  // State
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation refs
  const animations = useRef<{ [key: string]: AnimationState }>({}).current;

  useEffect(() => {
    // Initialize animations for each field
    const fields = [
      "institution",
      "degree",
      "yearofstudy",
      "studentNumber",
      "funding",
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

  // Add the icon helper function
  const getIconForField = (fieldName: string) => {
    const iconSize = wp("4%");
    const iconColor = "#666";

    const iconMap = {
      institution: <Ionicons name="school" size={iconSize} color={iconColor} />,
      degree: <Ionicons name="ribbon" size={iconSize} color={iconColor} />,
      yearofstudy: (
        <Ionicons name="calendar" size={iconSize} color={iconColor} />
      ),
      studentNumber: (
        <Ionicons name="id-card" size={iconSize} color={iconColor} />
      ),
      funding: <Ionicons name="cash" size={iconSize} color={iconColor} />,
    };

    return iconMap[fieldName as keyof typeof iconMap];
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <Text style={styles.title}>STUDIES APPLIED FOR</Text>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: keyboardHeight + hp("10%") },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {renderCard(
            "institution",
            "Institution",
            <InputField
              label="Name of Institution"
              placeholder="Enter Name of Institution"
              textContentType="addressCity"
              className="h-10"
              value={application.nameOfInstitution}
              onChange={(event) => {
                updateState({ nameOfInstitution: event.nativeEvent.text });
              }}
              icon={<Ionicons name="home" size={wp("4.5%")} color="#666" />}
            />,
            hp("20%")
          )}

          {renderCard(
            "degree",
            "Degree/Diploma",
            <InputField
              label="Degree/Diploma"
              placeholder="Enter the Degree/Diploma you registered for"
              textContentType="addressCity"
              className="h-10"
              value={application.degreeOrDiploma}
              onChange={(event) => {
                updateState({ degreeOrDiploma: event.nativeEvent.text });
              }}
              icon={<Ionicons name="ribbon" size={wp("4.5%")} color="#666" />}
            />,
            hp("20%")
          )}

          {renderCard(
            "yearofstudy",
            "Year of Study",
            <InputField
              label="Year of Study"
              placeholder="Enter Year of Study"
              textContentType="addressCity"
              onChange={(event) => {
                updateState({
                  yearOfStudyAndCommencement: event.nativeEvent.text,
                });
              }}
              value={application.yearOfStudyAndCommencement}
              icon={<Ionicons name="home" size={wp("4.5%")} color="#666" />}
              className="h-10"
            />,
            hp("20%")
          )}

          {renderCard(
            "studentNumber",
            "Student Number",
            <InputField
              label="Student Number"
              placeholder="Enter Student Number if you have one"
              textContentType="telephoneNumber"
              onChange={(event) => {
                updateState({ studentNumber: event.nativeEvent.text });
              }}
              value={application.studentNumber}
              icon={<Ionicons name="school" size={wp("4.5%")} color="#666" />}
              className="h-10"
            />,
            hp("20%")
          )}

          {renderCard(
            "funding",
            "Funding Required",
            <DonateInputField
              label="Estimated Funding Required"
              placeholder="Enter Estimated Funding Required"
              textContentType="emailAddress"
              onChange={(event) => {
                updateState({
                  approximateFundingRequired: parseFloat(
                    event.nativeEvent.text
                  ),
                });
              }}
              icon={<Ionicons name="cash" size={wp("4.5%")} color="#666" />}
              className="h-10"
            />,
            hp("20%")
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Study_Form;
