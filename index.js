/**
 * @format
 */
 //import 'react-native-gesture-handler';
 import React,{useEffect} from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

// useEffect(()=>{
// Register background handler for push notifications
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage.data.type);
    // if(remoteMessage.data.type === 'attendance'){
    // dispatch(setNavigation("Attendance"));
    // }
  });

//   messaging()
//   .getIsHeadless()
//   .then(isHeadless => {
//     // do sth with isHeadless
//   });



//   function HeadlessCheck({ isHeadless }) {
//     if (isHeadless) {
//       // App has been launched in the background by iOS, ignore
//       return null;
//     }
  
//     return <App />;
//   }
AppRegistry.registerComponent(appName, () => App);
