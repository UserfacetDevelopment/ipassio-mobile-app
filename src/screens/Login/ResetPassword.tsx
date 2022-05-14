import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  //TextInput,
  TouchableHighlight,
  Alert,
  Keyboard,
} from 'react-native';
import {Container} from 'native-base';
import {TextInput, RadioButton} from 'react-native-paper';
//import {OutlinedTextField} from 'react-native-material-textfield';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {LogBox} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import config from '../../config/Config';
import style from '../../styles/style';
import {resetPassword, doForgetPassword} from '../../reducers/user.slice';
import {setLoading, loaderState} from '../../reducers/loader.slice';
import DialogLoader from '../../components/DialogLoader';
import helper from '../../utils/helperMethods';
import {brandColor, font1} from '../../styles/colors';
import { useAppDispatch } from '../../app/store';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParamList } from '../../navigation/Navigators';
import StyleCSS from '../../styles/style';
import {font2} from '../../styles/colors';
import HeaderInner from '../../components/HeaderInner';
import {useRoute} from '@react-navigation/native'
type Props = NativeStackScreenProps<RootParamList, 'ResetPassword'>;

export interface ResetPasswordInterface{
  email: string;
        type: string;
        verification_code: string;
        password: string;
}
export default function ResetPassword({navigation, route} : Props) {
  const dispatch = useAppDispatch();
  const {loading} = useSelector(loaderState);
  const [password1, setPassword1] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [viewPassword1, setViewpassword1] = useState<boolean>(false);
  const [viewPassword2, setViewpassword2] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
const routes= useRoute();
  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, []);

  const handleResetPassword = () => {
    Keyboard.dismiss();
    if(!otp){
      Alert.alert('', 'Please enter the OTP!', [
        {text: 'Okay', style: 'cancel'},
      ]);
    }
    else if (!password1 || !password2) {
      Alert.alert('', 'Please enter both fields!', [
        {text: 'Okay', style: 'cancel'},
      ]);
    } else if (password1 !== password2) {
      Alert.alert('', 'Password mismatches', [{text: 'Okay', style: 'cancel'}]);
    } else if (!helper.validatePasswordFormat(password1)) {
      Alert.alert(
        '',
        'password does not meet the requirements (one special character, one alphabet in uppercase, one numerical value and minimum 8 characters)',
        [{text: 'Okay', style: 'cancel'}],
      );
    } else {
      let data: ResetPasswordInterface = {
        email: route.params?.email,
        type: 'mail',
        verification_code: otp,
        password: password2,
      };
      setPassword1('');
      setPassword2('');
      setOtp('');
      dispatch(setLoading(true));
      dispatch(resetPassword(data))
        .unwrap()
        .then(response => {
          dispatch(setLoading(false));
          if (response.status === 'success') {
            navigation.navigate('ActionStatus', {
              messageStatus: 'success',
              messageTitle: 'Success!',
              messageDesc: response.error_message.message,
              timeOut: 4000,
              backRoute: 'LoginScreen',
              params: {
                email: route.params?.email,
              },
            });
          } else if (response.status === 'failure') {
            navigation.navigate('ActionStatus', {
              messageStatus: 'failure',
              email: route.params?.email,
              messageTitle: 'Sorry!',
              messageDesc: response.error_message.message,
              timeOut: 4000,
              backRoute: 'ResetPassword',
              params: {
                email: route.params?.email,
              },
            });
          }
        })
        .catch(err => {
          dispatch(setLoading(false));
        });
    }
  };

  const handleResendOtp = () => {
        dispatch(setLoading(true))
        let data = {
            email: route.params?.email,
            type: "mail",
          };
          dispatch(doForgetPassword(data))
          .unwrap()
          .then(response=>{
            dispatch(setLoading(false));
          })
          .catch(err=>{
            dispatch(setLoading(false));
          })
          dispatch(setLoading(false));
  };


  return (
      <>
      <HeaderInner
      type={'findCourse'}
      title={"Reset Password"}
      navigation={navigation}
      backroute={routes.name}
      backArrowRoute = {'ForgotPassword'}
      back={true}
      />
      {/* {loading && <DialogLoader />} */}
    <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps={'handled'}>
      <View style={style.styles.loginContainer}>
        <Container style={style.styles.loginSubContainer}>
          {/* <View style={styles.imageWrapper}>
            <Image
              style={styles.backgroundImage}
              source={require('@images/toolbar_inner_back.png')}
            />
          </View> */}
          <View style={styles.innerContainer}>
            <View style={styles.marginTop24}>
              <Text style={style.styles.title}>Reset Password?</Text>
            </View>
            <Text style={styles.info}>{route.params?.messageDesc}</Text>
            <View style={styles.marginTop24}>
              {/* <Text style={styles.label}>Enter 6-digit OTP</Text> */}
              <TextInput
              style={StyleCSS.styles.input}
              mode="outlined"
              label="Enter 6-digit OTP"
              theme={{colors: {primary: font2}}}
                //style={styles.input}
                onChangeText={text => setOtp(text)}
                textAlignVertical="top"
                //tintColor="rgb(44, 54, 65)"
                value={otp}
                secureTextEntry={false}
                editable={true}
                autoCapitalize="none"
                returnKeyType="next"
                autoCorrect={false}
                selectTextOnFocus={false}
              />
              <TouchableOpacity
                style={styles.resendOtp}
                onPress={handleResendOtp}>
                <Text style={styles.resendOtpText}>RESEND OTP </Text>
              </TouchableOpacity>
              {/* <Text style={styles.label}>New Password</Text> */}

              <TextInput
              style={StyleCSS.styles.input}
                label="New Password"
                mode="outlined"
                theme={{colors: {primary: font2}}}
                onChangeText={text => setPassword1(text)}
                //style={styles.input}
                textAlignVertical="top"
                secureTextEntry={!viewPassword1}
                //tintColor="rgb(44, 54, 65)"
                value={password1}
                editable={true}
                autoCapitalize="none"
                returnKeyType="next"
                // onBlur={}
                autoCorrect={false}
                selectTextOnFocus={false}
              />

              {password1.length ? (
                <TouchableOpacity
                  style={styles.inputViewIconWrapper}
                  onPress={() => {
                    setViewpassword1(!viewPassword1);
                  }}>
                  <Image
                    style={styles.inputViewIcon}
                    source={
                      viewPassword1
                        ? require('@images/view_icon.png')
                        : require('@images/hide_icon.png')
                    }
                  />
                </TouchableOpacity>
              ) : null}
{/* <Text style={styles.label}>Confirm Password</Text> */}
              <TextInput
              style={StyleCSS.styles.input}
              mode="outlined"
              label="Confirm Password"
              theme={{colors: {primary: font2}}}
              //style={styles.input}
                //label="Confirm Password"
                onChangeText={text => setPassword2(text)}
                textAlignVertical="top"
                secureTextEntry={!viewPassword2}
                //tintColor="rgb(44, 54, 65)"
                value={password2}
                editable={true}
                autoCapitalize="none"
                returnKeyType="next"
                autoCorrect={false}
                selectTextOnFocus={false}
              />

              {password2.length ? (
                <TouchableOpacity
                  style={styles.inputViewIconWrapper}
                  onPress={() => {
                    setViewpassword2(!viewPassword2);
                  }}>
                  <Image
                    style={styles.inputViewIcon}
                    source={
                      viewPassword2
                        ? require('@images/view_icon.png')
                        : require('@images/hide_icon.png')
                    }
                  />
                </TouchableOpacity>
              ) : null}
             <TouchableOpacity
                // underlayColor={brandColor}
                onPress={handleResetPassword}
                style={style.styles.submit}>
                <Text style={style.styles.submitText}>RESET NOW</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.info}>
                Password should be of at least 8 characters.
              </Text>

              <Text style={styles.info}>
                Password Should contain at least one alphabet in uppercase.
              </Text>

              <Text style={styles.info}>
                Password Should contain at least one numerical value.
              </Text>

              <Text style={styles.info}>
                Password Should contain at least one special character(! @ # $ %
                ^ & *).
              </Text>
              <TouchableOpacity
                // underlayColor={brandColor}
                onPress={handleResetPassword}
                style={style.styles.submit}>
                <Text style={style.styles.submitText}>RESET NOW</Text>
              </TouchableOpacity>
            </View>
            
            <View>
            
            </View>
          </View>
        </Container>
      </View>
    </KeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {height: 100},
  backgroundImage: {
    flex: 1,
    // width: wp('100%'),
    // height: wp('100%'),
    resizeMode: 'cover',
    flexDirection: 'row',
    marginTop: -80,
  },
  resendOtp: {
    alignSelf: 'flex-end',
    
  },
  scrollView:{
    marginTop:109,
  },
  resendOtpText: {
    textTransform:'capitalize',
    fontSize: 13,
    color: brandColor,
    fontFamily: helper.switchFont('regular'),
  },
  info: {
    fontSize: 11,
    color: font2,
    fontFamily: helper.switchFont('regular'),
    marginTop: 5,
  },
  inputViewIcon: {
    width: 20,
    height: 15,
    alignSelf: 'center',
    marginRight: 16,
    marginTop: -25,
  },
  inputViewIconWrapper: {
    //backgroundColor: "#000",
    width: 50,
    height: 50,
    alignSelf: 'flex-end',
    marginTop: -20,
    alignItems: 'center',
  },
  innerContainer: {
    marginLeft: 16,
    marginRight: 16,
    flex: 1,
  },
  marginTop24: {marginTop: 24},
  label:{
    color: font1,
    fontFamily: helper.switchFont('medium'),
    fontSize:16,
  },
  input: {
    color: font1,
    marginBottom: 5,
    fontSize: 18,
    padding: 16,
    height: 55,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 5,
    fontFamily: helper.switchFont('medium'),
    borderWidth: 0.5,
    borderColor: 'rgb(200, 200, 200)',
  },
  
});
