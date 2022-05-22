import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Animated,
  TouchableOpacity,
  LayoutAnimation,
  // Image,
  Alert,
  StyleSheet,
  Platform,
  RefreshControl,
  PermissionsAndroid,
} from 'react-native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Moment from 'moment';
import {userState} from '../../reducers/user.slice';
import {setLoading, setPageLoading} from '../../reducers/loader.slice';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import {
  dashboardState,
  getEnrolledCourses,
  getEnrolledStudents,
  getTeacherCreatedCourses,
  generateCertificate,
} from '../../reducers/dashboard.slice';
import DashedLine from 'react-native-dashed-line';
import { setCheckoutDataDetails, setPage } from '../../reducers/checkout.slice';
import {useAppDispatch} from '../../app/store';
//@ts-ignore
import {Bubbles} from 'react-native-loader';
import {
  brandColor,
  secondaryColor,
  font1,
  font2,
  lineColor,
  secondaryColorBorder,
  font3,
  chartLight,
  background4,
} from '../../styles/colors';
import style from '../../styles/style';
import NoData from '../../components/NoData';
import Helper from '../../utils/helperMethods';
//@ts-ignore
import Pie from 'react-native-pie';
import config from '../../config/Config';
import CustomStatusBar from '../../components/CustomStatusBar';
import HeaderInner from '../../components/HeaderInner';
// @ts-ignore
// import Certificate from '../../assets/images/certificate.svg';
// @ts-ignore
import Download from '../../assets/images/download.svg';
import RNFetchBlob from 'rn-fetch-blob';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

// import DropdownArrow from '../../assets/images/dropdown.svg';
import { cartDetails } from '../../reducers/checkout.slice';
import { courseState } from '../../reducers/courses.slice';
import BottomNavigation from '../../components/BottomNavigation';
import CustomImage from '../../components/CustomImage';

const Tab = createMaterialTopTabNavigator();

type Props = NativeStackScreenProps<RootParamList, 'Dashboard'>;

export interface TeacherCreatedCoursesInterface {
  userToken: string;
  token: string;
}

export interface GenerateCertificateDataInterface {
  checkout_id: string;
  class_completed: string;
  request_id?: string;
}
export interface GenerateCertificateInterface {
  data: GenerateCertificateDataInterface;
  userToken: string;
}
// Teacher created courses api call done
// enrolled students api call done
// enrolled courses api call done
// mark atttendance done

// features left :

// ChatSettings
// getting chat users func
//deeplinking - handleopenurl , checkdeeplinking
//check appstatus and appstatusmessage from route.params
//componnentdid mount Linking.addEventListener("url", this._handleOpenURL);

//function getPieValsForWeeeks was declared but never used in th original app

const CardData = ({data, navigation}: any) => {
  const dispatch = useAppDispatch();
  const {userData} = useSelector(userState);
  const [fileUrl, setFileURL] = useState('');

  const generate_certificate = (course: any) => {
    // setIsLoadingTop(true); what does it do?
    dispatch(setLoading(true));
    console.log(course);
    let data: GenerateCertificateDataInterface;
    if (course.request_id) {
      data = {
        checkout_id: course.id,
        class_completed: course.class_completed,
        request_id: course.request_id,
      };
    } else {
      data = {
        checkout_id: course.id,
        class_completed: course.class_completed,
      };
    }

    let finalData: GenerateCertificateInterface = {
      data: data,
      userToken: userData.token,
    };
    dispatch(generateCertificate(finalData))
      .unwrap()
      .then(response => {
        dispatch(setLoading(false));
        console.log(response);
        if (response.data.status === 'success') {
          navigation.navigate('ActionStatus', {
            //  navigator:'DashboardNav',
            messageStatus: 'success',
            messageTitle: 'Congratulations!',
            messageDesc: response.data.error_message.message,
            timeOut: 4000,
            //backRoute: 'DrawerStudent',
            backRoute: 'DashboardPage', //till drawer student is not implemented
          });
        } else if (response.data.status === 'failure') {
          navigation.navigate('ActionStatus', {
            // navigator:'UserNavigator',
            messageStatus: 'failure',
            messageTitle: 'Sorry!',
            timeOut: 4000,
            messageDesc: response.data.error_message.message,
            //backRoute: 'DrawerStudent',
            backRoute: 'DashboardPage', //till drawer student is not implemented
          });
        }
      })
      .catch(error => {
        dispatch(setLoading(false));
      });
  };

  const getFileExtention = (fileUrl: any) => {
    // To get the file extension
    console.log(/[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined);
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const downloadFile = () => {
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = fileUrl;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const {config, fs} = RNFetchBlob;
    let RootDir =Platform.OS==='ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
console.log(RootDir);
    const options = Platform.OS === 'ios' ? {fileCache: true,
      path: `${RootDir}/${file_ext}`,
      appendExt: file_ext,} :
      {
        fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
      };

    const configOptions = Platform.select({
      ios: {
        fileCache: true,
        path: `${RootDir}/${file_ext}`,
        appendExt: file_ext,
      },
      android : {
        fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
      }
    });

    // let options = {
    //   fileCache: true,
    //   addAndroidDownloads: {
    //     path:
    //       RootDir +
    //       '/file_' +
    //       Math.floor(date.getTime() + date.getSeconds() / 2) +
    //       file_ext,
    //     description: 'downloading file...',
    //     notification: true,
    //     // useDownloadManager works with Android only
    //     useDownloadManager: true,
    //   },
    // };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        console.log(res);
        Alert.alert('File Downloaded Successfully.');
      });
  };

  //   useEffect(()=>{
  // if(fileUrl){
  //   checkPermission();
  // }
  //   }, [fileUrl])

  const checkPermission = async (fileURL: any) => {
    setFileURL(fileURL);
    // Function to check the platform
    // If Platform is Android then check for permissions.

    if (Platform.OS === 'ios') {
      downloadFile();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile();
          console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log('++++' + err);
      }
    }
  };

  return (
    <>
      <View style={styles.enrolledStudentsSubSection}>
      
        {/* <View style={style.styles.flexDirRow}>
              <Image
                source={require('@images/calendar_icon.png')}
                style={styles.sectionHeaderIcon}
              />
              <Text style={styles.sectionHeaderText}>Classes</Text>
            </View> */}

        <View style={styles.enrolledStudentsClassesChartSection}>
          <View style={[styles.enrolledStudentsClassesBought,{alignItems:'center'}]}>
            <Text style={[styles.enrolledStudentsTextLarge]}>
              {data.class_bought}
            </Text>
            <Text style={styles.enrolledStudentsTextLight}>Bought</Text>
          </View>
          <View style={styles.pieChart}>
            <Pie
              radius={42}
              innerRadius={29}
              sections={[
                // {
                //   percentage:
                //     (parseInt(data.class_disputed) /
                //       parseInt(data.class_bought)) *
                //     100,
                //   color: 'rgb(255, 125, 114)',
                // },
                {
                  percentage:
                    (parseInt(data.class_completed) /
                      parseInt(data.class_bought)) *
                    100,
                  color: font3,
                },
                {
                  percentage:
                    
                    ((parseInt(data.class_bought) -parseInt(data.class_completed)) /
                      parseInt(data.class_bought) )*
                      100,
                  color: chartLight
                },
              ]}
              strokeCap={'round'}
            />
          </View>
          <View style={[styles.enrolledStudentsClassesCompleted, {alignItems:'center'}]}>
            <Text
              style={[styles.enrolledStudentsTextLarge, styles.colorSuccess]}>
              {data.class_completed}
            </Text>
            <Text style={styles.enrolledStudentsTextLight}>Completed</Text>
          </View>
        </View>
      </View>
      {/*<View style={[style.styles.lineStyleDashed]} />
       <View style={styles.enrolledStudentsSubSection}>
        <View>
          <View style={[style.styles.flexDirRow, {alignItems: 'center'}]}>
            <View style={{marginLeft: 3, marginRight: 10}}>
            <CustomImage height={24} width={24} uri={`${config.media_url}certificate.svg}/>
              // <Certificate />
            </View>
            <Text style={styles.certificate_text}>Certificate </Text>
            {!data.certificate ? <Text>(</Text> : null}
            <View style={styles.enrolledCoursesGenerateCertificate}>
              {data.class_completed == 0 ? (
                <View>
                  <Text style={styles.certificate_text}>On Completion</Text>
                </View>
              ) : null}
              {data.class_completed > 0 &&
              !data.certificate &&
              data.is_certificate_requested ? (
                <View>
                  <Text style={styles.certificate_text}>In Progress</Text>
                </View>
              ) : null}
              <View>
                {data.class_completed > 0 &&
                !data.certificate &&
                !data.is_certificate_requested ? (
                  // ||
                  // (data.class_completed > 0 &&
                  //   data.certificate &&
                  //   !data.is_certificate_requested)
                  <TouchableOpacity
                    style={styles.certificate_touch}
                    onPress={() => generate_certificate(data)}>
                    <Text style={styles.certificate_text}>Generate</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              {!data.certificate ? <Text>)</Text> : null}
            </View>

            { Platform.OS === 'android' && data.certificate ? (
              <TouchableOpacity
                onPress={() => checkPermission(data.certificate)}
                style={styles.downloadButton}>
                
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity>
             ) : null} 
          </View>
          <Text style={styles.certificate_info_text}>
            7 classes left for the next Silver certificate{' '}
          </Text>
        </View>
      </View> */}
      {/* <View style={styles.enrolledStudentsGreySection}>
            <View style={styles.enrolledStudentsClassDisputedIcon}></View>
            <Text style={styles.enrolledStudentsTextLight}>
              Classes Disputed
            </Text>
            <Text style={styles.enrolledStudentsTextDark}>
              {data.class_disputed}
            </Text>
          </View> */}
     
            <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={5}
              dashColor={lineColor}
            />
         
      <View style={styles.enrolledStudentsSubSection}>
        {/* <View style={style.styles.flexDirRow}>
              <Image
                source={require('@images/amount_transaction_icon.png')}
                style={styles.sectionHeaderIcon}
              />
              <Text style={styles.sectionHeaderText}>Amount</Text>
            </View> */}
        {/* css */}
        <View style={[style.styles.flexDirRow]}>
          <View style={styles.halfWidth}>
            {userData.user_type === 'S' ? (<Text style={[styles.enrolledStudentsTextLarge, {fontSize:16, marginBottom:4}]}>
              {data.currency_type === 'INR' ? 'Rs.' : 'US$'}
              {data.per_class_price}
            </Text>) : null}
            <Text style={[styles.enrolledStudentsTextLight]}>Per Class</Text>
            {userData.user_type === 'T' ? (<Text style={[styles.enrolledStudentsTextLarge,styles.teacherPrice, {marginTop:4}]}>
              {data.currency_type === 'INR' ? 'Rs.' : 'US$'}
              {data.per_class_price}
            </Text>) : null}
          </View>
          <View style={styles.halfWidth}>
            {userData.user_type === 'S' ? (<Text
              style={[styles.enrolledStudentsTextLarge, {marginBottom:4}]}>
              {data.currency_type === 'INR' ? 'Rs.' : 'US$'}
              {data.amount_released}
            </Text>) :null }
            <Text style={styles.enrolledStudentsTextLight}>
              Amount Released
            </Text>
            {userData.user_type === 'T' ? (<Text
              style={[styles.enrolledStudentsTextLarge, styles.teacherPrice, {marginTop:4}]}>
              {data.currency_type === 'INR' ? 'Rs.' : 'US$'}
              {data.amount_released}
            </Text>) :null }
          </View>
        </View>
      </View>
    </>
  );
};

export const LoaderDashboard = (): any => {
  return (
    <View style={[style.styles.shadow, styles.loaderWrapper]}>
      <View style={styles.loaderTextWrapper}>
        <Text style={styles.loaderText}>Please wait..</Text>
        <Bubbles size={7} color={brandColor} />
      </View>
      <View style={styles.addBorderBottom} />
      <View style={styles.loaderBottomView}></View>
    </View>
  );
};

export interface CartDetailsData {
  courseToken: string;
  classType: any;
  userToken: string;
}

export default function Dashboard({navigation}: Props) {
  const dispatch = useAppDispatch();
  const {
    teacherCreatedCourses,
    teacherCreatedCoursesStatus,
    enrolledStudents,
    enrolledStudentsStatus,
    enrolledCourses,
    enrolledCoursesStatus,
  } = useSelector(dashboardState);
  const {userData} = useSelector(userState);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState('Dashboard');
  const [selectedStudentID, setSelectedStudentID] = useState<string>('');
  const [checkoutToken , setCheckoutToken] = useState<string|undefined>(undefined);
  let scrollY = new Animated.Value(0.01);
  // let changingHeight = scrollY.interpolate({
  //   inputRange: [0.01, 50],
  //   outputRange: [conf],
  //   extrapolate: 'clamp',
  // });
  let fixedHeight = scrollY.interpolate({
    inputRange: [0.01, 45],
    outputRange: [36, 24],
    extrapolate: 'clamp',
  });
  // let titleLeft = scrollY.interpolate({
  //   inputRange: [0.01, 35],
  //   outputRange: [0, 36],
  //   extrapolate: "clamp",
  // });
  let titleSize = scrollY.interpolate({
    inputRange: [0.01, 35],
    outputRange: [20, 20],
    extrapolate: 'clamp',
  });
  let titleTop = scrollY.interpolate({
    inputRange: [0.01, 35],
    outputRange: [50, 50],
    extrapolate: 'clamp',
  });
  let headFade = scrollY.interpolate({
    inputRange: [0.01, 45],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  let masqFade = scrollY.interpolate({
    inputRange: [0.01, 70],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  let subTitleFade = scrollY.interpolate({
    inputRange: [0.01, 10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  let profImageSize = scrollY.interpolate({
    inputRange: [0.01, 45],
    outputRange: [43, 30],
    extrapolate: 'clamp',
  });
  let profImageRadius = scrollY.interpolate({
    inputRange: [0.01, 45],
    outputRange: [22, 15],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    getDefaultDashboard();
  }, []);

  const getDefaultDashboard = () => {
    if (userData.user_type === 'T') {
      let data: TeacherCreatedCoursesInterface = {
        userToken: userData.user_token,
        token: userData.token,
      };
      dispatch(getTeacherCreatedCourses(data));
      dispatch(getEnrolledStudents(userData.token));
    } else if (userData.user_type === 'S') {
      dispatch(getEnrolledCourses(userData.token));
    }
  };

  const markAttendance = (data: any): void => {
    navigation.navigate('Attendance', {
      courseToken: data.course_token,
      classType: data.class_type,
      //checkoutToken: data.checkout_token,
      userToken: data.user_token,
    });
  };
  const onRefresh = () => {
    setRefreshing(false);
    setCurrentRoute('Dashboard');
    getDefaultDashboard();
  };

  const downloadCertificate = () => {};

  console.log(userData);

  //not used anywhere
  // const noCertificate = () => {
  //   Alert.alert("", config.messages.no_certificate, [
  //     { text: "Okay", style: "cancel" },
  //   ]);
  // };

  // const generate_certificate = (course: any) => {
  //   // setIsLoadingTop(true); what does it do?
  //   dispatch(setLoading(true));
  //   console.log(course);
  //   let data  : GenerateCertificateDataInterface;
  //   if (course.request_id) {
  //     data = {
  //       checkout_id: course.id,
  //       class_completed: course.class_completed,
  //       request_id: course.request_id,
  //     };
  //   } else {
  //     data = {
  //       checkout_id: course.id,
  //       class_completed: course.class_completed,
  //     };
  //   }

  //   let finalData : GenerateCertificateInterface= {
  //     data: data,
  //     userToken: userData.token
  //   }
  //   dispatch(generateCertificate(finalData))
  //   .unwrap()
  //     .then(response => {
  //       dispatch(setLoading(false));
  //       console.log(response)
  //       if (response.data.status === 'success') {
  //        navigation.navigate('ActionStatus', {
  //         //  navigator:'DashboardNav',
  //             messageStatus: 'success',
  //             messageTitle: 'Congratulations!',
  //             messageDesc: response.data.error_message.message,
  //             timeOut: 4000,
  //             //backRoute: 'DrawerStudent',
  //             backRoute: 'DashboardPage',  //till drawer student is not implemented
  //           });

  //       } else if (response.data.status === 'failure') {
  //         navigation.navigate('ActionStatus', {
  //           // navigator:'UserNavigator',
  //             messageStatus: 'failure',
  //             messageTitle: 'Sorry!',
  //             timeOut: 4000,
  //             messageDesc: response.data.error_message.message,
  //              //backRoute: 'DrawerStudent',
  //              backRoute: 'DashboardPage',  //till drawer student is not implemented
  //           });
  //       }
  //     })
  //     .catch(error => {
  //       dispatch(setLoading(false))
  //     });
  // };

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

  const addToCart = (data: any): void => {
    console.log(data)
    // dispatch(setCheckoutDataDetails({}));

    const finalData: CartDetailsData = {
      courseToken: data.course_token,
      classType: data.class_type.id,
      userToken: userData.token,
    };

    dispatch(cartDetails(finalData))
      .unwrap()
      .then(response => {
        console.log(response)
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

  

  const loadEnrolledStudents = (data: any, index: number): any => {
    console.log(data);
    return (
      <>
        {data.user_token + '_' + data.seo_slug_url + '_' + index ===
        selectedStudentID ? (
          <View
            style={[
              style.styles.shadow,
              styles.enrolledStudentsWrapper,
              styles.active,
            ]}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setSelectedStudentID(
                    selectedStudentID ===
                      data.user_token + '_' + data.seo_slug_url + '_' + index
                      ? ''
                      : data.user_token + '_' + data.seo_slug_url + '_' + index,
                  );
                }}>
                <View style={[styles.enrolledStudentsIntroSection]}>
                  {/* <View> */}
                  <View style={{flexDirection:'row'}}>
                    <View style={{height:56, width:56, borderRadius:30, borderColor:brandColor, borderWidth:1.3, alignItems:'center', justifyContent:'center'}}>
                      
                      <CustomImage
                        uri={data.profile_pic}
                        style={styles.enrolledStudentsProfilePic}
                      />
                    </View> 
                  <View style={[styles.enrolledStudentsNameWrapper]}>
                    <View>
                      <Text style={styles.studentName}>
                        {Helper.strCapitalize(data.studnet_name)}
                      </Text>
                      <Text style={styles.studentCountry}>
                        {data.studnet_country}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.dropdownIcon, styles.dropBackground,
                      // {
                      //   transform: [
                      //     {
                      //       rotate: '180deg',
                      //     },
                      //   ],

                      // },
                    ]}>
                       <CustomImage height={16} width={16} uri={`${config.media_url}dropdown.svg`}/>
                    {/* <DropdownArrow /> */}
                  </View>
                  
                  </View>
                </View>
              </TouchableOpacity>

              <View>
                {/* <View style={styles.lineStyleLightMore} /> */}
                <View style={{marginHorizontal: 16}}>
            <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={5}
              dashColor={lineColor}
            />
          </View>
                <View style={[styles.cardSubcontainer]}>
                  <Text style={styles.courseText}>Course</Text>

                  <Text style={styles.enrolledStudentsCoursename}>
                    {data.course_name}{' '}
                    {data.class_type.members === '1'
                      ? '(1-on-1 Class)'
                      : '( ' + data.class_type.members + ' Members)'}
                  </Text>
                 
            <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={5}
              dashColor={lineColor}
            />
          
                  <CardData data={data} navigation={navigation} />
                </View>
                {/* <View style={styles.enrolledStudentsGreySection}>
                <Text style={styles.enrolledStudentsTextLight}>
                  Week Released
                </Text>
                <Text style={styles.enrolledStudentsTextDark}>
                  {data.pay_class_released}
                </Text>
              </View> */}
              </View>

              <View style={[
                // style.styles.flexDirRow,
                {flexDirection:'row', justifyContent:'flex-end', paddingHorizontal:16}]}>
                {/* <TouchableOpacity
                  style={styles.upcomingFeature}
                  onPress={() => Alert.alert('Feature will be Coming soon!')}>
                  <Text style={styles.upcomingFeatureText}></Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={
                    
                    {paddingHorizontal:16, paddingTop:10, paddingBottom:12, backgroundColor:brandColor, borderRadius:8, marginTop: 8,marginBottom:16, }
                  }
                  onPress={() => markAttendance(data)}>
                  <Text style={{color: '#fff',
    fontSize: 14,
    fontFamily: Helper.switchFont('bold'),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',

    fontWeight:'700'}}>Mark Attendance</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={[style.styles.shadow, styles.enrolledStudentsWrapper]}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setSelectedStudentID(
                    selectedStudentID ===
                      data.user_token + '_' + data.seo_slug_url + '_' + index
                      ? ''
                      : data.user_token + '_' + data.seo_slug_url + '_' + index,
                  );
                }}>
                <View style={styles.enrolledStudentsIntroSection}>
                  <View style={{flexDirection:'row'}}>
                  <CustomImage
                    uri={data.profile_pic}
                    style={styles.enrolledStudentsProfilePic}
                  />

                  <View style={styles.enrolledStudentsNameWrapper}>
                    <View>
                      <Text style={styles.studentName}>
                        {Helper.strCapitalize(data.studnet_name)}
                      </Text>
                      <Text style={styles.studentCountry}>
                        {data.studnet_country}
                      </Text>
                    </View>
                  </View>
                 
                  <View style={[styles.dropdownIcon]}>
                  <CustomImage height={16} width={16} uri={`${config.media_url}dropdown.svg`}/>

                    {/* <DropdownArrow /> */}
                  </View>

                  {/* <Image
                source={require('@images/down_arrow.png')}
                // css
                style={[
                  styles.dropdownIcon,
                  {
                    transform: [
                      {
                        rotate:
                          selectedStudentID ===
                          data.user_token +
                            '_' +
                            data.seo_slug_url +
                            '_' +
                            index
                            ? '180deg'
                            : '0deg',
                      },
                    ],
                  },
                ]}
              /> */}
              </View>
                </View>
                <TouchableOpacity
                onPress={() => markAttendance(data)}
                  style={{flexDirection: 'row', marginTop:-16, justifyContent: 'flex-end'}}>
                  <Text style={styles.teacherMarkAttendance}>
                    Mark Attendance
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </>
    );
  };

  const loadCreatedCourses = (data: any, index: number): any => {
    return (
      <View style={[style.styles.shadow, styles.createdCoursesWrapper]}>
        <View style={styles.createdCoursesImageWrapper}>
          <CustomImage
            uri={data.course_image}
            style={styles.createdCoursesImage}
          />
        </View>
        <View style={styles.createdCoursesInfoWrapper}>
          <Text style={styles.cardTitle}>{data.title}</Text>
          <View style={styles.createdCoursesSubInfoWrapper}>
            <Text style={styles.createdCoursesDate}>
              {Moment.tz(data.course_created, userData.timezone).format(
                'MMM DD, YYYY',
              )}
            </Text>
            <Text style={styles.createdCoursesStatus}>
              Course Status:
              {
                <Text style={styles.createdCoursesReviewStatus}>
                  {
                    //@ts-ignore
                    {
                      A: 'Approved',
                      D: 'Draft',
                      P: 'Review',
                      R: 'Rejected',
                    }[data.status]
                  }
                </Text>
              }
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const loadEnrolledCourses = (data: any, index: number): any => {
    return (
      <View style={[style.styles.shadow, styles.enrolledStudentsWrapper]}>
        <View style={styles.createdCoursesImageWrapper}>
        <LinearGradient
            start={{x: 0.0, y: 0}}
            end={{x: 0, y: 1.0}}
            colors={['rgba(233, 67, 53, 0)', 'rgba(233, 67, 53, 1)']}
            style={{
              height: 85,
              top:95,
              zIndex: 20,
              position: 'absolute',
              opacity: 0.5,
              width: '100%',
            }}></LinearGradient>
          <CustomImage
            uri={data.course_image}
            style={styles.enrolledCoursesImage}
          />
        </View>
        <View style={styles.enrolledCoursesInfoWrapper}>
          <View style={[styles.enrolledCoursesCoursename]}>
            <Text style={styles.cardTitle}>
              {data.course_name}{' '}
              {data.class_type.members === '1'
                ? '(1-on-1 Class)'
                : '( ' + data.class_type.members + ' Members)'}
            </Text>
            {/* css */}
            <View style={[style.styles.flexDirRow, {marginTop: 8}]}>
              <Text style={[styles.enrolledCoursesTeacherName]}>
                by {Helper.strCapitalize(data.teacher_name)}
              </Text>

              {/* <View style={styles.enrolledCoursesGenerateCertificate}>
                {data.class_completed == 0 && (
                  <View style={styles.certificate_touch}>
                    <Image
                      source={require('@images/dashboard_certificate.png')}
                      style={styles.certificate_img}
                    />
                    <Text style={styles.certificate_text}>On Completion</Text>
                  </View>
                )}
                {data.class_completed > 0 &&
                  !data.certificate &&
                  data.is_certificate_requested && (
                    <View style={styles.certificate_touch}>
                      <Image
                        source={require('@images/dashboard_certificate.png')}
                        style={styles.certificate_img}
                      />
                      <Text style={styles.certificate_text}>In Progress</Text>
                    </View>
                  )}
                <View>
                  {((data.class_completed > 0 &&
                    !data.certificate &&
                    !data.is_certificate_requested) ||
                    (data.class_completed > 0 &&
                      data.certificate &&
                      !data.is_certificate_requested)) && (
                    <TouchableOpacity
                      style={styles.certificate_touch}
                      onPress={() => generate_certificate(data)}>
                      <Image
                        source={require('@images/dashboard_certificate.png')}
                        style={styles.certificate_img}
                      />
                      <Text style={styles.certificate_text}>Generate</Text>
                    </TouchableOpacity>
                  )} */}
              {/* {data.class_completed > 0 &&
                                                    data.certificate &&
                                                    !data.is_certificate_requested && (
                                                      <TouchableOpacity
                                                        style={styles.certificate_touch_bottom}
                                                        onPress={() => config.downloadFile(data.certificate)}
                                                      >
                                                        <Image
                                                          source={require("@images/dashboard_certificate_active.png")}
                                                          style={styles.certificate_img}
                                                        />
                                                        <Text style={styles.certificate_text}>Download</Text>
                                                      </TouchableOpacity>
                                                    )} */}
              {/* </View> */}
              {/* </View> */}
            </View>
          </View>
        </View>
        <View style={style.styles.lineStyleLight} />
        <View>
          <CardData data={data} navigation={navigation} />
          {/* css */}

          {/* <View style={styles.enrolledStudentsSubSection}>
            <View style={style.styles.flexDirRow}>
              <Image
                source={require('@images/calendar_icon.png')}
                style={styles.sectionHeaderIcon}
              />
              <Text style={styles.sectionHeaderText}>Classes</Text>
            </View>
            </View> */}

          {/* <View style={styles.enrolledStudentsGreySection}>
            <Text style={styles.enrolledStudentsTextLight}>Week Released</Text>
            <Text style={styles.enrolledStudentsTextDark}>
              {data.class_completed}
            </Text>
          </View> */}
        </View>
        <View style={style.styles.lineStyleLight} />
        {/* css */}
        <View style={[style.styles.flexDirRow, {padding: 16, justifyContent:'space-between'}]}>
          <TouchableOpacity
            style={styles.markAttendance}
            onPress={() => markAttendance(data)}>
            <Text style={[styles.markAttendanceText]}>Mark Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.refillButton}
            onPress={() => addToCart(data)}>
            <Text style={styles.refillText}>Refill</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const [tabState, setTabState] = useState<'S' | 'C'>('S');

  return (
    <>
      {/* <CustomStatusBar /> */}
      {/* <Loader isLoading={isLoadingTop} /> */}
      
        <HeaderInner
          profImageRadius={profImageRadius}
          masqFade={masqFade}
          titleSize={titleSize}
          titleTop={titleTop}
          // titleLeft={titleLeft}
          fixedHeight={fixedHeight}
          profImageSize={profImageSize}
          headFade={headFade}
          logo={true}
          dashboardHeight={config.headerHeight}
          title={'Dashboard'}
          userImage={
            userData && userData.user_media
              ? userData.user_media.profile_pic
              : ''
          }
          navigation={navigation}
          type={'dashboard'}
        />
        {/* {userData && userData.user_type === 'T' ? (
          <>
            <Animated.View style={{flexDirection: 'row', zIndex: -1, top: 80}}>
              <Image
                style={{width: '100%'}}
                source={require('@images/header_bg.png')}
              />
              <TouchableOpacity
                onPress={() => setTabState('S')}
                style={[
                  {
                    position: 'absolute',
                    top: 60,
                    paddingLeft: 20,
                    paddingBottom: 10,
                    width: '50%',
                  },
                  tabState === 'S' ? styles.activeBorder : null,
                ]}>
                <Text
                  style={
                    tabState === 'S'
                      ? styles.tabTextActive
                      : styles.tabTextInactive
                  }>
                  List of Students
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTabState('C')}
                style={[
                  {
                    position: 'absolute',
                    top: 60,
                    paddingLeft: 20,
                    paddingBottom: 10,
                    right: 0,
                    width: '50%',
                  },
                  tabState === 'C' ? styles.activeBorder : null,
                ]}>
                <Text
                  style={
                    tabState === 'C'
                      ? styles.tabTextActive
                      : styles.tabTextInactive
                  }>
                  Created Courses
                </Text>
              </TouchableOpacity>
            </Animated.View>
            <View
              style={{
                position: 'relative',
                zIndex: 999,
                top: 83,
                flexDirection: 'row',
                paddingLeft: 16,
                backgroundColor: '#fff',
                paddingVertical: 12,
                alignItems: 'center',
              }}>
              <Text style={styles.filterAllCourses}>All Courses</Text>
              <TouchableOpacity>
                <DropdownArrow />
              </TouchableOpacity>
            </View>
          </>
        ) : null} */}

        <ScrollView
          style={
            styles.scrollView
          }
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          
          onScroll={Animated.event(
            [
              {
                nativeEvent:
                  userData.user_type === 'S'
                    ? {contentOffset: {y: scrollY}}
                    : {},
              },
            ],
            {useNativeDriver: false},
          )}
          >
          {userData.user_type === 'T' ? (
            <>
              {tabState === 'S' ? (
                <>
                  {enrolledStudentsStatus === 'loading' ? (
                    <View><LoaderDashboard/></View>
                  ) : enrolledStudentsStatus === 'success' &&
                    enrolledStudents.data &&
                    enrolledStudents.data.length > 0 ? (
                    <View style={[ {paddingTop:12, marginBottom:75}]}>
                      <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={enrolledStudents.data}
                        renderItem={({item, index}) =>
                          loadEnrolledStudents(item, index)
                        }
                      />
                      {/* <View style={{marginBottom:200}}/> */}
                    </View>
                  ) : (
                    <NoData
                      message={'No Students enrolled into any of your courses'}
                    />
                  )}
                </>
              ) : (
                <>
                  {teacherCreatedCoursesStatus === 'loading' ? (
                    <View>{<LoaderDashboard/>}</View>
                  ) : teacherCreatedCoursesStatus === 'success' &&
                    teacherCreatedCourses.data &&
                    teacherCreatedCourses.data.length > 0 ? (
                    <View>
                      <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={teacherCreatedCourses.data}
                        renderItem={({item, index}) =>
                          loadCreatedCourses(item, index)
                        }
                      />
                    </View>
                  ) : (
                    <NoData message={'No Courses found'} />
                  )}
                </>
              )}
            </>
          ) : userData.user_type === 'S' ? (
            <View style={{}}>
              <View style={{marginTop: 16}}></View>
              {enrolledCoursesStatus === 'loading' ? (
                <>
                  <View>{<LoaderDashboard/>}</View>
                  <View>{<LoaderDashboard/>}</View>
                  <View>{<LoaderDashboard/>}</View>
                  <View>{<LoaderDashboard/>}</View>
                </>
              ) : enrolledCoursesStatus === 'success' &&
                enrolledCourses.data &&
                enrolledCourses.data.length > 0 ? (
                <View style={{backgroundColor:background4, paddingBottom: 88}}>
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={enrolledCourses.data}
                    renderItem={({item, index}) =>
                      loadEnrolledCourses(item, index)
                    }
                  />
                </View>
              ) : (
                <NoData message={'No Courses found'} />
              )}
            </View>
          ) : null}
        </ScrollView>
     <BottomNavigation navigation={navigation} selected={'D'}/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background4,
    marginTop:config.headerHeight
  },

  cardTitle: {
    fontSize: 16,
    fontWeight:'600',
    fontFamily: Helper.switchFont('semibold'),
    color: font1,

  },

  lineStyleLightMore: {
    borderBottomWidth: 1.4,
    borderColor: 'rgb(249, 249, 249)',
  },
  lineStyle: {
    borderBottomWidth: 1.4,
    borderColor: '#E2E4E5',
  },
  lineStyleStudent: {
    borderWidth: 0.5,
    borderColor: '#E2E4E5',
  },
  whiteText: {
    color: '#fff',
  },
  courseText: {
    // marginLeft: 16,
    color: font2,
    fontSize: 14,
    fontFamily: Helper.switchFont('regular'),
  },
  certificate_img: {
    height: 20,
    width: 16.5,
    marginRight: 8,
  },
  
  certificate_text: {
    color: font2,
    fontSize: 14,
    fontWeight:'400',
    fontFamily: Helper.switchFont('medium'),
    // selfAlign: "flex-end",
  },
  certificate_info_text: {
    color: font2,
    marginTop: 10,
    fontSize: 14,
    fontFamily: Helper.switchFont('regular'),
  },
  certificate_touch: {
    flexDirection: 'row',
  },
  certificate_touch_bottom: {
    flexDirection: 'row',
  },
  addBorderBottom: {
    backgroundColor: '#cdcdcd',
    height: 1,
    marginTop: 16,
    marginHorizontal: 0,
    marginBottom: 0,
  },
  teacherMarkAttendance: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontFamily: Helper.switchFont('medium'),
    margin: 16,
fontWeight:'700',
    color: brandColor,
    fontSize: 14,
  },
  loaderWrapper: {
    marginHorizontal: 16,
    zIndex: 999,
    borderRadius: 10,
    marginTop: 9,
    marginBottom: 9,
    backgroundColor: '#fff',
    flex: 1,
  },
  
  loaderText: {
    color: brandColor,
    fontSize: 14,
    marginBottom: 10,
    marginTop: 25,
  },
  loaderBottomView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    marginRight: 4,
    height: 40,
  },
  loaderTextWrapper: {
    marginTop: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBorderBottomInner: {
    backgroundColor: '#cdcdcd',
    height: 1,
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 0,
  },
  cardSubcontainer: {
    paddingTop: 16,
    marginHorizontal: 16,
    // borderWidth:1
  },
  filterAllCourses: {
    fontSize: 16,
    fontFamily: Helper.switchFont('regular'),
    marginRight: 18,
  },

  titleText: {
    fontSize: 18,
    color: 'rgb(44, 54, 65)', //"rgb(255, 255, 255)",
    fontFamily: Helper.switchFont('medium'),
    marginTop: 0,
    marginHorizontal: 24,
    marginBottom: 10,
    //opacity: subTitleFade,
  },
  createdCoursesWrapper: {
    marginHorizontal: 16,
    zIndex: 999,
    borderRadius: 10,
    marginTop: 9,
    marginBottom: 9,
    backgroundColor: 'white',
    flex: 1,
  },
  createdCoursesImage: {width: '100%', height: 180},
  enrolledCoursesImage: {
    width: '100%',
    height: 180,
    zIndex:-1,
    borderBottomLeftRadius: 0,
  },
  createdCoursesImageWrapper: {
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  createdCoursesInfoWrapper: {
    // marginTop: ,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    flex: 1,
    textAlign: 'center',
  },
  createdCoursesSubInfoWrapper: {flexDirection: 'row', flex: 1},
  createdCoursesDate: {
    color: font2,
    fontSize: 16,
    marginTop: 16,
    width: '40%',
    fontFamily: Helper.switchFont('regular'),
  },
  createdCoursesStatus: {
    color: font2,
    fontSize: 16,
    marginTop: 16,
    fontFamily: Helper.switchFont('regular'),
    textAlign: 'right',
    // selfAlign: "flex-end",
    width: '60%',
  },
  createdCoursesReviewStatus: {
    color: font1,
    fontSize: 16,
    marginTop: 16,
    fontFamily: Helper.switchFont('medium'),
  },
  enrolledStudentsWrapper: {
    zIndex: 999,
    marginHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: 'white',
  },
  active: {
    marginHorizontal: 0,
  },
  enrolledStudentsIntroSection: {flexDirection: 'row', alignItems:'center', paddingHorizontal: 16, paddingTop:16, paddingBottom:12},
  enrolledStudentsProfilePic: {
    width: 48,
    height: 48,
    alignItems: 'center',
    borderRadius: 25,
  },
  dropdownIcon: {
    // marginTop: 20,
    // marginRight: 12,
    // width: 16,
    // height: 9,
    // borderWidth:1,
    height:'100%',
    flexDirection:'column',
    justifyContent:'flex-start'
  },
  enrolledStudentsCoursename: {
    marginTop: 5,
    fontSize: 14,marginBottom:16,

    fontFamily: Helper.switchFont('medium'),
    color: font1,
  },
  teacherPrice:{
    fontSize:16,
    fontWeight:'600'

  },
  studentName: {
    fontSize: 16,
    fontFamily: Helper.switchFont('medium'),
    color: font1,
    fontWeight:'600'
  },
  enrolledStudentsNameWrapper: {
    flexDirection: 'row',
    marginLeft: 16,
    flex: 1,
    textAlignVertical: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  studentCountry: {
    fontSize: 14,
    marginTop:3,
    color: font2,
  },
  sectionHeaderIcon: {
    width: 18,
    height: 20,
    alignItems: 'center',
    marginRight: 8,
  },
  sectionHeaderText: {
    fontFamily: Helper.switchFont('medium'),
    fontSize: 15,
    color: 'rgb(44, 54, 65)',
  },
  enrolledStudentsSubSection: {margin: 16},
  enrolledStudentsClassesChartSection: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  enrolledStudentsClassesBought: {
    width: '28%',
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  pieChart: {width: '40%', alignItems: 'center'},
  enrolledStudentsTextLight: {
    fontSize: 14,
    fontWeight:'500',
    fontFamily: Helper.switchFont('medium'),
    color: font2,
  },
  enrolledStudentsTextLarge: {
    fontSize: 16,
    fontWeight:'600',
    fontFamily: Helper.switchFont('medium'),
    color: font1,
  },
  colorSuccess: {
    color: 'rgb(20, 210, 139)',
  },
  halfWidth: {
    width: '50%',
  },
  enrolledStudentsTextDark: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: Helper.switchFont('medium'),
    color: 'rgb(44, 54, 65)',
  },
  enrolledStudentsGreySection: {
    flexDirection: 'row',
    backgroundColor: 'rgb(249, 249, 249)',
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  enrolledStudentsClassesCompleted: {
    width: '32%',
    alignItems: 'flex-start',
    paddingLeft: 16,
  },
  enrolledStudentsClassDisputedIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgb(255, 125, 114)',
    marginRight: 8,
    marginTop: 3,
  },
  upcomingFeatureText: {
    flex: 1,
    color: 'rgb(108, 108, 108)',
    fontSize: 14,
    fontFamily: Helper.switchFont('medium'),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  upcomingFeature: {
    width: '45%',
  },
  markAttendanceText: {
    flex: 1,
    fontWeight: '700',
    color: secondaryColor,
    fontSize: 14,
    fontFamily: Helper.switchFont('medium'),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
  },
  colorBlack: {
    color: 'rgb(44, 54, 65)',
  },
  refillButton: {
    borderRadius: 8,
    width: '49%',
    // marginLeft: 4,
    backgroundColor: brandColor,
  },
  dropBackground:{borderRadius: 50, padding:8, backgroundColor:lineColor},
  refillText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Helper.switchFont('bold'),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
    // marginLeft: 9,
    fontWeight:'700'
  },
  markAttendance: {
    width: '49%',
    // marginRight: 4,
    borderWidth: 1,
    borderColor: secondaryColorBorder,
    borderRadius: 8,
  },
  scrollView: {marginTop: config.headerHeight,
  backgroundColor: background4},
  enrolledCoursesInfoWrapper: {
  
    // paddingVertical:16,
    // marginTop: -16,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  enrolledCoursesCoursename: {
    paddingHorizontal: 16,
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
  },
  enrolledCoursesTeacherName: {
    color: font2,
    // width: '60%',
    fontSize: 14,
    fontWeight:'500',
    fontFamily: Helper.switchFont('medium'),
  },
  enrolledCoursesGenerateCertificate: {
    width: '40%',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  addToCart: {
    width: '40%',
  },
  downloadButton:{
    borderWidth:1,
    borderRadius:58,
    paddingHorizontal:8,
    paddingVertical:5,
    borderColor:secondaryColorBorder,
  },
  downloadText: {
    fontSize: 12,
    fontWeight:'600',
    fontFamily: Helper.switchFont('regular'),
    color: secondaryColor,
  },
});
