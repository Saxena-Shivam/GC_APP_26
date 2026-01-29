import React, { useState, useEffect, useContext, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Modal, ActivityIndicator } from "react-native";
import { Button, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { LoginProvider, LoginContext } from "./store/LoginContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CreditsPage from "./screens/CreditsPage";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import {
  auth,
  iosClientId,
  androidClientId,
  webClientId,
} from "./firebaseConfig";
import LoginScreen from "./screens/LoginPage";
import AllTabs from "./screens/AllTabs";
import { backend_link } from "./utils/constants";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import Events from "./screens/Events/Events";
import { EventsProvider } from "./store/EventsContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  console.log(errorMessage);
  // throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    console.log(existingStatus, "Existing Status");
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    console.log(projectId, "Project ID");
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      console.log(pushTokenString, "Push Token");
      console.log(pushTokenString.data, "Push Token");
      console.log(
        "\n\n\n #################### Push Token #################### \n\n\n\n\n"
      );
      console.log(pushTokenString);
      return pushTokenString.data;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

WebBrowser.maybeCompleteAuthSession();

const Stack = createStackNavigator();

export default function LoginContextWrapper() {
  return (
    <EventsProvider>
    <LoginProvider>
      <App />
    </LoginProvider>
    </EventsProvider>
  );
}
const App = () => {
  const LoginCtx = useContext(LoginContext);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: iosClientId,
    androidClientId: androidClientId,
    webClientId: webClientId,
  });

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    console.log(expoPushToken, "Push Token in App.js");

    if (
      expoPushToken !== null &&
      expoPushToken !== undefined &&
      expoPushToken !== "" &&
      LoginCtx.isLogin
    ) {
      const sendToken = async () => {
        const email = LoginCtx?.user?.email;
        if (email !== null && email !== undefined) {
          try {
            const response = await axios.post(
              backend_link +
                "api/expotoken/addexpotoken?email=" +
                email +
                "&token=" +
                expoPushToken
            );
            console.log(response.data, "Push Token");
          } catch (e) {
            console.log(e, "Error in sending push token");
          }
        }
      };
      sendToken();
    }
  }, [expoPushToken, LoginCtx.isLogin]);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error) => console.log(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // Notification is received while the app is foregrounded(running)
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // Notification response: user interacts with a notification (Tapping on it)
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const [loading, setLoading] = useState(true);
  const [isLoading1, setIsLoading1] = useState(false);
  const authenticateUser = (status) => {
    LoginCtx.setIsLogin(status);
    // LoginCtx.setUser({email:'22ec01006@iitbbs.ac.in'});
  };

  const isUserLoggedIn = async () => {
    const userInfo = await AsyncStorage.getItem("userInfo");
    if (userInfo) {
      LoginCtx.setUser(JSON.parse(userInfo));
      LoginCtx.setIsLogin(true);
      setLoading(false);
    } else {
      LoginCtx.setIsLogin(false);
      setLoading(false);
      promptAsync();
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      setIsLoading1(true);
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
      setLoading(false);
      setTimeout(() => {
        setIsLoading1(false);
      }, 1000 * 4);
    }
  }, [response]);

  const getDept = (email) => {
    if(email.length < 22) return "PhD";
    if(email[5] == '1' || email[5] == '2'){
        if(email.substring(2, 4) == 'cs') return "CSE";
        if(email.substring(2, 4) == 'ce') return "CE";
        if(email.substring(2, 4) == 'me') return "ME";
        if(email.substring(2, 4) == 'ee') return "EE";
        if(email.substring(2, 4) == 'mm') return "MM";
        if(email.substring(2, 4) == 'ec') return "ECE";
        if(email.substring(2, 4) == 'ep') return "EP";
    }
    if(email[5] == '3') return "ITEP";
    if(email[5] == '6') return "MTech";
    return "MSc";
};

  useEffect(() => {
    // isUserLoggedIn();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        AsyncStorage.setItem("userInfo", JSON.stringify(user));
        LoginCtx.setUser(user);
        LoginCtx.setIsLogin(true);
        const resp = await axios.post(
          backend_link + "api/user/add  User",
          {
            email: user.email,
            name: user.displayName,
            dept: getDept(user.email),
          }
        );
      } else {
        LoginCtx.setUser(null);
        LoginCtx.setIsLogin(false);
        setLoading(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (LoginCtx.isLogin) {
      //check if user is admin
      console.log("Admin logging in");
      const isAdminorNot = async () => {
        const user = LoginCtx.user;
        // const Testemail = {
        //   admin: "22EC01057@iitbbs.ac.in",
        //   user: "22EC01099@iitbbs.ac.in",
        // };
        if (user?.email !== null) {
          try {
            const response = await axios.get(
              backend_link + "api/admin/isAdmin/" + user?.email
            );
            console.log(response.data, "Admin or not");
            LoginCtx.setIsAdmin(response.data.isAdmin);
          } catch (e) {
            console.log(e, "Error in checking admin or not");
          } finally {
            setLoading(false);
          }
        }
      };
      isAdminorNot();
    }
  }, [LoginCtx.isLogin]);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <NavigationContainer>
          <StatusBar style="light" />

          {loading && (
            <Modal transparent={true} animationType="none" visible={loading}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                <ActivityIndicator size="large" color="#fff" />
              </View>
            </Modal>
          )}
          {!loading && LoginCtx.isLogin ? (
            <>
              <AllTabs />
              {/* <Button
                title="notify"
                style={{ backgroundColor: "red", padding: "10px" }}
                onPress={() => {
                  scheduleNotificationHandler("title", "body");
                  console.log("Notification");
                }}
              /> */}
            </>
          ) : (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login">
                {(props) => (
                  <>
                    <LoginScreen
                      {...props}
                      authenticateUser={authenticateUser}
                      promptAsync={promptAsync}
                      loading1={isLoading1}
                      isUserLoggedIn={isUserLoggedIn}
                    />
                  </>
                )}
              </Stack.Screen>
              <Stack.Screen
                name="Credits"
                component={CreditsPage}
                options={({ route }) => ({
                  title: "Credits",
                })}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
});
