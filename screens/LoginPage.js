import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { LoginContext } from "../store/LoginContext";
import { ActivityIndicator } from "react-native-paper";

const Login = ({
  authenticateUser,
  promptAsync,
  loading1,
  navigation,
  isUserLoggedIn,
}) => {
  const LoginCtx = useContext(LoginContext);
  const AdminLogin = () => {
    promptAsync();
  };
  const userLogin = () => {
    if (__DEV__) {
      console.log("Running in development mode");
      LoginCtx.setUser({
        email: "23cs01001@iitbbs.ac.in",
      });
      authenticateUser(true);
    } else {
      console.log("Running in production mode");
      // promptAsync();
      isUserLoggedIn();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbar}>
        {/* <TouchableOpacity onPress={AdminLogin} style={styles.topbtn}>
          <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>
            Admin
          </Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logoBig} />
      </View>
      <View style={styles.poweredBy}>
        <Text style={styles.poweredByTextBig}>Powered By</Text>
        <Image
          source={require("../assets/Gymkhana.png")}
          style={styles.poweredByLogo}
        />
        <Image
          source={require("../assets/Neuro.png")}
          style={styles.poweredByLogo}
        />
      </View>
      <View style={styles.bottombar}>
        <TouchableOpacity onPress={userLogin} style={styles.loginButton}>
          <Image
            source={require("../assets/google.png")}
            style={{ width: 40, height: 40, marginRight: "26%" }}
          />
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
            {!loading1 ? "Login" : <ActivityIndicator size={"large"} />}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Credits")}
          style={styles.Credits}
        >
          <Text style={{ color: "#007F87", fontWeight: "bold", fontSize: 20 }}>
            Developer Credits
          </Text>
        </TouchableOpacity>
        {/* <Text style={styles.forgotPassword}>Forgot Password?</Text> */}
        {/* {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null} */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    paddingTop: 50,
  },
  topbtn: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30, // Added for rounded corners
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  topbar: {
    alignItems: "flex-end",
    width: "100%",
    height: 50,
    paddingRight: 20,
    justifyContent: "center",
  },

  logoContainer: {
    alignItems: "center",
  },
  logoBig: {
    width: 330,
    height: 330, // Increased size
    // Increased size
  },
  poweredBy: {
    marginTop: 10,
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  poweredByTextBig: {
    color: "white",
    marginRight: 5,
    fontSize: 20, // Increased font size
  },
  poweredByLogo: {
    width: 70,
    height: 70,
  },
  bottombar: {
    padding: 15,

    borderRadius: 30,
    backgroundColor: "white",
    position: "absolute", // Positioned at the bottom
    bottom: -100,
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%", // Ensure it spans the whole width
    height: "45%",
  },
  loginButton: {
    flexDirection: "row",
    backgroundColor: "#25262c", // Example blue color
    padding: 10,
    borderRadius: 5,
    marginBottom: 45, // Added some margin at the bottom
    width: "90%", // Make the button wider
    alignItems: "center",
    justifyContent: "flex-start", // Center the text
    borderColor: "orange",
    borderWidth: 3,
    marginTop: 40,
  },
  forgotPassword: {
    color: "black",
    marginTop: 10,
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
  },
});

export default Login;
