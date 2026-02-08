import { useState, useEffect, useContext } from "react";
import { Icon } from "react-native-elements";
import { Pressable, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

import Leaderboard from "./LeaderBoard";

import Events from "./Events/Events";
import SpecificEvents from "./Events/SpecificEvents";
import Homepage from "./Homepage";
import NewsPage from "./NewsPage";
import SpecificNewsPage from "./specificNewsPage";
import FollowTeam from "./FollowTeam";

import Header from "../Components/Header";
import TeamPoints from "./TeamPoints";
import { LoginContext } from "../store/LoginContext";

import LiveEvents from "./Admin/LiveEvents";
import AddNewsImage from "./Admin/AddNewsImage";
import AddSportEvents from "./Admin/AddSportEvents";
import AdminDashboard from "./Admin/AdminDashboard";
import AddTechCultEvent from "./Admin/AddTechCultEvent";
import AddCarouselImage from "./Admin/AddCarouselImage";
import AddSportEventResult from "./Admin/AddSportResult";
import UpdateSportEvents from "./Admin/UpdateSportScore";
import UpdateTechCultEvents from "./Admin/UpdateTechCultEvent";
import UpdateSportEventResult from "./Admin/UpdateSportEventPoint";
import CheckUpdateTechCultEvents from "../Components/CheckUpdateEvent";
import CheckSportUpdateEvent from "../Components/CheckSportUpdateEvent";
import AddNotification from "./Admin/AddNotification";
import SportPoints from "./Admin/SportPoints";
import PlayerScreen from "./Events/PlayerScreen";
import AddContention from "./Admin/AddContention";
import ViewContentions from "./Admin/ViewContentions";
import RegisterTeam from "./Admin/RegisterTeam";
import TeamRegistrationForm from "./Admin/TeamRegistrationForm";

import setProperTeamName from "../utils/setProperTeamName";
import CreditsPage from "./CreditsPage";
import ModalComponent from "../Components/Modal";
import NotificationsPage from "./NotificationsPage";

import TeamRegistration from "./Events/TeamRegistration";

const Tab = createBottomTabNavigator();
const EventsStack = createStackNavigator();
const LeaderboardStack = createStackNavigator();
// const fantasy_leaderboard = createStackNavigator();
const AdminDashboardStack = createStackNavigator();
const HomepageStack = createStackNavigator();
// const fantasy_leaderboard = createStackNavigator();

// Create a stack navigator for each tab to include the Header
function EventsStackNavigator() {
  return (
    <EventsStack.Navigator>
      <EventsStack.Screen
        name="EventsStack"
        component={Events}
        options={({ route }) => ({
          headerTitle: () => <Header events={true} />,
          headerStyle: { backgroundColor: "#111319", height: 100 },
          field: route.params?.field || "Sports",
          reloader: route.params?.reloader,
        })}
      />
      <EventsStack.Screen
        name="SpecificEvent"
        component={SpecificEvents}
        options={({ route }) => ({
          headerTitle: () => <Header />,
          headerStyle: { backgroundColor: "#111319", height: 120 },
          headerTintColor: "white",
          data: route.params.data,
        })}
      />
      <EventsStack.Screen
        name="PlayerScreen"
        component={PlayerScreen}
        options={({ route }) => ({
          headerTitle: () => <Header />,
          headerStyle: { backgroundColor: "#111319", height: 120 },
          headerTintColor: "white",
          data: route.params.data,
        })}
      />
      <EventsStack.Screen
        name="TeamRegistration"
        component={TeamRegistration}
        options={({ route }) => ({
          headerTitle: () => <Header />,
          headerStyle: { backgroundColor: "#111319", height: 120 },
          headerTintColor: "white",
          data: route.params.data,
        })}
      />
    </EventsStack.Navigator>
  );
}

function LeaderboardStackNavigator() {
  return (
    <LeaderboardStack.Navigator>
      <LeaderboardStack.Screen
        name="LeaderboardStack"
        component={Leaderboard}
        options={{
          headerShown: false,
          // headerTitle: (props) => <Header />,
          headerStyle: { backgroundColor: "#111319", height: 100 },
        }}
      />
    </LeaderboardStack.Navigator>
  );
}
// function HomepageStackNavigator({navigation}) {
//   return (
//     <HomepageStack.Navigator initialRouteName="HomePageStack">
//       <HomepageStack.Screen
//         name="HomepageStack"
//         component={Homepage}
//         options={{
//           headerShown: true,
//           headerTitle: (props) => <Header showmodal={true} />,
//           headerStyle: { backgroundColor: "#111319", height: 100 },
//         }}
//       />
//       <HomepageStack.Screen
//         name="NewsPage"
//         component={NewsPage}
//         options={{
//           headerShown: false,
//           headerTitle: (props) => <Header />,
//           headerStyle: { backgroundColor: "#111319", height: 100 },
//         }}
//       />
//       <HomepageStack.Screen
//         name="SpecificNewsPage"
//         component={SpecificNewsPage}
//         options={({ route }) => ({
//           data: route.params?.data,
//           // headerShown: false,
//           headerTitle: (props) => <Header />,
//           headerTintColor: "white",
//           headerStyle: { backgroundColor: "#111319", height: 100 },
//         })}
//       />
//     </HomepageStack.Navigator>
//   );
// }

function HomepageStackNavigator({ navigation }) {
  // console.log(`Home page ${navigation}`)
  return (
    <HomepageStack.Navigator initialRouteName="HomePageStack">
      <HomepageStack.Screen
        name="HomepageStack"
        component={Homepage}
        options={{
          headerShown: true,
          headerTitle: () => (
            <Header showmodal={true} navigation={navigation} />
          ), // Pass navigation
          headerStyle: { backgroundColor: "#111319", height: 100 },
        }}
      />
      <HomepageStack.Screen
        name="NewsPage"
        component={NewsPage}
        options={{
          headerShown: false,
          headerTitle: () => <Header navigation={navigation} />,
          headerStyle: { backgroundColor: "#111319", height: 100 },
        }}
      />
      <HomepageStack.Screen
        name="SpecificNewsPage"
        component={SpecificNewsPage}
        options={({ route, navigation }) => ({
          data: route.params?.data,
          headerTitle: () => <Header navigation={navigation} />,
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#111319", height: 100 },
        })}
      />
      <HomepageStack.Screen
        name="Credits"
        component={CreditsPage}
        options={({ route }) => ({
          headerShown: false,
          headerTitle: () => <Header navigation={navigation} />,
          headerStyle: { backgroundColor: "#111319", height: 100 },
        })}
      />
    </HomepageStack.Navigator>
  );
}
function AdminDashboardStackNavigator() {
  return (
    <AdminDashboardStack.Navigator>
      <AdminDashboardStack.Screen
        name="AdminDashboardStack"
        component={AdminDashboard}
        options={{
          headerShown: false,
          // headerTitle: () => <Header />,
          // headerStyle: { backgroundColor: "#111319", height: 100 },
        }}
      />
      <AdminDashboardStack.Screen
        name="AdminAddScoreStack"
        component={UpdateSportEvents}
        options={{
          headerTitle: () => <Header />,
          headerTintColor: "white",
          // headerLeft: null,
          headerStyle: { backgroundColor: "#111319" },
          // headerShown: false,
        }}
      />
      <AdminDashboardStack.Screen
        name="LiveEvents"
        component={LiveEvents}
        options={{
          // headerTitle: () => <Header />,
          // headerTintColor: "white", // YAY! Proper format!
          // headerStyle: { backgroundColor: "#111319" },
          headerShown: false,
        }}
      />
      <AdminDashboardStack.Screen
        name="AddSportEvent"
        component={AddSportEvents}
        options={{
          // headerTitle: () => <Header />,
          // headerTintColor: "white", // YAY! Proper format!
          // headerStyle: { backgroundColor: "#111319" },
          headerShown: false,
        }}
      />
      <AdminDashboardStack.Screen
        name="AddNewsImage"
        component={AddNewsImage}
        options={{
          // headerTitle: () => <Header />,
          // headerTintColor: "white", // YAY! Proper format!
          // headerStyle: { backgroundColor: "#111319" },
          headerShown: false,
        }}
      />
      <AdminDashboardStack.Screen
        name="AddTechCultEvent"
        component={AddTechCultEvent}
        options={{
          // headerTitle: () => <Header />,
          // headerTintColor: "white", // YAY! Proper format!
          // headerStyle: { backgroundColor: "#111319" },
          headerShown: false,
        }}
      />
      <AdminDashboardStack.Screen
        name="CheckUpdateTechCultEvent"
        component={CheckUpdateTechCultEvents}
        options={{
          // headerTitle: () => <Header />,
          // headerTintColor: "white", // YAY! Proper format!
          // headerStyle: { backgroundColor: "#111319" },
          headerShown: false,
        }}
      />
      <AdminDashboardStack.Screen
        name="UpdateTechCultEvent"
        component={UpdateTechCultEvents}
        options={{
          // headerTitle: () => <Header />,
          // headerTintColor: "white", // YAY! Proper format!
          // headerStyle: { backgroundColor: "#111319" },
          headerShown: false,
        }}
      />
      <AdminDashboardStack.Screen
        name="AddCarouselImage"
        component={AddCarouselImage}
        options={{
          // headerTitle: () => <Header />,
          // headerTintColor: "white", // YAY! Proper format!
          // headerStyle: { backgroundColor: "#111319" },
          headerShown: false,
        }}
      />
      <AdminDashboardStack.Screen
        name="SportPoints"
        component={SportPoints}
        options={{
          // headerTitle: () => <Header />,
          // headerTintColor: "white", // YAY! Proper format!
          // headerStyle: { backgroundColor: "#111319" },
          headerShown: false,
        }}
      />
      <AdminDashboardStack.Screen
        name="AddSportEventResult"
        component={AddSportEventResult}
        options={{
          // headerTitle: () => <Header />,
          // headerTintColor: "white", // YAY! Proper format!
          // headerStyle: { backgroundColor: "#111319" },
          headerShown: false,
        }}
      />
      <AdminDashboardStack.Screen
        name="CheckUpdateSportsEvent"
        component={CheckSportUpdateEvent}
        options={{
          // headerTitle: () => <Header />,
          // headerTintColor: "white", // YAY! Proper format!
          // headerStyle: { backgroundColor: "#111319" },
          headerShown: false,
        }}
      />
      <AdminDashboardStack.Screen
        name="UpdateSportEventResult"
        component={UpdateSportEventResult}
        options={{
          // headerTitle: () => <Header />,
          // headerTintColor: "white", // YAY! Proper format!
          // headerStyle: { backgroundColor: "#111319" },
          headerShown: false,
        }}
      />
      <AdminDashboardStack.Screen
        name="AddNotification"
        component={AddNotification}
        options={{
          // headerTitle: () => <Header />,
          // headerTintColor: "white", // YAY! Proper format!
          // headerStyle: { backgroundColor: "#111319" },
          headerShown: false,
        }}
      />
      <AdminDashboardStack.Screen
        name="AddContention"
        component={AddContention}
        options={{
          headerTitle: () => <Header />,
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#111319" },
        }}
      />
      <AdminDashboardStack.Screen
        name="ViewContentions"
        component={ViewContentions}
        options={{
          headerShown: false,
        }}
      />
      <AdminDashboardStack.Screen
        name="RegisterTeam"
        component={RegisterTeam}
        options={{
          headerTitle: () => <Header />,
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#111319", height: 100 },
        }}
      />
      <AdminDashboardStack.Screen
        name="TeamRegistrationForm"
        component={TeamRegistrationForm}
        options={{
          headerTitle: () => <Header />,
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#111319", height: 100 },
        }}
      />
    </AdminDashboardStack.Navigator>
  );
}

export default function AllTabs() {
  const LoginCtx = useContext(LoginContext);
  const navigation = useNavigation();
  const handleTabPress = () => {
    // Perform action when a tab is pressed
    navigation.navigate("   ");
  };
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          justifyContent: "space-between",
          alignItems: "center",
          height: 51, // Adjust height as needed
          paddingBottom: 0, // Adjust padding to ensure icons and text are aligned and not touching the screen's bottom edge
          paddingTop: 10,
          paddingHorizontal: 20, // Adds horizontal padding
          position: "absolute", // This along with the following lines create the hovering effect
          bottom: 25, // Distance from the bottom of the screen
          left: 20,
          right: 20,
          borderRadius: 25, // Rounds the corners of the tabBar
          shadowColor: "#000", // Shadow color for iOS
          shadowOffset: { width: 0, height: 10 }, // Shadow position for iOS
          shadowOpacity: 0.3, // Shadow opacity for iOS
          shadowRadius: 5, // Shadow blur radius for iOS
        },
        tabBarItemStyle: {
          alignContent: "center",
          justifyContent: "center",
          width: "100%",
          height: 40,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === " ") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "  ") {
            iconName = focused ? "trophy" : "trophy-outline";
          } else if (route.name === "     ") {
            iconName = focused ? "cog" : "cog-outline";
            // Using React Native Elements for Icons
          } else if (route.name === "   ") {
            iconName = focused ? "trophy" : "trophy-outline";
          } else if (route.name === "    ") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "      ") {
            iconName = focused ? "bell" : "bell-outline";
          } else if (route.name === "       ") {
            iconName = focused ? "currency-usd" : "currency  -usd";
          } else if (route.name === "        ") {
            iconName = focused
              ? "account-multiple-check"
              : "account-multiple-check-outline";
          }
          return (
            <Icon
              name={iconName}
              type="material-community"
              size={27}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: "#D41D77",
        tabBarInactiveTintColor: "black",
      })}
      initialRouteName="    "
    >
      <Tab.Screen name=" " component={EventsStackNavigator} />
      <Tab.Screen
        name="  "
        component={LeaderboardStackNavigator}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="   "
        component={TeamPoints}
        options={({ route }) => ({
          branch: route.params?.branch,
          tabBarIcon: ({ focused, color, size }) => (
            <TouchableOpacity onPress={handleTabPress}>
              <Icon
                name={focused ? "medal" : "medal-outline"}
                type="material-community"
                size={27}
                color={color}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen name="    " component={HomepageStackNavigator} />
      {LoginCtx.isAdmin && (
        <Tab.Screen name="     " component={AdminDashboardStackNavigator} />
      )}
      <Tab.Screen name="      " component={NotificationsPage} />
      <Tab.Screen name="        " component={CreditsPage} />
      <Tab.Screen
        name="       "
        component={FollowTeam}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
}
