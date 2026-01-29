// import { useState, useEffect, useContext } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   FlatList,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { FontAwesome5 } from "@expo/vector-icons";
// import TeamPointsComponent from "../Components/TeamPointsComponent";
// import { LinearGradient } from "expo-linear-gradient";
// import logoPaths from "../utils/logoPaths";
// import setProperTeamName from "../utils/setProperTeamName";
// import teamColors from "../utils/teamColors";
// import { backend_link } from "../utils/constants";
// import axios from "axios";
// import { LoginContext } from "../store/LoginContext";
//
// const formatDate = (datestr) => {
//   const date = new Date(datestr);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   const formattedDate = `${day}/${month}/${year}`;
//   return formattedDate;
// };
//
// const sortPointsTable = (data) => {
//   const positivepoints = [];
//   const negativepoints = [];
//   const zeropoints = [];
//   data.map((item) => {
//     if (item[1] * 1 > 0) positivepoints.push(item);
//     else if (item[1] * 1 < 0) negativepoints.push(item);
//     else zeropoints.push(item);
//   });
//   positivepoints.sort((a, b) => b[1] - a[1]);
//   negativepoints.sort((a, b) => a[1] - b[1]);
//
//   return [...positivepoints, ...negativepoints, ...zeropoints];
// };
//
// export default function TeamPoints({ route }) {
//   const loginctx = useContext(LoginContext);
//   const [loading, setLoading] = useState(true);
//   const [eventPoints, setEventPoints] = useState([]);
//   const [Ids, setIds] = useState([]);
//   const [data, setdata] = useState([]);
//   const [lastUpdated, setLastUpdated] = useState("08/03/2023");
//
//   const branch =
//     route.params?.branch ||
//     setProperTeamName(loginctx?.detail?.dept || "MSc_ITEP");
//   const team = setProperTeamName(branch);
//
//   useEffect(() => {
//     const fetchlastUpdated = async () => {
//       try {
//         const response = await axios.get(
//           backend_link + "api/event/lastUpdated"
//         );
//         const lastUpdated = response.data.lastUpdated;
//         const date = formatDate(lastUpdated);
//         setLastUpdated(date);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchlastUpdated();
//   }, []);
//
//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//     }, 1000);
//   }, [branch]);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           backend_link + "api/points/getPointsTableByTeam?teamId=" + team
//         );
//
//         console.log("respomnse", response.data);
//
//         const eventData = response.data.pointsTable;
//         const ids = Object.keys(response.data.pointsTable);
//         setIds(ids);
//         const pointsArray = ids.map((id) => [id, eventData[id].points]);
//         const newPointsArray = sortPointsTable(pointsArray);
//         // pointsArray.sort((a, b) => b[1] - a[1]); // sorting the array in descending order
//         setEventPoints(newPointsArray);
//         return pointsArray;
//       } catch (err) {
//         console.log(err);
//         Alert.alert("Error", err);
//       }
//     };
//     fetchData();
//   }, [branch]);
//
//   const totalPoints = () => {
//     let sum = eventPoints.reduce((acc, curr) => acc * 1 + curr[1] * 1, 0);
//     return sum;
//   };
//
// const renderItem = ({ item }) => {
//   const { key, ...rest } = item; // Remove `key`
//   return (
//     <View style={{ padding: 5 }}>
//       <TeamPointsComponent branchData={rest} logoPaths={logoPaths} />
//     </View>
//   );
// };
//   return (
//     <View style={styles.container}>
//       {loading && <ActivityIndicator size="large" color="#fff" />}
//       {!loading && (
//         <>
//           <View style={styles.containertop}>
//             <LinearGradient
//               start={{ x: 0.0, y: 1.0 }}
//               end={{ x: 0.0, y: 0.0 }}
//               locations={[0.6, 1]}
//               colors={[teamColors[team].topColor, teamColors[team].bottomColor]}
//               style={styles.containertop}
//             >
//               <Image style={styles.branchLogoImage} source={logoPaths[team]} />
//               <Text style={styles.branchTotalPoints}>{totalPoints()} PTS</Text>
//             </LinearGradient>
//           </View>
//
//           <View style={styles.container2}>
//           <FlatList
//           data={eventPoints}
//           renderItem={({ item }) => {
//               const { key, ...rest } = item; // Remove `key`
//               return (
//                   <View style={{ padding: 5 }}>
//                   <TeamPointsComponent branchData={rest} logoPaths={logoPaths} />
//                   </View>
//               );
//           }}
//           keyExtractor={(item) => String(item[0])} // Ensure unique key
//           alwaysBounceVertical={false}
//           />
//           </View>
//           <View style={styles.bottomcont}>
//             <Text style={styles.text01}>Last Updated on: </Text>
//             <Text style={styles.text02}>{lastUpdated}</Text>
//           </View>
//           <View style={styles.bottomnav}></View>
//         </>
//       )}
//     </View>
//   );
// }
//
// const styles = StyleSheet.create({
//   branchLogoImage: {
//     height: 100,
//     width: 100,
//     marginTop: 30,
//   },
//   branchTotalPoints: {
//     color: "white",
//     padding: 30,
//     paddingTop: 20,
//     fontSize: 38,
//     fontWeight: "bold",
//   },
//   container: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "#000000",
//     color: "white",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//     paddingTop: 25,
//   },
//   containertop: {
//     flex: 1.2,
//     backgroundColor: "#CC9E32",
//     color: "white",
//     height: "120%",
//     marginTop: -60,
//     paddingTop: 60,
//     flexDirection: "column",
//     width: "120%",
//     alignItems: "center",
//     justifyContent: "center",
//     borderTopLeftRadius: 50,
//     borderTopRightRadius: 50,
//   },
//   containertop1: {
//     flex: 1,
//     flexDirection: "column",
//     justifyContent: "flex-end",
//   },
//   containertop2: {
//     flex: 1.25,
//     flexDirection: "column",
//     justifyContent: "flex-end",
//   },
//   containertop3: {
//     flex: 1,
//     flexDirection: "column",
//     justifyContent: "flex-end",
//   },
//   number1top: {
//     flex: 1,
//     justifyContent: "flex-end",
//     alignItems: "center",
//     padding: 10,
//   },
//   number1bottom: {
//     flex: 0.75,
//     backgroundColor: "#746030",
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   number2top: {
//     flex: 1.5,
//     justifyContent: "flex-end",
//     alignItems: "center",
//     padding: 10,
//   },
//   number2bottom: {
//     flex: 0.75,
//     backgroundColor: "#52514F",
//     borderTopLeftRadius: 12,
//     borderBottomLeftRadius: 12,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   number3top: {
//     flex: 2,
//     justifyContent: "flex-end",
//     alignItems: "center",
//     padding: 10,
//   },
//   number3bottom: {
//     flex: 0.75,
//     backgroundColor: "#795038",
//     borderTopRightRadius: 12,
//     borderBottomRightRadius: 12,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   iconCont: {
//     padding: 5,
//   },
//   container2: {
//     flex: 2,
//     backgroundColor: "#000000",
//     color: "white",
//     flexDirection: "row",
//     paddingTop: 10,
//   },
//   leadHeading: {
//     fontSize: 15,
//     color: "white",
//
//     fontWeight: "bold",
//   },
//   leadScore: {
//     fontSize: 20,
//     color: "white",
//
//     fontWeight: "bold",
//   },
//
//   text: {
//     color: "white",
//   },
//   LeaderBoardList: {
//     flex: 1,
//     backgroundColor: "#000000",
//     gap: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 100,
//   },
//   bottomcont: {
//     flex: 0.3,
//     flexDirection: "row",
//     backgroundColor: "#000000",
//     color: "white",
//     alignItems: "center",
//     justifyContent: "center",
//     bottomMargin: 0,
//   },
//   text01: {
//     color: "#D41D77",
//     alignItems: "center",
//
//     paddingBottom: 0,
//   },
//   text02: {
//     color: "white",
//     fontWeight: "bold",
//     alignContent: "center",
//
//     paddingBottom: 0,
//   },
//   bottomnav: {
//     flex: 0.25,
//     backgroundColor: "#000000",
//     color: "white",
//     alignItems: "center",
//     justifyContent: "center",
//     height: 50,
//   },
// });
//
    //
    //
    //
    //
    //
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
  const [Ids, setIds] = useState([]);
  const [data, setdata] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("08/03/2023");

  const branch =
    route.params?.branch ||
    setProperTeamName(loginctx?.detail?.dept || "MSc_ITEP");
  const team = setProperTeamName(branch);

  useEffect(() => {
    const fetchlastUpdated = async () => {
      try {
        const response = await axios.get(
          backend_link + "api/event/lastUpdated"
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
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [branch]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          backend_link + "api/points/getPointsTableByTeam?teamId=" + team
        );

        console.log("respomnse", response.data);

        const eventData = response.data.pointsTable;
        const ids = Object.keys(response.data.pointsTable);
        setIds(ids);
        const pointsArray = ids.map((id) => [id, eventData[id].points]);
        const newPointsArray = sortPointsTable(pointsArray);
        // pointsArray.sort((a, b) => b[1] - a[1]); // sorting the array in descending order
        setEventPoints(newPointsArray);
        return pointsArray;
      } catch (err) {
        console.log(err);
        Alert.alert("Error", err);
      }
    };
    fetchData();
  }, [branch]);

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
      {loading && <ActivityIndicator size="large" color="#fff" />}
      {!loading && (
        <>
          <View style={styles.containertop}>
            <LinearGradient
              start={{ x: 0.0, y: 1.0 }}
              end={{ x: 0.0, y: 0.0 }}
              locations={[0.6, 1]}
              colors={[teamColors[team].topColor, teamColors[team].bottomColor]}
              style={styles.containertop}
            >
              <Image style={styles.branchLogoImage} source={logoPaths[team]} />
              <Text style={styles.branchTotalPoints}>{totalPoints()} PTS</Text>
            </LinearGradient>
          </View>

          <View style={styles.container2}>
          <FlatList
          data={eventPoints}
          renderItem={({ item }) => {
              const { key, ...rest } = item; // Remove `key`
              return (
                  <View style={{ padding: 5 }}>
                  <TeamPointsComponent branchData={rest} logoPaths={logoPaths} />
                  </View>
              );
          }}
          keyExtractor={(item) => String(item[0])} // Ensure unique key
          alwaysBounceVertical={false}
          />
          </View>
          <View style={styles.bottomcont}>
            <Text style={styles.text01}>Last Updated on: </Text>
            <Text style={styles.text02}>{lastUpdated}</Text>
          </View>
          <View style={styles.bottomnav}></View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  branchLogoImage: {
    height: 100,
    width: 100,
    marginTop: 30,
  },
  branchTotalPoints: {
    color: "white",
    padding: 30,
    paddingTop: 20,
    fontSize: 38,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 25,
  },
  containertop: {
    flex: 1.2,
    backgroundColor: "#CC9E32",
    color: "white",
    height: "120%",
    marginTop: -60,
    paddingTop: 60,
    flexDirection: "column",
    width: "120%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
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
    padding: 5,
  },
  container2: {
    flex: 2,
    backgroundColor: "#000000",
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
    flex: 0.25,
    backgroundColor: "#000000",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
});
