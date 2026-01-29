import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  Button,
  FlatList,
  Image,
} from "react-native";
import axios from "axios";
import { backend_link } from "../../utils/constants";

export default function App() {
  const [isposted, setisposted] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageTitle, setImageTitle] = useState("");
  const [imageDescription, setImageDescription] = useState("");

  const [Ids, setIds] = useState([]);
  const [data, setdata] = useState([]);
  const [dataValues, setDataValues] = useState(Object.values(data));
  // const [dataArray, setDataArray] = useState(Object.values(data));

  useEffect(() => {
    const getAllCarousels = async () => {
      try {
        const response = await axios.get(
          backend_link + "api/assets/getNewsImages"
        );
        console.log("response", response.data);
        const ids = Object.keys(response.data);
        // console.log(ids);
        setIds(ids);
        setdata(response.data);
        setDataValues(Object.values(response.data));
        return response;
        // const dataArray = response.map(([id, item]) => ({
        //   id,
        //   imageUrl: item.imageUrl,
        //   title: item.title
        // }));

        console.log("dataArray", dataArray);
      } catch (err) {
        console.log("Failed to get Carousel Images", err);
      }
    };
    getAllCarousels();
  }, [isposted]);

  const uploadPhotoHandler = async () => {
    try {
      const response = await axios.post(
        backend_link +
          "api/assets/addNewslImage?imageUrl=" +
          imageUrl +
          "&title=" +
          imageTitle +
          "&description=" +
          imageDescription
      );
      // console.log(response);
      Alert.alert("Success", "Image Added Successfully!");
      setImageUrl(null);
      setImageTitle("");
      setImageDescription("");

      setDataValues(Object.values(data));
      setisposted((prev) => prev + 1);
    } catch (err) {
      console.log("Failed", err);
    }
  };

  const deleteImageHandler = async (itemToBeDeleted) => {
    // console.log("Hi");
    console.log(data);
    console.log(itemToBeDeleted);
    let imageId = ""; // Change const to let to allow reassignment
    const dataArray = Array.from(Object.entries(data));
    for (const [id, item] of dataArray) {
      console.log("item from loop", item);
      if (item.imageUrl === itemToBeDeleted.imageUrl) {
        imageId = id;
        console.log(imageId);
        break;
      }
    }

    try {
      const resp = await axios.post(
        backend_link + "api/assets/deleteNewsImage?id=" + imageId
      );
      console.log("SUCCESS", resp);
      console.log("SUCCESS", data);
      setDataValues(Object.values(data));
      setisposted((prev) => prev + 1);
      Alert.alert("SUCCESSFULLY DELETED");
    } catch (err) {
      Alert("Error", err);
    }
  };

  const renderItem = ({ item }) => {
    console.log("item", item);
    return (
      <View
        style={{
          width: "100%",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 20, padding: 10 }}>
          {item.title}
        </Text>
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: 300, height: 200 }}
          alt="Carousel-Image"
        />
        <Text style={{ color: "white", fontSize: 20, padding: 20 }}>
          {item?.description ? item?.description?.slice(0, 100) + "..." : ""}
        </Text>
        {/* <Text style={{color:'white',fontSize:20,padding:20}}>{item.imageUrl}</Text> */}
        <Button
          title="Delete"
          onPress={() => {
            deleteImageHandler(item);
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Oracle News Image URL:</Text>
      <TextInput
        placeholder="Enter image URL"
        style={{
          height: 50,
          paddingHorizontal: 8,
          backgroundColor: "white",
          width: "80%",
          marginBottom: 14,
        }}
        onChangeText={(newText) => setImageUrl(newText)}
        defaultValue={imageUrl}
      />
      <TextInput
        placeholder="Enter image Title"
        style={{
          height: 50,
          paddingHorizontal: 8,
          backgroundColor: "white",
          width: "80%",
          marginBottom: 14,
        }}
        onChangeText={(newText) => setImageTitle(newText)}
        defaultValue={imageTitle}
      />

      <TextInput
        placeholder="Enter image Description"
        style={{
          height: 50,
          paddingHorizontal: 8,
          backgroundColor: "white",
          width: "80%",
          marginBottom: 14,
        }}
        onChangeText={(newText) => setImageDescription(newText)}
        defaultValue={imageDescription}
      />
      {imageUrl && imageTitle ? (
        <Button title="SUBMIT" onPress={uploadPhotoHandler} />
      ) : (
        <View />
      )}
      <Text style={{ marginHorizontal: 12, color: "gray", fontSize: 24 }}>
        OR
      </Text>
      <FlatList
        data={dataValues}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        alwaysBounceVertical={false}
        style={{
          flex: 0.9,
          height: "60%",
        }}
      />
      <View style={{ height: 90 }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    flexDirection: "column",
  },
  header: {
    color: "#d41d77",
    fontSize: 24,
    marginBottom: 16,
    padding: 16,
  },
});
