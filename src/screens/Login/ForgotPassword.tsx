import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  StatusBar,
  //TextInput,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Image,
  Alert,
  Keyboard,
  Dimensions
} from 'react-native';
import {Container} from 'native-base';
import {TextInput, RadioButton, configureFonts} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {brandColor, font1} from '../../styles/colors';
import {doForgetPassword} from '../../reducers/user.slice';
import { setLoading, loaderState } from '../../reducers/loader.slice';
import PageLoader from '../../components/DialogLoader';
import helper from '../../utils/helperMethods';
import style from '../../styles/style';
import { useAppDispatch } from '../../app/store';
import type { NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootParamList } from '../../navigation/Navigators';
import StyleCSS from '../../styles/style';
import { font2 } from '../../styles/colors';
import HeaderInner from '../../components/HeaderInner';
import { useRoute } from '@react-navigation/native';
import TextField from '../../components/CustomTextField';
import config from '../../config/Config'
export interface ForgotPassswordInterface{
email:string|undefined;
type:string;
}
type Props = NativeStackScreenProps<RootParamList, 'ForgotPassword'>;

const height = Dimensions.get('screen').height;
export default function ForgotPassword({navigation}: Props) {
  const dispatch = useAppDispatch();
  const {loading} = useSelector(loaderState)
  const [email, setEmail] = useState<string|undefined>('');
const routes = useRoute();
  const handleForgotPassword = () => {
    Keyboard.dismiss();
    let finalData : ForgotPassswordInterface = {
      email: email,
      type: 'mail',
    };

    if (finalData.email!=undefined) {
      // setIsLoading(true);
      setEmail('');
      dispatch(setLoading(true));
      dispatch(doForgetPassword(finalData))
        .unwrap()
        .then(originalPromiseResult => {
          dispatch(setLoading(false));
          if (originalPromiseResult.status === 'success') {
            // navigation.navigate('ActionStatus', {
            //   messageStatus: 'success',
            //   messageTitle: 'Congratulations!',
            //   messageDesc: config.messages.forgot_password_msg,
            //   timeOut: parseInt(7000),
            //   backRoute: 'LoginScreen',
            //   params: {},
            // });
            navigation.navigate('ResetPassword', {
              email : email,
              messageDesc: originalPromiseResult.error_message.message ,
              backRoute: 'LoginScreen',
              params: {},
            });
            
          } else if (originalPromiseResult.status === 'failure') {
            navigation.navigate('ActionStatus', {
              messageStatus: 'failure',
              messageTitle: 'Sorry!',
              messageDesc: originalPromiseResult.error_message.message,
              timeOut: 4000,
              backRoute: 'ForgotPassword',
              params: {},
            });
          }
        })
        .catch(rejectedValueOrSerializedError => {
          // handle error here
          dispatch(setLoading(false));
          Alert.alert('Oops', 'Something went wrong');
        });
    } else {
      Alert.alert('', 'Please enter a valid Email address', [
        {text: 'Okay', style: 'cancel'},
      ]);
    }
  };

  return (
    <View>
    
    <HeaderInner
    type={"findCourse"}
    title={'Forgot Password'}
    back={true}
    removeRightHeader={true}
    backroute={routes.name}
    navigation={navigation}

    />
    
    <KeyboardAwareScrollView style={{marginTop: config.headerHeight}} keyboardShouldPersistTaps={'handled'}>
      <View style={styles.container}>
        
        
          {/* <View style={styles.view}>
            <Image
              style={styles.backgroundImage}
              source={require('@images/toolbar_inner_back.png')}
            />
          </View> */}
          <View style={styles.subContainer}>
          {/* <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("LoginScreen")}
            >
            <Image
              source={require('@images/left_arrow.png')}
              style={styles.backButtonIcon}
            />
          </TouchableOpacity> */}

          <View style={styles.contentWrapper}>
            <View style={{marginTop: 40}}>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subTitle}>
                Enter your Email address to continue...
              </Text>
            </View>

            {/* <Text style={styles.inputLabel}>Email Address</Text> */}
            {/* <TextInput
          label="Email Address"
          mode="outlined"
            style={styles.input}
            onChangeText={text => setEmail(text)}
            ></TextInput> */}
            <View style={styles.formInput}>
            <TextField
              //   onSubmitEditing={() => {
              //     this.doFgtPassword();
              //   }}
              label="Email Address"
              mode="outlined"
              onChangeText={(text: string) => setEmail(text)}
              //textAlignVertical="top"
              //baseColor = '#C91F35'
              // value={email}
              // editable={true}
              // keyboardType="email-address"
              // autoCapitalize="none"
              // returnKeyType="next"
              // autoCorrect={false}
              // selectTextOnFocus={false}
            />
</View>
            <Text style={styles.instructions}>
              Password reset instructions will be sent to your registered email
              address.
            </Text>

            <View>
              <TouchableHighlight
                underlayColor={brandColor}
                onPress={handleForgotPassword}
                style={style.styles.submit}>
                <Text style={style.styles.submitText}>Submit</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        
      </View>
      <View style={{height:60}}/>
     
    </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#ffffff',
    height:height
    
    // height:height-109,
  },
  subContainer: {
    marginHorizontal:16,
    // borderColor:'#e13',
    // borderWidth:1
  },

  backgroundImage: {
    flex: 1,
   marginTop:-80,
    width: wp('100%'),
    // height: wp('100%'),
    resizeMode: 'cover',
    flexDirection: 'row',
  },
  inputLabel: {
    fontFamily: helper.switchFont('medium'),
    fontSize: 14,
    color: 'rgb(44, 54, 65)',
    marginTop: 35,
    marginBottom: -26,
  },
  view: {
    height: 100,
  },
  backButton: {
    width: 50,
    height: 50,
    marginTop: -55,
    marginLeft: 24,
  },
  backButtonIcon: {
    width: 23,
    height: 18,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: font1,
    fontWeight:'700',
    textAlign:'center',
    fontFamily: helper.switchFont('light'),
  },
  subTitle: {
    fontSize: 16,
    color: font2,
    fontWeight:'400',
    textAlign:'center',
    marginTop:8,
    fontFamily: helper.switchFont('regular'),
  },
  instructions: {
    fontSize: 12,
    lineHeight:18,
    color: font2,
    fontWeight:'500',
    fontFamily: helper.switchFont('medium'),
    marginTop: 8,
  },
  // contentWrapper: {
  //   marginLeft: 24,
  //   marginRight: 10,
  //   flex: 1,
  // },
  formInput:{
    marginTop:24
  }
});
