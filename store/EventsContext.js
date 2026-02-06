import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { backend_link } from "../utils/constants";

const EventsContext = createContext({
  events: [],
  liveEvents: [],
  upcomingEvents: [],
  pastEvents: [],
  techData: [],
  cultData: [],
  isLoading: false,
  fetchAllLiveEvents: async () => {},
});

const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [liveEvents, setLiveEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [techData, setTechData] = useState([]);
  const [cultData, setCultData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to convert timestamp to milliseconds
  const getTimestampInMs = (timestamp) => {
    if (!timestamp) return 0;

    // If it's a string (ISO format), convert to Date
    if (typeof timestamp === "string") {
      return new Date(timestamp).getTime();
    }

    // If it's already a number in seconds (10 digits), convert to milliseconds
    if (typeof timestamp === "number" && timestamp < 10000000000) {
      return timestamp * 1000;
    }

    // If it's already in milliseconds
    return timestamp;
  };

  const sortData = (data) => data.sort((a, b) => a.id.localeCompare(b.id));

  const fetchAllLiveEvents = async () => {
    setIsLoading(true);
    try {
      // Fetch sports events only
      const sportsResponse = await axios.get(
        `${backend_link}api/event/getAllLiveEvents`,
      );
      const sportsData = sportsResponse.data.events || [];
      console.log("Raw sports events data:", sportsData);

      // Parse sports events
      let sportEvents = sportsData.flatMap((item) => {
        const eventName = item.eventId;
        const subEvents = item.subEvents;
        const gameName = eventName;

        return subEvents.map((match_item) => {
          const teamA = match_item.data.points.teamA;
          const teamB = match_item.data.points.teamB;
          const details = match_item.data.details;

          const startTimestampMs = getTimestampInMs(details?.timestamp);
          let endTimestampMs = getTimestampInMs(
            details?.endTimeStamp ?? match_item.data?.endTimeStamp,
          );

          // If endTimeStamp is missing or 0, estimate it as start + 2 hours
          if (!endTimestampMs || endTimestampMs === 0) {
            endTimestampMs = startTimestampMs + 2 * 60 * 60 * 1000; // 2 hours
            console.log(
              `  WARNING: endTimeStamp missing for ${match_item.subEventId}, estimated as ${new Date(endTimestampMs).toLocaleString()}`,
            );
          }

          console.log(`Event: ${match_item.subEventId}`);
          console.log(
            `  Start: ${new Date(startTimestampMs).toLocaleString()}`,
          );
          console.log(`  End: ${new Date(endTimestampMs).toLocaleString()}`);
          console.log(`  Status from backend: ${match_item.data.status}`);

          return {
            details: details,
            status: match_item.data.status,
            gameName: gameName,
            id: match_item.subEventId,
            timeStamp: startTimestampMs,
            endTimeStamp: endTimestampMs,
            teamA: teamA?.name || match_item.subEventId.split(" vs ")[0],
            teamB: teamB?.name || match_item.subEventId.split(" vs ")[1],
            scoreA: teamA?.points || 0,
            scoreB: teamB?.points || 0,
            betsA: teamA?.bets,
            betsB: teamB?.bets,
            playersA: teamA?.players,
            playersB: teamB?.players,
            eventType: "sports",
          };
        });
      });

      let events = sportEvents;
      events = sortData(events);
      setEvents(events);
      await AsyncStorage.setItem("events", JSON.stringify(events));

      // Categorize into Live, Upcoming, and Past
      const now = Date.now();
      console.log("Current time (ms):", now);
      console.log("Current time:", new Date(now).toLocaleString());

      const past = [];
      const live = [];
      const upcoming = [];

      events.forEach((event) => {
        console.log(`\nCategorizing: ${event.id}`);
        console.log(
          `  timeStamp: ${event.timeStamp}, endTimeStamp: ${event.endTimeStamp}`,
        );
        console.log(
          `  Start Date: ${new Date(event.timeStamp).toLocaleString()}`,
        );
        console.log(
          `  End Date: ${new Date(event.endTimeStamp).toLocaleString()}`,
        );
        console.log(`  Backend status: ${event.status}`);

        const isPastByTime = event.endTimeStamp < now;
        const isLiveByTime =
          event.timeStamp <= now && event.endTimeStamp >= now;
        const isUpcomingByTime = event.timeStamp > now;

        // Primary: Use backend status when it does not conflict with timestamps
        if (event.status && typeof event.status === "string") {
          const statusLower = event.status.toLowerCase();
          if (statusLower === "past" || statusLower === "completed") {
            if (isUpcomingByTime || isLiveByTime) {
              console.log(
                `  -> STATUS PAST but time indicates UPCOMING/LIVE, using timestamp`,
              );
            } else {
              console.log(`  -> PAST (from backend status: ${event.status})`);
              past.push(event);
              return;
            }
          } else if (statusLower === "live" || statusLower === "ongoing") {
            if (isPastByTime) {
              console.log(
                `  -> STATUS LIVE but time indicates PAST, using timestamp`,
              );
            } else {
              console.log(`  -> LIVE (from backend status: ${event.status})`);
              live.push(event);
              return;
            }
          } else if (
            statusLower === "upcoming" ||
            statusLower === "scheduled"
          ) {
            if (isPastByTime || isLiveByTime) {
              console.log(
                `  -> STATUS UPCOMING but time indicates PAST/LIVE, using timestamp`,
              );
            } else {
              console.log(
                `  -> UPCOMING (from backend status: ${event.status})`,
              );
              upcoming.push(event);
              return;
            }
          }
        }

        // Fallback: Use timestamp-based categorization
        if (isPastByTime) {
          console.log(
            `  -> PAST (endTimeStamp ${event.endTimeStamp} < now ${now})`,
          );
          past.push(event);
        } else if (isLiveByTime) {
          console.log(`  -> LIVE`);
          live.push(event);
        } else if (isUpcomingByTime) {
          console.log(
            `  -> UPCOMING (timeStamp ${event.timeStamp} > now ${now})`,
          );
          upcoming.push(event);
        }
      });

      console.log(
        `\nCategorized - Live: ${live.length}, Upcoming: ${upcoming.length}, Past: ${past.length}`,
      );

      setLiveEvents(live);
      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tech and cult events
  const fetchTechCultEvents = async () => {
    try {
      const [techResponse, cultResponse] = await Promise.all([
        axios.get(backend_link + "api/event/getEventByCategory?category=tech"),
        axios.get(backend_link + "api/event/getEventByCategory?category=cult"),
      ]);

      const techdata = (techResponse.data.events || []).filter(
        (item) => item !== null,
      );
      const cultdata = (cultResponse.data.events || []).filter(
        (item) => item !== null,
      );

      setTechData(techdata);
      setCultData(cultdata);
    } catch (error) {
      console.log("Error fetching tech/cult events:", error);
    }
  };

  useEffect(() => {
    fetchAllLiveEvents();
    fetchTechCultEvents();
  }, []);

  return (
    <EventsContext.Provider
      value={{
        events,
        liveEvents,
        upcomingEvents,
        pastEvents,
        techData,
        cultData,
        isLoading,
        fetchAllLiveEvents,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export { EventsProvider, EventsContext };
