import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Dimensions,
} from "react-native";
import { Camera as ExpoCamera, CameraView } from "expo-camera";
import type { BarcodeScanningResult } from "expo-camera";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface QRScannerProps {
  onScanned: (data: string) => void;
  onClose?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanned, onClose }) => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flash, setFlash] = useState<"on" | "off" | "auto" | "torch">("off");
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [showDataModal, setShowDataModal] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setScanned(true);
    setScannedData(data);
    setShowDataModal(true);
    // Only call onScanned if it exists
    if (onScanned) {
      onScanned(data);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back(); // Default behavior: go back if no onClose provided
    }
  };

  const toggleFlash = () => {
    setFlash(flash === "off" ? "torch" : "off");
  };

  const handleScanAgain = () => {
    setScanned(false);
    setScannedData(null);
    setShowDataModal(false);
  };

  const handleDone = () => {
    // Process the scanned data here if needed
    console.log("Scanned data:", scannedData);
    handleClose();
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => ExpoCamera.requestCameraPermissionsAsync()}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.fullScreenContainer}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <SafeAreaView style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleClose}>
              <MaterialIcons name="arrow-back" size={wp("8%")} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan QR Code</Text>
            <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
              <MaterialIcons
                name={flash === "torch" ? "flash-on" : "flash-off"}
                size={wp("8%")}
                color="white"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.targetFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          <Text style={styles.scanningText}>
            {scanned ? "QR Code Scanned!" : "Position QR code within frame"}
          </Text>
        </SafeAreaView>
      </CameraView>

      <Modal visible={showDataModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Scanned Result</Text>
            <Text style={styles.modalData}>{scannedData}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={handleScanAgain}
              >
                <Text style={styles.modalButtonText}>Scan Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleDone}
              >
                <Text style={styles.modalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    zIndex: 999,
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
  },
  headerTitle: {
    color: "white",
    fontSize: wp("5%"),
    fontWeight: "600",
  },
  backButton: {
    padding: wp("2%"),
  },
  targetFrame: {
    width: wp("70%"),
    height: wp("70%"),
    position: "relative",
    alignSelf: "center",
    marginTop: hp("15%"),
  },
  corner: {
    position: "absolute",
    width: wp("10%"),
    height: wp("10%"),
    borderColor: "white",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderLeftWidth: 3,
    borderTopWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderRightWidth: 3,
    borderTopWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  flashButton: {
    padding: wp("2%"),
  },
  scanningText: {
    color: "white",
    fontSize: wp("4%"),
    textAlign: "center",
    position: "absolute",
    bottom: hp("10%"),
    width: "100%",
  },
  text: {
    color: "white",
    fontSize: wp("4%"),
    textAlign: "center",
    marginTop: hp("4%"),
  },
  button: {
    backgroundColor: "#007AFF",
    padding: wp("4%"),
    borderRadius: wp("2%"),
    marginTop: hp("2%"),
  },
  buttonText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: wp("5%"),
    borderTopRightRadius: wp("5%"),
    padding: wp("6%"),
  },
  modalTitle: {
    fontSize: wp("5%"),
    fontWeight: "600",
    marginBottom: hp("2%"),
  },
  modalData: {
    fontSize: wp("4%"),
    marginBottom: hp("3%"),
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: wp("4%"),
    borderRadius: wp("2%"),
    marginHorizontal: wp("2%"),
  },
  modalButtonPrimary: {
    backgroundColor: "#007AFF",
  },
  modalButtonSecondary: {
    backgroundColor: "#666",
  },
  modalButtonText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "600",
    textAlign: "center",
  },
});

export default QRScanner;
