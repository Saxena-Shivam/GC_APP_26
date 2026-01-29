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
  const renderItem = ({ item }) => {
    // console.log(item);
    return (
      <View style={{ padding: 5, margin: 6, marginBottom: 0 }}>
        <LeaderBoardElement branchData={item} logoPaths={logoPaths} />
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
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
            <Text style={[styles.leadHeading]}>
              {top3[1].Name === "ECE_META" ? "ECE_META_EP" : top3[1].Name}
            </Text>
            <Text style={styles.leadScore}>{top3[1].Score}</Text>
          </View>
        </View>
        <View style={styles.containertop2}>
          <View style={styles.number1top}>
            <View style={styles.iconCont}>
              <FontAwesome5 name="crown" size={24} color="#FFAA00" />
            </View>

            <Image
              source={logoPaths[top3[0].Name.replace(".", "").replace("+", "")]}
              style={{ width: 100, height: 100 }}
            />
          </View>
          <View style={styles.number1bottom}>
            <Text style={[styles.leadHeading]}>
              {top3[0].Name === "ECE_META" ? "ECE_META_EP" : top3[0].Name}
            </Text>
            <Text style={styles.leadScore}>{top3[0].Score}</Text>
          </View>
        </View>
        <View style={styles.containertop3}>
          <View style={styles.number3top}>
            <View style={styles.iconCont}>
              <FontAwesome5 name="crown" size={20} color="#CB7E32" />
            </View>
            <Image
              source={logoPaths[top3[2].Name.replace(".", "").replace("+", "")]}
              style={{ width: 70, height: 70 }}
            />
          </View>
          <View style={styles.number3bottom}>
            <Text style={[styles.leadHeading]}>
              {top3[2].Name === "ECE_META" ? "ECE_META_EP" : top3[2].Name}
            </Text>
            <Text style={styles.leadScore}>{top3[2].Score}</Text>
          </View>
        </View>
      </View>
      <View style={styles.container2}>
        <FlatList
          data={restData}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.Name + "-" + index}
          // style={styles.LeaderBoardList}
        />
      </View>
      <View style={styles.bottomcont}>
        <Text style={styles.text01}>Last Updated on: </Text>
        <Text style={styles.text02}>{lastUpdated}</Text>
      </View>
      <View style={styles.bottomnav}></View>
    </SafeAreaView>
  );
}

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
