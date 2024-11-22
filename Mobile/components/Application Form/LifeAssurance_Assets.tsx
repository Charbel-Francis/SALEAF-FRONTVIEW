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
import { InputField } from "../InputField";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Card } from "react-native-paper";
import CustomButton from "../CustomButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AppUser } from "@/constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  multilineInput: {
    height: hp("10%"),
    borderRadius: wp("1%"),
    marginBottom: hp("1%"),
    textAlignVertical: "top",
  },
});

interface AnimationState {
  height: Animated.Value;
  opacity: Animated.Value;
}

const LifeAssurance_Assets_Form = ({
  updateState,
  application,
}: {
  updateState: (updates: Partial<AppUser>) => void;
  application: AppUser;
}) => {
  const [lifeAssurance, setLifeAssurance] = useState([{ id: 0 }]);
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const animations = useRef<{ [key: string]: AnimationState }>({}).current;

  useEffect(() => {
    const fields = lifeAssurance.map((_, index) => `policy${index}`);
    fields.forEach((field) => {
      animations[field] = {
        height: new Animated.Value(0),
        opacity: new Animated.Value(0),
      };
    });
  }, [lifeAssurance]);

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
      <Card style={styles.card} key={title}>
        <TouchableOpacity
          onPress={() => toggleField(fieldName)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{title}</Text>
            <View style={{ flexDirection: "row" }}>
              {title === "Life Assurance Policy 1" && (
                <Text style={styles.cardHint}>
                  {isExpanded ? "tap to close" : "tap to open"}
                </Text>
              )}
              {title !== "Life Assurance Policy 1" && (
                <TouchableOpacity
                  onPress={() =>
                    deleteLifeAssurance(parseInt(fieldName.slice(6)))
                  }
                >
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              )}
            </View>
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
    const updatedPolicies = [...application.lifeAssurancePolicies];
    if (!updatedPolicies[index]) {
      updatedPolicies[index] = {};
    }
    updatedPolicies[index][field] = value;
    updateState({ lifeAssurancePolicies: updatedPolicies });
  };

  const addLifeAssurance = () => {
    setLifeAssurance((prevPolicies) => [
      ...prevPolicies,
      { id: prevPolicies.length },
    ]);
  };

  const deleteLifeAssurance = (index: number) => {
    if (index > 0) {
      setLifeAssurance((prevPolicies) => {
        const updatedPolicies = prevPolicies.filter((_, i) => i !== index);
        return updatedPolicies;
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <Text style={styles.title}>
          Person Statement of Assets and Liability
        </Text>

        <Text style={[styles.title, { fontSize: wp("4%"), marginTop: 0 }]}>
          Life Assurance Policies
        </Text>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: keyboardHeight + hp("10%") },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {lifeAssurance.map((_, index) =>
            renderCard(
              `policy${index}`,
              `Life Assurance Policy ${index + 1}`,
              <View key={_.id}>
                <InputField
                  label="Company"
                  placeholder="Enter Company Name"
                  textContentType="none"
                  className="h-8"
                  value={
                    application.lifeAssurancePolicies[index]?.company ?? ""
                  }
                  onChangeText={(value) =>
                    handleDependentChange(index, "company", value)
                  }
                  icon={<Ionicons name="business" size={20} color="gray" />}
                  style={styles.input}
                />
                <InputField
                  label="Description"
                  placeholder="Enter description of the life assurance policy"
                  textContentType="none"
                  className="h-20"
                  value={
                    application.lifeAssurancePolicies[index]?.description ?? ""
                  }
                  onChangeText={(value) =>
                    handleDependentChange(index, "description", value)
                  }
                  multiline
                  style={styles.multilineInput}
                />
                <InputField
                  label="Surrender Value"
                  placeholder="Enter Surrender Value"
                  textContentType="none"
                  className="h-8"
                  value={
                    application.lifeAssurancePolicies[index]?.surrenderValue ??
                    ""
                  }
                  onChangeText={(value) =>
                    handleDependentChange(index, "surrenderValue", value)
                  }
                  icon={<Ionicons name="cash" size={20} color="gray" />}
                  style={styles.input}
                />
              </View>,
              hp("50%")
            )
          )}

          <CustomButton
            onPress={addLifeAssurance}
            title="Add More Life Assurance Policy"
            className="mt-4 bg-blue text-white font-semibold py-2 px-4 rounded"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LifeAssurance_Assets_Form;
