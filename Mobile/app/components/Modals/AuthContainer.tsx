import React, { useState } from "react";
import { View } from "react-native";
import SignInModal from "@/app/(auth)/sign-in";
import SignUpModal from "@/app/(auth)/sign-up";
import { useAuth } from "@/context/JWTContext"; // Ensure you're using the context

const AuthContainer = ({ isSignInVisible, setSignInVisible }: { isSignInVisible: boolean, setSignInVisible: (visible: boolean) => void }) => {
    const [isSignUpVisible, setSignUpVisible] = useState(false);
    const { authState } = useAuth();

    const openSignUpModal = () => { setSignUpVisible(true); setSignInVisible(false) }
    const openSignInModal = () => { setSignInVisible(true); setSignUpVisible(false) }
    const closeModal = () => { setSignUpVisible(false); setSignInVisible(false) }
    React.useEffect(() => {
        if (!authState?.authenticated) {
            setSignInVisible(true);
        }
    }, [authState, setSignInVisible]);

    return (
        <>
            <SignInModal
                visible={isSignInVisible}
                onClose={closeModal}
                openSignUp={openSignUpModal}
            />
            <SignUpModal
                visible={isSignUpVisible}
                onClose={closeModal}
                openSignIn={openSignInModal}
            />
        </>
    );
};



export default AuthContainer;
