import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import HeaderInner from '../../components/HeaderInner';
import OTPTextInput from 'react-native-otp-textinput';
import {useAppDispatch} from '../../app/store';
import {
  getStaticPage,
  otpVerifyAccount,
  resendOtp,
} from '../../reducers/user.slice';
import Config from '../../config/Config';
import {font1, lineColor, secondaryColor} from '../../styles/colors';
import StyleCSS from '../../styles/style';
import Helper from '../../utils/helperMethods';

export default function Otp({navigation, route}) {
  let otpInput = useRef<number | string | null>(null);
  const dispatch = useAppDispatch();
  let email = route?.params?.email;
  const [otp, setOtp] = useState<null | string>(null);
  console.log(otpInput);
  const [staticPageContent, setStaticPageContent] = useState(null);

//   useEffect(() => {
//     dispatch(getStaticPage('verify_otp'))
//       .unwrap()
//       .then(response => {
//         console.log(response);
//         if (response.data.status === 'success') {
//           setStaticPageContent(response.data.data);
//         } else if (response.data.status === 'failure') {
//         }
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   });

  const handleOTPVerification = () => {
      if(otp!==''){
        let data = {
            email: email,
            type: 'mail',
            verification_code: otp,
          };
      
          dispatch(otpVerifyAccount(data))
            .unwrap()
            .then(response => {
              if (response.data.status === 'success') {
                navigation.navigate('UserDetail',{
                    userSession: response.data.data
                })
      
              }else if(response.data.status === 'failure'){
                  Alert.alert('',response.data.error_message.message)
              }
            })
            .catch(err => {
              console.log(err);
            });
      }
      else{
        Alert.alert('', 'Enter OTP')
      }
    
  };

  const handleResendOtp = () => {
    let data = {
      email: email,
      type: 'mail',
    };
    dispatch(resendOtp(data))
      .unwrap()
      .then(response => {
        console.log(response);
      })
      .catch(error => console.log(error));
  };
  console.log(otp);
  return (
    <>
      <HeaderInner
        type={'findCourse'}
        title={'Sign Up'}
        logo={true}
        navigation={navigation}
      />
      <View style={styles.main}>
        <Text style={styles.title}>Help us verify your account</Text>
        <Text style={styles.subtitle}>
          The OTP has been sent to <Text style={styles.email}>{email}</Text>
        </Text>
        <OTPTextInput
          handleTextChange={(text: string) => {
            setOtp(text);
          }}
          containerStyle={styles.containerStyle}
          textInputStyle={styles.textInputStyle}
          inputCount={6}
          offTintColor={lineColor}
          tintColor={secondaryColor}
          ref={(e: any) => (otpInput = e)}>
          </OTPTextInput>
        <TouchableOpacity
          style={styles.resendOtpWrapper}
          onPress={handleResendOtp}>
          <Text style={[StyleCSS.styles.contentText, styles.resendOtp]}>
            Resend OTP
          </Text>
        </TouchableOpacity>
        <View style={[styles.buttonWrapper]}>
          <TouchableOpacity
          onPress={()=>{
              navigation.goBack();
          }}
            style={[StyleCSS.styles.cancelButton, styles.button]}>
            <Text style={[StyleCSS.styles.cancelButtonText]}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[StyleCSS.styles.submitButton, styles.button]}
            onPress={handleOTPVerification}>
            <Text style={[StyleCSS.styles.submitButtonText]}>Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    marginTop: Config.headerHeight,
    backgroundColor: '#fff',
    height: '100%',
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
  textInputStyle: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: lineColor,
  },
  containerStyle: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  resendOtp: {
    textAlign: 'center',
    color: secondaryColor,
  },
  resendOtpWrapper: {
    marginTop: 16,
  },
  subtitle: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
  },
  email: {
    color: font1,
    lineHeight: 23,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  button: {
    width: '25%',
  },
});
