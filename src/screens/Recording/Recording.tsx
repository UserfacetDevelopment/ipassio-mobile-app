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
import {font1} from '../../styles/colors';
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

export interface RecordingDataInterface {
  course_slug: string;
  user?: string;
  userToken: string;
}

export default function Recording({route, navigation}: any) {
  const {userData} = useSelector(userState);
  const {courses} =useSelector(recordingState)
  const dispatch = useAppDispatch();
  const {pageLoading} = useSelector(loaderState);
  const [recordings, setRecordings] = useState<any>(null);
  // const [courses, setCourses] = useState<any>(null);
  const [learners, setLearners] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courseFilter, setCourseFilter] = useState<any>([]);
  const [learnersFilter, setLearnersFilter] = useState<any>([]);
  const [selectedLearner, setSelectedLearner] = useState<any>(null);
const [c, setC] = useState('');
const [l, setL]= useState('');

//student api call

useEffect(()=>{
  let data: RecordingDataInterface;
  dispatch(setPageLoading(true));

  if (userData.user_type === 'S') {
    data = {
      course_slug: selectedCourse ? selectedCourse.label : '',

      userToken: userData.token,
    };

    dispatch(getStudentRecording(data))
      .unwrap()
      .then(response => {
        console.log(response);
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
    dispatch(setPageLoading(true));
    if (userData.user_type === 'T') {
      data = {
        course_slug: c ,//selectedCourse ? selectedCourse.label : 
        userToken: userData.token,
        user: l//selectedLearner ? selectedLearner.label : '',
      };

      dispatch(getTeacherRecording(data))
        .unwrap()
        .then(response => {
          dispatch(setPageLoading(false));

          console.log(response);
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
  },[l,c])

  // useEffect(() => {
  //   let data: RecordingDataInterface;
  //   dispatch(setPageLoading(true));

  //   if (userData.user_type === 'S') {
  //     data = {
  //       course_slug: //selectedCourse ? selectedCourse.label : 
  //       'hello-you-can-learn-all-ipassio',

  //       userToken: 'e1965cac2d4742d8e4a770a3f5c25a1bfe7169f1',
  //     };

  //     dispatch(getStudentRecording(data))
  //       .unwrap()
  //       .then(response => {
  //         console.log(response);
  //         if (response.data.status === 'success') {
  //           dispatch(setPageLoading(false));

  //           setRecordings(response.data.data);
  //           dispatch(setCourses(response.data.extra_data.courses));
  //         } else if (response.data.status === 'failure') {
  //           dispatch(setPageLoading(false));
  //         }
  //       })
  //       .catch(() => {
  //         dispatch(setPageLoading(false));
  //       });
  //   } else if (userData.user_type === 'T') {
  //     data = {
  //       course_slug: //c//selectedCourse ? selectedCourse.label : 
  //       'hello-you-can-learn-all-ipassio',
  //       userToken: '1a5d769885b79a0779102afdf8e239e5dd693fec',
  //       user: l//selectedLearner ? selectedLearner.label : '',
  //     };

  //     dispatch(getTeacherRecording(data))
  //       .unwrap()
  //       .then(response => {
  //         dispatch(setPageLoading(false));

  //         console.log(response);
  //         if (response.data.status === 'success') {
  //           setRecordings(response.data.data);
  //           dispatch(setCourses(response.data.extra_data.courses));
  //         } else if (response.data.status === 'failure') {
  //           dispatch(setPageLoading(false));
  //         }
  //       })

  //       .catch(() => {
  //         dispatch(setPageLoading(false));
  //       });
  //   }
  // }, [selectedCourse, l, c]);

  useEffect(() => {
    if (courses && courses.length > 0) {
      // if(courseFilter.length!==0){ setCourseFilter([])}
      for (let i = 0; i < courses.length; i++) {
        courseFilter.push({
          label: `${courses[i].seo_slug_url}`,
          value: `${courses[i].title}`,
        });
      }
    }
  }, [courses]);

  // useEffect(()=>{
  //   setLearnersFilter([]);
  // }, [selectedCourse])

  
  
  const handleVideoSelect = (item: any) => {
    setSelectedVideo(item);
    setShowVideoModal(true);
  };

  const getSelectedCourse = (data: any) => {
    setSelectedCourse(data[0]);
    if(userData.user_type === 'T'){
      
    }
  };

  const getSelectedLearner = (data: any) => {
    setSelectedLearner(data[0]);
  };

console.log(courses)
console.log(selectedCourse)
console.log(selectedLearner)
console.log(courseFilter);
console.log(learnersFilter)


const applyTeacherFilter = () => {
setC(selectedCourse.label);
setL(selectedLearner.label);
}

console.log(c,l)

  useEffect(() => {
    if (selectedCourse !== null && userData.user_type === 'T') {
      let selCourse = courses.filter(
        (item: any) => item.seo_slug_url === selectedCourse.label,
      )[0];
      
      console.log(selCourse);
      
      for (let i = 0; i < selCourse.students.length; i++) {
        console.log(selCourse.students[i].seo_slug_url)
        learnersFilter.push({
          label: selCourse.students[i].seo_slug_url,
          value: selCourse.students[i].name,
        });
      }
    }
  }, [selectedCourse]);

  
  return (
    <>
      <HeaderInner
        type={'findCourse'}
        logo={userData.user_type === 'S' ? true : false}
        back={userData.user_type === 'T' ? true : false}
        title={'Recording'}
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
            <View style={{marginTop: 24, marginBottom: 12}}>
              <CustomDropdown
                topLabel={selectedLearner ? 'Learner' : undefined}
                config={{color: '#fff'}}
                onChangeVal={getSelectedLearner}
                data={learnersFilter}
                selectedIds={[]}
                label={selectedLearner ? selectedLearner.value : 'Learner'}
                backTitle={'Learners '}
              />
              <TouchableOpacity style={[StyleCSS.styles.submitButton, {marginTop:8, alignSelf:'flex-end'}]} onPress={applyTeacherFilter}>
                <Text style={StyleCSS.styles.submitButtonText}>Filter</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {recordings ? (
            <View>
              <Text style={[StyleCSS.styles.labelText,{marginBottom:8}]}>Recorded Classes ({recordings.length})</Text>
              {recordings.map((item: any) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleVideoSelect(item)}
                    style={[StyleCSS.styles.flexDirRow, {marginVertical: 8}]}>
                    <View style={{width:'30%'}}>
                      <Video // Can be a URL or a local file.
                        //  controls
                        resizeMode="cover"
                        paused={true}
                        source={{uri: item.video_url}} // Store reference
                        onError={() => {
                          console.log('not loading');
                        }} // Callback when video cannot be loaded
                        style={{height: 80, width: 100, borderRadius: 8}}
                      />
                    </View>
                    <View style={{marginLeft: 16, width:'70%'}}>
                      <Text
                        style={[StyleCSS.styles.contentText, {fontSize: 16}]}>
                        {item.class_name}
                      </Text>
                      <Text
                        style={[
                          StyleCSS.styles.contentText,
                          StyleCSS.styles.mt12,
                        ]}>
                        {item.start_date}
                      </Text>
                      <Text
                        style={[
                          StyleCSS.styles.labelText,
                          StyleCSS.styles.mt5,
                          {flexWrap:'wrap'}
                        ]}>
                        {item.start_time} - {item.end_time} | {item.timezone}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
      </ScrollView>

      {userData.user_type === 'S' ? (
        <BottomNavigation navigation={navigation} selected={'R'} />
      ) : null}
    <Modal onRequestClose={()=>{setShowVideoModal(false)}} visible={showVideoModal} style={{justifyContent:'center'}}> 
    <View style={{height:'90%',justifyContent:'center'}}>
      <TouchableOpacity style={{alignSelf:'flex-end', marginBottom:50, padding:16}} onPress={()=>{setShowVideoModal(false)}}><Text style={StyleCSS.styles.contentText}>Close</Text></TouchableOpacity>
     <Video // Can be a URL or a local file.
                         controls
                        // resizeMode="cover"
                        // paused={true}
                        source={{uri: selectedVideo && selectedVideo.video_url}} // Store reference
                        onError={() => {
                          console.log('not loading');
                        }} // Callback when video cannot be loaded
                        style={{height:400, alignSelf:'center', width: '100%'}}
                      />
                      </View>
                      </Modal> 
      
     
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
});
