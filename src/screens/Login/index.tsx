import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  Button,
  Platform,
  View,
  Text,
  StyleSheet,
  // Image,
  StatusBar,
  //TextInput,
  Linking,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextInput, RadioButton} from 'react-native-paper';
import { useAppDispatch } from '../../app/store';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import config from '../../config/Config';
import {brandColor, font1, font2, lineColor, secondaryColor} from '../../styles/colors';
import {
  doLogin,
  userState,
  socialLogin,
  loginSuccess,
  logoutUser,
  setFCMToken
} from '../../reducers/user.slice';
// import Google from '../../assets/images/google-logo.svg'
import {setLoading, setPageLoading, loaderState} from '../../reducers/loader.slice';
import DialogLoader from '../../components/DialogLoader';
import PageLoader from '../../components/PageLoader';
import helper from '../../utils/helperMethods';
import style from '../../styles/style';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParamList } from '../../navigation/Navigators';
import messaging from '@react-native-firebase/messaging';
import { ScreenStackHeaderLeftView } from 'react-native-screens';
import StyleCSS from '../../styles/style';
import HeaderInner from '../../components/HeaderInner';
import CustomStatusBar from '../../components/CustomStatusBar';
import TextField from '../../components/CustomTextField';
import CustomImage from '../../components/CustomImage';


type Props = NativeStackScreenProps<RootParamList, 'Login'>;

export interface GoogleLogin {
    google_id: string;
    email: string;
    first_name?: string| null;
    last_name?: string| null;
    photoURL?: string| null;
}

export interface Login {
  username :string;
  password : string;
  device_type :'IO'|'AD';
  device_token : string;
}

const Login: React.FC<any> = ({navigation, route} :Props) => {
  const dispatch = useAppDispatch();
  const {loading , pageLoading } = useSelector(loaderState);
const nextRoute = route.params?.nextRoute;
  const {isLoggedIn, fcmToken} = useSelector(userState);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>(null);
const [active , setActive] = useState<boolean>(false);

  useEffect(() => {
    // gsiConfigure();
    checkPermission();
    // signOut();
  }, []);

  const checkPermission = async() => {
    const enabled = await messaging().hasPermission();
    const status =
      enabled === messaging.AuthorizationStatus.AUTHORIZED ||
      enabled === messaging.AuthorizationStatus.PROVISIONAL
    if (status) {
      // console.log("Push Notifications are enabled.");
      let fcmTokens = await AsyncStorage.getItem("USERDEVICETOKEN");
      // console.log(fcmTokens);
      getToken();
    } else {
      // console.log("Push Notifications not enabled.");
      requestPermission();
    }
  }

 const getToken =async() => {
  // const platformString = Platform.OS ==='android' ? 'ANDROID' : 'IOS';
  // try { // VOYAPIC
  //   const fcmToken = await messaging().getToken();
  //   if (fcmToken) {
  //     const currentDeviceId = DeviceInfo.getUniqueId();
  //     await registerForPushNotification(
  //       fcmToken,
  //       currentDeviceId,
  //       platformString,
  //     );
  //   }
  // } catch (error) {
  //   console.log('Error:', error);
  // }
    let fcmToken = await AsyncStorage.getItem("USERDEVICETOKEN");
    dispatch(setFCMToken(fcmToken));
    if (!fcmToken) {
      // console.log(fcmToken);
      // console.log("fcmToken is not set: finding FCM Token");
      try{
          fcmToken = await messaging().getToken();
          if (fcmToken) {
            await AsyncStorage.setItem("USERDEVICETOKEN", fcmToken);
            dispatch(setFCMToken(fcmToken));
          } else {
            // console.log("No fcmToken:");
          }
    }
    catch(error){
      console.log('Error:', error);
    }
    }
  }
  async function requestPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getToken();
    }
    
    // try {
    //   if(Platform.OS==='ios'){
    //     const authorizationStatus = await messaging().requestPermission({
    //     provisional: true, providesAppNotificationSettings: true
    //   });


    //   if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    //      // If user allow Push Notification
    //     getToken();
    //   } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
    //     console.log('User has provisional notification permissions.');
    //     getToken();
    //   } else {
    //     console.log('User has notification permissions disabled');
    //   }
    // }
    // else {
    //   getToken();
    // }
      
            // if (authorizationStatus) {  // If user allow Push Notification
            //   console.log('Permission status:', authorizationStatus);
            //   getToken();
            // }
              // await messaging().requestPermission();
              // If user allow Push Notification
     
    // } catch (error) {
      // If user do not allow Push Notification
      // console.log("User did not allow Push Notification");
    // }
  }

  //Logout User
  // async function logout() {
  //   try {
  //     messaging().deleteToken();

  //     await GoogleSignin.revokeAccess();
  //     await GoogleSignin.signOut();
      
  //    } catch (error) {
  //     // Alert.alert("Something else went wrong... ", error.toString());
  //   }
  
  // }
  

  //GOOGLE SIGN IN
  // const gsiConfigure = () : void => {
  //   GoogleSignin.configure({
  //     webClientId: config.GOOGLE_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
  //     offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  //     // hostedDomain: '', // specifies a hosted domain restriction
  //     // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  //     // accountName: '', // [Android] specifies an account name on the device that should be used
  //     // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  //     // googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  //     // openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  //     // profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
  //   });
  // };

  // const doSocialLogin = (data:any) => {
  //   if (data.email) {
  //     dispatch(setLoading (true))
  //     dispatch(socialLogin(data))
  //       .unwrap()
  //       .then(async(response) => {
  //         dispatch(setLoading (false))
  //         setUserInfo(null)
          
  //         if(response.data.status==='success'){
  //           redirectCheck(response.data.data);
  //           dispatch(loginSuccess(response.data.data));
  //         }
  //         else if(response.data.status==='failure'){
  //           await GoogleSignin.revokeAccess();
            
  //           Alert.alert('', response.data.error_message.message, [
  //             {text: 'Okay', style: 'cancel'},
  //           ]);
  //         }

  //       })
  //       .catch(rejectedValueOrSerializedError => {
  //         dispatch(setLoading (false));
  //       });
  //   } else {
  //     Alert.alert(
  //       'Problem Signing In',
  //       'Please enter username and password.',
  //       [{text: 'Okay', style: 'cancel'}],
  //     );
  //   }
  // }

  // async function signOut() {
  //   try {
  //     await GoogleSignin.revokeAccess();
  //     await GoogleSignin.signOut();
  //   } catch (error) {
  //     // Alert.alert("Something else went wrong... ", error.toString());
  //   }
  // }

  // const handleGoogleSignIn = async () : Promise<void> => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     setUserInfo(userInfo);
  //     let data : GoogleLogin = {
  //       google_id: userInfo.user.id,
  //       email: userInfo.user.email,
  //       first_name: userInfo.user.givenName,
  //       last_name: userInfo.user.familyName,
  //       // emailVerified: userInfo.user.emailVerified,
  //       photoURL: userInfo.user.photo,
  //     };
  //     doSocialLogin(data);
  //   } catch (error : any) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
        
  //       // operation (e.g. sign in) is in progress already
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
       
  //       // play services not available or outdated
  //     } else {
       
  //       Alert.alert('Oops', JSON.parse(error), [
  //         {text: 'Okay', style: 'cancel'},
  //       ]);
  //     }
  //   }
  // };

  // LOGIN VIA EMAIL-PASSWORD

  const handleLogin = async () => {
    Keyboard.dismiss();
    let data: Login= {
    username : username,
    password : password,
    device_type : Platform.OS === 'ios' ? 'IO' : 'AD',
    device_token : fcmToken
    }
    if (data.username && data.password) {
      dispatch(setLoading (true));
      dispatch(doLogin(data))
        .unwrap()
        .then(response => {
          if (response.status === "success") {
            dispatch(setLoading (false));
            redirectCheck(response.data);
            dispatch(loginSuccess(response.data));
          } else if (response.status === "failure") {
            dispatch(setLoading (false));
            Alert.alert("", response.error_message.message, [
              { text: "Okay", style: "cancel" },
            ])
          }
        })
        .catch(err => {
          dispatch(setLoading (false));
        });
    } else {
      Alert.alert('', 'Enter email and password.', [
        {text: 'Okay', style: 'cancel'},
      ]);
    }
  };

  //Not to be called during a render, need a fix.
  // if (isLoggedIn ? navigation.navigate('Dashboard') : null);

  
  const redirectCheck = (loginData : any) => {
    AsyncStorage.setItem('USERDATA', JSON.stringify(loginData));
    AsyncStorage.setItem('USERDEVICETOKEN', JSON.stringify(fcmToken));
    AsyncStorage.setItem('USER_NOT_FIRST', '1');
    let nav : string = '';
    
//  navigation.navigate('Dashboard');

    // if (loginData.user_type === "T") {
    //   nav = "Dashboard";
    //   navigation.navigate('TeacherTabNavigator');
    // } else if (loginData.user_type === "S") {
    //   if(nextRoute!==undefined){
    //     navigation.navigate(nextRoute);
    //   }
    //   else navigation.navigate('StudentTabNavigator');
    // } else if (loginData.user_type === "A") {
    //   nav = "AdminDashboard";
    //   navigation.navigate('Dashboard');
    // }
    //@ts-ignore
    
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <>
    <CustomStatusBar type={'inside'}/>
    <HeaderInner
    type={'findCourse'}
    title={'Log In'}
    navigation={navigation}
    logo={true}
    backroute={'LoginScreen'}

    />
    <View style={styles.container}>
{loading ? <DialogLoader/> : null}
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
        {/* <View style={styles.loginImage}>
          <Image
            style={styles.backgroundImage}
            source={require('@images/toolbar_inner_back.png')}
          />
        </View> */}
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Log In</Text>
          <Text style={styles.subTitle}>
          Enter your credentials
          </Text>

          {/* <View> */}
          {/* <Text style={styles.inputLabel}>Username/Email</Text> */}
          <View style={styles.formInput}>
          <TextField
          label='Email*'
          mode='outlined'
          
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
            onChangeText={(text : any ) => {
              setUsername(text);
            }}></TextField>
            </View>
          {/* <Text style={styles.inputLabel}>Password</Text> */}
          <View style={styles.formInput}>
          <TextField
          label='Password*'
          mode='outlined'

            secureTextEntry={!viewPassword}
            //style={styles.inputpassword}
            onChangeText={(text: any) => {
              setPassword(text);
            }}></TextField>
            </View>
          {password.length ? (
            <TouchableOpacity
              style={styles.inputViewIconWrapper}
              onPress={() => {
                setViewPassword(!viewPassword);
              }}>

              <CustomImage
                style={styles.inputViewIcon}
                uri={viewPassword ? `${config.media_url}hide_icon.png` : `${config.media_url}view_icon.png` }
               />
            </TouchableOpacity>
          ) : null}
          {/* </View> */}
          <TouchableOpacity
            style={styles.forgotPwd}
            onPress={() => {
              handleForgotPassword();
            }}>
            <Text style={styles.forgotPwdText}>Forgot password? </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.styles.submit}
            onPress={() => handleLogin()}>
            <Text style={style.styles.submitText}>Log In</Text>
          </TouchableOpacity>
          
{/* {Platform.OS === 'android' ? 
<>
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            style={styles.googleButton}>
             <View style={styles.googleIconView}> 
             
              <CustomImage height={24} width={24} uri={`${config.media_url}google-logo.svg`}/>
            
            <Text style={styles.googleButtonText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>
          </>
           : null} */}

          <TouchableOpacity
            style={styles.newUser}
            onPress={() => {
              Linking.openURL(config.FrontendBaseURL);
              // navigation.navigate("Signup")
            }}>
            <Text style={styles.newUserText}>
              New to ipassio?{' '}
              <Text style={styles.signUp}>Sign up from the Website</Text>
            </Text>
          </TouchableOpacity>
         
        </View>
      </KeyboardAwareScrollView>
    </View>
    </>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:config.headerHeight,
  },
  loginImage: {
    height: 100,
  },
  backgroundImage: {
    flex: 1,
    width: wp('100%'),
    height: wp('100%'),
    resizeMode: 'cover',
    flexDirection: 'row',
    marginTop: -100,
  },

  //   login_image_back: {
  //     width: win.width,
  //     height: 906 * ratio,
  //     //marginTop: -100
  //   },
  forgotPwd: {
    alignSelf: 'flex-end',
  },
  forgotPwdText: {
    fontSize: 14,
    marginTop:8,
    color: secondaryColor,
    fontWeight:'500',
    fontFamily: helper.switchFont('bold'),
  },
  title: {
    fontSize: 24,
    color: font1,
    fontWeight:'700',
    fontFamily: helper.switchFont('bold'),
    marginTop: 40,
    textAlign:'center',
    lineHeight:30
  },
  newUser: {
    paddingVertical: 0,
    alignSelf: 'center',
    marginBottom: Platform.OS === 'ios' ? 60 : 36,
    marginTop: Platform.OS==='ios'? 0:  24,
  },
  newUserText: {
    fontSize: 14,
    fontFamily: helper.switchFont('regular'),
    color: font1,
    fontWeight:'500',
    textAlign: 'center',
    alignSelf: 'center',
  },
  googleIconView: {
    // flex: 0.3,
    flexDirection:'row',
    alignItems:'center',
  },
  googleIcon: {
    width: 22,
    height: 22,
  },
  googleButtonText: {
    color: font1,
    marginLeft:16,
    fontWeight:'400',
    fontSize:16
  },
  googleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 50,
    marginTop: 10,
    borderWidth:1,
    borderColor:'#CDD6E0',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  inputpassword: {
    color: 'rgb(44, 54, 65)',
    margin: 0,
    fontSize: 14,
    padding: 16,
    height: 55,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 5,
    fontFamily: helper.switchFont('medium'),
    borderWidth: 0.5,
    borderColor: 'rgb(200, 200, 200)',
  },
  inputErr: {
    color: brandColor,
    margin: 0,
    fontSize: 18,
    padding: 16,
    height: 55,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 5,
    fontFamily: helper.switchFont('medium'),
    borderWidth: 0.5,
    borderColor: brandColor,
  },
  inputLabel: {
    fontFamily: helper.switchFont('medium'),
    fontSize: 14,
    color: 'rgb(44, 54, 65)',
    marginTop: 36,
    marginBottom: 6,
  },
  errLabel: {
    fontFamily: helper.switchFont('regular'),
    fontSize: 14,
    color: brandColor,
    marginTop: 16,
    marginBottom: -12,
  },
  innerContainer: {
    marginLeft: 24,
    marginRight: 24,
    flex: 1,
  },
  signUp:{
    color:secondaryColor,
    fontWeight:'500',
    fontSize: 14,
    fontFamily: helper.switchFont('medium'),
    


  },
  inputTickIcon: {
    width: 26,
    height: 26,
    alignSelf: 'flex-end',
    marginRight: 16,
    marginTop: -22,
  },
  inputViewIcon: {
    width: 20,
    height: 15,
    alignSelf: 'center',
    // marginRight: 16,
    marginTop: -2,
  },
  inputViewIconWrapper: {
    //backgroundColor: "#000",
    width: 30,
    marginRight: 16,
    height: 30,
    alignSelf: 'flex-end',
    marginTop: -30,
    alignItems: 'center',
  },
  radioIcon: {
    width: 14,
    height: 14,
  },
  subTitle: {
    fontSize: 16,
    color: font2,
    fontFamily: helper.switchFont('regular'),
    // marginBottom: 8,
    fontWeight:'400',
    marginTop:8,
    textAlign:'center',
    lineHeight:20
  },
  brandColorText: {
    color: brandColor,
  },
  formInput:{
    marginTop:24
  }
});
