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
  subtitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#15783D",
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
    marginLeft: wp("13%"),
    letterSpacing: 0.3,
  },
  card: {
    width: wp("75%"),
    alignSelf: "center",
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
  iconContainer: {
    width: wp("7%"),
    height: wp("7%"),
    borderRadius: wp("3.5%"),
    backgroundColor: "#F0F7F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("2%"),
  },
  input: {
    borderRadius: wp("2.5%"),
    marginBottom: hp("1.5%"),
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E9ECEF",
    paddingHorizontal: wp("3%"),
    fontSize: wp("3.5%"),
  },
  inputWrapper: {
    paddingVertical: hp("1.5%"),
    gap: hp("1%"),
  },
  expandedCard: {
    borderColor: "#15783D",
    borderWidth: 1.5,
    transform: [{ scale: 1.01 }],
  },
  addButton: {
    width: wp("75%"),
    alignSelf: "center",
    backgroundColor: "#15783D",
    padding: wp("3%"),
    borderRadius: wp("2.5%"),
    marginTop: hp("2%"),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: wp("2%"),
  },
  addButtonText: {
    color: "#fff",
    fontSize: wp("3.5%"),
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  deleteButton: {
    marginLeft: wp("2%"),
  },
});

interface AnimationState {
  height: Animated.Value;
  opacity: Animated.Value;
}

const Fixed_Assets_Form = ({
  updateState,
  application,
}: {
  updateState: (updates: Partial<AppUser>) => void;
  application: AppUser;
}) => {
  const [fixedProperties, setFixedProperties] = useState([{ id: 0 }]);
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const animations = useRef<{ [key: string]: AnimationState }>({}).current;

  useEffect(() => {
    const fields = fixedProperties.map((_, index) => `property${index}`);
    fields.forEach((field) => {
      animations[field] = {
        height: new Animated.Value(0),
        opacity: new Animated.Value(0),
      };
    });
  }, [fixedProperties]);

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
    contentHeight: number,
    index: number,
    deleteFixedProperty: (index: number) => void
  ) => {
    const isExpanded = expandedField === fieldName;
    const icon = getIconForField(fieldName);

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
      <View key={`property-${index}`} style={cardStyle}>
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {index > 0 && (
                <TouchableOpacity
                  onPress={() => deleteFixedProperty(index)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash" size={wp("5%")} color="#DC2626" />
                </TouchableOpacity>
              )}
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

  const getIconForField = (fieldName: string) => {
    const iconSize = wp("4%");
    const iconColor = "#666";
    return <Ionicons name="home" size={iconSize} color={iconColor} />;
  };

  const handleDependentChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedProperties = [...application.fixedProperties];
    if (!updatedProperties[index]) {
      updatedProperties[index] = {};
    }
    updatedProperties[index][field] = value;
    updateState({ fixedProperties: updatedProperties });
  };

  const addFixedProperty = () => {
    setFixedProperties((prevProperties) => [
      ...prevProperties,
      { id: prevProperties.length },
    ]);
  };

  const deleteFixedProperty = (index: number) => {
    if (index > 0) {
      setFixedProperties((prevProperties) => {
        const updatedProperties = prevProperties.filter((_, i) => i !== index);
        return updatedProperties;
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
          Fixed Property
        </Text>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: keyboardHeight + hp("10%") },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {fixedProperties.map((property, index) => (
            <React.Fragment
              key={`fixed-property-container-${property.id}-${index}`}
            >
              {renderCard(
                `property-${property.id}-${index}`,
                `Fixed Property ${index + 1}`,
                <View key={`property-content-${property.id}-${index}`}>
                  <InputField
                    label="Physical Address"
                    placeholder="Physical Address"
                    textContentType="none"
                    className="h-8"
                    value={
                      application.fixedProperties[index]?.physicalAddress ?? ""
                    }
                    icon={
                      <Ionicons
                        name="location"
                        size={wp("4.5%")}
                        color="gray"
                      />
                    }
                    onChangeText={(value) =>
                      handleDependentChange(index, "physicalAddress", value)
                    }
                    style={styles.input}
                  />
                  <InputField
                    label="Erf no. Township"
                    placeholder="Enter Erf No./Township"
                    textContentType="none"
                    className="h-8"
                    value={application.fixedProperties[index]?.erfNo ?? ""}
                    icon={
                      <Ionicons
                        name="business"
                        size={wp("4.5%")}
                        color="gray"
                      />
                    }
                    onChangeText={(value) =>
                      handleDependentChange(index, "erfNo", value)
                    }
                    style={styles.input}
                  />
                  <InputField
                    label="Date Purchased"
                    placeholder="Enter Purchase Date"
                    textContentType="none"
                    className="h-8"
                    value={
                      application.fixedProperties[index]?.datePurchased ?? ""
                    }
                    icon={
                      <Ionicons
                        name="calendar"
                        size={wp("4.5%")}
                        color="gray"
                      />
                    }
                    onChangeText={(value) =>
                      handleDependentChange(index, "datePurchased", value)
                    }
                    style={styles.input}
                  />
                  <InputField
                    label="Municipal Value"
                    placeholder="Enter Municipal Value"
                    textContentType="none"
                    className="h-8"
                    value={
                      application.fixedProperties[index]?.municipalValue ?? ""
                    }
                    icon={
                      <Ionicons name="cash" size={wp("4.5%")} color="gray" />
                    }
                    onChangeText={(value) =>
                      handleDependentChange(index, "municipalValue", value)
                    }
                    style={styles.input}
                  />
                  <InputField
                    label="Present Value"
                    placeholder="Enter Present Value"
                    textContentType="none"
                    className="h-8"
                    value={
                      application.fixedProperties[index]?.presentValue ?? ""
                    }
                    icon={
                      <Ionicons
                        name="pricetag"
                        size={wp("4.5%")}
                        color="gray"
                      />
                    }
                    onChangeText={(value) =>
                      handleDependentChange(index, "presentValue", value)
                    }
                    style={styles.input}
                  />
                </View>,
                hp("70%"),
                index,
                deleteFixedProperty
              )}
            </React.Fragment>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={addFixedProperty}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>Add More Fixed Property</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Fixed_Assets_Form;
