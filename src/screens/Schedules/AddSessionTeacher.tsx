import React,{useState, useEffect, FC} from 'react'
import { View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated} from 'react-native'
import { useSelector } from 'react-redux'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from "moment";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { useAppDispatch } from '../../app/store'
import CustomDropdown from '../../components/CustomDropdown'
import CustomStatusBar from '../../components/CustomStatusBar'
import { loaderState, setPageLoading } from '../../reducers/loader.slice'
import { userState } from '../../reducers/user.slice'
import PageLoader from '../../components/PageLoader'
import { AnyTypeAnnotation, ObjectTypeIndexer } from '@babel/types';
import { getEnrolledCourses } from '../../reducers/dashboard.slice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParamList } from '../../navigation/Navigators';
import Helper from '../../utils/helperMethods';
import { brandColor } from '../../styles/colors';
import config from '../../config/Config';
import { addSession, getEnrolledStudentsList } from '../../reducers/schedule.slice';
import {} from './AddSession'

type Props = NativeStackScreenProps<RootParamList, 'AddSession'>

interface CreateSessionInterface {
  course: number,
      student: Array<number>,
      class_type:number
      start_date: any,
      end_date: any,
      timezone: any,
      start_time: any,
      end_time: any,
      repeat: number,
      type: string,
}

export interface CreateSessionInterfaceFinal{
  params: CreateSessionInterface,
  userToken: string
}

const AddSessionTeacher = ({navigation}: Props) => {

  const dispatch = useAppDispatch();
  const {userData} = useSelector(userState);
  const {pageLoading} = useSelector(loaderState);
  const [selectedCourseName, setSelectedCourseName] = useState("-");
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [courses, setCourses] = useState<Array<any>>([]);
  const [selectedDate, setSelectedDate] = useState<undefined|string>(undefined);
  const [selectedDateToPass, setSelectedDateToPass] = useState<undefined|string>(undefined);
  const [selectedCourse, setSelectedCourse] = useState<any>({});
  const [selectedCourseId, setSelectedCourseId] = useState(0);
  const [studentList, setStudentList] = useState<Array<any>>([]);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [completeCourseData, setCompleteCourseData] = useState(new Map());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null)
  const [startTimeRangeList, setStartTimeRangeList] = useState<Array<any>>([]);
  const [endTimeRangeList, setEndTimeRangeList] = useState<Array<any>>([]);

  useEffect(()=>{
    const date= new Date();
    const d = date.getDate();
   console.log(d);
    let hour = date.getHours();
    console.log(hour)
    let daytime = "am";
    let interval;
    
    if(hour > 12){
      hour = hour-12;
      console.log(hour)
      daytime="pm"
      interval= 705 - hour*60;
    }
    else{
      interval = 1425-hour*60;
    }
    
    
    // populateTimeIntervalRange(hour*15*4, interval, "start");
    populateTimeIntervalRange(0, 1425, "start");
      
      getEnrolledCourseStudentList();
    
  },[])

  const populateTimeIntervalRange = (min_time:number, max_time:number, setfor: string = "start") => {
    var hours, minutes, ampm;
    let tir = new Array();
    for (var i = min_time; i <= max_time; i += 15) {
      hours = Math.floor(i / 60);
      minutes = i % 60;
      if (minutes < 10) {
        minutes = "0" + minutes; // adding leading zero
      }
      ampm = hours % 24 < 12 ? "AM" : "PM";
      hours = hours % 12;
      if (hours === 0) {
        hours = 12;
      }
      if (hours < 10) {
        hours = "0" + hours; // adding leading zero
      }
      tir.push({
        label: hours + ":" + minutes + " " + ampm,
        value: hours + ":" + minutes + " " + ampm,
      });
    }
    if (setfor === "end") {
      setEndTimeRangeList(tir)
    } else {
      setStartTimeRangeList(tir)
    }
  };

  const changeStartTime = (data:any) => {
    setStartTime(data[0].value)
    setEndTime(null);
    let temp = data[0].value.split(" ");
    let temp1 = temp[0].split(":");
    let time = 0;
    if (temp[1] === "PM" && temp1[0] != 12) {
      time = (parseInt(temp1[0]) + 12) * 60 + parseInt(temp1[1]) + 15;
    } else {
      if (temp1[0] == 12 && temp[1] === "AM") {
        temp1[0] = 0;
      }
      time = parseInt(temp1[0]) * 60 + parseInt(temp1[1]) + 15;
    }
   populateTimeIntervalRange(time, 1425, "end");
  };

  const changeEndTime = (data: any) => {
    setEndTime(data[0].value);
  };
   const showDateTimePicker = () => {
    // Keyboard.dismiss();
    setIsDateTimePickerVisible(true);
  };


  
  //call teacher created courses
  const getEnrolledCourseStudentList = () => {
    dispatch(setPageLoading(true));
    dispatch(getEnrolledStudentsList(userData.token))
    .unwrap()
    .then((response) => {
      dispatch(setPageLoading(false));
      if (response.data.status === "success") {
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
        console.log(coursesData)
        setCourses(coursesData)
        setCompleteCourseData(mapData)
      } else if (response.data.status === "failure") {
        Alert.alert("", response.data.error_message.message, [
          { text: "Okay", style: "cancel" },
        ]);
      }
    })
    .catch((err) => {
      dispatch(setPageLoading(false));
        });
  };

  const handleDatePicked = (selectedDate: Date) => {
    setSelectedDate(Moment(selectedDate).format("MMM DD YYYY"))
    setSelectedDateToPass(Moment(selectedDate).format("YYYY-MM-DD"))
    hideDateTimePicker();
  };

  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false)
  }


  const getCourseId = (data: any) => {
    console.log("userdata", userData)
      setSelectedCourseId(data[0].id);
      setSelectedCourseName(data[0].value)
      setSelectedCourse(data[0].content)
      console.log("userdata", userData)
      console.log(userData.user_type)
      if (userData.user_type === "T") {
        let sList: Array<any> = [];
        data[0].content.enrolled_student.map((student: any, i: ObjectTypeIndexer) => {
          console.log(student)
          sList.push({
            id: student.id,
            value: student.name,
            content: student,
          });
        });
        console.log(sList);
        setStudentList(sList)
      }
    };

    console.log(studentList)
  const getStudentId = (data : any) => {
      setSelectedStudentName(data[0].value);
      setSelectedStudentId(data[0].id)
      console.log(studentList)
    }

    //Create session
  const doCreateSession = () => {
    console.log("bbbbbb")
      if (
        !selectedCourseId ||
        !selectedDateToPass ||
        !startTime ||
        !endTime
      ) {
        console.log("aaaaa")
        Alert.alert("failure", config.messages.common_error_missing_fields, [
          { text: "Okay", style: "cancel" },
        ]);

        // this.setState({
        //   appStatus: "failure",
        //   appStatusMessage: config.messages.common_error_missing_fields,
        // });

        // setTimeout(() => {
        //   this.setState({ appStatus: "", appStatusMessage: "" });
        // }, 3000);
        return false;
      }

      if (userData.user_type === "T") {
        console.log("ndjcs")

        if (!selectedStudentId) {
          console.log("ccccccc")
          Alert.alert("", config.messages.common_error_missing_fields, [
            { text: "Okay", style: "cancel" },
          ]);
          
      }
    }

      // this.setState({ appStatus: "", appStatusMessage: "" });
      dispatch(setPageLoading(true))
      let studentIds = new Array();
      studentIds.push(userData.id);

      let params : CreateSessionInterface = {
        course: selectedCourseId,
        student: studentIds,
        class_type:
          userData.user_type === "T"
            ? selectedCourse.price_type.id
            : selectedCourse.class_type.id,
        start_date: selectedDateToPass,
        end_date: selectedDateToPass,
        timezone: userData.timezone,
        start_time: startTime,
        end_time: endTime,
        repeat: 1,
        type: "C",
      };

      if (userData.user_type === "T") {
        let studentIds = new Array();
        studentIds.push(selectedStudentId);
        params.student = studentIds;
      }

  let finalData : CreateSessionInterfaceFinal = { 
    params: params,
    userToken: userData.token
  }
      dispatch(addSession(finalData))
      .unwrap()
        .then((response) => {
          console.log(response)
          dispatch(setPageLoading(false))
          if (response.data.status == "success") {
            
            navigation.navigate("ActionStatus", {
              messageStatus: "success",
              messageTitle: "Congratulations!",
              messageDesc: response.data.error_message.message,
              timeOut: 4000,
              backRoute: "Schedule",
              // params: {
              //   appStatus: "success",
              //   appStatusMessage: response.data.error_message.message,
              //   appStatusId: appStatusId,
              // },
            });
          } else if (response.data.status === "failure") {
            navigation.navigate("ActionStatus", {
              messageStatus: "failure",
              messageTitle: "Sorry!",
              messageDesc: response.data.error_message.message,
              timeOut: 4000,
              backRoute: "Schedule",
            });
          }
        })
        .catch((error) => {
          dispatch(setPageLoading(false))
          navigation.navigate("ActionStatus", {
            messageStatus: "",
            messageTitle: "Sorry!",
            messageDesc: config.messages.common_error,
            timeOut: 4000,
            backRoute: "Schedule",
          });
        });
    
  }
console.log(courses)
    return (
      <View style={styles.container}>
        <CustomStatusBar type={"inside"} />

        {pageLoading ? <PageLoader/> : (
          <SafeAreaView style={styles.safecontainer}>
            {/* <HeaderInner
              iconTop={iconTop}
              changingHeight={changingHeight}
              titleSize={titleSize}
              titleTop={titleTop}
              titleLeft={titleLeft}
              title={"Add Session"}
              backRoute={"Schedule"}
              navigation={navigation}
              type={"innerpage"}
            /> */}
            
            <KeyboardAwareScrollView
              scrollEventThrottle={16}
              // onScroll={Animated.event(
              //   [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              //   { useNativeDriver: false }
              // )}
              style={styles.scrollView}
              keyboardShouldPersistTaps={"handled"}
            >
              <View
                style={{
                  marginLeft: 16,
                  marginRight: 16,
                  marginBottom: 5,
                  marginTop: 20,
                }}
              ></View>

              <View style={styles.formWrapper}>
                <View style={styles.formElement}>
                  <Text
                    style={styles.labelContent}
                    onPress={() => {
                     showDateTimePicker();
                    }}
                  >
                    Select Course *
                  </Text>
                  <CustomDropdown
                    config={{ color: "#81878D" }}
                    onChangeVal={getCourseId}
                    data={courses}
                    selectedIds={[]}
                    label={
                      selectedCourseName == "-"
                        ? "Select Course"
                        : selectedCourseName
                    }
                    backTitle={"Select Course"}
                  />
                </View>
                {userData.user_type === "T" && (
                  <View style={styles.formElement}>
                    <Text
                      style={styles.labelContent}
                      onPress={() => {
                        showDateTimePicker();
                      }}
                    >
                      Select Student *
                    </Text>
                    <CustomDropdown
                      config={{ color: "#81878D" }}
                      onChangeVal={getStudentId}
                      data={studentList}
                      selectedIds={[]}
                      label={
                        selectedStudentName
                          ? selectedStudentName
                          : "Select Student"
                      }
                      backTitle={"Select Student"}
                    />
                  </View>
                )}
                <View style={styles.formElement}>
                  <Text style={styles.labelContent}>
                    Timezone: {userData.timezone}
                  </Text>
                </View>

                <View style={styles.formElement}>
                  <Text
                    style={styles.labelContent}
                    onPress={() => {
                      showDateTimePicker();
                    }}
                  >
                    Start Date *
                  </Text>
                  <View>
                    <Text
                      style={styles.input}
                      onPress={() => {
                        showDateTimePicker();
                      }}
                    >
                      {selectedDate}
                    </Text>

                    <DateTimePickerModal
                      minimumDate={new Date()}
                      isVisible={isDateTimePickerVisible}
                      mode="date"
                      onConfirm={(selectedDate) => {
                        handleDatePicked(selectedDate);
                      }}
                      onCancel={hideDateTimePicker}
                    />
                  </View>
                </View>

                <View style={styles.formElement}>
                  <Text style={styles.labelContent}>Start Time *</Text>
                  <CustomDropdown
                    config={{ color: "#81878D" }}
                    onChangeVal={changeStartTime}
                    data={startTimeRangeList}
                    selectedIds={[]}
                    label={startTime ? startTime : "From"}
                    backTitle={"Select Class Start Time"}
                  />
                </View>

                <View style={styles.formElement}>
                  <Text style={styles.labelContent}>End Time *</Text>
                  <CustomDropdown
                    config={{ color: "#81878D" }}
                    onChangeVal={changeEndTime}
                    data={endTimeRangeList}
                    selectedIds={[]}
                    label={endTime ? endTime : "To"}
                    backTitle={"Select Class End Time"}
                  />
                </View>

                <View
                  style={[
                    styles.formElement,
                    {
                      alignItems: "center",
                      flexDirection: "row",
                      marginBottom: 20,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={{
                      padding: 12,
                      paddingTop: 18,
                      paddingBottom: 18,
                      backgroundColor: "fff",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 3,
                      width: "30%",
                      zIndex: 1,
                      borderColor: "rgb(224, 224, 224)",
                      borderWidth: 0.8,
                      marginRight: "3%",
                    }}
                    onPress={() => {
                      navigation.goBack()
                        
                    }}
                  >
                    <Text
                      style={{
                        color: "rgb(108, 108, 108)",
                        textAlign: "center",
                        fontFamily: Helper.switchFont("medium"),
                        fontSize: 12,
                      }}
                    >
                      CANCEL
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      padding: 12,
                      paddingTop: 18,
                      paddingBottom: 18,
                      backgroundColor: brandColor,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 3,
                      width: "67%",
                      zIndex: 1,
                    }}
                    onPress={doCreateSession}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        fontSize: 12,
                        fontFamily: Helper.switchFont("medium"),
                      }}
                    >
                      ADD
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        ) }
        {/* <AppMessage
          status={appStatus}
          statusMessage={appStatusMessage}
        /> */}
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  safecontainer: {
    flex: 1,
    //backgroundColor: "#FEFEFE",
  },
  scrollView: {
    flex: 1,
  },
  input: {
    color: "#81878D",
    margin: 0,
    fontSize: 14,
    padding: 20,
    backgroundColor: "transparent",
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "rgb(194, 194, 194)",
    fontFamily: Helper.switchFont("regular"),
  },
  dropdown: {
    color: "#81878D",
    margin: 0,
    fontSize: 14,
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 5,
    height: 60,
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderColor: "rgb(194, 194, 194)",
  },
  body: {
    flex: 1,
    fontSize: 15,
    color: "#606060",
    lineHeight: 24,
    marginRight: 8,
  },
  formWrapper: {
    marginHorizontal: 24,
  },
  formElement: {
    paddingVertical: 10,
  },
  labelContent: {
    fontSize: 14,
    color: "rgb(44, 54, 65)",
    marginBottom: 8,
  },
});

export default AddSessionTeacher;