import React, { useState } from "react";
import axios from "axios";
import { View, TextInput, TouchableOpacity, Text, ScrollView, StyleSheet} from "react-native";
import { Alert } from "react-native";

// import firestore from "@react-native-firebase/firestore";

import {backend_link} from "../../utils/constants";

const PlayerList = ({ title, initialPlayers, eventName, eventId, category, event_category}) => {
  console.log(eventName, eventId, "testing")
  const [players, setPlayers] = useState(initialPlayers.length > 0 ? initialPlayers : [""]); // Set initial players

  const addPlayer = () => {
    if (players.length >= 20) {
      Alert.alert("Maximum 20 players allowed");
      return;
    }
    setPlayers([...players, ""]); // Add an empty input
  };

  const deletePlayer = () => {
    if (players.length > 0) {
      setPlayers(players.slice(0, -1)); // Remove the last input
    }
  };

  const updatePlayerName = (index, text) => {
    const newPlayers = [...players];
    newPlayers[index] = text;
    setPlayers(newPlayers);
  };

  const savePlayersToFirebase = async ({team}) => {
    console.log(`Saving players for ${team} to Firebase:`, players);
    if (event_category === "live_events") {
      console.log('sending to live events');
      const response = await axios.post(`${backend_link}api/event/saveTeamLive`, {team, players, eventName, eventId});
      console.log(response.message);
    } else {
      console.log('seding to all events')
      const response = await axios.post(`${backend_link}api/event/saveTeamAll`, {team, players, eventId, category});
      console.log(response.message);
    }
    Alert.alert("Team saved");
  };

  console.log("this is a test by siddarth", title);

  return (
    <View style={styles.listWrapper}>
      <View style={styles.listContainer}>
        <Text style={styles.title}>{title==="ECE_META" ? "ECE_META_EP" : title}</Text>
          {players.map((player, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder={`Player ${index + 1}`}
              placeholderTextColor="#ccc"
              value={player}
              onChangeText={(text) => updatePlayerName(index, text)}
            />
          ))}
        <TouchableOpacity style={styles.button} onPress={addPlayer}>
          <Text style={styles.buttonText}>Add Player</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={deletePlayer}>
          <Text style={styles.buttonText}>Delete Player</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => savePlayersToFirebase({team: title})}>
          <Text style={styles.buttonText}>Save Team</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TeamRegistration = ({route}) => {
  // Get team players from route.params or set to an empty array
  const {user, event_category, branch} = route.params;
  console.log(route.params);
  let data = {};

  const Branch = (branch === ("ECE" || "MM") ? "ECE_META" : branch);

  let initialPlayers = [];
  console.log("event is a part of ", event_category);
  if (event_category === "live_events") {
    data = route.params.data;
    const teamA = data?.teamA ?? "";
    const teamB = data?.teamB ?? "";
    const playersA = data?.playersA ?? [];
    const playersB = data?.playersB ?? [];
    console.log("this is my data from TeamRegistration", data);
    if (teamA === Branch) {
      initialPlayers = playersA || [];
    } else {
      initialPlayers = playersB || [];
    }
  } else {
    data = route.params.data.data.item.data;
    console.log("this is my data from TeamRegistration", data.pointsTable[Branch].players) ;
    initialPlayers = data.pointsTable[Branch].players || [];
    console.log("initial players: ", initialPlayers);
  }

  console.log("initial players: ", initialPlayers);

  console.log("team register: ",data, user, data.category, event_category, Branch);
  // console.log("Branch table: ", data.pointsTable[branch]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <PlayerList title={Branch} initialPlayers={initialPlayers} eventName = {data.gameName || ""} eventId = {data.id || data.eventId || ""} category = {data.category} event_category = {event_category || ""}/>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000", // Black background
    padding: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Keep items at the top
  },
  listWrapper: {
    flex: 1,
    alignItems: "center", // Align buttons properly
    marginLeft: 20,
  },
  listContainer: {
    backgroundColor: "#111", // Slightly lighter black for contrast
    padding: 15,
    borderRadius: 10,
    width: "90%", // Fixed width for each team
    alignSelf: "flex-start", // Prevents equal height for both lists
  },
  title: {
    fontSize: 20,
    color: "#ff4d88", // Pinkish title color
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  scrollView: {
    maxHeight: 300, // Internal scrolling for inputs
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff", // White border
    color: "#fff", // White text
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#222", // Slightly lighter black for contrast
  },
  button: {
    backgroundColor: "#ff4d88", // Pinkish button color
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10, // Space between buttons
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TeamRegistration;

