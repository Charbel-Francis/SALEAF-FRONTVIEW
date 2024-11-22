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
