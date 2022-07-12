import React, {useState, FC, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  // Image,
  TouchableOpacity,
  Animated,
  Modal,
  Platform,
  Pressable,
  Alert,
  Dimensions,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import {useSelector} from 'react-redux';
import {checkoutState, proceedToPayment, detailsCheckoutToken, setCheckoutDataDetails} from '../../reducers/checkout.slice';
import StepIndicator from 'react-native-step-indicator';
import PageLoader from '../../components/PageLoader';
import {WebView} from 'react-native-webview';
import {stepIndicatorStyles} from './CartPage';
import {userState} from '../../reducers/user.slice';
import helper from '../../utils/helperMethods';
import {loaderState, setPageLoading} from '../../reducers/loader.slice';
import Helper from '../../utils/helperMethods';
import {brandColor, font1, font2, lineColor} from '../../styles/colors';
import StyleCSS from '../../styles/style';
import {useAppDispatch} from '../../app/store';
import config from '../../config/Config';
import axios from 'axios';
import HeaderInner from '../../components/HeaderInner';
import DashedLine from 'react-native-dashed-line';
import PurchaseDot from '../../assets/images/purchase_dot.svg';
import CustomImage from '../../components/CustomImage';
import LineDashed from '../../components/LineDashed';
import timezones from '../../assets/json/timezones.json';
import CustomStatusBar from '../../components/CustomStatusBar';
const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

type Props = NativeStackScreenProps<RootParamList, 'Review'>;

type PayType = 'DISCOUNT';
type PaymentStatus = 'Pending' | 'Complete' | 'Cancelled';

const Review: FC<Props> = ({route, navigation}) => {
  const currentPage = 3;
  const teacherAvailability = route.params?.teacher_availability;

  const checkoutToken = route.params?.checkoutToken
  const dispatch = useAppDispatch();
  const {checkoutDataDetails} = useSelector(checkoutState);
  const {userData} = useSelector(userState);
  const {pageLoading} = useSelector(loaderState);
  const [showModal, setShowModal] = useState(false);
  const [reqData, setReqData] = useState('');
  const [paymentURL, setPaymentURL] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('Pending');
  const [timezone, setTimezone] = useState<any>(null);

  let scrollY;
  useEffect(() => {
    let data: any = {
      checkoutToken: checkoutToken,
      userToken: userData.token,
    };
    setTimezone(timezones);
    dispatch(setPageLoading(true));
    dispatch(detailsCheckoutToken(data))
      .unwrap()
      .then(response => {
        
        dispatch(setPageLoading(false));
      dispatch(setCheckoutDataDetails(response.data.data))
      })
      .catch(err => {
        dispatch(setPageLoading(false));
      });
  }, []);

  const getDiscountAmount = (amount: any) => {
    let TA = amount?.total_amount;
    let CDA = amount?.coupon_discount_amount;
    if (TA || CDA) {
      return (TA.replace(/,/g, '') - CDA.replace(/,/g, '')).toFixed(2);
    } else {
      return (TA - CDA).toFixed(2);
    }
  };

  const proceedGatewayPayment = () => {
    let finalData = checkoutDataDetails;
    let reqGatewayData = {};
    let gatewayURL = '';

    if (
      checkoutDataDetails.payment_gateway === 'PP' ||
      checkoutDataDetails.payment_gateway === 'PPU'
    ) {
      gatewayURL = 'paypal_view?data=';
    } else if (checkoutDataDetails.payment_gateway === 'PU') {
      gatewayURL = 'payumoney_view?data=';
    }

    if (
      checkoutDataDetails.payment_gateway === 'PU' ||
      checkoutDataDetails.payment_gateway === 'PP' ||
      checkoutDataDetails.payment_gateway === 'PPU'
    ) {
      reqGatewayData = {
        prodInfo: finalData.course.title.replace(/[^a-zA-Z]/g, ''),
        pay_amount: parseFloat(finalData.amount.pay_amount.replace(/,/g, '')),
        first_name: finalData.billing_first_name.replace(/[^a-zA-Z]/g, ''),
        email_id: userData.email,
        mobile_no: userData.phone_number,
        paymentType: checkoutDataDetails.payment_gateway,
      };

      setShowModal(true);
      setReqData(JSON.stringify(reqGatewayData));
      setPaymentURL(gatewayURL);
    }
  };

  const proceedPayment = (payType: PayType) => {
    dispatch(setPageLoading(true));
    // setShowModal(true);
    let finalData = checkoutDataDetails;
    let finalPay = finalData.amount.pay_amount;
    let pay_amount = finalPay.replace(/,/g, '');

    if (payType === 'DISCOUNT') {
      var date = new Date();
      var dateToNo = userData.id + date.getTime() + 'I-PAY';
      let dataPay = {
        course: checkoutDataDetails.course.id,
        checkout_id: checkoutDataDetails.id,
        number_of_class: checkoutDataDetails.amount.number_of_class,
        paid_ammount: pay_amount, //checkoutDataDetails.amount.pay_amount,
        error_code: 'SUCCESS',
        error_msg: '100% discount transaction',
        pay_status: 'S',
        payerid: userData.user_token,
        paymentid: dateToNo,
        paymenttoken: dateToNo,
        returnurl: '',
        timezone: userData.timezone,
        split_info: '',
        merchantTransactionId: '',
        additionalCharges: '',
        notificationId: '',
        productInfo: '',
        pg_type: '',
        payment_addedon: '',
        bank_ref_num: '',
        bankcode: '',
        cardToken: '',
        cardnum: '',
        discount: checkoutDataDetails.amount.discount_amount,
        customeremail: userData.email,
        encryptedPaymentId: dateToNo,
        mihpayid: '',
        paymentMode: '',
        payuMoneyId: '',
      };

      let finalData = {
        dataPay: dataPay,
        userToken: userData.token,
      };
      dispatch(proceedToPayment(finalData))
        .unwrap()
        .then(response => {
          dispatch(setPageLoading(false));
          if (response.data.status === 'success') {
            navigation.navigate('ActionStatus', {
              messageStatus: 'success',
              messageTitle: 'Congratulations!',
              messageDesc: response.data.error_message.message,
              timeOut: 7000,
              backRoute: 'Dashboard'//response.data.data.purchase_type==='R'? 'Dashboard': 'CourseDetail',
            });
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
    }
  };

  const handleResponse = (data: any) => {
    if (data.title === 'success') {
      dispatch(setPageLoading(true));
      var regex = /[?&]([^=#]+)=([^&#]*)/g,
        urlParams: any = {},
        match;
      while ((match = regex.exec(data.url))) {
        urlParams[match[1]] = match[2];
      }
      let dataPay = {
        course: checkoutDataDetails.course.id,
        checkout_id: checkoutDataDetails.id,
        number_of_class: checkoutDataDetails.number_of_class,
        paid_ammount: checkoutDataDetails.amount.pay_amount,
        error_code: data.title === 'success' ? 'SUCCESS' : 'CANCELLED',
        error_msg:
          data.title === 'success'
            ? 'Your payment was successful'
            : 'You have cancelled the payment.',
        pay_status: 'S',
        payerid: urlParams['PayerID'],
        paymentid: urlParams['paymentId'],
        paymenttoken: urlParams['token'],
        returnurl: '',
        timezone: userData.timezone,
        split_info: '',
        merchantTransactionId: '',
        additionalCharges: '',
        notificationId: '',
        productInfo: '',
        pg_type: '',
        payment_addedon: '',
        bank_ref_num: '',
        bankcode: '',
        cardToken: '',
        cardnum: '',
        discount: '',
        customeremail: '',
        encryptedPaymentId: '',
        mihpayid: '',
        paymentMode: '',
        payuMoneyId: '',
      };
      setShowModal(false);
      setStatus('Complete');

      let finalData = {
        dataPay: dataPay,
        userToken: userData.token,
      };

      dispatch(proceedToPayment(finalData))
        .unwrap()
        .then(response => {
          dispatch(setPageLoading(false));
          if (response.data.status === 'success') {
            navigation.navigate('ActionStatus', {
              messageStatus: 'success',
              messageTitle: 'Congratulations!',
              messageDesc: response.data.error_message.message,
              timeOut: 7000,
              backRoute: 'Dashboard',
            });
          } else if (response.data.status === 'failure') {
            Alert.alert('', response.data.error_message.message, [
              {text: 'Okay', style: 'cancel'},
            ]);
          }
        })
        .catch(error => {
          dispatch(setPageLoading(false));
          navigation.navigate('ActionStatus', {
            messageStatus: 'failure',
            messageTitle: 'Sorry!',
            messageDesc: config.messages.common_error,
            timeOut: 7000,
            backRoute: 'Dashboard',
          });
        });
    } else if (data.title === 'cancel') {
      setShowModal(false);
      setStatus('Cancelled');
    } else {
      return;
    }
  };

  return (
    <>
      
<CustomStatusBar/>
      <View style={styles.container}>
        {pageLoading ? (
          <PageLoader />
        ) : (
          <View>

            <HeaderInner
        title={'Review Order'}
        type={'findCourse'}
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
         <CustomImage
              style={StyleCSS.styles.formFillTimeImage}
              uri={`${config.media_url}transactions_bg.png`}/>
         <View style={StyleCSS.styles.formFillTimeTextWrapper}>
              <Text style={StyleCSS.styles.formFillTimeText}>
            Should take less than 48 seconds
          </Text>
        </View>
      </View>
            {/* <HeaderInner
              iconTop={this.iconTop}
              changingHeight={this.changingHeight}
              titleSize={this.titleSize}
              titleTop={this.titleTop}
              titleLeft={this.titleLeft}
              title={"Review Order"}
              backRoute={"BillingAddress"}
              navigation={this.props.navigation}
              type={"innerpage"}
            /> */}
            <ScrollView
               style={styles.scrollView}
              scrollEventThrottle={16}
              // onScroll={Animated.event(
              //   [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
              //   { useNativeDriver: false }
              // )}
            >
              <View style={[styles.stepIndicator]}>
                <StepIndicator
                  customStyles={stepIndicatorStyles}
                  stepCount={4}
                  direction="horizontal"
                  currentPosition={currentPage}
                />
              </View>
              {checkoutDataDetails.purchase_type==='N' ?
              <View style={[{marginHorizontal:16, marginTop:16}]}>
                <Text style={styles.title}>Your selected slots</Text>
                        <Text style={[{marginTop:16}, StyleCSS.styles.labelText]}>Timings are based on your timezone - {timezone && timezone.filter((i: any) => i.value === userData.timezone)[0].label}</Text>
                       <View style={StyleCSS.styles.marginV16}>
                         <LineDashed/>
                        {Object.entries(teacherAvailability).map((day: any)=>{
                         return (day[1].length>0 ? (
                           <View style={[StyleCSS.styles.fdrCenter,{marginTop:16}]}><Text style={[StyleCSS.styles.labelText,{textTransform:'capitalize'}]}>{day[0]} : </Text><Text >{day[1].map((time:string, index:number) =>{
                             return( index === day[1].length-1 ? <Text style={StyleCSS.styles.contentText}>{time}</Text> : <Text style={StyleCSS.styles.contentText}>{time}, </Text>)
                           })}</Text></View>
                         ) : null)
                        })}
                       </View>
                       <View style={[StyleCSS.styles.lineStyleLight, {marginTop:8}]}/>
                        </View>:null}
              <View style={styles.headingWrapper}>
                <Text style={styles.title}>Purchase Details</Text>
              </View>

              <View style={styles.courseGenDetailsWrapper}>
                <Text style={styles.grey_items}>Course</Text>
                <Text style={styles.courseName}>
                  {checkoutDataDetails.course.title}
                  {checkoutDataDetails.class_type.members === '1' ? (
                    <Text style={styles.courseName}>(1-on-1 Class)</Text>
                  ) : (
                    <Text style={styles.courseName}>
                      ({checkoutDataDetails.class_type.members} Members)
                    </Text>
                  )}
                </Text>
                <View style={{marginVertical: 16}}>
                  <DashedLine
                    dashLength={5}
                    dashThickness={1}
                    dashGap={5}
                    dashColor={lineColor}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '50%'}}>
                    <Text style={styles.grey_items}>Cost Per Class</Text>
                    <Text style={styles.grey_items_value}>
                      {checkoutDataDetails.amount.currency_type === 'INR'
                        ? '₹ '
                        : 'US $'}
                      {checkoutDataDetails.amount.price_per_class}
                    </Text>
                  </View>
                  <View style={{width: '50%'}}>
                    <Text style={styles.grey_items}>Number of Classes</Text>
                    <Text style={styles.grey_items_value}>
                      {checkoutDataDetails.amount.number_of_class}
                    </Text>
                  </View>
                </View>

                <View style={{marginVertical: 16}}>
                  <DashedLine
                    dashLength={5}
                    dashThickness={1}
                    dashGap={5}
                    dashColor={lineColor}
                  />
                </View>

                <View style={StyleCSS.styles.flexDirRow}>
                  <View style={{width: '50%'}}>
                    <Text style={styles.grey_items}>Classes per week</Text>
                    <Text style={styles.grey_items_value}>
                      {checkoutDataDetails.amount.classes_per_week}
                    </Text>
                  </View>

                  <View style={{width: '50%'}}>
                    <Text style={styles.grey_items}>
                      Number of Weeks (to purchase for)
                    </Text>
                    <Text style={styles.grey_items_value}>
                      {checkoutDataDetails.amount.number_of_weeks}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.priceSection}>
                <View style={{padding: 16}}>
                <View>
                  <Text style={styles.noteText}>
                    <Text style={{color: font1}}> Note:</Text> This total price
                    includes handling charges
                  </Text>
                  <Text style={styles.noteText}>
                    plus 18% GST, if applicable.
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

                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View style={{width: '100%'}}>
                    <View style={styles.priceDetails}>
                      <View style={styles.priceLabelWrapper}>
                        <Text style={styles.labelText}>Actual Price</Text>
                        <Text style={styles.labelText}>:</Text>
                      </View>
                      <Text style={[styles.contentText]}>
                        {checkoutDataDetails.amount.currency_type === 'INR'
                          ? '₹ '
                          : 'US $'}
                        {checkoutDataDetails.amount.total_amount}
                      </Text>
                    </View>
                    {checkoutDataDetails.amount.coupon_discount_amount !==
                      '0.00' && (
                      <View style={styles.priceDetails}>
                        <View style={styles.priceLabelWrapper}>
                          <Text style={styles.labelText}>
                            Discount{' '}
                            {checkoutDataDetails.amount.percentage
                              ? checkoutDataDetails.amount.percentage + '%'
                              : 'Amount'}
                          </Text>
                          <Text style={styles.labelText}>:</Text>
                        </View>
                        <Text style={styles.priceSectionTextGrey}>
                          {' - '}
                          {checkoutDataDetails.amount.currency_type === 'INR'
                            ? '₹ '
                            : 'US $'}
                          {checkoutDataDetails.amount.coupon_discount_amount}
                        </Text>
                      </View>
                    )}
                    {checkoutDataDetails.amount.coupon_discount_amount !==
                      '0.00' && (
                      <View style={styles.priceDetails}>
                        <View style={styles.priceLabelWrapper}>
                          <Text style={styles.labelText}>
                            Price After Discount
                          </Text>
                          <Text style={styles.labelText}>:</Text>
                        </View>
                        <Text style={[styles.contentText]}>
                          {checkoutDataDetails.amount.currency_type === 'INR'
                            ? '₹ '
                            : 'US $'}
                          {getDiscountAmount(checkoutDataDetails.amount)}
                        </Text>
                      </View>
                    )}

                    {checkoutDataDetails.cgst_applied && (
                      <View style={styles.priceDetails}>
                        <View style={styles.priceLabelWrapper}>
                          <Text style={styles.labelText}>
                            CGST ({checkoutDataDetails.amount.cgst}%)
                          </Text>
                          <Text style={styles.labelText}>:</Text>
                        </View>
                        <Text style={[styles.contentText]}>
                          {checkoutDataDetails.amount.currency_type === 'INR'
                            ? '₹ '
                            : 'US $'}
                          {checkoutDataDetails.amount.cgst_amount}
                        </Text>
                      </View>
                    )}
                    {checkoutDataDetails.sgst_applied && (
                      <View style={styles.priceDetails}>
                        <View style={styles.priceLabelWrapper}>
                          <Text style={styles.labelText}>
                            SGST ({checkoutDataDetails.amount.sgst}%)
                          </Text>
                          <Text style={styles.labelText}>:</Text>
                        </View>
                        <Text style={[styles.contentText]}>
                          {checkoutDataDetails.amount.currency_type === 'INR'
                            ? '₹ '
                            : 'US $'}
                          {checkoutDataDetails.amount.sgst_amount}
                        </Text>
                      </View>
                    )}
                    {checkoutDataDetails.igst_applied && (
                      <View style={styles.priceDetails}>
                        <View style={styles.priceLabelWrapper}>
                          <Text style={styles.labelText}>
                            IGST ({checkoutDataDetails.amount.igst}%)
                          </Text>
                          <Text style={styles.labelText}>:</Text>
                        </View>
                        <Text style={[styles.contentText]}>
                          {checkoutDataDetails.amount.currency_type === 'INR'
                            ? '₹ '
                            : 'US $'}
                          {checkoutDataDetails.amount.igst_amount}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={{marginBottom: 16}}>
                  <DashedLine
                    dashLength={5}
                    dashThickness={1}
                    dashGap={5}
                    dashColor={lineColor}
                  />
                </View>
                <View style={styles.priceDetails}>
                  <View style={styles.priceLabelWrapper}>
                    <Text style={styles.totalDueText}>Total Due</Text>
                    <Text style={styles.totalDueText}>:</Text>
                  </View>
                  <Text style={[styles.totalDueInfo]}>
                    {checkoutDataDetails.amount.currency_type === 'INR'
                      ? '₹ '
                      : 'US $'}
                    {checkoutDataDetails.amount.pay_amount}
                  </Text>
                </View>
              </View>
              </View>
              <View>
                <View style={{width:'100%', marginHorizontal:16,top:-6}}>
                <CustomImage
                        style={styles.purchaseDot}
                        uri={`${config.media_url}purchase_dot.png`}/>
                  {/* <Image
                    source={require('@images/purchase_dot.png')}
                    style={{width: '100%', height: 16, marginHorizontal: -16}}
                  /> */}
                </View>
              </View>

              <View style={{marginTop:-8}}>
                <View style={[styles.titleBorder, styles.safecontainer24]}>
                  <Text style={styles.title}>Billing Address</Text>
                </View>
                <View style={styles.safecontainer20}>
                  <Text style={[styles.contentText, {fontWeight:'600'}]}>
                    {checkoutDataDetails.billing_first_name}{' '}
                    {checkoutDataDetails.billing_last_name},
                  </Text>
                  <Text style={styles.grey_items}>
                    {checkoutDataDetails.billing_street_address},
                  </Text>
                  <Text style={styles.grey_items}>
                    {checkoutDataDetails.billing_city}
                  </Text>
                  <Text style={styles.grey_items}>
                    {checkoutDataDetails.billing_state +
                      ' ' +
                      checkoutDataDetails.billing_pin_code}
                  </Text>
                  <Text style={styles.grey_items}>
                    {checkoutDataDetails.billing_country}
                  </Text>
                </View>
                {checkoutDataDetails.order_comments ? (
                <View>
                  <View style={[styles.safecontainer24,{marginBottom:4, marginTop:16}]}>
                    <Text style={[styles.contentText,{fontWeight:'600'}]}>Order Comment</Text>
                  </View>
                  <View style={styles.safecontainer20}>
                    <Text style={styles.grey_items}>
                      {checkoutDataDetails.order_comments}
                    </Text>
                  </View>
                </View>
              ) : null}
              </View>

              <View style={styles.userEmail}>
                <Text style={[styles.black_items, {fontWeight:'700'}]}>{userData.email}</Text>
                <Text style={styles.orderInfo}>
                  (Order information will be sent to your account e-mail.)
                </Text>
              </View>

             

              <View>
                <View style={[styles.titleBorder, styles.safecontainer24]}>
                  <Text style={styles.title}>Payment Method</Text>
                </View>
                <View style={styles.safecontainer20}>
                  <Text style={styles.black_item}>
                    {checkoutDataDetails.payment_gateway === 'PU' && 'Pay U'}
                    {checkoutDataDetails.payment_gateway === 'PP' && 'Paypal'}
                    {checkoutDataDetails.payment_gateway === 'PPU' &&
                      'Paypal USA'}
                  </Text>
                  <Text style={styles.grey_items_small}>
                    {checkoutDataDetails.payment_gateway === 'PU' &&
                      'PayU Money supports all Debit cards, Credit cards and Net Banking options. On the next page, after you click Pay Now securely button, you will be taken to PayU money website,where you will be asked to enter your Card or Net banking details.'}
                    {(checkoutDataDetails.payment_gateway === 'PP' ||
                      checkoutDataDetails.payment_gateway === 'PPU') &&
                      'Pay easily , fast and secure with paypal.'}
                  </Text>
                  <CustomImage
                        style={styles.paymentGatewayCards}
                        uri={`${config.media_url}payment_gateway_cards.png`}/>
                  {/* <Image
                    style={{
                      width: '70%',
                      height: 24,
                      marginTop: 14,
                    }}
                    source={require('@images/payment_gateway_cards.png')}
                  /> */}
                </View>
              </View>
<View style={[StyleCSS.styles.lineStyleLight, {marginTop:24}]}></View>
              <View
                style={StyleCSS.styles.modalButton}>
              
                  <TouchableOpacity
                    style={StyleCSS.styles.cancelButton}
                    onPress={() => navigation.navigate('BillingAddress')}>
                    <Text style={StyleCSS.styles.cancelButtonText}>Back</Text>
                  </TouchableOpacity>
                 

                <View style={{width: '100%'}}>
                  {checkoutDataDetails.amount.pay_amount === '0.00' && (
                    <TouchableOpacity
                      style={StyleCSS.styles.submitButton}
                      onPress={() => proceedPayment('DISCOUNT')}>
                      <Text style={StyleCSS.styles.submitButtonText}>
                        Complete Checkout
                      </Text>
                    </TouchableOpacity>
                  )}
                  {checkoutDataDetails.amount.pay_amount != '0.00' && (
                    <>
                      {checkoutDataDetails.payment_gateway === 'PU' && (
                        <TouchableOpacity
                          style={StyleCSS.styles.submitButton}
                          onPress={() => proceedGatewayPayment()}>
                          <Text style={StyleCSS.styles.submitButtonText}>
                            Pay Now Securely
                          </Text>
                        </TouchableOpacity>
                      )}
                      {checkoutDataDetails.payment_gateway === 'PP' && (
                        <TouchableOpacity
                          style={StyleCSS.styles.submitButton}
                          onPress={() => proceedGatewayPayment()}>
                          <Text style={StyleCSS.styles.submitButtonText}>
                          Pay Now Securely
                          </Text>
                        </TouchableOpacity>
                      )}
                      {checkoutDataDetails.payment_gateway === 'PPU' && (
                        <TouchableOpacity
                          style={StyleCSS.styles.submitButton}
                          onPress={() => proceedGatewayPayment()}>
                          <Text style={StyleCSS.styles.submitButtonText}>
                          Pay Now Securely
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </View>
              </View>
              {/* <View style={{height: 50}}></View> */}
              <View style={{marginTop: 0}}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={showModal}
                  onRequestClose={() => setShowModal(false)}>
                  <View
                    style={{
                      backgroundColor: 'rgb(232, 67, 53)',
                      padding: 16,
                      flexDirection: 'row',
                      flex: 1,
                      position: 'absolute',
                      top: Platform.OS === 'ios' ? 40 : 0,
                      left: 0,
                      right: 0,
                      height: 56,
                      alignContent: 'center',
                      zIndex: 999,
                    }}>
                    <Pressable
                      style={{marginTop: 4}}
                      onPress={() => setShowModal(false)}>
                        <CustomImage
                        style={styles.leftArrow}
                        uri={`${config.media_url}left_arrow.png`}/>
                 
                      
                    </Pressable>
                    <View style={{flex: 1, marginTop: -6, marginLeft: 12}}>
                      <Text style={styles.innerHeaderTitle}>
                        Continue to pay
                      </Text>
                    </View>
                  </View>
                  <WebView
                    cacheEnabled={false}
                    style={{marginTop: 50}}
                    source={{
                      uri: config.NodeBaseURL + paymentURL + reqData,
                    }}
                    onNavigationStateChange={event => {
                      handleResponse(event);
                    }}
                    javaScriptEnabled={true}
                  />
                </Modal>
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </>
  );
};

export default Review;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    // 
  },
  scrollView:{
    marginTop: config.headerHeight + 32,
  },
  stepIndicator: {
    paddingHorizontal: 0,
    marginTop: 16,
  },

  headingWrapper: {
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 16,
  },
  courseGenDetailsWrapper: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  courseName: {
    fontSize: 14,
    marginTop: 5,
    color: font1,
    fontWeight: '600',
    fontFamily: Helper.switchFont('semibold'),
  },
  rowItem: {
    flex: 1,
    paddingVertical: 0,
  },
  titleBorder: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    margin: 0,
    color: font1,
    fontWeight: '700',
    fontFamily: helper.switchFont('medium'),
  },
  totalDueInfo: {
    fontSize: 18,
    color: font1,
    fontFamily: Helper.switchFont('semibold'),
    fontWeight: '600',
  },
  safecontainer24: {
    marginLeft: 16,
    marginRight: 16,
  },
  safecontainer20: {paddingLeft: 16, paddingRight: 16},
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
    marginVertical: 24,
  },
  lineStyleDark: {
    borderWidth: 0.5,
    borderColor: '#d5d5d5',
    marginVertical: 24,
  },
  lineStyle2: {
    borderWidth: 1.0,
    borderColor: '#D4D5D6',
    top: 5,
    width: '88%',
    marginLeft: 18,
    marginRight: 18,
  },
  lineStyle3: {
    borderWidth: 1.0,
    borderColor: '#D4D5D6',
    top: 30,
    width: '88%',
    margin: 18,
  },
  contentText: {
    fontSize: 14,
    fontWeight: '500',
    color: font1,
    fontFamily: helper.switchFont('medium'),
  },
  lineStyle4: {
    borderWidth: 1.0,
    borderColor: '#E2E4E5',
    top: 340,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
  },
  grey_items: {
    fontSize: 14,
    color: font2,
    fontWeight: '500',
    lineHeight:20,
    fontFamily: Helper.switchFont('medium'),
  },
  grey_items_value: {
    fontSize: 14,
    color: font1,
    fontFamily: helper.switchFont('medium'),
    marginTop: 5,
  },
  black_item: {
    fontSize: 16,
    fontWeight:'600',
    color: font1,
    fontFamily: helper.switchFont('semibold'),
  },
  black_items: {
    
    fontSize: 14,
    lineHeight: 21,
    color: 'rgb(44, 54, 65)',
    fontFamily: helper.switchFont('medium'),
  },
  grey_items_small: {
    marginTop:8,
    fontSize: 12,
    color: font2,
    lineHeight: 20,
    fontWeight:'500',
    fontFamily: helper.switchFont('medium'),
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    resizeMode: 'cover',
    flexDirection: 'row',
    marginTop: -100,
  },
  labelText: {
    fontSize: 14,
    color: font2,
    fontFamily: helper.switchFont('medium'),
    marginTop: 0,
  },
  buttonStyle: {
    borderRadius: 0,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: 'rgb(232, 67, 53)',
  },
  textStyle: {
    textAlign: 'right',
    color: 'rgb(225, 225, 225)',
    fontSize: 16,
    fontFamily: helper.switchFont('bold'),
  },
  innerHeaderTitle: {
    color: 'rgb(255, 255, 255)',
    fontSize: 20,
    fontFamily: helper.switchFont('medium'),
  },
  priceSection: {
    backgroundColor: '#F1F4F6',
    marginTop: 16,
    // padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  noteText: {
    fontSize: 12,
    color: font2,
    fontWeight: '500',
    lineHeight: 20,
    fontFamily: Helper.switchFont('medium'),
  },
  row_content: {
    color: 'rgb(44, 54, 65)',
    fontSize: 14,
    fontFamily: Helper.switchFont('medium'),
  },
  discountSection: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 16,
    alignSelf: 'flex-end',
  },
  priceDetails: {
    flex: 1,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  discount: {
    fontSize: 14,
    color: '#81878D',
    fontFamily: Helper.switchFont('regular'),
  },
  priceSectionTextGrey: {
    fontSize: 14,
    color: 'rgb(44, 54, 65)',
    fontFamily: Helper.switchFont('regular'),
    paddingLeft: 5,
  },
  totalDueText: {
    fontSize: 14,
    color: font1,
    fontFamily: Helper.switchFont('semibold'),
    fontWeight: '600',
  },
  brandColorText: {
    color: brandColor,
  },
  userEmail: {
    backgroundColor: '#F1F4F6',
    padding: 16,
    marginHorizontal:16,
    marginTop: 24,
    marginBottom:8,
    borderRadius:12
  },
  orderInfo: {
    fontSize: 12,
    color: font2,
    fontFamily: Helper.switchFont('regular'),
    lineHeight:20
  },
  backButton: {
    padding: 12,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: 'rgb(255, 255, 255)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    alignSelf: 'flex-end',
    zIndex: 1,
    width: '100%',
    borderWidth: 0.5,
    borderColor: 'rgb(224, 224, 224)',
  },
  backButtonText: {
    color: 'rgb(108, 108, 108)',
    textAlign: 'center',
    fontSize: 12,
    fontFamily: Helper.switchFont('medium'),
  },
  completeCheckoutButton: {
    padding: 12,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: brandColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    alignSelf: 'flex-end',
    zIndex: 1,
    width: '100%',
  },
  completeCheckoutButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: Helper.switchFont('medium'),
    fontSize: 12,
  },
  payNowButton: {
    padding: 12,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: brandColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    alignSelf: 'flex-end',
    zIndex: 1,
    width: '100%',
  },
  payNowButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: Helper.switchFont('medium'),
    fontSize: 12,
  },
  priceLabelWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
  purchaseDot:{width: '100%', height: 16, marginHorizontal: -16},
  paymentGatewayCards:{
    width: '70%',
    height: 24,
    marginTop: 14,
  },
  leftArrow:{
    width: 23,
    height: 18,
    alignItems: 'center',
    marginLeft: 12,
  }

});
