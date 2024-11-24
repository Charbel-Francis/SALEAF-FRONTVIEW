import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  Image,
} from "react-native";
import { Camera as ExpoCamera, CameraView } from "expo-camera";
import type { BarcodeScanningResult } from "expo-camera";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axiosInstance from "@/utils/config";

interface QRScannerProps {
  onScanned?: (data: any) => void;
  onClose?: () => void;
}

const TicketView = ({ data }: { data: any }) => {
  if (!data) return null;

  return (
    <View style={styles.ticketContainer}>
      <View style={styles.ticketHeader}>
        <View style={styles.eventImageContainer}>
          <Image
            source={{ uri: data.event.eventImageUrl }}
            style={styles.eventImage}
          />
        </View>
        <Text style={styles.eventName}>{data.event.eventName}</Text>
        <Text
          style={[
            styles.ticketStatus,
            data.isPaid ? styles.verifiedStatus : styles.unverifiedStatus,
          ]}
        >
          {data.isPaid ? "✓ VERIFIED" : "✗ UNVERIFIED"}
        </Text>
      </View>

      <View style={styles.ticketBody}>
        <View style={styles.ticketRow}>
          <View style={styles.ticketField}>
            <Text style={styles.fieldLabel}>Ticket Holder</Text>
            <Text
              style={styles.fieldValue}
            >{`${data.firstName} ${data.lastName}`}</Text>
          </View>
          <View style={styles.ticketField}>
            <Text style={styles.fieldLabel}>Phone</Text>
            <Text style={styles.fieldValue}>{data.phoneNumber}</Text>
          </View>
        </View>

        <View style={styles.ticketRow}>
          <View style={styles.ticketField}>
            <Text style={styles.fieldLabel}>Date</Text>
            <Text style={styles.fieldValue}>{data.event.startDate}</Text>
          </View>
          <View style={styles.ticketField}>
            <Text style={styles.fieldLabel}>Time</Text>
            <Text style={styles.fieldValue}>{data.event.startTime}</Text>
          </View>
        </View>

        <View style={styles.ticketRow}>
          <View style={styles.ticketField}>
            <Text style={styles.fieldLabel}>Package</Text>
            <Text style={styles.fieldValue}>{data.pacakageName}</Text>
          </View>
          <View style={styles.ticketField}>
            <Text style={styles.fieldLabel}>Amount</Text>
            <Text
              style={styles.fieldValue}
            >{`${data.currency} ${data.amount}`}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.ticketFooter}>
          <Text style={styles.fieldLabel}>Location</Text>
          <Text style={styles.locationText}>{data.event.location}</Text>
          <Text style={styles.registrationDate}>
            Registered on:{" "}
            {new Date(data.registrationDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const ErrorView = ({ message }: { message: string }) => (
  <View style={styles.errorContainer}>
    <MaterialIcons name="error-outline" size={wp("15%")} color="#FF3B30" />
    <Text style={styles.errorTitle}>Verification Failed</Text>
    <Text style={styles.errorMessage}>{message}</Text>
  </View>
);

const QRScanner: React.FC<QRScannerProps> = ({ onScanned, onClose }) => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flash, setFlash] = useState<"on" | "off" | "auto" | "torch">("off");
  const [showDataModal, setShowDataModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const verifyTicket = async (barcode: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `/EventRegistration/verify-ticket/${barcode}`
      );
      setTicketData(response.data);
      console.log(response.data);
      if (onScanned) {
        onScanned(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify ticket");
      console.error("Ticket verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    setScanned(true);
    setShowDataModal(true);
    await verifyTicket(data);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const toggleFlash = () => {
    setFlash(flash === "off" ? "torch" : "off");
  };

  const handleScanAgain = () => {
    setScanned(false);
    setTicketData(null);
    setError(null);
    setShowDataModal(false);
  };

  const handleDone = () => {
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
        flash="on"
      >
        <SafeAreaView style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleClose}>
              <MaterialIcons name="arrow-back" size={wp("8%")} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan Ticket</Text>
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
            Position ticket QR code within frame
          </Text>
        </SafeAreaView>
      </CameraView>

      <Modal visible={showDataModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Verifying ticket...</Text>
              </View>
            ) : error ? (
              <>
                <ErrorView message={error} />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={handleScanAgain}
                  >
                    <Text style={styles.modalButtonText}>Try Again</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : ticketData ? (
              <>
                <TicketView data={ticketData} />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={handleScanAgain}
                  >
                    <Text style={styles.modalButtonText}>Scan Another</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={handleDone}
                  >
                    <Text style={styles.modalButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
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
    backgroundColor: "#000",
    zIndex: 999,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  headerTitle: {
    color: "white",
    fontSize: wp("4.5%"),
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
    marginTop: hp("10%"),
  },
  corner: {
    position: "absolute",
    width: wp("10%"),
    height: wp("10%"),
    borderColor: "#007AFF",
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
    fontWeight: "500",
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
    marginHorizontal: wp("4%"),
  },
  buttonText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "600",
    textAlign: "center",
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
    padding: wp("5%"),
    maxHeight: hp("90%"), // Adjusted to ensure buttons are visible
  },
  ticketContainer: {
    backgroundColor: "white",
    borderRadius: wp("4%"),
    marginBottom: hp("2%"),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  ticketHeader: {
    alignItems: "center",
    padding: wp("4%"),
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  eventImageContainer: {
    width: wp("25%"),
    height: wp("25%"),
    borderRadius: wp("12.5%"),
    overflow: "hidden",
    marginBottom: hp("1%"),
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "white",
  },
  eventImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  eventName: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: "#1a1a1a",
    marginVertical: hp("1%"),
    textAlign: "center",
  },
  ticketStatus: {
    fontSize: wp("3.5%"),
    fontWeight: "600",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("4%"),
  },
  verifiedStatus: {
    color: "#34C759",
    backgroundColor: "rgba(52,199,89,0.15)",
  },
  unverifiedStatus: {
    color: "#FF3B30",
    backgroundColor: "rgba(255,59,48,0.15)",
  },
  ticketBody: {
    padding: wp("4%"),
  },
  ticketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("1.5%"),
  },
  ticketField: {
    flex: 1,
    marginHorizontal: wp("1%"),
  },
  fieldLabel: {
    fontSize: wp("3.5%"),
    color: "#666",
    marginBottom: hp("0.5%"),
    fontWeight: "500",
  },
  fieldValue: {
    fontSize: wp("4%"),
    color: "#1a1a1a",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: hp("2%"),
  },
  ticketFooter: {
    marginTop: hp("1%"),
    backgroundColor: "#f8f9fa",
    padding: wp("4%"),
    borderBottomLeftRadius: wp("4%"),
    borderBottomRightRadius: wp("4%"),
  },
  locationText: {
    fontSize: wp("4%"),
    color: "#1a1a1a",
    fontWeight: "500",
  },
  registrationDate: {
    fontSize: wp("3.5%"),
    color: "#666",
    marginTop: hp("0.5%"),
  },
  errorContainer: {
    alignItems: "center",
    padding: wp("4%"),
  },
  errorTitle: {
    fontSize: wp("5%"),
    fontWeight: "600",
    color: "#FF3B30",
    marginVertical: hp("1%"),
  },
  errorMessage: {
    fontSize: wp("4%"),
    color: "#666",
    textAlign: "center",
    marginBottom: hp("1%"),
  },
  loadingContainer: {
    alignItems: "center",
    padding: wp("4%"),
    minHeight: hp("15%"),
    justifyContent: "center",
  },
  loadingText: {
    marginTop: hp("2%"),
    fontSize: wp("4%"),
    color: "#666",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: wp("2%"),
    marginTop: hp("2%"),
    paddingBottom: hp("2%"), // Added padding to ensure buttons aren't cut off
  },
  modalButton: {
    flex: 1,
    padding: wp("3.5%"),
    borderRadius: wp("2%"),
    backgroundColor: "#007AFF",
  },
  modalButtonPrimary: {
    backgroundColor: "#007AFF",
  },
  modalButtonSecondary: {
    backgroundColor: "#6c757d",
  },
  modalButtonText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "600",
    textAlign: "center",
  },
});

export default QRScanner;
