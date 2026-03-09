import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome5 } from "@expo/vector-icons";
import TeamPointsComponent from "../Components/TeamPointsComponent";
import { LinearGradient } from "expo-linear-gradient";
import logoPaths from "../utils/logoPaths";
import setProperTeamName from "../utils/setProperTeamName";
import teamColors from "../utils/teamColors";
import { backend_link } from "../utils/constants";
import axios from "axios";
import { LoginContext } from "../store/LoginContext";

const formatDate = (datestr) => {
  const date = new Date(datestr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

const sortPointsTable = (data) => {
  const positivepoints = [];
  const negativepoints = [];
  const zeropoints = [];
  data.map((item) => {
    if (item[1] * 1 > 0) positivepoints.push(item);
    else if (item[1] * 1 < 0) negativepoints.push(item);
    else zeropoints.push(item);
  });
  positivepoints.sort((a, b) => b[1] - a[1]);
  negativepoints.sort((a, b) => a[1] - b[1]);

  return [...positivepoints, ...negativepoints, ...zeropoints];
};

export default function TeamPoints({ route }) {
  const loginctx = useContext(LoginContext);
  const [loading, setLoading] = useState(true);
  const [eventPoints, setEventPoints] = useState([]);
  const [branchPointsCache, setBranchPointsCache] = useState({});
  const [lastUpdated, setLastUpdated] = useState("08/03/2025");

  const defaultBranch =
    route.params?.branch ||
    setProperTeamName(loginctx?.detail?.dept || "MSc_ITEP");
  const [selectedBranch, setSelectedBranch] = useState(
    setProperTeamName(defaultBranch),
  );
  const team = setProperTeamName(selectedBranch);

  const branchOptions = [
    "CSE",
    "EE",
    "ECE_META",
    "CIVIL",
    "MECH",
    "MSc_ITEP",
    "MTech",
    "PHD",
  ];

  useEffect(() => {
    setSelectedBranch(setProperTeamName(defaultBranch));
  }, [defaultBranch]);

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

  useEffect(() => {
    const buildPointsArray = (allEventIds, eventData) => {
      const ids = Array.from(
        new Set([...allEventIds, ...Object.keys(eventData)]),
      );
      const pointsArray = ids.map((id) => [
        id,
        Number(eventData?.[id]?.points ?? 0),
      ]);
      return sortPointsTable(pointsArray);
    };

    const prefetchAllBranches = async () => {
      setLoading(true);
      try {
        const allEventsResponse = await axios.get(
          backend_link + "api/event/getAllEvents",
        );
        const allEventIds = (allEventsResponse?.data?.events || [])
          .map((event) => event?.data?.eventId || event?.eventId)
          .filter(Boolean);

        const branchResponses = await Promise.all(
          branchOptions.map(async (branchId) => {
            const response = await axios.get(
              backend_link +
                "api/points/getPointsTableByTeam?teamId=" +
                branchId,
            );
            return [branchId, response?.data?.pointsTable || {}];
          }),
        );

        const cache = {};
        branchResponses.forEach(([branchId, pointsTable]) => {
          cache[branchId] = buildPointsArray(allEventIds, pointsTable);
        });

        setBranchPointsCache(cache);
        setEventPoints(cache[team] || []);
      } catch (err) {
        console.log(err);
        Alert.alert("Error", "Failed to fetch team points");
      } finally {
        setLoading(false);
      }
    };

    prefetchAllBranches();
  }, []);

  useEffect(() => {
    if (branchPointsCache[team]) {
      setEventPoints(branchPointsCache[team]);
    }
  }, [team, branchPointsCache]);

  const totalPoints = () => {
    let sum = eventPoints.reduce((acc, curr) => acc * 1 + curr[1] * 1, 0);
    return sum;
  };

  const renderItem = ({ item }) => {
    const { key, ...rest } = item; // Remove `key`
    return (
      <View style={{ padding: 5 }}>
        <TeamPointsComponent branchData={rest} logoPaths={logoPaths} />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D41D77" />
        </View>
      )}
      {!loading && (
        <>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Team Points</Text>
            <Text style={styles.heroSubtitle}>Branch performance</Text>
          </View>

          <View style={styles.branchPickerWrap}>
            <Text style={styles.branchPickerLabel}>Select Branch</Text>
            <View style={styles.branchPickerBox}>
              <Picker
                selectedValue={team}
                onValueChange={(itemValue) => setSelectedBranch(itemValue)}
                dropdownIconColor="#FFFFFF"
                style={styles.branchPicker}
              >
                {branchOptions.map((branchId) => (
                  <Picker.Item
                    key={branchId}
                    label={branchId}
                    value={branchId}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <LinearGradient
              start={{ x: 0.0, y: 1.0 }}
              end={{ x: 1.0, y: 0.0 }}
              locations={[0.2, 1]}
              colors={[teamColors[team].topColor, teamColors[team].bottomColor]}
              style={styles.summaryGradient}
            >
              <View style={styles.summaryLeft}>
                <Image
                  style={styles.branchLogoImage}
                  source={logoPaths[team]}
                />
              </View>
              <View style={styles.summaryRight}>
                <Text style={styles.branchName}>{team}</Text>
                <Text style={styles.branchTotalPoints}>{totalPoints()}</Text>
                <Text style={styles.branchPointsLabel}>Total Points</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Events</Text>
            <Text style={styles.listMeta}>Updated: {lastUpdated}</Text>
          </View>

          <View style={styles.container2}>
            <FlatList
              data={eventPoints}
              renderItem={({ item }) => {
                const { key, ...rest } = item; // Remove `key`
                return (
                  <View style={styles.listItemWrap}>
                    <TeamPointsComponent
                      branchData={rest}
                      logoPaths={logoPaths}
                    />
                  </View>
                );
              }}
              keyExtractor={(item) => String(item[0])}
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#0F1419",
    color: "white",
    paddingTop: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#D41D77",
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#9AA3AF",
    marginTop: 6,
  },
  branchPickerWrap: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  branchPickerLabel: {
    color: "#9AA3AF",
    fontSize: 12,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  branchPickerBox: {
    borderWidth: 1,
    borderColor: "#2A3038",
    borderRadius: 12,
    backgroundColor: "#1A1F26",
    overflow: "hidden",
  },
  branchPicker: {
    color: "#FFFFFF",
    height: 52,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2A3038",
    backgroundColor: "#1A1F26",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  summaryGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  summaryLeft: {
    paddingRight: 14,
  },
  summaryRight: {
    flex: 1,
  },
  branchLogoImage: {
    height: 72,
    width: 72,
  },
  branchName: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
  },
  branchTotalPoints: {
    color: "#F9FAFB",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 6,
  },
  branchPointsLabel: {
    color: "#E5E7EB",
    fontSize: 12,
    marginTop: 4,
  },
  listHeader: {
    marginTop: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E5E7EB",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  listMeta: {
    fontSize: 12,
    color: "#9AA3AF",
  },
  container2: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  listItemWrap: {
    paddingHorizontal: 4,
    marginBottom: 6,
  },
});
