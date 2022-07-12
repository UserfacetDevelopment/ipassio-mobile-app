import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import HeaderInner from '../../components/HeaderInner';
import {OTPTextInput} from 'react-native-otp-textinput';
import {useAppDispatch} from '../../app/store';
import {
  getStaticPage,
  otpVerifyAccount,
  resendOtp,
} from '../../reducers/user.slice';

export default function OtpVerification({navigation, route}) {
  let otpInput = useRef<number | string | null>(null);
  const dispatch = useAppDispatch();
  let email = route?.params?.email;
  const [staticPageContent, setStaticPageContent] = useState(null);
  useEffect(() => {
    dispatch(getStaticPage('verify_otp'))
      .unwrap()
      .then(response => {
        if (response.data.status === 'success') {
          setStaticPageContent(response.data.data);
        } else if (response.data.status === 'failure') {
        }
      })
      .catch(error => {
        console.log(error);
      });
  });

  const handleOTPVerification = () => {
    let data = {
      email: email,
      type: 'mail',
    };

    dispatch(otpVerifyAccount(data))
      .unwrap()
      .then(response => {
        if (response.data.status === 'success') {
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleResendOtp = () => {
    let data = {
      email: email,
      type: 'mail',
    };
    dispatch(resendOtp(data))
      .unwrap()
      .then(response => {
      })
      .catch(error => console.log(error));
  };

  return (
    <>
      <HeaderInner
        type={'findCourse'}
        title={'Sign Up'}
        navigation={navigation}
      />
      <Text>Help us verify your account</Text>
      <Text>The OTP has been sent to {email}</Text>
      <OTPTextInput ref={e => (otpInput = e)}></OTPTextInput>
      <TouchableOpacity onPress={handleResendOtp}>Resend OTP</TouchableOpacity>
      <View>
        <TouchableOpacity>
          <Text>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOTPVerification}>
          <Text>Verify</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
