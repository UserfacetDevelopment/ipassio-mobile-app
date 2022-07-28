import React from 'react';
import {View, Text} from 'react-native';
import {WebView} from 'react-native-webview';
import Config from '../../config/Config';

export default function VideoConfWebview({navigation, route}) {
  console.log(Config.FrontendURL + Config.videoURL + route.params?.token);
  return (
    <WebView
      source={{uri: Config.FrontendURL + Config.videoURL + route.params?.token}}
      style={[{flex: 1}]}
    />
  );
}
