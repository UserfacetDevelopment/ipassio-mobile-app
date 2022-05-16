import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, StatusBar } from 'react-native';
import { Icon } from "native-base";
import config from "../config/Config";
import style from "../styles/style";
import {brandColor} from '../styles/colors';

// create a component
const NoData = ({message}) => {

        return (
            <View style={[styles.wrapper, style.styles.shadow]}>
                <Image source={require("@images/not_found_icon.png")} style={{width: 40, height: 40}} />
                <Text style={{color: brandColor, fontSize: 14}}>{message}</Text>
            </View>
        ) 
}

const styles = StyleSheet.create({
    wrapper : {
        marginHorizontal: 24,
        zIndex:999,
        borderRadius: 10,
        marginTop: 9,
        marginBottom:9,
        backgroundColor: "white",
        flex: 1,
        minHeight:  100, 
        minWidth: 300,
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 10
    }
});

//make this component available to the app
export default NoData;
