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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Geolocation from '@react-native-community/geolocation';
// import Geocoder from 'react-native-geocoding';
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
} from '../reducers/courses.slice';
import {userState, loginSuccess, getUserLocation} from '../reducers/user.slice';
import CourseDetails from '../screens/FindCourse/CourseDetails';
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
import CustomDrawerContent from './CustomDrawer';
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
import DashboardSvg from '../assets/images/dashboard.svg';
import DashboardActiveSvg from '../assets/images/dashboard-active.svg';
import More from '../screens/More';
import Filters from '../screens/FindCourse/Filters';
import StaticPage from '../screens/Pages/StaticPage';
import Signup from '../screens/SignUp';
import Recording from '../screens/Recording/Recording';

import {font1, font2} from '../styles/colors';
export type RootParamList = {
  Categories: any;
  CategoryDetails: any;
  FindCourses: undefined;
  Subcategories: undefined;
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
  Attendance: any;
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

const StudentTabNavigator = () => {
  const {isLoggedIn} = useSelector(userState);
  return (
    <Tab.Navigator
      initialRouteName={'Dashboard'}
      screenOptions={({route}) => ({
        tabBarStyle: {
          paddingBottom: Platform.OS === 'android' ? 12 : 30,
          height: Platform.OS === 'android' ? 64 : 80,
        },
        // tabBarLabelStyle​:{
        //   fontSize:10,
        //   fontWeight:'600',
        //   color:font1
        // },
        tabBarIcon: ({focused, tintColor}) => {
          let iconName;
          let iconW = 0;
          let iconH = 0;
          if (route.name === 'Dashboard') {
            iconName = focused
              ? require('@images/dashboard-active.png')
              : require('@images/dashboard.png');
            iconW = 24;
            iconH = 24;
          } else if (route.name === 'Schedule') {
            iconName = focused
              ? require('@images/schedule-active.png')
              : require('@images/schedule.png');
            iconW = 24;
            iconH = 24;
          } else if (route.name === 'Recording') {
            iconName = focused
              ? require('@images/recording-active.png')
              : require('@images/recording.png');
            iconW = 24;
            iconH = 24;
          } else if (route.name === 'Transactions') {
            iconName = focused
              ? require('@images/transactions-active.png')
              : require('@images/transactions.png');
            iconW = 24;
            iconH = 24;
          } else if (route.name === 'More') {
            iconName = focused
              ? require('@images/more.png')
              : require('@images/more.png');
            iconW = 24;
            iconH = 24;
          }
          // You can return any component that you like here!
          if (focused) {
            return (
              <Animated.Image
                style={{
                  marginTop: 7,
                  paddingBottom: 7,
                  width: iconW,
                  height: iconH,
                }}
                source={iconName}
              />
            );
          }
          // tintColor='#81878D'
          return (
            <Animated.Image
              style={{
                marginTop: 7,
                paddingBottom: 7,
                width: iconW,
                height: iconH,
              }}
              source={iconName}
            />
          );
        },
        tabBarActiveTintColor: font1,
        tabBarInactiveTintColor: font2,
      })}>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Schedule"
        component={Schedules}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Recording"
        component={Recording}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Transactions"
        component={Transaction}
        options={{headerShown: false}}
      />
      <Tab.Screen name="More" component={More} options={{headerShown: false}} />
    </Tab.Navigator>
  );
};

const TabNavigator = () => {
  const {isLoggedIn} = useSelector(userState);

  return (
    <Tab.Navigator
      initialRouteName={'Dashboard'}
      screenOptions={({route}) => ({
        tabBarStyle: {
          paddingBottom: Platform.OS === 'android' ? 12 : 30,
          height: Platform.OS === 'android' ? 64 : 80,
        },
        tabBarIcon: ({focused}) => {
          let iconName;
          let iconW = 0;
          let iconH = 0;
          if (route.name === 'Dashboard') {
            iconName = focused
              ? require('@images/dashboard-active.png')
              : require('@images/dashboard.png');
            iconW = 24;
            iconH = 24;
          } else if (route.name === 'Schedule') {
            iconName = focused
              ? require('@images/schedule-active.png')
              : require('@images/schedule.png');
            iconW = 24;
            iconH = 24;
          } else if (route.name === 'Withdraw') {
            iconName = focused
              ? require('@images/withdraw-active.png')
              : require('@images/withdraw.png');
            iconW = 24;
            iconH = 24;
          } else if (route.name === 'Transactions') {
            iconName = focused
              ? require('@images/transactions-active.png')
              : require('@images/transactions.png');
            iconW = 24;
            iconH = 24;
          } else if (route.name === 'More') {
            iconName = focused
              ? require('@images/more.png')
              : require('@images/more.png');
            iconW = 24;
            iconH = 24;
          }
          // You can return any component that you like here!

          if (focused) {
            // tintColor=brandColor;

            return (
              <Animated.Image
                style={{
                  marginTop: 7,
                  paddingBottom: 7,
                  width: iconW,
                  height: iconH,
                }}
                source={iconName}
              />
            );
          }
          // tintColor='#81878D'
          return (
            <Animated.Image
              style={{
                marginTop: 7,
                paddingBottom: 7,
                width: iconW,
                height: iconH,
              }}
              source={iconName}
            />
          );
        },
        tabBarActiveTintColor: font1,
        tabBarInactiveTintColor: font2,
      })}>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Schedule"
        component={Schedules}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Withdraw"
        component={Withdrawal}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Transactions"
        component={Transaction}
        options={{headerShown: false}}
      />
      <Tab.Screen name="More" component={More} options={{headerShown: false}} />
    </Tab.Navigator>
  );
};

const TeacherTabNavigator = () => {
  const {isLoggedIn} = useSelector(userState);

  return (
    <Tab.Navigator
      initialRouteName={'Dashboard'}
      screenOptions={({route}) => ({
        tabBarStyle: {
          paddingBottom: Platform.OS === 'android' ? 12 : 30,
          height: Platform.OS === 'android' ? 64 : 80,
        },
        tabBarIcon: ({focused}) => {
          let iconName;
          let iconW = 0;
          let iconH = 0;
          if (route.name === 'Dashboard') {
            iconName = focused
              ? require('@images/dashboard-active.png')
              : require('@images/dashboard.png');
            iconW = 24;
            iconH = 24;
          } else if (route.name === 'Schedule') {
            iconName = focused
              ? require('@images/schedule-active.png')
              : require('@images/schedule.png');
            iconW = 24;
            iconH = 24;
          } else if (route.name === 'Withdraw') {
            iconName = focused
              ? require('@images/withdraw-active.png')
              : require('@images/withdraw.png');
            iconW = 24;
            iconH = 24;
          } else if (route.name === 'Transactions') {
            iconName = focused
              ? require('@images/transactions-active.png')
              : require('@images/transactions.png');
            iconW = 24;
            iconH = 24;
          } else if (route.name === 'More') {
            iconName = focused
              ? require('@images/more.png')
              : require('@images/more.png');
            iconW = 24;
            iconH = 24;
          }
          // You can return any component that you like here!

          if (focused) {
            // tintColor=brandColor;

            return (
              <Animated.Image
                style={{
                  marginTop: 7,
                  paddingBottom: 7,
                  width: iconW,
                  height: iconH,
                }}
                source={iconName}
              />
            );
          }
          // tintColor='#81878D'
          return (
            <Animated.Image
              style={{
                marginTop: 7,
                paddingBottom: 7,
                width: iconW,
                height: iconH,
              }}
              source={iconName}
            />
          );
        },
        tabBarActiveTintColor: font1,
        tabBarInactiveTintColor: font2,
      })}>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Schedule"
        component={Schedules}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Withdraw"
        component={Withdrawal}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Transactions"
        component={Transaction}
        options={{headerShown: false}}
      />
      <Tab.Screen name="More" component={More} options={{headerShown: false}} />
    </Tab.Navigator>
  );
};

// const RightHeader = () => {
//   const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();

//   return (
//     <View style={styles.header}>
//       <TouchableOpacity
//         style={styles.headerButtonLeft}
//         // onPress={navigation}
//       >
//         <SvgUri
//           height="40"
//           uri={`${config.media_url}images/header/hamburg_menu_mobile.svg`}
//         />
//       </TouchableOpacity>
//       <TouchableOpacity>
//         <SvgUri
//           height="40"
//           width="60"
//           uri={`${config.media_url}images/ipassio_logo.svg`}
//         />
//       </TouchableOpacity>

//       <View style={styles.headerWrapper}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('Categories')}
//           style={styles.headerButtonRight}>
//           <SvgUri
//             uri={`${config.media_url}images/header/mobile_navigation_browse.svg`}
//           />
//           <Text style={styles.headerText}>BROWSE</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('FindCourses')}
//           style={styles.headerButtonRight}>
//           <SvgUri
//             uri={`${config.media_url}images/header/mobile_navigation_courses.svg`}
//           />
//           <Text style={styles.headerText}>COURSES</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
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
          //headerLeft: () => <LeftHeader />,
          // headerRight: () => <RightHeader />,
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
          headerTitle: () => (
            <TouchableOpacity>
              <SvgUri
                height="40"
                width="60"
                uri="https://media.ipassio.com/images/ipassio_logo.svg"
              />
            </TouchableOpacity>
          ),
          //headerLeft: () => <LeftHeader />,
          // headerRight: () => <RightHeader />,
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
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{headerShown: false}}
        />
      </>
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const {courseData, courseStatus, categoryData, categoryStatus} =
    useSelector(courseState);
  const {isLoggedIn, userData, userLocation} = useSelector(userState);
  const {loading, pageLoading} = useSelector(loaderState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let data: CategoryInterface = {
      nationality: '',
    };
    const date = new Date();
    
    dispatch(getCategories(data));

    setIsLoading(true);
    if (!isLoggedIn) {
      AsyncStorage.getItem('USERDATA', (err, response) => {
        if (response) {
          dispatch(loginSuccess(JSON.parse(response)));
          dispatch(setLoading(true));
          dispatch(setPageLoading(true));

          // dispatch(getCategories());
          dispatch(getCourses())
            .then(() => {
              dispatch(setLoading(false));
              dispatch(setPageLoading(false));
            })
            .catch(() => {
              dispatch(setLoading(false));
              dispatch(setPageLoading(false));
            });
        } else {
          //nothing
        }
      });
    }
    dispatch(getUserLocation());
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
  // const {navigation} = useSelector(userState);
  const [initialRoute, setInitialRoute] = useState('Dashboard');
  const {isLoggedIn, userData} = useSelector(userState);

  useEffect(() => {
    if (isLoggedIn) {
      setInitialRoute('Dashboard');
      navigation.navigate('Dashboard');
    } else {
      setInitialRoute('Browse');
      navigation.navigate('Browse');
    }
  }, [isLoggedIn]);

  const openActivityOnNotification = (key: string) => {
    let nav;
    switch (key) {
      case 'weekly_attendance_reminder_to_student':
        nav = 'Dashboard';
        break;
      case 'class_remainder':
        nav = 'Schedules';
        break;
      case 'refill_remainder':
        nav = 'Dashboard';
        break;
      case 'mobile_verified': //not handled
        nav = 'Dashboard';
        break;
      case 'course_invoice_refilled': //not handled
        nav = 'Dashboard';
        break;
      case 'course_teacher_refilled': //not handled
        nav = 'Dashboard';
        break;
      case 'course_activated': //not handled
        nav = 'Dashboard';
        break;
      case 'course_dispute':
        nav = 'Dashboard';
        break;
      case 'course_invoice_enrolled':
        nav = 'Dashboard';
        break;
      case 'course_created': //not handled
        nav = 'Dashboard';
        break;
      case 'welcome_mail':
        nav = 'Dashboard';
        break;
      // case 'reset_password_init':
      //   nav = '';
      //   break;
      case 'attendance_reminder_by_teacher':
        nav = 'Dashboard';
        break;
      case 'marked_attendance_teacher':
        nav = 'Dashboard';
        break;
      case 'course_teacher_enrolled':
        nav = 'Dashboard';
        break;
      case 'withdrawal_method_created':
        nav = 'Withdraw';
        break;
      case 'withdrawal_request':
        nav = 'Withdraw';
        break;
      case 'withdrawal_approved':
        nav = 'Withdraw';
        break;
      case 'withdrawal_cancelled':
        nav = 'Withdraw';
        break;
        default : nav='Dashboard'
    }
    return nav;
  };

  // useEffect(()=>{
  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     console.log(
  //       'Notification caused app to open from background state:',
  //       remoteMessage.notification,
  //     );
  //     if(remoteMessage && remoteMessage.data.type==='attendance'){
  //       setInitialRoute("Attendance");
  //     }

  //   });
  // },[])

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      // console.log(
      //   'Notification caused app to open from background state:',
      //   remoteMessage,
      // );
      let nav = openActivityOnNotification(remoteMessage.data.type);

      navigation.navigate(nav);

      setInitialRoute(nav); //remoteMessage.data.type);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // console.log(remoteMessage);
          // console.log(
          //   'Notification caused app to open from quit state:',
          //   remoteMessage,
          // );
          let nav = openActivityOnNotification(remoteMessage.data.type);
          navigation.navigate(nav);
          setInitialRoute(nav); //remoteMessage.data.type);
        }
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
          <Stack.Screen
            name="Login"
            component={LoginFlowNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Withdraw"
            component={Withdrawal}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({

  headerButtonRight: {
    alignItems: 'center',
    paddingRight: 5,

    // borderLeftWidth:0.2,
  },

  headerButtonLeft: {
    paddingBottom: 20,
    paddingLeft: 5,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 20,
    alignItems: 'center',
  },
});
