import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import logoPaths from "../../utils/logoPaths";
import setProperTeamName from "../../utils/setProperTeamName";
import { backend_link } from "../../utils/constants";
import { LoginContext } from "../../store/LoginContext";
import { useContext, useState } from "react";

// import { Icon } from "react-native-elements";
// import { useState, useContext, useEffect } from "react";
// import { EventsContext } from "../../store/EventsContext";
// import TopMostCard from "../../Components/TopMostCard";
// import OngoingUpcomingButton from "../../Components/OngoingUpcomingButtons";
// import OngoingScreen from "./OngoingScreen";
// import UpcomingScreen from "./UpcomingScreen";
// import TechEventScreen from "./TechEventScreen";
// import CultEventScreen from "./CultEventScreen";
// import PastScreen from "./PastScreen";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

async function handleClick(
  eventName,
  eventId,
  LoginCtx,
  betTeamName,
  teamNameA,
  teamNameB,
  navigation
) {
  // console.log(LoginCtx.user.email);
  try {
    // ✅ Fetch the existing event data
    const response = await axios.get(
      `${backend_link}api/event/getUpcomingEventsById?eventId=${eventName}`
    );

    console.log("Event ID:", eventId);
    const eventData = response.data;
    if (!eventData) {
      console.error("No events found.");
      return;
    }

    // ✅ Extract event details
    const eventDetails = eventData.event[eventId].data;
    console.log("Event Details:", eventDetails);

    const user_email = LoginCtx.user.email;

    // ✅ Ensure points structure exists
    if (
      !eventDetails.points ||
      !eventDetails.points.teamA ||
      !eventDetails.points.teamB
    ) {
      console.error("Invalid event data structure!");
      return;
    }

    // ✅ Check if the user has already placed a bet on either team
    const userInTeamA = eventDetails.points.teamA.bets.includes(user_email);
    const userInTeamB = eventDetails.points.teamB.bets.includes(user_email);

    if (userInTeamA || userInTeamB) {
      Alert.alert(
        "Bet Already Placed",
        `You have already placed a bet on Team ${userInTeamA ? teamNameA : teamNameB }`,
        [{ text: "OK", onPress: () => navigation.navigate("EventsStack",{reloader:1}) }]
      );
      return; // ✅ Do NOT send a request to the backend
    }

    // ✅ Determine the correct team to update
    const teamKey = betTeamName === "A" ? "teamA" : "teamB";
    //  TODO : WRITE A FUNCTON TO CHECK IF USER HAS ALREADY BET
    const updatedBets = [...eventDetails.points[teamKey].bets, user_email];

    console.log(`Updated Bets for ${teamKey}:`, updatedBets);

    // ✅ Prepare updated event data (REMOVED `betTeamName` from request)
    const updatedEventData = {
      event: {
        [eventId]: {
          updatedBy: [
            ...eventData.event[eventId].updatedBy, // ✅ Keep existing `updatedBy` entries
            // {
            //   email: user_email,
            //   timestamp: new Date().toISOString(),
            // },
          ],
          data: {
            ...eventDetails,
            points: {
              ...eventDetails.points,
              [teamKey]: {
                ...eventDetails.points[teamKey],
                bets: updatedBets, // ✅ Updating the correct team's bets
              },
            },
          },
        },
      },
      eventName,
      user_email,
      betTeamName,
    };

    console.log(
      "Sending data to API:",
      JSON.stringify(updatedEventData, null, 2)
    );

    // ✅ Make API call to update the database
    const res = await axios.post(
      `${backend_link}api/event/scheduleLiveEventWithBets`,
      updatedEventData
    );

    console.log("API Response:", res.data);

    Alert.alert(
      "Bet Placed",
      `Your bet on ${betTeamName === "A" ? teamNameA : teamNameB} has been placed successfully.`,
      [{ text: "OK", onPress: () => navigation.navigate("EventsStack",{reloader:1}) }]
    );


  } catch (error) {
    console.error("Error updating bets:", error.message);
  }
}

// export default function BettingScreen({route}) {
//   const { gameName, gameId, voteType } = route.params;
//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.newText}>hello</Text>
//     </SafeAreaView>
//   );
// }

export default function BettingScreen({ route, navigation}) {
  const props = route.params.data;
  const timestamp = props.details?.timestamp;
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString();
  let hour = date.getHours();
  const minute = date.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  const formattedTime = `${hour}:${minute < 10 ? "0" : ""}${minute} ${ampm}`;
  const LoginCtx = useContext(LoginContext);

  const currentUser = LoginCtx.user.email;

  // ✅ useState for tracking user votes
  const [userInA, setUserInA] = useState(props.betsA.includes(currentUser));
  const [userInB, setUserInB] = useState(props.betsB.includes(currentUser));

  const teamA = setProperTeamName(props.teamA);
  const teamB = setProperTeamName(props.teamB);

  const { playersA, playersB } = props;

  async function handleVoteClick(team) {
    if (userInA || userInB) {
      Alert.alert(
        "Bet Already Placed",
        `You have already placed a bet on ${userInA ? props.teamA : props.teamB}`,
        [{ text: "OK", onPress: () => navigation.navigate("EventsStack",{reloader:1}) }]
      );
      return;
    }

    await handleClick(
      props.gameName,
      props.id,
      LoginCtx,
      team,
      props.teamA,
      props.teamB,
      navigation
    );

    // ✅ Update state after successful bet placement
    if (team === "A") {
      setUserInA(true);
    } else {
      setUserInB(true);
    }
  }

  console.log("siddarth testing: ", playersA, playersB);

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.title}>Voting</Text>
        <Text style={styles.note}>
          Note: Press the team name to place your vote
        </Text>
      <View style={styles.cardTop}>
        <View style={styles.headerContainer}>
          <Text style={styles.detailText}>{props.gameName}</Text>
          <Text style={styles.matchId}>{props.id}</Text>
        </View>

        <View style={styles.teamsContainer}>
          <View style={styles.teamWrapper}>
            <Image style={styles.teamImage} source={logoPaths[teamA]} />
            {!userInA && !userInB ? (
              <TouchableOpacity
                style={styles.voteButton}
                onPress={() => handleVoteClick("A")}
              >
                <Text style={styles.voteButtonText}>{props.teamA}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.votedText}>
                {userInA ? `Voted for ${props.teamA} ✅` : ""}
              </Text>
            )}
            <FlatList
              data={playersA?.length ? playersA : ["No Players"]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={leaderboardStyles.item}>
                  <Text style={leaderboardStyles.rank}>{index + 1}. </Text>
                  <Text style={leaderboardStyles.name}>{item}</Text>
                </View>
              )}
              style={leaderboardStyles.scrollableList}
              nestedScrollEnabled={true} // Enables scrolling inside FlatList
            />
          </View>

          <View style={styles.teamWrapper}>
            <Image style={styles.teamImage} source={logoPaths[teamB]} />
            {!userInA && !userInB ? (
              <TouchableOpacity
                style={styles.voteButton}
                onPress={() => handleVoteClick("B")}
              >
                <Text style={styles.voteButtonText}>{props.teamB}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.votedText}>
                {userInB ? `Voted for ${props.teamB} ✅` : ""}
              </Text>
            )}
            <FlatList
              data={playersB?.length ? playersB : ["No Players"]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={leaderboardStyles.item}>
                  <Text style={leaderboardStyles.rank}>{index + 1}. </Text>
                  <Text style={leaderboardStyles.name}>{item}</Text>
                </View>
              )}
              style={leaderboardStyles.scrollableList}
              nestedScrollEnabled={true} // Enables scrolling inside FlatList
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    display: "flex",
    height: deviceHeight,
    backgroundColor: "black",
  },
  title: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  note: {
    textAlign: "center",
    fontSize: 15,
    color: "white",
    marginTop:  20,
  },
  cardTop: {
    padding: 12,
    // borderTopRightRadius: 16,
    // borderTopLeftRadius: 16,
    // elevation: 4,
    // shadowColor: "black",
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 6,
    // shadowOpacity: 0.75,
    marginTop: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  matchText: {
    fontWeight: "600",
    fontSize: 20,
    color: "white",
  },
  matchId: {
    marginTop: 10,
    fontSize: 18,
    color: "white",
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
  },
  teamWrapper: {
    alignItems: "center",
  },
  teamImage: {
    width: 90,
    height: 90,
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
  voteButtonText: {
    color: "white",
    fontSize: 15,
  },
  votedText: {
    marginTop: 20,
    color: "white",
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
    fontWeight: "700",
    fontSize: 20,
    color: "white",
  },
});

const leaderboardStyles = StyleSheet.create({
  scrollableList: {
    maxHeight: 150, // Limits height and makes list scrollable if overflowing
    width: "100%",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginVertical: 4,
    borderRadius: 8,
  },
  rank: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gold",
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    color: "white",
  },
});
