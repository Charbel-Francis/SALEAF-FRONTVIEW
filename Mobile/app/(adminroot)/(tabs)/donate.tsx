import React, { useEffect, useState } from "react";
import { AppState, SafeAreaView } from "react-native";
import DonationAmountComponent from "@/components/Donation/donationAmount";
import StepProgress from "@/app/pages/Stepper";
import PaymentCancelComponent from "@/components/Donation/paymentStatus/paymentCancel";
import PaymentFailureComponent from "@/components/Donation/paymentStatus/paymentFailure";
import PaymentPendingComponent from "@/components/Donation/paymentStatus/paymentPending";
import PaymentSuccessComponent from "@/components/Donation/paymentStatus/paymentSucess";

const Donate = () => {
  const [donationAmount, setDonationAmount] = useState<number>();
  const [steps, setSteps] = useState<number>(0);
  const [lastActiveTime, setLastActiveTime] = useState<number>(Date.now());

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentTime = Date.now();
      if (currentTime - lastActiveTime > 300000) {
        setSteps(0);
      }
    }, 300000);

    return () => clearTimeout(timeout);
  }, [lastActiveTime]);

  const resetActivityTimer = () => {
    setLastActiveTime(Date.now());
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        setLastActiveTime(Date.now());
      }
    };
    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      appStateListener.remove();
    };
  }, []);

  useEffect(() => {
    const handleUserActivity = () => {
      resetActivityTimer();
    };
    const touchTimeout = setTimeout(handleUserActivity, 1000);

    return () => {
      clearTimeout(touchTimeout);
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {steps === 0 ? (
        <DonationAmountComponent
          setSelectedAmount={setDonationAmount}
          setSteps={setSteps}
        />
      ) : (
        <StepProgress
          setSteps={setSteps}
          steps={steps}
          donationAmount={donationAmount}
        />
      )}
    </SafeAreaView>
  );
};

export default Donate;
