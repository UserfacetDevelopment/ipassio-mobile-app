// import React, {useEffect} from "react";
// import PushNotificationIOS from "@react-native-community/push-notification-ios";
// import PushNotification, {Importance} from "react-native-push-notification";
// import messaging from '@react-native-firebase/messaging';

// // var PushNotification = require("react-native-push-notification");
// const PushController = () => {


//   // async function requestUserPermission() {
//   //   const authStatus = await messaging().requestPermission();
//   //   const enabled =
//   //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//   //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
//   //   if (enabled) {
//   //     console.log('Authorization status:', authStatus);
//   //   }
//   // }


//   // async function checkPermission() {
//   //   const enabled = await messaging().hasPermission();
//   //   if (enabled) {
//   //     console.log("Push Notifications are enabled.");
//   //     let fcmTokens = await AsyncStorage.getItem("USERDEVICETOKEN");
//   //     console.log(fcmTokens);
//   //     getToken();
//   //   } else {
//   //     console.log("Push Notifications not enabled.");
//   //     requestPermission();
//   //   }
//   // }

//   // //

//   // useEffect(() => {
//   //   const unsubscribe = messaging().onMessage(async remoteMessage => {
//   //     const owner = JSON.parse(remoteMessage.data.owner);
//   //     const user = JSON.parse(remoteMessage.data.user);
//   //     const picture = JSON.parse(remoteMessage.data.picture);

//   //     console.log(`The user "${user.name}" liked your picture "${picture.name}"`);
//   //   });

//   //   return unsubscribe;
//   // }, []);

  

//     useEffect(()=>{
//       PushNotification.createChannel(
//         {
//           channelId: "ipassio", // (required)
//           channelName: "ipassio", // (required)
//           channelDescription: "ipassio", // (optional) default: undefined.
//           playSound: true, // (optional) default: true
//           soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
//           importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
//           vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
//         },
//         (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
//       );

//         PushNotification.configure({
//             // (optional) Called when Token is generated (iOS and Android)
//             onRegister: function(token) {
//               console.log("TOKEN:", token);
//             },
          
//             // (required) Called when a remote or local notification is opened or received
//             onNotification: function(notification) {
//               console.log("NOTIFICATION:", notification);
          
//               // process the notification here
          
//               // required on iOS only 
//               notification.finish(PushNotificationIOS.FetchResult.NoData);
//             },
//             // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
//   onAction: function (notification) {
//     console.log("ACTION:", notification.action);
//     console.log("NOTIFICATION:", notification);

//     // process the action
//   },

//   // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
//   onRegistrationError: function(err) {
//     console.error(err.message, err);
//   },
//             // Android only
//             //senderID: "1090501687137",
//             // iOS only
//             permissions: {
//               alert: true,
//               badge: true,
//               sound: true
//             },
//             popInitialNotification: true,
//             requestPermissions: true
//           });
//     }, []);


// return null;

// }

// export default PushController;