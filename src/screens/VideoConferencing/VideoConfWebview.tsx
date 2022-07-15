import React from 'react'
import {View, Text} from 'react-native'
import { WebView } from "react-native-webview";

export default function VideoConfWebview({navigation, route}) {
  return (
    <WebView
                source={{ uri: "https://www.ipassio.com/video/"+route.params?.token }}
                style={[
                  { flex: 1 },
                  
                ]}
              />
  )
}
