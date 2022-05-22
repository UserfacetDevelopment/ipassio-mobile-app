import React from 'react';
import { useSelector } from 'react-redux';
import { View, Image, StyleSheet, Text, StatusBar } from 'react-native';
import { Bubbles} from 'react-native-loader';  
import config from "../config/Config";
import {brandColor} from '../styles/colors';
import {loaderState } from '../reducers/loader.slice';
import CustomImage from './CustomImage';
import Config from '../config/Config';

export default function PageLoader() {
  //const {pageLoading} = useSelector(loaderState)
  return(
    <View style={/*pageLoading ?*/ styles.show_page /*: styles.hide_page*/}>
    <StatusBar backgroundColor = {brandColor} barStyle = "light-content" />
    {/* {pageLoading ? */}
    <CustomImage style = {styles.image} uri={`${Config.media_url}page_loader.gif`}/>
    {/* <Image style = {styles.image} source = { require('@images/page_loader.gif') } /> */}
     {/* : null */}
    {/* } */}

    {/* {pageLoading ? */}
    <Text style={styles.loaderText}>Please wait..</Text>
     {/* : null */}
    {/* } */}

    {/* {pageLoading && 0?
    <Bubbles size={7} color={brandColor} />
     : null 
    }   */}
    
</View>
  )
}
const styles = StyleSheet.create({
  show_page: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: "#fff"
  },
  hide_page: {
      height: 0
  },
  loaderText:{
    marginTop: 20, 
    marginBottom: 20,  
    fontSize: 16,
    color: 'rgb(44, 54, 65)',
  },
  image:{
    width:106, 
    height: 178, 
    marginTop: -150
  }
});