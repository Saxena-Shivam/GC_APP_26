# Event ID Structure & Event Sync Explanation

## Event ID Format

### 1. Sports Events (UpdateSportScore.js)

In **UpdateSportScore.js**, the event ID is constructed as:

```javascript
id: item1.data.details.title.split(" ").join("") +
  "++" +
  item1.subEventId.split(" ").join("");
```

**Example**:

- Event Title: "Cricket Match Final"
- SubEventId: "ECE vs CSE"
- Resulting ID: `CricketMatchFinal++ECEvs.CSE`

**Source Data Flow**:

```
Backend API: api/event/getAllLiveEvents
    ↓
Response: Array of events with subEvents
    ↓
Each subEvent has:
    - item1.data.details.title (e.g., "Cricket Match Final")
    - item1.subEventId (e.g., "ECE vs CSE")
    - item1.data.points (teamA, teamB with points and bets)
    - item1.data.status (Live, Upcoming, Past)
```

---

### 2. Sports Events (EventsContext.js - Correct Implementation)

In **EventsContext.js**, the event ID is simpler and more reliable:

```javascript
id: match_item.subEventId;
```

**Example**:

- ID: `ECE vs CSE`

**Data Structure**:

```javascript
{
  id: match_item.subEventId,           // e.g., "ECE vs CSE"
  gameName: eventName,                  // e.g., "Cricket"
  teamA: teamA?.name || derived,        // Team A name
  teamB: teamB?.name || derived,        // Team B name
  scoreA: teamA?.points || 0,           // Team A score
  scoreB: teamB?.points || 0,           // Team B score
  betsA: teamA?.bets,                   // Betting data for team A
  betsB: teamB?.bets,                   // Betting data for team B
  details: match_item.data.details,     // Event details (title, location, timestamp)
  status: match_item.data.status,       // Event status
  timeStamp: startTimestampMs,          // Start time in milliseconds
  endTimeStamp: endTimestampMs          // End time in milliseconds
}
```

---

## Event Sync Status

### ✅ What's Working Correctly

1. **EventsContext Fetching** ✓

   - Successfully fetches from `api/event/getAllLiveEvents`
   - Properly transforms event data
   - Timestamp conversion working (converts to milliseconds)
   - Events properly categorized into Live/Upcoming/Past based on current time

2. **Data Storage** ✓

   - Events cached in AsyncStorage for offline access
   - Proper error handling with try-catch

3. **Event Categorization** ✓
   ```javascript
   const now = Date.now();
   const live = events.filter(
     (event) => event.timeStamp <= now && event.endTimeStamp >= now,
   );
   const upcoming = events.filter((event) => event.timeStamp > now);
   const past = events.filter((event) => event.endTimeStamp < now);
   ```

---

### ⚠️ Issues & Inconsistencies

#### Issue 1: ID Format Mismatch

**Problem**:

- UpdateSportScore.js uses complex ID: `"CricketMatchFinal++ECEvs.CSE"`
- EventsContext.js uses simple ID: `"ECE vs CSE"`
- These don't match!

**Impact**:

- Events may not be found if trying to update using EventsContext data
- Key mismatch in FlatList components

**Fix Required**:

```javascript
// In UpdateSportScore.js, change to:
id: item1.subEventId; // Use same ID as EventsContext
```

---

#### Issue 2: Timestamp Verification

**Check if timestamps are syncing correctly:**

1. **Backend timestamp format** - Verify the API returns proper ISO timestamps or Unix timestamps
2. **Conversion function** working correctly?

   ```javascript
   const getTimestampInMs = (timestamp) => {
     if (typeof timestamp === "string") {
       return new Date(timestamp).getTime(); // ISO string
     }
     if (timestamp < 10000000000) {
       return timestamp * 1000; // Seconds to ms
     }
     return timestamp; // Already in ms
   };
   ```

3. **Test timestamps**: Add console logs to verify times are being compared correctly

---

## How Event Sync Works

### 1. Initial Load (App Start)

```
App Start
  ↓
Events.js mounts → EventsContext.fetchAllLiveEvents()
  ↓
API Call: GET /api/event/getAllLiveEvents
  ↓
Response with events data
  ↓
Transform & categorize into Live/Upcoming/Past
  ↓
Store in state + AsyncStorage cache
  ↓
Render to screen
```

### 2. Pull-to-Refresh

```
User pulls down to refresh
  ↓
onRefresh() called
  ↓
fetchAllLiveEvents() runs again
  ↓
Updates state with fresh data
  ↓
Screen re-renders with new data
```

### 3. Real-time Updates

- **Currently Not Implemented** - Events are fetched once and cached
- To add real-time updates, would need WebSocket or periodic polling

---

## Debugging Steps

### To verify events are syncing correctly:

1. **Check EventsContext Console Logs**:

   ```javascript
   console.log("Raw events data:", data);
   console.log("Current time (ms):", now);
   console.log(
     `Event ${event.id}: start=${event.timeStamp}, end=${event.endTimeStamp}, isLive=${isLive}`,
   );
   ```

2. **Verify Backend API Response**:

   ```
   GET http://your-backend/api/event/getAllLiveEvents
   ```

   Should return:

   ```json
   {
     "events": [
       {
         "eventId": "Cricket",
         "subEvents": [
           {
             "subEventId": "ECE vs CSE",
             "data": {
               "details": {
                 "title": "Cricket Match Final",
                 "timestamp": "2026-01-29T10:00:00Z"
               },
               "points": {
                 "teamA": { "name": "ECE", "points": 50, "bets": 100 },
                 "teamB": { "name": "CSE", "points": 45, "bets": 95 }
               }
             }
           }
         ]
       }
     ]
   }
   ```

3. **Monitor Timestamp Conversion**:
   - Add logs in EventsContext to confirm timestamps convert correctly
   - Verify Date.now() is being used consistently

---

## Recommended Fixes

### Priority 1: Standardize Event IDs

Change UpdateSportScore.js ID format to match EventsContext:

```javascript
// From:
id: item1.data.details.title.split(" ").join("") +
  "++" +
  item1.subEventId.split(" ").join("");

// To:
id: item1.subEventId;
```

### Priority 2: Verify Timestamp Format

- Confirm backend API returns ISO 8601 format timestamps
- Test timestamp conversion with actual backend data

### Priority 3: Add Real-time Sync (Optional)

- Implement periodic polling every 30-60 seconds
- Or add WebSocket connection for live updates

---

## Event Data Flow Diagram

```
Backend Database
    ↓
REST API: /api/event/getAllLiveEvents
    ↓
EventsContext.fetchAllLiveEvents()
    ↓
Transform Data (extract details, teams, scores)
    ↓
Convert Timestamps to milliseconds
    ↓
Categorize into Live/Upcoming/Past
    ↓
Update State: liveEvents, upcomingEvents, pastEvents
    ↓
Cache to AsyncStorage
    ↓
Events.js receives data via context
    ↓
Render to UI via:
    - AllEventsScreen (ALL category)
    - OngoingScreen (Live events)
    - UpcomingScreen (Future events)
    - PastScreen (Completed events)
```

---

## Summary

- **Event ID**: Unique identifier created from `subEventId` (e.g., "ECE vs CSE")
- **Sync Status**: ✓ Working - Events fetch from backend and categorize by timestamp
- **Issue**: Inconsistent ID format between UpdateSportScore.js and EventsContext.js
- **Next Steps**: Standardize ID format and verify timestamp conversion with real backend data
