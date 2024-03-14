// Importing necessary React Native components for UI layout
import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react"; // Importing React for using hooks and components
import * as WebBrowser from "expo-web-browser"; // Importing Expo WebBrowser for handling web-based authentication
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser"; // Custom hook to pre-load the browser for a faster OAuth flow
import { useOAuth } from "@clerk/clerk-expo"; // Clerk hook for handling OAuth authentication

// Attempting to complete an authentication session if one is in progress
WebBrowser.maybeCompleteAuthSession();

// Define the LoginScreen functional component
export default function LoginScreen() {
  // Calling the useWarmUpBrowser hook to pre-load the browser when the component mounts
  useWarmUpBrowser();

  // Getting the startOAuthFlow function from the useOAuth hook, configured for Google OAuth
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  // Defining an onPress callback for the "Get Started" button
  const onPress = React.useCallback(async () => {
    try {
      // Attempting to start the OAuth flow
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      // If a session is created, set it as the active session
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Future steps for signIn or signUp can be handled here, such as multifactor authentication (MFA)
      }
    } catch (err) {
      // Log any errors encountered during the OAuth process
      console.error("OAuth error", err);
    }
  }, []);

  // Rendering the component UI
  return (
    <View>
      {/* Displaying an image at the top of the login screen */}
      <Image
        source={require("./../../assets/images/login.jpg")}
        className="w-full h-[400px] object-cover"
      />
      {/* Container for the login message and "Get Started" button */}
      <View className="p-8 bg-white mt-[-20px] rounded-t-3xl shadow-md">
        {/* Displaying the title */}
        <Text className="text-[35px] font-bold text-center">
          Walkden Girls Under 11s
        </Text>
        {/* Displaying the motivational message */}
        <Text className="text-[18px] text-slate-500 mt-6 text-center">
          Train hard, play harder
        </Text>
        {/* "Get Started" button to initiate the OAuth flow */}
        <TouchableOpacity
          onPress={onPress}
          className="p-4 bg-blue-500 rounded-full mt-20"
        >
          <Text className="text-white text-center text-[18px]">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
