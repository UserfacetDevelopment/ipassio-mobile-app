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
} from 'react-native';
import {
  TwilioVideoLocalView, // to get local view
  TwilioVideoParticipantView, //to get participant view
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import {Camera, useCameraDevices, CameraDevice} from 'react-native-vision-camera';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {textContent} from 'domutils';
import {secondaryColor} from '../../styles/colors';
import StyleCSS from '../../styles/style';
import {useDispatch, useSelector} from 'react-redux';
import {fetchToken} from '../../reducers/twilio.slice';
import {AttribTagNames} from 'react-native-render-html';
import {userState} from '../../reducers/user.slice';
import HeaderInner from '../../components/HeaderInner';
import Config from '../../config/Config';
import MicOn from '../../assets/images/twilio/mic.svg';
import MicOff from '../../assets/images/twilio/mic_off.svg';
import VideoOn from '../../assets/images/twilio/video.svg';
import VideoOff from '../../assets/images/twilio/video_off.svg';

export interface GetTokenInterface {
  room_name: string;
  create_conversation: boolean;
  user_identity: string;
}

const width = Dimensions.get('screen').width;

export default function VideoConferencing({navigation, route}) {
  console.log(route.params?.data);
  const dispatch = useDispatch();
  const {userData} = useSelector(userState);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [token, setToken] = useState('');
  const [roomName, setRoomName] = useState(route.params?.data.class_url);
  const devices = useCameraDevices('wide-angle-camera')
  const device = devices.front;
  const twilioRef: React.MutableRefObject<any> = useRef(null);
console.log(devices);
  useEffect(() => {
    getPermission();
  });
  const getPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const userResponse = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        return userResponse;
      }
    } catch (err) {
      console.log(err);
    }
    return null;
  };

  console.log(token);

  const onConnectButtonPress = async () => {
    console.log('in on connect button preess');
    let data: GetTokenInterface = {
      room_name: roomName,
      create_conversation: false,
      user_identity: userData.first_name + ' ' + userData.last_name,
    };

    await dispatch(fetchToken(data))
      .then((res: any) => {
        setToken(res.payload.data.token);

        console.log('res', res.payload.data.token);
        twilioRef.current.connect({accessToken: res.payload.data.token});
        setStatus('connecting');
      })
      .catch((error: any) => {
        console.log(error);
      });

    console.log(status);
  };

  const onEndButtonPress = () => {
    twilioRef.current.disconnect();
    console.log(status)
  };

  const onMuteButtonPress = () => {
    // on cliking the mic button we are setting it to mute or viceversa
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled: boolean) => setIsAudioEnabled(isEnabled));
  };

  const onFlipButtonPress = () => {
    // switches between fronst camera and Rare camera
    twilioRef.current.flipCamera();
  };
  const onRoomDidConnect = () => {
    console.log('onRoomDidConnect: ', roomName);

    setStatus('connected');
    // console.log("over");
  };

  const onVideoStateChange = () => {
    twilioRef.current
      .setIsLocalVideoEnabled(!isVideoEnabled)
      .then((isEnabled: boolean) => setIsVideoEnabled(!isEnabled));
  };

  const onRoomDidDisconnect = ({roomName, error}) => {
    console.log('[Disconnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const onRoomDidFailToConnect = error => {
    console.log('[FailToConnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const onParticipantAddedVideoTrack = ({participant, track}) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);

    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          {participantSid: participant.sid, videoTrackSid: track.trackSid},
        ],
      ]),
    );
    // call everytime a participant joins the same room
    console.log('videoTracks', videoTracks);
  };

  const onParticipantRemovedVideoTrack = ({participant, track}) => {
    // gets called when a participant disconnects.
    console.log('onParticipantRemovedVideoTrack: ', participant, track);

    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);

    setVideoTracks(videoTracksLocal);
  };

  console.log(twilioRef);

  return (
    <>
      <HeaderInner
        title={''}
        back={true}
        logo={false}
        type={'findCourse'}
        navigation={navigation}
      />
      <View style={styles.container}>
        {status === 'disconnected' && (
          <View style={styles.name}>
            <Text
              style={[
                StyleCSS.styles.contentText,
                StyleCSS.styles.font18,
                StyleCSS.styles.fw500,
              ]}>
              Join as {userData.first_name} {userData.last_name}
            </Text>
            <View style={styles.videoView}>
              {device == null ? <Text>Loading ... </Text>:  
              <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
            />}
            
            </View>
            <View style={[StyleCSS.styles.fdrCenter]}>
              <TouchableOpacity onPress={onMuteButtonPress}>
                {isAudioEnabled ? <MicOn /> : <MicOff />}
              </TouchableOpacity>
            
            <TouchableOpacity onPress={onMuteButtonPress}>
                {isAudioEnabled ?<Text>Flip</Text> :<Text>Flip</Text>}
              </TouchableOpacity>
            </View>
            {/* <View>
              <TouchableOpacity onPress={onVideoStateChange}>
                {isVideoEnabled ? <VideoOff /> : <VideoOn />}
              </TouchableOpacity>
            </View> */}

            <TouchableOpacity
              style={styles.button}
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
        )}

        {(status === 'connected' || status === 'connecting') && (
          <View style={styles.callContainer}>
            {status === 'connected' && (
              <View style={styles.remoteGrid}>
                {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                  return (
                    //   <TwilioVideoLocalView
                    //   enabled={true}
                    //   style={styles.remoteVideo}
                    // />
                    <TwilioVideoParticipantView
                      style={styles.remoteVideo}
                      key={trackSid}
                      trackIdentifier={trackIdentifier}
                    />
                  );
                })}
              </View>
            )}
            <View style={styles.localVideoWrapper}>
            <TwilioVideoLocalView
                enabled={status === 'connected'}
                style={styles.localVideo}
              />
              </View>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[styles.optionButton, {backgroundColor: 'red', alignSelf:'flex-end'}]}
                onPress={onEndButtonPress}>
                <Text style={{fontSize: 12, color: '#fff'}}>End</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignSelf:'flex-end'}}
                onPress={onMuteButtonPress}>
                <Text>
                  {isAudioEnabled ? (
                    <View style={{padding: 12, backgroundColor: '#fff', borderRadius:50,}}>
                    <MicOn/>
                  </View>
                  ) : (
                    <View style={{alignSelf:'flex-end'}}>
                      <MicOff />
                    </View>
                  )}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={onFlipButtonPress}>
                <Text style={{fontSize: 12, color: '#fff'}}>Flip</Text>
              </TouchableOpacity>
              
            </View>
          </View>
        )}
        <TwilioVideo
          ref={twilioRef}
          onRoomDidConnect={onRoomDidConnect}
          onRoomDidDisconnect={onRoomDidDisconnect}
          onRoomDidFailToConnect={onRoomDidFailToConnect}
          onParticipantAddedVideoTrack={onParticipantAddedVideoTrack}
          onParticipantRemovedVideoTrack={onParticipantRemovedVideoTrack}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Config.headerHeight,
    backgroundColor: 'white',
  },
  videoView: {
    marginTop: 24,
    height: 250,
    width: '100%',
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  callContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    minHeight: '100%',
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
  button: {
    marginTop: 100,
    backgroundColor: secondaryColor,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingVertical: 10,
  },
  localVideoWrapper:{
      position:'absolute',
      height:'30%',
     bottom:16,
     right:16,
      width: '40%',
      borderRadius:40
  },
  localVideo: {
    height:'100%',
    width: '100%',
  },
  name: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  remoteGrid: {
    flex: 1,
    flexDirection: 'column',
  },
  remoteVideo: {
    width: wp('100%'),
    height: hp('100%'),
    zIndex: 1,
  },
  optionsContainer: {
    position: 'absolute',
    left: 0,
    bottom: 32,
    right: 0,
    height: 60,
    borderWidth:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  optionButton: {
    alignSelf:'flex-end',
    padding:12,
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
});
