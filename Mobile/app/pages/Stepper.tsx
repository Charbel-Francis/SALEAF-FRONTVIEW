import DonationTypeComponent from "@/components/Donation/chooseDonationType";
import DonateOnline from "@/components/Donation/donationOnline";
import DonatorDetails from "@/components/Donation/donatorDetails";
import ManualPayment from "@/components/Donation/manualPayment";
import PaymentCancelComponent from "@/components/Donation/paymentStatus/paymentCancel";
import PaymentFailureComponent from "@/components/Donation/paymentStatus/paymentFailure";
import PaymentPendingComponent from "@/components/Donation/paymentStatus/paymentPending";
import PaymentSuccessComponent from "@/components/Donation/paymentStatus/paymentSucess";
import ProofOfPaymentRecieved from "@/components/Donation/paymentStatus/ProofofPaymentRecieved";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

const StepProgress = ({
  setSteps,
  steps,
  donationAmount,
}: {
  setSteps: (steps: number) => void;
  steps: number;
  donationAmount?: number;
}) => {
  const totalSteps = 4;
  const [donationResource, setDonationResource] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<number>(0);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity value
  const [referenceNumberRequest, setReferenceNumberRequest] =
    useState<string>("");
  const [paymentType, setPaymentType] = useState<number>(0);
  useEffect(() => {
    console.log(steps);
    console.log(donationResource);
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [steps, donationResource]);

  const renderStepIndicator = () => {
    const indicators = [];
    for (let i = 1; i <= totalSteps; i++) {
      indicators.push(
        <View key={i} style={styles.stepContainer}>
          <View style={[styles.stepIndicator, i <= steps && styles.activeStep]}>
            <Text
              style={[styles.stepText, i <= steps && styles.activeStepText]}
            >
              {i}
            </Text>
          </View>
          {i < totalSteps && (
            <View style={[styles.line, i < steps && styles.activeLine]} />
          )}
        </View>
      );
    }
    return <View style={styles.indicatorContainer}>{indicators}</View>;
  };

  const renderContent = () => {
    switch (steps) {
      case 1:
        return <DonatorDetails />;
      case 2:
        return (
          <DonationTypeComponent
            setSteps={setSteps}
            setDonationResource={setDonationResource}
            setPaymentType={setPaymentType}
            donationAmount={donationAmount ?? 0}
          />
        );
      case 3:
        return paymentType === 3 ? (
          <DonateOnline
            donationLink={donationResource}
            setSteps={setSteps}
            setPaymentStatus={setPaymentStatus}
          />
        ) : paymentType === 4 ? (
          <ManualPayment
            setSteps={setSteps}
            referenceNumber={donationResource}
            donationAmount={donationAmount}
            setPaymentStatus={setPaymentStatus}
          />
        ) : null;
      case 4:
        return paymentStatus === 1 ? (
          <PaymentSuccessComponent setSteps={setSteps} />
        ) : paymentStatus === 2 ? (
          <PaymentFailureComponent setSteps={setSteps} />
        ) : paymentStatus === 3 ? (
          <PaymentCancelComponent setSteps={setSteps} />
        ) : paymentStatus == 4 ? (
          <PaymentPendingComponent setSteps={setSteps} />
        ) : paymentStatus == 5 ? (
          <ProofOfPaymentRecieved setSteps={setSteps} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderStepIndicator()}

      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        {renderContent()}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: "center",
    backgroundColor: "white",
  },
  indicatorContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepIndicator: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E7E7E7",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStep: {
    borderColor: "#14783D",
    backgroundColor: "#14783D",
  },
  stepText: {
    color: "#E7E7E7",
    fontWeight: "bold",
    fontSize: 16,
  },
  activeStepText: {
    color: "white",
  },
  line: {
    width: 20,
    height: 2,
    backgroundColor: "#E7E7E7",
    marginHorizontal: 10,
  },
  activeLine: {
    backgroundColor: "#14783D",
  },
  contentContainer: { flex: 1, width: "100%" },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  backButton: {
    backgroundColor: "#E7E7E7",
    marginRight: 10,
  },
  backButtonText: {
    color: "gray",
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "pink",
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default StepProgress;
