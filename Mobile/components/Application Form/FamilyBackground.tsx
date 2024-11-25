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
    textAlign: "center",
    marginTop: 0,
    color: "#15783D",
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
    height: hp("6%"),
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

  labelText: {
    fontSize: wp("3.2%"),
    color: "#334155",
    fontWeight: "600",
    marginBottom: hp("0.8%"),
    marginLeft: wp("1%"),
    letterSpacing: 0.2,
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp("2%"),
    backgroundColor: "#F8FAFC",
    borderRadius: wp("2.5%"),
    paddingHorizontal: wp("3%"),
    marginVertical: hp("1%"),
    borderWidth: 1,
    borderColor: "#E8EFF5",
  },
  switchLabel: {
    fontSize: wp("3.5%"),
    color: "#334155",
    fontWeight: "600",
    letterSpacing: 0.2,
    flex: 1,
    marginRight: wp("2%"),
  },
  expandedCard: {
    borderColor: "#15783D",
    borderWidth: 1.5,
    transform: [{ scale: 1.01 }],
  },
  dualInputContainer: {
    marginBottom: hp("1.5%"),
  },
});

interface AnimationState {
  height: Animated.Value;
  opacity: Animated.Value;
}

const FamilyBackGround_Form = ({
  updateState,
  application,
}: {
  updateState: (updates: Partial<AppUser>) => void;
  application: AppUser;
}) => {
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [isSameAddressChecked, setIsSameAddressChecked] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const animations = useRef<{ [key: string]: AnimationState }>({}).current;

  useEffect(() => {
    const fields = [
      "father",
      "mother",
      "sibling",
      "selfApplicant",
      "guardianPerson",
    ];

    fields.forEach((field) => {
      animations[field] = {
        height: new Animated.Value(0),
        opacity: new Animated.Value(0),
      };
    });
  }, []);

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

    // Ensure animations[fieldName] exists
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

  // Add getIconForField function
  const getIconForField = (fieldName: string) => {
    const iconSize = wp("4%");
    const iconColor = "#666";

    const iconMap = {
      father: <Ionicons name="person" size={iconSize} color={iconColor} />,
      mother: <Ionicons name="person" size={iconSize} color={iconColor} />,
      sibling: <Ionicons name="people" size={iconSize} color={iconColor} />,
      selfApplicant: (
        <Ionicons name="person-circle" size={iconSize} color={iconColor} />
      ),
      guardianPerson: (
        <Ionicons name="person" size={iconSize} color={iconColor} />
      ),
    };

    return iconMap[fieldName as keyof typeof iconMap];
  };

  const handleSameAddressChange = () =>
    setIsSameAddressChecked(!isSameAddressChecked);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <Text style={styles.title}>DECLARATION OF FINANCIAL POSITION</Text>

        <Text style={[styles.title, { fontSize: wp("4%"), marginTop: 0 }]}>
          Family background and source of income
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
            "father",
            "Father",
            <View>
              <DualInputField
                label1="First Name"
                label2="Surname"
                placeholder1="Enter First Name"
                placeholder2="Enter Surname"
                className="h-8"
                value1={application.financialDetailsList.father?.name ?? ""}
                value2={application.financialDetailsList.father?.surname ?? ""}
                onChange1={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      father: {
                        ...application.financialDetailsList?.father,
                        name: value,
                      },
                    },
                  });
                }}
                onChange2={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      father: {
                        ...application.financialDetailsList?.father,
                        surname: value,
                      },
                    },
                  });
                }}
                icon1={<Ionicons name="person" size={20} color="gray" />}
                icon2={<Ionicons name="person" size={20} color="gray" />}
              />
              <InputField
                label="SA ID Number"
                placeholder="Enter SA ID Number"
                textContentType="none"
                className="h-8"
                onChangeText={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      father: {
                        ...application.financialDetailsList?.father,
                        idNumber: value,
                      },
                    },
                  });
                }}
                value={application.financialDetailsList.father?.idNumber ?? ""}
                icon={<Ionicons name="card" size={20} color="gray" />}
                style={styles.input}
              />
              <InputField
                label="Occupation"
                placeholder="Enter Occupation"
                textContentType="none"
                className="h-8"
                onChangeText={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      father: {
                        ...application.financialDetailsList?.father,
                        occupation: value,
                      },
                    },
                  });
                }}
                value={
                  application.financialDetailsList.father?.occupation ?? ""
                }
                icon={<Ionicons name="briefcase" size={20} color="gray" />}
                style={styles.input}
              />
              <InputField
                label="Marital Status"
                placeholder="Enter Marital Status"
                textContentType="none"
                className="h-8"
                onChangeText={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      father: {
                        ...application.financialDetailsList?.father,
                        maritalStatus: value,
                      },
                    },
                  });
                }}
                value={
                  application.financialDetailsList.father?.maritalStatus ?? ""
                }
                icon={<Ionicons name="calendar" size={20} color="gray" />}
                style={styles.input}
              />
              <DualInputField
                label1="Gross Income"
                label2="Other Income"
                placeholder1="Enter Gross Income"
                placeholder2="Enter Other Income"
                className="h-8"
                onChange1={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      father: {
                        ...application.financialDetailsList?.father,
                        grossMonthly: value,
                      },
                    },
                  });
                }}
                onChange2={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      father: {
                        ...application.financialDetailsList?.father,
                        otherIncome: value,
                      },
                    },
                  });
                }}
                value1={
                  application.financialDetailsList.father?.grossMonthly ?? ""
                }
                value2={
                  application.financialDetailsList.father?.otherIncome ?? ""
                }
                icon1={<Ionicons name="cash" size={20} color="gray" />}
                icon2={<Ionicons name="cash" size={20} color="gray" />}
              />
            </View>,
            hp("70%")
          )}
          {renderCard(
            "mother",
            "Mother",
            <View>
              <DualInputField
                label1="First Name"
                label2="Surname"
                placeholder1="Enter First Name"
                placeholder2="Enter Surname"
                className="h-8"
                value1={application.financialDetailsList.mother?.name ?? ""}
                value2={application.financialDetailsList.mother?.surname ?? ""}
                onChange1={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      mother: {
                        ...application.financialDetailsList?.mother,
                        name: value,
                      },
                    },
                  });
                }}
                onChange2={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      mother: {
                        ...application.financialDetailsList?.mother,
                        surname: value,
                      },
                    },
                  });
                }}
                icon1={<Ionicons name="person" size={20} color="gray" />}
                icon2={<Ionicons name="person" size={20} color="gray" />}
              />
              <InputField
                label="SA ID Number"
                placeholder="Enter SA ID Number"
                textContentType="none"
                className="h-8"
                onChangeText={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      mother: {
                        ...application.financialDetailsList?.mother,
                        idNumber: value,
                      },
                    },
                  });
                }}
                value={application.financialDetailsList.mother?.idNumber ?? ""}
                icon={<Ionicons name="card" size={20} color="gray" />}
                style={styles.input}
              />
              <InputField
                label="Occupation"
                placeholder="Enter Occupation"
                textContentType="none"
                className="h-8"
                onChangeText={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      mother: {
                        ...application.financialDetailsList?.mother,
                        occupation: value,
                      },
                    },
                  });
                }}
                value={
                  application.financialDetailsList.mother?.occupation ?? ""
                }
                icon={<Ionicons name="briefcase" size={20} color="gray" />}
                style={styles.input}
              />
              <InputField
                label="Marital Status"
                placeholder="Enter Marital Status"
                textContentType="none"
                className="h-8"
                onChangeText={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      mother: {
                        ...application.financialDetailsList?.mother,
                        maritalStatus: value,
                      },
                    },
                  });
                }}
                value={
                  application.financialDetailsList.mother?.maritalStatus ?? ""
                }
                icon={<Ionicons name="calendar" size={20} color="gray" />}
                style={styles.input}
              />
              <DualInputField
                label1="Gross Income"
                label2="Other Income"
                placeholder1="Enter Gross Income"
                placeholder2="Enter Other Income"
                className="h-8"
                onChange1={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      mother: {
                        ...application.financialDetailsList?.mother,
                        grossMonthly: value,
                      },
                    },
                  });
                }}
                onChange2={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      mother: {
                        ...application.financialDetailsList?.mother,
                        otherIncome: value,
                      },
                    },
                  });
                }}
                value1={
                  application.financialDetailsList.mother?.grossMonthly ?? ""
                }
                value2={
                  application.financialDetailsList.mother?.otherIncome ?? ""
                }
                icon1={<Ionicons name="cash" size={20} color="gray" />}
                icon2={<Ionicons name="cash" size={20} color="gray" />}
              />
            </View>,
            hp("70%")
          )}

          {renderCard(
            "sibling",
            "Sibling/s",
            <View>
              <DualInputField
                label1="First Name"
                label2="Surname"
                placeholder1="Enter First Name"
                placeholder2="Enter Surname"
                className="h-8"
                value1={application.financialDetailsList.siblings?.name ?? ""}
                value2={
                  application.financialDetailsList.siblings?.surname ?? ""
                }
                onChange1={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      siblings: {
                        ...application.financialDetailsList?.siblings,
                        name: value,
                      },
                    },
                  });
                }}
                onChange2={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      siblings: {
                        ...application.financialDetailsList?.siblings,
                        surname: value,
                      },
                    },
                  });
                }}
                icon1={<Ionicons name="person" size={20} color="gray" />}
                icon2={<Ionicons name="person" size={20} color="gray" />}
              />
              <InputField
                label="SA ID Number"
                placeholder="Enter SA ID Number"
                textContentType="none"
                className="h-8"
                onChangeText={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      siblings: {
                        ...application.financialDetailsList?.siblings,
                        idNumber: value,
                      },
                    },
                  });
                }}
                value={
                  application.financialDetailsList.siblings?.idNumber ?? ""
                }
                icon={<Ionicons name="card" size={20} color="gray" />}
                style={styles.input}
              />
              <InputField
                label="Occupation"
                placeholder="Enter Occupation"
                textContentType="none"
                className="h-8"
                onChangeText={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      siblings: {
                        ...application.financialDetailsList?.siblings,
                        occupation: value,
                      },
                    },
                  });
                }}
                value={
                  application.financialDetailsList.siblings?.occupation ?? ""
                }
                icon={<Ionicons name="briefcase" size={20} color="gray" />}
                style={styles.input}
              />
              <InputField
                label="Marital Status"
                placeholder="Enter Marital Status"
                textContentType="none"
                className="h-8"
                onChangeText={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      siblings: {
                        ...application.financialDetailsList?.siblings,
                        maritalStatus: value,
                      },
                    },
                  });
                }}
                value={
                  application.financialDetailsList.siblings?.maritalStatus ?? ""
                }
                icon={<Ionicons name="calendar" size={20} color="gray" />}
                style={styles.input}
              />
              <DualInputField
                label1="Gross Income"
                label2="Other Income"
                placeholder1="Enter Gross Income"
                placeholder2="Enter Other Income"
                className="h-8"
                onChange1={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      siblings: {
                        ...application.financialDetailsList?.siblings,
                        grossMonthly: value,
                      },
                    },
                  });
                }}
                onChange2={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      siblings: {
                        ...application.financialDetailsList?.siblings,
                        otherIncome: value,
                      },
                    },
                  });
                }}
                value1={
                  application.financialDetailsList.siblings?.grossMonthly ?? ""
                }
                value2={
                  application.financialDetailsList.siblings?.otherIncome ?? ""
                }
                icon1={<Ionicons name="cash" size={20} color="gray" />}
                icon2={<Ionicons name="cash" size={20} color="gray" />}
              />
            </View>,
            hp("70%")
          )}
          {renderCard(
            "selfApplicant",
            "Self Applicant",
            <View>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>
                  Is the Applicant Self Supported?
                </Text>
                <Switch
                  value={isSameAddressChecked}
                  onValueChange={handleSameAddressChange}
                  color="#2ecc71"
                />
              </View>
              {isSameAddressChecked && (
                <View>
                  <DualInputField
                    label1="First Name"
                    label2="Surname"
                    placeholder1="Enter First Name"
                    placeholder2="Enter Surname"
                    className="h-8"
                    value1={
                      application.financialDetailsList.selfApplicant?.name ?? ""
                    }
                    value2={
                      application.financialDetailsList.selfApplicant?.surname ??
                      ""
                    }
                    onChange1={(value) => {
                      updateState({
                        financialDetailsList: {
                          ...application.financialDetailsList,
                          selfApplicant: {
                            ...application.financialDetailsList?.selfApplicant,
                            name: value,
                          },
                        },
                      });
                    }}
                    onChange2={(value) => {
                      updateState({
                        financialDetailsList: {
                          ...application.financialDetailsList,
                          selfApplicant: {
                            ...application.financialDetailsList?.selfApplicant,
                            surname: value,
                          },
                        },
                      });
                    }}
                    icon1={<Ionicons name="person" size={20} color="gray" />}
                    icon2={<Ionicons name="person" size={20} color="gray" />}
                  />
                  <InputField
                    label="SA ID Number"
                    placeholder="Enter SA ID Number"
                    textContentType="none"
                    className="h-8"
                    onChangeText={(value) => {
                      updateState({
                        financialDetailsList: {
                          ...application.financialDetailsList,
                          selfApplicant: {
                            ...application.financialDetailsList?.selfApplicant,
                            idNumber: value,
                          },
                        },
                      });
                    }}
                    value={
                      application.financialDetailsList.selfApplicant
                        ?.idNumber ?? ""
                    }
                    icon={<Ionicons name="card" size={20} color="gray" />}
                    style={styles.input}
                  />
                  <InputField
                    label="Occupation"
                    placeholder="Enter Occupation"
                    textContentType="none"
                    className="h-8"
                    onChangeText={(value) => {
                      updateState({
                        financialDetailsList: {
                          ...application.financialDetailsList,
                          selfApplicant: {
                            ...application.financialDetailsList?.selfApplicant,
                            occupation: value,
                          },
                        },
                      });
                    }}
                    value={
                      application.financialDetailsList.selfApplicant
                        ?.occupation ?? ""
                    }
                    icon={<Ionicons name="briefcase" size={20} color="gray" />}
                    style={styles.input}
                  />
                  <InputField
                    label="Marital Status"
                    placeholder="Enter Marital Status"
                    textContentType="none"
                    className="h-8"
                    onChangeText={(value) => {
                      updateState({
                        financialDetailsList: {
                          ...application.financialDetailsList,
                          selfApplicant: {
                            ...application.financialDetailsList?.selfApplicant,
                            maritalStatus: value,
                          },
                        },
                      });
                    }}
                    value={
                      application.financialDetailsList.selfApplicant
                        ?.maritalStatus ?? ""
                    }
                    icon={<Ionicons name="calendar" size={20} color="gray" />}
                    style={styles.input}
                  />
                  <DualInputField
                    label1="Gross Income"
                    label2="Other Income"
                    placeholder1="Enter Gross Income"
                    placeholder2="Enter Other Income"
                    className="h-8"
                    onChange1={(value) => {
                      updateState({
                        financialDetailsList: {
                          ...application.financialDetailsList,
                          selfApplicant: {
                            ...application.financialDetailsList?.selfApplicant,
                            grossMonthly: value,
                          },
                        },
                      });
                    }}
                    onChange2={(value) => {
                      updateState({
                        financialDetailsList: {
                          ...application.financialDetailsList,
                          selfApplicant: {
                            ...application.financialDetailsList?.selfApplicant,
                            otherIncome: value,
                          },
                        },
                      });
                    }}
                    value1={
                      application.financialDetailsList.selfApplicant
                        ?.grossMonthly ?? ""
                    }
                    value2={
                      application.financialDetailsList.selfApplicant
                        ?.otherIncome ?? ""
                    }
                    icon1={<Ionicons name="cash" size={20} color="gray" />}
                    icon2={<Ionicons name="cash" size={20} color="gray" />}
                  />
                </View>
              )}
            </View>,
            isSameAddressChecked ? hp("80%") : hp("10%")
          )}
          {renderCard(
            "guardianPerson",
            "Guardian/Person Responsible",
            <View>
              <DualInputField
                label1="First Name"
                label2="Surname"
                placeholder1="Enter First Name"
                placeholder2="Enter Surname"
                className="h-8"
                value1={
                  application.financialDetailsList.guardian_person?.name ?? ""
                }
                value2={
                  application.financialDetailsList.guardian_person?.surname ??
                  ""
                }
                onChange1={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      guardian_person: {
                        ...application.financialDetailsList?.guardian_person,
                        name: value,
                      },
                    },
                  });
                }}
                onChange2={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      guardian_person: {
                        ...application.financialDetailsList?.guardian_person,
                        surname: value,
                      },
                    },
                  });
                }}
                icon1={<Ionicons name="person" size={20} color="gray" />}
                icon2={<Ionicons name="person" size={20} color="gray" />}
              />
              <InputField
                label="SA ID Number"
                placeholder="Enter SA ID Number"
                textContentType="none"
                className="h-8"
                onChangeText={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      guardian_person: {
                        ...application.financialDetailsList?.guardian_person,
                        idNumber: value,
                      },
                    },
                  });
                }}
                value={
                  application.financialDetailsList.guardian_person?.idNumber ??
                  ""
                }
                icon={<Ionicons name="card" size={20} color="gray" />}
                style={styles.input}
              />
              <InputField
                label="Occupation"
                placeholder="Enter Occupation"
                textContentType="none"
                className="h-8"
                onChangeText={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      guardian_person: {
                        ...application.financialDetailsList?.guardian_person,
                        occupation: value,
                      },
                    },
                  });
                }}
                value={
                  application.financialDetailsList.guardian_person
                    ?.occupation ?? ""
                }
                icon={<Ionicons name="briefcase" size={20} color="gray" />}
                style={styles.input}
              />
              <InputField
                label="Marital Status"
                placeholder="Enter Marital Status"
                textContentType="none"
                className="h-8"
                onChangeText={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      guardian_person: {
                        ...application.financialDetailsList?.guardian_person,
                        maritalStatus: value,
                      },
                    },
                  });
                }}
                value={
                  application.financialDetailsList.guardian_person
                    ?.maritalStatus ?? ""
                }
                icon={<Ionicons name="calendar" size={20} color="gray" />}
                style={styles.input}
              />
              <DualInputField
                label1="Gross Income"
                label2="Other Income"
                placeholder1="Enter Gross Income"
                placeholder2="Enter Other Income"
                className="h-8"
                onChange1={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      guardian_person: {
                        ...application.financialDetailsList?.guardian_person,
                        grossMonthly: value,
                      },
                    },
                  });
                }}
                onChange2={(value) => {
                  updateState({
                    financialDetailsList: {
                      ...application.financialDetailsList,
                      guardian_person: {
                        ...application.financialDetailsList?.guardian_person,
                        otherIncome: value,
                      },
                    },
                  });
                }}
                value1={
                  application.financialDetailsList.guardian_person
                    ?.grossMonthly ?? ""
                }
                value2={
                  application.financialDetailsList.guardian_person
                    ?.otherIncome ?? ""
                }
                icon1={<Ionicons name="cash" size={20} color="gray" />}
                icon2={<Ionicons name="cash" size={20} color="gray" />}
              />
            </View>,
            hp("70%")
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default FamilyBackGround_Form;
