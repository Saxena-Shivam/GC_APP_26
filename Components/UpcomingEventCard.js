import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

import React, { useState, useContext } from "react";

import logoPaths from "../utils/logoPaths";
import setProperTeamName from "../utils/setProperTeamName";
import { backend_link } from "../utils/constants";
import { LoginContext } from "../store/LoginContext";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

function UpcomingEventCard(props) {
  const timestamp = props.details?.timestamp;
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString();
  let hour = date.getHours();
  const minute = date.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  const formattedTime = `${hour}:${minute < 10 ? "0" : ""}${minute} ${ampm}`;
  const LoginCtx = useContext(LoginContext);
  // const user_branch = LoginCtx.detail.dept;
  const user_email = LoginCtx?.user?.email;

  const teamA = setProperTeamName(props.teamA);
  const teamB = setProperTeamName(props.teamB);

  const { branchCoords } = props;

  const checkBranch = (branch) => {
    console.log(
      branchCoords,
      user_email,
      branch,
      "testing in upcoming event card",
    );
    if (
      branch === "ECE" ||
      branch === "MM" ||
      branch === "EP" ||
      branch === "EC_META" ||
      branch === "ECE_META"
    ) {
      return branchCoords["ECE_META_EP"] === user_email;
    }
    return branchCoords[branch] === user_email;
  };

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        start={{ x: -0.4, y: 0.0 }}
        end={{ x: 0.7, y: 1 }}
        locations={[0.2, 0.8]}
        colors={["#B0B0B0", "#E0E0E0"]}
        style={styles.cardTop}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.matchText}>
            {props.teamA} v/s {props.teamB}
          </Text>
          <Text style={styles.matchId}>{props.id}</Text>
        </View>

        <View style={styles.teamsContainer}>
          <View style={styles.teamWrapper}>
            <Image style={styles.teamImage} source={logoPaths[teamA]} />
          </View>

          <View style={styles.teamWrapper}>
            <Image style={styles.teamImage} source={logoPaths[teamB]} />
          </View>
        </View>
        <View style={styles.buttonview}>
          {LoginCtx.isAdmin &&
            (checkBranch(props.teamA) || checkBranch(props.teamB)) && (
              <TouchableOpacity
                style={styles.RegisterButton}
                onPress={() =>
                  props.navigation.navigate("TeamRegistration", {
                    data: props,
                    branch: LoginCtx.detail.dept,
                    user: LoginCtx.user.email,
                    event_category: "live_events",
                  })
                }
              >
                <Text style={styles.voteButtonText}>Register Team</Text>
              </TouchableOpacity>
            )}
        </View>
      </LinearGradient>

      <View style={styles.cardBottom}>
        <View style={styles.detailsWrapper}>
          <Text style={styles.detailText}>{props.gameName}</Text>
          <Text style={styles.detailText}>{props.details.location}</Text>
        </View>
        <View style={styles.detailsWrapper}>
          <Text style={styles.detailText}>{formattedDate}</Text>
          <Text style={styles.detailText}>{formattedTime}</Text>
        </View>
      </View>
    </View>
  );
}

export default UpcomingEventCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "black",
    margin: 10,
  },
  cardTop: {
    padding: 12,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    elevation: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.75,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  matchText: {
    fontWeight: "600",
    fontSize: 20,
  },
  matchId: {
    fontWeight: "700",
    fontSize: 16,
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: -10,
  },
  teamWrapper: {
    alignItems: "center",
  },
  teamImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "contain",
    marginBottom: 3,
  },
  teamScore: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 3,
  },
  buttonview: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  voteButton: {
    backgroundColor: "#d42070",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    width: 110,
    marginTop: 15,
  },
  RegisterButton: {
    backgroundColor: "#e73560",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    width: 120,
    marginTop: 15,
  },
  voteButtonText: {
    color: "white",
    fontSize: 15,
  },
  RegisterButtonText: {
    color: "white",
    fontSize: 15,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#1A1A2E",
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    elevation: 6,
    shadowColor: "#d41d77",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 0.5,
    shadowOpacity: 1,
  },
  detailsWrapper: {
    alignItems: "center",
  },
  detailText: {
    color: "white",
    fontSize: 16,
  },
});
