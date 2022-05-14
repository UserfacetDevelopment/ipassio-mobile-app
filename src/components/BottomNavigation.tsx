import React from 'react'
import {View, Text, StyleSheet, Image} from 'react-native'
import { TouchableOpacity } from 'react-native'
import { font1 } from '../styles/colors'
import {useSelector} from 'react-redux'
import {userState} from '../reducers/user.slice'

export default function BottomNavigation({navigation, selected}: any) {

    const {userData} = useSelector(userState)
  return (
    <View style={{flexDirection:'row', alignItems:'center', height:64, position:'absolute', bottom:0, backgroundColor:'#fff', width:'100%', }}>
        <TouchableOpacity style={{flexBasis:'25%', alignItems:'center'}} onPress={()=>{navigation.navigate('Dashboard') }}>
            <Image style={styles.tabImage} source={selected==='D' ? require('@images/dashboard-active.png') : require('@images/dashboard.png')}/>
                <Text style={styles.text}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{navigation.navigate('Schedules')}}  style={{flexBasis:'25%',alignItems:'center'}}>
            <Image style={styles.tabImage} source={selected==='S' ?require('@images/schedule-active.png') : require('@images/schedule.png')}/>
                <Text style={styles.text}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{navigation.navigate('Transactions') }} style={{flexBasis:'25%',alignItems:'center'}}>
            <Image style={styles.tabImage} source={selected==='T' ? require('@images/transactions-active.png'):require('@images/transactions.png')}/>
                <Text style={styles.text}>Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{navigation.navigate('More') }} style={{flexBasis:'25%',alignItems:'center'}}>
            <Image style={styles.tabImage} source={require('@images/more.png')}/>
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


    }


})