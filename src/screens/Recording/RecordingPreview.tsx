import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import HeaderInner from '../../components/HeaderInner';
import StyleCSS from '../../styles/style';
import Video from 'react-native-video';
import Config from '../../config/Config';
import VideoPlayer from 'react-native-video-player';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParamList } from '../../navigation/Navigators';
import { loaderState, setLoading } from '../../reducers/loader.slice';
import { useSelector } from 'react-redux';
import CustomStatusBar from '../../components/CustomStatusBar';

type Props = NativeStackScreenProps<RootParamList, 'RecordingPreview'>;


export default function RecordingPreview({navigation, route}: Props) {
  const allVideos = route.params?.data;
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
const {loading} = useSelector(loaderState);

  const handleVideoSelect = (item: any) => {
    setSelectedVideo(item);
  };

  useEffect(()=>{
      setSelectedVideo(route.params?.item)
  },[])


  useEffect(() => {
      if(selectedVideo){

            setRelatedVideos(
            allVideos.filter((video: any) => {
                return(
                video.video_url !== selectedVideo.video_url
                )}),
            );
          }
  }, [selectedVideo]);

  const getVideoDuration=(duration: number) : string =>{

    let videoDuration = '';
    
    let min = parseInt(duration/60);
    let hour=null;
    if(min>60){
    hour = parseInt(min/60);
    min = min%60;
    }
    let sec = duration%60;
    if(hour){
      videoDuration = `${hour}:${min<10 ? '0'+min : min}:${sec<10 ? '0'+sec : sec}`;
    }
    else if (min!==0){
      videoDuration = `${min<10 ? '0'+min : min}:${sec<10 ? '0'+sec : sec}`;

    }
    else if(sec!==0){
      videoDuration = `${sec<10 ? '0'+sec : sec} seconds`;
    }
     
     return videoDuration;
  }

  return (
    <>
    <StatusBar translucent/>
      <HeaderInner
        type={'findCourse'}
        logo={false}
        back={true}
        title={'Recordings'}
        navigation={navigation}
      />
     
        <View style={styles.main}>
          <View>
              {loading? <Text>Loading</Text>: null}
            <Video // Can be a URL or a local file.
              controls={true}
              onBuffer={()=>setLoading(true)}
              onLoad={()=>setLoading(false)}
              resizeMode="cover"
              fullscreen={true}
              // paused={true}
              source={{uri: selectedVideo && selectedVideo.video_url}} // Store reference
              onError={() => {
                console.log('not loading');
              }} // Callback when video cannot be loaded
              style={{height: 220, alignSelf: 'center', width: '100%'}}
            //                       video={{ uri: selectedVideo && selectedVideo.video_url }}
            //   // videoWidth={100%'}
            //   videoHeight={700}
            />
            <ScrollView>
            {selectedVideo ? <View style={styles.selectedVideoInfoWrapper}>
                <Text style={[StyleCSS.styles.contentText, StyleCSS.styles.fw700, StyleCSS.styles.font16]}>{selectedVideo.class_name} {selectedVideo.recording_name ?selectedVideo.recording_name : '' }</Text>
                <Text
                        style={[
                          StyleCSS.styles.contentText,
                          StyleCSS.styles.fw400,
                          {marginTop: 6},
                        ]}>
                        {selectedVideo.start_date}
                      </Text>
                      <Text
                        style={[
                          StyleCSS.styles.labelText,
                          StyleCSS.styles.font12,

                          {flexWrap: 'wrap', marginTop: 8},
                        ]}>
                        {selectedVideo.start_time} - {selectedVideo.end_time} | {selectedVideo.timezone}
                      </Text>

            </View> : null}
            <View style={StyleCSS.styles.lineStyleLight}/>
            <View style={styles.safecontainer}>
               
              <Text
                style={[
                  StyleCSS.styles.labelText,
                  {marginTop: 16},
                  StyleCSS.styles.font12,
                ]}>
                Related recordings ({relatedVideos.length})
              </Text>
              {relatedVideos.map((vid: any) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleVideoSelect(vid)}
                    style={[StyleCSS.styles.flexDirRow, {marginTop: 16}]}>
                    <View style={{width: '30%'}}>
                      <Video // Can be a URL or a local file.
                        //  controls
                        resizeMode="cover"
                        paused={true}
                        source={{uri: vid.video_url}} // Store reference
                        onError={() => {
                          console.log('not loading');
                        }} // Callback when video cannot be loaded
                        style={{height: 80, width: 100, borderRadius: 8}}
                      />
                      <View style={{position:'absolute', bottom:8, left:8,paddingTop:5, paddingBottom:4, backgroundColor:'rgba(0, 6, 12,0.8)', borderRadius:8, paddingHorizontal:8 }}>
                                            <Text style={[StyleCSS.styles.contentText, StyleCSS.styles.font12, {color:'#fff', }]}>{getVideoDuration(vid.recording_duration)}</Text>
                                            </View>
                    </View>
                    <View style={{marginLeft: 16, width: '70%'}}>
                      <Text
                        style={[
                          StyleCSS.styles.contentText,
                          StyleCSS.styles.fw700,
                        ]}>
                        {vid.class_name}  {vid.recording_name ?vid.recording_name : '' }
                      </Text>
                      <Text
                        style={[
                          StyleCSS.styles.contentText,
                          StyleCSS.styles.fw400,
                          {marginTop: 6},
                        ]}>
                        {vid.start_date}
                      </Text>
                      <Text
                        style={[
                          StyleCSS.styles.labelText,
                          StyleCSS.styles.font12,

                          {flexWrap: 'wrap', marginTop: 8},
                        ]}>
                        {vid.start_time} - {vid.end_time} | {vid.timezone}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
              <View style={{marginBottom: 316}}></View>
            </View>
            </ScrollView>
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
  selectedVideoInfoWrapper:{
padding:16
  },
  safecontainer: {
    paddingHorizontal: 16,
  },
});
