import { useState, useEffect } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Icon } from "react-native-elements";

import axios from "axios";
import Loader from "../../Components/Loader";
import { backend_link } from "../../utils/constants";
import AdminSportEventCard from "../../Components/AdminSportEventCard";

function UpdateSportScreen(props) {
  console.log(props);
  const [isEventUpdated, setIsEventUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ongoingEvents, setOngoingEvents] = useState([]);

  const [search, setSearch] = useState("");

  const [filteredData, setFilteredData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    console.log(search);
    if (search.length == 0 || !search) {
      setFilteredData(ongoingEvents);
      return;
    }
    const data = ongoingEvents.filter((item) => {
      let teamA = item?.teamA.toLowerCase();
      let teamB = item?.teamB.toLowerCase();
      let gameName = item?.gameName.toLowerCase();
      const id = item?.id.toLowerCase();
      return (
        teamA.includes(search.toLowerCase()) ||
        teamB.includes(search.toLowerCase()) ||
        gameName.includes(search.toLowerCase()) ||
        id.includes(search.toLowerCase())
      );
    });
    setFilteredData(data);
  }, [search, dataLoaded]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          backend_link + "api/event/getAllLiveEvents",
        );
        console.log("adarsh is tthe best");
        console.log(response.data); // array of live events
        const data = response.data.events;
        const newData = data.map((item) => {
          const gameName = item.eventId;
          const teams = item.subEvents;
          console.log("teams", teams); // .data
          const newSubEvents = teams.map((item1) => {
            console.log("item11", item1);
            const subEventId = item1.subEventId;
            const teamA = item1.data.points
              ? item1.data.points?.teamA
              : item1.data.pointsTable?.teamA;
            const teamB = item1.data.points
              ? item1.data.points?.teamB
              : item1.data.pointsTable?.teamB;

            console.log("sid testingsdsf: ", teamA.bets, teamB.bets); // sending data to console correctly
            return {
              subEventId: subEventId,
              details: item1.data.details,
              status: item1.data.status,
              gameName: gameName,
              id:
                item1.data.details.title.split(" ").join("") +
                "++" +
                item1.subEventId.split(" ").join(""),

              teamA: teamA?.name || item1.subEventId.split(" vs ")[0],
              teamB: teamB?.name || item1.subEventId.split(" vs ")[1],
              scoreA: teamA?.points,
              scoreB: teamB?.points,
              betsA: teamA?.bets,
              betsB: teamB?.bets,
            };
          });
          return newSubEvents;
        });
        //console.log("hi");
        console.log(newData.flat());
        setOngoingEvents(newData.flat());

        setDataLoaded(true);
        setFilteredData(newData.flat());
      } catch (err) {
        console.log(err);
        Alert.alert("Error", "Something went wrong", [{ text: "Okay" }]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isEventUpdated]);

  return (
    <View style={styles.eventsContainer}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            color: "white",
            width: "90%",
            marginTop: 10,
            alignItems: "center",
            flexDirection: "row",

            borderWidth: 1,
            paddingLeft: 10,
            borderRadius: 10,
            borderColor: "white",
          }}
          onPress={() => console.log("hi")}
        >
          <Icon name="search1" type="antdesign" color="white" size={20} />
          <TextInput
            style={{
              width: "90%",
              height: 40,
              paddingLeft: 10,
            }}
            color="white"
            onChangeText={(text) => setSearch(text)}
            placeholder="Search"
            placeholderTextColor={"grey"}
          />
        </View>
      </View>

      <View style={{ maxHeight: "90%" }}>
        <FlatList
          data={filteredData}
          renderItem={(itemData, index) => {
            return (
              <AdminSportEventCard
                subEventId={itemData.item.subEventId}
                gameName={itemData.item.gameName}
                id={itemData.item.id}
                teamA={itemData.item.teamA}
                teamB={itemData.item.teamB}
                scoreA={itemData.item.scoreA}
                scoreB={itemData.item.scoreB}
                details={itemData.item.details}
                status={itemData.item.status}
                // item={itemData.item}
                betsA={itemData.item.betsA}
                betsB={itemData.item.betsB}
                setIsEventUpdated={setIsEventUpdated}
              />
            );
          }}
          keyExtractor={(item, index) => {
            return item.id + "-" + item.gameName + "-" + index;
          }}
          alwaysBounceVertical={false}
        />
        <Loader
          visible={isLoading}
          top={50}
          bottom={0}
          setModalVisible={setIsLoading}
        />
        <View style={{ minHeight: 70 }} />
      </View>
    </View>
  );
}

export default UpdateSportScreen;

const styles = StyleSheet.create({
  eventsContainer: {
    backgroundColor: "black",
    flex: 5,
    maxHeight: "100%",
  },
});
