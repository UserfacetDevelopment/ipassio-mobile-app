import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
} from 'react-native';

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

export type RootParamList = {
  Categories: any;
  CategoryDetails: any;
  FindCourses: undefined;
  Subcategories: undefined;
  CourseDetail: any;
  TeacherDetails: any;
  TeacherReview: undefined;
  BrowseCategories: any;
  Courses: undefined;
  CartPage: {
    refillCourse?: any;
    params?: any;
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
  LoginScreen: {backRoute?: string; email?: string; params: any};
  Dashboard: any;
  FindCourse: any;
  Login: any;
  Main: any;
  Logout: any;
  Attendance: any;
  UserNavigator: any;
  Review: undefined;
  BillingAddress: undefined;
  PaymentPage: undefined;
  Checkout: any;
  DashboardPage: any;
  Transactions: any;
  Withdraw: any;
  Schedules: any;
  AddSession: any;
  Schedule: any;
  StudentTabNavigator:any;
  TeacherTabNavigator:any;
  Student:any;
  Teacher:any;
};

const Drawer = createDrawerNavigator<RootParamList>();
const Stack = createNativeStackNavigator<RootParamList>();
const Tab = createBottomTabNavigator<RootParamList>();

const {width} = Dimensions.get('screen');

function LogoTitle(props: any) {
  return <SvgUri uri="https://media.ipassio.com/images/ipassio_logo.svg" />;
}

// const LeftHeader = () => {
//   const navigation = useNavigation();
//   return (
//     <View style={styles.headerWrapper}>
//       <TouchableOpacity style={styles.headerButtonLeft}>
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
//     </View>
//   );
// };

const StudentTabNavigator = () => {
  const {isLoggedIn} = useSelector(userState);
  return(
  <Tab.Navigator
  initialRouteName={isLoggedIn? "Dashboard" : "Courses"}
    screenOptions={({route}) => ({
      tabBarIcon: ({focused, tintColor}) => {
        let iconName;
        let iconW = 0;
        let iconH = 0;
        if (route.name === 'Dashboard') {
          iconName = focused
            ? require('@images/dashboard.png')
            : require('@images/dashboard.png');
          iconW = 21;
          iconH = 23;
        } else if (route.name === 'Transactions') {
          iconName = require('@images/transactions.png');
        } else if (route.name === 'FindCourse') {
          iconName = require('@images/transactions.png');
        }

        // You can return any component that you like here!
        if (focused) {
          tintColor = brandColor;
          return (
            <Animated.Image
              style={{marginTop: 7, width: iconW, height: iconH, tintColor}}
              source={iconName}
            />
          );
        } 
      return (
            <Animated.Image
              style={{marginTop: 7, width: iconW, height: iconH, tintColor}}
              source={iconName}
            />
          );
      },
      tabBarActiveTintColor: 'rgb(44, 54, 65)',
      tabBarInactiveTintColor: '#81878D',
    })}>
    <Tab.Screen name="Courses" component={FindCourse} />
    <Tab.Screen name="Dashboard" component={Dashboard} options={{headerShown: false}}/>
    <Tab.Screen name="Transactions" component={Transaction} options={{headerShown: false}} />
  </Tab.Navigator>);
};

const TeacherTabNavigator = () => {
  const {isLoggedIn} = useSelector(userState);

  return(
  <Tab.Navigator
  initialRouteName={isLoggedIn? "Dashboard" : "Courses"}
    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color}) => {
        let iconName;
        let iconW = 0;
        let iconH = 0;
        if (route.name === 'Dashboard') {
          iconName = focused
            ? require('@images/dashboard.png')
            : require('@images/dashboard.png');
          iconW = 21;
          iconH = 23;
        } else if (route.name === 'Withdraw') {
          iconName = focused
            ? require('@images/withdraw.png')
            : require('@images/withdraw.png');
          iconW = 23;
          iconH = 21;
        } else if (route.name === 'Transactions') {
          iconName = require('@images/transactions.png');
          iconW = 30;
          iconH = 20;
        } else if (route.name === 'FindCourse') {
          iconName = focused
            ? require('@images/dashboard.png')
            : require('@images/dashboard.png');
          iconW = 21;
          iconH = 23;
        }

        // You can return any component that you like here!
        if (focused) {
          color = brandColor;
          return (
            <Animated.Image
              style={{marginTop: 7, width: iconW, height: iconH, color}}
              source={iconName}
            />
          );
        } 
        return (
            <Animated.Image
              style={{marginTop: 7, width: iconW, height: iconH, color}}
              source={iconName}
            />
          );
      },
      tabBarActiveTintColor: 'rgb(44, 54, 65)',
      tabBarInactiveTintColor: '#81878D',
    })}>
      <Tab.Screen name="Courses" component={FindCourse}/>
    <Tab.Screen name="DashboardPage" component={Dashboard} options={{headerShown: false}}/>
    <Tab.Screen name="Withdraw" component={Withdrawal} options={{headerShown: false}}/>
    <Tab.Screen name="Transactions" component={Transaction} options={{headerShown: false}}/>
  </Tab.Navigator>);
};

const StudentDrawer = () =>{
  const {isLoggedIn, userData} = useSelector(userState);
  return(
    <Drawer.Navigator
      useLegacyImplementation={false}
      drawerContent={props => <CustomDrawerContent {...props} />}
      initialRouteName="StudentTabNavigator">
      {isLoggedIn ? (
        //Check here.. used the same screen name for Dashboard and
        //usernavigator for now
        <>
          
          <Drawer.Screen
            name="StudentTabNavigator"
            component={StudentTabNavigator}
            options={{headerShown: false}}
          />
          {userData.user_type === 'T' ? (
            <Drawer.Screen
              name="Withdraw"
              component={Withdrawal}
              options={{headerShown: false}}
            />
          ) : null}
          <Drawer.Screen
              name="Transactions"
              component={Transaction}
              options={{headerShown: false}}
            />
            <Drawer.Screen
              name="Schedule"
              component={ScheduleNavigator}
              options={{headerShown: false}}
            />
        </>
      ) : (
        <Drawer.Screen
          name="Login"
          component={LoginFlowNavigator}
          options={{headerShown: false}}
        />
      )}
    </Drawer.Navigator>
  );
  
}

const TeacherDrawer = ()=> {
  const {isLoggedIn, userData} = useSelector(userState);
  return(
    <Drawer.Navigator
      useLegacyImplementation={false}
      drawerContent={props => <CustomDrawerContent {...props} />}
      initialRouteName="TeacherTabNavigator">
      {isLoggedIn ? (
        <>
          
          <Drawer.Screen
            name="TeacherTabNavigator"
            component={TeacherTabNavigator}
            options={{headerShown: false}}
          />
          
            <Drawer.Screen
              name="Withdraw"
              component={Withdrawal}
              options={{headerShown: false}}
            />
          
        </>
      ) : (
        <Drawer.Screen
          name="Login"
          component={LoginFlowNavigator}
          options={{headerShown: false}}
        />
      )}
      
      <Drawer.Screen
        name="FindCourse"
        component={StackNavigator}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}
const RightHeader = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerButtonLeft}
        // onPress={navigation}
      >
        <SvgUri
          height="40"
          uri={`${config.media_url}images/header/hamburg_menu_mobile.svg`}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <SvgUri
          height="40"
          width="60"
          uri={`${config.media_url}images/ipassio_logo.svg`}
        />
      </TouchableOpacity>

      <View style={styles.headerWrapper}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Categories')}
          style={styles.headerButtonRight}>
          <SvgUri
            uri={`${config.media_url}images/header/mobile_navigation_browse.svg`}
          />
          <Text style={styles.headerText}>BROWSE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('FindCourses')}
          style={styles.headerButtonRight}>
          <SvgUri
            uri={`${config.media_url}images/header/mobile_navigation_courses.svg`}
          />
          <Text style={styles.headerText}>COURSES</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
          headerShown: pageLoading ? false : true,
          headerTitle: props => <LogoTitle {...props} />,
          //headerLeft: () => <LeftHeader />,
          headerRight: () => <RightHeader />,
        }}
      />
      <Stack.Screen
        name="CategoryDetails"
        component={CategoryDetails}
        options={{
          headerShown: pageLoading ? false : true,
          headerTitle: props => <LogoTitle {...props} />,
          //headerLeft: () => <LeftHeader />,
          headerRight: () => <RightHeader />,
        }}
      />
      <Stack.Screen
        name="TeacherDetails"
        component={TeacherDetails}
        options={{
          headerShown: pageLoading ? false : true,
          headerTitle: props => <LogoTitle {...props} />,
          //headerLeft: () => <LeftHeader />,
          headerRight: () => <RightHeader />,
        }}
      />
      <Stack.Screen
        name="Categories"
        component={BrowseCategories}
        options={{
          headerShown: true,
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
          headerRight: () => <RightHeader />,
        }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetails}
        options={{
          headerShown: true,
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
          headerRight: () => <RightHeader />,
        }}
      />
      <Stack.Screen
        name="ActionStatus"
        component={ActionStatus}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const UserNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="DashboardPage"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="DashboardPage"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Attendance"
        component={Attendance}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ActionStatus"
        component={ActionStatus}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Checkout" component={CheckoutNavigator} />
    </Stack.Navigator>
  );
};
const LoginFlowNavigator = () => {
  const {loading, pageLoading} = useSelector(loaderState);
  const {isLoggedIn, userData, userLocation} = useSelector(userState);

  return (
    <Stack.Navigator
      initialRouteName={`${isLoggedIn ? 'UserNavigator' : 'LoginScreen'}`}
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

          <Drawer.Screen
            name="UserNavigator"
            component={UserNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ActionStatus"
            component={ActionStatus}
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
  // const navigation = useNavigation();

  // let watchID;
  // const [currentLongitude, setCurrentLongitude] = useState('...');
  // const [currentLatitude, setCurrentLatitude] = useState('...');
  // const [locationStatus, setLocationStatus] = useState('');

  // useEffect(() => {
  //   const requestLocationPermission = async () => {
  //     if (Platform.OS === 'ios') {
  //       getOneTimeLocation();
  //       subscribeLocationLocation();
  //     } else {
  //       try {
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //           {
  //             title: 'Location Access Required',
  //             message: 'This App needs to Access your location',
  //           },
  //         );
  //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //           //To Check, If Permission is granted
  //           getOneTimeLocation();
  //           subscribeLocationLocation();
  //         } else {
  //           setLocationStatus('Permission Denied');
  //         }
  //       } catch (err) {
  //         console.warn(err);
  //       }
  //     }
  //   };
  //   requestLocationPermission();
  //   return () => {
  //     Geolocation.clearWatch(watchID);
  //   };
  // }, []);

  // const getOneTimeLocation = () => {
  //   setLocationStatus('Getting Location ...');
  //   Geolocation.getCurrentPosition(
  //     //Will give you the current location
  //     position => {
  //       setLocationStatus('You are Here');

  //       //getting the Longitude from the location json
  //       const currentLongitude = JSON.stringify(position.coords.longitude);

  //       //getting the Latitude from the location json
  //       const currentLatitude = JSON.stringify(position.coords.latitude);

  //       //Setting Longitude state
  //       setCurrentLongitude(currentLongitude);

  //       //Setting Longitude state
  //       setCurrentLatitude(currentLatitude);

  //       Geocoder.init('AIzaSyCVF-jxv49zx7UZhUUkt-GryZbGq34v0QY');
  //       Geocoder.from(currentLatitude, currentLongitude)
  //         .then(json => {
  //           var addressComponent = json.results[0].address_components[0];
  //         })
  //         .catch(error => console.warn(error));
  //     },
  //     error => {
  //       setLocationStatus(error.message);
  //     },
  //     {
  //       enableHighAccuracy: false,
  //       timeout: 30000,
  //       maximumAge: 1000,
  //     },
  //   );
  // };

  // const subscribeLocationLocation = () => {
  //   watchID = Geolocation.watchPosition(
  //     position => {
  //       //Will give you the location on location change

  //       setLocationStatus('You are Here');

  //       //getting the Longitude from the location json
  //       const currentLongitude = JSON.stringify(position.coords.longitude);

  //       //getting the Latitude from the location json
  //       const currentLatitude = JSON.stringify(position.coords.latitude);

  //       //Setting Longitude state
  //       setCurrentLongitude(currentLongitude);

  //       //Setting Latitude state
  //       setCurrentLatitude(currentLatitude);
  //     },
  //     error => {
  //       setLocationStatus(error.message);
  //     },
  //     {
  //       enableHighAccuracy: false,
  //       maximumAge: 1000,
  //     },
  //   );
  // };

  useEffect(() => {
    setIsLoading(true);
    if (!isLoggedIn) {
      AsyncStorage.getItem('USERDATA', (err, response) => {
        if (response) {
          dispatch(loginSuccess(JSON.parse(response)));
          dispatch(setLoading(true));
          dispatch(setPageLoading(true));
          dispatch(getCategories());
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

  // useEffect(() => {
  //   setIsLoading(true);

  //   setIsLoading(false);
  // }, []);
  return (
    <>
      {isLoading ? (
        <Splash />
      ) : (
        <NavigationContainer>
          <StackNavigator />
          {/* <LoginFlowNavigator /> */}
          {/* <DrawerNavigation /> */}
        </NavigationContainer>
      )}
    </>
  );
};

const CheckoutNavigator = () => {
  const {isLoggedIn} = useSelector(userState);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <Stack.Screen name= "Login" component={LoginFlowNavigator}/>
      ) :
      <>
      <Stack.Screen name="CartPage" component={CartPage} />
      <Stack.Screen name="BillingAddress" component={BillingAddress} />
      <Stack.Screen name="PaymentPage" component={Payment} />
      <Stack.Screen name="Review" component={Review} />
      </>
}
    </Stack.Navigator>
  );
};


const ScheduleNavigator = () => {
  const {isLoggedIn} = useSelector(userState);

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <Stack.Screen name= "Login" component={LoginFlowNavigator}/>
      ) :
      <>
      
      <Stack.Screen name="Schedules" component={Schedules} options={{headerShown:false}}/>
      <Stack.Screen name="AddSession" component={AddSession} options={{headerShown:false}} />
      </>}
    </Stack.Navigator>
  );
}

const StackNavigator = () => {
  const dispatch = useAppDispatch();
  const {courseData, courseStatus, categoryData, categoryStatus} =
    useSelector(courseState);
  const {isLoggedIn, userData, userLocation} = useSelector(userState);
  const {loading, pageLoading} = useSelector(loaderState);

  return (
    <>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? userData.user_type ==="T" ? "Teacher" : "Student": "Student"}
        screenOptions={{headerShown: false, headerBackVisible: false}}>
        {isLoggedIn ? (
          <>
            
            <Stack.Screen name="Student" component={StudentDrawer}/>
            <Stack.Screen name="Teacher" component={TeacherDrawer}/>
            {/* <Stack.Screen
              
              name="CartPage"
              component={CartPage}
              options={{headerShown: true}}
            /> */}
            {/* <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen
              name="ActionStatus"
              component={ActionStatus}
              options={{headerShown: false}}
            />
            <Drawer.Screen
              name="UserNavigator"
              component={UserNavigator}
              options={{headerShown: false}}
            />
            <Stack.Screen name="Checkout" component={CheckoutNavigator} /> */}
          </>
        ) : (
          <>
                      <Stack.Screen name="Student" component={StudentDrawer}/>

            {/* <Stack.Screen
              name="Courses"
              component={CourseFlowNavigator}
              options={{headerShown: false}}
            /> */}
            {/* <Stack.Screen
              name="Login"
              component={LoginFlowNavigator}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Attendance"
              component={Attendance}
              options={{headerShown: false}}
            /> */}
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

// const DrawerNavigation = () => {
//   const {userData, isLoggedIn} = useSelector(userState);

//   return (
//     <Drawer.Navigator
//       useLegacyImplementation={false}
//       drawerContent={props => <CustomDrawerContent {...props} />}
//       initialRouteName="FindCourse">
//       {isLoggedIn ? (
//         //Check here.. used the same screen name for Dashboard and
//         //usernavigator for now
//         <>
          
//           <Drawer.Screen
//             name="Dashboard"
//             component={UserNavigator}
//             options={{headerShown: false}}
//           />
//           {userData.user_type === 'T' ? (
//             <Drawer.Screen
//               name="Withdraw"
//               component={Withdrawal}
//               options={{headerShown: false}}
//             />
//           ) : null}
//           <Drawer.Screen
//               name="Transactions"
//               component={Transaction}
//               options={{headerShown: false}}
//             />
//             <Drawer.Screen
//               name="Schedule"
//               component={ScheduleNavigator}
//               options={{headerShown: false}}
//             />
//         </>
//       ) : (
//         <Drawer.Screen
//           name="Login"
//           component={LoginFlowNavigator}
//           options={{headerShown: false}}
//         />
//       )}
      
//       <Drawer.Screen
//         name="FindCourse"
//         component={StackNavigator}
//         options={{headerShown: false}}
//       />
//     </Drawer.Navigator>
//   );
// };
const styles = StyleSheet.create({
  headerText: {
    color: '#32363a',
    padding: 4,
    fontSize: 10,
    textAlign: 'center',
  },
  headerButtonRight: {
    alignItems: 'center',
    paddingRight: 5,

    // borderLeftWidth:0.2,
  },
  icon: {},
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
