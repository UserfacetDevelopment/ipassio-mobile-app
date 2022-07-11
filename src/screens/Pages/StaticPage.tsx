import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";
import PageLoader from "../../components/PageLoader";
import config from "../../config/Config";
//import CSB from "@components/Elements/CustomStatusBar.js";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";
import { userState } from "../../reducers/user.slice";
import Helper from "../../utils/helperMethods";
import HeaderInner from "../../components/HeaderInner";

const StaticPage = ({navigation, route}) => {

const {userData} = useSelector(userState);
  const nid = route.params?.nid;
  const web_title = route.params?.web_title;
  const [htmlContent, setHtmlContent] = useState('');
  const [showWebView, setShowWebView] = useState(false)
const [isLoading, setIdLoading] = useState(false);
  let scrollY = new Animated.Value(0.01);
    let changingHeight = new Animated.Value(160);
    let titleLeft = new Animated.Value(0.01);
    let titleSize = new Animated.Value(28);
    let titleTop = new Animated.Value(24);
    let iconTop = new Animated.Value(36);

    useEffect(()=>{
        setTimeout(() => {
            setShowWebView(true);
            // this.setState({ isLoading: false });
          }, 1000);
    },[])

    return (
        <View style={styles.container}>
          {/* <CSB type={"inside"} /> */}
          {isLoading ? (
            <View
              style={{
                flex: 1,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#fafafa",
              }}
            >
              <PageLoader/>
            </View>
          ) : null}
  
          {/* <View
            style={{
              backgroundColor: "rgb(232, 67, 53)",
              padding: 16,
              flexDirection: "row",
              flex: 1,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 105,
              alignContent: "center",
              zIndex: 999,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MoreNav")
              }
              style={{ zIndex: 9999, marginTop: 40 }}
              transparent
            >
              <Image
                source={require("@images/left_arrow.png")}
                style={{
                  width: 23,
                  height: 18,
                  alignItems: "center",
                }}
              />
            </TouchableOpacity>
  
            <View style={{ flex: 1, marginTop: 30, marginLeft: 18 }}>
              <Text style={styles.innerHeaderTitle}>{web_title}</Text>
            </View>
          </View> */}
          <View style={{zIndex: 999}}>
          <HeaderInner
          type={'findCourse'}
          back={true}
          logo={false}
          title={web_title}
          navigation={navigation}
          backroute={"MoreNav"}
          />
          </View>
  
          <View style={{ flex: 1, marginTop: 20 }}>
            {showWebView && nid === "privacy_policy" && (
              <WebView
                source={{ uri: "https://www.ipassio.com/privacy-policy" }}
                style={[
                  { flex: 1, paddingHorizontal: 16 },
                  isLoading ? { height: 0 } : { height: 0 },
                ]}
              />
            )}
            {showWebView && nid === "terms_of_service" && (
              <WebView
                source={{ uri: "https://www.ipassio.com/terms-of-service" }}
                style={[
                  { flex: 1, paddingHorizontal: 16},
                  isLoading ? { height: 0 } : { height: 0 },
                ]}
              />
            )}
          </View>
        </View>
      );

  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  innerHeaderTitle: {
    color: "rgb(255, 255, 255)",
    fontSize: 24,
    fontFamily: Helper.switchFont("medium"),
  },
});

export default StaticPage
