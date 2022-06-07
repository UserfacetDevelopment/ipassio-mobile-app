import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, ToastAndroid} from 'react-native';
import { useSelector } from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import { userState } from '../reducers/user.slice';
import StyleCSS from '../styles/style';
import CustomImage from './CustomImage';
import Config from '../config/Config';

interface ShareLinkPopupInterface {
  class_url: string,
  taught_on_code: string,
  setShareLinkPopup: any;
}


export default function ShareLinkPopup({class_url, taught_on_code, setShareLinkPopup}: ShareLinkPopupInterface) {

const {userData} = useSelector(userState)

  return (
    <View style={{backgroundColor:'#fff', alignSelf:'center', justifyContent:'center', padding:16, borderRadius:8, marginHorizontal:16}}>
        <TouchableOpacity onPress={()=>{setShareLinkPopup(false)}} style={{alignSelf:'flex-end'}}>
        <CustomImage
                        height={24}
                        width={24}
                        uri={`${Config.media_url}close.svg`}
                      />
        </TouchableOpacity>
        {taught_on_code !== "I" ?  <Text style={[StyleCSS.styles.contentText, StyleCSS.styles.font18, StyleCSS.styles.fw700, {marginBottom:8}]}>Share the Link</Text> : <Text style={[StyleCSS.styles.contentText, StyleCSS.styles.font18, StyleCSS.styles.fw700, {marginBottom:8}]}>Here's the link to your class</Text>}
        {taught_on_code !== "I" ? <Text style={[StyleCSS.styles.contentText,{marginBottom:16}]}>{`Connect with your ${
                    userData.user_type === "T" ? "student" : "teacher"
                  } and share the link for the class.`}</Text> : <Text  style={[StyleCSS.styles.contentText,{marginBottom:16}]}>{`The ${
                    userData.user_type === "T" ? "student" : "teacher"
                  } will see this link and can join the class. If needed, you can copy and share this link with the ${userData.user_type === "T" ? "student" : "teacher"}.`}</Text>}
                {class_url ? (
                    <View style={styles.sessionURL}>
                    <Text
                      selectable={true}
                      style={[StyleCSS.styles.contentText, {flex: 1, marginTop: 0}]}>
                      { class_url.length > 30
                        ? `${class_url.substring(0, 30)}...`
                        : class_url}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        Toast.show({
                            type: 'info',
                            text1: 'Copied',
                            // text2: 'This is some something 👋'
                          });
                        Clipboard.setString(class_url);
                      }}
                      style={styles.copy}>
                      <CustomImage
                        height={24}
                        width={24}
                        uri={`${Config.media_url}copy.svg`}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
       
    </View>
  )
}

const styles=StyleSheet.create({
    copy: {
        width: 48,
        alignItems: 'flex-end',
      },
      sessionURL: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    
        marginTop: 5,
        padding: 15,
        backgroundColor: '#F7F9FA',
        borderRadius: 12,
      },
})