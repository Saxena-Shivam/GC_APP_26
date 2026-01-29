import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import logoPaths from "../utils/logoPaths";
import setProperTeamName from "../utils/setProperTeamName";
import teamColors from "../utils/teamColors";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

function OngoingEventCard(props) {
  // console.log(props);
  const teamA = setProperTeamName(props.teamA);
  const teamB = setProperTeamName(props.teamB);

  const timestamp = props.details?.timestamp;
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString(); // Date component
  let hour = date.getHours();
  const minute = date.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12;
  const formattedTime = `${hour}:${minute < 10 ? "0" : ""}${minute} ${ampm}`;

  return (
    <View>
      <LinearGradient
        start={{ x: -0.4, y: 0.0 }}
        end={{ x: 0.7, y: 1 }}
        locations={[0.2, 0.8]}
        colors={["#B0B0B0", "#E0E0E0"]}
        style={styles.cardTop}
      >
        <View
          style={{
            height: 0.13 * deviceHeight,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
            // backgroundColor: "black",
          }}
        >
          <Text style={{ fontWeight: "600", fontSize: 20, marginTop: -12 }}>
            {(props.teamA === "ECE_META" ? "ECE_META_EP" : props.teamA)} v/s {(props.teamB === "ECE_META" ? "ECE_META_EP" : props.teamB)}
          </Text>
          <Text
            style={{
              fontWeight: "700",

              // position: "relative",
              // left: deviceWidth * 0.04,
            }}
          >
            {props.id}
          </Text>
        </View>
        <Image style={styles.LeftImageContainer} source={logoPaths[teamA]} />
        <Image />
        <Text style={styles.LEFTscoreText}>{props.scoreA}</Text>
        <Text style={styles.RIGHTscoreText}>{props.scoreB}</Text>
        <Image style={styles.RightImageContainer} source={logoPaths[teamB]} />
        <Image />
      </LinearGradient>

      <View style={styles.cardBottom}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Text style={styles.BottomTextGame}>{props.gameName}</Text>
          <Text style={styles.BottomTextTeams}>{props.details.location}</Text>
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Text style={styles.BottomTextGame}>{formattedDate}</Text>
          <Text style={styles.BottomTextTime}>{formattedTime}</Text>
        </View>
      </View>
    </View>
  );
}

export default OngoingEventCard;

const styles = StyleSheet.create({
  cardTop: {
    flexDirection: "row",
    height: 0.15 * deviceHeight,
    marginTop: 12,
    marginHorizontal: 0.04 * deviceWidth,
    padding: 16,
    backgroundColor: "black",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    elevation: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.75,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  cardBottom: {
    marginBottom: 0.01 * deviceHeight,
    height: 0.07 * deviceHeight,
    marginHorizontal: "4%",
    padding: 10,
    backgroundColor: "#1A1A2E",
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    elevation: 6,
    shadowColor: "#d41d77",
    // shadowColor: "#1A1A2E",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 0.5,
    shadowOpacity: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  BottomTextGame: {
    color: "white",
    fontSize: 16,
  },
  BottomTextTeams: {
    color: "gray",
  },
  BottomTextTime: {
    color: "gray",
  },
  LeftImageContainer: {
    // width: deviceWidth < 380 ? 30 : 52,
    // height: deviceWidth < 380 ? 30 : 52,
    // borderRadius: deviceWidth < 380 ? 15 : 26,
    width: 40,
    height: 40,
    // borderRadius: 20,
    // borderWidth: 3,
    overflow: "hidden",
    margin: 9,
    marginTop: 36,
    position: "absolute",
    left: 9,
  },
  RightImageContainer: {
    // width: deviceWidth < 380 ? 26 : 52,
    // height: deviceWidth < 380 ? 26 : 52,
    // borderRadius: deviceWidth < 380 ? 15 : 26,
    width: 40,
    height: 40,
    // borderRadius: 20,
    // borderWidth: 3,
    overflow: "hidden",
    margin: 9,
    marginTop: 36,
    position: "absolute",
    right: 9,
  },
  LEFTscoreText: {
    fontSize: 20,
    color: "#322d2d",
    position: "absolute",
    fontWeight: "bold",
    left: 64,
    margin: 9,
    marginTop: 38,
  },
  RIGHTscoreText: {
    color: "#322d2d",
    fontSize: 20,
    position: "absolute",
    fontWeight: "bold",
    right: 64,
    margin: 9,
    marginTop: 38,
  },
});
