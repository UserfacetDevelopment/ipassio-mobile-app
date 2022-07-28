import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import Intercom, {Visibility} from '@intercom/intercom-react-native'
import HeaderInner from '../../components/HeaderInner';
import {font1, font2} from '../../styles/colors';
import StyleCSS from '../../styles/style';
import {TextInput, ProgressBar} from 'react-native-paper';
// @ts-ignore
import {BarPasswordStrengthDisplay} from 'react-native-password-strength-meter';
import config from '../../config/Config';
import TextField from '../../components/CustomTextField';
import CustomImage from '../../components/CustomImage';
import Helper from '../../utils/helperMethods';
import {useAppDispatch} from '../../app/store';
import {useForm, Controller} from 'react-hook-form';
import {
  getStaticPage,
  getUserLocation,
  loginSuccess,
  register,
  userState,
} from '../../reducers/user.slice';
import RenderHTML from 'react-native-render-html';
import {useSelector} from 'react-redux';
import {NavigationRouteContext} from '@react-navigation/native';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
export interface RegisterDataInterface {
  ip_city: string;
  ip_country: string;
  ip_country_code: string;
  password: string;
  ip_state: string;
  timezone: string;
  user_type: string;
  email: string;
  device_type: 'AD' | 'IO';

}

export default function Signup({navigation, routes}) {
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({mode: 'onBlur'});
  const {userData, isLoggedIn, userLocation, loginRedirectedFrom} = useSelector(userState);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staticPageContent, setStaticPageContent] = useState<any>(null);
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [userType, setUserType] = useState<'S' | 'T'>('S');
  const [passwordCheck, setPasswordCheck] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);

  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true,
    },
  };

  useEffect(() => {
    Intercom.setLauncherVisibility(Visibility.VISIBLE)
    // dispatch(getUserLocation());
    if (userType === 'S') {
      dispatch(getStaticPage('student_signup'))
        .then(response => {
          if (response.payload.status === 'success') {
            setStaticPageContent(response.payload.data.body);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else if (userType === 'T') {
      dispatch(getStaticPage('teacher_signup'))
        .then(response => {
          if (response.payload.status === 'success') {
            setStaticPageContent(response.payload.data.body);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [userType]);

  const registerUser = () => {
    if (email !== '' && password !== '') {
      if (
        email.match(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
      ) {
        setEmailCheck(false);
        if (
          password.length > 7 &&
          password.length < 16 &&
          password.match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
          )
        ) {
          setPasswordCheck(false);
          let data: RegisterDataInterface = {
            email: email,
            password: password,
            timezone:
              userLocation && userLocation.data && userLocation.data.timezone
                ? userLocation.data.timezone
                : '',
            user_type: userType,
            ip_city:
              userLocation && userLocation.data && userLocation.data.city
                ? userLocation.data.city
                : '',
            ip_state:
              userLocation && userLocation.data && userLocation.data.state
                ? userLocation.data.state
                : '',
            ip_country:
              userLocation &&
              userLocation.data &&
              userLocation.data.country_name
                ? userLocation.data.country_name
                : '',
            ip_country_code:
              userLocation &&
              userLocation.data &&
              userLocation.data.country_code
                ? userLocation.data.country_code
                : '',
                device_type: Platform.OS === 'android' ? 'AD' : 'IO',

          };

          dispatch(register(data))
            .then((response: any) => {
              if (response.payload.data.status === 'success') {
                if (
                  response.payload.data.data.verification_status_email !==
                    'P' &&
                  response.payload.data.data.user_details_status === 'P'
                ) {
                  navigation.navigate('UserDetail', {
                    userSession: response.payload.data.data,
                  });
                } else if (
                  response.payload.data.data.verification_status_email === 'P'
                ) {
                  navigation.navigate('OtpVerification', {
                    email: response.payload.data.data.email,
                    userSession: response.payload.data.data,
                  });
                } else if (
                  response.payload.data.data.verification_status_email ===
                    'A' &&
                  response.payload.data.data.user_details_status === 'C'
                ) {
                  //add all login conditions
             
                  dispatch(loginSuccess(response.payload.data.data));
                       Intercom.registerIdentifiedUser({email:response.payload.data.data.email, userId: response.payload.data.data.id})
              Intercom.updateUser({
                email: response.payload.data.data.email,
                userId: response.payload.data.data.id,
                name: response.payload.data.data.first_name+ ' '+response.payload.data.data.last_name,
                phone: response.payload.data.data.country_code+response.payload.data.data.phone_number,
              
              });

                    // navigation.navigate('Dashboard');
                  
                 
                }
              } else if (response.payload.data.status === 'failure') {
                Alert.alert('', response.payload.data.error_message.message);
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          setPasswordCheck(true);
        }
      } else {
        setEmailCheck(true);
      }
    } else {
      Alert.alert('', 'Enter Email and Password');
    }
  };

  return (
    <>
      <HeaderInner
        type={'findCourse'}
        logo={true}
        title={'Sign Up'}
        navigation={navigation}
      />
      <View style={styles.tabView}>
        <CustomImage
          style={styles.tabBgImage}
          uri={`${config.media_url}transactions_bg.png`}
        />
        <View style={styles.userTabsWrapper}>
          <TouchableOpacity
            style={userType === 'S' ? styles.selectedTab : styles.userTab}
            onPress={() => {
              setUserType('S');
            }}>
            <Text
              style={
                userType === 'S'
                  ? styles.selectedUserTabText
                  : styles.userTabText
              }>
              Student
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={userType === 'T' ? styles.selectedTab : styles.userTab}
            onPress={() => {
              setUserType('T');
            }}>
            <Text
              style={
                userType === 'T'
                  ? styles.selectedUserTabText
                  : styles.userTabText
              }>
              Teacher
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.main}>
          <Text style={styles.title}>
            Become a {userType === 'S' ? 'Student' : 'Teacher'}
          </Text>
          {/* <TouchableOpacity
            // onPress={handleGoogleSignIn}
            style={styles.googleButton}>
             <View style={styles.googleIconView}> 
              <Google/>
            
            <Text style={styles.googleButtonText}>Continue with Google</Text>
            </View>
          </TouchableOpacity> */}
          {/* <Text>OR</Text> */}
          <TextField
            label="Email Address*"
            mode="outlined"
            style={StyleCSS.styles.mt24}
            onChangeText={(text: string) => {
              setEmail(text);
            }}></TextField>
          {emailCheck ? (
            <Text style={StyleCSS.styles.errorText}>Enter a valid email</Text>
          ) : null}
          <TextField
            label="Password*"
            mode="outlined"
            secureTextEntry={!viewPassword}
            style={StyleCSS.styles.mt24}
            onChangeText={(text: string) => {
              setPassword(text);
            }}></TextField>
          {password.length > 0 ? (
            <TouchableOpacity
              style={styles.inputViewIconWrapper}
              onPress={() => {
                setViewPassword(!viewPassword);
              }}>
              <CustomImage
                style={styles.inputViewIcon}
                uri={
                  viewPassword
                    ? `${config.media_url}hide_icon.png`
                    : `${config.media_url}view_icon.png`
                }
              />
            </TouchableOpacity>
          ) : null}
          {passwordCheck ? (
            <Text style={StyleCSS.styles.errorText}>
              The password must contain 8 to 15 characters and at least 1
              lowercase letter, uppercase letter, number and special character.
            </Text>
          ) : null}
          <BarPasswordStrengthDisplay
            password={password}
            wrapperStyle={styles.wrapperStyle}
            barStyle={styles.barStyle}
            scoreLimit={100}
            width={width - 32}
            minLength={5}
          />
          <TouchableOpacity
            onPress={registerUser}
            style={[
              StyleCSS.styles.submitButton,
              {width: '100%'},
              StyleCSS.styles.mt24,
            ]}>
            <Text style={StyleCSS.styles.submitButtonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={[
                StyleCSS.styles.contentText,
                StyleCSS.styles.fw600,
                {textAlign: 'center', marginTop: 16},
              ]}>
              {' '}
              Already have an account?
              <Text style={[StyleCSS.styles.readMore, StyleCSS.styles.fw600]}>
                {' '}
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
          {/* <View
            style={[
              StyleCSS.styles.lineStyleLight,
              {marginVertical: 24},
            ]}></View>
          <View>
            <RenderHTML
              baseStyle={styles.htmlContent}
              contentWidth={width}
              source={{html: staticPageContent}}
              renderersProps={renderersProps}
            />
          </View> */}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    height:'100%'
    
  },
  scrollView: {
    marginTop: config.headerHeight,
  height:height,
  backgroundColor: '#fff',
  },
  googleIconView: {
    // flex: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    width: 22,
    height: 22,
  },
  googleButtonText: {
    color: font1,
    marginLeft: 16,
    fontWeight: '400',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    color: font1,
    fontWeight: '700',
    fontFamily: Helper.switchFont('bold'),
    marginTop: 40,
    textAlign: 'center',
    lineHeight: 30,
  },
  googleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 50,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#CDD6E0',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  inputViewIcon: {
    width: 20,
    height: 15,
    alignSelf: 'center',
    marginRight: 16,
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

  barStyle: {
    marginLeft: 0,
    paddingLeft: 0,
  },
  wrapperStyle: {
    paddingLeft: 0,
    marginLeft: 0,
    marginTop: 8,
  },
  htmlContent: {
    fontFamily: Helper.switchFont('regular'),
    // fontWeight:'400',
    fontSize: 14,
    color: font1,
    lineHeight: 26,
    flexWrap: 'wrap',
    // paddingHorizontal:16,
    marginBottom: 16,
  },
  tabView: {
    width: '100%',
    height: 36,
    zIndex: 9999,
    top: config.headerHeight,
  },
  tabBgImage: {
    height: '100%',
    width: '100%',
  },
  userTabsWrapper: {
    position: 'absolute',
    top: 0,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTab: {
    width: '50%',
    justifyContent: 'center',
    height: '100%',
  },

  userTabText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: Helper.switchFont('bold'),
  },
  selectedUserTabText: {
    textAlign: 'center',
    color: 'rgb(255,255,255)',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: Helper.switchFont('bold'),
  },
  selectedTab: {
    width: '50%',
    justifyContent: 'center',
    borderBottomColor: 'rgba(255,255,255,0.8)',
    borderBottomWidth: 4,
    height: '100%',
  },
});
