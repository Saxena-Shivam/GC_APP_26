import { StyleSheet, Text, View, SafeAreaView, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const EVENTS_SCREEN_CACHE_KEY = "@gc_events_screen_cache_v1";

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
  const [branchCoords, setBranchCoords] = useState({});

  const persistEventsCache = async (payload) => {
    try {
      await AsyncStorage.setItem(
        EVENTS_SCREEN_CACHE_KEY,
        JSON.stringify(payload),
      );
    } catch (error) {
      console.log("Failed to cache events screen data", error);
    }
  };

  const hydrateEventsCache = async () => {
    try {
      const raw = await AsyncStorage.getItem(EVENTS_SCREEN_CACHE_KEY);
      if (!raw) return;

      const cached = JSON.parse(raw);
      if (Array.isArray(cached?.techData)) {
        setTechData(cached.techData);
      }
      if (Array.isArray(cached?.cultData)) {
        setCultData(cached.cultData);
      }
      if (cached?.branchCoords && typeof cached.branchCoords === "object") {
        setBranchCoords(cached.branchCoords);
      }
    } catch (error) {
      console.log("Failed to hydrate events screen cache", error);
    }
  };

  const sortData = (data) => {
    let prevdata = [];
    let nextdata = [];
    data.forEach((item) => {
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

  const toMs = (timestamp) => {
    if (!timestamp) return 0;
    if (timestamp instanceof Date) return timestamp.getTime();
    if (typeof timestamp === "string") return new Date(timestamp).getTime();
    if (typeof timestamp === "number") {
      return timestamp < 10000000000 ? timestamp * 1000 : timestamp;
    }
    if (typeof timestamp === "object") {
      if (typeof timestamp.toDate === "function")
        return timestamp.toDate().getTime();
      if (typeof timestamp._seconds === "number") {
        const nanos =
          typeof timestamp._nanoseconds === "number"
            ? timestamp._nanoseconds
            : 0;
        return timestamp._seconds * 1000 + Math.floor(nanos / 1000000);
      }
      if (typeof timestamp.seconds === "number") {
        const nanos =
          typeof timestamp.nanoseconds === "number" ? timestamp.nanoseconds : 0;
        return timestamp.seconds * 1000 + Math.floor(nanos / 1000000);
      }
    }
    return 0;
  };

  const fetchEventsMetadata = async () => {
    try {
      const [techResponse, cultResponse, branchResponse] = await Promise.all([
        axios.get(backend_link + "api/event/getEventByCategory?category=tech"),
        axios.get(backend_link + "api/event/getEventByCategory?category=cult"),
        axios.get(`${backend_link}api/event/getBranchCoord`),
      ]);

      const techEvents = sortData(
        (techResponse?.data?.events || []).filter(Boolean),
      );
      const cultEvents = sortData(
        (cultResponse?.data?.events || []).filter(Boolean),
      );
      const coords = branchResponse?.data?.branch_coordinators || {};

      setTechData(techEvents);
      setCultData(cultEvents);
      setBranchCoords(coords);

      await persistEventsCache({
        techData: techEvents,
        cultData: cultEvents,
        branchCoords: coords,
      });
    } catch (error) {
      console.log("error fetching events metadata", error);
    }
  };

  const refreshAllData = async () => {
    await Promise.all([fetchAllLiveEvents(), fetchEventsMetadata()]);
  };

  useEffect(() => {
    hydrateEventsCache();
    refreshAllData();
  }, []);

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshAllData();
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
                navigation={navigation}
                branchCoords={branchCoords}
                allEvents={[
                  ...liveEvents.map((e) => ({
                    ...e,
                    eventType: e.eventType || "sports",
                  })),
                  ...upcomingEvents.map((e) => ({
                    ...e,
                    eventType: e.eventType || "sports",
                  })),
                  ...pastEvents.map((e) => ({
                    ...e,
                    eventType: e.eventType || "sports",
                  })),
                  ...techData.map((item) => ({
                    originalData: item,
                    id: item.data.eventId,
                    gameName: item.data.details?.title,
                    teamA: item.data.details?.location || "N/A",
                    details: item.data.details,
                    timeStamp: new Date(item.data.details?.timestamp).getTime(),
                    eventType: "techCult",
                  })),
                  ...cultData.map((item) => ({
                    originalData: item,
                    id: item.data.eventId,
                    gameName: item.data.details?.title,
                    teamA: item.data.details?.location || "N/A",
                    details: item.data.details,
                    timeStamp: new Date(item.data.details?.timestamp).getTime(),
                    eventType: "techCult",
                  })),
                ]}
              />
            ) : screen === 1 ? (
              <AllEventsScreen
                search={search}
                navigation={navigation}
                branchCoords={branchCoords}
                allEvents={[
                  ...upcomingEvents.map((e) => ({
                    ...e,
                    eventType: e.eventType || "sports",
                  })),
                  ...techData
                    .filter(
                      (item) => toMs(item.data.details?.timestamp) > Date.now(),
                    )
                    .map((item) => ({
                      originalData: item,
                      id: item.data.eventId,
                      gameName: item.data.details?.title,
                      teamA: item.data.details?.location || "N/A",
                      details: item.data.details,
                      timeStamp: new Date(
                        item.data.details?.timestamp,
                      ).getTime(),
                      eventType: "techCult",
                    })),
                  ...cultData
                    .filter(
                      (item) => toMs(item.data.details?.timestamp) > Date.now(),
                    )
                    .map((item) => ({
                      originalData: item,
                      id: item.data.eventId,
                      gameName: item.data.details?.title,
                      teamA: item.data.details?.location || "N/A",
                      details: item.data.details,
                      timeStamp: new Date(
                        item.data.details?.timestamp,
                      ).getTime(),
                      eventType: "techCult",
                    })),
                ]}
              />
            ) : (
              <AllEventsScreen
                search={search}
                navigation={navigation}
                branchCoords={branchCoords}
                allEvents={[
                  ...pastEvents.map((e) => ({
                    ...e,
                    eventType: e.eventType || "sports",
                  })),
                  ...techData
                    .filter(
                      (item) => toMs(item.data.details?.timestamp) < Date.now(),
                    )
                    .map((item) => ({
                      originalData: item,
                      id: item.data.eventId,
                      gameName: item.data.details?.title,
                      teamA: item.data.details?.location || "N/A",
                      details: item.data.details,
                      timeStamp: new Date(
                        item.data.details?.timestamp,
                      ).getTime(),
                      eventType: "techCult",
                    })),
                  ...cultData
                    .filter(
                      (item) => toMs(item.data.details?.timestamp) < Date.now(),
                    )
                    .map((item) => ({
                      originalData: item,
                      id: item.data.eventId,
                      gameName: item.data.details?.title,
                      teamA: item.data.details?.location || "N/A",
                      details: item.data.details,
                      timeStamp: new Date(
                        item.data.details?.timestamp,
                      ).getTime(),
                      eventType: "techCult",
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
                navigation={navigation}
                branchCoords={branchCoords}
                allEvents={[
                  ...liveEvents.map((e) => ({ ...e, eventType: "sports" })),
                  ...upcomingEvents.map((e) => ({ ...e, eventType: "sports" })),
                  ...pastEvents.map((e) => ({ ...e, eventType: "sports" })),
                ]}
              />
            ) : screen === 1 ? (
              <AllEventsScreen
                search={search}
                navigation={navigation}
                branchCoords={branchCoords}
                allEvents={upcomingEvents.map((e) => ({
                  ...e,
                  eventType: "sports",
                }))}
              />
            ) : (
              <AllEventsScreen
                search={search}
                navigation={navigation}
                branchCoords={branchCoords}
                allEvents={pastEvents.map((e) => ({
                  ...e,
                  eventType: "sports",
                }))}
              />
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

  return <SafeAreaView style={styles.container}>{content}</SafeAreaView>;
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
    flex: 1,
    paddingBottom: 20,
  },
});
