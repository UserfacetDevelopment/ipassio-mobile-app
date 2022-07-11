import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import Intercom,{Visibility} from '@intercom/intercom-react-native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import ForgotPasssword from '../screens/Login/ForgotPassword';
import Dashboard from '../screens/Dashboard';
import ActionStatus from '../components/ActionStatus';
import ResetPassword from '../screens/Login/ResetPassword';
import FindCourse from '../screens/FindCourse';
import {
  setLoading,
  setPageLoading,
  loaderState,
} from '../reducers/loader.slice';
import {
  courseState,
  getCourses,
  getCategories,
  enrollNow,
} from '../reducers/courses.slice';
import {
  userState,
  loginSuccess,
  getUserLocation,
  setLoginRedirectedFrom,
  getCountryList,
  setUserLocation,
} from '../reducers/user.slice';
import CourseDetails, {
  CourseEnrollInterface,
} from '../screens/FindCourse/CourseDetails';
import CartPage from '../screens/Checkout/CartPage';
import {SvgUri} from 'react-native-svg';
import config from '../config/Config';
import {useNavigation} from '@react-navigation/native'; //useNavigation hook gets the navigation of parent
import TeacherReview from '../screens/FindCourse/TeacherReview';
import BrowseCategories from '../screens/FindCourse/BrowseCategories';
import BrowseSubcategories from '../screens/FindCourse/BrowseSubcategories';
import CategoryDetails from '../screens/FindCourse/CategoryDetails';
import TeacherDetails from '../screens/FindCourse/TeacherDetails';
import {useAppDispatch} from '../app/store';
import Attendance from '../screens/Attendance';
import BillingAddress from '../screens/Checkout/BillingAddress';
import Payment from '../screens/Checkout/Payment';
import Review from '../screens/Checkout/Review';
import Transaction from '../screens/Transactions';
import Withdrawal from '../screens/Withdrawal';
import {brandColor} from '../styles/colors';
import Schedules from '../screens/Schedules';
import AddSession from '../screens/Schedules/AddSession';
import RequestFreeMeetingForm from '../screens/FindCourse/RequestFreeMeetingForm';
import Community from '../screens/Community';
import Goals from '../screens/Goals';
import More from '../screens/More';
import Filters from '../screens/FindCourse/Filters';
import StaticPage from '../screens/Pages/StaticPage';
import Signup from '../screens/SignUp';
import Recording from '../screens/Recording/Recording';

import {font1, font2} from '../styles/colors';
import RecordingPreview from '../screens/Recording/RecordingPreview';
import {
  checkoutState,
  setCheckoutDataDetails,
  setNotLoggedInCheckoutData,
} from '../reducers/checkout.slice';
import Otp from '../screens/SignUp/Otp';
import UserDetail from '../screens/SignUp/UserDetail';
import VideoConferencing from '../screens/VideoConferencing';
import ActionStatus2 from '../components/ActionStatus2';
export type RootParamList = {
  Categories: any;
  CategoryDetails: any;
  FindCourses: undefined;
  Subcategories:  {
    subcategory:any;
  cat: any;
  backroute: any,}
  CourseDetail: {
    course_slug: string;
    category_slug: string;
    teacher_slug: string;
  };
  TeacherDetails: any;
  TeacherReview: undefined;
  BrowseCategories: any;
  BrowseSubcategories: any;
  Courses: undefined;
  CartPage: {
    checkoutToken: any;
    backroute?: any;
  };
  ActionStatus: {
    timeOut: number;
    backRoute?: string;
    email?: string;
    messageStatus: string;
    messageTitle: string;
    messageDesc: string;
    params?: any;
    navigator?: any;
    data?: any;
  };
  ActionStatus2: {
    timeOut: number;
    backRoute?: string;
    email?: string;
    messageStatus: string;
    messageTitle: string;
    messageDesc: string;
    params?: any;
    navigator?: any;
    data?: any;
  };
  ResetPassword: any;
  ForgotPassword: any;
  LoginScreen: {
    backRoute?: string;
    email?: string;
    params?: any;
    nextRoute?: any;
  };
  Dashboard: any;
  FindCourse: any;
  Login: any;
  Main: any;
  Logout: any;
  Attendance: {
    courseToken: string;
    classType: string;
    userToken: string;
  };
  UserNavigator: any;
  Review: {
    checkoutToken: string;
  };
  BillingAddress: {
    checkoutToken: string;
  };
  PaymentPage: {
    checkoutToken: string;
  };
  Checkout: any;
  DashboardPage: any;
  Transactions: any;
  Withdraw: any;
  Schedules: any;
  AddSession: any;
  Schedule: any;
  StudentTabNavigator: any;
  TeacherTabNavigator: any;
  Student: any;
  Teacher: any;
  TransactionPage: any;
  RequestMeeting: any;
  Goals: any;
  Community: any;
  More: any;
  Browse: any;
  FilterScreen: any;
  Recording: any;
  StaticPage: any;
  MoreNav: any;
  Signup: any;
  CreatedCourses: any;
  RecordingPreview: any;
  OtpVerification: any;
  UserDetail: any;
  Video: any;
};

export interface CategoryInterface {
  nationality: string;
}

const Stack = createNativeStackNavigator<RootParamList>();
const Tab = createBottomTabNavigator<RootParamList>();

const {width} = Dimensions.get('screen');

function LogoTitle(props: any) {
  return <SvgUri uri="https://media.ipassio.com/images/ipassio_logo.svg" />;
}

// const StudentTabNavigator = () => {
//   const {isLoggedIn} = useSelector(userState);
//   return (
//     <Tab.Navigator
//       initialRouteName={'Dashboard'}
//       screenOptions={({route}) => ({
//         tabBarStyle: {
//           paddingBottom: Platform.OS === 'android' ? 12 : 30,
//           height: Platform.OS === 'android' ? 64 : 80,
//         },
//         // tabBarLabelStyle​:{
//         //   fontSize:10,
//         //   fontWeight:'600',
//         //   color:font1
//         // },
//         tabBarIcon: ({focused, tintColor}) => {
//           let iconName;
//           let iconW = 0;
//           let iconH = 0;
//           if (route.name === 'Dashboard') {
//             iconName = focused
//               ? require('@images/dashboard-active.png')
//               : require('@images/dashboard.png');
//             iconW = 24;
//             iconH = 24;
//           } else if (route.name === 'Schedule') {
//             iconName = focused
//               ? require('@images/schedule-active.png')
//               : require('@images/schedule.png');
//             iconW = 24;
//             iconH = 24;
//           } else if (route.name === 'Recording') {
//             iconName = focused
//               ? require('@images/recording-active.png')
//               : require('@images/recording.png');
//             iconW = 24;
//             iconH = 24;
//           } else if (route.name === 'Transactions') {
//             iconName = focused
//               ? require('@images/transactions-active.png')
//               : require('@images/transactions.png');
//             iconW = 24;
//             iconH = 24;
//           } else if (route.name === 'More') {
//             iconName = focused
//               ? require('@images/more.png')
//               : require('@images/more.png');
//             iconW = 24;
//             iconH = 24;
//           }
//           // You can return any component that you like here!
//           if (focused) {
//             return (
//               <Animated.Image
//                 style={{
//                   marginTop: 7,
//                   paddingBottom: 7,
//                   width: iconW,
//                   height: iconH,
//                 }}
//                 source={iconName}
//               />
//             );
//           }
//           // tintColor='#81878D'
//           return (
//             <Animated.Image
//               style={{
//                 marginTop: 7,
//                 paddingBottom: 7,
//                 width: iconW,
//                 height: iconH,
//               }}
//               source={iconName}
//             />
//           );
//         },
//         tabBarActiveTintColor: font1,
//         tabBarInactiveTintColor: font2,
//       })}>
//       <Tab.Screen
//         name="Dashboard"
//         component={Dashboard}
//         options={{headerShown: false}}
//       />
//       <Tab.Screen
//         name="Schedule"
//         component={Schedules}
//         options={{headerShown: false}}
//       />
//       <Tab.Screen
//         name="Recording"
//         component={Recording}
//         options={{headerShown: false}}
//       />
//       <Tab.Screen
//         name="Transactions"
//         component={Transaction}
//         options={{headerShown: false}}
//       />
//       <Tab.Screen name="More" component={More} options={{headerShown: false}} />
//     </Tab.Navigator>
//   );
// };

// const TabNavigator = () => {
//   const {isLoggedIn} = useSelector(userState);

//   return (
//     <Tab.Navigator
//       initialRouteName={'Dashboard'}
//       screenOptions={({route}) => ({
//         tabBarStyle: {
//           paddingBottom: Platform.OS === 'android' ? 12 : 30,
//           height: Platform.OS === 'android' ? 64 : 80,
//         },
//         tabBarIcon: ({focused}) => {
//           let iconName;
//           let iconW = 0;
//           let iconH = 0;
//           if (route.name === 'Dashboard') {
//             iconName = focused
//               ? require('@images/dashboard-active.png')
//               : require('@images/dashboard.png');
//             iconW = 24;
//             iconH = 24;
//           } else if (route.name === 'Schedule') {
//             iconName = focused
//               ? require('@images/schedule-active.png')
//               : require('@images/schedule.png');
//             iconW = 24;
//             iconH = 24;
//           } else if (route.name === 'Withdraw') {
//             iconName = focused
//               ? require('@images/withdraw-active.png')
//               : require('@images/withdraw.png');
//             iconW = 24;
//             iconH = 24;
//           } else if (route.name === 'Transactions') {
//             iconName = focused
//               ? require('@images/transactions-active.png')
//               : require('@images/transactions.png');
//             iconW = 24;
//             iconH = 24;
//           } else if (route.name === 'More') {
//             iconName = focused
//               ? require('@images/more.png')
//               : require('@images/more.png');
//             iconW = 24;
//             iconH = 24;
//           }
//           // You can return any component that you like here!

//           if (focused) {
//             // tintColor=brandColor;

//             return (
//               <Animated.Image
//                 style={{
//                   marginTop: 7,
//                   paddingBottom: 7,
//                   width: iconW,
//                   height: iconH,
//                 }}
//                 source={iconName}
//               />
//             );
//           }
//           // tintColor='#81878D'
//           return (
//             <Animated.Image
//               style={{
//                 marginTop: 7,
//                 paddingBottom: 7,
//                 width: iconW,
//                 height: iconH,
//               }}
//               source={iconName}
//             />
//           );
//         },
//         tabBarActiveTintColor: font1,
//         tabBarInactiveTintColor: font2,
//       })}>
//       <Tab.Screen
//         name="Dashboard"
//         component={Dashboard}
//         options={{headerShown: false}}
//       />
//       <Tab.Screen
//         name="Schedule"
//         component={Schedules}
//         options={{headerShown: false}}
//       />
//       <Tab.Screen
//         name="Withdraw"
//         component={Withdrawal}
//         options={{headerShown: false}}
//       />
//       <Tab.Screen
//         name="Transactions"
//         component={Transaction}
//         options={{headerShown: false}}
//       />
//       <Tab.Screen name="More" component={More} options={{headerShown: false}} />
//     </Tab.Navigator>
//   );
// };

// const TeacherTabNavigator = () => {
//   const {isLoggedIn} = useSelector(userState);

//   return (
//     <Tab.Navigator
//       initialRouteName={'Dashboard'}
//       screenOptions={({route}) => ({
//         tabBarStyle: {
//           paddingBottom: Platform.OS === 'android' ? 12 : 30,
//           height: Platform.OS === 'android' ? 64 : 80,
//         },
//         tabBarIcon: ({focused}) => {
//           let iconName;
//           let iconW = 0;
//           let iconH = 0;
//           if (route.name === 'Dashboard') {
//             iconName = focused
//               ? require('@images/dashboard-active.png')
//               : require('@images/dashboard.png');
//             iconW = 24;
//             iconH = 24;
//           } else if (route.name === 'Schedule') {
//             iconName = focused
//               ? require('@images/schedule-active.png')
//               : require('@images/schedule.png');
//             iconW = 24;
//             iconH = 24;
//           } else if (route.name === 'Withdraw') {
//             iconName = focused
//               ? require('@images/withdraw-active.png')
//               : require('@images/withdraw.png');
//             iconW = 24;
//             iconH = 24;
//           } else if (route.name === 'Transactions') {
//             iconName = focused
//               ? require('@images/transactions-active.png')
//               : require('@images/transactions.png');
//             iconW = 24;
//             iconH = 24;
//           } else if (route.name === 'More') {
//             iconName = focused
//               ? require('@images/more.png')
//               : require('@images/more.png');
//             iconW = 24;
//             iconH = 24;
//           }
//           // You can return any component that you like here!

//           if (focused) {
//             // tintColor=brandColor;

//             return (
//               <Animated.Image
//                 style={{
//                   marginTop: 7,
//                   paddingBottom: 7,
//                   width: iconW,
//                   height: iconH,
//                 }}
//                 source={iconName}
//               />
//             );
//           }
//           // tintColor='#81878D'
//           return (
//             <Animated.Image
//               style={{
//                 marginTop: 7,
//                 paddingBottom: 7,
//                 width: iconW,
//                 height: iconH,
//               }}
//               source={iconName}
//             />
//           );
//         },
//         tabBarActiveTintColor: font1,
//         tabBarInactiveTintColor: font2,
//       })}>
//       <Tab.Screen
//         name="Dashboard"
//         component={Dashboard}
//         options={{headerShown: false}}
//       />
//       <Tab.Screen
//         name="Schedule"
//         component={Schedules}
//         options={{headerShown: false}}
//       />
//       <Tab.Screen
//         name="Withdraw"
//         component={Withdrawal}
//         options={{headerShown: false}}
//       />
//       <Tab.Screen
//         name="Transactions"
//         component={Transaction}
//         options={{headerShown: false}}
//       />
//       <Tab.Screen name="More" component={More} options={{headerShown: false}} />
//     </Tab.Navigator>
//   );
// };

const CourseFlowNavigator = () => {
  const {loading, pageLoading} = useSelector(loaderState);
  return (
    <Stack.Navigator
      initialRouteName="FindCourses"
      screenOptions={{headerShown: false, headerBackVisible: false}}>
      <Stack.Screen
        name="FindCourses"
        component={FindCourse}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CategoryDetails"
        component={CategoryDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TeacherDetails"
        component={TeacherDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RequestMeeting"
        component={RequestFreeMeetingForm}
        options={{
          headerShown: false,
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <Stack.Screen
        name="FilterScreen"
        component={Filters}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Categories"
        component={BrowseCategories}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Subcategories"
        component={BrowseSubcategories}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetails}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const LoginFlowNavigator = () => {
  const {loading, pageLoading} = useSelector(loaderState);
  const {isLoggedIn, userData, userLocation} = useSelector(userState);

  return (
    <Stack.Navigator
      initialRouteName={'LoginScreen'}
      screenOptions={{headerShown: false}}>
      <>
        <Stack.Screen
          name="LoginScreen"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasssword}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{headerShown: false}}
        />
      </>
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const {courseData, courseStatus, nationality, categoryData, categoryStatus} =
    useSelector(courseState);
  const {isLoggedIn, userData, userLocation} = useSelector(userState);
  const {loading, pageLoading} = useSelector(loaderState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    Intercom.registerUnidentifiedUser();
    // Intercom.displayMessenger()
    Intercom.setLauncherVisibility(Visibility.VISIBLE)
  },[userData])

  if(Platform.OS === 'android'){
    Intercom.setBottomPadding(150)
  }
  else{
    Intercom.setBottomPadding(20)
  }

  const ipinfo = (responseCountry: any, response: any) => {
    responseCountry.data.map((country_name: any, i: number) => {
      if (country_name.countryShortCode === response.data.country) {
        var data = {
          country_code: response.data.country,
          country_name: country_name.countryName
            ? country_name.countryName
            : response.data.country,
          city: response.data.city,
          postal: response.data.postal,
          latitude: response.data.loc,
          longitude: response.data.loc,
          IPv4: response.data.ip,
          state: response.data.region,
          timezone: response.data.timezone,
        };
        var result = {
          data: data,
        };
        dispatch(setUserLocation(result));
      }
    });
  }

useEffect(()=>{
  let data: CategoryInterface = {
    nationality: nationality,
  };
  dispatch(getCategories(data));
},[nationality])

  useEffect(() => {
    

    setIsLoading(true);
    if (!isLoggedIn) {
      dispatch(getCountryList())
        .unwrap()
        .then(responseCountry => {
          console.log(responseCountry);

          const token1 = 'd03fadd21eeed2';
          dispatch(getUserLocation(token1))
            .unwrap()
            .then(response => {
              console.log(response);
              ipinfo(responseCountry, response);
            })
            .catch(() => {
              const token2 = 'b52e8cf6ab40aa';
              dispatch(getUserLocation(token2))
                .unwrap()
                .then(response => {
                  console.log(response);
                  ipinfo(responseCountry, response);
                })
                .catch(err => {
                  const token3 = 'ad519179ea355a';
                  dispatch(getUserLocation(token3))
                    .unwrap()
                    .then(response => {
                      console.log(response);
                      ipinfo(responseCountry, response);
                    })
                    .catch(err => {
                      console.log(err);
                    });
                });
            });
        })
        .catch(err => {
          console.log(err);
        });

      AsyncStorage.getItem('USERDATA', (err, response) => {
        if (response) {
         
          const resJson = JSON.parse(response);
          dispatch(loginSuccess(JSON.parse(response)));
          console.log(resJson);
           Intercom.registerIdentifiedUser({email:resJson.email, userId: resJson.id})
              Intercom.updateUser({
                email: resJson.email,
                userId: resJson.id,
                name: resJson.first_name+ ' '+resJson.last_name,
                phone: resJson.country_code+resJson.phone_number,
              });
        } else {
          //nothing
        }
      });
    }
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <Splash />
      ) : (
        <NavigationContainer>
          <RootStackNavigator />
        </NavigationContainer>
      )}
    </>
  );
};

const CheckoutNavigator = () => {
  const {isLoggedIn} = useSelector(userState);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CartPage"
        component={CartPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BillingAddress"
        component={BillingAddress}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PaymentPage"
        component={Payment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Review"
        component={Review}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const RootStackNavigator = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [initialRoute, setInitialRoute] = useState('Dashboard');
  const {isLoggedIn, userData, userLocation, loginRedirectedFrom} =
    useSelector(userState);
  const {notLoggedInCheckoutData} = useSelector(checkoutState);
  const {course} = useSelector(courseState);

  useEffect(() => {
    if (isLoggedIn) {
      if (loginRedirectedFrom !== null) {
        if (loginRedirectedFrom === 'CD') {
          if (userData.user_type === 'S') {
            let currency_type =
              course.user.ip_country === 'India' &&
              ((!isLoggedIn && userLocation.data.country === 'India') ||
                (isLoggedIn && userData.ip_country === 'India'))
                ? 'INR'
                : 'USD';

            let total_cpw = notLoggedInCheckoutData.total_cpw;
            let total_weeks = notLoggedInCheckoutData.total_weeks;
            let total_class = notLoggedInCheckoutData.total_class;
            let selectedPrice = notLoggedInCheckoutData.selectedPrice;

            let enrollData = {
              course: course.id,
              price_per_class:
                currency_type === 'INR'
                  ? selectedPrice.final_INR
                  : selectedPrice.final_USD,
              currency_type: currency_type,
              classes_per_week: total_cpw,
              number_of_weeks: total_weeks,
              number_of_class: total_class,
              billing_first_name: userData.first_name,
              billing_last_name: userData.last_name,
              billing_street_address: '',
              billing_city: userData.ip_city,
              billing_pin_code: '',
              billing_state: userData.ip_state,
              billing_country: userData.ip_country,
              class_type: selectedPrice.id,
              purchase_type: 'N',
              discounts: course.discounts ? course.discounts : '',
              timezone: userData.timezone,
              device_type: Platform.OS,
              price_per_class_inr: selectedPrice.final_INR,
              price_per_class_usd: selectedPrice.final_USD,
            };

            const finaldata: CourseEnrollInterface = {
              data: enrollData,
              userToken: userData.token,
            };

            dispatch(setPageLoading(true));
            dispatch(enrollNow(finaldata))
              .unwrap()
              .then(response => {
                dispatch(setNotLoggedInCheckoutData(null));
                dispatch(setLoginRedirectedFrom(null));
                dispatch(setPageLoading(false));
                if (response.data.status === 'success') {
                  dispatch(setCheckoutDataDetails(response.data.data));
                  navigation.navigate('Checkout', {
                    screen: 'CartPage',
                    params: {
                      checkoutToken: response.data.data.checkout_token,
                    },
                  });
                }
              })
              .catch(err => {
                dispatch(setPageLoading(false));
                console.log(err);
              });
          } else {
            dispatch(setNotLoggedInCheckoutData(null));
            dispatch(setLoginRedirectedFrom(null));
            setInitialRoute('Browse');
            navigation.navigate('Browse');
          }

          // setInitialRoute('CartPage');
          // navigation.navigate('CartPage');
        }
      } else {
        setInitialRoute('Dashboard');
        navigation.navigate('Dashboard');
      }
    } else {
      setInitialRoute('Browse');
      navigation.navigate('Browse');
    }
  }, [isLoggedIn]);

  const openActivityOnNotification = (key: string, data: any) => {
    let nav;
    // switch (key) {
    //   case 'weekly_attendance_reminder_to_student':
    //     nav = 'Dashboard';
    //     break;
    //   case 'class_remainder':
    //     nav = 'Schedules';
    //     break;
    //   case 'refill_remainder':
    //     nav = 'Dashboard';
    //     break;
    //   case 'mobile_verified': //not handled
    //     nav = 'Dashboard';
    //     break;
    //   case 'course_invoice_refilled': //not handled
    //     nav = 'Dashboard';
    //     break;
    //   case 'course_teacher_refilled': //not handled
    //     nav = 'Dashboard';
    //     break;
    //   case 'course_activated': //not handled
    //     nav = 'Dashboard';
    //     break;
    //   case 'course_dispute':
    //     nav = 'Dashboard';
    //     break;
    //   case 'course_invoice_enrolled':
    //     nav = 'Dashboard';
    //     break;
    //   case 'course_created': //not handled
    //     nav = 'Dashboard';
    //     break;
    //   case 'welcome_mail':
    //     nav = 'Dashboard';
    //     break;
    //   // case 'reset_password_init':
    //   //   nav = '';
    //   //   break;
    //   case 'attendance_reminder_by_teacher':
    //     nav = 'Dashboard';
    //     break;
    //   case 'marked_attendance_teacher':
    //     nav = 'Dashboard';
    //     break;
    //   case 'course_teacher_enrolled':
    //     nav = 'Dashboard';
    //     break;
    //   case 'withdrawal_method_created':
    //     nav = 'Withdraw';
    //     break;
    //   case 'withdrawal_request':
    //     nav = 'Withdraw';
    //     break;
    //   case 'withdrawal_approved':
    //     nav = 'Withdraw';
    //     break;
    //   case 'withdrawal_cancelled':
    //     nav = 'Withdraw';
    //     break;
    //     default : nav='Dashboard'
    // }

    if (
      key === 'weekly_attendance_reminder_to_student' ||
      key === 'marked_attendance_teacher' ||
      key === 'attendance_reminder_by_teacher'
    ) {
      navigation.navigate('Attendance', {
        courseToken: data && data.course_token,
        classType: data && data.class_type,
        userToken: data.user_token,
      });
    }
    // else if(key==='refill_remainder' || key==='' || key==='' || key==='' || key==='' || key==='' || key==='' || key===''){
    //   navigation.navigate('Dashboard');
    // }
    else if (
      key === 'withdrawal_method_created' ||
      key === 'withdrawal_request' ||
      key === 'withdrawal_cancelled' ||
      key === 'withdrawal_approved' ||
      key === 'marked_attendance_student'
    ) {
      navigation.navigate('Withdraw');
    } else {
      navigation.navigate('Dashboard');
    }
  };

  //handling notifs in quit state for ios
  // useEffect(() => {
  //   messaging()
  //     .getDidOpenSettingsForNotification()
  //     .then(async didOpenSettingsForNotification => {
  //       if (didOpenSettingsForNotification) {
  //         navigation.navigate('Dashboard');
  //       }
  //     });
  // }, []);

  //handling notifications for ios
  // const openSettingsForNotifications = AsyncStorage.getItem(
  //   'openSettingsForNotifications',
  // );
  // useEffect(() => {
  //   AsyncStorage.getItem('openSettingsForNotifications', (err, response) => {
  //     if (response) {
  //       navigation.navigate('Dashboard');
  //     } else {
  //       //nothing
  //     }
  //   });
  // }, [openSettingsForNotifications]);

  useEffect(() => {
    messaging().onNotificationOpenedApp((remoteMessage: any) => {
      // console.log(
      //   'Notification caused app to open from background state:',
      //   remoteMessage,
      // );
      openActivityOnNotification(remoteMessage?.data?.type, remoteMessage.data);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage: any) => {
        if (remoteMessage) {
          // console.log(remoteMessage);
          // console.log(
          //   'Notification caused app to open from quit state:',
          //   remoteMessage,
          // );
          openActivityOnNotification(
            remoteMessage.data.type,
            remoteMessage.data,
          );
        }
      })
      .catch(() => {
        //nothing
      });
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={
        initialRoute
        // !isLoggedIn ? 'Browse' : 'Dashboard'
      }>
      {!isLoggedIn ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginFlowNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ActionStatus"
            component={ActionStatus}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ActionStatus2"
            component={ActionStatus2}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Browse"
            component={CourseFlowNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OtpVerification"
            component={Otp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserDetail"
            component={UserDetail}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="StaticPage"
            component={StaticPage}
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        <>
          {/* <Stack.Screen
          name="StudentTabNavigator"
          component={StudentTabNavigator}
          options={{headerShown: false}}
        />
        
        <Stack.Screen
          name="TeacherTabNavigator"
          component={TeacherTabNavigator}
          options={{headerShown: false}}
        /> */}

          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Attendance"
            component={Attendance}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddSession"
            component={AddSession}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ActionStatus"
            component={ActionStatus}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ActionStatus2"
            component={ActionStatus2}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Checkout"
            component={CheckoutNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Browse"
            component={CourseFlowNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="StaticPage"
            component={StaticPage}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Recording"
            component={Recording}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Transactions"
            component={Transaction}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="More"
            component={More}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Schedules"
            component={Schedules}
            options={{
              headerShown: false,
            }}
          />
          {/* <Stack.Screen
            name="Login"
            component={LoginFlowNavigator}
            options={{headerShown: false}}
          /> */}
          <Stack.Screen
            name="Withdraw"
            component={Withdrawal}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RecordingPreview"
            component={RecordingPreview}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Video"
            component={VideoConferencing}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
