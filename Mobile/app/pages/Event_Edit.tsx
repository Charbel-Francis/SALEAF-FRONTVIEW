import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import Animated from "react-native-reanimated";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { sharedTransition } from "@/components/transitions/sharedTransitions";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  Button,
  Portal,
  Modal,
  TextInput as PaperInput,
} from "react-native-paper";
import axiosInstance from "@/utils/config";

interface FormData {
  eventId: string | string[];
  eventName: string;
  eventDescription: string;
  location: string;
  eventImageUrl: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  eventPrice: string;
  status: string;
  [key: string]: string | string[]; // Index signature
}

interface FormInputProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  icon: string;
  onPress?: () => void;
  required?: boolean;
}

export default function EditEventScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [activeField, setActiveField] = useState<keyof FormData | null>(null);

  const [formData, setFormData] = useState<FormData>({
    eventId: params.eventId,
    eventName: params.eventName as string,
    eventDescription: params.eventDescription as string,
    location: params.location as string,
    eventImageUrl: params.eventImageUrl as string,
    startDate: params.startDate as string,
    endDate: params.endDate as string,
    startTime: params.startTime as string,
    endTime: params.endTime as string,
    eventPrice: params.eventPrice as string,
    status: params.status as string,
  });

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        setFormData((prev) => ({
          ...prev,
          eventImageUrl: result.assets[0].uri,
        }));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleSave = async () => {
    if (!formData.eventName || !formData.location) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put(`/api/Event/${params.eventId}`, formData);
      Alert.alert("Success", "Event updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update event");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openDateModal = (field: keyof FormData) => {
    setActiveField(field);
    setDateModalVisible(true);
  };

  const FormInput: React.FC<FormInputProps> = ({
    label,
    value,
    onChangeText,
    multiline = false,
    icon,
    onPress,
    required = false,
  }) => (
    <Pressable
      style={styles.inputContainer}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={wp("6%")} color="#007AFF" />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        {onPress ? (
          <Pressable style={styles.datePickerButton} onPress={onPress}>
            <Text style={styles.datePickerText}>
              {value || `Select ${label}`}
            </Text>
          </Pressable>
        ) : (
          <PaperInput
            value={value}
            onChangeText={onChangeText}
            style={styles.paperInput}
            mode="outlined"
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            outlineColor="#ddd"
            activeOutlineColor="#007AFF"
          />
        )}
      </View>
    </Pressable>
  );

  const DateTimeModal = () => (
    <Portal>
      <Modal
        visible={dateModalVisible}
        onDismiss={() => setDateModalVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Text style={styles.modalTitle}>
          {activeField
            ? typeof activeField === "string"
              ? activeField.replace(/([A-Z])/g, " $1").toLowerCase()
              : ""
            : ""}
        </Text>

        {typeof activeField === "string" && activeField.includes("Date") && (
          <PaperInput
            mode="outlined"
            label="Date (YYYY-MM-DD)"
            value={activeField ? (formData[activeField] as string) : ""}
            onChangeText={(text) => {
              if (activeField) {
                setFormData((prev) => ({ ...prev, [activeField]: text }));
              }
            }}
            style={styles.modalInput}
            placeholder="YYYY-MM-DD"
          />
        )}

        {typeof activeField === "string" && activeField.includes("Time") && (
          <PaperInput
            mode="outlined"
            label="Time (HH:MM)"
            value={activeField ? (formData[activeField] as string) : ""}
            onChangeText={(text) => {
              if (activeField) {
                setFormData((prev) => ({ ...prev, [activeField]: text }));
              }
            }}
            style={styles.modalInput}
            placeholder="HH:MM"
          />
        )}

        <View style={styles.modalButtons}>
          <Button
            onPress={() => setDateModalVisible(false)}
            mode="outlined"
            style={styles.modalButton}
          >
            Cancel
          </Button>
          <Button
            onPress={() => setDateModalVisible(false)}
            mode="contained"
            style={styles.modalButton}
          >
            Confirm
          </Button>
        </View>
      </Modal>
    </Portal>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.scrollView} bounces={false}>
        <Pressable style={styles.imageContainer} onPress={handleImagePick}>
          <Animated.Image
            source={{ uri: formData.eventImageUrl }}
            style={[StyleSheet.absoluteFill]}
            resizeMode="cover"
          />
          <BlurView intensity={30} style={[styles.imageOverlay]}>
            <Ionicons name="camera" size={wp("10%")} color="white" />
            <Text style={styles.imageText}>Tap to change image</Text>
          </BlurView>
        </Pressable>

        <View style={styles.contentContainer}>
          <View style={styles.formCard}>
            <FormInput
              label="Event Name"
              value={formData.eventName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, eventName: text }))
              }
              icon="bookmark"
              required
            />

            <FormInput
              label="Location"
              value={formData.location}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, location: text }))
              }
              icon="location"
              required
            />

            <FormInput
              label="Start Date"
              value={formData.startDate}
              icon="calendar"
              onPress={() => openDateModal("startDate")}
            />

            <FormInput
              label="End Date"
              value={formData.endDate}
              icon="calendar"
              onPress={() => openDateModal("endDate")}
            />

            <FormInput
              label="Start Time"
              value={formData.startTime}
              icon="time"
              onPress={() => openDateModal("startTime")}
            />

            <FormInput
              label="End Time"
              value={formData.endTime}
              icon="time"
              onPress={() => openDateModal("endTime")}
            />

            <FormInput
              label="Price"
              value={formData.eventPrice}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, eventPrice: text }))
              }
              icon="cash"
            />

            <FormInput
              label="Description"
              value={formData.eventDescription}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, eventDescription: text }))
              }
              multiline
              icon="document-text"
            />
          </View>
        </View>
      </ScrollView>

      <DateTimeModal />

      <View style={styles.footer}>
        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </Pressable>
      </View>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <BlurView intensity={80} style={styles.backButtonBlur}>
          <Ionicons name="arrow-back" size={wp("6%")} color="black" />
        </BlurView>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (styles remain the same as in the previous version)
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: hp("30%"),
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageText: {
    color: "white",
    fontSize: wp("4%"),
    marginTop: hp("1%"),
  },
  contentContainer: {
    padding: wp("4%"),
    paddingBottom: hp("12%"),
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: wp("4%"),
    padding: wp("4%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp("2%"),
  },
  iconContainer: {
    width: wp("12%"),
    height: wp("12%"),
    backgroundColor: "#F0F8FF",
    borderRadius: wp("6%"),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp("3%"),
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: wp("3.5%"),
    color: "#666",
    marginBottom: hp("0.5%"),
  },
  required: {
    color: "red",
  },
  paperInput: {
    backgroundColor: "white",
    fontSize: wp("4%"),
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: wp("2%"),
    padding: wp("3%"),
    backgroundColor: "#fff",
  },
  datePickerText: {
    fontSize: wp("4%"),
    color: "#333",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: wp("5%"),
    margin: wp("5%"),
    borderRadius: wp("3%"),
  },
  modalTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "bold",
    marginBottom: hp("2%"),
  },
  modalInput: {
    marginBottom: hp("2%"),
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: wp("2%"),
  },
  modalButton: {
    minWidth: wp("25%"),
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelButton: {
    flex: 1,
    padding: hp("1.5%"),
    borderRadius: wp("3%"),
    borderWidth: 1,
    borderColor: "#007AFF",
    marginRight: wp("2%"),
  },
  cancelButtonText: {
    color: "#007AFF",
    fontSize: wp("4%"),
    fontWeight: "600",
    textAlign: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: hp("1.5%"),
    borderRadius: wp("3%"),
    marginLeft: wp("2%"),
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "600",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: hp("6%"),
    left: wp("4%"),
    zIndex: 1,
  },
  backButtonBlur: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
