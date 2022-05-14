import React from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
// @ts-ignore
import Background from '../../assets/images/more-bg.svg';
import {userState, logoutUser} from '../../reducers/user.slice';
import {appBackground, font1, font2, secondaryColor} from '../../styles/colors';
// @ts-ignore
import Logout from '../../assets/images/logout.svg';
// @ts-ignore
import Drop from '../../assets/images/Drop.svg';
// @ts-ignore
import Recordings from '../../assets/images/recordings.svg';
// @ts-ignore
import CreatedCourses from '../../assets/images/created-courses.svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
// @ts-ignore
import Student from '../../assets/images/student.svg';
// @ts-ignore
import Teacher from '../../assets/images/teacher.svg';
import { useAppDispatch } from '../../app/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from '../../components/BottomNavigation';

export default function More({navigation}) {
  const {userData, isLoggedIn} = useSelector(userState);
  console.log(userData);
  const dispatch = useAppDispatch();

  const doLogout=async()=>{
    await AsyncStorage.removeItem('USERDATA');
    await AsyncStorage.removeItem('USERDEVICETOKEN');
    await AsyncStorage.removeItem('USER_NOT_FIRST');
    
    dispatch(logoutUser());
    navigation.navigate('FindCourses');
  }

  return (
    <>
    <View style={{backgroundColor: '#fff'}}>
      <View>
        <Image
          style={{width: '100%'}}
          source={require('@images/more-bg.png')}
        />
        <View
          style={{
            position: 'absolute',
            top: 64,
            alignSelf: 'center',
            zIndex: 99999,
          }}>
          {isLoggedIn ? (
            <Image
              style={{height: 130, width: 130, borderRadius: 230}}
              source={{uri: userData.user_media.profile_pic}}
            />
          ) : null}
        </View>
      </View>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingBottom: 25,
        }}>
        <Text style={styles.userInfo}>
          {userData.first_name} {userData.last_name}
        </Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
        {isLoggedIn ? (
          userData.user_type === 'T' ? (
            <View  style={styles.userDesignationWrapper}>
              <Teacher/>
              <Text style={styles.userDesignation}>Teacher</Text>
            </View>
          ) : (
            <View style={styles.userDesignationWrapper}>
              <Student/>
            <Text style={{textAlign: 'center'}}>Student</Text>
            </View>
          )
        ) : null}
      </View>
      <View
        style={{backgroundColor: '#F3F5F8', padding: 16, height: '100%'}}>
        {isLoggedIn && userData.user_type === 'T' ? (
          <>
            <TouchableOpacity  style={styles.listItemWrapper}>
              <View style={styles.listItem}>
                <View style={{marginRight: 16}}>
                  <CreatedCourses />
                </View>
                <View>
                  <Text style={styles.header}>Created Courses</Text>
                  <Text style={styles.subheader}>List of created courses</Text>
                </View>
              </View>
              <View>
                <Drop />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.listItemWrapper}>
              <View style={styles.listItem}>
                <View style={{marginRight: 16}}>
                  <Recordings />
                </View>
                <View>
                  <Text style={styles.header}>Recordings</Text>
                  <Text style={styles.subheader}>
                    Manage your ipassio account
                  </Text>
                </View>
              </View>
              <View>
                <Drop />
              </View>
            </TouchableOpacity>
          </>
        ) : null}
        {isLoggedIn ? <TouchableOpacity onPress={() => doLogout()} style={styles.listItemWrapper}>
          <View style={styles.listItem}>
            <View style={{marginRight: 16}}>
              <Logout />
            </View>
            <View>
              <Text style={styles.header}>Logout</Text>
              <Text style={styles.subheader}>Security</Text>
            </View>
          </View>
          <View>
            <Drop />
          </View>
        </TouchableOpacity>: null}
        <TouchableOpacity onPress={() => {
                
                navigation.navigate("StaticPage", {
                  nid: "privacy_policy",
                  web_title: "Privacy Policy",
                });
              }} style={{marginVertical:16}}>
          <Text style={styles.extras}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        onPress={()=> {navigation.navigate("StaticPage", {
                  nid: "terms_of_service",
                  web_title: "Terms of Service",
                })}}>
          <Text style={styles.extras}>Terms of Service</Text>
        </TouchableOpacity>
      </View>
      
    </View>
    <BottomNavigation navigation={navigation} />
    </>
  );
}

const styles = StyleSheet.create({
  listItemWrapper: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  header: {fontSize: 18, color: font1, lineHeight: 21},
  subheader: {fontSize: 16, color: font2, lineHeight: 18},
  listItem: {flexDirection: 'row', alignItems: 'center'},
  userInfo: {
    textAlign: 'center',
    color: font1,
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 28,
  },
  userDesignation: {
    textAlign: 'center',
    color: font1,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 19,
    marginLeft:6
  },
  userEmail: {
    textAlign: 'center',
    color: font2,
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 21,
    marginVertical: 8,
  },
  extras:{color:secondaryColor, fontSize:14, fontWeight:'500', textDecorationColor:secondaryColor, textDecorationLine:'underline', lineHeight: 40},
  userDesignationWrapper:{
    flexDirection:'row',
    alignItems:'center',
    alignSelf:'center'
  }
});
