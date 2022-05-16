import React from 'react'
import {Text, View} from 'react-native';
import BottomNavigation from '../../components/BottomNavigation';
import { font1 } from '../../styles/colors';

export default function Recording({navigation}: any) {
  return (
    <View style={{height:'100%'}}><Text style={{color:font1 ,marginTop: 150, textAlign:'center'}}> This will be removed </Text>
    <BottomNavigation navigation={navigation} selected={'R'}/>
      </View>
  )
}
