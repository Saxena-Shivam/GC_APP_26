import { LoginContext } from "../store/LoginContext.js";
import { useState, useEffect, useContext } from "react";
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

import Carousel, {
    Pagination,
    ParallaxImage,
} from "react-native-snap-carousel-new";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import CarouselCard from "../Components/CarouselCard";
import axios from "axios";
import { backend_link } from "../utils/constants";
import { ActivityIndicator } from "react-native-paper";
import { EventSubscriptionVendor } from "react-native";
import { getCorrectTimeStamp } from "../utils/helperFunctions";
import { indigo, red } from "@mui/material/colors";

var { width, height } = Dimensions.get("window");
export default function Fantasy_Leaderboard() {
    const [lastUpdated, setLastUpdated] = useState("Unknown Date");
    const [leaderboardData, setLeaderboardData] = useState([]);
    const LoginCtx = useContext(LoginContext);
    const userEmail = LoginCtx.user.email;
    const [user, setUser] = useState({});

    const fetchLeaderboardData = async () => {
        try {
            const response = await axios.get(backend_link + "api/user/getAllDetails");
            // co
            console.log(response.data);
            // setUser()
            // console.log(data);

            // console.log(userData);
            const {userArray} = response.data;
            console.log("a;sfjads;lfj", response.data);
            const result = userArray.find(obj => obj.mail === userEmail);
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

    useEffect(() => {
        fetchLeaderboardData();
    }, [])


    return (
        <SafeAreaView style={leaderboardStyles.container}>
            {/* <View style = {{height: 150, width: "auto"}}>
        <TeamCard />
      </View> */}
            <Text style={{

                //paddingB: 10,
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
                //marginBottom: 10,
                padding: 15,
            }}>My Points</Text>
            <View style={{

                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "#222",
                padding: 15,
                marginVertical: 5,
                borderRadius: 10,
                marginTop: 5,
                marginBottom: 30,
                // width: width,
            }}>
                <View style={leaderboardStyles.newLine}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <Text style={leaderboardStyles.name}>{user.name || "Unknown"}</Text>

                    </ScrollView>
                </View>
                <Text style={leaderboardStyles.points}>{user.coins}</Text>
            </View>
            <Text style={leaderboardStyles.heading}>Top 10 Individuals</Text>
            <FlatList
                data={leaderboardData}
                keyExtractor={(item, index) => index.toString()} // Ensure unique keys
                renderItem={({ item, index }) => (
                    <View style={leaderboardStyles.item}>
                        <View style={leaderboardStyles.newLine}>
                            <Text style={leaderboardStyles.rank}>{index + 1}.</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <Text style={leaderboardStyles.name}>{item.name || "Unknown"}</Text>

                            </ScrollView>
                        </View>
                        <Text style={leaderboardStyles.points}>{item.coins}</Text>
                    </View>
                )}
                style={leaderboardStyles.list}
            />
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
        // marginRight: -10,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 10,
        padding: 15,
    },
    item: {
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#222",
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        // width: width,
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
        // marginLeft:width*0.69,
        textAlign:"right",
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
    newLine: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // Ensures even spacing
        width: "100%", // Ensures it takes full width
        // paddingHorizontal: 10, // Adds some padding on both sides
    },  
});

// ############################################################################################################################################################################################################
const styles = StyleSheet.create({
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
        width: 370,
        height: 135,
        justifyContent: "center",
        paddingHorizontal: 3,
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
});
