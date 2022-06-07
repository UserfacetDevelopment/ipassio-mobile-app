import React, {useState, useEffect, FC} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Animated,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment, {calendarFormat} from 'moment';
import 'moment-timezone';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAppDispatch} from '../../app/store';
import CustomDropdown from '../../components/CustomDropdown';
import CustomStatusBar from '../../components/CustomStatusBar';
import {loaderState, setPageLoading} from '../../reducers/loader.slice';
import {userState} from '../../reducers/user.slice';
import {getLookups} from '../../reducers/courses.slice';
import PageLoader from '../../components/PageLoader';
import {ObjectTypeIndexer} from '@babel/types';
import {getEnrolledCourses} from '../../reducers/dashboard.slice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import Helper from '../../utils/helperMethods';
import timezones from '../../assets/json/timezones.json';
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
  editSession,
} from '../../reducers/schedule.slice';
import StyleCSS from '../../styles/style';
// import Time from '../../assets/images/time.svg';
// import Calender from '../../assets/images/calender.svg'
import CustomDateTimePicker from '../../components/CustomDateTimePicker';
import CustomImage from '../../components/CustomImage';
import {setCustomScrollView} from 'react-native-global-props';

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
  repeat: string;
  repeat_count: number | string;
  type: string;
}

interface EditClassInterface {
  class_type: string;
  course: number;
  student: Array<number>;
  end_time: any;
  end_date: any;
  id: number;
  start_date: any;
  start_time: any;
  timezone: string;
  class_url: string;
  type: string;
  class_taught_on: string;
}

export interface CreateSessionInterfaceFinal {
  params: CreateSessionInterface | EditClassInterface;
  userToken: string;
}

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

interface AddSessionInterface {
  setShowAddSessionModal: any;
  navigation: any;
  onRefresh: any;
  title: string;
  editClassData?: any;
  setShareLinkPopup: any;
  setChildData: any;
  setURL: any;
  setTaughtOnCode: any;
}

const AddSession = ({
  setShowAddSessionModal,
  navigation,
  onRefresh,
  title,
  editClassData,
  setShareLinkPopup,
  setChildData,
  setURL,
  setTaughtOnCode,
}: AddSessionInterface) =>
  // {navigation, route}: Props
  {
    const dispatch = useAppDispatch();
    const [timezone, setTimezone] = useState<any>(null);
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
    const [selectedTimezone, setSelectedTimezone] = useState<any>({
      label: userData.timezone,
      value: userData.timezone,
    });
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] =
      useState(false);
    const [isEndDateTimePickerVisible, setIsEndDateTimePickerVisible] =
      useState(false);
    const [isStartDateTimePickerVisible, setIsStartDateTimePickerVisible] =
      useState(false);
    const [completeCourseData, setCompleteCourseData] = useState(new Map());
    const [startTime, setStartTime] = useState(
      editClassData
        ? Moment.tz(editClassData.start_time, userData.timezone).format(
            'hh:mm A',
          )
        : null,
    );
    const [endTime, setEndTime] = useState(
      editClassData
        ? Moment.tz(editClassData.end_time, userData.timezone).format('hh:mm A')
        : null,
    );
    const [startTimeRangeList, setStartTimeRangeList] = useState<Array<any>>(
      [],
    );
    const [endTimeRangeList, setEndTimeRangeList] = useState<Array<any>>([]);
    const [sameDay, setSameDay] = useState(false);
    const [dSelected, setDSelected] = useState<Date | undefined>(undefined);
    const [startDSelected, setStartDSelected] = useState<Date | undefined>(
      editClassData ? new Date(editClassData.start_time) : undefined,
    );
    const [endDSelected, setEndDSelected] = useState<Date | undefined>(
      editClassData ? new Date(editClassData.end_time) : undefined,
    );

    const [startDate, setStartDate] = useState(
      editClassData ? editClassData.start_time : null,
    );
    const [endDate, setEndDate] = useState(
      editClassData ? editClassData.end_time : null,
    );
    const [minEndDate, setMinEndDate] = useState(
      editClassData ? new Date(editClassData.start_time) : null,
    );
    const [taughtOn, setTaughtOn] = useState<any>(undefined);
    const [p, setP] = useState<any>(null);
    const [meetingPlatforms, setMeetingPlatforms] = useState<any>([]);
    const [selectedStartDateToPass, setSelectedStartDateToPass] =
      useState<any>(null);
    const [selectedEndDateToPass, setSelectedEndDateToPass] =
      useState<any>(null);
    const [refillError, setRefillError] = useState<any>(null);
    const [showError, setShowError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [repeatTypes, setRepeatTypes] = useState<Array<any>>([]);
    const [repeatType, setRepeatType] = useState(undefined);
    const [repeatDuration, setRepeatDuration] = useState<any>(undefined);
    const [repeatDurationArr, setRepeatDurationArr] = useState<Array<any>>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(undefined);
    const [dayToday, setDayToday] = useState<any>(undefined)
    const [onlyDate, setOnlyDate] = useState<any>(undefined)

   
    useEffect(() => {
      dispatch(getLookups())
        .unwrap()
        .then(res => {
          if (res.data.status === 'success') {
            setP(res.data.data.course_platforms);
            res.data.data.course_platforms.map((pt: any) => {
              meetingPlatforms.push({
                label: pt.code,
                value: pt.name,
              });
            });
          }
        })
        .catch(err => {
          Alert.alert('', 'Something went wrong');
        });
    }, []);

    useEffect(() => {
      if (startDSelected) {
        if (
          !endDSelected ||
          new Date(endDSelected).getTime() < new Date(startDSelected).getTime()
        ) {
          setDateError(true);
        } else {
          setDateError(false);
        }
      }
    }, [startDSelected, endDSelected]);

    //   useEffect(()=>{
    //     dispatch(getLookups())
    //     .unwrap()
    //     .then((res)=>{
    // // setP(res.data.data.course_platforms);
    //   res.data.data.course_platforms.map((pt:any)=>{
    //     meetingPlatform.push({
    //       label:pt.name,
    //       value: pt.code,
    //     })
    // }
    //   })
    //   .catch(()=>{

    //   })

    // }, []);

    // const meetingPlatforms = [
    //   {label:'GH', value:'Google Meet'},
    // {label:'S', value:'Skype'},
    // {label:'GD', value:'Google Duo'},
    // {label:'WV', value:'WhatsApp Video'},
    // {label:'B', value:'BOTIM'},
    // {label:'Z', value:'Zoom'},
    // {label:'I', value:'ipassio Video'}
    // ]
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
      setTimezone(timezones);

      setSelectedTimezone(
        timezones.filter(item => item.value === userData.timezone)[0],
      );
    }, []);

    useEffect(() => {
      if (title === 'Add') {
        setTaughtOn({label: 'I', value: 'ipassio Video'});
      } else if (title === 'Edit') {
        setSelectedStartDateToPass(Moment(startDate).format('YYYY-MM-DD'));

        setSelectedEndDateToPass(Moment(endDate).format('YYYY-MM-DD'));
        // setSelectedCourseId(editClassData.course.id);
        setSelectedCourseName(editClassData.course.title);
        // setSelectedCourse(editClassData.course);
        setTaughtOn({
          label: editClassData.taught_on.code,
          value: editClassData.taught_on.name,
        });
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

    // let repeatTypes: any = [];


    useEffect(() => {
      if(selectedDate){
        setDayToday(Moment(selectedDate).format('dddd'));
        setOnlyDate(Moment(selectedDate).format('Do'));
  console.log(dayToday)
  console.log(onlyDate)
  
        setRepeatTypes([
          {
            value: 'Do not Repeat',
            label: 'Do not Repeat',
          },
          {
            value: 'Every week on ' + dayToday,
            label: 'W',
          },
          {
            value: 'Every 2 weeks on ' + dayToday,
            label: 'W2',
          },
          {
            value: 'Monthly on ' + onlyDate,
            label: 'M',
          },
        ]);
  
        setRepeatType(repeatTypes[0]);
      }
      
    }, [selectedDate]);

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
      if (title === 'Edit') {
        if (
          startDSelected &&
          startDSelected.getMonth() === month &&
          startDSelected.getDate() === d &&
          startDSelected.getFullYear() === rounded.getFullYear()
        ) {
          start = dTime;
        }
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
    }, [selectedDate, startDSelected, endDSelected]);

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

    useEffect(() => {
      if (editClassData && startTime) {
        let temp = startTime.split(' ');
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
      }
    }, []);

    const changeEndTime = (data: any) => {
      setEndTime(data[0].value);
    };
    const showEndDateTimePicker = () => {
      // Keyboard.dismiss();
      setIsEndDateTimePickerVisible(true);
    };
    const showStartDateTimePicker = () => {
      // Keyboard.dismiss();
      setIsStartDateTimePickerVisible(true);
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
            let courses = response.data;
            // let filteredCourses = courses.filter(
            //   (item: any) => item.unschedule_classe > 0,
            // );
            let coursesData: Array<any> = [];
            let mapData = new Map();
            courses.map((cs: any, i: number) => {
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

    const editClass = () => {
      const editData: EditClassInterface = {
        class_type: editClassData.course.class_type.id,
        course: editClassData.course.id,
        student: [editClassData.class_student[0].id],
        end_time: endTime,
        end_date: selectedEndDateToPass,
        id: editClassData.id,
        start_date: selectedStartDateToPass,
        start_time: startTime,
        timezone: selectedTimezone.value,
        class_url: editClassData.class_url,
        type: 'C',
        class_taught_on: taughtOn.label,
      };
      const editDataFinal: CreateSessionInterfaceFinal = {
        params: editData,
        userToken: userData.token,
      };
      if (!dateError) {
        dispatch(setPageLoading(true));
        dispatch(editSession(editDataFinal))
          .then((response: any) => {
            onRefresh();
            if (response.payload.data.status === 'success') {
              setChildData(response.payload.data.data);
              setShareLinkPopup(true);
              setShowAddSessionModal(false);
              dispatch(setPageLoading(false));
            }
          })
          .catch(() => {
            dispatch(setPageLoading(false));
            setShowAddSessionModal(false);

            // onHide();
          });
      }
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
            // let courses =  response.data;
            // let filteredCourses = courses.filter((item:any)=> item.unschedule_classe > 0);
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

    useEffect(() => {
      if (editClassData) {
        setStartDate(Moment(startDate).format('MMM DD YYYY'));
        setEndDate(Moment(endDate).format('MMM DD YYYY'));
      }
    }, []);

    const handleStartDatePicked = (selectedDate: Date) => {
      setMinEndDate(selectedDate);
      setStartDSelected(selectedDate);
      setStartDate(Moment(selectedDate).format('MMM DD YYYY'));
      setSelectedStartDateToPass(Moment(selectedDate).format('YYYY-MM-DD'));
      hideStartDateTimePicker();
    };

    const handleEndDatePicked = (selectedDate: Date) => {
      setEndDSelected(selectedDate);
      setEndDate(Moment(selectedDate).format('MMM DD YYYY'));
      setSelectedEndDateToPass(Moment(selectedDate).format('YYYY-MM-DD'));
      hideEndDateTimePicker();
    };

    const hideDateTimePicker = () => {
      setIsDateTimePickerVisible(false);
    };
    const hideStartDateTimePicker = () => {
      setIsStartDateTimePickerVisible(false);
    };
    const hideEndDateTimePicker = () => {
      setIsEndDateTimePickerVisible(false);
    };

    const getCourseId = (data: any) => {
      setRepeatDurationArr([]);
      if (
        userData.user_type === 'S' &&
        data[0].content.unschedule_classe === 0
      ) {
        setShowError(true);
        setSelectedCourseName(data[0].value);
        setRefillError('Please refill this course.');
      } else {
        
        setShowError(false);
        setRefillError(null);
        setSelectedCourseId(data[0].id);
        setSelectedCourseName(data[0].value);
        setSelectedCourse(data[0].content);
        if (userData.user_type === 'T') {
          setSelectedStudentName('')
setSelectedStudentId('')
setSelectedStudent(undefined)
          let sList: Array<any> = [];

          let students = data[0].content.enrolled_student;
          let filteredStudents = students.filter(
            (item: any) => item.unschedule_classe > 0,
          );

          filteredStudents.map((student: any, i: ObjectTypeIndexer) => {
            sList.push({
              id: student.id,
              value: student.name,
              content: student,
            });
          });
          setStudentList(sList);
        }
      }
    };

    useEffect(()=>{
      
      if(repeatType && repeatType.value === 'Do not Repeat'){
setRepeatDuration({label:0, value:0});
      }
      else{
if(userData.user_type==='S'){
  setRepeatDuration({
    value: `${
      selectedCourse.unschedule_classe === 1
        ? selectedCourse.unschedule_classe + ' time'
        : selectedCourse.unschedule_classe + ' times'
    }`,
    label: selectedCourse.unschedule_classe,
  });
  for (let i = 1; i <= selectedCourse.unschedule_classe; i++) {
    // repeatDurationArr.push({value:`${i===1 ? i+ ' time' : i+ ' times'}`, label:i});
    repeatDurationArr.push({
      value: `${i === 1 ? i + ' time' : i + ' times'}`,
      label: i,
    });
  }

}
else if(userData.user_type==='T' && selectedStudent){
  setRepeatDuration({label: selectedStudent.unschedule_classe, value: `${selectedStudent.unschedule_classe===1 ? selectedStudent.unschedule_classe+' time' : selectedStudent.unschedule_classe+' times'}`} );
      for (let i = 1; i <= selectedStudent.unschedule_classe; i++) {
        repeatDurationArr.push({
          value: `${i === 1 ? i + ' time' : i + ' times'}`,
          label: i,
        });
  }
}

        
    }
    },[selectedCourse, repeatType, selectedStudent])
console.log(repeatDuration)

    const getStudentId = (data: any) => {
      setSelectedStudentName(data[0].value);
      setSelectedStudentId(data[0].id);
      setSelectedStudent(data[0].content)
      
    };

    const getMeetingPlatform = (data: any) => {
      setTaughtOn(data[0]);
    };

    const getRepeatType = (data: any) => {
      setRepeatType(data[0]);
    };

    const getRepeatDuration = (data: any) => {
      setRepeatDuration(data[0]);
    };
    const getTimezone = (data: any) => {
      setSelectedTimezone(data[0]);
    };

    //Create session
    const doCreateSession = () => {
      if (!selectedCourseId || !selectedDateToPass || !startTime || !endTime) {
        Alert.alert('', config.messages.common_error_missing_fields, [
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
        timezone: selectedTimezone.value,
        start_time: startTime,
        end_time: endTime,
        class_taught_on: taughtOn.label,
        // repeat: 'Do not Repeat',
        // repeat_count: '',
        repeat: repeatType.label,
        repeat_day: Moment(selectedDate).format('dddd'),
        repeat_count: repeatDuration.label,
        // type: 'C',
      };

      console.log(params);
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
          console.log(response);
          if (response.data.status === 'success') {
          // if (response.status === 200) {
            if (
              taughtOn.label === 'I' &&
              response.data.data &&
              response.data.data.class_url
            ) {
              setShareLinkPopup(true);
              setURL(response.data.data.class_url);
              setTaughtOnCode(taughtOn.label);
              // setAPIresponse(response);
            } else {
              navigation.navigate('ActionStatus', {
                messageStatus: 'success',
                messageTitle: 'Success!',
                messageDesc: response.data.error_message.message,
                timeOut: 7000,
                backRoute: 'Schedules',
                // params: {
                //   appStatus: "success",
                //   appStatusMessage: response.data.error_message.message,
                //   appStatusId: appStatusId,
                // },
              });
            }
          } else if (response.data.status === 'failure') {
            // } else {
            navigation.navigate('ActionStatus', {
              messageStatus: 'failure',
              messageTitle: 'Sorry!',
              messageDesc: response.data.error_message.message,
              timeOut: 7000,
              backRoute: 'Schedules',
            });
          }
          onRefresh();
        })
        .catch(error => {
          dispatch(setPageLoading(false));
          navigation.navigate('ActionStatus', {
            messageStatus: 'failure',
            messageTitle: 'Sorry!',
            messageDesc: config.messages.common_error,
            timeOut: 7000,
            backRoute: 'Schedules',
          });
        });
    };

    return (
      <ScrollView
        // scrollEventThrottle={16}
        keyboardShouldPersistTaps={'handled'}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
          <View style={styles.container}>
            <CustomStatusBar />

            {pageLoading ? (
              // <></>
              <View
                style={{
                  width: width,
                  height: height,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <PageLoader />
              </View>
            ) : (
              <View>
                {/* <View
                style={{
                  marginBottom: 5,
                }}></View> */}
                <View>
                  <View
                  // style={styles.formWrapper}
                  >
                    {!editClassData ? (
                      <>
                        <View style={styles.formElement}>
                          <CustomDropdown
                            topLabel={
                              selectedCourseName !== '-'
                                ? 'Select Course*'
                                : undefined
                            }
                            config={{color: '#fff'}}
                            onChangeVal={getCourseId}
                            data={courses}
                            selectedIds={[]}
                            label={
                              selectedCourseName == '-'
                                ? 'Select Course*'
                                : selectedCourseName
                            }
                            backTitle={'Select Course'}
                          />
                          {userData.user_type === 'S' ? (
                            <Text style={StyleCSS.styles.errorText}>
                              {refillError}
                            </Text>
                          ) : null}
                        </View>
                        {userData.user_type === 'T' && (
                          <View style={styles.formElement}>
                            <CustomDropdown
                              topLabel={
                                selectedStudentName
                                  ? 'Select Student*'
                                  : undefined
                              }
                              config={{color: '#fff'}}
                              onChangeVal={getStudentId}
                              data={studentList}
                              selectedIds={[]}
                              label={
                                selectedStudentName
                                  ? selectedStudentName
                                  : 'Select Student*'
                              }
                              backTitle={'Select Student'}
                            />
                          </View>
                        )}
                      </>
                    ) : null}
                    {timezone ? (
                      <View style={styles.formElement}>
                        <CustomDropdown
                          timezone={true}
                          topLabel={
                            selectedTimezone ? 'Select Timezone*' : undefined
                          }
                          config={{color: '#fff'}}
                          onChangeVal={getTimezone}
                          data={timezone}
                          selectedIds={[]}
                          label={
                            selectedTimezone
                              ? selectedTimezone.label
                              : 'Select Timezone*'
                          }
                          backTitle={'Select Timezone'}
                        />
                      </View>
                    ) : null}
                    {/* <View style={{paddingHorizontal: 16}}>
                    <Text style={[styles.labelContent]}>
                      Timezone: {userData.timezone}
                    </Text>
                  </View> */}
                    {meetingPlatforms ? (
                      <View style={styles.formElement}>
                        <CustomDropdown
                          topLabel={taughtOn ? 'Taught On*' : undefined}
                          config={{color: '#fff'}}
                          onChangeVal={getMeetingPlatform}
                          data={meetingPlatforms}
                          selectedIds={[]}
                          label={taughtOn ? taughtOn.value : 'Taught On*'}
                          backTitle={'Select Meeting Platform'}
                        />
                      </View>
                    ) : null}

                    {editClassData ? (
                      <>
                        <View style={styles.formElement}>
                          <CustomDateTimePicker
                            config={{color: '#fff'}}
                            width={width - 32}
                            showDateTimePicker={showStartDateTimePicker}
                            selectedValue={startDate}
                            label={'Start Date*'}
                            minimumDate={new Date()}
                            isVisible={isStartDateTimePickerVisible}
                            mode="date"
                            onConfirm={(selectedDate: any) => {
                              handleStartDatePicked(selectedDate);
                            }}
                            onCancel={hideStartDateTimePicker}
                          />
                        </View>
                        <View style={styles.formElement}>
                          <CustomDateTimePicker
                            width={width - 32}
                            config={{color: '#fff'}}
                            showDateTimePicker={showEndDateTimePicker}
                            selectedValue={endDate}
                            label={'End Date *'}
                            minimumDate={minEndDate}
                            isVisible={isEndDateTimePickerVisible}
                            mode="date"
                            onConfirm={(selectedDate: any) => {
                              handleEndDatePicked(selectedDate);
                            }}
                            onCancel={hideEndDateTimePicker}
                          />
                          {dateError ? (
                            <Text style={StyleCSS.styles.errorText}>
                              End date should be after or same as start date
                            </Text>
                          ) : null}
                        </View>
                      </>
                    ) : (
                      <View style={styles.formElement}>
                        <CustomDateTimePicker
                          width={width - 32}
                          config={{color: '#fff'}}
                          showDateTimePicker={showDateTimePicker}
                          selectedValue={selectedDate}
                          label={'Select Date *'}
                          minimumDate={new Date()}
                          isVisible={isDateTimePickerVisible}
                          mode="date"
                          onConfirm={(selectedDate: any) => {
                            handleDatePicked(selectedDate);
                          }}
                          onCancel={hideDateTimePicker}
                        />
                      </View>
                    )}
                    {userData.user_type === 'T' &&
                    !editClassData &&
                    repeatTypes.length > 0 &&
                    selectedCourseName !== '-' &&
                    selectedStudentName !== '' &&
                    selectedDate ? (
                      <View style={styles.formElement}>
                        <CustomDropdown
                          topLabel={repeatType ? 'Repeat*' : undefined}
                          config={{color: '#fff'}}
                          onChangeVal={getRepeatType}
                          data={repeatTypes}
                          selectedIds={[]}
                          label={repeatType ? repeatType.value : 'Repeat*'}
                          backTitle={'Repeat'}
                        />
                      </View>
                    ) : null}
                    {userData.user_type === 'S' &&
                    !editClassData &&
                    repeatTypes.length > 0 &&
                    selectedCourseName !== '-' &&
                    selectedDate ? (
                      <View style={styles.formElement}>
                        <CustomDropdown
                          topLabel={repeatType ? 'Repeat*' : undefined}
                          config={{color: '#fff'}}
                          onChangeVal={getRepeatType}
                          data={repeatTypes}
                          selectedIds={[]}
                          label={repeatType ? repeatType.value : 'Repeat*'}
                          backTitle={'Repeat'}
                        />
                      </View>
                    ) : null}
                    {repeatType && repeatType.value !== 'Do not Repeat' ? (
                      <View style={styles.formElement}>
                        <CustomDropdown
                          topLabel={repeatDuration ? 'Repeat for*' : undefined}
                          config={{color: '#fff'}}
                          onChangeVal={getRepeatDuration}
                          data={repeatDurationArr}
                          label={
                            repeatDuration
                              ? repeatDuration.value
                              : 'Repeat for*'
                          }
                          backTitle={'Repeat'}
                        />
                      </View>
                    ) : null}

                    <View style={styles.formElement}>
                      {/* <Text style={styles.labelContent}>Start Time *</Text> */}
                      <CustomDropdown
                        customIcon={
                          <CustomImage
                            height={24}
                            width={24}
                            uri={`${config.media_url}time.svg`}
                          />
                        }
                        topLabel={startTime ? 'Start Time*' : undefined}
                        config={{color: '#fff'}}
                        onChangeVal={changeStartTime}
                        data={startTimeRangeList}
                        selectedIds={[]}
                        label={startTime ? startTime : 'Start Time*'}
                        backTitle={'Select Class Start Time'}
                      />
                    </View>

                    <View style={styles.formElement}>
                      {/* <Text style={styles.labelContent}>End Time *</Text> */}
                      <CustomDropdown
                        customIcon={
                          <CustomImage
                            height={24}
                            width={24}
                            uri={`${config.media_url}time.svg`}
                          />
                        }
                        topLabel={endTime ? 'End Time*' : undefined}
                        config={{color: '#fff'}}
                        onChangeVal={changeEndTime}
                        data={endTimeRangeList}
                        selectedIds={[]}
                        label={endTime ? endTime : 'End Time*'}
                        backTitle={'Select Class End Time'}
                      />
                    </View>
                  </View>
                  <View
                    style={[StyleCSS.styles.lineStyleLight, {marginTop: 12}]}
                  />
                  <View style={[StyleCSS.styles.modalButton]}>
                    <TouchableOpacity
                      style={StyleCSS.styles.cancelButton}
                      onPress={() => {
                        // navigation.goBack()
                        setShowAddSessionModal(false);
                      }}>
                      <Text style={StyleCSS.styles.cancelButtonText}>
                        Cancel
                      </Text>
                    </TouchableOpacity>

                    {editClassData ? (
                      <TouchableOpacity
                        style={StyleCSS.styles.submitButton}
                        onPress={editClass}>
                        <Text style={StyleCSS.styles.submitButtonText}>
                          Submit
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        disabled={userData.user_type === 'S' && showError}
                        style={[
                          StyleCSS.styles.submitButton,
                          {
                            backgroundColor:
                              userData.user_type === 'S' && showError
                                ? '#ccc'
                                : brandColor,
                          },
                        ]}
                        onPress={doCreateSession}>
                        <Text style={StyleCSS.styles.submitButtonText}>
                          Add
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            )}
            {/* <AppMessage
          status={appStatus}
          statusMessage={appStatusMessage}
        /> */}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  };

const styles = StyleSheet.create({
  container: {
    overflow: 'scroll',
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollView: {
    flex: 1,
    //marginTop: 189,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: dropdownBorder,
    borderRadius: 8,
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
    paddingHorizontal: 16,
  },
  labelContent: {
    fontFamily: Helper.switchFont('medium'),
    fontSize: 14,
    color: font2,
    fontWeight: '500',
    marginBottom: 12,
    marginTop: -4,
    fontStyle: 'italic',
  },
});

export default AddSession;
