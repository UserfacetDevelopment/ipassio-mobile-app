import React, {useState} from 'react';
import {
  StatusBar,
  View,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../app/store';
import {StackActions} from '@react-navigation/native';
import {masquerade, getSession, userState} from '../reducers/user.slice';
import Helper from '../utils/helperMethods';
import {useNavigation} from '@react-navigation/native';
import config from '../config/Config';
import {brandColor} from '../styles/colors';
// import Back from '../assets/images/back.svg';
// import Courses from '../assets/images/Courses.svg';
// import Browse from '../assets/images/Browse.svg';
import StyleCSS from '../styles/style';
import {border} from 'native-base/lib/typescript/theme/styled-system';
// import CoursesActive from '../assets/images/courses-active'
// import BrowseActive from '../assets/images/browse-active'
// import Logo from  '../assets/images/logo.svg'
import {useSelector} from 'react-redux';
import CustomImage from './CustomImage';

const width = Dimensions.get('screen').width;
const HeaderInner = (props: any) => {
  const dispatch = useAppDispatch();
  const {userData} = useSelector(userState);
  const [csrfToken, setCsrfToken] = useState('');
  const navigation = useNavigation();
  const doUnMasquerade = () => {
    AsyncStorage.getItem('AccessToken', (err, res1) => {
      if (res1) {
        let authToken = JSON.parse(res1);

        AsyncStorage.getItem('USERDATA', (err, res) => {
          if (res) {
            let value = JSON.parse(res);
            let csrfToken = value.csrf_token;

            const data = {
              authToken: authToken,
              csrfToken: csrfToken,
            };
            Alert.alert(
              'Unmasquerade',
              'Are you sure you want to unmasquerade?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
                    dispatch(masquerade(data))
                      .unwrap()
                      .then(response => {
                        AsyncStorage.removeItem('MASQUERADE');
                        global.isMasquerade = null;

                        dispatch(getSession())
                          .unwrap()
                          .then(response => {
                            AsyncStorage.getItem('USERDATA', (err, res2) => {
                              if (res2) {
                                console.log(res2);
                                let value = JSON.parse(res2);
                                value.csrf_token = response.data;
                                AsyncStorage.setItem(
                                  'USERDATA',
                                  JSON.stringify(value),
                                );
                                setCsrfToken(response.data);
                                navigation.dispatch(StackActions.popToTop());
                              }
                            });
                          })
                          .catch(err => {
                            //this.setState({isLoadingWallet: false})
                          });
                      })
                      .catch(err => {
                        Alert.alert('', config.messages.common_error, [
                          {text: 'Okay', style: 'cancel'},
                        ]);
                      });
                  },
                },
              ],
              {cancelable: false},
            );
          }
        });
      }
    });
  };

  return (
    <View>
      {/* {global.isMasquerade && global.isMasquerade == 1 && 0 ? (
        <View style={{marginBottom: 30}}></View>
      ) : null} */}

      {props.type == 'dashboard' ? (
        <Animated.View
          style={{
            height: config.headerHeight,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}>
          <CustomImage
            style={[styles.backgroundImage, {height: config.headerHeight}]}
            uri={`${config.media_url}header_bg.png`}
          />
          {/* <Image
  style={[styles.backgroundImage, {height:config.headerHeight}]}
  source={require('@images/header_bg.png')}/> */}
          <View style={styles.centerItems}>
            <View style={StyleCSS.styles.fdrCenter}>
              {props.back ? (
                <TouchableOpacity
                  style={styles.backWrapper}
                  onPress={() => {
                    props.navigation.goBack();
                  }}>
                  <CustomImage
                    height={24}
                    width={24}
                    uri={`${config.media_url}back.svg`}
                  />
                  {/* <Back/> */}
                </TouchableOpacity>
              ) : null}
              <View style={StyleCSS.styles.fdrCenter}>
                {props.logo ? (
                  <View style={{marginRight: 8}}>
                    <CustomImage
                      height={40}
                      width={40}
                      uri={`${config.media_url}logo.svg`}
                    />
                    {/* <Logo/> */}
                  </View>
                ) : null}
                <Animated.Text style={[styles.mainHeaderTitle]}>
                  {props.title}
                </Animated.Text>
              </View>
            </View>
            {props.rightHeader ? null : (
              <>
                <Animated.View style={styles.rightHeader}>
                  <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() => {
                      props.navigation.navigate('Browse', {
                        screen: 'Categories',
                        params: {backroute: props.backroute},
                      });
                    }}>
                    {props.browseSelected ? (
                      <CustomImage
                        height={24}
                        width={24}
                        uri={`${config.media_url}browse-active.svg`}
                      />
                    ) : (
                      <CustomImage
                        height={24}
                        width={24}
                        uri={`${config.media_url}browse.svg`}
                      />
                    )}
                    <Text
                      style={[
                        styles.buttonText,
                        {fontWeight: props.coursesSelected ? '700' : '500'},
                      ]}>
                      Explore
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() => {
                      props.navigation.navigate('Browse', {
                        screen: 'FindCourses',
                        params: {backroute: props.backroute},
                      });
                    }}>
                    {props.coursesSelected ? (
                      <CustomImage
                        height={24}
                        width={24}
                        uri={`${config.media_url}courses-active.svg`}
                      />
                    ) : (
                      <CustomImage
                        height={24}
                        width={24}
                        uri={`${config.media_url}courses.svg`}
                      />
                    )}
                    <Text
                      style={[
                        styles.buttonText,
                        {fontWeight: props.coursesSelected ? '700' : '500'},
                      ]}>
                      Courses
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}
          </View>
          <View></View>
        </Animated.View>
      ) : props.type === 'findCourse' ? (
        <Animated.View
          style={{
            height: props.changingHeight,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}>
          <Image
            style={[styles.backgroundImage]}
            source={require('@images/header_bg.png')}
          />
          <View style={styles.centerItems}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {props.back ? (
                <TouchableOpacity
                  style={styles.backWrapper}
                  onPress={() => {
                    props.navigation.goBack();
                  }}>
                  <CustomImage
                    height={24}
                    width={24}
                    uri={`${config.media_url}back.svg`}
                  />
                </TouchableOpacity>
              ) : null}
              <View style={StyleCSS.styles.fdrCenter}>
                {props.logo ? (
                  <View style={{marginRight: 8}}>
                    <CustomImage
                      height={40}
                      width={40}
                      uri={`${config.media_url}logo.svg`}
                    />
                  </View>
                ) : null}
                <Animated.Text style={[styles.mainHeaderTitle]}>
                  {props.title}
                </Animated.Text>
              </View>
            </View>
            {props.removeRightHeader ? null : (
              <>
                <Animated.View style={styles.rightHeader}>
                  <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() => {
                      props.navigation.navigate('Browse', {
                        screen: 'Categories',
                        params: {backroute: props.backroute},
                      });
                    }}>
                    {props.browseSelected ? (
                      <CustomImage
                        height={24}
                        width={24}
                        uri={`${config.media_url}browse-active.svg`}
                      />
                    ) : (
                      <CustomImage
                        height={24}
                        width={24}
                        uri={`${config.media_url}browse.svg`}
                      />
                    )}
                    <Text
                      style={[
                        styles.buttonText,
                        {fontWeight: props.browseSelected ? '700' : '500'},
                      ]}>
                      Explore
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() => {
                      props.navigation.navigate('Browse', {
                        screen: 'FindCourses',
                        params: {backroute: props.backroute},
                      });
                    }}>
                    {props.coursesSelected ? (
                      <CustomImage
                        height={24}
                        width={24}
                        uri={`${config.media_url}courses-active.svg`}
                      />
                    ) : (
                      <CustomImage
                        height={24}
                        width={24}
                        uri={`${config.media_url}courses.svg`}
                      />
                    )}
                    <Text
                      style={[
                        styles.buttonText,
                        {fontWeight: props.coursesSelected ? '700' : '500'},
                      ]}>
                      Courses
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}
          </View>
          <View></View>
        </Animated.View>
      ) : null}

      {global.isMasquerade &&
      global.isMasquerade == 1 &&
      props.type == 'dashboard' ? (
        <Animated.View
          style={{
            backgroundColor: '#eee',
            borderRadius: 3,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 78,
            zIndex: 1000,
            opacity: props.masqFade ? props.masqFade : 0,
          }}>
          <TouchableOpacity
            style={{padding: 3}}
            onPress={() => {
              doUnMasquerade();
            }}>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: Helper.switchFont('regular'),
                  textAlign: 'center',
                  color: brandColor,
                  fontSize: 12,
                }}>
                You are now masquerading as{' '}
                <Text style={{fontFamily: Helper.switchFont('medium')}}>
                  {global.userfullname}
                </Text>
                . Click here to Unmasquerade
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: wp('100%'),
    flexDirection: 'row',
    height: Platform.OS === 'android' ? 116 : 120,
    // zIndex:30
  },
  backgroundImageInner: {
    flex: 1,
    width: wp('100%'),
    height: wp('100%'),
    resizeMode: 'cover',
    flexDirection: 'row',
    paddingTop: 124,
    marginTop: Platform.OS === 'ios' ? -200 : -140,
  },
  // backgroundImageSched: {
  //   flex: 1,
  //   width: wp('100%'),
  //   height: wp('100%'),
  //   resizeMode: 'cover',
  //   flexDirection: 'row',
  //   marginTop: -140,
  // },
  // backgroundImageChatWindow: {
  //   flex: 1,
  //   width: wp('100%'),
  //   height: wp('100%'),
  //   resizeMode: 'cover',
  //   flexDirection: 'row',
  //   marginTop: -130,
  // },
  // backgroundImageChat: {
  //   flex: 1,
  //   width: wp('100%'),
  //   height: wp('100%'),
  //   resizeMode: 'cover',
  //   flexDirection: 'row',
  //   marginTop: -160,
  // },
  // backgroundImageNoback: {
  //   flex: 1,
  //   width: wp('100%'),
  //   height: wp('100%'),
  //   resizeMode: 'cover',
  //   flexDirection: 'row',
  //   paddingTop: 124,
  //   marginTop: -180,
  // },
  mainHeaderTitle: {
    color: 'rgb(255, 255, 255)',
    fontSize: 20,
    fontFamily: Helper.switchFont('bold'),
    fontWeight: '700',
  },
  // innerHeaderTitle: {
  //   color: 'rgb(255, 255, 255)',
  //   fontSize: 24,
  //   marginLeft:24,
  //   fontFamily: Helper.switchFont('medium'),
  // },
  // walletTitle: {
  //   color: 'rgb(255, 255, 255)',
  //   fontSize: 36,
  //   fontFamily: Helper.switchFont('light'),
  // },
  walletSubTitle: {
    color: 'rgb(255, 255, 255)',
    fontSize: 18,
    fontFamily: Helper.switchFont('regular'),
  },
  centerItems: {
    zIndex: 1000000,
    position: 'absolute',
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 34 : 38,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    // height:40,
    marginBottom: 24,
  },
  backWrapper: {
    flexDirection: 'row',
    height: 44,
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 9999,
    marginRight: 20,
  },
  buttonWrapper: {
    height: 48,
    width: 48,
    zIndex: 9999,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 10,
    marginTop: 2,
    color: '#fff',
    fontFamily: Helper.switchFont('regular'),
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '30%',
  },
});

export default HeaderInner;
