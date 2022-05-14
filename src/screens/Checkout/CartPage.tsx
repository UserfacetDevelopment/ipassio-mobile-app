import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
  TouchableHighlight,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
//import {TextInput} from 'react-native-paper';
import {useSelector} from 'react-redux';
import StepIndicator from 'react-native-step-indicator';
import {courseState, getCategoryDetails} from '../../reducers/courses.slice';
import {userState} from '../../reducers/user.slice';
import {useForm, Controller} from 'react-hook-form';
// import { LogBox } from 'react-native';
import style from '../../styles/style';
import {Column, Container} from 'native-base';
import {brandColor} from '../../styles/colors';
import {Picker} from '@react-native-picker/picker';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import CustomDropdown from "@components/Elements/CustomDropdown";
import helper from '../../utils/helperMethods';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import Helper from '../../utils/helperMethods';
import config from '../../config/Config';
import ApiGateway from '../../config/apiGateway';
import {unwrapResult} from '@reduxjs/toolkit';
import {useAppDispatch} from '../../app/store';
import {AnyAsyncThunk} from '@reduxjs/toolkit/dist/matchers';
import {
  loaderState,
  setLoading,
  setPageLoading,
} from '../../reducers/loader.slice';
import {
  applyCoupon,
  cartDetails,
  checkoutState,
  checkoutToNextPage,
  checkoutUpdate,
  removeCoupon,
  setCheckoutDataDetails,
  detailsCheckoutToken
} from '../../reducers/checkout.slice';
import PageLoader from '../../components/PageLoader';
import CustomDropdown from '../../components/CustomDropdown';
import {useFocusEffect} from '@react-navigation/native';
import StyleCSS from '../../styles/style';
import HeaderInner from '../../components/HeaderInner';
const {width, height} = Dimensions.get('screen');

type Props = NativeStackScreenProps<RootParamList, 'CartPage'>;

const MIN_NO_OF_WEEKS = 2;
const MAX_NO_OF_WEEKS = 15;
const MIN_CLASS_PER_WEEK = 1;
const MAX_CLASS_PER_WEEK = 10;

export const stepIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 2,
  stepStrokeWidth: 2,
  stepStrokeCurrentColor: brandColor,
  stepStrokeUnFinishedColor: 'rgb(228, 228, 228)',
  stepStrokeFinishedColor: brandColor,
  separatorFinishedColor: brandColor,
  separatorUnFinishedColor: '#E4E4E4',
  stepIndicatorFinishedColor: brandColor,
  stepIndicatorUnFinishedColor: '#fff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 14,
  currentStepIndicatorLabelFontSize: 14,
  stepIndicatorLabelCurrentColor: brandColor,
  stepIndicatorLabelFinishedColor: '#E4E4E4',
  stepIndicatorLabelUnFinishedColor: '#E4E4E4',
};

var itemsClassPerWeek = [
  {
    label: 1,
    value: '1 Class',
  },
  {
    label: 2,
    value: '2 Classes',
  },
  {
    label: 3,
    value: '3 Classes',
  },
  {
    label: 4,
    value: '4 Classes',
  },
  {
    label: 5,
    value: '5 Classes',
  },
  {
    label: 6,
    value: '6 Classes',
  },
  {
    label: 7,
    value: '7 Classes',
  },
  {
    label: 8,
    value: '8 Classes',
  },
  {
    label: 9,
    value: '9 Classes',
  },
  {
    label: 10,
    value: '10 Classes',
  },
];
var itemsWeeks = [
  {
    label: 2,
    value: '2 Weeks',
  },
  {
    label: 3,
    value: '3 Weeks',
  },
  {
    label: 4,
    value: '4 Weeks',
  },
  {
    label: 5,
    value: '5 Weeks',
  },
  {
    label: 6,
    value: '6 Weeks',
  },
  {
    label: 7,
    value: '7 Weeks',
  },
  {
    label: 8,
    value: '8 Weeks',
  },
  {
    label: 9,
    value: '9 Weeks',
  },
  {
    label: 10,
    value: '10 Weeks',
  },
  {
    label: 11,
    value: '11 Weeks',
  },
  {
    label: 12,
    value: '12 Weeks',
  },
  {
    label: 13,
    value: '13 Weeks',
  },
  {
    label: 14,
    value: '14 Weeks',
  },
  {
    label: 15,
    value: '15 Weeks',
  },
];

export interface CartDetailsData {
  courseToken: string;
  classType: any;
  userToken: string;
}
export default function CartPage({navigation, route}: Props) {
  // LogBox.ignoreLogs([
  //   "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  // ]);
  const {course} = useSelector(courseState);
  const {checkoutDataDetails, page} = useSelector(checkoutState);
  const {pageLoading} = useSelector(loaderState);
  const currentPage: number = 0;
  const dispatch = useAppDispatch();
  // const courseData = route.params?.refillCourse;
  const checkoutToken = route.params?.checkoutToken;
  const [checkoutData, setCheckoutData] = useState<any>(checkoutDataDetails);
  const [totalClassesPerWeek, setTotalClassesPerWeek] = useState<
    number | string
  >(0);
  const [totalNumberOfClass, setTotalNumberOfClass] = useState<number | string>(
    0,
  );
  const [totalNumberOfWeeks, setTotalNumberOfWeeks] = useState<number | string>(
    0,
  );
  const [couponCode, setCouponCode] = useState<string>('');

  // if(Object.keys(course) === 0){

  // }
  // useFocusEffect(
  //   useCallback(() => {
  //     if(route?.params?.backroute!=='CourseDetail'){
  //       console.log("is exec here")
  //       getCartDetails();
  //     }
  //     else {
  //       console.log('reached this scope')
  //        setCheckoutData(checkoutDataDetails)
  //     }
      
  //   }, [checkoutDataDetails]),
  // );

  useEffect(()=>{
 let data:any = {
    checkoutToken : checkoutToken,
    userToken: userData.token

 }
    dispatch(setPageLoading(true));
    dispatch(detailsCheckoutToken(data))
    .unwrap()
    .then((response)=>{
      dispatch(setPageLoading(false));
      let APIData = response.data;
        postResponseUpdate(APIData);
        console.log(response);
    })
    .catch((err) => {
      dispatch(setPageLoading(false))
    })
  }, [])

  // useEffect(() => {
  //   if(page==='D'){
  //     getCartDetails();
  //   }
  //   else if(page==='C'){
  //     console.log('reached this scope')
  //      setCheckoutData(checkoutDataDetails)
  //      setTotalClassesPerWeek(checkoutDataDetails.amount.classes_per_week);
  //      setTotalNumberOfClass(checkoutDataDetails.amount.number_of_class);
  //      setTotalNumberOfWeeks(checkoutDataDetails.amount.number_of_weeks);
  //   }
  // }, [checkoutDataDetails])


  // const getCartDetails = () => {
  //   const finalData: CartDetailsData = {
  //     courseToken: courseData.course_token,
  //     classType: courseData.class_type.id,
  //     userToken: userData.token,
  //   };
  //   dispatch(setPageLoading(true));
  //   dispatch(cartDetails(finalData))
  //     .unwrap()
  //     .then(response => {
  //       console.log(response)
  //       dispatch(setPageLoading(false));
  //       let APIData = response.data;
  //       postResponseUpdate(APIData);
  //     })
  //     .catch(err => {
  //       dispatch(setPageLoading(false));
  //     });
  // };
console.log(checkoutData);
console.log(checkoutDataDetails)
  const postResponseUpdate = (APIData: any) => {
    if (APIData.status === 'success') {
      dispatch(setPageLoading(false));
      setCheckoutData(APIData.data);
      setTotalClassesPerWeek(APIData.data.amount.classes_per_week);
      setTotalNumberOfClass(APIData.data.amount.number_of_class);
      setTotalNumberOfWeeks(APIData.data.amount.number_of_weeks);
    } else if (APIData.status === 'failure') {
      dispatch(setPageLoading(false));
      Alert.alert('', APIData.error_message.message, [
        {text: 'Okay', style: 'cancel'},
      ]);
      // navigation.navigate(route.params?.backroute);
      navigation.goBack();
    }
  };

  // const {
  //   control,
  //   handleSubmit,
  //   formState: {errors, isValid},
  // } = useForm({mode: 'onBlur'});
  const COUNTRY = 'India';

  // useEffect(()=>{
  //   setCheckoutData(checkoutDataDetails)
    
  // }, [checkoutDataDetails])
  const {userData, isLoggedIn} = useSelector(userState);

  // const onSubmit = (data: any) => console.log(data);

  const handleClassPerWeekChange = (data?: any) => {
    let selectedValue = data[0].label;
    dispatch(setPageLoading(true));
    setTotalClassesPerWeek(selectedValue);
    setTotalNumberOfWeeks(totalNumberOfWeeks);
    setTotalNumberOfClass((totalNumberOfWeeks as number) * selectedValue);

    dispatchCheckoutUpdate(
      checkoutData,
      selectedValue,
      (totalNumberOfWeeks as number) * selectedValue,
      totalNumberOfWeeks,
    );
  };

  const getDiscountAmount = (amount: any) => {
    let TA = amount?.total_amount;
    let CDA = amount?.coupon_discount_amount;
    if (TA || CDA) {
      return (TA.replace(/,/g, '') - CDA.replace(/,/g, '')).toFixed(2);
    } else {
      return (TA - CDA).toFixed(2);
    }
  };

  const dispatchCheckoutUpdate = (
    checkoutData: any,
    cpw: number | string,
    noc: number | string,
    now: number | string,
  ) => {
    let finalReviewData = {
      number_of_class: noc,
      classes_per_week: cpw,
      number_of_weeks: now,

      coupon_code: '',
      coupon_discount_amount: '0.00',
      currency_type: checkoutData.amount.currency_type,
      price_per_class: checkoutData.amount.price_per_class,

      checkout_token: checkoutData.checkout_token,
      course: checkoutData.course.id,
      purchase_type: checkoutData.purchase_type,
      class_type: checkoutData.class_type.id,
      billing_city: checkoutData.billing_city,
      billing_country: checkoutData.billing_country,
      billing_first_name: checkoutData.billing_first_name,
      billing_last_name: checkoutData.billing_last_name,
      billing_pin_code: checkoutData.billing_pin_code,
      billing_state: checkoutData.billing_state,
      billing_street_address: checkoutData.billing_street_address,
      order_comments: checkoutData.order_comments,
      payment_gateway: checkoutData.payment_gateway,
      device_type: Platform.OS,
    };

    const finalData = {
      finalReviewData: finalReviewData,
      userToken: userData.token,
    };
    dispatch(checkoutUpdate(finalData))
      .unwrap()
      .then(response => {
        let APIData = response.data;
        postResponseUpdate(APIData);
      })
      .catch(error => {
        dispatch(setPageLoading(false));
        Alert.alert('', config.messages.common_error, [
          {text: 'Okay', style: 'cancel'},
        ]);
      });
  };

  const handleNoOfWeeksChange = (data?: any) => {
    let selectedValue = data[0].label;
    setPageLoading(true);
    setTotalClassesPerWeek(totalClassesPerWeek);
    setTotalNumberOfWeeks(selectedValue);
    setTotalNumberOfClass((totalClassesPerWeek as number) * selectedValue);

    dispatchCheckoutUpdate(
      checkoutData,
      totalClassesPerWeek,
      (totalClassesPerWeek as number) * selectedValue,
      selectedValue,
    );
  };

  const applyCouponSubmit = (couponType: 'AC' | 'RC') => {
    dispatch(setPageLoading(true));
    let finalCouponCode = '';

    if (couponType === 'AC') {
      finalCouponCode = couponCode;
      if (!finalCouponCode) {
        dispatch(setPageLoading(false));
        Alert.alert('', config.messages.coupon_empty, [
          {text: 'Okay', style: 'cancel'},
        ]);
      }
    } else if (couponType === 'RC') {
      finalCouponCode = '';
      //couponData.coupon_discount_amount = "0.00";
    }

    let couponData = {
      coupon_code: finalCouponCode,
      number_of_class: totalNumberOfClass,
      classes_per_week: totalClassesPerWeek,
      number_of_weeks: totalNumberOfWeeks,
      checkout_token: checkoutData.checkout_token,
      course: checkoutData.course.id,
      price_per_class: checkoutData.amount.price_per_class,
      currency_type: checkoutData.amount.currency_type,
      total_amount: checkoutData.amount.total_amount,
      class_type: checkoutData.class_type.id,
      discount_amount: checkoutData.amount.discount_amount,
      device_type: Platform.OS,
    };

    let finalData = {
      couponData: couponData,
      userToken: userData.token,
    };

    if (couponType === 'AC' && finalCouponCode) {
      dispatch(applyCoupon(finalData))
        .unwrap()
        .then(response => {
          if (response.data.status === 'success') {
            let APIData = checkoutData; //response.data;
            APIData.amount = response.data.data.amount;
            postResponseUpdate(APIData);
            setTimeout(() => {
              dispatch(setPageLoading(false));
            }, 3000);
          } else if (response.data.status === 'failure') {
            dispatch(setPageLoading(false));
            Alert.alert('', response.data.error_message.message, [
              {text: 'Okay', style: 'cancel'},
            ]);
          }
        })
        .catch(error => {
          dispatch(setPageLoading(false));
          Alert.alert('', config.messages.common_error, [
            {text: 'Okay', style: 'cancel'},
          ]);
        });
    } else if (couponType === 'RC') {
      dispatch(removeCoupon(finalData))
        .unwrap()
        .then(response => {
          dispatch(setPageLoading(false));

          setCouponCode('');
          let APIData = response.data;
          postResponseUpdate(APIData);
        })
        .catch(error => {
          dispatch(setPageLoading(false));
          Alert.alert('', config.messages.common_error, [
            {text: 'Okay', style: 'cancel'},
          ]);
        });
    }
  };

  const checkoutNextPage = () => {
    dispatch(setPageLoading(true));
    let finalReviewData = {
      number_of_class: totalNumberOfClass,
      classes_per_week: totalClassesPerWeek,
      number_of_weeks: totalNumberOfWeeks,

      coupon_code: checkoutData.amount.coupon_code,
      coupon_discount_amount: checkoutData.amount.coupon_discount_amount,
      currency_type: checkoutData.amount.currency_type,
      price_per_class: checkoutData.amount.price_per_class,

      checkout_token: checkoutData.checkout_token,
      course: checkoutData.course.id,
      purchase_type: checkoutData.purchase_type,
      class_type: checkoutData.class_type.id,
      billing_city: checkoutData.billing_city,
      billing_country: checkoutData.billing_country,
      billing_first_name: checkoutData.billing_first_name,
      billing_last_name: checkoutData.billing_last_name,
      billing_pin_code: checkoutData.billing_pin_code,
      billing_state: checkoutData.billing_state,
      billing_street_address: checkoutData.billing_street_address,
      order_comments: checkoutData.order_comments,
      payment_gateway: checkoutData.payment_gateway,
      device_type: Platform.OS,
    };

    let finalData = {
      finalReviewData: finalReviewData,
      userToken: userData.token,
    };
    dispatch(checkoutToNextPage(finalData))
      .unwrap()
      .then(response => {
        dispatch(setPageLoading(false));

        if (response.data.status === 'success') {
          dispatch(setCheckoutDataDetails(response.data.data));
          navigation.navigate('PaymentPage');
        } else if (response.data.status === 'failure') {
          Alert.alert('', response.data.error_message.message, [
            {text: 'Okay', style: 'cancel'},
          ]);
        }
      })
      .catch(error => {
        dispatch(setPageLoading(false));
        Alert.alert('', config.messages.common_error, [
          {text: 'Okay', style: 'cancel'},
        ]);
      });
  };

  return (
    <>
      {pageLoading ? (
        <PageLoader />
      ) : (
        <>
         <HeaderInner
                title={"Checkout"}
                type={'findCourse'}
                backroute={route?.params?.backroute}
                back={true}
                navigation={navigation}
                // backRoute={}
                ></HeaderInner>
        {Object.keys(checkoutData)!==0 ?
        (
          <View style={styles.container}>
            <Container>
              {/* <HeaderInner
              titleSize={this.titleSize}
              titleTop={this.titleTop}
              changingHeight={this.changingHeight}
              title={"Checkout"}
              navigation={this.props.navigation}
              type={"innerpage"}
              iconTop={this.iconTop}
              titleLeft={this.titleLeft}
              backRoute={"Dashboard"}
            /> */}
              <ScrollView
                style={{width: width}}
                contentInsetAdjustmentBehavior="always"
                scrollEventThrottle={16}
                // onScroll={Animated.event(
                //   [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
                //   { useNativeDriver: false }
                // )}
              >
                <View style={styles.safecontainer}>
                  <View style={styles.stepIndicator}>
                    <StepIndicator
                      customStyles={stepIndicatorStyles}
                      stepCount={4}
                      direction="horizontal"
                      currentPosition={currentPage}
                    />
                  </View>
                  <View style={styles.titleBorder}>
                    <Text style={styles.title}>Your Cart</Text>
                  </View>
                  <Text style={styles.courseTitle}>
                    {checkoutData?.course?.title}
                    {checkoutData?.class_type?.members === '1' ? (
                      <Text>(1-on-1 Class)</Text>
                    ) : (
                      <Text>({checkoutData?.class_type?.members} Members)</Text>
                    )}
                  </Text>
                  <View>
                    <View style={{flexDirection: 'row', marginTop: 16}}>
                      <View style={{width: '50%'}}>
                        <Text style={styles.bodyText}>Cost Per Class</Text>
                        <Text style={styles.info}>
                          {checkoutData?.amount?.currency_type === 'INR'
                            ? 'Rs.'
                            : 'US$ '}{' '}
                          {checkoutData?.amount?.price_per_class}
                        </Text>
                      </View>
                      <View style={{width: '50%'}}>
                        <Text style={styles.bodyText}>Number of Classes</Text>
                        <Text style={styles.info}>{totalNumberOfClass}</Text>
                      </View>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.bodyText}>Classes Per Week</Text>
                      <View style={styles.dropdown_custom}>
                        <CustomDropdown
                          config={{color: '#81878D'}}
                          onChangeVal={handleClassPerWeekChange}
                          data={itemsClassPerWeek}
                          label={
                            totalClassesPerWeek == '-'
                              ? 'Select class per week'
                              : totalClassesPerWeek == 1
                              ? totalClassesPerWeek + ' Class'
                              : totalClassesPerWeek + ' Classes'
                          }
                          backTitle={'Select Classes per week'}
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.bodyText}>
                        Number of Weeks (to purchase for)
                      </Text>
                      <View style={styles.dropdown_custom}>
                        <CustomDropdown
                          config={{color: '#81878D'}}
                          onChangeVal={handleNoOfWeeksChange}
                          data={itemsWeeks}
                          label={
                            totalNumberOfWeeks == '-'
                              ? 'Select Number of Weeks'
                              : totalNumberOfWeeks + ' Weeks'
                          }
                          backTitle={'Select Number of Weeks'}
                        />
                      </View>
                      <Text> </Text>
                    </View>

                    <View style={styles.lineStyle} />
                    <View>
                      <View style={[styles.priceCalc]}>
                        <Text style={styles.bodyText}>Actual Price:</Text>
                        <Text style={[styles.contentText, {paddingLeft: 5}]}>
                          {checkoutData?.amount?.currency_type === 'INR'
                            ? 'Rs.'
                            : 'US$ '}
                          {checkoutData?.amount?.total_amount}
                        </Text>
                      </View>
                      {checkoutData?.amount?.coupon_discount_amount !==
                      '0.00' ? (
                        <View style={styles.priceCalc}>
                          <Text style={styles.labelText}>
                            Discount{' '}
                            {checkoutData?.amount?.percentage
                              ? checkoutData?.amount?.percentage + '%'
                              : 'Amount'}
                            {': '}
                          </Text>
                          <Text style={[styles.contentText, {paddingLeft: 5}]}>
                            {' - '}
                            {checkoutData?.amount?.currency_type === 'INR'
                              ? 'Rs.'
                              : 'US$ '}
                            {checkoutData?.amount?.coupon_discount_amount}
                          </Text>
                        </View>
                      ) : null}
                      {checkoutData?.amount?.coupon_discount_amount !==
                      '0.00' ? (
                        <View style={styles.priceCalc}>
                          <Text style={styles.labelText}>
                            Price After Discount:
                          </Text>
                          <Text style={[styles.contentText, {paddingLeft: 5}]}>
                            {checkoutData?.amount?.currency_type === 'INR'
                              ? 'Rs.'
                              : 'US$ '}
                            {getDiscountAmount(checkoutData.amount)}
                          </Text>
                        </View>
                      ) : null}
                      {checkoutData?.cgst_applied && (
                        <View style={styles.priceCalc}>
                          <Text style={styles.labelText}>
                            CGST ({checkoutData?.amount.cgst}%):
                          </Text>
                          <Text style={[styles.contentText, {paddingLeft: 5}]}>
                            {checkoutData?.amount.currency_type === 'INR'
                              ? 'Rs.'
                              : 'US$ '}
                            {checkoutData?.amount.cgst_amount}
                          </Text>
                        </View>
                      )}
                      {checkoutData?.sgst_applied ? (
                        <View style={styles.priceCalc}>
                          <Text style={styles.labelText}>
                            SGST ({checkoutData?.amount?.sgst}%):
                          </Text>
                          <Text style={[styles.contentText, {paddingLeft: 5}]}>
                            {checkoutData?.amount?.currency_type === 'INR'
                              ? 'Rs.'
                              : 'US$ '}
                            {checkoutData?.amount?.sgst_amount}
                          </Text>
                        </View>
                      ) : null}
                      {checkoutData?.igst_applied && (
                        <View style={styles.priceCalc}>
                          <Text style={styles.labelText}>
                            IGST ({checkoutData?.amount?.igst}%):
                          </Text>
                          <Text style={[styles.contentText, {paddingLeft: 5}]}>
                            {checkoutData?.amount?.currency_type === 'INR'
                              ? 'Rs.'
                              : 'US$ '}
                            {checkoutData?.amount?.igst_amount}
                          </Text>
                        </View>
                      )}
                      <View style={styles.priceCalc}>
                        <Text style={styles.totalDue}>Total Due:</Text>
                        <Text style={styles.totalDueInfo}>
                          {checkoutData.amount?.currency_type === 'INR'
                            ? 'Rs.'
                            : 'US$ '}
                          {checkoutData.amount?.pay_amount}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.lineStyle} />
                    <View style={styles.coupon_code_text}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#81878D',
                          fontFamily: Helper.switchFont('regular'),
                        }}>
                        Coupon code
                      </Text>
                    </View>
                    {checkoutData.amount?.coupon_code ? (
                      <View style={styles.flexDrow}>
                        <View style={{width: '50%', marginTop: 10}}>
                          <TextInput
                            // mode="outlined"
                            // label="Coupen Code"
                            style={[
                              styles.input,
                              {
                                backgroundColor: '#fff',
                                fontWeight: 'bold',
                              },
                            ]}
                            onChangeText={text => setCouponCode(text)}
                            value={couponCode}
                            // onSubmitEditing={() => {
                            //   applyCouponSubmit('RC');
                            // }}
                            // selectTextOnFocus={false}
                          />
                        </View>

                        <View style={{width: '50%', alignItems: 'flex-end'}}>
                          <TouchableHighlight
                            underlayColor="#e0e2e5"
                            onPress={() => {
                              applyCouponSubmit('RC');
                            }}
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: 50,
                              backgroundColor: '#e0e2e5',
                              borderRadius: 3,
                              paddingHorizontal: 20,
                              marginTop: 10,
                              width: '80%',
                            }}>
                            <Text style={{color: 'rgb(44, 54, 65)'}}>
                              Remove Coupon
                            </Text>
                          </TouchableHighlight>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                        }}>
                        <View style={{width: '70%', marginTop: 10}}>
                          <TextInput
                            style={[styles.input]}
                            onChangeText={text => setCouponCode(text)}
                            value={couponCode}
                            autoCapitalize="none"
                            autoCorrect={false}
                            clearTextOnFocus={false}
                            enablesReturnKeyAutomatically={true}
                            textAlignVertical="center"
                            editable={true}
                            onSubmitEditing={() => {
                              applyCouponSubmit('AC');
                            }}
                            selectTextOnFocus={false}
                          />
                        </View>

                        <View style={{width: '30%', alignItems: 'flex-end'}}>
                          <TouchableHighlight
                            underlayColor="#e0e2e5"
                            onPress={() => {
                              applyCouponSubmit('AC');
                            }}
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: 50,
                              backgroundColor: '#e0e2e5',
                              borderRadius: 3,
                              marginTop: 10,
                              width: '80%',
                            }}>
                            <Text style={{color: 'rgb(44, 54, 65)'}}>
                              Apply
                            </Text>
                          </TouchableHighlight>
                        </View>
                      </View>
                    )}

                    <View style={styles.lineStyle} />

                    <Text
                      style={{
                        fontSize: 14,
                        color: '#81878D',
                        lineHeight: 21,
                        fontFamily: Helper.switchFont('regular'),
                      }}>
                      We will send the order confirmation to the Email Address{' '}
                      <Text
                        style={{
                          fontSize: 14,
                          color: 'rgb(44, 54, 65)',
                          lineHeight: 21,
                          fontFamily: Helper.switchFont('medium'),
                        }}>
                        {userData.email}
                      </Text>
                    </Text>

                    <View style={styles.lineStyle} />

                    <Text
                      style={{
                        fontSize: 11,
                        lineHeight: 18,
                        fontFamily: Helper.switchFont('regular'),
                        color: '#81878D',
                      }}>
                      This is Step 1 of 4. In the next page you can review your
                      order and product information
                    </Text>

                    {/* safecontainer */}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.nextPageButton}
                  onPress={() => checkoutNextPage()}>
                  <Image
                    source={require('@images/right_arrow.png')}
                    style={{
                      width: 21,
                      height: 16,
                      alignItems: 'center',
                    }}
                  />
                </TouchableOpacity>
              </ScrollView>
            </Container>
          </View>
        ) : null }
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  priceCalc: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 12,
    alignSelf: 'flex-end',
  },
  whiteBg: {
    backgroundColor: '#fff',
    padding: 15,
    height: height,
  },
  bodyText: {
    fontSize: 14,
    color: '#81878D',
    fontFamily: Helper.switchFont('regular'),
  },
  textWhite: {
    color: '#fff',
  },
  container: {
    flex: 1,
    marginTop:109,
    backgroundColor: '#ffffff',
  },
  flexDrow: {
    flex: 1,
    flexDirection: 'row',
  },
  row: {
    marginTop: 24,
    // borderWidth:1
  },
  stepIndicator: {
    paddingHorizontal: 0,
    textAlign: 'center',
    //top: 20,
  },
  rowItem: {
    flex: 1,
    paddingVertical: 0,
  },
  titleBorder: {
    marginTop: 50,
    borderLeftWidth: 2,
    borderLeftColor: brandColor,
  },
  totalDue: {
    fontSize: 16,
    color: 'rgb(44, 54, 65)',
    fontFamily: Helper.switchFont('regular'),
    alignSelf: 'flex-end',
  },
  totalDueInfo: {
    fontSize: 16,
    color: brandColor,
    fontFamily: Helper.switchFont('regular'),
    paddingLeft: 5,
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  safecontainer: {
    marginHorizontal: 24,
    //borderWidth:1,
  },
  info: {
    fontSize: 14,
    color: 'rgb(44, 54, 65)',
    fontFamily: Helper.switchFont('medium'),
    marginTop: 5,
  },
  title: {
    fontSize: 19,
    margin: 0,
    paddingLeft: 8,
    color: 'rgb(44, 54, 65)',
    fontFamily: Helper.switchFont('medium'),
  },
  courseTitle: {
    fontSize: 19,
    marginTop: 24,
    color: 'rgb(44, 54, 65)',
    fontFamily: Helper.switchFont('regular'),
  },
  body: {
    flex: 1,
    fontSize: 15,
    color: '#606060',
    lineHeight: 24,
    marginRight: 8,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: '#E2E4E5',
    // marginHorizontal: 24,
    marginVertical: 24,
  },
  coupon_code_text: {
    marginTop: 8,
  },

  labelText: {
    fontSize: 14,
    color: '#81878D',
    fontFamily: Helper.switchFont('regular'),
  },
  contentText: {
    fontSize: 14,
    color: 'rgb(44, 54, 65)',
    fontFamily: Helper.switchFont('medium'),
  },
  input: {
    color: 'rgb(44, 54, 65)',
    margin: 0,
    fontSize: 14,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'rgb(194, 194, 194)',
    fontFamily: Helper.switchFont('regular'),
    height: 50,
    padding: 10,
  },
  dropdown_custom: {
    fontFamily: Helper.switchFont('regular'),
    color: '#81878D',
    marginTop: 8,
    fontSize: 14,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'rgb(194, 194, 194)',
  },
  nextPageButton: {
    borderRadius: 30,
    width: 60,
    height: 60,
    alignSelf: 'flex-end',
    marginRight: 20,
    backgroundColor: brandColor,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    marginVertical: 24,
  },
});
