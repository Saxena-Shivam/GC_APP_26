import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import TechCultEventCard from "../../Components/TechCultEventCard";
import OngoingUpcomingButton from "../../Components/OngoingUpcomingButtons";
import { backend_link } from "../../utils/constants";
import Loader from "../../Components/Loader";
import axios from "axios";

import { Text } from "react-native";

const sortData = (data) => {
  console.log("data", data);

  let prevdata = [];
  let nextdata = [];
  data.map((item) => {
    if (
      new Date(item.data.details?.timestamp) >
      new Date() - 24 * 60 * 60 * 1000
    ) {
      nextdata.push(item);
    } else {
      prevdata.push(item);
    }
  });
  nextdata.sort((a, b) => {
    return (
      new Date(a.data.details?.timestamp) - new Date(b.data.details?.timestamp) //sort by date ascending
    );
  });
  prevdata.sort((a, b) => {
    return (
      new Date(b.data.details?.timestamp) - new Date(a.data.details?.timestamp) //sort by date descending
    );
  });

  return nextdata.concat(prevdata);
};

const TechEventScreen = ({ navigation, search, reloader, techData }) => {
  const [filteredData, setFilteredData] = useState(techData);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [branchCoords, setBranchCoords] = useState({});
  const [screen, setScreen] = useState(0); // 0 = ALL, 1 = UPCOMING, 2 = PAST
  const setActiveScreen = (screenIndex) => setScreen(screenIndex);

  useEffect(() => {
    console.log(search);
    if (search.length === 0 || !search) {
      setFilteredData(techData);
      return;
    }
    const data = techData.filter((item) => {
      let title = item?.data?.details?.title.toLowerCase();
      let event = item?.data?.eventId.toLowerCase();
      const location = item?.data?.details?.location.toLowerCase();
      return (
        title?.includes(search.toLowerCase()) ||
        event?.includes(search.toLowerCase()) ||
        location?.includes(search.toLowerCase())
      );
    });
    setFilteredData(data);
  }, [search, techData]);

  const fetchBranchCoords = async () => {
    try {
      console.log(`${backend_link}api/event/getBranchCoord`);
      const response = await axios.get(
        `${backend_link}api/event/getBranchCoord`,
      );
      setBranchCoords(response.data.branch_coordinators);
    } catch (error) {
      console.log("error fetching in fetching branch coords", error);
    }
  };

  useEffect(() => {
    fetchBranchCoords();
  }, []);

  // Filter data based on screen selection
  let displayData = filteredData;
  if (screen === 1) {
    // UPCOMING: events that haven't started yet
    displayData = filteredData.filter(
      (item) => new Date(item.data.details?.timestamp) > new Date(),
    );
  } else if (screen === 2) {
    // PAST: events that have ended
    displayData = filteredData.filter(
      (item) => new Date(item.data.details?.timestamp) < new Date(),
    );
  }
  // screen === 0: ALL (no filter applied, use filteredData as is)

  console.log("tech", techData);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <OngoingUpcomingButton
          onPress={() => setActiveScreen(0)}
          currentScreen={screen}
          currentButton={0}
        >
          ALL
        </OngoingUpcomingButton>

        <OngoingUpcomingButton
          onPress={() => setActiveScreen(1)}
          currentScreen={screen}
          currentButton={1}
        >
          UPCOMING
        </OngoingUpcomingButton>

        <OngoingUpcomingButton
          onPress={() => setActiveScreen(2)}
          currentScreen={screen}
          currentButton={2}
        >
          PAST
        </OngoingUpcomingButton>
      </View>

      <View style={styles.eventsContainer}>
        <FlatList
          data={displayData}
          renderItem={(itemData) => (
            <TechCultEventCard
              data={itemData}
              navigation={navigation}
              branchCoords={branchCoords}
            />
          )}
          keyExtractor={(item, index) =>
            item.data.details.title + "-" + item.data.eventId + "-" + index
          }
          alwaysBounceVertical={false}
        />
      </View>
    </View>
  );
};

export default TechEventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingBottom: 10,
  },
  eventsContainer: {
    flex: 5,
    maxHeight: "70%",
  },
  votingNote: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#ffffff",
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
});
