import React, { useEffect, useState } from "react";
import DonationAmountComponent from "@/app/components/Donation/donationAmount";
import { SafeAreaView, Text, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import DonatorDetails from "@/app/components/Donation/donatorDetails";
import DonationTypeComponent from "@/app/components/Donation/chooseDonationType";
import DonateOnline from "@/app/components/Donation/donationOnline";
import StepProgress from "@/app/pages/Stepper";
import ProofOfPaymentRecieved from "@/app/components/Donation/paymentStatus/ProofofPaymentRecieved";
const Donate = () => {
  const [donationAmount, setDonationAmount] = useState<number>();
  const [steps, setSteps] = useState<number>(0);

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
