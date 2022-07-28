import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableHighlight,
  Button,
  Platform,
  StatusBar,
} from 'react-native';
import {
  TwilioVideoLocalView, // to get local view
  TwilioVideoParticipantView, //to get participant view
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import {
  Camera,
  useCameraDevices,
  CameraDevice,
} from 'react-native-vision-camera';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';
import {brandColor, secondaryColor} from '../../styles/colors';
import StyleCSS from '../../styles/style';
import {useDispatch, useSelector} from 'react-redux';
import {fetchToken, getParticipantList} from '../../reducers/twilio.slice';
import {AttribTagNames} from 'react-native-render-html';
import {getCountryList, userState} from '../../reducers/user.slice';
import HeaderInner from '../../components/HeaderInner';
import Config from '../../config/Config';
import MicOn from '../../assets/images/twilio/mic.svg';
import MicOff from '../../assets/images/twilio/mic_off.svg';
import VideoOn from '../../assets/images/twilio/video.svg';
import VideoOff from '../../assets/images/twilio/video_off.svg';
import EndCall from '../../assets/images/twilio/end_call.svg';
import Flip from '../../assets/images/twilio/flip_camera.svg';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import CustomImage from '../../components/CustomImage';
import Helper from '../../utils/helperMethods';


export interface GetTokenInterface {
    room_name: string;
    create_conversation: boolean;
    user_identity: string;
  }

export default function LoginScreen({navigation, route}) {

    const dispatch = useDispatch();
  const {userData} = useSelector(userState);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [participantArr, setParticipantArr] = useState<Array<any>>([]);
  // const [participants, setParticipants] = useState<number>(0);
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [audioTracks, setAudioTracks] = useState(new Map());
  const [token, setToken] = useState('');
  const [roomName, setRoomName] = useState(route.params?.data.class_url);
  const devices = useCameraDevices('wide-angle-camera');
  const [participantAdded, setParticipantAdded] = useState(false);
  const device = devices.front;
  const twilioRef: React.MutableRefObject<any> = useRef(null);

  const onMuteButtonPress = () => {
   setIsAudioEnabled(!isAudioEnabled);
  };

  const onVideoStateChange = () => {
      setIsVideoEnabled(!isVideoEnabled);
  }

  const onConnectButtonPress = async() => {
    console.log('in on connect button preess');
    let data: GetTokenInterface = {
      room_name: roomName,
      create_conversation: false,
      user_identity: userData.first_name + ' ' + userData.last_name,
      // + ":"+userData.user_token,
    };

    await dispatch(fetchToken(data))
      .then((res: any) => {
        setToken(res.payload.data.token);
        twilioRef.current.getStats();
        console.log(twilioRef.current.getStats());
        console.log('res', res.payload.data.token);
        // twilioRef.current.connect({
        //   accessToken: res.payload.data.token,
        //   enableAudio: isAudioEnabled,
        //   enableVideo: isVideoEnabled,
        // });
        navigation.navigate('Video',{
            token: res.payload.data.token,
            audio: isAudioEnabled,
            video: isVideoEnabled,
            status: status
        })
        setStatus('connecting');
        console.log(status);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  return (
      
    <>
            <HeaderInner
              title={'ipassio Video'}
              back={true}
              logo={false}
              type={'findCourse'}
              removeRightHeader={true}
              navigation={navigation}
            />
            <View style={styles.safeContainer}>
              <View style={styles.name}>
                <Text
                  style={[
                    StyleCSS.styles.contentText,
                    StyleCSS.styles.font18,
                    StyleCSS.styles.fw700,
                  ]}>
                  Join as {userData.first_name} {userData.last_name}
                </Text>
                <View style={styles.videoView}>
                  {device == null ? (
                    <Text>Loading ... </Text>
                  ) : isVideoEnabled ? (
                    <View>
                    <Camera
                      style={styles.fillVideo}
                      device={device}
                      isActive={true}
                    />
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: '#E6ECEF',
                        height: '100%',
                        width: '100%',
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View>
                        <CustomImage
                          style={styles.profile_pic}
                          uri={userData.user_media.profile_pic}
                        />
                      </View>
                      <View style={{position:'absolute',width:'100%', bottom:0, backgroundColor:'rgba(0,0,0,0.614319)'}}>
                      <Text style={{color:'#fff', bottom:8}}>{userData.first_name} {userData.last_name}</Text>
</View>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    StyleCSS.styles.fdrCenter,
                    {
                      justifyContent: 'space-between',
                      marginTop: 24,
                      marginBottom: 40,
                    },
                  ]}>
                  <TouchableOpacity onPress={onMuteButtonPress}>
                    {isAudioEnabled ? <MicOn /> : <MicOff />}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onVideoStateChange}>
                    {isVideoEnabled ? <VideoOn /> : <VideoOff />}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.joinButton}
                    onPress={onConnectButtonPress}>
                    <Text
                      style={[
                        StyleCSS.styles.contentText,
                        StyleCSS.styles.fw700,
                        {color: '#fff', textAlign: 'center'},
                      ]}>
                      Join Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={StyleCSS.styles.lineStyleLight}></View>
              <View style={{padding: 16}}>
                <Text style={StyleCSS.styles.labelText}>Session URL</Text>
                <View style={styles.sessionURL}>
                  <Text
                    selectable={true}
                    style={[
                      StyleCSS.styles.contentText,
                      {flex: 1, marginTop: 0},
                    ]}>
                    {(Config.FrontendURL + Config.videoURL + roomName).length >
                    30
                      ? `${(
                          Config.FrontendURL +
                          Config.videoURL +
                          roomName
                        ).substring(0, 30)}...`
                      : Config.FrontendURL + Config.videoURL + roomName}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Toast.show({
                        type: 'info',
                        text1: 'Copied',
                        // text2: 'This is some something'
                      });
                      Clipboard.setString(
                        Config.FrontendURL + Config.videoURL + roomName,
                      );
                    }}
                    style={styles.copy}>
                    <CustomImage
                      height={24}
                      width={24}
                      uri={`${Config.media_url}copy.svg`}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    safeContainer: {
      marginTop: Config.headerHeight,
      backgroundColor: 'white',
    },
    fillVideo: {
      height: '100%',
      borderRadius: 8,
      width: '100%',
    },
    videoView: {
      marginTop: 16,
      height: 335,
      width: '100%',
      borderRadius: 8,
      backgroundColor: '#E6ECEF',
    },
    callContainer: {
      flex: 1,
      top: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#3A424A',
      height: '90%',
    },
    flipCamera: {
      position: 'absolute',
      zIndex: 4,
      top: 54,
      right: 24,
    },
    input: {
      height: 50,
      borderWidth: 1,
      marginRight: 70,
      marginLeft: 70,
      marginTop: 50,
      textAlign: 'center',
      backgroundColor: 'white',
    },
    joinButton: {
      backgroundColor: brandColor,
      borderRadius: 8,
      paddingVertical: 11,
      paddingHorizontal: 24,
    },
    localVideoWrapper: {
      position: 'absolute',
      height: 180,
      bottom: 16,
      right: 16,
      width: 120,
      borderRadius: 8,
      zIndex: 3,
      backgroundColor: 'black',
    },
    localVideo: {
      height: '100%',
      width: '100%',
      borderRadius: 8,
    },
    name: {
      paddingHorizontal: 72,
      paddingTop: 40,
    },
  
    remoteGrid: {
      // borderWidth:8,
      width: '100%',
      position: 'relative',
      zIndex: 0,
      flex: 1,
      flexDirection: 'column',
    },
    remoteVideo: {
      width: wp('100%'),
      height: hp('90%'),
      borderBottomWidth: 2,
      // width:'100%',
      // height:'100%',
      zIndex: 1,
    },
    optionsContainer: {
      // position: 'absolute',
      // left: 0,
      // bottom:0,
      // right: 0,
      // height: 60,
      // backgroundColor:'black',
      paddingHorizontal: 20,
      height: '10%',
      // borderWidth:1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'black',
      justifyContent: 'space-between',
      zIndex: 3,
    },
    optionButton: {
      alignSelf: 'flex-end',
      padding: 12,
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 100 / 2,
      backgroundColor: secondaryColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    spacing: {
      padding: 10,
    },
    inputLabel: {
      fontSize: 18,
    },
    buttonContainer: {
      height: 45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      width: wp('90%'),
      borderRadius: 30,
    },
    loginButton: {
      backgroundColor: '#1E3378',
      width: wp('90%'),
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 20,
      marginTop: 10,
    },
    Buttontext: {
      color: 'white',
      fontWeight: '500',
      fontSize: 18,
    },
    inputBox: {
      borderBottomColor: '#cccccc',
      fontSize: 16,
      width: wp('95%'),
      borderBottomWidth: 1,
    },
    sessionURL: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  
      marginTop: 5,
      padding: 15,
      backgroundColor: '#F7F9FA',
      borderRadius: 12,
    },
    copy: {
      width: 48,
      alignItems: 'flex-end',
    },
  
    profile_pic: {
      height: 140,
      width: 140,
      borderRadius: 98,
    },
    profile_pic_mini:{
      height: 64,
      width: 64,
      borderRadius: 98,
    },
    avatar: {
      height: 160,
      width: 160,
      borderRadius: 98,
      backgroundColor: '#f5b342',
      alignItems: 'center',
      marginTop: height / 2 - 160,
      justifyContent: 'center',
      alignSelf: 'center',
    },
  });