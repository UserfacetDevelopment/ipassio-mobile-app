import React,{useState} from 'react'
import {View, TouchableOpacity, Text, Linking, StyleSheet, Platform} from 'react-native';
import config from '../config/Config';
import { font1, font2 } from '../styles/colors';
import Helper from '../utils/helperMethods';

export default function LoginNavigation({navigation}) {
    const [pressed, setPressed] = useState('');
  return (
    <View style={styles.loginWrapper}>
    <TouchableOpacity activeOpacity={1} onPressIn={()=>{setPressed('I')}}  onPressOut={()=>{setPressed('')}} onPress={()=>navigation.navigate('Login')} style={[styles.button,{borderRightWidth:1, borderRightColor:'#313b44' , backgroundColor:pressed === 'I'? '#313b44' : font1}]}><Text style={styles.buttonText}> Sign in</Text></TouchableOpacity> 
    <TouchableOpacity activeOpacity={1} onPressIn={()=>{setPressed('U')}}  onPressOut={()=>{setPressed('')}} onPress={()=>Linking.openURL(config.FrontendBaseURL)} style={[styles.button,{backgroundColor:pressed === 'U' ? '#313b44' : font1}]}><Text style={styles.buttonText}>Sign up</Text></TouchableOpacity>
  </View>
  )
}

const styles= StyleSheet.create({
    loginWrapper:{flexDirection:'row',position:'absolute', bottom:0,  backgroundColor:'#fff', justifyContent:'center', alignItems:'center',},
    button:{width:'50%', alignItems:'center', backgroundColor:font1, paddingTop:16, paddingBottom: Platform.OS === 'android' ? 16 : 32},
    buttonText:{fontSize:14, fontWeight:'700', fontFamily:Helper.switchFont('bold'), color:'#fff'},
})
