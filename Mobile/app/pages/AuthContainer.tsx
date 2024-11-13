import React, { useEffect, useState } from "react";
import { View, Animated, Easing } from "react-native";
import SignInModal from "@/app/(auth)/sign-in";
import SignUpModal from "@/app/(auth)/sign-up";
import { useAuth } from "@/context/JWTContext"; // Ensure you're using the context

const AuthContainer = ({
  isSignInVisible,
  setSignInVisible,
}: {
  isSignInVisible: boolean;
  setSignInVisible: (visible: boolean) => void;
}) => {
  const [isSignUpVisible, setSignUpVisible] = useState(false);
  const { authState, onAnonomusLogin } = useAuth();
  const [signInOpacity] = useState(new Animated.Value(isSignInVisible ? 1 : 0));
  const [signUpOpacity] = useState(new Animated.Value(isSignUpVisible ? 1 : 0));
  const openSignUpModal = () => {
    setSignUpVisible(true);
    setSignInVisible(false);
  };
  const openSignInModal = () => {
    setSignInVisible(true);
    setSignUpVisible(false);
  };
  const closeModal = () => {
    setSignUpVisible(false);
    setSignInVisible(false);
  };
  useEffect(() => {
    if (!authState?.authenticated) {
      setSignInVisible(false);
    }
  }, [authState, setSignInVisible]);
  useEffect(() => {
    Animated.timing(signInOpacity, {
      toValue: isSignInVisible ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    Animated.timing(signUpOpacity, {
      toValue: isSignUpVisible ? 0 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [isSignInVisible, isSignUpVisible]);

  return (
    <>
      <Animated.View style={{ opacity: signInOpacity }}>
        <SignInModal
          visible={isSignInVisible}
          onClose={closeModal}
          openSignUp={openSignUpModal}
        />
      </Animated.View>
      <Animated.View style={{ opacity: signUpOpacity }}>
        <SignUpModal
          visible={isSignUpVisible}
          onClose={closeModal}
          openSignIn={openSignInModal}
        />
      </Animated.View>
    </>
  );
};

export default AuthContainer;
