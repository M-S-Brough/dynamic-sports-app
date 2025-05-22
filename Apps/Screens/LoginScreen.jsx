// Importing necessary modules and components from React Native, Expo, and Clerk
import React, { useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import * as WebBrowser from "expo-web-browser"; // Used for handling OAuth redirection in web-based authentication
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser"; // Custom hook to pre-load the browser for a smoother OAuth flow
import { useOAuth } from "@clerk/clerk-expo"; // Clerk hook for handling OAuth authentication

// Ensures any OAuth authentication process is completed upon app start
WebBrowser.maybeCompleteAuthSession();

// Getting device window dimensions for responsive design
const { height } = Dimensions.get("window");

// Define the LoginScreen functional component
export default function LoginScreen() {
  // Pre-load the browser when the component mounts to optimize OAuth flow
  useWarmUpBrowser();
  // Destructuring to get the startOAuthFlow method from the useOAuth hook
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  // Callback function to handle button press and initiate OAuth flow
  const onPress = useCallback(async () => {
    try {
      // Start the OAuth flow and await the result
      const { createdSessionId, setActive } = await startOAuthFlow();
      // If a session was created, set it as active
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      }
    } catch (err) {
      // Log any OAuth errors encountered
      console.error("OAuth error", err);
    }
  }, [startOAuthFlow]);

  // Component's render method
  return (
    // Using an ImageBackground for the screen's background image
    <ImageBackground
      source={require("./../../assets/images/background.jpg")} // Background image source
      style={styles.backgroundImage}
    >
      <View style={styles.contentContainer}>
        {/* Displaying a circular login image at the top */}
        <Image
          source={require("./../../assets/images/login.jpg")} // Login image source
          style={styles.loginImage}
        />
        {/* Container for the text and button, positioned towards the bottom */}
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View style={styles.textContainer}>
            {/* Title text */}
            <Text style={styles.title}>Walkden Girls Under 11s</Text>
            {/* Motivational message */}
            <Text style={styles.motivationalMessage}>
              Train hard, play harder
            </Text>
            {/* Button to initiate the sign-in process */}
            <TouchableOpacity style={styles.getStartedButton} onPress={onPress}>
              <Text style={styles.getStartedButtonText}>
                Sign in with Google
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

// StyleSheet for styling the component
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
  },
  loginImage: {
    width: 300, // Set the width to your desired size
    height: 300, // Ensure height is the same as width for a perfect circle
    resizeMode: "cover",
    borderRadius: 150, // Half of the width/height to make the image circular
    alignSelf: "center", // Center the image horizontally
    marginTop: 125, // Adjust the margin as needed
  },
  textContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Slightly transparent white
    marginHorizontal: 20,
    marginBottom: 75,
    borderRadius: 25,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  motivationalMessage: {
    fontSize: 18,
    color: "#333",
    marginTop: 6,
    textAlign: "center",
  },
  getStartedButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  getStartedButtonText: {
    color: "white",
    fontSize: 18,
  },
});
