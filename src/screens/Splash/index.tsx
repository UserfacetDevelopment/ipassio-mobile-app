import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, StatusBar } from "react-native";


export default function Splash() {
    useEffect(() => {
          setTimeout(() => {
            //DoNothing
          }, 4000);
        }
      ,[]);

  return (
    <View style={styles.container}>
      <StatusBar
    //   hidden={true}
        translucent
        backgroundColor={"#fff"}
        barStyle={"dark-content"}
      />
      <Image
        style={styles.splash_screen_image}
        source={require("@images/splash_screen_logo_anim.gif")}
        resizeMode="contain"
      />
    </View>
  );
}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    splash_screen_image: {
      width: 200,
      height: 69,
    },
})