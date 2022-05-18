import React, {useState, useEffect, FC} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
  RefreshControl,
  Dimensions, Animated
} from 'react-native';
import {useSelector} from 'react-redux';
import { Container } from "native-base";
//@ts-ignore
import {Bubbles} from 'react-native-loader';
import {userState} from '../../reducers/user.slice';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import Helper from '../../utils/helperMethods';
import {appBackground, brandColor,font1, dropdownBorder, font2, secondaryColor, secondaryColorBorder, lineColor} from '../../styles/colors';
//@ts-ignore
import Textarea from 'react-native-textarea';
// import StarRating from 'react-native-star-rating';
import {Rating} from 'react-native-ratings';
import Moment from 'moment';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import config from '../../config/Config';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {useAppDispatch} from '../../app/store';
import PushNotification from 'react-native-push-notification';
import {
  dashboardState,
  getAttendenceList,
  setAttendanceSuccess,
  setAttendanceLoading,
  setAttendanceFailure,
  setStudentAttendanceSuccess,
  submitMarkedAttendance,
} from '../../reducers/dashboard.slice';
import Card from './Card';
import {loaderState, setPageLoading} from '../../reducers/loader.slice';
import PageLoader from '../../components/PageLoader';
import CustomStatusBar from '../../components/CustomStatusBar'
import HeaderInner from '../../components/HeaderInner';
import DashedLine from 'react-native-dashed-line';

type Props = NativeStackScreenProps<RootParamList, 'Attendance'>;

export interface AttendanceListInterface {
  userType: string;
  priceType: string;
  userToken: string;
  courseToken: string;
  token: string;
}

// HandleBackPress method to be added
//instead of teaArea, can also use textInput with multiline.
// addToCart function left

const width = Dimensions.get("screen").width;

const Attendance  : FC<Props> = ({navigation, route}: Props) => {
  const {userData} = useSelector(userState);
  const {attendances, attendancesStatus, studentAttendanceList} =
    useSelector(dashboardState);
  const dispatch = useAppDispatch();
const {pageLoading} = useSelector(loaderState);
  const courseToken = route.params?.courseToken;
  const classType = route.params?.classType;
  const userToken = route.params?.userToken;
  const [attendanceId, setAttendanceId] = useState<string>('');
  const [attendanceToken, setAttendanceToken] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedReview, setSelectedReview] = useState<string>('');
  const [appStatus, setAppStatus] = useState<string>('');
  const [appStatusMessage, setAppStatusMessage] = useState<string>('');
  //const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isRefillModalVisible, setIsRefillModalVisible] =
    useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  let scrollY = new Animated.Value(0.01);
  let changingHeight = scrollY.interpolate({
    inputRange: [0.01, 50],
    outputRange: [109, 109],
    extrapolate: "clamp",
  });
  let titleLeft = scrollY.interpolate({
    inputRange: [0.01, 35],
    outputRange: [0, 36],
    extrapolate: "clamp",
  });
  let titleSize = scrollY.interpolate({
    inputRange: [0.01, 35],
    outputRange: [28, 22],
    extrapolate: "clamp",
  });
  let titleTop = scrollY.interpolate({
    inputRange: [0.01, 35],
    outputRange: [24, -24],
    extrapolate: "clamp",
  });
  let iconTop = scrollY.interpolate({
    inputRange: [0.01, 35],
    outputRange: [36, 24],
    extrapolate: "clamp",
  });
  
  let refillPopupTimer: number = 0;

  useEffect(() => {
    let data: AttendanceListInterface = {
      userType: userData.user_type,
      priceType: classType.id,
      userToken: userToken,
      courseToken: courseToken,
      token: userData.token,
    };

    dispatch(getAttendenceList(data));
    // .unwrap()
    // .then(response => {
    //   if(response?.data.status === "success"){
    //   dispatch(setAttendanceSuccess(response.data.data));
    //   dispatch(setStudentAttendanceSuccess(response.data.extra_data));

    //   }
    // })
    // .catch(err=>{
    //   dispatch(setAttendanceFailure());
    // });
    setRefreshing(false);
  }, [refreshing]);

  useEffect(() => {
    if (attendances.length > 0) {
      for (let element of attendances) {
        if (
          (element.status === 'P' && userData.user_type === 'S') ||
          (userData.user_type === 'T' &&
            element.teacher_status === 'P' &&
            element.status === 'P')
        ) {
          setAttendanceId(element.id);
          setAttendanceToken(element.attendance_token);
          break;
        }
      }
      setTimeout(() => {
        setAppStatus('');
        setAppStatusMessage('');
      }, 7000);
    }
    if (studentAttendanceList.length > 0) {
    if (userData.user_type === 'S') {
      setTimeout(() => {
        setIsRefillModalVisible(
          studentAttendanceList.remaining_classes <= 0 ? true : false,
        );
      }, 5000);
      clearInterval(refillPopupTimer);
    }
   }
  }, [attendances, studentAttendanceList]);

  const showDateTimePicker = () => {
    Keyboard.dismiss();
    setIsDateTimePickerVisible(true);
  };

  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false);
  };

  const handleDatePicked = (selectedDate: Date, at: any, i: number): void => {
    setSelectedDate(Moment(selectedDate).format('YYYY-MM-DD'));
    let attendanceTemp = attendances.map((o: any) => ({...o}));

    if (userData.user_type === 'T') {
      attendanceTemp[i].teacher_class_taken =
        Moment(selectedDate).format('YYYY-MM-DD');
    } else if (userData.user_type === 'S') {
      attendanceTemp[i].class_taken = Moment(selectedDate).format('YYYY-MM-DD');
    }
    dispatch(setAttendanceSuccess(attendanceTemp));
    hideDateTimePicker();
  };

  const editAttendance = (data: any): void => {
    toggleModal();
    setAttendanceId(data.id);
    setAttendanceToken(data.attendance_token);
    setSelectedClass(data.class_info);
    setSelectedDate(
      userData.user_type === 'S' ? data.class_taken : data.teacher_class_taken,
    );
    setSelectedRating(userData.user_type === 'S' ? data.rating : null);
    setSelectedReview(
      userData.user_type === 'S' ? data.review : data.teacher_review,
    );
  };

  const addToCart = () => {
    let data: any = {
      course_token: studentAttendanceList.selected_course_data.course_token,
      class_type: studentAttendanceList.selected_course_data.price_type,
    };

    navigation.navigate("Checkout", {
      screen:'CartPage',
      params:{
        refillCourse : data
      }
    })
  };
  
  const toggleModal = () => {
    //setIsModalVisible(!isModalVisible);
    setSelectedClass(studentAttendanceList.completed_classes);
    setSelectedDate('');
    setSelectedRating(0);
    setSelectedReview('');
    setAttendanceId(studentAttendanceList.attendance_id);
    setAttendanceToken(studentAttendanceList.attendance_token);
  };

  // console.log(studentAttendanceList);
  // console.log(attendances);

  //submit attendance
  const submitAttendance = (data: any): any => {
    if (
      (userData.user_type === 'T' && !selectedDate) ||
      (userData.user_type === 'S' &&
        (!selectedDate || !selectedRating || !selectedReview))
    ) {
      Alert.alert('', config.messages.common_error_missing_fields, [
        {text: 'Okay', style: 'cancel'},
      ]);
      return false;
    }

    let finalData = {};

    if (userData.user_type === 'S') {
      finalData = {
        class_taken: Moment(new Date(selectedDate)).format('YYYY-MM-DD'),
        rating: selectedRating,
        review: selectedReview,
        status: 'S',
        timezone: data.timezone ? data.timezone : userData.timezone,
        is_anonymoususer: data.is_anonymoususer,
      };
    } else if (userData.user_type === 'T') {
      finalData = {
        teacher_class_taken: Moment(new Date(selectedDate)).format(
          'YYYY-MM-DD',
        ),
        teacher_review: selectedReview,
        teacher_status: 'S',
        teacher_timezone: data.teacher_timezone
          ? data.teacher_timezone
          : userData.timezone,
      };
    }
    let d: any = {
      finalData: finalData,
      data: data,
      userToken: userData.token,
    };
    dispatch(submitMarkedAttendance(d))
      .unwrap()
      .then(response => {
       
        dispatch(setPageLoading(false));
        if (response?.data.status === 'success') {
          markAttendancNotif();
          toggleModal();
          navigation.navigate('ActionStatus', {
            messageStatus: 'success',
            messageTitle: 'Thank You!',
            messageDesc: response.data.error_message.message,
            timeOut: 4000,
            backRoute: 'Attendance',
            params: {
              courseToken: courseToken,
              classType: route.params?.classType,
              userToken: userToken,
            },
          });
        } else if (response?.data.status === 'failure') {
          navigation.navigate('ActionStatus', {
            messageStatus: 'failure',
            messageTitle: 'Sorry!',
            messageDesc: response?.data.error_message.message,
            timeOut: 4000,
            backRoute: 'Attendance',
            params: {
              courseToken: courseToken,
              classType: classType,
              userToken: userToken,
            },
          });
        }
      })
      .catch(error => {
        dispatch(setPageLoading(false));
        Alert.alert(error);
      });
  };

  const ratingCompleted = (rating: number) => {
    setSelectedRating(rating);
  };

  const onRefresh = () => {
    setRefreshing(true);
    
  };

const markAttendancNotif = () => {
  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: "ipassio", // (required) channelId, if the channel doesn't exist, notification will not trigger.
    showWhen: true, // (optional) default: true
    autoCancel: true, // (optional) default: true
    largeIcon: "", // (optional) default: "ic_launcher". Use "" for no large icon.
    // largeIconUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
    // smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
    bigText: "My big text that will be shown when notification is expanded. Styling can be done using HTML tags(see android docs for details)", // (optional) default: "message" prop
    subText: "This is a subText", // (optional) default: none
    bigPictureUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
    bigLargeIcon: "ic_launcher", // (optional) default: undefined
    bigLargeIconUrl: "https://www.example.tld/bigicon.jpg", // (optional) default: undefined
    color: "red", // (optional) default: system default
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    tag: "some_tag", // (optional) add tag to message
    group: "group", // (optional) add group to message
    groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
    ongoing: false, // (optional) set whether this is an "ongoing" notification
    priority: "high", // (optional) set notification priority, default: high
    visibility: "private", // (optional) set notification visibility, default: private
    ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
    shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
    onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
    
    when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
    usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
    timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
  
    messageId: "google:message_id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 
  
    actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
    invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
  
    /* iOS only properties */
    category: "", // (optional) default: empty string
  
    /* iOS and Android properties */
    id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
    title: "Attendance Marked", // (optional)
    message: "Your attendance has been marked", // (required)
    picture: "https://www.example.tld/picture.jpg", // (optional) Display an picture with the notification, alias of `bigPictureUrl` for Android. default: undefined
    userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
    playSound: false, // (optional) default: true
    soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
  });
}


  return (
    <View style={styles.container}>
      <CustomStatusBar />
      {pageLoading && <PageLoader/>}
      {!pageLoading ?
     <>
        <HeaderInner
              iconTop={iconTop}
              changingHeight={changingHeight}
              titleSize={titleSize}
              titleTop={titleTop}
              titleLeft={titleLeft}
              title={"Attendance"}
              back={true}
              backroute={ "DashboardPage"}
              navigation={navigation}
              type={"findCourse"}
            />
      <KeyboardAwareScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps={'handled'}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={[styles.infoWrapper]}>
          {userData.user_type === 'T' && (
            <View style={styles.row}>
              <View>
              <Text style={styles.row_title}>Student Name:</Text>
              {attendancesStatus === 'loading' ? (
                <Bubbles size={7} color={brandColor} />
              ) : (
                <Text style={styles.row_content}>
                  {studentAttendanceList.selected_user_data &&
                    studentAttendanceList.selected_user_data.name}
                </Text>
              )}
              </View>
            </View>
          )}

          {userData.user_type === 'T' && <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={5}
              dashColor={lineColor}
            />}
          <View style={styles.row}>
            <View>
            <Text style={styles.row_title}>Course Name:</Text>
            {attendancesStatus === 'loading' ? (
              <Bubbles size={7} color={brandColor} />
            ) : (
              <Text style={styles.row_content}>
                {studentAttendanceList &&
                  studentAttendanceList.selected_course_data &&
                  studentAttendanceList.selected_course_data.title}{' '}
                {studentAttendanceList.selected_course_data &&
                  studentAttendanceList.selected_course_data.price_type && (
                    <View>
                      {studentAttendanceList.selected_course_data.price_type
                        .members === '1' ? (
                        <Text style={styles.row_content}>(1-on-1 Class)</Text>
                      ) : (
                        <Text style={styles.row_content}>
                          (
                          {
                            studentAttendanceList.selected_course_data
                              .price_type.members
                          }{' '}
                          Members)
                        </Text>
                      )}
                    </View>
                  )}
              </Text>
            )}
            </View>
          </View>

          <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={5}
              dashColor={lineColor}
            />
          {userData.user_type === 'S' && (
            <View style={styles.row}>
              <View style={styles.halfWidth}>
              <Text style={styles.row_title}>Teacher Name:</Text>
              {attendancesStatus === 'loading' ? (
                <Bubbles size={7} color={brandColor} />
              ) : (
                <Text style={styles.row_content}>
                  {studentAttendanceList.selected_course_data &&
                    studentAttendanceList.selected_course_data.teacher &&
                    studentAttendanceList.selected_course_data.teacher.name}
                </Text>
              )}
              </View>
            </View>
          )}

          {userData.user_type === 'S' && <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={5}
              dashColor={lineColor}
            />}

          <View style={styles.row}>
            <View style={styles.halfWidth}>
            <Text style={styles.row_title}>Total No. of Classes:</Text>
            {attendancesStatus === 'loading' ? (
              <Bubbles size={7} color={brandColor} />
            ) : (
              <Text style={styles.row_content}>
                {studentAttendanceList.total_classes}
              </Text>
            )}
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.row_title}>No. of Classes Completed:</Text>
            {attendancesStatus === 'loading' ? (
              <Bubbles size={7} color={brandColor} />
            ) : (
              <Text style={styles.row_content}>
                {studentAttendanceList.completed_classes}
              </Text>
            )}
          </View>
          </View>

          <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={5}
              dashColor={lineColor}
            />
          <View style={styles.row}>
            <Text style={styles.row_title}>No. of Classes Remaining:</Text>
            {attendancesStatus === 'loading' ? (
              <Bubbles size={7} color={brandColor} />
            ) : (
              <Text style={styles.row_content}>
                {studentAttendanceList.remaining_classes}
              </Text>
            )}
          </View>

          <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={5}
              dashColor={lineColor}
            />
          <View style={styles.row}>
            <Text style={styles.row_title}>No. of Classes Disputed:</Text>
            {attendancesStatus === 'loading' ? (
              <Bubbles size={7} color={brandColor} />
            ) : (
              <Text style={styles.row_content}>
                {studentAttendanceList.disputed_classes}
              </Text>
            )}
          </View>

          <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={5}
              dashColor={lineColor}
            />
          <View style={styles.row}>
            <Text style={styles.row_title}>No. of Classes Refunded:</Text>
            {attendancesStatus === 'loading' ? (
              <Bubbles size={7} color={brandColor} />
            ) : (
              <Text style={styles.row_content}>
                {studentAttendanceList.refunded_classes}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.attendanceListWrapper}>
          {attendancesStatus === 'loading' ? (
            <View style={styles.cardView}>
              <Bubbles size={7} color={brandColor} />
            </View>
          ) : null}

          {attendancesStatus === 'success' &&
            attendances.map((at: any, i: number) => {
              return (
                <View key={at.id}>
                  {attendanceId == at.id ? (
                    <Card  style={styles.addReview}>
                      <View style={styles.row}>
                        <Text style={styles.row_title}>Class No. </Text>
                        <Text style={styles.row_content}>{at.class_info}</Text>
                      </View>
                      <View style={styles.row}>
                        <View>
                          <Text style={styles.row_title}>
                            Class Taken on
                            <Text style={styles.req}> *</Text>
                          </Text>
                          {userData.user_type === 'S' && (
                            <>
                              <Text
                                style={styles.input}
                                onPress={() => {
                                  showDateTimePicker();
                                }}>
                                {at.class_taken &&
                                  Moment(at.class_taken).format('MMM DD, YYYY')}
                              </Text>
                              <DateTimePickerModal
                                maximumDate={new Date()}
                                isVisible={isDateTimePickerVisible}
                                mode="date"
                                onConfirm={selectedDate => {
                                  handleDatePicked(selectedDate, at, i);
                                }}
                                onCancel={hideDateTimePicker}
                              />
                            </>
                          )}
                          {userData.user_type === 'T' && (
                            <>
                              <Text
                                style={styles.input}
                                onPress={() => {
                                  showDateTimePicker();
                                }}>
                                {at.teacher_class_taken &&
                                  Moment(at.teacher_class_taken).format(
                                    'MMM DD, YYYY',
                                  )}
                              </Text>
                              <DateTimePickerModal
                                maximumDate={new Date()}
                                isVisible={isDateTimePickerVisible}
                                mode="date"
                                onConfirm={selectedDate => {
                                  handleDatePicked(selectedDate, at, i);
                                }}
                                onCancel={hideDateTimePicker}
                              />
                            </>
                          )}
                        </View>
                      </View>
                      {userData.user_type === 'S' ? (
                        <View style={styles.row}>
                          <Text style={styles.row_title}>
                            Rating<Text style={styles.req}> *</Text>
                          </Text>
                          <View style={styles.rating}>
                            <Rating
                              ratingColor={brandColor}
                              type="custom"
                              startingValue={at.rating}
                              onFinishRating={ratingCompleted}
                              ratingCount={5}
                              imageSize={40}
                              fractions={0}
                            />
                          </View>
                        </View>
                      ) : null}
                      <View style={styles.row}>
                        <Text style={styles.row_title}>
                          Review
                          <Text style={styles.req}>
                            {userData.user_type === 'S' ? ' *' : ''}
                          </Text>
                        </Text>
                        {userData.user_type === 'S' && (
                          <Textarea
                            containerStyle={{
                              height: 158,
                              backgroundColor: 'rgb(255, 255, 255)',
                              borderRadius: 5,
                              padding: 10,
                              borderWidth: 0.5,
                              borderColor: 'rgb(194, 194, 194)',
                            }}
                            
                            style={styles.reviewTextArea}
                            onChangeText={(text: string) => {
                              let attendanceTemp = attendances.map(
                                (o: any) => ({...o}),
                              );
                              attendanceTemp[i].teacher_review = text.trim();
                              dispatch(setAttendanceSuccess(attendanceTemp));
                              setSelectedReview(text.trim());
                            }}
                            defaultValue={at.review}
                            placeholder={'Your review...'}
                            placeholderTextColor={'#c7c7c7'}
                            underlineColorAndroid={'transparent'}
                          />
                        )}
                        {userData.user_type === 'T' && (
                          <Textarea
                            containerStyle={{
                              height: 158,
                              backgroundColor: 'rgb(255, 255, 255)',
                              borderRadius: 5,
                              padding: 10,
                              borderWidth: 0.5,
                              borderColor: 'rgb(194, 194, 194)',
                            }}
                            style={styles.reviewTextArea}
                            onChangeText={(text: string) => {
                              let attendanceTemp = attendances.map(
                                (o: any) => ({...o}),
                              );
                              attendanceTemp[i].teacher_review = text.trim();
                              dispatch(setAttendanceSuccess(attendanceTemp));
                              setSelectedReview(text.trim());
                            }}
                            defaultValue={at.teacher_review}
                            placeholder={'Your review..'}
                            placeholderTextColor={'#c7c7c7'}
                            underlineColorAndroid={'transparent'}
                          />
                        )}
                      </View>

                      <View style={styles.row}>
                        <TouchableOpacity
                          style={styles.submitAttendanceButton}
                          onPress={() => {
                            submitAttendance(at);
                          }}>
                          <Text style={styles.submitAttendanceText}>
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Card>
                  ) : (
                    <Card>
                      <View style={styles.cardSplit}>
                        <View style={styles.cardSplitSingle}>
                          <View style={styles.cardSplitSingleItem}>
                            <Text style={styles.row_title}>Class No.</Text>
                            <Text style={styles.row_content}>
                              {at.class_info}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.cardSplitSingle}>
                          <View style={styles.cardSplitSingleItem}>
                            <Text style={styles.row_title}>Class Taken on</Text>
                            {userData.user_type === 'S' && (
                              <Text style={styles.row_content}>
                                {at.class_taken
                                  ? Moment(at.class_taken).format(
                                      'MMM DD, YYYY',
                                    )
                                  : ' - '}
                              </Text>
                            )}
                            {userData.user_type === 'T' && (
                              <Text style={styles.row_content}>
                                {at.teacher_class_taken
                                  ? Moment(at.teacher_class_taken).format(
                                      'MMM DD, YYYY',
                                    )
                                  : ' - '}
                              </Text>
                            )}
                          </View>
                        </View>
                        { userData.user_type === 'S' ?  ( 
                        <View style={[styles.cardSplitSingle, {alignSelf:'flex-end'}]}>
                            <View style={styles.cardSplitSingleItem}>
                              <Text style={styles.row_title}>Rating</Text>
                              <Text style={styles.row_content}>
                                {at.rating > 0 ? at.rating + '/5' : ' - '}
                              </Text>
                            </View>
                          </View>) : null}
                      </View>

                      {userData.user_type === 'S' ? (
                        <View style={styles.cardSplit}>
                          <View style={styles.cardSplitSingle}>
                            <View style={styles.cardSplitSingleItem}>
                              <Text style={styles.row_title}>Review</Text>
                              <Text style={styles.row_content}>
                                {at.review ? at.review : ' - '}
                              </Text>
                            </View>
                          </View>

                         
                        </View>
                      ) : (
                        <View style={styles.cardSplit}>
                          <View>
                            <View style={styles.cardSplitSingleItem}>
                              <Text style={styles.row_title}>Review</Text>
                              <Text style={styles.row_content}>
                                {at.teacher_review ? at.teacher_review : ' - '}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}

                      {/* {userData.user_type === 'T' && */}
                        {/* at.status === 'S' &&
                        at.teacher_status === 'P' && ( */}
                          <View style={styles.amountRefunded}>
                            <Text style={styles.amountRefundedText}>
                              Payment released. Please submit your attendance.
                            </Text>
                          </View>
                         {/* )} */}
                      {/* {at.status === 'D' && ( */}
                        <View style={styles.amountRefunded}>
                          <Text style={styles.amountRefundedText}>
                            Dispute Raised.
                          </Text>
                          <Text style={styles.amountRefundedText}>
                            {'Category: ' + at.dispute_catagory}
                          </Text>
                          <Text style={styles.amountRefundedText}>
                            {'Reason: ' + at.dispute_reason}
                          </Text>
                          {at.admin_comment ? (
                            <Text style={styles.comment}>
                              {'Comment: ' + at.admin_comment}
                            </Text>
                          ) : null}
                        </View>
                       {/* )} */}
                      {/* {at.status === 'R' ? ( */}
                        <View
                          style={styles.amountRefunded}>
                          <Text
                            style={styles.amountRefundedText}>
                            Amount Refunded.
                          </Text>
                        </View>
                      {/* ) : null} */}
                      {at.status !== 'D' && at.status !== 'R' ? (
                        <View>
                          {((userData.user_type === 'S' && at.status !== 'P') ||
                            (userData.user_type === 'T' &&
                              at.teacher_status === 'S') ||
                            (userData.user_type === 'T' &&
                              at.status !== 'P')) && (
                            <Text
                              style={styles.linkButton}
                              onPress={() => {
                                editAttendance(at);
                              }}>
                              EDIT
                            </Text>
                          )}
                        </View>
                      ) : null}
                    </Card>
                  )}
                </View>
              );
            })}
        </View>
      </KeyboardAwareScrollView>
      </> : null }

      {/* <AppMessage
          status={appStatus}
          statusMessage={appStatusMessage}
        /> */}
      <Modal isVisible={isRefillModalVisible}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 5,
              minWidth: 250,
            }}>
            <Text
              style={{
                color: 'rgb(108, 108, 108)',
                textAlign: 'center',
                fontFamily: Helper.switchFont('regular'),
                fontSize: 14,
                marginVertical: 25,
                padding: 12,
                paddingLeft: 18,
                paddingRight: 18,
              }}>
              {config.messages.refillPopupMessage}
            </Text>

            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsRefillModalVisible(false);
                }}>
                <Text
                  style={styles.cancelButtonText}>
                  CANCEL
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.refillButton}
                onPress={() => {
                  setIsRefillModalVisible(false);
                  addToCart();
                }}>
                <Text
                  style={styles.refillButtonText
                  }>
                  REFILL
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Attendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  halfWidth: {
    width: '50%',
  },
  safecontainer: {
    width: width,
    flex: 1,
    backgroundColor: appBackground,
  },
  modalTitle: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 23,
    color: font1,
    marginTop: 24,
    marginBottom: 13,
    fontFamily: Helper.switchFont('bold'),
  },
  body: {
    flex: 1,
    fontSize: 15,
    color: '#606060',
    lineHeight: 24,
    marginRight: 8,
  },
  modal_row: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  lineStyle: {
    borderBottomWidth: 0.7,
    borderColor: '#E2E4E5',
  },
  infoWrapper: {
    marginHorizontal: 16,
  },
  scrollView: {
    paddingBottom: 50,
    marginTop: 109,
  },
  row: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  row_title: {
    color: font2,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 5,
    fontFamily: Helper.switchFont('medium'),
  },
  row_content: {
    color: font1,
    fontSize: 14,
    fontWeight: '500',
    flexDirection: 'row',
    alignItems: 'center',

    fontFamily: Helper.switchFont('medium'),
  },

  attendanceListWrapper: {
    backgroundColor: appBackground,
    marginTop: 10,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  cardView: {
    width: '90%',
    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 10,
    padding: 20,
    marginTop: 10,
    marginBottom: 5,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#777777',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8.3,
    elevation: 13,
    backgroundColor: '#ffffff',
  },
  cardSplit: {
    flexDirection: 'row',
  },
    cardSplitSingle: {
      justifyContent:'space-between',
    },
  cardSplitSingleItem: {
    marginBottom: 10,
  },
  linkButton: {
    color: brandColor,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Helper.switchFont('bold'),
    alignSelf: 'flex-end',
  },
  input: {
    color: font1,
    margin: 0,
    fontSize: 14,
    padding: 18,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    width: '100%',
    borderColor: dropdownBorder,
    fontFamily: Helper.switchFont('regular'),
  },
  req: {
    width: '100%',
    color: '#ee0000',
    fontSize: 12,
    textAlignVertical: 'top',
    marginTop: -5,
  },
  rating: {
    flexDirection: 'row',
  },
  reviewTextArea: {
    width: '100%',
    height: 150,
    color: font2,
    fontSize: 14,
    textAlignVertical: 'top',
    borderRadius: 5,
  },
  cancelButton: {
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
    borderWidth: 1,
    marginRight: '3%',
  },
  cancelButtonText: {
    color: secondaryColor,
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: Helper.switchFont('medium'),
    fontSize: 14,
    lineHeight: 18,
  },
  addReview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    borderWidth:1,
    borderColor:brandColor
  },
  submitAttendanceButton: {
    padding: 12,
    backgroundColor: brandColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: '48%',
    zIndex: 1,
  },
  submitAttendanceText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: Helper.switchFont('medium'),
    fontSize: 14,
    lineHeight: 18,
  },
  paymentReleasedView: {
    padding: 20,
    backgroundColor: 'rgb(245, 245, 245)',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: -20,
    marginRight: -20,
  },
  paymentReleasedText: {
    color: 'rgb(44, 54, 65)',
    fontSize: 14,
    textAlign: 'center',
  },
  disputeRaisedView: {
    padding: 20,
    backgroundColor: 'rgb(245, 245, 245)',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: -20,
    marginRight: -20,
  },
  disputeRaisedText: {
    color: '#ea4335',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 8,
  },
  disputeCategory: {
    color: 'rgb(44, 54, 65)',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 8,
  },
  disputeReason: {
    color: 'rgb(44, 54, 65)',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 8,
  },
  comment: {
    color: 'rgb(44, 54, 65)',
    fontSize: 14,
    textAlign: 'left',
  },
  refillButton: {
    padding: 12,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: brandColor,
    alignItems: 'center',
    justifyContent: 'center',
    //borderRadius: 5,
    alignSelf: 'flex-end',
    zIndex: 1,
    width: '50%',
  },
  refillButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: Helper.switchFont('medium'),
    fontSize: 12,
  },

  amountRefunded: {
    padding: 12,
    backgroundColor: appBackground,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 5,
  },
  amountRefundedText: {
    color: font2,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 17.64,
    textAlign: 'center',
    fontFamily: Helper.switchFont('medium'),
  },
  modalLine: {
    alignSelf: 'center',
    marginTop: 8,
    borderRadius: 5,
    borderColor: font2,
    borderWidth: 1.5,
    width: 56,
    opacity: 0.3,
  },
  modalBackground: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    height: '100%',
  },
  modalView: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 16,
    //  top:252,
    zIndex: 20,
  },
});

