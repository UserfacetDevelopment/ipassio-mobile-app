import React from 'react'
import {View, TouchableOpacity, Text, Linking, StyleSheet, Platform} from 'react-native';
import config from '../config/Config';
import { font1, font2 } from '../styles/colors';
import Helper from '../utils/helperMethods';

export default function LoginNavigation({navigation}) {
  return (
    <View style={styles.loginWrapper}>
    <TouchableOpacity  onPress={()=>navigation.navigate('Login')} style={[styles.button,{borderRightWidth:1, borderRightColor:'#313b44'}]}><Text style={styles.buttonText}> Sign in</Text></TouchableOpacity> 
    <TouchableOpacity onPress={()=>Linking.openURL(config.FrontendBaseURL)} style={styles.button}><Text style={styles.buttonText}>Sign up</Text></TouchableOpacity>
  </View>
  )
}

const styles= StyleSheet.create({
    loginWrapper:{flexDirection:'row',position:'absolute', bottom:0,  backgroundColor:'#fff', justifyContent:'center', alignItems:'center'},
    button:{width:'50%', alignItems:'center', backgroundColor:font1, paddingTop:16, paddingBottom: Platform.OS === 'android' ? 16 : 32},
    buttonText:{fontSize:14, fontWeight:'700', fontFamily:Helper.switchFont('bold'), color:'#fff'},
})
