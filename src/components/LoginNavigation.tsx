import React from 'react'
import {View, TouchableOpacity, Text, Linking, StyleSheet} from 'react-native';
import config from '../config/Config';
import { font1 } from '../styles/colors';

export default function LoginNavigation({navigation}) {
  return (
    <View style={styles.loginWrapper}>
    <TouchableOpacity  onPress={()=>navigation.navigate('Login')} style={styles.button}><Text style={styles.buttonText}> Sign in</Text></TouchableOpacity> 
    <TouchableOpacity onPress={()=>Linking.openURL(config.FrontendBaseURL)} style={styles.button}><Text style={styles.buttonText}>Sign up</Text></TouchableOpacity>
  </View>
  )
}

const styles= StyleSheet.create({
    loginWrapper:{flexDirection:'row',position:'absolute', bottom:0,  backgroundColor:'#fff', justifyContent:'center', alignItems:'center'},
    button:{width:'50%', alignItems:'center', backgroundColor:font1},
    buttonText:{fontSize:16, color:'#fff', padding:20, paddingVertical:35},
})
