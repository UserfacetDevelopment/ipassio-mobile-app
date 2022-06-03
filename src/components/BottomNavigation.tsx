import React from 'react';
import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {font1, font2} from '../styles/colors';
import {useSelector} from 'react-redux';
import {userState} from '../reducers/user.slice';
import CustomImage from './CustomImage';
import Config from '../config/Config';

export default function BottomNavigation({navigation, selected}: any) {
  const {userData} = useSelector(userState);

  return (
    <View style={styles.tabStyle}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          {flexBasis: userData.user_type === 'T' ? '20%' : '25%'},
        ]}
        onPress={() => {
          navigation.navigate('Dashboard');
        }}>
        <CustomImage
          style={styles.tabImage}
          uri={
            selected === 'D'
              ? `${Config.media_url}dashboard-active.png`
              : `${Config.media_url}dashboard.png`
          }
        />
        <Text
          style={[
            styles.text,
            {
              color: selected === 'D' ? font1 : font2,
              fontWeight: selected === 'D' ? '600' : '500',
            },
          ]}>
          Dashboard
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Schedules');
        }}
        style={[
          styles.tabButton,
          {flexBasis: userData.user_type === 'T' ? '20%' : '25%'},
        ]}>
        <CustomImage
          style={styles.tabImage}
          uri={
            selected === 'S'
              ? `${Config.media_url}schedule-active.png`
              : `${Config.media_url}schedule.png`
          }
        />

        <Text
          style={[
            styles.text,
            {
              color: selected === 'S' ? font1 : font2,
              fontWeight: selected === 'S' ? '600' : '500',
            },
          ]}>
          Schedule
        </Text>
      </TouchableOpacity>
      {
        userData.user_type === 'T' ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Withdraw');
            }}
            style={[
              styles.tabButton,
              {flexBasis: userData.user_type === 'T' ? '20%' : '25%'},
            ]}>
            <CustomImage
              style={styles.tabImage}
              uri={
                selected === 'W'
                  ? `${Config.media_url}withdraw-active.png`
                  : `${Config.media_url}withdraw.png`
              }
            />

            <Text
              style={[
                styles.text,
                {
                  color: selected === 'W' ? font1 : font2,
                  fontWeight: selected === 'W' ? '600' : '500',
                },
              ]}>
              Withdraw
            </Text>
          </TouchableOpacity>
        ) : null
        //      <TouchableOpacity onPress={()=>{navigation.navigate('Recording')}}  style={[styles.tabButton]}>
        //      <CustomImage
        //       style={styles.tabImage}
        //       uri={
        //         selected === 'R'
        //           ? `${Config.media_url}recording-active.png`
        //           : `${Config.media_url}recording.png`
        //       }
        //     />
        //          <Text style={[styles.text,{
        //       color: selected === 'R' ? font1 : font2,
        //       fontWeight: selected === 'R' ? '600' : '500',
        //     }]}>Recording</Text>
        //  </TouchableOpacity>
      }
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Transactions');
        }}
        style={[
          styles.tabButton,
          {flexBasis: userData.user_type === 'T' ? '20%' : '25%'},
        ]}>
        <CustomImage
          style={styles.tabImage}
          uri={
            selected === 'T'
              ? `${Config.media_url}transactions-active.png`
              : `${Config.media_url}transactions.png`
          }
        />

        <Text
          style={[
            styles.text,
            {
              color: selected === 'T' ? font1 : font2,
              fontWeight: selected === 'T' ? '600' : '500',
            },
          ]}>
          Transactions
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('More');
        }}
        style={[
          styles.tabButton,
          {flexBasis: userData.user_type === 'T' ? '20%' : '25%'},
        ]}>
        <CustomImage
          style={styles.tabImage}
          uri={
            selected === 'M'
              ? `${Config.media_url}more-active.png`
              : `${Config.media_url}more.png`
          }
        />

        <Text
          style={[
            styles.text,
            {
              color: selected === 'M' ? font1 : font2,
              fontWeight: selected === 'M' ? '600' : '500',
            },
          ]}>
          More
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabImage: {
    width: 24,
    height: 24,
  },
  text: {
    fontSize: 10,
  },
  tabStyle: {
    shadowColor: 'rgba(40, 47, 54)',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.16,
    elevation: 8,
    shadowRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    height: Platform.OS === 'android' ? 64 : 72,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
  },
  tabButton: {
    // width:'25%',
    // flexBasis:'20%',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 12 : 0,
  },
});
