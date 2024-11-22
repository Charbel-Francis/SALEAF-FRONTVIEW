import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ViewStyle,
  TextStyle,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as DocumentPicker from "expo-document-picker";
import { MaterialIcons } from "@expo/vector-icons";

interface FileInfo {
  name: string;
  uri: string;
  type: string;
  size?: number;
}

interface StylesType {
  container: ViewStyle;
  card: ViewStyle;
  taskHeader: ViewStyle;
  taskInfo: ViewStyle;
  taskTitle: TextStyle;
  taskDeadline: TextStyle;
  statusBadge: ViewStyle;
  pendingBadge: ViewStyle;
  completedBadge: ViewStyle;
  statusText: TextStyle;
  pendingText: TextStyle;
  completedText: TextStyle;
  description: TextStyle;
  fileSection: ViewStyle;
  fileInfo: ViewStyle;
  fileName: TextStyle;
  fileSize: TextStyle;
  selectButton: ViewStyle;
  selectButtonText: TextStyle;
  requirements: ViewStyle;
  requirementsTitle: TextStyle;
  requirementItem: ViewStyle;
  requirementText: TextStyle;
  submitButton: ViewStyle;
  submitButtonDisabled: ViewStyle;
  submitButtonText: TextStyle;
  submitIcon: TextStyle;
  fileInfoContainer: ViewStyle;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const StudentMarksTaskCard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const pickDocument = async (): Promise<void> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
      });

      if (result.canceled === false) {
        const fileSize = result.assets[0].size || 0;

        if (fileSize > MAX_FILE_SIZE) {
          Alert.alert(
            "File Too Large",
            "Please select a file smaller than 10MB"
          );
          return;
        }

        setSelectedFile({
          name: result.assets[0].name,
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType || "",
          size: fileSize,
        });
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to select file");
    }
  };

  const handleUpload = async (): Promise<void> => {
    setIsUploading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsUploading(false);
    setIsCompleted(true);
    Alert.alert("Success", "File uploaded successfully!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Task Header */}
        <View style={styles.taskHeader}>
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>Upload File</Text>
            <Text style={styles.taskDeadline}>Deadline: 25 Nov 2024</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              isCompleted ? styles.completedBadge : styles.pendingBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isCompleted ? styles.completedText : styles.pendingText,
              ]}
            >
              {isCompleted ? "Completed" : "Pending"}
            </Text>
          </View>
        </View>

        {/* Task Description */}
        <Text style={styles.description}>
          Please upload your file (maximum size: 10MB)
        </Text>

        {/* File Selection Area */}
        <View style={styles.fileSection}>
          <View style={styles.fileInfo}>
            <MaterialIcons
              name={selectedFile ? "description" : "upload-file"}
              size={wp("6%")}
              color="#007AFF"
            />
            <View style={styles.fileInfoContainer}>
              <Text style={styles.fileName}>
                {selectedFile ? selectedFile.name : "No file selected"}
              </Text>
              {selectedFile && (
                <Text style={styles.fileSize}>
                  Size: {formatFileSize(selectedFile.size)}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={pickDocument}
            disabled={isUploading}
          >
            <Text style={styles.selectButtonText}>
              {selectedFile ? "Change File" : "Select File"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Requirements */}
        <View style={styles.requirements}>
          <Text style={styles.requirementsTitle}>Requirements:</Text>
          <View style={styles.requirementItem}>
            <MaterialIcons
              name="check-circle"
              size={wp("4%")}
              color="#4CAF50"
            />
            <Text style={styles.requirementText}>Any file type accepted</Text>
          </View>
          <View style={styles.requirementItem}>
            <MaterialIcons
              name="check-circle"
              size={wp("4%")}
              color="#4CAF50"
            />
            <Text style={styles.requirementText}>Max file size: 10MB</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedFile || isCompleted || isUploading) &&
              styles.submitButtonDisabled,
          ]}
          disabled={!selectedFile || isCompleted || isUploading}
          onPress={handleUpload}
        >
          {isUploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>
                {isCompleted ? "File Uploaded" : "Upload File"}
              </Text>
              {isCompleted && (
                <MaterialIcons
                  name="check-circle"
                  size={wp("5%")}
                  color="white"
                  style={styles.submitIcon}
                />
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create<StylesType>({
  container: {
    padding: wp("4%"),
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    borderRadius: wp("4%"),
    padding: wp("5%"),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: hp("2%"),
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: hp("0.5%"),
  },
  taskDeadline: {
    fontSize: wp("3.5%"),
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("4%"),
  },
  pendingBadge: {
    backgroundColor: "#FFF4E5",
  },
  completedBadge: {
    backgroundColor: "#E8F5E9",
  },
  statusText: {
    fontSize: wp("3%"),
    fontWeight: "600",
  },
  pendingText: {
    color: "#FF9800",
  },
  completedText: {
    color: "#4CAF50",
  },
  description: {
    fontSize: wp("3.5%"),
    color: "#666",
    lineHeight: wp("5%"),
    marginBottom: hp("2%"),
  },
  fileSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F9FF",
    padding: wp("4%"),
    borderRadius: wp("2%"),
    marginBottom: hp("2%"),
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fileInfoContainer: {
    flex: 1,
    marginLeft: wp("2%"),
  },
  fileName: {
    fontSize: wp("3.5%"),
    color: "#333",
    marginBottom: hp("0.5%"),
  },
  fileSize: {
    fontSize: wp("3%"),
    color: "#666",
  },
  selectButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
    borderRadius: wp("4%"),
  },
  selectButtonText: {
    color: "white",
    fontSize: wp("3%"),
    fontWeight: "600",
  },
  requirements: {
    marginBottom: hp("2%"),
  },
  requirementsTitle: {
    fontSize: wp("3.5%"),
    fontWeight: "600",
    color: "#333",
    marginBottom: hp("1%"),
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("0.5%"),
  },
  requirementText: {
    fontSize: wp("3.2%"),
    color: "#666",
    marginLeft: wp("2%"),
  },
  submitButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: wp("4%"),
    borderRadius: wp("2%"),
    marginTop: hp("1%"),
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
  submitIcon: {
    marginLeft: wp("2%"),
  },
});

export default StudentMarksTaskCard;
