import { any } from 'prop-types';
import React,{useState} from 'react'
import {View, TouchableOpacity, Text, Linking, StyleSheet, Platform} from 'react-native';
import config from '../config/Config';
import { font1, font2, lineColor } from '../styles/colors';
import StyleCSS from '../styles/style';
import Helper from '../utils/helperMethods';

interface  LoginNavInterface{
  navigation: any;
}

export default function LoginNavigation({navigation}: LoginNavInterface) {
    const [pressed, setPressed] = useState('');
  return (
    <View style={[styles.loginWrapper]}>
    <TouchableOpacity activeOpacity={1} onPressIn={()=>{setPressed('I')}}  onPressOut={()=>{setPressed('')}} onPress={()=>navigation.navigate('Login')} style={[styles.button,{borderRightWidth:1, borderRightColor:lineColor }]}><Text style={styles.buttonText}> Log In</Text></TouchableOpacity> 
    <TouchableOpacity activeOpacity={1} onPressIn={()=>{setPressed('U')}}  onPressOut={()=>{setPressed('')}} onPress={()=>navigation.navigate('Signup')} style={[styles.button]}><Text style={styles.buttonText}>Sign up</Text></TouchableOpacity>
  </View>
  )
}

const styles= StyleSheet.create({
    loginWrapper:{flexDirection:'row',position:'absolute', bottom:0,  backgroundColor:'#fff', justifyContent:'center', alignItems:'center',shadowColor: 'rgba(40, 47, 54)',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.16,
    elevation: 8,
    shadowRadius: 30,},
    button:{width:'50%', alignItems:'center', backgroundColor:'#fff', paddingTop:16, paddingBottom: Platform.OS === 'android' ? 16 : 32},
    buttonText:{fontSize:14, fontWeight:'700', fontFamily:Helper.switchFont('bold'), color:font1},
})
