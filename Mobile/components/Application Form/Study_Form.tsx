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
    backgroundColor: "#f5f5f5",
    borderRadius: wp("4%"),
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: wp("4%"),
    paddingBottom: hp("15%"),
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: hp("2%"),
    color: "#2c3e50",
  },
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
  cardContent: {
    padding: wp("3%"),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("3%"),
    borderBottomWidth: 0.5,
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
  inputWrapper: {
    paddingVertical: hp("1%"),
  },
  input: {
    height: hp("5%"),
    backgroundColor: "#f8f9fa",
    borderRadius: wp("1%"),
    marginBottom: hp("1%"),
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp("1%"),
  },
  switchLabel: {
    fontSize: wp("4%"),
    color: "#2c3e50",
  },
  disabledInput: {
    backgroundColor: "#e9ecef",
    color: "#6c757d",
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

    return (
      <Card style={styles.card}>
        <TouchableOpacity
          onPress={() => toggleField(fieldName)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardHint}>
              {isExpanded ? "tap to close" : "tap to open"}
            </Text>
          </View>
        </TouchableOpacity>

        <Animated.View
          style={{
            opacity: animations[fieldName]?.opacity || 0,
            maxHeight:
              animations[fieldName]?.height.interpolate({
                inputRange: [0, 1],
                outputRange: [0, contentHeight],
              }) || 0,
            overflow: "hidden",
          }}
        >
          <View style={styles.cardContent}>{content}</View>
        </Animated.View>
      </Card>
    );
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
