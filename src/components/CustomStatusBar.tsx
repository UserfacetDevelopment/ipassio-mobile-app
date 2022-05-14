import React from 'react';
import {StatusBar} from 'react-native';


export default function CustomStatusBar({type}:any) {
    return (
        <StatusBar translucent backgroundColor = {type == "modal" ? "#aaa" : "transparent"} barStyle = {type == "modal" ? "dark-content" : "light-content"} />
      );
}
