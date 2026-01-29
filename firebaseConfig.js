import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBlzxVqFqR43umxKrR-61P_L6MO7oun_9s",
  authDomain: "gc-app-2024-4e2f9.firebaseapp.com",
  projectId: "gc-app-2024-4e2f9",
  storageBucket: "gc-app-2024-4e2f9.appspot.com",
  messagingSenderId: "622420835073",
  appId: "1:622420835073:web:8dae459e477677b1273900",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export default app;

export const iosClientId =
  "697006194100-fisjhahjchqhs9m8oojkkpoerg235n05.apps.googleusercontent.com";
export const androidClientId =
  "697006194100-kgmqb5ilusmn0g63huk68qhv4hf5ec0g.apps.googleusercontent.com";
export const webClientId =
  "697006194100-86ulk6vtaf7g9ei4b0kdcs3msk6eim7u.apps.googleusercontent.com";

//ios: 697006194100-fisjhahjchqhs9m8oojkkpoerg235n05.apps.googleusercontent.com
//android: 697006194100-kgmqb5ilusmn0g63huk68qhv4hf5ec0g.apps.googleusercontent.com
