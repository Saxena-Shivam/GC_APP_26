import { useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  Pressable,
} from "react-native";
import logoPaths from "../utils/logoPaths";
import { LinearGradient } from "expo-linear-gradient";
import { backend_link } from "../utils/constants";
import setProperTeamName from "../utils/setProperTeamName";
import { LoginContext } from "../store/LoginContext";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from "@expo/vector-icons";

import axios from "axios";

function AdminSportEventCard(props) {
  // console.log("testing for bets: ", props);
  const [status, setStatus] = useState(props.status);
  const loginCtx = useContext(LoginContext);

  const teamA = setProperTeamName(props.teamA);
  const teamB = setProperTeamName(props.teamB);

  // const item = props.item;
  // console.log("siddart is now testing: ", props);

  const [update, setUpdate] = useState(false);
  const [scoreTeamA, setScoreTeamA] = useState(props.scoreA);
  const [scoreTeamB, setScoreTeamB] = useState(props.scoreB);

  const date = new Date(props?.details?.timestamp);
  const formattedDate = date.toLocaleDateString(); // Date component
  let hour = date.getHours();
  const minute = date.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12;
  const formattedTime = `${hour}:${minute < 10 ? "0" : ""}${minute} ${ampm}`;

  const deleteConfirmHandler = () => {
    Alert.alert("Delete", "Are you sure you want to delete this event?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => console.log("Cancel Pressed"),
      },
      {
        text: "Delete",
        onPress: deleteHandler,
      },
    ]);
  };

  const deleteHandler = async () => {
    const body = {
      eventId: props.gameName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      subEventId: props.subEventId,
      email: loginCtx?.user?.email,
    };
    console.log(body);
    try {
      const resp = await axios.post(
        backend_link + "api/event/deleteLiveEvent",
        body
      );
      console.log(resp);
      props.setIsEventUpdated((prev) => !prev);
      Alert.alert("Event Deleted");
    } catch (err) {
      if (err.response.status === 401) {
        Alert.alert("Error", "You are not authorized to delete the event");
        return;
      }
      console.log("Event delete failed", err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const submitHandler = async () => {
    if (
      scoreTeamA === undefined ||
      scoreTeamB === undefined ||
      scoreTeamA === null ||
      scoreTeamB === null
    )
      return;

    if (status === "") {
      Alert.alert("Error", "Please select status");
      return;
    }
    if (scoreTeamA === "" || scoreTeamB === "") {
      Alert.alert("Error", "Please enter valid scores");
      return;
    }

    const eventId = props.gameName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const teamAscore = parseInt(scoreTeamA);
    const teamBscore = parseInt(scoreTeamB);
    if (isNaN(teamAscore) || isNaN(teamBscore)) {
      Alert.alert("Error", "Please enter valid scores");
      return;
    }
    const points = {
      teamA: {
        bets: props.betsA,
        name: props.teamA,
        points: teamAscore,
      },
      teamB: {
        bets: props.betsB,
        name: props.teamB,
        points: teamBscore,
      },
    };
    const email = loginCtx?.user?.email;
    console.log("hii");
    const body = {
      eventId,
      subEventId: props.subEventId,
      email,
      points,
      status: status,
    };
    console.log(body);
    try {
      const resp = await axios.post(
        backend_link + "api/event/updateLiveEvent",
        body
      );
      console.log(resp);
      props.setIsEventUpdated((prev) => !prev);
      setUpdate(false);
      Alert.alert("Score Updated");
    } catch (err) {
      if (err.response.status === 401) {
        Alert.alert("Error", "You are not authorized to update the score");
        return;
      }
      console.log("points update failed", err);
      Alert.alert("Error", "Something went wrong");
    }
  };
  return (
    <View>
      <LinearGradient
        start={{ x: -0.4, y: 0.0 }}
        end={{ x: 0.7, y: 1 }}
        locations={[0.5, 1]}
        colors={["white", "white"]}
        style={styles.cardTop}
      >
        <View>
          <Text style={{ fontWeight: "700", paddingBottom: 20 }}>
            {props.teamA} v/s {props.teamB}
          </Text>
          <Text
            style={{
              fontWeight: "700",
              paddingBottom: 20,
              position: "relative",
              left: deviceWidth * 0.04,
            }}
          >
            {props.subEventId}
          </Text>
        </View>
        <Image style={styles.LeftImageContainer} source={logoPaths[teamA]} />
        <Text style={styles.LEFTscoreText}>{props.scoreA}</Text>
        <Text style={styles.RIGHTscoreText}>{props.scoreB}</Text>
        <Image style={styles.RightImageContainer} source={logoPaths[teamB]} />

        <View
          style={{
            position: "absolute",
            right: 10,
            top: 10,
          }}
        >
          <Pressable onPress={deleteConfirmHandler}>
            <AntDesign name="delete" size={24} color="black" />
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.BottomTextGame}>{props.gameName}</Text>
          <Text style={styles.BottomTextTeams}>{props?.details?.location}</Text>
        </View>
        <View>
          <Text style={styles.BottomTextGame}>{formattedDate}</Text>
          <Text style={styles.BottomTextTime}>{formattedTime}</Text>
        </View>

        <TouchableOpacity
          style={styles.UpdateScoreButton}
          onPress={() => {
            setUpdate(!update);
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Update</Text>
        </TouchableOpacity>
      </View>
      {update && (
        <>
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={styles.textView}>
                  <TextInput
                    keyboardType="numeric"
                    style={{ height: 40 }}
                    placeholder={" Score of " + teamA}
                    onChangeText={(newText) => setScoreTeamA(newText)}
                    value={scoreTeamA.toString()}
                  />
                </View>
                <View style={{ width: 10 }}></View>
                <View style={styles.textView}>
                  <TextInput
                    keyboardType="numeric"
                    style={{ height: 40 }}
                    placeholder={" Score of " + teamB}
                    onChangeText={(newText) => setScoreTeamB(newText)}
                    value={scoreTeamB.toString()}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity style={styles.dropdown}>
                  <Picker
                    selectedValue={status}
                    style={{ height: 50, width: 300, color: "white" }}
                    onValueChange={(itemValue, itemIndex) =>
                      setStatus(itemValue)
                    }
                  >
                    <Picker.Item label="select" value="" />
                    <Picker.Item label="Live" value="live" />
                    <Picker.Item label="UpComing" value="upcoming" />
                    <Picker.Item label="Past" value="concluded" />
                  </Picker>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.button}>
              <Button onPress={submitHandler} title="Submit"></Button>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
export default AdminSportEventCard;

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  UpdateScoreButton: {
    backgroundColor: "rgb(212,36,119	)",
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    height: 45,
    padding: 3,
  },
  container: {
    flexDirection: "column",
    flex: 1,
    position: "relative",
    top: -35,
    minHeight: 100,
    padding: 20,
    paddingBottom: 0,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    // paddingVertical: ,
    borderWidth: 2,
    margin: 3,
    borderColor: "#5C6168",
    borderRadius: 5,
  },
  innerContainer: {
    flexDirection: "column",
    minHeight: 80,
    gap: 6,
    alignItems: "stretch",
    flex: 1,
    paddingTop: 10,
  },
  textView: {
    backgroundColor: "white",
    flex: 1,
    width: 10,
    height: 40,
    border: 10,
    borderColor: "black",
    borderRadius: 10,
  },
  button: {
    paddingVertical: 20,
    border: 10,
    borderColor: "black",
    borderRadius: 10,
  },
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
    height: 0.09 * deviceHeight,
    marginHorizontal: "4%",
    padding: 10,
    backgroundColor: "#1A1A2E",
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    elevation: 6,
    shadowColor: "white",
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
    position: "relative",
    right: -18,
  },
  LeftImageContainer: {
    width: deviceWidth < 380 ? 30 : 52,
    height: deviceWidth < 380 ? 30 : 52,
    borderRadius: deviceWidth < 380 ? 15 : 26,
    borderWidth: 3,
    overflow: "hidden",
    margin: 9,
    marginTop: 36,
    position: "absolute",
    left: 9,
  },
  RightImageContainer: {
    width: deviceWidth < 380 ? 26 : 52,
    height: deviceWidth < 380 ? 26 : 52,
    borderRadius: deviceWidth < 380 ? 15 : 26,
    borderWidth: 3,
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
    left: 70,
    margin: 9,
    marginTop: 38,
  },
  RIGHTscoreText: {
    color: "#322d2d",
    fontSize: 20,
    position: "absolute",
    right: 70,
    margin: 9,
    marginTop: 38,
  },
});
