import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal
} from 'react-native';
import BottomNavigation from '../../components/BottomNavigation';
import {brandColor, font1} from '../../styles/colors';
import HeaderInner from '../../components/HeaderInner';
import {stylingProps} from 'native-base/lib/typescript/theme/tools';
import Config from '../../config/Config';
import ApiGateway from '../../config/apiGateway';
import {useSelector} from 'react-redux';
import {userState} from '../../reducers/user.slice';
import {useAppDispatch} from '../../app/store';
import {
  getStudentRecording,
  getTeacherRecording,
  recordingState,
  setCourses,
} from '../../reducers/recording.slice';
import {loaderState, setPageLoading} from '../../reducers/loader.slice';
import PageLoader from '../../components/PageLoader';
import VideoPlayer from 'react-native-video-player';
import Video from 'react-native-video';
import StyleCSS from '../../styles/style';
import CustomDropdown from '../../components/CustomDropdown';
import { getTimeMeasureUtils } from '@reduxjs/toolkit/dist/utils';
import CustomStatusBar from '../../components/CustomStatusBar';

export interface RecordingDataInterface {
  course_slug: string|null;
  user?: string|null;
  userToken: string;
}

export default function Recording({route, navigation}: any) {
  const {userData} = useSelector(userState);
  const {courses} =useSelector(recordingState)
  const dispatch = useAppDispatch();
  const {pageLoading} = useSelector(loaderState);
  const [recordings, setRecordings] = useState<any>(null);
  const [learners, setLearners] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courseFilter, setCourseFilter] = useState<any>([]);
  const [learnersFilter, setLearnersFilter] = useState<any>([]);
  const [selectedLearner, setSelectedLearner] = useState<any>(null);
const [c, setC] = useState<null|string>(null);
const [l, setL]= useState<null|string>(null);

//student api call

useEffect(()=>{
  let data: RecordingDataInterface;
  

  if (userData.user_type === 'S') {
    dispatch(setPageLoading(true));
    data = {
      course_slug: selectedCourse ? selectedCourse.label : null,
      userToken: userData.token,
    };

    dispatch(getStudentRecording(data))
      .unwrap()
      .then(response => {
        if (response.data.status === 'success') {
          dispatch(setPageLoading(false));
          setRecordings(response.data.data);
          dispatch(setCourses(response.data.extra_data.courses));
        } else if (response.data.status === 'failure') {
          dispatch(setPageLoading(false));
        }
      })
      .catch(() => {
        dispatch(setPageLoading(false));
      });
  }
},[ selectedCourse])

useEffect(()=>{
  let data: RecordingDataInterface;
    
    if (userData.user_type === 'T') {
      dispatch(setPageLoading(true));
      data = {
        course_slug: c ,//selectedCourse ? selectedCourse.label : 
        userToken: userData.token,
        user: l //selectedLearner ? selectedLearner.label : '',
      };

      dispatch(getTeacherRecording(data))
        .unwrap()
        .then(response => {
          dispatch(setPageLoading(false));

          if (response.data.status === 'success') {
            setRecordings(response.data.data);
            dispatch(setCourses(response.data.extra_data.courses));
          } else if (response.data.status === 'failure') {
            dispatch(setPageLoading(false));
          }
        })

        .catch(() => {
          dispatch(setPageLoading(false));
        });
    }
  },[c,l])


  useEffect(() => {
    if (courses && courses.length > 0) {
      // if(courseFilter.length!==0){ setCourseFilter([])}
      if(selectedCourse===null){
        setSelectedCourse({label:`${courses[0].seo_slug_url}`, value:`${courses[0].title}`})
        if(userData.user_type==='T'){
          if(selectedLearner === null){
            setSelectedLearner({label: courses[0].students[0].seo_slug_url,
              value: courses[0].students[0].name})
          }
        }
        setPageLoading(false)
      }
      let temp=[];
      for (let i = 0; i < courses.length; i++) {
        temp.push({
          label: `${courses[i].seo_slug_url}`,
          value: `${courses[i].title}`,
        });
      }
      setCourseFilter(temp);
    }
  }, [courses]);

  // useEffect(()=>{
  //   setLearnersFilter([]);
  // }, [selectedCourse])

  
  
  const handleVideoSelect = (item: any) => {
    setSelectedVideo(item);
    navigation.navigate('RecordingPreview', {
      item:item,
      data: recordings

    })
    // setShowVideoModal(true);
  };

  const getSelectedCourse = (data: any) => {
    setSelectedCourse(data[0]);
    if(userData.user_type === 'T'){
      setSelectedLearner(null);
      setL(null);
    }
  };

  const getSelectedLearner = (data: any) => {
    setSelectedLearner(data[0]);
  };


const applyTeacherFilter = () => {
setC(selectedCourse.label);
setL(selectedLearner.label);
}

  useEffect(() => {
    if (selectedCourse !== null && userData.user_type === 'T') {
      let selCourse = courses.filter(
        (item: any) => item.seo_slug_url === selectedCourse.label,
      )[0];
      
      let temp=[];
      for (let i = 0; i < selCourse.students.length; i++) {
        temp.push({
          label: selCourse.students[i].seo_slug_url,
          value: selCourse.students[i].name,
        });
      }
      setLearnersFilter(temp);
    }
  }, [selectedCourse]);

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
    {pageLoading?<PageLoader/> :
    <>
    <CustomStatusBar/>
      <HeaderInner
        type={'findCourse'}
        logo={userData.user_type === 'S' ? true : false}
        back={userData.user_type === 'T' ? true : false}
        title={'Recordings'}
        navigation={navigation}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.main}>
          <CustomDropdown
            topLabel={selectedCourse ? 'Course' : undefined}
            config={{color: '#fff'}}
            onChangeVal={getSelectedCourse}
            data={courseFilter}
            selectedIds={[]}
            label={selectedCourse ? selectedCourse.value : 'Course'}
            backTitle={'Course '}
          />
          {//learnersFilter.length>0 && 
          userData.user_type === 'T' ? (
            <View style={{marginTop: 24}}>
              <CustomDropdown
                topLabel={selectedLearner ? 'Learner' : undefined}
                config={{color: '#fff'}}
                onChangeVal={getSelectedLearner}
                data={learnersFilter}
                selectedIds={[]}
                label={selectedLearner ? selectedLearner.value : 'Learner'}
                backTitle={'Learners '}
              />
              <TouchableOpacity disabled={selectedCourse===null || selectedLearner===null} style={[StyleCSS.styles.submitButton, {marginTop:16, marginBottom:0, width:'25%', backgroundColor: `${selectedCourse===null || selectedLearner===null ? '#ccc' :brandColor}`}]} onPress={applyTeacherFilter}>
                <Text style={StyleCSS.styles.submitButtonText}>Filter</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {recordings ? (
            <View>
              <Text style={[StyleCSS.styles.labelText,{ marginTop:16}, StyleCSS.styles.font12]}>Recorded Classes ({recordings.length})</Text>
              {recordings.length === 0 ?<Text style={[StyleCSS.styles.labelText, styles.noRecording]}>No recording found</Text>:null  }
              {recordings.map((item: any) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleVideoSelect(item)}
                    style={[StyleCSS.styles.flexDirRow, {marginTop: 16}]}>
                    <View style={{width:'30%'}}>
                      
                     
                      <Video // Can be a URL or a local file.
                        //  controls
                        resizeMode="cover"
                        paused={true}
                        source={{uri: item.video_url}} // Store reference
                        onError={() => {
                        }} // Callback when video cannot be loaded
                        style={{height: 80, width: 100, borderRadius: 8}}
                      />
                      <View style={{position:'absolute', bottom:8, left:8,paddingTop:5, paddingBottom:4, backgroundColor:'rgba(0, 6, 12,0.8)', borderRadius:8, paddingHorizontal:8 }}>
                                            <Text style={[StyleCSS.styles.contentText, StyleCSS.styles.font12, {color:'#fff', }]}>{getVideoDuration(item.recording_duration)}</Text>
                                            </View>
                    </View>
                    <View style={{marginLeft: 16, width:'70%'}}>
                      <Text
                        style={[StyleCSS.styles.contentText, StyleCSS.styles.fw700]}>
                        {item.class_name} {item.recording_name ?item.recording_name : '' }
                      </Text>
                      <Text
                        style={[
                          StyleCSS.styles.contentText,
                          StyleCSS.styles.fw400,
                          {marginTop:6}
                        ]}>
                        {item.start_date}
                      </Text>
                      <Text
                        style={[
                          StyleCSS.styles.labelText,
                          StyleCSS.styles.font12,
                          
                          {flexWrap:'wrap', marginTop:8}
                        ]}>
                        {item.start_time} - {item.end_time} | {item.timezone}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
              <View style={{marginBottom:80}}></View>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {userData.user_type === 'S' ? (
        <BottomNavigation navigation={navigation} selected={'R'} />
      ) : null}
      </>
                    }
    </>
                    
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginTop: Config.headerHeight,
    backgroundColor: '#fff',
  },
  main: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  noRecording:{
    textAlign:'center',
    marginTop:100
  }
});
