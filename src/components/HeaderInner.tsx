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
  Dimensions
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
import { border } from 'native-base/lib/typescript/theme/styled-system';
// import CoursesActive from '../assets/images/courses-active'
// import BrowseActive from '../assets/images/browse-active'
// import Logo from  '../assets/images/logo.svg'
import { useSelector } from 'react-redux';
import CustomImage from './CustomImage';

const width = Dimensions.get('screen').width;
const HeaderInner = (props: any) => {

  const dispatch = useAppDispatch();
  const  {userData} = useSelector(userState);
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
        // <Animated.View
        //   style={{
        //      overflow: 'visible',
        //     // height: props.dashboardHeight ? props.dashboardHeight : 191,
        //      position: 'absolute',
        //     top: 0,
        //     left: 0,
        //     right: 0,
        //     width:width,
        //     // borderWidth:5,
        //     borderColor:'blue'
        //   }}>
        //    <View
        //     style={{
        //       flexDirection: 'row',
        //       alignItems:'center',
        //       justifyContent:'space-between',
        //       flex: 1,
        //       width: '100%',
        //       // position: 'absolute',
        //       zIndex: 999,
        //       // borderColor:'white',
        //       borderWidth:1,
        //     }}>
            
        //   </View>

        //   <Animated.Image
        //     style={[styles.backgroundImage]}
        //     source={require('@images/header_bg.png')}
        //   />
        //    <Animated.View
        //     style={{
        //       height: 100,
        //       flexDirection: 'row',
        //       flex: 1,
        //       width: '100%',
        //       position: 'absolute',
        //       top: 0,
        //       left: 0,
        //       right: 0,
        //       borderWidth:2,
        //       borderColor:'red',
        //       paddingTop: props.fixedHeight,
        //       zIndex: 99,
        //       overflow: 'hidden',
        //     }}>
        //     <Animated.Image
        //       style={{
        //         width:'100%',
        //         position: 'absolute',
        //         left: 0,
        //         right: 0,
        //         top: 0,
        //         height: 120,
        //         borderWidth:3,
        //       borderColor:'yellow',
        //       }}
        //       source={require('@images/header_bg.png')}
        //     />
        //   </Animated.View>
        //   <View
        //     style={{
        //       flex: 1,
        //       margin: 24,
        //       marginBottom:0,
        //       position: 'absolute',
        //       right: 0,
        //       borderWidth:1,
        //       left: 0,
        //       zIndex: 100,
        //     }}>
        //     <Animated.View
        //       style={{
        //         position:'absolute',
        //         width:width,
        //         marginHorizontal:16,
        //         flexDirection: 'row',
        //         alignItems:'center',
        //         justifyContent:'space-between',
        //         flex: 1,
        //         // borderWidth:1,
        //         borderColor:'green',
        //         marginTop: props.titleTop,
        //       }}>
        //         <Animated.View style={{flexDirection:'row', alignItems:'center'}}>
        //           <Logo/>
        //           <Animated.Text
        //               style={[styles.mainHeaderTitle, {fontSize: props.titleSize}]}>
        //               {props.title}
        //           </Animated.Text>
        //         </Animated.View>
        //         <Animated.View>
        //         <Animated.View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between', width:'30%'}}>
        //       <TouchableOpacity style={{height:48, width:48, zIndex: 9999, flexDirection: 'column', justifyContent:'center', alignItems:'center'}} onPress={()=>{props.navigation.navigate("Browse", {screen: 'Categories',params:{backroute:props.backroute}})}}>{props.browseSelected ? <BrowseActive/> : <Browse/>}<Text style={{fontSize:10, marginTop:2, color:'#fff', fontWeight:props.browseSelected ?'700' : '500', fontFamily:Helper.switchFont('regular')}}>Browse</Text></TouchableOpacity>
        //       <TouchableOpacity style={{height:48, width:50, zIndex:9999, flexDirection: 'column', justifyContent:'center', alignItems:'center'}} onPress={()=>{props.navigation.navigate('Browse', {screen : 'FindCourses', params:{backroute:props.backroute}})}}>{props.coursesSelected ? <CoursesActive/> : <Courses/> }<Text style={{fontSize:10, marginTop:2, color:'#fff', fontWeight:props.coursesSelected ?'700' : '500', fontFamily:Helper.switchFont('regular')}}>Courses</Text></TouchableOpacity>
        //       </Animated.View>
        //       </Animated.View>
        //     </Animated.View> 
        //   </View>
        // </Animated.View>
        
        // <Animated.View style={{position:'absolute', top:0, backgroundColor:'#fff',height:props.changingHeight}}>
        //             <View style={{backgroundColor:'#000'}}/>
        //       </Animated.View>
        <Animated.View style={{
          height:  config.headerHeight,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}>
          {/* <CustomImage style={[styles.backgroundImage, {height:config.headerHeight}]} uri={`${config.media_url}/header_bg.png`}/> */}
<Image
  style={[styles.backgroundImage, {height:config.headerHeight}]}
  source={require('@images/header_bg.png')}/>
  <View style={styles.centerItems}>
    <View style={{flexDirection:'row', alignItems:'center'}} >
    {props.back ? 
      <TouchableOpacity style={{flexDirection:'row', height:44, justifyContent:'flex-start', alignItems:'center', zIndex: 9999 , marginRight:20}} onPress={()=>{props.navigation.goBack()}} >
        <CustomImage height={24} width={24} uri={`${config.media_url}back.svg`}/>
        {/* <Back/> */}
      </TouchableOpacity> : null }
      <View style={{flexDirection:'row', alignItems:'center'}}>
        {props.logo ? 
        <View style={{marginRight:8}}>
           <CustomImage height={24} width={24} uri={`${config.media_url}logo.svg`}/>
          {/* <Logo/> */}
          </View>
         : null }
      <Animated.Text
        style={[styles.mainHeaderTitle]}>
        {props.title}
      </Animated.Text>
      </View>
    </View>
    {props.rightHeader ? null :
    <>
    <Animated.View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between', width:'30%'}}>
      <TouchableOpacity style={{height:48, width:48, zIndex: 9999, flexDirection: 'column', justifyContent:'center', alignItems:'center'}} onPress={()=>{props.navigation.navigate("Browse", {screen: 'Categories',params:{backroute:props.backroute}})}}>{props.browseSelected ? 
       <CustomImage height={24} width={24} uri={`${config.media_url}browse-active.svg`}/>
      : 
      <CustomImage height={24} width={24} uri={`${config.media_url}browse.svg`}/>
      }<Text style={{fontSize:10, marginTop:2, color:'#fff', fontWeight:props.browseSelected ?'700' : '500', fontFamily:Helper.switchFont('regular')}}>Explore</Text></TouchableOpacity>
      <TouchableOpacity style={{height:48, width:50, zIndex:9999, flexDirection: 'column', justifyContent:'center', alignItems:'center'}} onPress={()=>{props.navigation.navigate('Browse', {screen : 'FindCourses', params:{backroute:props.backroute}})}}>{props.coursesSelected ? 
      <CustomImage height={24} width={24}  uri={`${config.media_url}courses-active.svg`}/>
       : 
       <CustomImage height={24} width={24}  uri={`${config.media_url}courses.svg`}/>
       }<Text style={{fontSize:10, marginTop:2, color:'#fff', fontWeight:props.coursesSelected ?'700' : '500', fontFamily:Helper.switchFont('regular')}}>Courses</Text></TouchableOpacity>
      </Animated.View>
    </>}
  </View>
<View></View>
</Animated.View>    
              
                   
      ) :
              props.type=== 'findCourse' ? 
              (
                <Animated.View style={{
                  height:  props.changingHeight,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                }}>
        <Image
          style={[styles.backgroundImage]}
          source={require('@images/header_bg.png')}/>
          <View style={styles.centerItems}>
            <View style={{flexDirection:'row', alignItems:'center'}} >
            {props.back ? 
            
              <TouchableOpacity style={{flexDirection:'row', height:44, justifyContent:'flex-start', alignItems:'center', zIndex: 9999 , marginRight:20}} onPress={()=>{props.navigation.goBack()}} >
                <CustomImage height={24} width={24}  uri={`${config.media_url}back.svg`}/>
              </TouchableOpacity> : null }
              <View style={{flexDirection:'row', alignItems:'center'}}>
                {props.logo ? 
                <View style={{marginRight:8}}>
                  <CustomImage height={24} width={24}  uri={`${config.media_url}logo.svg`}/>
                  </View>
                 : null }
              <Animated.Text
                style={[styles.mainHeaderTitle]}>
                {props.title}
              </Animated.Text>
              </View>
            </View>
            {props.removeRightHeader ? null :
            <>
            <Animated.View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between', width:'30%'}}>
              <TouchableOpacity style={{height:48, width:48, zIndex: 9999, flexDirection: 'column', justifyContent:'center', alignItems:'center'}} onPress={()=>{props.navigation.navigate("Browse", {screen: 'Categories',params:{backroute:props.backroute}})}}>{props.browseSelected ? 
              <CustomImage height={24} width={24}  uri={`${config.media_url}browse-active.svg`}/>
               :
               <CustomImage height={24} width={24}  uri={`${config.media_url}browse.svg`}/>
                }<Text style={{fontSize:10, marginTop:2, color:'#fff', fontWeight:props.browseSelected ?'700' : '500', fontFamily:Helper.switchFont('regular')}}>Explore</Text></TouchableOpacity>
              <TouchableOpacity style={{height:48, width:50, zIndex:9999, flexDirection: 'column', justifyContent:'center', alignItems:'center'}} onPress={()=>{props.navigation.navigate('Browse', {screen : 'FindCourses', params:{backroute:props.backroute}})}}>{props.coursesSelected ?
              <CustomImage height={24} width={24}  uri={`${config.media_url}courses-active.svg`}/>
                : 
                <CustomImage height={24} width={24}  uri={`${config.media_url}courses.svg`}/>
                }<Text style={{fontSize:10, marginTop:2, color:'#fff', fontWeight:props.coursesSelected ?'700' : '500', fontFamily:Helper.switchFont('regular')}}>Courses</Text></TouchableOpacity>
              </Animated.View>
            </>}
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
    height:Platform.OS === 'android' ? 116 : 120,
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
    fontWeight:'700',
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
    zIndex:1000000,
    position:'absolute',
    width:width,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS==='android' ? 34 : 38,
    justifyContent:'space-between',
    paddingHorizontal: 16,
    // height:40,
    marginBottom:24
  },
});

export default HeaderInner;
