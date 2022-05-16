import React, {useState, useEffect, FC} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
} from 'react-native';
import {useSelector} from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {useAppDispatch} from '../../app/store';
import CustomDropdown from '../../components/CustomDropdown';
import CustomStatusBar from '../../components/CustomStatusBar';
import {loaderState, setPageLoading} from '../../reducers/loader.slice';
import {userState} from '../../reducers/user.slice';
import PageLoader from '../../components/PageLoader';
import {ObjectTypeIndexer} from '@babel/types';
import {getEnrolledCourses} from '../../reducers/dashboard.slice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import Helper from '../../utils/helperMethods';
import {
  brandColor,
  dropdownBorder,
  font1,
  font2,
  secondaryColor,
  secondaryColorBorder,
} from '../../styles/colors';
import config from '../../config/Config';
import {
  addSession,
  getEnrolledStudentsList,
} from '../../reducers/schedule.slice';
import HeaderInner from '../../components/HeaderInner';
import StyleCSS from '../../styles/style';
import Time from '../../assets/images/time.svg';
import Calender from '../../assets/images/calender.svg'

type Props = NativeStackScreenProps<RootParamList, 'AddSession'>;

interface CreateSessionInterface {
  course: number;
  student: Array<number>;
  class_type: number;
  start_date: any;
  end_date: any;
  timezone: any;
  start_time: any;
  end_time: any;
  repeat: number;
  type: string;
}

export interface CreateSessionInterfaceFinal {
  params: CreateSessionInterface;
  userToken: string;
}

const AddSession = ({setShowAddSessionModal, navigation}) =>
  // {navigation, route}: Props
  {
    const dispatch = useAppDispatch();
    const {userData} = useSelector(userState);
    const {pageLoading} = useSelector(loaderState);
    const [selectedCourseName, setSelectedCourseName] = useState('-');
    const [selectedStudentName, setSelectedStudentName] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [courses, setCourses] = useState<Array<any>>([]);
    const [selectedDate, setSelectedDate] = useState<undefined | string>(
      undefined,
    );
    const [selectedDateToPass, setSelectedDateToPass] = useState<
      undefined | string
    >(undefined);
    const [selectedCourse, setSelectedCourse] = useState<any>({});
    const [selectedCourseId, setSelectedCourseId] = useState(0);
    const [studentList, setStudentList] = useState<Array<any>>([]);
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] =
      useState(false);
    const [completeCourseData, setCompleteCourseData] = useState(new Map());
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [startTimeRangeList, setStartTimeRangeList] = useState<Array<any>>(
      [],
    );
    const [endTimeRangeList, setEndTimeRangeList] = useState<Array<any>>([]);
    const [sameDay, setSameDay] = useState(false);
    const [dSelected, setDSelected] = useState<Date | undefined>(undefined);
const [taughtOn , setTaughtOn] = useState(undefined)


const meetingPlatforms = [
  {label:'GH', value:'Google Meet'},
{label:'S', value:'Skype'},
{label:'GD', value:'Google Duo'},
{label:'WV', value:'WhatsApp Video'},
{label:'B', value:'BOTIM'},
{label:'Z', value:'Zoom'},
{label:'I', value:'ipassio Video'}
]
    // let scrollY= new Animated.Value(0.01);
    // let changingHeight;
    // let titleLeft, titleSize, titleTop, iconTop;

    // changingHeight = scrollY.interpolate({
    //   inputRange: [0.01, 50],
    //   outputRange: [109, 109],
    //   extrapolate: "clamp",
    // });
    // titleLeft = scrollY.interpolate({
    //   inputRange: [0.01, 35],
    //   outputRange: [0, 36],
    //   extrapolate: "clamp",
    // });
    // titleSize = scrollY.interpolate({
    //   inputRange: [0.01, 35],
    //   outputRange: [28, 22],
    //   extrapolate: "clamp",
    // });
    // titleTop = scrollY.interpolate({
    //   inputRange: [0.01, 35],
    //   outputRange: [24, -24],
    //   extrapolate: "clamp",
    // });
    // iconTop = scrollY.interpolate({
    //   inputRange: [0.01, 35],
    //   outputRange: [36, 24],
    //   extrapolate: "clamp",
    // });

    // const backroute=route.params?.backroute

    useEffect(() => {
      if (userData.user_type === 'T') {
        getEnrolledCourseStudentList();
      } else if (userData.user_type === 'S') {
        getEnrolledCoursesList();
      }
    }, []);

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    useEffect(() => {
      const coeff = 1000 * 60 * 15;
      const date = new Date();
      const rounded = new Date(Math.ceil(date.getTime() / coeff) * coeff);
      const d = date.getDate();
      const month = rounded.getMonth();
      let hour = rounded.getHours();
      let minutes = rounded.getMinutes();
      let dTime = hour * 60 + minutes;
      let interval = 1425;
      let start = 0;
      if (
        dSelected &&
        dSelected.getMonth() === month &&
        dSelected.getDate() === d &&
        dSelected.getFullYear() === rounded.getFullYear()
      ) {
        //interval = 1425-dTime;
        start = dTime;
      }

      // let daytime = "am";

      // if(hour > 12){
      //   hour = hour-12;
      //   daytime="pm"
      //   interval= 705 - hour*15*4;
      // }
      // else{
      //   interval = 1425-hour*15*4;
      // }

      // populateTimeIntervalRange(hour*15*4, interval, "start");
      populateTimeIntervalRange(start, interval, 'start');
    }, [selectedDate]);

    const populateTimeIntervalRange = (
      min_time: number,
      max_time: number,
      setfor: string = 'start',
    ) => {
      var hours, minutes, ampm;
      let tir = new Array();
      for (var i = min_time; i <= max_time; i += 15) {
        hours = Math.floor(i / 60);
        minutes = i % 60;
        if (minutes < 10) {
          minutes = '0' + minutes; // adding leading zero
        }
        ampm = hours % 24 < 12 ? 'AM' : 'PM';
        hours = hours % 12;
        if (hours === 0) {
          hours = 12;
        }
        if (hours < 10) {
          hours = '0' + hours; // adding leading zero
        }
        tir.push({
          label: hours + ':' + minutes + ' ' + ampm,
          value: hours + ':' + minutes + ' ' + ampm,
        });
      }
      if (setfor === 'end') {
        setEndTimeRangeList(tir);
      } else {
        setStartTimeRangeList(tir);
      }
    };

    console.log(taughtOn && taughtOn.label)
    const changeStartTime = (data: any) => {
      setStartTime(data[0].value);
      setEndTime(null);
      let temp = data[0].value.split(' ');
      let temp1 = temp[0].split(':');
      let time = 0;
      if (temp[1] === 'PM' && temp1[0] != 12) {
        time = (parseInt(temp1[0]) + 12) * 60 + parseInt(temp1[1]) + 15;
      } else {
        if (temp1[0] == 12 && temp[1] === 'AM') {
          temp1[0] = 0;
        }
        time = parseInt(temp1[0]) * 60 + parseInt(temp1[1]) + 15;
      }
      populateTimeIntervalRange(time, 1425, 'end');
    };

    const changeEndTime = (data: any) => {
      setEndTime(data[0].value);
    };
    const showDateTimePicker = () => {
      // Keyboard.dismiss();
      setIsDateTimePickerVisible(true);
    };

    //call student dashboard apis
    const getEnrolledCoursesList = () => {
      dispatch(setPageLoading(true));
      dispatch(getEnrolledCourses(userData.token))
        .unwrap()
        .then(response => {
          dispatch(setPageLoading(false));

          if (response.status === 'success') {
            let coursesData: Array<any> = [];
            let mapData = new Map();

            response.data.map((cs: any, i: number) => {
              coursesData.push({
                id: cs.course_id,
                value: cs.course_name,
                content: cs,
              });
              mapData.set(cs.id, cs);
            });

            setCourses(coursesData);
            setCompleteCourseData(mapData);
          } else if (response.status === 'failure') {
            Alert.alert('', response.data.error_message.message, [
              {text: 'Okay', style: 'cancel'},
            ]);
          }
        })
        .catch(err => {
          dispatch(setPageLoading(false));
        });
    };

    //call teacher created courses
    const getEnrolledCourseStudentList = () => {
      dispatch(setPageLoading(true));
      dispatch(getEnrolledStudentsList(userData.token))
        .unwrap()
        .then(response => {
          dispatch(setPageLoading(false));
          if (response.data.status === 'success') {
            let coursesData: Array<any> = [];
            let mapData = new Map();
            response.data.data.map((cs: any, i: number) => {
              coursesData.push({
                id: cs.course_id ? cs.course_id : cs.id,
                value: cs.course_name ? cs.course_name : cs.title,
                content: cs,
              });
              mapData.set(cs.id, cs);
            });
            setCourses(coursesData);
            setCompleteCourseData(mapData);
          } else if (response.data.status === 'failure') {
            Alert.alert('', response.data.error_message.message, [
              {text: 'Okay', style: 'cancel'},
            ]);
          }
        })
        .catch(err => {
          dispatch(setPageLoading(false));
        });
    };

    const handleDatePicked = (selectedDate: Date) => {
      setDSelected(selectedDate);
      setSelectedDate(Moment(selectedDate).format('MMM DD YYYY'));
      setSelectedDateToPass(Moment(selectedDate).format('YYYY-MM-DD'));
      hideDateTimePicker();
    };

    const hideDateTimePicker = () => {
      setIsDateTimePickerVisible(false);
    };

    const getCourseId = (data: any) => {
      setSelectedCourseId(data[0].id);
      setSelectedCourseName(data[0].value);
      setSelectedCourse(data[0].content);
      if (userData.user_type === 'T') {
        let sList: Array<any> = [];
        data[0].content.enrolled_student.map(
          (student: any, i: ObjectTypeIndexer) => {
            sList.push({
              id: student.id,
              value: student.name,
              content: student,
            });
          },
        );
        setStudentList(sList);
      }
    };

    const getStudentId = (data: any) => {
      setSelectedStudentName(data[0].value);
      setSelectedStudentId(data[0].id);
    };

    const getMeetingPlatform = (data: any) => {
      setTaughtOn(data[0]);
    };

    //Create session
    const doCreateSession = () => {
      if (!selectedCourseId || !selectedDateToPass || !startTime || !endTime) {
        Alert.alert('failure', config.messages.common_error_missing_fields, [
          {text: 'Okay', style: 'cancel'},
        ]);

        // setState({
        //   appStatus: "failure",
        //   appStatusMessage: config.messages.common_error_missing_fields,
        // });

        // setTimeout(() => {
        //   setState({ appStatus: "", appStatusMessage: "" });
        // }, 3000);
        return false;
      }

      if (userData.user_type === 'T') {
        if (!selectedStudentId) {
          Alert.alert('', config.messages.common_error_missing_fields, [
            {text: 'Okay', style: 'cancel'},
          ]);
        }
      }

      // setState({ appStatus: "", appStatusMessage: "" });
      dispatch(setPageLoading(true));
      let studentIds = new Array();
      studentIds.push(userData.id);

      let params: CreateSessionInterface = {
        course: selectedCourseId,
        student: studentIds,
        class_type:
          userData.user_type === 'T'
            ? selectedCourse.price_type.id
            : selectedCourse.class_type.id,
        start_date: selectedDateToPass,
        end_date: selectedDateToPass,
        timezone: userData.timezone,
        start_time: startTime,
        end_time: endTime,
        class_taught_on: taughtOn.label,
        repeat: 1,
        type: 'C',
      };

      if (userData.user_type === 'T') {
        let studentIds = new Array();
        studentIds.push(selectedStudentId);
        params.student = studentIds;
      }

      let finalData: CreateSessionInterfaceFinal = {
        params: params,
        userToken: userData.token,
      };
      dispatch(addSession(finalData))
        .unwrap()
        .then(response => {
          setShowAddSessionModal(false);
          dispatch(setPageLoading(false));
          if (response.data.status == 'success') {
            navigation.navigate('ActionStatus', {
              messageStatus: 'success',
              messageTitle: 'Congratulations!',
              messageDesc: response.data.error_message.message,
              timeOut: 4000,
              backRoute: 'Schedules',
              // params: {
              //   appStatus: "success",
              //   appStatusMessage: response.data.error_message.message,
              //   appStatusId: appStatusId,
              // },
            });
          } else if (response.data.status === 'failure') {
            navigation.navigate('ActionStatus', {
              messageStatus: 'failure',
              messageTitle: 'Sorry!',
              messageDesc: response.data.error_message.message,
              timeOut: 4000,
              backRoute: 'Schedules',
            });
          }
        })
        .catch(error => {
          dispatch(setPageLoading(false));
          navigation.navigate('ActionStatus', {
            messageStatus: 'failure',
            messageTitle: 'Sorry!',
            messageDesc: config.messages.common_error,
            timeOut: 4000,
            backRoute: 'Schedules',
          });
        });
    };
    return (
      <View style={styles.container}>
        {/* <CustomStatusBar type={"inside"} /> */}

        {/* {pageLoading ? (
          // <></>
          <PageLoader />
        ) : ( */}
          <View>
           
            <KeyboardAwareScrollView
              scrollEventThrottle={16}
              keyboardShouldPersistTaps={'handled'}>
              {/* <View
                style={{
                  marginBottom: 5,
                }}></View> */}

              <View
              // style={styles.formWrapper}
              >
                <View style={styles.formElement}>
                 
                  <CustomDropdown
                    topLabel={
                      selectedCourseName !== '-' ? 'Select Course *' : undefined
                    }
                    config={{color: '#81878D'}}
                    onChangeVal={getCourseId}
                    data={courses}
                    selectedIds={[]}
                    label={
                      selectedCourseName == '-'
                        ? 'Select Course'
                        : selectedCourseName
                    }
                    backTitle={'Select Course'}
                  />
                </View>
                {userData.user_type === 'T' && (
                  <View style={styles.formElement}>
                    
                    <CustomDropdown
                      topLabel={
                        selectedStudentName ? 'Select Student *' : undefined
                      }
                      config={{color: '#81878D'}}
                      onChangeVal={getStudentId}
                      data={studentList}
                      selectedIds={[]}
                      label={
                        selectedStudentName
                          ? selectedStudentName
                          : 'Select Student'
                      }
                      backTitle={'Select Student'}
                    />
                  </View>
                )}
                <View>
                  <Text style={[styles.labelContent]}>
                    Timezone: {userData.timezone}
                  </Text>
                </View>
                <View style={styles.formElement}>
                  
                  <CustomDropdown
                 
                    topLabel={taughtOn ? 'Taught On *' : undefined}
                    config={{color: font1}}
                    onChangeVal={getMeetingPlatform}
                    data={meetingPlatforms}
                    selectedIds={[]}
                    label={taughtOn ? taughtOn.value : 'Taught On'}
                    backTitle={'Select Meeting Platform'}
                  />
                </View>
                <View style={styles.formElement}>
                  
                  <View style={StyleCSS.styles.flexDirRow}>
                    <Text
                    style={{ paddingTop: 15,
                      paddingBottom:15,
                      paddingHorizontal: 16,
                      flexDirection: 'row',
                      flex: 1,
                      alignItems:'center',
                      borderWidth: 1,
                      borderColor: dropdownBorder,
                      borderRadius: 8,}}
                      style={styles.input}
                      onPress={() => {
                        showDateTimePicker();
                      }}>
                      {selectedDate ? selectedDate : 'Select Date'}
                    </Text>
                    
                    {selectedDate ? (
                      <Text
                        style={{
                          position: 'absolute',
                          top: -8,
                          left: 7,
                          paddingHorizontal: 4,
                          backgroundColor: '#fff',
                          fontSize: 12,
                          color: font2,
                        }}>
                        Select Date *
                        
                      </Text>
                    ) : null}
                    <View ><Calender/></View>
                    <DateTimePickerModal
                  
                      minimumDate={new Date()}
                      isVisible={isDateTimePickerVisible}
                      mode="date"
                      onConfirm={selectedDate => {
                        handleDatePicked(selectedDate);
                      }}
                      onCancel={hideDateTimePicker}
                    />
                  </View>
                </View>

                <View style={styles.formElement}>
                  {/* <Text style={styles.labelContent}>Start Time *</Text> */}
                  <CustomDropdown
                  customIcon = {<Time/>}
                    topLabel={startTime ? 'Start Time *' : undefined}
                    config={{color: '#81878D'}}
                    onChangeVal={changeStartTime}
                    data={startTimeRangeList}
                    selectedIds={[]}
                    label={startTime ? startTime : 'Start Time'}
                    backTitle={'Select Class Start Time'}
                  />
                </View>

                <View style={styles.formElement}>
                  {/* <Text style={styles.labelContent}>End Time *</Text> */}
                  <CustomDropdown
                  customIcon = {<Time/>}
                    topLabel={endTime ? 'End Time *' : undefined}
                    config={{color: font1}}
                    onChangeVal={changeEndTime}
                    data={endTimeRangeList}
                    selectedIds={[]}
                    label={endTime ? endTime : 'End Time'}
                    backTitle={'Select Class End Time'}
                  />
                </View>
                <View
                  style={[StyleCSS.styles.lineStyleLight, {marginTop: 24}]}
                />
                <View
                  style={[
                    {
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginBottom: 20,
                      
                      paddingTop: 16,
                    },
                  ]}>
                  <TouchableOpacity
                    style={{
                      padding: 12,
                      // paddingTop: 18,
                      // paddingBottom: 18,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 8,
                      width: '49%',
                      zIndex: 1,
                      borderColor: secondaryColorBorder,
                      borderWidth:1,
                      marginRight: '3%',
                    }}
                    onPress={() => {
                      // navigation.goBack()
                      setShowAddSessionModal(false);
                    }}>
                    <Text
                      style={{
                        color: secondaryColor,
                        textAlign: 'center',
                        fontWeight: '700',
                        fontFamily: Helper.switchFont('medium'),
                        fontSize: 14,
                        lineHeight: 18,
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      padding: 12,
                      // paddingTop: 18,
                      // paddingBottom: 18,
                      backgroundColor: brandColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 8,
                      width: '48%',
                      zIndex: 1,
                    }}
                    onPress={doCreateSession}>
                    <Text
                      style={{
                        color: '#fff',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontFamily: Helper.switchFont('medium'),
                        fontSize: 14,
                        lineHeight: 18,
                      }}>
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

            </KeyboardAwareScrollView>
          </View>
        {/* )} */}
        {/* <AppMessage
          status={appStatus}
          statusMessage={appStatusMessage}
        /> */}
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    overflow:'scroll',
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollView: {
    flex: 1,
    //marginTop: 189,
  },
  input: {
    alignItems:'center',
    color: font1,
    margin: 0,
    fontSize: 14,
    padding: 12,
    height: 48,
    paddingLeft:16,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: dropdownBorder,
    fontFamily: Helper.switchFont('regular'),
  },
  dropdown: {
    color: '#81878D',
    margin: 0,
    fontSize: 14,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 5,
    height: 60,
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderColor: 'rgb(194, 194, 194)',
  },
  body: {
    flex: 1,
    fontSize: 15,
    color: '#606060',
    lineHeight: 24,
    marginRight: 8,
  },
  // formWrapper: {
  //   // marginHorizontal: 24,
  // },
  formElement: {
    paddingVertical: 12,
  },
  labelContent: {
    fontFamily: Helper.switchFont('medium'),
    fontSize: 14,
    color: font2,
    fontWeight: '500',
    marginBottom: 12,
    marginTop:-4,
    fontStyle: 'italic',
  },
});

export default AddSession;
