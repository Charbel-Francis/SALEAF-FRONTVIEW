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
import { Card } from "react-native-paper";
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
    height: hp("3%"),
    borderRadius: wp("1%"),
    marginBottom: hp("1%"),
  },
});

interface AnimationState {
  height: Animated.Value;
  opacity: Animated.Value;
}

const Dependants_Form = ({
  updateState,
  application,
}: {
  updateState: (updates: Partial<AppUser>) => void;
  application: AppUser;
}) => {
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const animations = useRef<{ [key: string]: AnimationState }>({}).current;

  const dependents = [
    ...Array(application.dependentsAtPreSchool || 0).fill({
      type: "Pre-School",
    }),
    ...Array(application.dependentsAtSchool || 0).fill({ type: "School" }),
    ...Array(application.dependentsAtUniversity || 0).fill({
      type: "University",
    }),
  ];

  useEffect(() => {
    const fields = ["basicInfo", ...dependents.map((_, i) => i.toString())];
    fields.forEach((field) => {
      animations[field] = {
        height: new Animated.Value(0),
        opacity: new Animated.Value(0),
      };
    });
  }, [dependents]);

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

  const toggleField = (fieldName: string) => {
    const isExpanding = expandedField !== fieldName;

    if (expandedField) {
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

  const handleDependentChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedDependents = [...application.dependents];
    if (!updatedDependents[index]) {
      updatedDependents[index] = {};
    }
    updatedDependents[index][field] = value;
    updateState({ dependents: updatedDependents });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <Text style={styles.title}>DECLARATION OF FINANCIAL POSITION</Text>

        <Text style={[styles.title, { fontSize: wp("4%"), marginTop: 0 }]}>
          Dependants (Including the Applicant)
        </Text>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: keyboardHeight + hp("10%") },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {renderCard(
            "basicInfo",
            "Basic Information",
            <View>
              <DualInputField
                label1="How many Pre-School"
                label2="How many at School"
                placeholder1="Enter at Pre-School"
                placeholder2="Enter at School"
                className="h-8"
                onChange1={(value) =>
                  updateState({ dependentsAtPreSchool: parseInt(value) })
                }
                onChange2={(value) =>
                  updateState({ dependentsAtSchool: parseInt(value) })
                }
                keyboardType="numeric"
                icon1={<Ionicons name="school" size={20} color="gray" />}
                icon2={<Ionicons name="school" size={20} color="gray" />}
              />
              <InputField
                label="How many at University"
                placeholder="Enter many at University"
                textContentType="none"
                className="h-8"
                onChangeText={(value) =>
                  updateState({ dependentsAtUniversity: parseInt(value) })
                }
                keyboardType="numeric"
                icon={<Ionicons name="school" size={20} color="gray" />}
                style={styles.input}
              />
            </View>,
            hp("30%")
          )}

          <Text
            style={[
              styles.title,
              { fontSize: wp("4%"), marginVertical: hp("2%") },
            ]}
          >
            Dependants Information
          </Text>

          {dependents.map((dependent, index) =>
            renderCard(
              index.toString(),
              `Dependent ${index + 1} - ${dependent.type}`,
              <View key={dependent.id}>
                <DualInputField
                  label1="First Name"
                  label2="Surname"
                  placeholder1="Enter First Name"
                  placeholder2="Enter Surname"
                  className="h-8"
                  onChange1={(value) =>
                    handleDependentChange(index, "name", value)
                  }
                  onChange2={(value) =>
                    handleDependentChange(index, "surname", value)
                  }
                  icon1={<Ionicons name="person" size={20} color="gray" />}
                  icon2={<Ionicons name="person" size={20} color="gray" />}
                />
                <InputField
                  label="Relationship to Applicant"
                  placeholder="Enter Relationship"
                  textContentType="none"
                  className="h-8"
                  onChangeText={(value) =>
                    handleDependentChange(index, "relationship", value)
                  }
                  icon={<Ionicons name="people" size={20} color="gray" />}
                  style={styles.input}
                />
                <InputField
                  label="Name of School/University"
                  placeholder="Enter Name of School/University"
                  textContentType="none"
                  className="h-8"
                  onChangeText={(value) =>
                    handleDependentChange(index, "school", value)
                  }
                  icon={<Ionicons name="school" size={20} color="gray" />}
                  style={styles.input}
                />
              </View>,
              hp("40%")
            )
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Dependants_Form;
