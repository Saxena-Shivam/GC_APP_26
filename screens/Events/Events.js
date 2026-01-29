import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  RefreshControl,
  FlatList,
} from "react-native";
import { Icon } from "react-native-elements";
import { useState, useContext, useEffect, useCallback } from "react";
import { EventsContext } from "../../store/EventsContext";
import TopMostCard from "../../Components/TopMostCard";
import OngoingUpcomingButton from "../../Components/OngoingUpcomingButtons";
import OngoingScreen from "./OngoingScreen";
import UpcomingScreen from "./UpcomingScreen";
import AllEventsScreen from "./AllEventsScreen";
import TechEventScreen from "./TechEventScreen";
import CultEventScreen from "./CultEventScreen";
import PastScreen from "./PastScreen";
import axios from "axios";
import { backend_link } from "../../utils/constants";

export default function Events({ route, navigation }) {
  const field = route?.params?.field || "ALL";
  const [screen, setScreen] = useState(0); // 0 = ALL, 1 = UPCOMING, 2 = PAST
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Access EventsContext
  const { fetchAllLiveEvents, liveEvents, upcomingEvents, pastEvents } =
    useContext(EventsContext);

  //
  // Fetch events on mount

  /* const [loading, setLoading] = useState(true);
  const [techEvents, setTechEvents] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false); */
  const [techData, setTechData] = useState([]);
  const [cultData, setCultData] = useState([]);

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
        new Date(a.data.details?.timestamp) -
        new Date(b.data.details?.timestamp) //sort by date ascending
      );
    });
    prevdata.sort((a, b) => {
      return (
        new Date(b.data.details?.timestamp) -
        new Date(a.data.details?.timestamp) //sort by date descending
      );
    });

    return nextdata.concat(prevdata);
  };

  const fetchTechData = async () => {
    try {
      const response = await axios.get(
        backend_link + "api/event/getEventByCategory?category=tech",
      );
      const data = response.data.events;
      let techdata = [];
      data.map((item) => {
        item !== null && techdata.push(item);
      });
      techdata = sortData(techdata);
      /* setTechEvents(techdata);
      setDataLoaded(true);
      setFilteredData(techdata); */
      setTechData(techdata);
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };

  const fetchCultData = async () => {
    try {
      const response = await axios.get(
        backend_link + "api/event/getEventByCategory?category=cult",
      );
      const data = response.data.events;
      let cultdata = [];
      data.map((item) => {
        item !== null && cultdata.push(item);
      });
      cultdata = sortData(cultdata);
      setCultData(cultdata);
      console.log("cult testing", cultData[0].data.pointsTable);
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLiveEvents();
    fetchTechData();
    fetchCultData();
  }, []);

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllLiveEvents();
    await fetchTechData();
    await fetchCultData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (route.params?.reloader === 1) {
      onRefresh();
    }
  }, [route.params?.reloader, onRefresh]);

  // Switch screen
  const setActiveScreen = (screenIndex) => setScreen(screenIndex);

  // Wrap all the content in a fragment to render as a single item
  const content = (
    <>
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="search1" type="antdesign" color="white" size={20} />
          <TextInput
            style={styles.searchInput}
            color="white"
            onChangeText={(text) => setSearch(text)}
            placeholder="Search"
            placeholderTextColor="grey"
          />
        </View>
      </View>

      {/*<TopMostCard />*/}

      {field === "ALL" ? (
        <>
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

          {/* Main Content - Show combined events from Sports, Tech, and Cult */}
          <View style={styles.screenContainer}>
            {screen === 0 ? (
              <AllEventsScreen
                search={search}
                allEvents={[
                  ...liveEvents.map((e) => ({ ...e, category: "Sports" })),
                  ...upcomingEvents.map((e) => ({ ...e, category: "Sports" })),
                  ...pastEvents.map((e) => ({ ...e, category: "Sports" })),
                  ...techData.map((item) => ({
                    id: item.data.eventId,
                    gameName: item.data.details?.title,
                    teamA: item.data.details?.location || "N/A",
                    teamB: "",
                    scoreA: 0,
                    scoreB: 0,
                    details: item.data.details,
                    category: "Tech",
                  })),
                  ...cultData.map((item) => ({
                    id: item.data.eventId,
                    gameName: item.data.details?.title,
                    teamA: item.data.details?.location || "N/A",
                    teamB: "",
                    scoreA: 0,
                    scoreB: 0,
                    details: item.data.details,
                    category: "Cultural",
                  })),
                ]}
              />
            ) : screen === 1 ? (
              <AllEventsScreen
                search={search}
                allEvents={[
                  ...upcomingEvents.map((e) => ({ ...e, category: "Sports" })),
                  ...techData
                    .filter(
                      (item) =>
                        new Date(item.data.details?.timestamp) > new Date(),
                    )
                    .map((item) => ({
                      id: item.data.eventId,
                      gameName: item.data.details?.title,
                      teamA: item.data.details?.location || "N/A",
                      teamB: "",
                      scoreA: 0,
                      scoreB: 0,
                      details: item.data.details,
                      category: "Tech",
                    })),
                  ...cultData
                    .filter(
                      (item) =>
                        new Date(item.data.details?.timestamp) > new Date(),
                    )
                    .map((item) => ({
                      id: item.data.eventId,
                      gameName: item.data.details?.title,
                      teamA: item.data.details?.location || "N/A",
                      teamB: "",
                      scoreA: 0,
                      scoreB: 0,
                      details: item.data.details,
                      category: "Cultural",
                    })),
                ]}
              />
            ) : (
              <AllEventsScreen
                search={search}
                allEvents={[
                  ...pastEvents.map((e) => ({ ...e, category: "Sports" })),
                  ...techData
                    .filter(
                      (item) =>
                        new Date(item.data.details?.timestamp) < new Date(),
                    )
                    .map((item) => ({
                      id: item.data.eventId,
                      gameName: item.data.details?.title,
                      teamA: item.data.details?.location || "N/A",
                      teamB: "",
                      scoreA: 0,
                      scoreB: 0,
                      details: item.data.details,
                      category: "Tech",
                    })),
                  ...cultData
                    .filter(
                      (item) =>
                        new Date(item.data.details?.timestamp) < new Date(),
                    )
                    .map((item) => ({
                      id: item.data.eventId,
                      gameName: item.data.details?.title,
                      teamA: item.data.details?.location || "N/A",
                      teamB: "",
                      scoreA: 0,
                      scoreB: 0,
                      details: item.data.details,
                      category: "Cultural",
                    })),
                ]}
              />
            )}
          </View>
        </>
      ) : field === "Sports" ? (
        <>
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

          {/* Main Content */}
          <View style={styles.screenContainer}>
            {screen === 0 ? (
              <AllEventsScreen
                search={search}
                allEvents={[...liveEvents, ...upcomingEvents, ...pastEvents]}
              />
            ) : screen === 1 ? (
              <UpcomingScreen search={search} navigation={navigation} />
            ) : (
              <PastScreen search={search} />
            )}
          </View>
        </>
      ) : field === "Tech" ? (
        <TechEventScreen
          navigation={navigation}
          search={search}
          techData={techData}
        />
      ) : (
        <CultEventScreen
          navigation={navigation}
          search={search}
          cultData={cultData}
        />
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[1]} // Dummy data to render a single item
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => content}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 10,
    marginTop: 10,
  },
  searchBox: {
    color: "white",
    width: "90%",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
    borderColor: "white",
  },
  searchInput: {
    width: "90%",
    height: 40,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingBottom: 10,
  },
  // Make the screen container taller:
  screenContainer: {
    flex: 1.2, // Increase flex to give more space
    minHeight: 600, // Alternatively, give a fixed minimum height
    paddingBottom: 20, // Extra padding if needed
  },
});
