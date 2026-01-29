// import React from "react";
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   Image,
//   Button,
//   Pressable,
// } from "react-native";
// import { LoginContext } from "../store/LoginContext";
// import { useContext } from "react";
// import Icon from "react-native-vector-icons/MaterialIcons";

// const ModalComponent = ({ modalVisible, setModalVisible }) => {
//   const LoginCtx = useContext(LoginContext);
//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   const handleOverlayClick = () => {
//     closeModal();
//   };

//   const handleModalClick = (event) => {
//     event.stopPropagation();
//   };
//   const logoutHandler = () => {
//     console.log("logout");
//     LoginCtx.logout();
//   };
//   const email = LoginCtx?.user?.email;
//   const name = LoginCtx?.user?.displayName;
//   const image =
//     LoginCtx?.user?.photoURL ||
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8p7GfNOdWUuoaLYF6Ous6cvnUShb3HEDpQg5vXxdgAs50fnyuOyzGmqikWsI4VMk6z24&usqp=CAU";

//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={modalVisible}
//       onRequestClose={closeModal}
//       onDismiss={closeModal}
//     >
//       <TouchableWithoutFeedback onPress={handleOverlayClick}>
//         <View style={styles.modalOverlay}>
//           <TouchableWithoutFeedback onPress={handleModalClick}>
//             <View style={styles.OutermodalContainer}>
//               <View style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                   <TouchableOpacity
//                     style={styles.closeButton}
//                     onPress={closeModal}
//                   >
//                     <View style={styles.name}>
//                       <Text
//                         style={{
//                           color: "#6E7E81",
//                           paddingVertical: 0,
//                           fontSize: 20,
//                         }}
//                       >
//                         {/* Devesh Patodkar */}
//                         {name}
//                       </Text>
//                     </View>
//                     <View>
//                       <Text
//                         style={{
//                           color: "#6E7E81",
//                           fontSize: 20,
//                         }}
//                       >
//                         {/* 21ec01031@iitbbs.ac.in */}
//                         {email}
//                       </Text>
//                     </View>
//                   </TouchableOpacity>
//                 </View>
//                 <View>
//                   <Image
//                     source={{
//                       uri: image,
//                       alt: "Profile Picture",
//                     }}
//                     style={{
//                       width: 60,
//                       height: 60,
//                       borderRadius: 40,
//                     }}
//                   />
//                 </View>
//               </View>
//               <View style={{ alignItems: "center" }}>
//                 <Text
//                   style={{ color: "#6E7E81", fontSize: 18, fontWeight: "500" }}
//                 >
//                   Developed by
//                 </Text>
//                 <Image
//                   source={require("../assets/Neuro.png")}
//                   style={{ width: 200, height: 160, resizeMode: "center" }}
//                 ></Image>
//                 <Text
//                   style={{ color: "#08B09E", fontSize: 25, fontWeight: "bold" }}
//                 >
//                   NEUROMANCERS
//                 </Text>
//               </View>

//               <View style={styles.buttonContainer}>
//                 {/* <Button title="LOGOUT" onPress={logoutHandler}></Button> */}
//                 <Pressable onPress={logoutHandler}>
//                   <View
//                     style={{
//                       backgroundColor: "#000",
//                       padding: 10,
//                       height: "auto",
//                       width: 240,
//                       borderRadius: 31,
//                       marginBottom: 20,
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <Text style={{ color: "#08B09E", fontSize: 25 }}>
//                       LOGOUT
//                     </Text>
//                   </View>
//                 </Pressable>
//               </View>
//             </View>
//           </TouchableWithoutFeedback>
//         </View>
//       </TouchableWithoutFeedback>
//     </Modal>
//   );
// };

// export default ModalComponent;

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     minHeight: "50%",
//     justifyContent: "flex-end",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   OutermodalContainer: {
//     width: "100%",
//     minHeight: "50%",
//     maxHeight: "65%",
//     height: 548,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 20,
//     flexDirection: "column",
//     justifyContent: "space-between",
//   },
//   modalContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   // modalContent: {
//   //   alignItems: "center",
//   // },
//   name: {
//     fontSize: 30,
//     fontWeight: "bold",
//     color: "white",
//   },
//   buttonContainer: {
//     alignItems: "center",
//   },
// });

// ################################## BEFORE ############################

import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Button,
  Pressable,
} from "react-native";
import { LoginContext } from "../store/LoginContext";
import { useContext } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

const ModalComponent = ({ modalVisible, setModalVisible, navigation }) => {
  const LoginCtx = useContext(LoginContext);
  const closeModal = () => {
    setModalVisible(false);
  };

  const handleOverlayClick = () => {
    closeModal();
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };
  const logoutHandler = () => {
    console.log("logout");
    LoginCtx.logout();
  };
  const email = LoginCtx?.user?.email;
  const name = LoginCtx?.user?.displayName;
  const image =
    LoginCtx?.user?.photoURL ||
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8p7GfNOdWUuoaLYF6Ous6cvnUShb3HEDpQg5vXxdgAs50fnyuOyzGmqikWsI4VMk6z24&usqp=CAU";

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
      onDismiss={closeModal}
    >
      <TouchableWithoutFeedback onPress={handleOverlayClick}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={handleModalClick}>
            <View style={styles.OutermodalContainer}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeModal}
                  >
                    <View style={styles.name}>
                      <Text
                        style={{
                          color: "#6E7E81",
                          paddingVertical: 0,
                          fontSize: 20,
                        }}
                      >
                        {/* Devesh Patodkar */}
                        {name}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: "#6E7E81",
                          fontSize: 20,
                        }}
                      >
                        {/* 21ec01031@iitbbs.ac.in */}
                        {email}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View>
                  <Image
                    source={{
                      uri: image,
                      alt: "Profile Picture",
                    }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 40,
                    }}
                  />
                </View>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{ color: "#6E7E81", fontSize: 18, fontWeight: "500" }}
                >
                  Developed by
                </Text>
                <Image
                  source={require("../assets/Neuro.png")}
                  style={{ width: 200, height: 160, resizeMode: "center" }}
                ></Image>
                <Text
                  style={{ color: "#08B09E", fontSize: 25, fontWeight: "bold" }}
                >
                  NEUROMANCERS
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    closeModal();
                    navigation.navigate("Credits");
                  }}
                  style={styles.Credits}
                >
                  <Text
                    style={{
                      color: "#007F87",
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    Developer Credits
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                {/* <Button title="LOGOUT" onPress={logoutHandler}></Button> */}
                <Pressable onPress={logoutHandler}>
                  <View
                    style={{
                      backgroundColor: "#000",
                      padding: 10,
                      height: "auto",
                      width: 240,
                      borderRadius: 31,
                      marginBottom: 20,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "#08B09E", fontSize: 25 }}>
                      LOGOUT
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalComponent;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    minHeight: "50%",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  OutermodalContainer: {
    width: "100%",
    minHeight: "50%",
    maxHeight: "65%",
    height: 548,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  modalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // modalContent: {
  //   alignItems: "center",
  // },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  buttonContainer: {
    alignItems: "center",
  },
});
