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
import {appBackground, brandColor, font2} from '../../styles/colors';
//@ts-ignore
import Textarea from 'react-native-textarea';
import {Rating} from 'react-native-ratings';
import Moment from 'moment';
import config from '../../config/Config';
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
import CustomStatusBar from '../../components/CustomStatusBar'
import HeaderInner from '../../components/HeaderInner';
import TeacherAttendance from './TeacherAttendance';
import StudentAttendance from './StudentAttendance';
type Props = NativeStackScreenProps<RootParamList, 'Attendance'>;

export interface AttendanceListInterface {
  userType: string;
  priceType: string;
  userToken: string;
  courseToken: string;
  token: string;
}

// HandleBackPress method to be added
// instead of teaArea, can also use textInput with multiline.
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
  
  //const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
    
  useEffect(() => {
    let data: AttendanceListInterface = {
      userType: userData.user_type,
      priceType: classType,
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

  // console.log(studentAttendanceList);
  // console.log(attendances);



  return (
    <>
      {userData.user_type ==='T'? 
      <TeacherAttendance 
      courseToken={courseToken}
      classType={classType}
      userToken={userToken}
      navigation={navigation}/> : 
      <StudentAttendance 
      courseToken={courseToken}
      classType={classType}
      userToken={userToken} 
      navigation={navigation}/>
      }
    </>
  );
}

export default Attendance;

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    backgroundColor: '#fff'
  },
  safecontainer: {
    width: width,
    flex: 1,
    backgroundColor: appBackground
  },
  body: {
    flex: 1,
    fontSize: 15,
    color: '#606060',
    lineHeight: 24,
    marginRight: 8,
  },
  lineStyle: {
    borderBottomWidth: 0.7,
    borderColor: '#E2E4E5',
  },
  infoWrapper: {
    marginLeft: 24,
    marginRight: 24,
    paddingTop: 30,
  },
  scrollView: {
    paddingBottom: 50,
    marginTop: config.headerHeight,
    
  },
  row: {
    paddingTop: 14,
    paddingBottom: 14,
  },
  addReview: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  row_content: {
    color: 'rgb(44, 54, 65)',
    fontSize: 14,flexDirection:'row',
    alignItems:'center',

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
    width: '33.33%',
  },
  cardSplitSingleItem: {
    marginBottom: 10,
  },
  linkButton: {
    color: brandColor,
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'flex-end',
  },
  input: {
    color: 'rgb(44, 54, 65)',
    margin: 0,
    fontSize: 16,
    padding: 16,
    height: 50,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'rgb(194, 194, 194)',
  },
  req: {
    color: '#ee0000',
    fontSize: 12,
    textAlignVertical: 'top',
    marginTop: -5,
  },
  rating: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reviewTextArea: {
    height: 150,
    color: 'rgb(44, 54, 65)',
    fontSize: 14,
    textAlignVertical: 'top',
    borderRadius: 5,
  },
  submitAttendanceButton: {
    padding: 12,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: brandColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: '100%',
    zIndex: 1,
  },
  submitAttendanceText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: Helper.switchFont('medium'),
    fontSize: 14,
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
  refillButtonText:{
    color: "#fff",
    textAlign: 'center',
    fontFamily: Helper.switchFont('medium'),
    fontSize: 12,
  },
  cancelButton:{
    padding: 12,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: 'rgb(255, 255, 255)',
    alignItems: 'center',
    justifyContent: 'center',
    //borderRadius: 5,
    alignSelf: 'flex-end',
    zIndex: 1,
    width: '50%',
    borderWidth: 0.5,
    borderColor: 'rgb(224, 224, 224)',
  },
  cancelButtonText:{
    color: 'rgb(108, 108, 108)',
    textAlign: 'center',
    fontSize: 12,
    fontFamily: Helper.switchFont('medium'),
  },
  amountRefunded:{
    padding: 12,
    backgroundColor: appBackground,
    justifyContent:'center',
    marginTop: 8,
    marginBottom: 8,
    borderRadius:5
  },
  amountRefundedText:{
    color: font2,
    fontSize: 14,
    fontWeight:'600',
    lineHeight: 17.64,
    textAlign: 'center',
    fontFamily: Helper.switchFont('medium')
  }
});
