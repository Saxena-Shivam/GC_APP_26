import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useEffect } from "react";
import axios from "axios";
import { backend_link } from "../constants";

export const getPushToken = async () => {
  const token = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig.extra.eas.projectId,
  });

  console.log(token.data, "Push 1Token");
  AsyncStorage.setItem("pushToken", token.data);
  return token;
};

export const configurePushNotifications = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  let finalStatus = status;
  if (status !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("Failed to get push token for push notification!");
    return;
  }
  const pushToken = await getPushToken();
  // console.log(pushToken.data, "Push2 Token");

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return pushToken.data;
};

const loggerNotification = async (message, from, to) => {
  const data = {
    noti: message,
    email: from,
    receiver: to,
  };
  try {
    const resp = await axios.post(
      backend_link + "api/logger/add-notification",
      data
    );
    console.log(resp.data);
  } catch (e) {
    console.log(e);
  }
};
export const sendNotificationAll = async (title, body, data, from) => {
  try {
    const resp = await axios.get(backend_link + "api/expotoken/getexpotoken");
    console.log(resp.data, "allnoti");
    const allusers = resp.data?.details;
    await Promise.all(
      Object.entries(allusers).map(async ([email, userData]) => {
        const message = {
          to: userData.token,
          sound: "default",
          title: title,
          body: body,
          data: data,
        };

        await axios.post("https://exp.host/--/api/v2/push/send", message);
      })
    );
    const message = {
      title: title,
      body: body,
      data: data,
    };
    loggerNotification(message, from, "All");
    console.log("Notifications sent successfully");
  } catch (e) {
    console.log(e);
    Alert.alert("Failed to send notifications");
  }
};
// sendNotificationAll("titleam", "body", { data: "data" });

export const sendNotificationTeam = async (title, body, team, data, from) => {
  try {
    const resp = await axios.get(backend_link + "api/expotoken/getexpotoken");
    const allusersToken = resp.data?.details;

    const teamMembers = await axios.get(
      backend_link + "api/teams/getFollowers?team=" + team
    );
    const teamMembersData = teamMembers.data?.teamFollowers?.users;
    console.log(teamMembersData, "teamMembersData");
    console.log(allusersToken, "allusersToken");

    const tokens = teamMembersData
      .map((memberEmail) => allusersToken[memberEmail]?.token)
      .filter((token) => token);
    console.log(tokens, "tokens");

    const message = {
      title: title,
      body: body,
      data: data,
    };

    await Promise.all(
      tokens.map(async (token) => {
        const notificationMessage = { ...message, to: token };
        await axios.post(
          "https://exp.host/--/api/v2/push/send",
          JSON.stringify(notificationMessage),
          {
            headers: {
              Accept: "application/json",
              "Accept-encoding": "gzip, deflate",
              "Content-Type": "application/json",
            },
          }
        );
      })
    );

    loggerNotification(message, from, team);
    console.log("All notifications sent successfully");
  } catch (e) {
    console.error("Error sending notifications:", e, e.message);
    Alert.alert("Failed to send notifications");
  }
};

// sendNotificationTeam("title", "body", "ECE_META", { data: "data" });
