import React from 'react';
import {Text, View, 
  // Image, 
  StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {userState, logoutUser} from '../../reducers/user.slice';
import {
  appBackground,
  background4,
  font1,
  font2,
  secondaryColor,
} from '../../styles/colors';
import messaging from '@react-native-firebase/messaging';
// import Logout from '../../assets/images/logout.svg';
// import Drop from '../../assets/images/Drop.svg';
// import Recordings from '../../assets/images/recordings.svg';
// import CreatedCourses from '../../assets/images/created-courses.svg';
// import Student from '../../assets/images/student.svg';
// import Teacher from '../../assets/images/teacher.svg';
import {useAppDispatch} from '../../app/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from '../../components/BottomNavigation';
import Helper from '../../utils/helperMethods';
import Config from '../../config/Config';
import CustomImage from '../../components/CustomImage';
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';

export default function More({navigation}: any) {
  const {userData, isLoggedIn} = useSelector(userState);
  console.log(userData);
  const dispatch = useAppDispatch();

  const doLogout = async () => {
    await messaging().deleteToken();
    // await GoogleSignin.revokeAccess();
    await AsyncStorage.removeItem('USERDATA');
    await AsyncStorage.removeItem('USERDEVICETOKEN');
    await AsyncStorage.removeItem('USER_NOT_FIRST');

    dispatch(logoutUser());
    navigation.navigate('Browse');
  };

  return (
    <>
      <View style={{backgroundColor: '#fff'}}>
        <View>
          <CustomImage
            style={{width: '100%', height: 218}}
            uri={`${Config.media_url}more-bg.png`}
          />
          <View
            style={{
              position: 'absolute',
              top: 64,
              alignSelf: 'center',
              zIndex: 9,
            }}>
            {isLoggedIn ? (
              <CustomImage
                style={{height: 130, width: 130, borderRadius: 230}}
                uri={userData.user_media.profile_pic}
              />
            ) : null}
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            top: 218,
            zIndex: 10,
            backgroundColor: '#fff',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: 24,
            // borderWidth:1
          }}>
          <Text style={styles.userInfo}>
            {userData.first_name} {userData.last_name}
          </Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          {isLoggedIn ? (
            userData.user_type === 'T' ? (
              <View style={styles.userDesignationWrapper}>
                 <CustomImage
                    height={17}
                    width={15}
                    uri={`${Config.media_url}teacher.svg`
                    }
                  />
                <Text style={styles.userDesignation}>Teacher</Text>
              </View>
            ) : (
              <View style={styles.userDesignationWrapper}>
                <CustomImage
                    height={17}
                    width={15}
                    uri={`${Config.media_url}student.svg`
                    }
                  />
                <Text style={styles.userDesignation}>Student</Text>
              </View>
            )
          ) : null}
        </View>
        <View
          style={{
            backgroundColor: background4,
            top: 100,
            padding: 16,
            height: '100%',
          }}>
          {isLoggedIn && userData.user_type === 'T' ? (
          <>
            {/* <TouchableOpacity  style={styles.listItemWrapper}>
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
            </TouchableOpacity> */}

            {/* <TouchableOpacity onPress={()=> navigation.navigate('Recording')} style={styles.listItemWrapper}>
              <View style={styles.listItem}>
                <View style={{marginRight: 16}}>
                <CustomImage
                    height={24}
                    width={24}
                    uri={`${Config.media_url}recordings.svg`
                    }
                  />
                </View>
                <View>
                  <Text style={styles.header}>Recordings</Text>
                  <Text style={styles.subheader}>
                    Manage your ipassio account
                  </Text>
                </View>
              </View>
              <View>
              <CustomImage
                    height={16}
                    width={16}
                    uri={`${Config.media_url}drop.svg`
                    }
                  />
              </View>
            </TouchableOpacity> */}
          </>
        ) : null}
          {isLoggedIn ? (
            <TouchableOpacity
              onPress={() => doLogout()}
              style={styles.listItemWrapper}>
              <View style={styles.listItem}>
                <View style={{marginRight: 16}}>
                <CustomImage
                    height={24}
                    width={24}
                    uri={`${Config.media_url}logout.svg`
                    }
                  />
                </View>
                <View>
                  <Text style={styles.header}>Logout</Text>
                  <Text style={styles.subheader}>Security</Text>
                </View>
              </View>
              <View>
              <CustomImage
                    height={16}
                    width={16}
                    uri={`${Config.media_url}drop.svg`
                    }
                  />
              </View>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('StaticPage', {
                nid: 'privacy_policy',
                web_title: 'Privacy Policy',
              });
            }}
            style={{marginVertical: 24}}>
            <Text style={styles.extras}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('StaticPage', {
                nid: 'terms_of_service',
                web_title: 'Terms of Service',
              });
            }}>
            <Text style={styles.extras}>Terms of Service</Text>
          </TouchableOpacity>
          <View style={{top:200,zIndex:20}}>
            <Text style={styles.version}>ipassio.com</Text>
            <Text style={styles.version}>Version: </Text>
          </View>
        </View>
      </View>
      <BottomNavigation navigation={navigation} selected={'M'} />
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
  header: {fontSize: 16, color: font1, 
    fontWeight:'500',
    fontFamily:Helper.switchFont('medium')
    // lineHeight: 21
  },
  subheader: {fontSize: 14, color: font2, lineHeight: 18,
    fontFamily:Helper.switchFont('medium')},
  listItem: {flexDirection: 'row', alignItems: 'center'},
  userInfo: {
    textAlign: 'center',
    color: font1,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 25,
    textTransform: 'capitalize',
    fontFamily:Helper.switchFont('bold')
  },
  userDesignation: {
    textAlign: 'center',
    color: font1,
    fontSize: 14,
    fontWeight: '600',
    // lineHeight: 19,
    marginLeft: 6,
    fontFamily:Helper.switchFont('semibold')
  },
  userEmail: {
    textAlign: 'center',
    color: font2,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 8,
    fontFamily:Helper.switchFont('medium')
  },
  extras: {
    color: secondaryColor,
    fontSize: 14,
    fontWeight: '500',
    fontFamily:Helper.switchFont('medium'),
    textDecorationColor: secondaryColor,
    textDecorationLine: 'underline',
    // lineHeight: 40,
  },
  userDesignationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  version:{
    fontSize:12,
    color:font2,
    fontWeight:'400',
    lineHeight:20,
    fontFamily:Helper.switchFont('regular')
  }
});
