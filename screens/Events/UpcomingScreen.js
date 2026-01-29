import { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import UpcomingEventCard from "../../Components/UpcomingEventCard";
import Loader from "../../Components/Loader";
import { EventsContext } from "../../store/EventsContext";
import axios from "axios";
import { backend_link } from "../../utils/constants";

const sortData = (data) => {
  return data.sort((a, b) => new Date(a.details.timestamp) - new Date(b.details.timestamp)); // Sort by date ascending
};

function UpcomingScreen({ search ,navigation}) {
  const { upcomingEvents, isLoading } = useContext(EventsContext); // Get state directly
  const [filteredData, setFilteredData] = useState([]);
  const [branchCoords, setBranchCoords] = useState({});

  useEffect(() => {
    if (upcomingEvents.length > 0) {
      setFilteredData(sortData(upcomingEvents)); // Set state when events are loaded
    }
  }, [upcomingEvents]);

  const fetchBranchCoords = async () => {
    try {
      console.log(`${backend_link}api/event/getBranchCoord`);
      const response = await axios.get(`${backend_link}api/event/getBranchCoord`);
      setBranchCoords(response.data.branch_coordinators);
    } catch (error) {
      console.log("error fetching in fetching branch coords", error);
    }
  }

  useEffect(() => {
    fetchBranchCoords();
  }, []);

  useEffect(() => {
    if (!upcomingEvents.length) return; // Prevent unnecessary filtering if no data is available
    
    console.log("aaa",search);
    if (search.length === 0) {
      setFilteredData(sortData(upcomingEvents)); // Reset if search is empty
      return;
    }

    const data = upcomingEvents.filter((item) => {
      let teamA = item?.teamA.toLowerCase();
      let teamB = item?.teamB.toLowerCase();
      let gameName = item?.gameName.toLowerCase();
      // let betsA = item?.betsA;
      // let betsB = item?.betsB;
      const id = item?.id.toLowerCase();

      return (
        teamA.includes(search.toLowerCase()) ||
        teamB.includes(search.toLowerCase()) ||
        gameName.includes(search.toLowerCase()) ||
        id.includes(search.toLowerCase())
      );
    });

    setFilteredData(sortData(data));
  }, [search, upcomingEvents]);

  return (
    <View style={styles.eventsContainer}>
      <FlatList
        key={1}
        data={filteredData}
        renderItem={(itemData) => (
          <UpcomingEventCard
            details={itemData.item.details}
            gameName={itemData.item.gameName}
            id={itemData.item.id}
            teamA={itemData.item.teamA}
            teamB={itemData.item.teamB}
            scoreA={itemData.item.scoreA}
            scoreB={itemData.item.scoreB}
            betsA = {itemData.item.betsA}
            betsB = {itemData.item.betsB}
            playersA = {itemData.item.playersA}
            playersB = {itemData.item.playersB}
            branchCoords={branchCoords}
            navigation={navigation}
          />
        )}
        keyExtractor={(item, index) => `${item.id}-${item.gameName}-${index}`}
        alwaysBounceVertical={false}
      />
      <View style={{ minHeight: 0 }}>
        <Loader visible={isLoading} top={300} bottom={0} setModalVisible={() => {}} />
      </View>
    </View>
  );
}

export default UpcomingScreen;

const styles = StyleSheet.create({
  eventsContainer: {
    flex: 5,
    maxHeight: "60%",
  },
});
