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
import TextField from '../../components/CustomTextField';
import {useSelector} from 'react-redux';
import StepIndicator from 'react-native-step-indicator';
import {courseState, getCategoryDetails} from '../../reducers/courses.slice';
import {userState} from '../../reducers/user.slice';
import {useForm, Controller} from 'react-hook-form';
// import { LogBox } from 'react-native';
import style from '../../styles/style';
import {Column, Container} from 'native-base';
import {
  brandColor,
  font1,
  font2,
  font3,
  lineColor,
  secondaryColor,
  secondaryColorBorder,
} from '../../styles/colors';
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
import DashedLine from 'react-native-dashed-line';
import CouponAddedSuccess from '../../assets/images/coupon_add.svg'
import {
  applyCoupon,
  cartDetails,
  checkoutState,
  checkoutToNextPage,
  checkoutUpdate,
  removeCoupon,
  setCheckoutDataDetails,
  detailsCheckoutToken,
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
  stepIndicatorSize: 24,
  currentStepIndicatorSize: 24,
  separatorStrokeWidth: 1,
  currentStepStrokeWidth: 1,
  stepStrokeWidth: 1,
  stepStrokeCurrentColor: brandColor,
  stepStrokeUnFinishedColor: lineColor,
  stepStrokeFinishedColor: brandColor,
  separatorFinishedColor: brandColor,
  separatorUnFinishedColor: lineColor,
  stepIndicatorFinishedColor: brandColor,
  stepIndicatorUnFinishedColor: '#fff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 12,
  currentStepIndicatorLabelFontSize: 12,
  stepIndicatorLabelCurrentColor: brandColor,
  stepIndicatorLabelFinishedColor: '#fff',
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
const [couponSuccess, setCouponSuccess] = useState(false)
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

  useEffect(() => {
    let data: any = {
      checkoutToken: checkoutToken,
      userToken: userData.token,
    };
    dispatch(setPageLoading(true));
    dispatch(detailsCheckoutToken(data))
      .unwrap()
      .then(response => {
        dispatch(setPageLoading(false));
        let APIData = response.data;
        postResponseUpdate(APIData);
        console.log(response);
      })
      .catch(err => {
        dispatch(setPageLoading(false));
      });
  }, []);

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
  console.log(checkoutDataDetails);
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
            setCouponSuccess(true)
            let APIData = checkoutData; //response.data;
            APIData.amount = response.data.data.amount;
            postResponseUpdate(APIData);
            setTimeout(() => {
              dispatch(setPageLoading(false));
            }, 3000);
          } else if (response.data.status === 'failure') {
            dispatch(setPageLoading(false));
            setCouponSuccess(false);
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
            title={'Checkout'}
            type={'findCourse'}
            backroute={route?.params?.backroute}
            back={true}
            removeRightHeader={true}
            changingHeight={config.headerHeight}
            navigation={navigation}
            // backRoute={}
          ></HeaderInner>
          <View
            style={{
              position: 'absolute',
              top: config.headerHeight,
              zIndex: 2,
              height: 32,
              width: '100%',
            }}>
            <Image
              style={styles.formFillTimeImage}
              source={require('@images/transactions_bg.png')}
            />
            <View style={styles.formFillTimeTextWrapper}>
              <Text style={styles.formFillTimeText}>
                Should take less than 48 seconds
              </Text>
            </View>
          </View>

          {Object.keys(checkoutData) !== 0 ? (
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
                    {/* <View style={styles.titleBorder}> */}
                    <Text style={styles.title}>Your Cart</Text>
                    {/* </View> */}
                    <View style={{marginTop: 16}}>
                      <Text style={styles.bodyText}>Course</Text>
                      <Text style={styles.courseTitle}>
                        {checkoutData?.course?.title}
                        {checkoutData?.class_type?.members === '1' ? (
                          <Text style={styles.courseTitle}>(1-on-1 Class)</Text>
                        ) : (
                          <Text>
                            ({checkoutData?.class_type?.members} Members)
                          </Text>
                        )}
                      </Text>
                    </View>
                    <View style={{marginVertical: 16}}>
                      <DashedLine
                        dashLength={5}
                        dashThickness={1}
                        dashGap={5}
                        dashColor={lineColor}
                      />
                    </View>
                    <View>
                      <View style={{flexDirection: 'row'}}>
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
                        <View>
                          <CustomDropdown
                            topLabel="Classes Per Week"
                            config={{color: '#fff'}}
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
                      <View style={[styles.row]}>
                        <View>
                          <CustomDropdown
                            topLabel="Number of Weeks (to purchase for)"
                            config={{color: '#fff'}}
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
                      </View>

                      <View style={[StyleCSS.styles.lineStyleLight, {marginVertical:24}]} />

                      {checkoutData.amount?.coupon_code ? (
                        <View>
                          <View>
                            <View style={{position:'absolute', zIndex:1000, top:20, left:80}}>
                              <CouponAddedSuccess/>
                              </View>
                            <TextField
                              mode="outlined"
                              editable={false}
                              label="Coupon Code"
                              value={couponCode}
                              onChangeText={(text: string) =>
                                setCouponCode(text)
                              }>

                              </TextField>
                                                            {couponSuccess ? <Text style={styles.couponSuccessText}> Coupon Applied</Text> : null}

                          </View>
                          <TouchableHighlight
                              underlayColor="#e0e2e5"
                              onPress={() => {
                                applyCouponSubmit('RC');
                              }}
                              style={{
                                position: 'absolute',
                                right: 16,
                                top: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  color: secondaryColor,
                                  fontWeight: '700',
                                  fontFamily: Helper.switchFont('bold'),
                                }}>
                                Remove
                              </Text>
                            </TouchableHighlight>
                        </View>
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                          }}>
                          <View style={{width: '100%'}}>
                            <TextField
                              // style={[styles.input]}
                              mode="outlined"
                              label="Coupon Code"
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

                          <View>
                            <TouchableHighlight
                              underlayColor="#e0e2e5"
                              onPress={() => {
                                applyCouponSubmit('AC');
                              }}
                              style={{
                                position: 'absolute',
                                right: 16,
                                top: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  color: secondaryColor,
                                  fontWeight: '700',
                                  fontFamily: Helper.switchFont('bold'),
                                }}>
                                Apply
                              </Text>
                            </TouchableHighlight>
                          </View>
                        </View>
                      )}
                      <View style={{marginTop:16}}>
                        <View style={[styles.priceCalc,]}>
                          <View style={styles.priceLabelWrapper}>
                          <Text style={styles.labelText}>Actual Price:</Text>
                          <Text style={styles.labelText}>:</Text>
                          </View>
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
                            <View style={styles.priceLabelWrapper}>
                            <Text style={styles.labelText}>
                              Discount{' '}
                              {checkoutData?.amount?.percentage
                                ? checkoutData?.amount?.percentage + '%'
                                : 'Amount'}
                              
                            </Text>
                            <Text style={styles.labelText}>:</Text>
                            </View>
                            <Text
                              style={[styles.contentText, {paddingLeft: 5}]}>
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
                          <View style={styles.priceLabelWrapper}>
                            <Text style={styles.labelText}>
                              Price After Discount
                            </Text>
                            <Text style={styles.labelText}>:</Text>
                            </View>
                            <Text
                              style={[styles.contentText, {paddingLeft: 5}]}>
                              {checkoutData?.amount?.currency_type === 'INR'
                                ? 'Rs.'
                                : 'US$ '}
                              {getDiscountAmount(checkoutData.amount)}
                            </Text>
                          </View>
                        ) : null}
                        {checkoutData?.cgst_applied && (
                          <View style={styles.priceCalc}>
                          <View style={styles.priceLabelWrapper}>
                            <Text style={styles.labelText}>
                              CGST ({checkoutData?.amount.cgst}%)
                            </Text>
                            <Text style={styles.labelText}>:</Text>
                            </View>
                            <Text
                              style={[styles.contentText, {paddingLeft: 5}]}>
                              {checkoutData?.amount.currency_type === 'INR'
                                ? 'Rs.'
                                : 'US$ '}
                              {checkoutData?.amount.cgst_amount}
                            </Text>
                          </View>
                        )}
                        {checkoutData?.sgst_applied ? (
                          <View style={styles.priceCalc}>
                          <View style={styles.priceLabelWrapper}>
                            <Text style={styles.labelText}>
                              SGST ({checkoutData?.amount?.sgst}%)

                            </Text>
                            <Text style={styles.bodyText}>:</Text>
                            </View>
                            <Text
                              style={[styles.contentText, {paddingLeft: 5}]}>
                              {checkoutData?.amount?.currency_type === 'INR'
                                ? 'Rs.'
                                : 'US$ '}
                              {checkoutData?.amount?.sgst_amount}
                            </Text>
                          </View>
                         ) : null}
                        {checkoutData?.igst_applied && (
                          <View style={styles.priceCalc}>
                          <View style={styles.priceLabelWrapper}>
                            <Text style={styles.labelText}>
                              IGST ({checkoutData?.amount?.igst}%)
                            </Text>
                            <Text style={styles.bodyText}>:</Text>
                            </View>
                            <Text
                              style={[styles.contentText, {paddingLeft: 5}]}>
                              {checkoutData?.amount?.currency_type === 'INR'
                                ? 'Rs.'
                                : 'US$ '}
                              {checkoutData?.amount?.igst_amount}
                             
                            </Text>
                          </View>
                         )}
                       <View style={{marginVertical: 8}}>
                      <DashedLine
                        dashLength={5}
                        dashThickness={1}
                        dashGap={5}
                        dashColor={lineColor}
                      />
                    </View>
                        <View style={styles.priceCalc}>
                        <View style={styles.priceLabelWrapper}>
                          <Text style={styles.totalDue}>Total Due</Text>
                          <Text style={styles.totalDue}>:</Text>
                          </View>
                          <Text style={styles.totalDueInfo}>
                            {checkoutData.amount?.currency_type === 'INR'
                              ? 'Rs.'
                              : 'US$ '}
                            {checkoutData.amount?.pay_amount}
                          </Text>
                        </View>
                      </View>
                      <View style={[StyleCSS.styles.lineStyleLight, {marginTop:16,marginBottom:24}]} />

                     

                      <Text
                        style={{
                          fontSize: 14,
                          color: font2,
                          lineHeight: 20,
                          fontWeight:'500',
                          fontFamily: Helper.switchFont('medium'),
                        }}>
                        We will send the order confirmation to the Email Address{' '}
                        <Text
                          style={{
                            fontSize: 14,
                            color: font1,
                            fontWeight:'700',
                            lineHeight: 20,
                            fontFamily: Helper.switchFont('bold'),
                          }}>
                          {userData.email}
                        </Text>
                      </Text>

                      <View style={[StyleCSS.styles.lineStyleLight,{marginTop:24, marginBottom:16 , marginHorizontal: -16}]} />

                      <Text
                        style={{
                          fontSize: 12,
                          lineHeight: 18,
                          fontFamily: Helper.switchFont('regular'),
                          color: font2,
                        }}>
                        This is Step 1 of 4. In the next page you can review
                        your order and product information
                      </Text>

                      {/* safecontainer */}
                    </View>
                  </View>

                  {/* <TouchableOpacity
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
                  </TouchableOpacity> */}
                  <View
                  style={[
                   StyleCSS.styles.modalButton
                  ]}>
                  <TouchableOpacity
                    style={{
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
                      borderWidth:1,
                      marginRight: '3%',
                    }}
                    onPress={() => {
                      // navigation.goBack()
                     
                    }}>
                    <Text
                      style={{
                        color: secondaryColor,
                        textAlign: 'center',
                        fontWeight: '700',
                        fontFamily: Helper.switchFont('bold'),
                        fontSize: 14,
                        lineHeight: 18,
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      padding: 12,
                      // paddingTop: 18,
                      // paddingBottom: 18,
                      backgroundColor: brandColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 8,
                      width: '48%',
                      zIndex: 1,
                    }}
                    onPress={() => checkoutNextPage()}
                    >
                    <Text
                      style={{
                        color: '#fff',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontFamily: Helper.switchFont('medium'),
                        fontSize: 14,
                        lineHeight: 18,
                      }}>
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
                </ScrollView>
              </Container>
            </View>
          ) : null}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  priceCalc: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 8 ,
    justifyContent:'space-between'
  },
  whiteBg: {
    backgroundColor: '#fff',
    padding: 15,
    height: height,
  },
  bodyText: {
    fontSize: 14,
    color: font2,
    fontWeight: '500',
    fontFamily: Helper.switchFont('medium'),
  },
  textWhite: {
    color: '#fff',
  },
  container: {
    flex: 1,
    marginTop: config.headerHeight + 30,
    backgroundColor: '#ffffff',
  },

  row: {
    marginTop: 24,
    // borderWidth:1
  },
  stepIndicator: {
    paddingHorizontal: 0,
    textAlign: 'center',
  },
  rowItem: {
    flex: 1,
    paddingVertical: 0,
  },
  titleBorder: {
    marginTop: 56,
    borderLeftColor: brandColor,
  },
  totalDue: {
    fontSize: 14,
    color: font1,
    fontFamily: Helper.switchFont('semibold'),
    fontWeight:'600',

    // alignSelf: 'flex-end',
  },
  totalDueInfo: {
    fontSize: 18,
    color: font1,
    fontFamily: Helper.switchFont('semibold'),
    fontWeight:'600',
    // paddingLeft: 5,
    // textAlign: 'right',
    // alignSelf: 'flex-end',
  },
  safecontainer: {
    marginHorizontal: 16,

    paddingTop: 16,
  },
  info: {
    fontSize: 14,
    color: font1,
    fontWeight: '500',
    fontFamily: Helper.switchFont('medium'),
    marginTop: 5,
  },
  title: {
    marginTop: 16,
    fontSize: 18,
    color: font1,
    fontWeight: '700',
    fontFamily: Helper.switchFont('bold'),
  },
  courseTitle: {
    fontSize: 14,
    marginTop: 5,
    color: font1,
    fontWeight: '600',
    fontFamily: Helper.switchFont('semibold'),
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
  },
  coupon_code_text: {
    marginTop: 8,
  },

  labelText: {
    fontSize: 14,
    color: font2,
    fontWeight:'500',
    fontFamily: Helper.switchFont('medium'),
  },
  contentText: {
    fontSize: 14,
    color: font1,
    fontWeight:'600',
    fontFamily: Helper.switchFont('semibold'),
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
  formFillTimeImage: {
    height: '100%',
    width: '100%',
  },
  formFillTimeTextWrapper: {
    paddingLeft: 16,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    height: 32,
    width: '100%',
    // top: 100,
  },
  formFillTimeText: {zIndex: 100, fontSize: 12, color: '#fff', opacity: 0.7},
  couponSuccessText:{
    marginTop:6,
    color: font3,
    fontSize:12,
    fontStyle:'italic',
    fontFamily:Helper.switchFont('medium'),
    fontWeight:'500',
  },
  priceLabelWrapper:{flexDirection:'row', justifyContent:'space-between', width:'50%'}
});

// {couponSuccess ? <CouponAddedSuccess/> : null}