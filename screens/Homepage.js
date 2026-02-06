import { LoginContext } from "../store/LoginContext.js";
import { EventsContext } from "../store/EventsContext.js";
import { useState, useEffect, useContext, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import OngoingEventCard from "../Components/OngoingEventCard";
import TechCultEventCard from "../Components/TechCultEventCard";
import axios from "axios";
import { backend_link } from "../utils/constants";
import { ActivityIndicator } from "react-native-paper";
import { EventSubscriptionVendor } from "react-native";
import { getCorrectTimeStamp } from "../utils/helperFunctions";
import { indigo, red } from "@mui/material/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import logoPaths from "../utils/logoPaths";
import { initialBranchesData } from "../utils/initialScoreData";

import setProperTeamName from "../utils/setProperTeamName";

var { width, height } = Dimensions.get("window");

const banners = {
  CSE: require("../assets/TeamBanners/CSE.png"),
  ECE_META: require("../assets/TeamBanners/ECE.png"),
  EE: require("../assets/TeamBanners/EE.png"),
  CE: require("../assets/TeamBanners/Civil.png"),
  ME: require("../assets/TeamBanners/Mech.png"),
  MTech: require("../assets/TeamBanners/Mtech.png"),
  PhD: require("../assets/TeamBanners/PhD.png"),
  MSc_ITEP: require("../assets/TeamBanners/MSc_ITEP.png"),
};

// {
//    Team a - mtech
//     Team b - ece meta
//     Team c - cse
//     Team d - civil
//     Team e - ee
//     Team f - phd
//     Team g - mech
//     Team h - msc + itep
// }

function TeamCard({ navigation, branchCoords }) {
  const [loading, setLoading] = useState(true);
  const { liveEvents, upcomingEvents, isLoading } = useContext(EventsContext);
  const [allEvents, setAllEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [techData, setTechData] = useState([]);
  const [cultData, setCultData] = useState([]);

  // Fetch tech events
  const fetchTechData = async () => {
    try {
      const response = await axios.get(
        backend_link + "api/event/getEventByCategory?category=tech",
      );
      const data = response.data.events || [];
      const techdata = data.filter((item) => item !== null);
      setTechData(techdata);
    } catch (error) {
      console.log("Error fetching tech events:", error);
    }
  };

  // Fetch cult events
  const fetchCultData = async () => {
    try {
      const response = await axios.get(
        backend_link + "api/event/getEventByCategory?category=cult",
      );
      const data = response.data.events || [];
      const cultdata = data.filter((item) => item !== null);
      setCultData(cultdata);
    } catch (error) {
      console.log("Error fetching cult events:", error);
    }
  };

  useEffect(() => {
    fetchTechData();
    fetchCultData();
  }, []);

  useEffect(() => {
    // Combine sports events with tech/cult events
    const now = Date.now();

    console.log("=== HOMEPAGE FILTERING DEBUG ===");
    console.log("Current time:", now, new Date(now).toISOString());

    // Filter sports events - double-check they're actually ongoing/upcoming
    console.log("\n--- SPORTS EVENTS FROM EVENTSCONTEXT ---");
    console.log("Raw liveEvents count:", (liveEvents || []).length);
    console.log("Raw upcomingEvents count:", (upcomingEvents || []).length);

    const filteredSportsEvents = [
      ...(liveEvents || []),
      ...(upcomingEvents || []),
    ].filter((item) => {
      const startTime = item.details?.timestamp || item.timeStamp || 0;
      const endTime =
        item.details?.endTimeStamp ||
        item.endTimeStamp ||
        startTime + 2 * 60 * 60 * 1000;
      const startMs = new Date(startTime).getTime();
      const endMs = new Date(endTime).getTime();

      const isActuallyPast = endMs < now;

      if (isActuallyPast) {
        console.log(
          `❌ SPORTS: Filtering out past event - ${item.gameName || item.id}`,
        );
        console.log(`   End: ${new Date(endMs).toISOString()}`);
        return false;
      }

      console.log(`✅ SPORTS: Including ${item.gameName || item.id}`);
      return true;
    });

    const sportsEvents = filteredSportsEvents;

    console.log("\n=== TECH/CULT FILTERING ===");

    // Process tech/cult events - filter for ongoing and upcoming only (NO PAST)
    const techCultEvents = [...techData, ...cultData]
      .filter((item) => {
        const timestamp = new Date(item.data?.details?.timestamp).getTime();

        // Check if there's an actual endTimeStamp in the data
        const actualEndTimestamp = item.data?.details?.endTimeStamp;
        const endTimestamp = actualEndTimestamp
          ? new Date(actualEndTimestamp).getTime()
          : timestamp + 2 * 60 * 60 * 1000; // Default 2 hour duration

        // Check backend status if available
        const status = (
          item.data?.status ||
          item.data?.details?.status ||
          ""
        ).toLowerCase();

        console.log(`\nEvent: ${item.data?.details?.title}`);
        console.log(`  Status: ${status || "none"}`);
        console.log(`  Start: ${new Date(timestamp).toISOString()}`);
        console.log(`  End: ${new Date(endTimestamp).toISOString()}`);
        console.log(`  Has actual endTimeStamp: ${!!actualEndTimestamp}`);

        // Priority 1: Check backend status
        if (status === "past" || status === "completed") {
          console.log(`  ❌ FILTERED OUT: Status is ${status}`);
          return false;
        }
        if (status === "live" || status === "ongoing") {
          console.log(`  ✅ INCLUDED: Status is ${status}`);
          return true;
        }
        if (status === "upcoming" || status === "scheduled") {
          console.log(`  ✅ INCLUDED: Status is ${status}`);
          return true;
        }

        // Priority 2: Timestamp-based filtering
        // Show only if event is ongoing (started but not ended) OR upcoming (hasn't started)
        const isOngoing = timestamp <= now && endTimestamp >= now;
        const isUpcoming = timestamp > now;
        const isPast = endTimestamp < now;

        console.log(
          `  isOngoing: ${isOngoing}, isUpcoming: ${isUpcoming}, isPast: ${isPast}`,
        );

        if (isPast) {
          console.log(`  ❌ FILTERED OUT: Event has ended`);
          return false;
        }

        if (isOngoing || isUpcoming) {
          console.log(
            `  ✅ INCLUDED: Event is ${isOngoing ? "ongoing" : "upcoming"}`,
          );
          return true;
        }

        console.log(`  ❌ FILTERED OUT: Doesn't match any criteria`);
        return false;
      })
      .map((item) => ({
        originalData: item,
        id: item.data?.eventId || item.id,
        gameName: item.data?.details?.title,
        teamA: item.data?.details?.title || "Event",
        teamB: item.data?.details?.location || "TBA",
        details: item.data?.details,
        timeStamp: new Date(item.data?.details?.timestamp).getTime(),
        eventType: "techCult",
      }));

    const combined = [...sportsEvents, ...techCultEvents];

    console.log(`\n=== FINAL HOMEPAGE EVENTS ===`);
    console.log(`Sports events (after filtering): ${sportsEvents.length}`);
    console.log(`Tech/Cult events (after filtering): ${techCultEvents.length}`);
    console.log(`Total events to display: ${combined.length}`);

    // List all final events with timestamps
    console.log("\nFinal events list:");
    combined.forEach((event, idx) => {
      const ts = event.details?.timestamp || event.timeStamp;
      console.log(
        `${idx + 1}. ${event.gameName || event.teamA} - ${new Date(ts).toISOString()}`,
      );
    });

    setAllEvents(combined);

    if (!isLoading) {
      setLoading(false);
    }
  }, [liveEvents, upcomingEvents, techData, cultData, isLoading]);

  useEffect(() => {
    if (allEvents.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % allEvents.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
          viewPosition: 0.5,
        });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [allEvents.length]);

  if (loading || allEvents.length === 0) {
    return (
      <View style={styles_1.container}>
        <StatusBar style="light" />
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#000",
            }}
          >
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#000",
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>
              No ongoing or upcoming matches
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles_1.container}>
      <StatusBar style="light" />
      <View style={styles_1.content}>
        <View style={styles_1.teamsSection}>
          {/* <Text style={styles_1.teamsTitle}>ONGOING & UPCOMING MATCHES</Text> */}
          <FlatList
            ref={flatListRef}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            data={allEvents}
            renderItem={({ item }) => (
              <View
                style={{
                  width: width * 0.85,
                  marginRight: 15,
                  height: 340,
                  marginLeft: 15,
                }}
              >
                {item.eventType === "techCult" && item.originalData ? (
                  <TechCultEventCard
                    data={{ item: item.originalData }}
                    navigation={navigation}
                    branchCoords={branchCoords}
                    compact
                  />
                ) : (
                  <OngoingEventCard
                    details={item.details}
                    gameName={item.gameName}
                    id={item.id}
                    teamA={item.teamA}
                    teamB={item.teamB}
                    scoreA={item.scoreA || 0}
                    scoreB={item.scoreB || 0}
                  />
                )}
              </View>
            )}
            keyExtractor={(item, index) =>
              `${item.id}-${item.gameName}-${index}`
            }
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={width * 0.85 + 15}
          />
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: 50,
        }}
      />
    </SafeAreaView>
  );
}

// #######################################################################################################################################

const formatDate = (datestr) => {
  if (!datestr) return "Unknown Date"; // Handle invalid date cases
  const date = new Date(datestr);
  if (isNaN(date.getTime())) return "Unknown Date"; // Ensure it's a valid date
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
};

// const fetchLeaderboardData = async (setLeaderboardData) => {
//   try {
//     // const response = await axios.get(`${backend_link}/api/points/getIndividualScores`);

//     const response = { data };

//     if (response.data && Array.isArray(response.data)) {
//       const sortedData = response.data
//         .sort((a, b) => (b.points || 0) - (a.points || 0)) // Ensure points exist
//         .slice(0, 10);
//       setLeaderboardData(sortedData);
//     } else {
//       console.error("Invalid data format from API");
//       setLeaderboardData([]); // Ensure state is updated even in failure cases
//     }
//   } catch (error) {
//     console.error("Error fetching leaderboard data:", error);
//     setLeaderboardData([]); // Avoid leaving state empty
//   }
// };

// const fetchLastUpdated = async () => {
//   try {
//     const response = await axios.get(`${backend_link}/api/event/lastUpdated`);
//     if (response.data && response.data.lastUpdated) {
//       setLastUpdated(formatDate(response.data.lastUpdated));
//     }
//   } catch (error) {
//     console.error("Error fetching last updated date:", error);
//     setLastUpdated("Unknown Date");
//   }
// };

const fetchDataAndUpdateScore = async (teamName, setBranchesData) => {
  try {
    const response = await axios.get(
      backend_link + "api/points/getTotalPointsByTeam",
      {
        params: { teamId: setProperTeamName(teamName) },
      },
    );
    console.log("data", response.data);
    const points = response.data.points * 1;

    setBranchesData((prevState) => {
      return prevState.map((branch) => {
        if (setProperTeamName(branch.Name) === setProperTeamName(teamName)) {
          return { ...branch, Score: points };
        }
        return branch;
      });
    });

    console.log("BranchesData updated with new score:", teamName, points);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default function HomePage({ navigation }) {
  const [lastUpdated, setLastUpdated] = useState("Unknown Date");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const LoginCtx = useContext(LoginContext);
  const userEmail = LoginCtx?.user?.email;
  const [user, setUser] = useState({});
  const [BranchesData, setBranchesData] = useState(initialBranchesData);
  const [number, setNumber] = useState(0);
  const [branchCoords, setBranchCoords] = useState({});

  const onCLickHandler = () => {
    navigation.navigate("  ");
  };

  const fetchLeaderboardData = async () => {
    try {
      const response = await axios.get(backend_link + "api/user/getAllDetails");
      // co
      console.log(response.data);
      // setUser()
      // console.log(data);

      // console.log(userData);
      const { userArray } = response.data;
      console.log("a;sfjads;lfj", response.data);
      const result = userArray.find((obj) => obj.mail === userEmail);
      setUser(result);
      // console.log("jeeeban test: ", userArray[userEmail], userEmail);
      initializeCoins(userArray);
      const data = userArray;
      console.log("leaderboard dat: ", data);
      const sortedData = data.sort((a, b) => b.coins - a.coins).slice(0, 10);
      console.log("sorted testing: ", sortedData);
      setLeaderboardData(sortedData);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  const initializeCoins = (data) => {
    data.forEach((id, ind) => {
      if (id.coins === undefined) {
        id.coins = 0;
      }
    });
  };

  const fetchBranchCoords = async () => {
    try {
      const response = await axios.get(
        `${backend_link}api/event/getBranchCoord`,
      );
      setBranchCoords(response.data.branch_coordinators);
    } catch (error) {
      console.log("error fetching branch coords", error);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
    fetchBranchCoords();
  }, []);

  // async function updateCoinsForWinners() {
  //   try {
  //     const response = await axios.get(
  //       `${backend_link}api/points/fetch-game-data`
  //     );
  //     // console.log("hellasd;fkja;sdfj;sdaf");
  //     const { events, users } = response.data;
  //     const userData = users.details;
  //     const userIds = Object.keys(userData);

  //     const eventData = events[0];
  //     const eventNames = Object.keys(eventData).slice(1);

  //     const yesterdayStart = new Date();
  //     // console.log("test data: ", yesterdayStart);

  //     const ts = new Date(); // Get current date and time
  //     const yts = new Date(ts.getTime() - 24 * 60 * 60 * 1000); // 24 hours before current time
  //     setLeaderboardData(userData);

  //     eventNames.forEach((eventName) => {
  //       const eventId = Object.keys(events[0][eventName])[0];

  //       if (
  //         !eventData[eventName][eventId].data ||
  //         !eventData[eventName][eventId].data.details ||
  //         !eventData[eventName][eventId].data.points
  //       ) {
  //         console.log(
  //           "Skipping event due to missing data:",
  //           eventData[eventName][eventId]
  //         );
  //         return;
  //       }

  //       const endTime = eventData[eventName][eventId].data.details.endTimeStamp;
  //       // console.log(ts - 2 * 60 * 60 * 1000);
  //       const endDate = new Date(endTime); // Convert endTime (timestamp) to Date

  //       if (endDate < yts || endDate > ts) {
  //         console.log("endTime:", endDate.toISOString());
  //         console.log("yts (24 hours ago):", yts.toISOString());
  //         console.log("ts (current time):", ts.toISOString());
  //         console.log("out of bounds");
  //         return;
  //       }

  //       // console.log("Within bounds");

  //       const { teamA, teamB } = eventData[eventName][eventId].data.points;
  //       if (!teamA || !teamB || !teamA.bets || !teamB.bets) {
  //         console.log("Skipping event due to missing team data:", eventData);
  //         return;
  //       }

  //       const updateCoins = (userEmail, amount) => {
  //         if (!userData[userEmail]) {
  //           console.log(`User not found in userData: ${userEmail}`);
  //           return;
  //         }
  //         if (!userData[userEmail].coins) {
  //           userData[userEmail].coins = 0;
  //         }
  //         if (userData[userEmail].coins === 0) {
  //           userData[userEmail].coins = 10000;
  //         }
  //         console.log(
  //           `Updating ${userEmail}: ${userData[userEmail].coins} + ${amount}`
  //         );
  //         userData[userEmail].coins += amount;
  //       };

  //       let winningTeam, losingTeam;
  //       if (teamA.points > teamB.points) {
  //         winningTeam = teamA.bets;
  //         losingTeam = teamB.bets;
  //       } else if (teamB.points > teamA.points) {
  //         winningTeam = teamB.bets;
  //         losingTeam = teamA.bets;
  //       } else {
  //         console.log("Match is a tie, adding 10 points to all participants");
  //         [...Object.keys(teamA.bets), ...Object.keys(teamB.bets)].forEach(
  //           (user) => {
  //             updateCoins(user, 10);
  //           }
  //         );
  //         return;
  //       }
  //       winningTeam.forEach((email, ind) => {
  //         updateCoins(email, 10);
  //       });
  //       losingTeam.forEach((email, ind) => {
  //         updateCoins(email, -10);
  //       });

  //       console.log("final user data: ");
  //       winningTeam.forEach((email, ind) => {
  //         console.log(userData[email]);
  //       });
  //       losingTeam.forEach((email, ind) => {
  //         console.log(userData[email]);
  //       });

  //       let userArray = [];
  //       userIds.forEach((id, ind) => {
  //         userArray.push(userData[id]);
  //       });

  //       initializeCoins(userArray);
  //       fetchLeaderboardData(userArray);
  //       setUser(users.details[userEmail]);
  //       console.log("user is set to : ", userEmail, user);

  //       //updateDoc

  //     });
  //   } catch (error) {
  //     console.error("Error updating coins:", error);
  //   }
  // }

  // useEffect(() => {
  //   console.log("useEffect triggered: calling updateCoinsForWinners()");
  //   // updateCoinsForWinners();
  // }, []);

  useEffect(() => {
    setInterval(
      () => {
        setNumber(number + 1);
        console.log("Number updated");
      },
      1000 * 60 * 2,
    );
  }, []);
  useEffect(() => {
    fetchDataAndUpdateScore("MTech", setBranchesData);
    fetchDataAndUpdateScore("ECE_META", setBranchesData);
    fetchDataAndUpdateScore("CSE", setBranchesData);
    fetchDataAndUpdateScore("EE", setBranchesData);
    fetchDataAndUpdateScore("CIVIL", setBranchesData);
    fetchDataAndUpdateScore("PHD", setBranchesData);
    fetchDataAndUpdateScore("MECH", setBranchesData);
    fetchDataAndUpdateScore("MSc_ITEP", setBranchesData);
  }, [number]);

  useEffect(() => {
    const fetchlastUpdated = async () => {
      try {
        const response = await axios.get(
          backend_link + "api/event/lastUpdated",
        );
        const lastUpdated = response.data.lastUpdated;
        const date = formatDate(lastUpdated);
        setLastUpdated(date);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchlastUpdated();
  }, []);

  BranchesData.sort((a, b) => b.Score - a.Score);
  const top3 = BranchesData.slice(0, 3);
  let restData = BranchesData.slice(3).map((item, index) => {
    return { ...item, rank: index + 4 };
  });

  return (
    <SafeAreaView style={leaderboardStyles.container}>
      <View style={{ height: 150, width: "auto", marginBottom: 10 }}>
        <TeamCard navigation={navigation} branchCoords={branchCoords} />
      </View>
      {/* <Text
        style={{
          fontWeight: "bold",
          fontSize: 36,
          color: "white",
          marginTop: 20,
        }}
      >
        LEADERBOARD
      </Text> */}
      {/*
                <View style={leaderboardStyles.item}>
        <Text style={leaderboardStyles.name}>{user?.name || "Unknown"}</Text>
        <Text style={leaderboardStyles.points}>{user?.coins}</Text>
      </View>
                */}
      <Pressable onPress={() => onCLickHandler()} style={styles.container}>
        <View style={styles.containertop}>
          <View style={styles.containertop1}>
            <View style={styles.number2top}>
              <View style={styles.iconCont}>
                <FontAwesome5 name="crown" size={22} color="#ADABA1" />
              </View>
              <Image
                source={
                  logoPaths[
                    top3[1].Name.replace(".", "")
                      .replace("+", "")
                      .replace("-", "")
                  ]
                }
                style={{ width: 90, height: 90 }}
              />
            </View>
            <View style={styles.number2bottom}>
              <Text style={[styles.leadHeading]}>{top3[1].Name}</Text>
              <Text style={styles.leadScore}>{top3[1].Score}</Text>
            </View>
          </View>
          <View style={styles.containertop2}>
            <View style={styles.number1top}>
              <View style={styles.iconCont}>
                <FontAwesome5 name="crown" size={24} color="#FFAA00" />
              </View>

              <Image
                source={
                  logoPaths[top3[0].Name.replace(".", "").replace("+", "")]
                }
                style={{ width: 100, height: 100 }}
              />
            </View>
            <View style={styles.number1bottom}>
              <Text style={[styles.leadHeading]}>{top3[0].Name}</Text>
              <Text style={styles.leadScore}>{top3[0].Score}</Text>
            </View>
          </View>
          <View style={styles.containertop3}>
            <View style={styles.number3top}>
              <View style={styles.iconCont}>
                <FontAwesome5 name="crown" size={20} color="#CB7E32" />
              </View>
              <Image
                source={
                  logoPaths[top3[2].Name.replace(".", "").replace("+", "")]
                }
                style={{ width: 70, height: 70 }}
              />
            </View>
            <View style={styles.number3bottom}>
              <Text style={[styles.leadHeading]}>{top3[2].Name}</Text>
              <Text style={styles.leadScore}>{top3[2].Score}</Text>
            </View>
          </View>
        </View>
      </Pressable>
      {/* <Text style={leaderboardStyles.heading}>Top 10 Individuals</Text> */}
      {/* <FlatList
        data={leaderboardData}
        keyExtractor={(item, index) => index.toString()} // Ensure unique keys
        renderItem={({ item, index }) => (
          <View style={leaderboardStyles.item}>
            <Text style={leaderboardStyles.rank}>{index + 1}.</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={leaderboardStyles.name}>{item.name || "Unknown"}</Text>
            </ScrollView>
            <Text style={leaderboardStyles.points}>{item.coins}</Text>
          </View>
        )}
        style={leaderboardStyles.list}
      /> */}
      <View style={leaderboardStyles.bottomcont}>
        <Text style={leaderboardStyles.text01}>Last Updated on: </Text>
        <Text style={leaderboardStyles.text02}>{lastUpdated}</Text>
      </View>
    </SafeAreaView>
  );
}

const leaderboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  list: {
    width: "100%",
    marginRight: -10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    padding: 15,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#222",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    width: "90%",
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gold",
  },
  name: {
    fontSize: 18,
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  points: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D41D77",
  },
  bottomcont: {
    flexDirection: "row",
    marginTop: 20,
  },
  text01: {
    color: "#D41D77",
  },
  text02: {
    color: "white",
    fontWeight: "bold",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  containertop: {
    flex: 1.5,
    backgroundColor: "#000000",
    color: "white",
    flexDirection: "row",
  },
  containertop1: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  containertop2: {
    flex: 1.25,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  containertop3: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  number1top: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
  },
  number1bottom: {
    flex: 0.75,
    backgroundColor: "#746030",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: "100%",

    justifyContent: "center",
    alignItems: "center",
  },
  number2top: {
    flex: 1.5,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
  },
  number2bottom: {
    flex: 0.75,
    backgroundColor: "#52514F",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  number3top: {
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
  },
  number3bottom: {
    flex: 0.75,
    backgroundColor: "#795038",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCont: {
    padding: 0,
  },
  container2: {
    flex: 2,
    width: "100%",
    backgroundColor: "#000",
    color: "white",
    flexDirection: "row",
    paddingTop: 10,
  },
  leadHeading: {
    fontSize: 15,
    color: "white",

    fontWeight: "bold",
  },
  leadScore: {
    fontSize: 20,
    color: "white",

    fontWeight: "bold",
  },

  text: {
    color: "white",
  },
  LeaderBoardList: {
    flex: 1,
    backgroundColor: "#000000",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  bottomcont: {
    flex: 0.3,
    flexDirection: "row",
    backgroundColor: "#000000",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    bottomMargin: 0,
  },
  text01: {
    color: "#D41D77",
    alignItems: "center",

    paddingBottom: 0,
  },
  text02: {
    color: "white",
    fontWeight: "bold",
    alignContent: "center",

    paddingBottom: 0,
  },
  bottomnav: {
    flex: 0.4,
    backgroundColor: "#000000",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
});
// ############################################################################################################################################################################################################
const styles_1 = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    marginLeft: -10,
    marginRight: -10,
    backgroundColor: "#000",
  },
  header: {
    width: "90%",
    height: 50,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingleft: 2,
    paddingTop: 10,
    margin: 20,
  },
  content: {
    flex: 1,
    // paddingTop: 20,
  },
  bannerContainer: {
    height: 200,
    backgroundColor: "#e0e0e0", // Placeholder color
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  newsSection: {
    width: "90%",
    height: 220,
    marginTop: 30,
    paddingHorizontal: 5,
    justifyContent: "center",
    padding: 5,
  },
  newsSection1: {
    width: "90%",
    height: 180,
    marginTop: 10,
    paddingHorizontal: 5,
    justifyContent: "center",
    padding: 5,
  },
  newsTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    color: "white",
    paddingLeft: 5,
  },
  teamsSection: {
    width: "100%",
    height: 350,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  teamsTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    color: "white",
    padding: 5,
  },
  socialMediaSection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  newsImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
  },
  rank: {
    width: 40, // Fixed width for ranking
    textAlign: "center",
  },
  name: {
    minWidth: 100, // Ensures some space for scrolling
    maxWidth: 200, // Limits how far it stretches
  },
  points: {
    width: 80, // Fixed width for points
    textAlign: "right",
  },
  teamBanner: {
    width: "100%",
    height: "100%",
    borderRadius: 15, // Adjust for more or less rounding
    overflow: "hidden",
  },
});
