import React, {useState} from 'react'
import {Text, View, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native'
import HeaderInner from '../../components/HeaderInner'
import { font1, font2 } from '../../styles/colors'
import Google from '../../assets/images/google-logo.svg'
import StyleCSS from '../../styles/style'
import {TextInput, ProgressBar} from 'react-native-paper';
import RNPasswordStrengthMeter from 'react-native-password-strength-meter';

export default function Signup() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [viewPassword, setViewPassword] = useState<boolean>(false);
// const onChange = (password, score, { label, labelColor, activeBarColor }) => {
//     console.log(password, score, { label, labelColor, activeBarColor });
//   }
  return (
  <>
  <HeaderInner
  type={'findCourse'}
  logo={true}
  title={'Sign Up'}
  />
  <ScrollView style={styles.scrollView}>
  <View style={styles.main}>
<Text>Become a Student</Text>
<TouchableOpacity
            // onPress={handleGoogleSignIn}
            style={styles.googleButton}>
             <View style={styles.googleIconView}> 
              {/* <Image
                style={styles.googleIcon}
                source={require('@images/google.png')}
              /> */}
              <Google/>
            
            <Text style={styles.googleButtonText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>
          <Text>OR</Text>
          <TextInput
          label='Username/Email'
          mode='outlined'
          theme={{colors: {primary: font2}}}
        //   onFocus={() => setActive(true)}
        //   onBlur={() => setActive(false)}
            style={StyleCSS.styles.input}
            onChangeText={text => {
              setUsername(text);
            }}></TextInput>
          {/* <Text style={styles.inputLabel}>Password</Text> */}
          <TextInput
          label='Password'
          mode='outlined'
          theme={{colors: {primary: font2}}}
          style={[StyleCSS.styles.input, {marginBottom:0}]}
            secureTextEntry={!viewPassword}
            //style={styles.inputpassword}
            onChangeText={text => {
              setPassword(text);
            }}></TextInput>
          {password.length ? (
            <TouchableOpacity
              style={styles.inputViewIconWrapper}
              onPress={() => {
                setViewPassword(!viewPassword);
              }}>
              <Image
                style={styles.inputViewIcon}
                source={
                  viewPassword
                    ? require('@images/hide_icon.png')
                    : require('@images/view_icon.png')
                }
              />
            </TouchableOpacity>
          ) : null}
          <ProgressBar style={{ marginTop:200}} progress={password.length/100} color="#00BCD4" />
  </View>
  </ScrollView>

  </>
  )
}

const styles= StyleSheet.create({
main:{
    backgroundColor:'#fff',
    paddingHorizontal:16,
},
scrollView:{
marginTop:109
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
})