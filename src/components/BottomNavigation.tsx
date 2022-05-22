import React from 'react'
import {View, Text, StyleSheet, Image, Platform} from 'react-native'
import { TouchableOpacity } from 'react-native'
import { font1 } from '../styles/colors'
import {useSelector} from 'react-redux'
import {userState} from '../reducers/user.slice'
import CustomImage from './CustomImage'
import Config from '../config/Config'

export default function BottomNavigation({navigation, selected}: any) {

 const {userData} = useSelector(userState);
 

  return (
    <View style={styles.tabStyle}>
        <TouchableOpacity style={[styles.tabButton, {flexBasis: userData.user_type === 'T' ? '20%' : '25%'}]} onPress={()=>{navigation.navigate('Dashboard') }}>
            <CustomImage style={styles.tabImage} uri={selected==='D' ? `${Config.media_url}dashboard-active.png` : `${Config.media_url}dashboard.png`}/>
            {/* <Image style={styles.tabImage} source={selected==='D' ? require('@images/dashboard-active.png') : require('@images/dashboard.png')}/> */}
                <Text style={styles.text}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{navigation.navigate('Schedules')}}  style={[styles.tabButton, {flexBasis: userData.user_type === 'T' ? '20%' : '25%'}]}>
                        <CustomImage style={styles.tabImage} uri={selected==='S' ? `${Config.media_url}schedule-active.png` : `${Config.media_url}schedule.png`}/>

            {/* <Image style={styles.tabImage} source={selected==='S' ?require('@images/schedule-active.png') : require('@images/schedule.png')}/> */}
                <Text style={styles.text}>Schedule</Text>
        </TouchableOpacity>
        {userData.user_type==='T' ? 
        <TouchableOpacity onPress={()=>{navigation.navigate('Withdraw')}}  style={[styles.tabButton, {flexBasis: userData.user_type === 'T' ? '20%' : '25%'}]}>
                        <CustomImage style={styles.tabImage} uri={selected==='W' ? `${Config.media_url}withdraw-active.png` : `${Config.media_url}withdraw.png`}/>

            {/* <Image style={styles.tabImage} source={selected==='W' ?require('@images/withdraw-active.png') : require('@images/withdraw.png')}/> */}
                <Text style={styles.text}>Withdraw</Text>
        </TouchableOpacity> : null
    //      <TouchableOpacity onPress={()=>{navigation.navigate('Recording')}}  style={[styles.tabButton, {flexBasis: userData.user_type === 'T' ? '20%' : '25%'}]}>
    //      <Image style={styles.tabImage} source={selected==='R' ?require('@images/recording-active.png') : require('@images/recording.png')}/>
    //          <Text style={styles.text}>Recording</Text>
    //  </TouchableOpacity>
     }
        <TouchableOpacity  onPress={()=>{navigation.navigate('Transactions') }} style={[styles.tabButton, {flexBasis: userData.user_type === 'T' ? '20%' : '25%'}]}>
                        <CustomImage style={styles.tabImage} uri={selected==='T' ? `${Config.media_url}transactions-active.png` : `${Config.media_url}transactions.png`}/>

            {/* <Image style={styles.tabImage} source={selected==='T' ? require('@images/transactions-active.png'):require('@images/transactions.png')}/> */}
                <Text style={styles.text}>Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{navigation.navigate('More') }} style={[styles.tabButton, {flexBasis: userData.user_type === 'T' ? '20%' : '25%'}]}>
                        <CustomImage style={styles.tabImage} uri={selected==='M' ? `${Config.media_url}more-active.png` : `${Config.media_url}more.png`}/>

            {/* <Image style={styles.tabImage} source={selected==='M' ? require('@images/more-active.png') : require('@images/more.png')}/> */}
                <Text style={styles.text}>More</Text>
        </TouchableOpacity>


    </View>
  )
}

const styles= StyleSheet.create({
    tabImage:{
        width:24,
        height:24,
    },
    text:{
        fontSize:10,
        color:font1,
    },
    tabStyle:{
    shadowColor: 'rgba(40, 47, 54)', 
    shadowOffset:{
        width:0,
        height:-10,
    },
    shadowOpacity:0.16,
    elevation:8,
    shadowRadius: 30,
    flexDirection:'row',
    alignItems:'center', height: Platform.OS === 'android' ?  64 : 72, position:'absolute', bottom:0, backgroundColor:'#fff', width:'100%' },
    tabButton:{ alignItems:'center', marginBottom: Platform.OS === 'ios' ? 12 : 0},
    
})