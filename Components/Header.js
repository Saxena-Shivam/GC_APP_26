import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";
import Modal from "./Modal";
import EventDropDown from "./eventsDropdown";


export default function Header({ events, showmodal, navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  return (
    <View
      style={styles.header}
      // style={{
      //     // Transparent background because mask is based off alpha channel.
      //     margin: 20,
      //     backgroundColor: 'transparent',
      //     flex: 1,
      //     justifyContent: 'space-evenly',
      //     alignItems: 'center',
      // }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "62%",
        }}
      >
        <Image
          source={require("../assets/logo.png")}
          style={{ width: 60, height: 60, resizeMode: "center" }} // Set explicit dimensions
        />
        <Text style={{ color: "white", fontSize: 23, fontWeight: "bold" }}>
          {" "}
          GC 2025
        </Text>
      </View>
      {/* <MaskedView
        maskElement={
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            GC 2024
          </Text>
        }
        style={{ height: 50, alignItems: "center", justifyContent: "center", flex: 1 }}
      >
        <LinearGradient
          colors={["#88345E", "#516FAD", "#4D73B2"]}
          start={[0, 0]}
          end={[1, 0]}
          style={{
            padding: 55,

            width: events ? 125 : 250,
            backgroundColor: "black",
          }}
        ></LinearGradient>
      </MaskedView> */}

      <View
        style={{ backgroundColor: "black", height: 50, alignItems: "center" }}
      >
        {events && <EventDropDown />}
      </View>
      {showmodal && (
        <View>
          <TouchableOpacity onPress={openModal} style={{borderWidth:2,borderColor:"#fff",borderRadius:50}}>
            <Icon name="person" size={27} color="white" />
          </TouchableOpacity>
        </View>
      )}
      <Modal modalVisible={modalVisible} setModalVisible={setModalVisible} navigation={navigation}/>
    </View>
  );
}
styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    flex: 0.4,
    minHeight: 50,
    backgroundColor: "#111319",
  },
});

