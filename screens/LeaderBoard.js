import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import LeaderBoardElement from "../Components/LeaderBoardElement";
import logoPaths from "../utils/logoPaths";
import axios from "axios";
import { backend_link } from "../utils/constants";
import setProperTeamName from "../utils/setProperTeamName";
import { initialBranchesData } from "../utils/initialScoreData";

const formatDate = (datestr) => {
  const date = new Date(datestr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

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

// const teamId = ["CSE","EE","ECE_META","CIVIL","MECH","PHD","MTech","MSc_ITEP"];

export default function Leaderboard() {
  const [lastUpdated, setLastUpdated] = useState("08/03/2023");
  const [BranchesData, setBranchesData] = useState(initialBranchesData);
  const [number, setNumber] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(
      () => {
        setNumber((prev) => prev + 1);
        console.log("Number updated");
      },
      1000 * 60 * 2,
    );
    return () => clearInterval(intervalId);
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

  const sortedBranches = [...BranchesData].sort((a, b) => b.Score - a.Score);
  const top3 = sortedBranches.slice(0, 3);
  let restData = sortedBranches.slice(3).map((item, index) => {
    return { ...item, rank: index + 4 };
  });
  const getLogoSource = (name) => {
    if (!name) return null;
    const key = name.replace(".", "").replace("+", "").replace("-", "");
    return logoPaths[key] || null;
  };
  const renderItem = ({ item }) => {
    // console.log(item);
    return (
      <View style={styles.listItemWrap}>
        <LeaderBoardElement branchData={item} logoPaths={logoPaths} />
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubtitle}>Overall standings and scores</Text>
      </View>

      <View style={styles.podiumWrap}>
        <View style={[styles.podiumCard, styles.podiumSilver]}>
          <View style={styles.crownWrap}>
            <FontAwesome5 name="crown" size={18} color="#B6B6B6" />
          </View>
          {getLogoSource(top3[1]?.Name) ? (
            <Image
              source={getLogoSource(top3[1]?.Name)}
              style={styles.podiumLogo}
            />
          ) : null}
          <Text style={styles.podiumName}>
            {top3[1]?.Name === "ECE_META" ? "ECE_META_EP" : top3[1]?.Name}
          </Text>
          <Text style={styles.podiumScore}>{top3[1]?.Score}</Text>
        </View>

        <View style={[styles.podiumCard, styles.podiumGold]}>
          <View style={styles.crownWrap}>
            <FontAwesome5 name="crown" size={20} color="#FFB020" />
          </View>
          {getLogoSource(top3[0]?.Name) ? (
            <Image
              source={getLogoSource(top3[0]?.Name)}
              style={styles.podiumLogoLarge}
            />
          ) : null}
          <Text style={styles.podiumName}>
            {top3[0]?.Name === "ECE_META" ? "ECE_META_EP" : top3[0]?.Name}
          </Text>
          <Text style={styles.podiumScore}>{top3[0]?.Score}</Text>
        </View>

        <View style={[styles.podiumCard, styles.podiumBronze]}>
          <View style={styles.crownWrap}>
            <FontAwesome5 name="crown" size={16} color="#C07B3A" />
          </View>
          {getLogoSource(top3[2]?.Name) ? (
            <Image
              source={getLogoSource(top3[2]?.Name)}
              style={styles.podiumLogoSmall}
            />
          ) : null}
          <Text style={styles.podiumName}>
            {top3[2]?.Name === "ECE_META" ? "ECE_META_EP" : top3[2]?.Name}
          </Text>
          <Text style={styles.podiumScore}>{top3[2]?.Score}</Text>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>All Teams</Text>
        <Text style={styles.listMeta}>Updated: {lastUpdated}</Text>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={restData}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.Name + "-" + index}
          showsVerticalScrollIndicator={false}
          scrollEnabled
          nestedScrollEnabled
          contentContainerStyle={styles.listContentContainer}
          ListFooterComponent={<View style={{ height: 90 }} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1419",
    paddingTop: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#D41D77",
    letterSpacing: 0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#9AA3AF",
    marginTop: 6,
  },
  podiumWrap: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  podiumCard: {
    flex: 1,
    backgroundColor: "#1A1F26",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A3038",
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  podiumGold: {
    transform: [{ translateY: -6 }],
    borderColor: "#3A2A12",
  },
  podiumSilver: {
    transform: [{ translateY: 6 }],
  },
  podiumBronze: {
    transform: [{ translateY: 10 }],
  },
  crownWrap: {
    marginBottom: 6,
  },
  podiumLogoLarge: {
    width: 92,
    height: 92,
  },
  podiumLogo: {
    width: 76,
    height: 76,
  },
  podiumLogoSmall: {
    width: 64,
    height: 64,
  },
  podiumName: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#F9FAFB",
  },
  podiumScore: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  listHeader: {
    marginTop: 10,
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
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  listContentContainer: {
    paddingBottom: 12,
  },
  listItemWrap: {
    paddingHorizontal: 4,
    marginBottom: 6,
  },
});
