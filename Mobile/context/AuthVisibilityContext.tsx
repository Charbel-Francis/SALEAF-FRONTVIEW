// context/AuthVisibilityContext.tsx
import React, { createContext, useContext, useState } from "react";

type AuthVisibilityContextType = {
  isSignInVisible: boolean;
  showSignIn: () => void;
  hideSignIn: () => void;
  toggleSignIn: () => void;
};

const AuthVisibilityContext = createContext<
  AuthVisibilityContextType | undefined
>(undefined);

export function AuthVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSignInVisible, setIsSignInVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const showSignIn = () => {
    setIsClosing(false);
    setIsSignInVisible(true);
  };

  const hideSignIn = () => {
    if (!isClosing) {
      setIsClosing(true);
      setIsSignInVisible(false);
    }
  };

  const toggleSignIn = () => {
    if (isSignInVisible && !isClosing) {
      hideSignIn();
    } else {
      showSignIn();
    }
  };

  return (
    <AuthVisibilityContext.Provider
      value={{
        isSignInVisible,
        showSignIn,
        hideSignIn,
        toggleSignIn,
      }}
    >
      {children}
    </AuthVisibilityContext.Provider>
  );
}

export function useAuthVisibility() {
  const context = useContext(AuthVisibilityContext);
  if (context === undefined) {
    throw new Error(
      "useAuthVisibility must be used within an AuthVisibilityProvider"
    );
  }
  return context;
}
