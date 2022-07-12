import React, {useState, useEffect, FC} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
  RefreshControl,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import {useSelector} from 'react-redux';
import {Container, FlatList, TextField} from 'native-base';
//@ts-ignore
import {Bubbles} from 'react-native-loader';
import {userState} from '../../reducers/user.slice';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import Helper from '../../utils/helperMethods';
import DashedLine from 'react-native-dashed-line';

import {
  appBackground,
  background4,
  background6,
  brandColor,
  dropdownBorder,
  font1,
  font2,
  lineColor,
  secondaryColor,
  secondaryColorBorder,
} from '../../styles/colors';
//@ts-ignore
import Textarea from 'react-native-textarea';
// import StarRating from 'react-native-star-rating';
import {Rating} from 'react-native-ratings';
import Moment from 'moment';
import 'moment-timezone';
// import Modal from 'react-native-modal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAppDispatch} from '../../app/store';
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
import CustomStatusBar from '../../components/CustomStatusBar';
import HeaderInner from '../../components/HeaderInner';
import StyleCSS from '../../styles/style';
import CustomDateTimePicker from '../../components/CustomDateTimePicker';
// type Props = NativeStackScreenProps<RootParamList, 'Attendance'>;
import config from '../../config/Config';
import { cartDetails } from '../../reducers/checkout.slice';
import { CartDetailsData } from '../Checkout/CartPage';

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

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;


const StudentAttendance: FC<any> = ({
  courseToken,
  classType,
  userToken,
  navigation,
}) => {
  const {userData} = useSelector(userState);
  const {attendances, attendancesStatus, studentAttendanceList, reviewSuggestions} =
    useSelector(dashboardState);
  const dispatch = useAppDispatch();
  const {pageLoading} = useSelector(loaderState);
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
  const [editAttendanceModal, setEditAttendanceModal] = useState(false);
  const [suggestions, setSuggestions] = useState<null|Array<any>>(null);
  //index of the first card whose class attendance is not marked
  const [reviewIndex, setReviewIndex] = useState<number|null>(null);
  const [index, setIndex] = useState<number>(0);
  const [modalTitle, setModalTitle] = useState<'Mark Attendance' | 'Edit Attendance'>('Edit Attendance');
  const [checkoutToken, setCheckoutToken] = useState<string|undefined>(undefined);;
  let scrollY = new Animated.Value(0.01);
  let changingHeight = scrollY.interpolate({
    inputRange: [0.01, 50],
    outputRange: [100, 100],
    extrapolate: 'clamp',
  });
  let titleLeft = scrollY.interpolate({
    inputRange: [0.01, 35],
    outputRange: [0, 36],
    extrapolate: 'clamp',
  });
  let titleSize = scrollY.interpolate({
    inputRange: [0.01, 35],
    outputRange: [28, 22],
    extrapolate: 'clamp',
  });
  let titleTop = scrollY.interpolate({
    inputRange: [0.01, 35],
    outputRange: [24, -24],
    extrapolate: 'clamp',
  });
  let iconTop = scrollY.interpolate({
    inputRange: [0.01, 35],
    outputRange: [36, 24],
    extrapolate: 'clamp',
  });

  let refillPopupTimer: number = 0;

  // console.log(reviewSuggestions);
  // console.log('suggestions', suggestions)

  useEffect(() => {
    let data: AttendanceListInterface = {
      userType: userData.user_type,
      priceType: classType,
      userToken: userToken,
      courseToken: courseToken,
      token: userData.token,
    };

    dispatch(getAttendenceList(data))
    // .unwrap()
    // .then(response => {
    //   console.log(response)
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
    setReviewIndex(null);
    if (attendances.length > 0) {
      for (let i = 0; i < attendances.length; i++) {
        if (attendances[i].status === 'P') {
          setReviewIndex(i);
          setAttendanceId(attendances[i].id);
          setAttendanceToken(attendances[i].attendance_token);
          break;
        }
      }
      
      
    }
    
    
  }, [attendances, studentAttendanceList, editAttendanceModal]);

  useEffect(()=>{
    if (Object.keys(studentAttendanceList).length > 0) {
      setSuggestions(reviewSuggestions)
    }
  },[editAttendanceModal])

  useEffect(()=>{
    if (Object.keys(studentAttendanceList).length > 0) {
      setTimeout(() => {
        setIsRefillModalVisible(
          studentAttendanceList.remaining_classes <= 0 ? true : false,
        );
      }, 7000);

      clearInterval(refillPopupTimer);
    }
  }, [attendances, studentAttendanceList])

  
  // console.log(attendances)
  // console.log(studentAttendanceList)
  

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

  const editAttendance = (data: any, index: number): void => {
    setModalTitle('Edit Attendance');
    setIndex(index);
    toggleModal();
    setEditAttendanceModal(true);
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
    

    const finalData : CartDetailsData = {
      courseToken: studentAttendanceList.selected_course_data.course_token,
      classType: studentAttendanceList.selected_course_data.price_type.id,
      userToken: userData.token,
    };

    dispatch(cartDetails(finalData))
      .unwrap()
      .then(response => {
        dispatch(setPageLoading(true));
        if(response.data.status==="success"){
          setCheckoutToken(response.data.data.checkout_token);
          
        }
        else if(response.data.status==='failure'){
          dispatch(setPageLoading(false));
      Alert.alert('', response.data.error_message.message, [
        {text: 'Okay', style: 'cancel'},
      ]);
        }
        
      })
      .catch(err => {
        dispatch(setPageLoading(false));
      });

  };

  useEffect(()=>{
    if(checkoutToken){
      navigation.navigate('Checkout', {
        screen: 'CartPage',
        params: {
          
          checkoutToken: checkoutToken
        },
      });
    }
    
  }, [checkoutToken]);




  const toggleModal = () => {
    //setIsModalVisible(!isModalVisible);
    setSelectedClass(studentAttendanceList.completed_classes);
    setSelectedDate('');
    setSelectedRating(0);
    setSelectedReview('');
    setAttendanceId(studentAttendanceList.attendance_id);
    setAttendanceToken(studentAttendanceList.attendance_token);
  };

  //submit attendance
  const submitAttendance = (data: any): any => {
    if (!selectedDate || !selectedRating || !selectedReview) {
      Alert.alert('', config.messages.common_error_missing_fields, [
        {text: 'Okay', style: 'cancel'},
      ]);
      return false;
    } else {
      let finalData = {};

     
        finalData = {
          class_taken: Moment(new Date(selectedDate)).format('YYYY-MM-DD'),
          rating: selectedRating,
          review: selectedReview,
          status: 'S',
          timezone: data.timezone ? data.timezone : userData.timezone,
          is_anonymoususer: data.is_anonymoususer,
        };
      
      let d: any = {
        finalData: finalData,
        data: data,
        userToken: userData.token,
      };
      dispatch(submitMarkedAttendance(d))
        .unwrap()
        .then(response => {
          // setReviewIndex(null)
          setEditAttendanceModal(false);
          dispatch(setPageLoading(false));
          if (response?.data.status === 'success') {
            toggleModal();
           onRefresh();
            navigation.navigate('ActionStatus', {
              messageStatus: 'success',
              messageTitle: 'Thank You!',
              messageDesc: response.data.error_message.message,
              timeOut: 7000,
              backRoute: 'Attendance',
              params: {
                courseToken: courseToken,
                classType: classType,
                userToken: userToken,
              },
            });
          } else if (response?.data.status === 'failure') {
            navigation.navigate('ActionStatus', {
              messageStatus: 'failure',
              messageTitle: 'Sorry!',
              messageDesc: response?.data.error_message.message,
              timeOut: 7000,
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
    }
  };
  const ratingCompleted = (rating: number) => {
    setSelectedRating(rating);
  };

  const onRefresh = () => {
    setRefreshing(true);
  };

  const addReview = () => {
    setIndex(reviewIndex);
    setModalTitle('Mark Attendance');
    setEditAttendanceModal(true);
    setReviewIndex(null);
  };



  

  const loadSuggestions=(data: any,i: number)=>{
    // console.log(data)
    // console.log(selectedReview);
  
    const handleReview =()=>{
      let tempSuggestions = [...suggestions];
      tempSuggestions.splice(i,1);
      setSuggestions(tempSuggestions)
      let attendanceTemp = attendances.map((o: any) => ({
        ...o,
      }));
      attendanceTemp[index].review = attendanceTemp[index].review + " "+ data
      dispatch(setAttendanceSuccess(attendanceTemp));
      setSelectedReview(attendanceTemp[index].review);
   
    }
  
  return(
    <TouchableOpacity onPress={handleReview} style={{paddingHorizontal:16, paddingTop:8, paddingBottom:10, marginLeft:6, backgroundColor:background6, borderRadius:32}}>
      <Text style={StyleCSS.styles.labelText}>{data}</Text>
    </TouchableOpacity>
  )
  }

  return (
    <View style={styles.container}>
      <CustomStatusBar />
      {pageLoading && <PageLoader />}
      {!pageLoading ? (
        <>
          <HeaderInner
            iconTop={iconTop}
            changingHeight={config.headerHeight}
            titleSize={titleSize}
            titleTop={titleTop}
            titleLeft={titleLeft}
            title={'Attendance'}
            back={true}
            removeRightHeader={true}
            backroute={'DashboardPage'}
            navigation={navigation}
            type={'findCourse'}
          />
          <KeyboardAwareScrollView
            style={styles.scrollView}
            // behavior={'padding'}
            keyboardShouldPersistTaps={'handled'}
            
            // scrollEventThrottle={16}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {useNativeDriver: false},
            )}
            >
            <View style={[styles.infoWrapper]}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.row_title}>Course</Text>
                  {attendancesStatus === 'loading' ? (
                    <Bubbles size={7} color={brandColor} />
                  ) : (
                    <Text style={[styles.row_content, {fontWeight: '600'}]}>
                      {studentAttendanceList &&
                        studentAttendanceList.selected_course_data &&
                        studentAttendanceList.selected_course_data.title}{' '}
                      {studentAttendanceList.selected_course_data &&
                        studentAttendanceList.selected_course_data
                          .price_type && (
                          
                            studentAttendanceList.selected_course_data
                              .price_type.members === '1' ? (
                              <Text style={[styles.row_content, {fontWeight: '600'}]}>
                                (1-on-1 Class)
                              </Text>
                            ) : (
                              <Text style={styles.row_content}>
                                (
                                {
                                  studentAttendanceList.selected_course_data
                                    .price_type.members
                                }{' '}
                                Members)
                              </Text>
                            )
                          
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

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={[styles.row_title]}>Teacher's Name</Text>
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
                <View style={styles.halfWidth}>
                  <Text style={[styles.row_title]}>Total No. of Classes</Text>
                  {attendancesStatus === 'loading' ? (
                    <Bubbles size={7} color={brandColor} />
                  ) : (
                    <Text style={styles.row_content}>
                      {studentAttendanceList.total_classes}
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
                <View style={styles.halfWidth}>
                  <Text style={styles.row_title}>
                    No. of Classes Completed:
                  </Text>
                  {attendancesStatus === 'loading' ? (
                    <Bubbles size={7} color={brandColor} />
                  ) : (
                    <Text style={styles.row_content}>
                      {studentAttendanceList.completed_classes}
                    </Text>
                  )}
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.row_title}>
                    No. of Classes Remaining
                  </Text>
                  {attendancesStatus === 'loading' ? (
                    <Bubbles size={7} color={brandColor} />
                  ) : (
                    <Text style={styles.row_content}>
                      {studentAttendanceList.remaining_classes}
                    </Text>
                  )}
                </View>
              </View>
              {studentAttendanceList && (studentAttendanceList.disputed_classes >0 || studentAttendanceList.refunded_classes>0) ?
              <>
                      <DashedLine
                      dashLength={5}
                      dashThickness={1}
                      dashGap={5}
                      dashColor={lineColor}
                    />
              <View style={styles.row}>
                  {studentAttendanceList && studentAttendanceList.disputed_classes && studentAttendanceList.disputed_classes>0 ?
                  <View style={styles.halfWidth}>
                    <Text style={styles.row_title}>No. of Classes Disputed</Text>
                    {attendancesStatus === 'loading' ? (
                      <Bubbles size={7} color={brandColor} />
                    ) : (
                      <Text style={styles.row_content}>
                        {studentAttendanceList.disputed_classes}
                      </Text>
                    )}
                  </View>: null }
              
                  {studentAttendanceList && studentAttendanceList.refunded_classes && studentAttendanceList.refunded_classes>0 ?
                    <View style={styles.halfWidth}>
                      <Text style={styles.row_title}>No. of Classes Refunded</Text>
                      {attendancesStatus === 'loading' ? (
                        <Bubbles size={7} color={brandColor} />
                      ) : (
                        <Text style={styles.row_content}>
                          {studentAttendanceList.refunded_classes}
                        </Text>
                      )}
                    </View> : null}
              </View>
              </> : null }
            </View>
            <View style={[styles.attendanceListWrapper]}>
              {attendancesStatus === 'loading' ? (
                <View style={styles.cardView}>
                  <Bubbles size={7} color={brandColor} />
                </View>
              ) : null}

              {reviewIndex !== null && reviewIndex<attendances.length ? (
                <View style={[styles.addReview]}>
                  <View>
                    <Text style={styles.row_title}> Class No. </Text>
                    <Text style={styles.row_content}>
                      {' '}
                      {attendances[reviewIndex].class_info}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={addReview}
                    style={styles.submitAttendanceButton}>
                    <Text style={styles.submitAttendanceText}>Mark Attendance</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {attendances && attendances.length>0 &&
                attendances.map((at: any, i: number) => {
                  return (
                    <View key={at.id}>
                      {at.status === 'S' || at.status === 'R' || at.status === 'D' ? (
                        <Card>
                          <View
                            style={[
                              styles.cardSplit,
                              {justifyContent: 'space-between'},
                            ]}>
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
                                <Text style={styles.row_title}>
                                  Class Taken on
                                </Text>
                                <Text style={styles.row_content}>
                                  {at.class_taken
                                    ? Moment(at.class_taken).format(
                                        'MMM DD, YYYY',
                                      )
                                    : ' - '}
                                </Text>
                              </View>
                            </View>
                            <View style={[styles.cardSplitSingle]}>
                              <View style={styles.cardSplitSingleItem}>
                                <Text style={styles.row_title}>Rating</Text>
                                <Text style={styles.row_content}>
                                  {at.rating > 0 ? at.rating + '/5' : ' - '}
                                </Text>
                              </View>
                            </View>
                          </View>
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

                          {at.status === 'D' && (
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
                          )}
                          {at.status === 'R' ? (
                            <View style={styles.amountRefunded}>
                              <Text style={styles.amountRefundedText}>
                                Amount Refunded.
                              </Text>
                            </View>
                          ) : null}
                          {at.status !== 'D' && at.status !== 'R' ? (
                            <View>
                              {((userData.user_type === 'S' &&
                                at.status !== 'P') ||
                                (userData.user_type === 'T' &&
                                  at.teacher_status === 'S') ||
                                (userData.user_type === 'T' &&
                                  at.status !== 'P')) && (
                                <Text
                                  style={styles.linkButton}
                                  onPress={() => {
                                    editAttendance(at, i);
                                  }}>
                                  Edit
                                </Text>
                              )}
                            </View>
                          ) : null}
                        </Card>
                      ) : null}
                    </View>
                  );
                })}
            </View>
          </KeyboardAwareScrollView>
        </>
      ) : null}

      {/* <AppMessage
          status={appStatus}
          statusMessage={appStatusMessage}
        /> */}
      {editAttendanceModal ? (
      
        <Modal presentationStyle="overFullScreen" transparent={true} statusBarTranslucent={true}>
         <KeyboardAvoidingView behavior='padding'>
          <TouchableOpacity  activeOpacity={1} onPress={()=> setEditAttendanceModal(false)} 
          style={StyleCSS.styles.modalBackground}
          >
          
            <TouchableOpacity activeOpacity={1}  onPress={()=>{Keyboard.dismiss()}} 
            style={[StyleCSS.styles.modalView]}
            >
            
              <>
              
              <View style={StyleCSS.styles.modalLine}></View>
              <Text style={StyleCSS.styles.modalTitle}>{modalTitle}</Text>
              <View style={[styles.modal_row, {flexDirection:'row'}]}>
                <Text style={styles.row_title}>Class No. </Text>
                <Text style={styles.row_content}>
                  {attendances[index].class_info}
                </Text>
              </View>
              <View style={styles.modal_row}>
              <CustomDateTimePicker
              width={width-32}
                  showDateTimePicker={showDateTimePicker}
                  // style={{}}
                  config={{color:'#fff'}}
                  selectedValue={attendances[index].class_taken &&
                    Moment(attendances[index].class_taken).format(
                      'MMM DD, YYYY',
                    )}
                  label = {'Class Taken on *'}
                  maximumDate={new Date()}
                  isVisible={isDateTimePickerVisible}
                  mode="date"
                  onConfirm={(selectedDate : any) => {
                    handleDatePicked(selectedDate, attendances[index], index);
                  }}
                  onCancel={hideDateTimePicker}
                  />
                  {/* <TouchableOpacity 
                     style={StyleCSS.styles.datePicker}
                     onPress={() => {
                      showDateTimePicker();
                    }}
                    >
                    <Text
                      style={{color:font1, fontSize:14, fontFamily: Helper.switchFont('medium')}}
                     
                      >
                      {attendances[index].class_taken
                    ? attendances[index].class_taken &&
                      Moment(attendances[index].class_taken).format(
                        'MMM DD, YYYY',
                      )
                    : 'Class Taken on *'}
                    </Text>
                    
                    {attendances[index].class_taken &&
                attendances[index].class_taken !== '' ? (
                  <Text
                    style={styles.topLabel}>
                    Class Taken on *
                  </Text>
                ) : null}
                    <View ><Calender/></View>
                    <DateTimePickerModal
                  maximumDate={new Date()}
                  isVisible={isDateTimePickerVisible}
                  mode="date"
                  onConfirm={selectedDate => {
                    handleDatePicked(selectedDate, attendances[index], index);
                  }}
                  onCancel={hideDateTimePicker}
                />

                  </TouchableOpacity> */}
                
              </View>

              <View style={styles.modal_row}>
                <View>
                  <Text style={styles.row_title}>
                    Rating *{/* <Text style={styles.req}> *</Text> */}
                  </Text>
                  <View style={styles.rating}>
                    <Rating
                      // ratingImage={RATING}
                      ratingColor={secondaryColor}
                       tintColor='#fff'
                      type="custom"
                         ratingBackgroundColor='#c8c7c8'
                      startingValue={attendances[index].rating}
                      onFinishRating={ratingCompleted}
                      ratingCount={5}
                      imageSize={36}
                      fractions={0}
                      // type='custom'
                      //   ratingBackgroundColor='#fff'
                      //   ratingCount={10}
                      //   imageSize={30}
                      //   style={{ paddingVertical: 10 }}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.modal_row}>
                <View >
                  {/* <Text style={styles.row_title}>
                          Review
                          <Text style={styles.req}>
                            *
                          </Text>
                        </Text> */}

                  <Textarea
                    containerStyle={[StyleCSS.styles.modalTextarea]}
                    style={StyleCSS.styles.reviewTextArea}
                    onChangeText={(text: string) => {
                      let attendanceTemp = attendances.map((o: any) => ({
                        ...o,
                      }));
                      attendanceTemp[index].review = text.trim();

                      dispatch(setAttendanceSuccess(attendanceTemp));
                      setSelectedReview(text.trim());
                    }}
                    defaultValue={attendances[index].review}
                    placeholder={'How was your experience? *'}
                    placeholderTextColor={font2}
                    underlineColorAndroid={'transparent'}
                  />
                  <View style={{position:'absolute', bottom:16, left:1, marginRight:2}}>
                  {suggestions && suggestions.length>0? <FlatList
                        data={suggestions}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        keyExtractor={(item, i) => i.toString()}
                        renderItem={({item, index}) =>
                         
                            loadSuggestions(item, index) 
                            
                        }
                      />:null}
                      </View>
                </View>
              </View>
              <View style={[StyleCSS.styles.lineStyleLight, {marginTop: 16}]} />
              <View style={[StyleCSS.styles.modalButton]}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    onRefresh();
                    setEditAttendanceModal(false);
                  }}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitAttendanceButton}
                  onPress={() => {
                    submitAttendance(attendances[index]);
                  }}>
                  <Text style={styles.submitAttendanceText}>Submit</Text>
                </TouchableOpacity>
              </View>
             
              </>
             
            </TouchableOpacity>
          </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>
       
      ) : null}
      {isRefillModalVisible ? (
        <Modal transparent={true} animationType={'slide'} statusBarTranslucent={true} >
          
          <View style={{backgroundColor: 'rgba(0,0,0,0.3)', height: '100%'}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 20,
                padding: 16,
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  minWidth: 250,
                }}>
                <Text
                  style={{
                    color: font2,
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

                <View style={{flexDirection: 'row', margin: 16}}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setIsRefillModalVisible(false);
                    }}>
                    <Text style={styles.cancelButtonText}>CANCEL</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.submitAttendanceButton}
                    onPress={() => {
                      setIsRefillModalVisible(false);
                      addToCart();
                    }}>
                    <Text style={styles.submitAttendanceText}>REFILL</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
};

export default StudentAttendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background4,
  },
  halfWidth: {
    width: '50%',
  },
  safecontainer: {
    width: width,
    flex: 1,
    backgroundColor: background4,
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
    marginHorizontal:16
  },
  lineStyle: {
    borderBottomWidth: 0.7,
    borderColor: '#E2E4E5',
  },
  infoWrapper: {
    paddingHorizontal: 16,
    backgroundColor:'#fff'
  },
  scrollView: {
    paddingBottom: 50,
    marginTop: config.headerHeight,
  },
  row: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    backgroundColor: background4,
    // marginTop: 8,
    height:'100%',
    paddingTop: 8,
    paddingHorizontal: 16,
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
  //   cardSplitSingle: {
  //     //    flex:1
  //     // width: '33.33%',
  //     // borderWidth:1
  //   },
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
    marginTop:8,
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
    fontFamily: Helper.switchFont('bold'),
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

  topLabel:{
    position: 'absolute',
    top: -10,
    left: 10,
    backgroundColor: '#fff',
    fontSize: 12,
    color: font2,
  }
});
