import React, { useEffect, useState } from "react";
import CarouselCard from "../Components/CarouselCard";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  Button,
  FlatList,
  Dimensions,
  Image,
  SafeAreaView,
  Pressable,
  
} from "react-native";

import axios from "axios";
import { backend_link } from "../utils/constants";
const { width, height } = Dimensions.get("window");


const sortNewsbyDate = (data) => {
  console.log("data", data);

  data.sort((a, b) => {
    const dateA = new Date(
      a.timestamp._seconds * 1000 + a.timestamp._nanoseconds / 1000000
    );
    const dateB = new Date(
      b.timestamp._seconds * 1000 + b.timestamp._nanoseconds / 1000000
    );
    console.log("dateA", dateA);
    console.log("dateB", dateB);
    return dateB - dateA;
  });
  console.log("sordata", data);
  return data;
};

const NewsPage = ({ navigation }) => {
  const [Ids, setIds] = useState([]);
  const [dataValues, setDataValues] = useState([]);

  useEffect(() => {
    const getAllCarousels = async () => {
      try {
        const response = await axios.get(
          backend_link + "api/assets/getNewsImages"
        );
        console.log("response", response.data);
        const ids = Object.keys(response.data);
        setIds(ids);
        const sortedData = sortNewsbyDate(Object.values(response.data));
        setDataValues(sortedData);
        return response;
      } catch (err) {
        console.log("Failed to get Carousel Images", err);
      }
    };
    getAllCarousels();
  }, []);

  const renderItem = ({ item, index }) => {
    console.log("item", item);
    return (
      <Pressable
        onPress={() => navigation.navigate("SpecificNewsPage", { data: item })}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            border: 1,
            borderWidth: 1.2,
            borderBottomColor: "#303030",
            // borderTopColor: index === 0 ? "white" : "black",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          
          <View style={{ flex: 1, borderRadius: 15 ,alignItems:"center"}}>
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: width * 0.87, height: 150, borderRadius: 15 }}
              alt="Carousel-Image"
              
            />
            <View style={{width:0.8*width,justifyContent:"space-evenly",margin:8}}>
            <Text style={{ color: "#d41d77", fontSize: 20,textAlign:"left"}}>
            {item.title}
            
          </Text>
          <Text style={{ color: "white", fontSize: 14, marginBottom:2 }}>
              {item?.description
                ? item?.description?.slice(0, 100) + "..."
                : ""}
            </Text>
          </View>
           
            
          </View>
        </View>
      </Pressable>
    );
  };


  return (
      <View style={styles.newsSection}>
        <Image
          source={require("../assets/OracleLogo.jpg")}
          style={{
            width: 160,
            height: 160,
            resizeMode: "stretch",
            marginBottom: 10,
            marginTop: 50,
          }}
        />

        <FlatList
          data={dataValues}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          alwaysBounceVertical={false}
          style={{
            flex: 1,
            height: "60%",
            paddingTop: 10,
          }}
        />
        <View style={{ height: 80 }}></View>
      </View>
    
  );
};

export default NewsPage;

const styles = StyleSheet.create({
  newsSection: {
    height: "100%",
    backgroundColor: "#000",
    alignItems: "center",
  },
  // logo: {
  //   borderWidth: 1,
  //   borderBottomColor: "white",
  //   borderTopColor: "white",
  // },
  card: {
    width: 340,
    height: 112,
    marginTop: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
});
