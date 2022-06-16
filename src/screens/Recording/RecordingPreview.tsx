import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import HeaderInner from '../../components/HeaderInner';
import StyleCSS from '../../styles/style';
import Video from 'react-native-video';
import Config from '../../config/Config';
import VideoPlayer from 'react-native-video-player';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParamList } from '../../navigation/Navigators';

type Props = NativeStackScreenProps<RootParamList, 'RecordingPreview'>;


export default function RecordingPreview({navigation, route}: Props) {
  const allVideos = route.params?.data;
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [relatedVideos, setRelatedVideos] = useState([]);

  console.log(allVideos);
  console.log(selectedVideo);
  console.log(relatedVideos)

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
                video.class_name !== selectedVideo.class_name
                )}),
            );
          }
  }, [selectedVideo]);
  return (
    <>
      <HeaderInner
        type={'findCourse'}
        logo={false}
        back={true}
        title={'Recordings'}
        navigation={navigation}
      />
     
        <View style={styles.main}>
          <View>
            <Video // Can be a URL or a local file.
              controls
              resizeMode="cover"
              // paused={true}
              source={{uri: selectedVideo && selectedVideo.video_url}} // Store reference
              onError={() => {
                console.log('not loading');
              }} // Callback when video cannot be loaded
              style={{height: 220, alignSelf: 'center', width: '100%'}}
              //                     video={{ uri: selectedVideo && selectedVideo.video_url }}
              // // videoWidth={100%'}
              // videoHeight={700}
            />
            <ScrollView>
            {selectedVideo ? <View style={styles.selectedVideoInfoWrapper}>
                <Text style={[StyleCSS.styles.contentText, StyleCSS.styles.fw700, StyleCSS.styles.font16]}>{selectedVideo.class_name}</Text>
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
                    </View>
                    <View style={{marginLeft: 16, width: '70%'}}>
                      <Text
                        style={[
                          StyleCSS.styles.contentText,
                          StyleCSS.styles.fw700,
                        ]}>
                        {vid.class_name}
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
