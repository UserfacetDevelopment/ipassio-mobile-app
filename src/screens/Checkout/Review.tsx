import React, {useState, FC, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
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
import {checkoutState, proceedToPayment} from '../../reducers/checkout.slice';
import StepIndicator from 'react-native-step-indicator';
import PageLoader from '../../components/PageLoader';
import {WebView} from 'react-native-webview';
import {stepIndicatorStyles} from './CartPage';
import {userState} from '../../reducers/user.slice';
import helper from '../../utils/helperMethods';
import {loaderState, setPageLoading} from '../../reducers/loader.slice';
import Helper from '../../utils/helperMethods';
import {brandColor} from '../../styles/colors';
import StyleCSS from '../../styles/style';
import { useAppDispatch } from '../../app/store';
import config from '../../config/Config';
import axios from 'axios';
import HeaderInner from '../../components/HeaderInner';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

type Props = NativeStackScreenProps<RootParamList, 'Review'>;

type PayType = "DISCOUNT";
type PaymentStatus= "Pending"|"Complete"|"Cancelled";

const Review: FC<Props> = ({navigation}) => {

  const currentPage = 3;
  const dispatch= useAppDispatch();
  const {checkoutDataDetails} = useSelector(checkoutState);
  const {userData} = useSelector(userState);
  const {pageLoading} = useSelector(loaderState);
  const [showModal, setShowModal] = useState(false);
  const [reqData, setReqData] = useState("");
  const [paymentURL, setPaymentURL] = useState("");
  const [status, setStatus] = useState<PaymentStatus>('Pending');
  
  let scrollY;

  useEffect(() => {}, []);

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
    let gatewayURL = "";

    if (
      checkoutDataDetails.payment_gateway === "PP" ||
      checkoutDataDetails.payment_gateway === "PPU"
    ) {
      gatewayURL = "paypal_view?data=";
    } else if (checkoutDataDetails.payment_gateway === "PU") {
      gatewayURL = "payumoney_view?data=";
    }

    if (
      checkoutDataDetails.payment_gateway === "PU" ||
      checkoutDataDetails.payment_gateway === "PP" ||
      checkoutDataDetails.payment_gateway === "PPU"
    ) {
      reqGatewayData = {
        prodInfo: finalData.course.title.replace(/[^a-zA-Z]/g, ""),
        pay_amount: parseFloat(finalData.amount.pay_amount.replace(/,/g, "")),
        first_name: finalData.billing_first_name.replace(/[^a-zA-Z]/g, ""),
        email_id: userData.email,
        mobile_no: userData.phone_number,
        paymentType: checkoutDataDetails.payment_gateway,
      };

      setShowModal(true);
      setReqData(JSON.stringify(reqGatewayData));
      setPaymentURL(gatewayURL)
    }
  };


  const proceedPayment = (payType:PayType) => {
    dispatch(setPageLoading(true))
    setShowModal(true);
    let finalData = checkoutDataDetails;
    let finalPay = finalData.amount.pay_amount;
    finalData.amount.pay_amount = finalPay.replace(/,/g, "");
  
    if (payType === "DISCOUNT") {
      var date = new Date();
      var dateToNo = userData.id + date.getTime() + "I-PAY";
      let dataPay = {
        course: checkoutDataDetails.course.id,
        checkout_id: checkoutDataDetails.id,
        number_of_class: checkoutDataDetails.amount.number_of_class,
        paid_ammount: checkoutDataDetails.amount.pay_amount,
        error_code: "SUCCESS",
        error_msg: "100% discount transaction",
        pay_status: "S",
        payerid: userData.user_token,
        paymentid: dateToNo,
        paymenttoken: dateToNo,
        returnurl: "",
        timezone: userData.timezone,
        split_info: "",
        merchantTransactionId: "",
        additionalCharges: "",
        notificationId: "",
        productInfo: "",
        pg_type: "",
        payment_addedon: "",
        bank_ref_num: "",
        bankcode: "",
        cardToken: "",
        cardnum: "",
        discount: checkoutDataDetails.amount.discount_amount,
        customeremail: userData.email,
        encryptedPaymentId: dateToNo,
        mihpayid: "",
        paymentMode: "",
        payuMoneyId: "",
      };
  
      let finalData = {
        dataPay: dataPay,
        userToken: userData.token
      }
      dispatch(proceedToPayment(finalData))
      .unwrap()
        .then((response) => {
          dispatch(setPageLoading(false))
          if (response.data.status === "success") {
            navigation.navigate("ActionStatus", {
              messageStatus: "",
              messageTitle: "Congratulations!",
              messageDesc: response.data.error_message.message,
              timeOut: 4000,
              backRoute: 'DashboardPage',
            });
          } else if (response.data.status === "failure") {
            Alert.alert("", response.data.error_message.message, [
              { text: "Okay", style: "cancel" },
            ]);
          }
        })
        .catch((error) => {
          dispatch(setPageLoading(false))
          Alert.alert("", config.messages.common_error, [
            { text: "Okay", style: "cancel" },
          ]);
        });
    }
  };

  const handleResponse = (data: any) => {
    if (data.title === "success") {
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
        error_code: data.title === "success" ? "SUCCESS" : "CANCELLED",
        error_msg:
          data.title === "success"
            ? "Your payment was successful"
            : "You have cancelled the payment.",
        pay_status: "S",
        payerid: urlParams["PayerID"],
        paymentid: urlParams["paymentId"],
        paymenttoken: urlParams["token"],
        returnurl: "",
        timezone: userData.timezone,
        split_info: "",
        merchantTransactionId: "",
        additionalCharges: "",
        notificationId: "",
        productInfo: "",
        pg_type: "",
        payment_addedon: "",
        bank_ref_num: "",
        bankcode: "",
        cardToken: "",
        cardnum: "",
        discount: "",
        customeremail: "",
        encryptedPaymentId: "",
        mihpayid: "",
        paymentMode: "",
        payuMoneyId: "",
      };
      setShowModal(false);
      setStatus('Complete');

      let finalData = {
        dataPay: dataPay,
        userToken: userData.token
      }

      dispatch(proceedToPayment(finalData))
      .unwrap()
        .then((response) => {
          dispatch(setPageLoading(false));
          if (response.data.status === "success") {
            navigation.navigate("ActionStatus", {
              messageStatus: "success",
              messageTitle: "Congratulations!",
              messageDesc: response.data.error_message.message,
              timeOut: 4000,
              backRoute: 'DashboardPage',
            });
          } else if (response.data.status === "failure") {
            Alert.alert("", response.data.error_message.message, [
              { text: "Okay", style: "cancel" },
            ]);
          }
        })
        .catch((error) => {
      dispatch(setPageLoading(false));
          navigation.navigate("ActionStatus", {
            messageStatus: "",
            messageTitle: "Sorry!",
            messageDesc: config.messages.common_error,
            timeOut: 4000,
            backRoute: 'DashboardPage'
          });
        });
    } else if (data.title === "cancel") {
      setShowModal(false);
      setStatus('Cancelled');    
    } else {
      return;
    }
  };

  console.log(checkoutDataDetails);
  return (
    <>
    <HeaderInner
      type={'findCourse'}
      back={true}
      navigation={navigation}
      title={"Review "}
      />
   
    <View style={styles.container}>
      {pageLoading ? (
        <PageLoader />
      ) : (
        <View>
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
            style={{marginTop: 20}}
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

            <View style={styles.headingWrapper}>
              <Text style={styles.title}>Purchase Details</Text>
            </View>

            <View style={styles.courseGenDetailsWrapper}>
              <Text style={styles.courseName}>
                {checkoutDataDetails.course.title}
                {checkoutDataDetails.class_type.members === '1' ? (
                  <Text style={styles.row_content}>(1-on-1 Class)</Text>
                ) : (
                  <Text style={styles.row_content}>
                    ({checkoutDataDetails.class_type.members} Members)
                  </Text>
                )}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '50%', marginTop: 12}}>
                  <Text style={styles.grey_items}>Cost Per Class</Text>
                  <Text style={styles.grey_items_value}>
                    {checkoutDataDetails.amount.currency_type === 'INR'
                      ? 'Rs.'
                      : 'US$ '}
                    {checkoutDataDetails.amount.price_per_class}
                  </Text>
                </View>
                <View style={{width: '50%', marginTop: 12}}>
                  <Text style={styles.grey_items}>Number of Classes</Text>
                  <Text style={styles.grey_items_value}>
                    {checkoutDataDetails.amount.number_of_class}
                  </Text>
                </View>
              </View>

              <View style={styles.lineStyle} />

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
              <View>
                <Text style={styles.noteText}>
                  Note:- This total price includes handling charges plus 18%
                  GST, if applicable.
                </Text>
              </View>

              <View style={styles.lineStyleDark} />

              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: -12,
                }}>
                <View style={{width: '100%'}}>
                  <View style={styles.priceDetails}>
                    <Text style={styles.labelText}>Actual Price: </Text>
                    <Text style={[styles.contentText, {paddingLeft: 5}]}>
                      {checkoutDataDetails.amount.currency_type === 'INR'
                        ? 'Rs.'
                        : 'US$ '}
                      {checkoutDataDetails.amount.total_amount}
                    </Text>
                  </View>
                  {checkoutDataDetails.amount.coupon_discount_amount !==
                    '0.00' && (
                    <View style={styles.discountSection}>
                      <Text style={styles.discount}>
                        Discount{' '}
                        {checkoutDataDetails.amount.percentage
                          ? checkoutDataDetails.amount.percentage + '%'
                          : 'Amount'}
                        :
                      </Text>
                      <Text style={styles.priceSectionTextGrey}>
                        {' - '}
                        {checkoutDataDetails.amount.currency_type === 'INR'
                          ? 'Rs.'
                          : 'US$ '}
                        {checkoutDataDetails.amount.coupon_discount_amount}
                      </Text>
                    </View>
                  )}
                  {checkoutDataDetails.amount.coupon_discount_amount !==
                    '0.00' && (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginBottom: 12,
                        alignSelf: 'flex-end',
                      }}>
                      <Text style={styles.priceSectionTextGrey}>
                        Price After Discount:
                      </Text>
                      <Text style={[styles.contentText, {paddingLeft: 5}]}>
                        {checkoutDataDetails.amount.currency_type === 'INR'
                          ? 'Rs.'
                          : 'US$ '}
                        {getDiscountAmount(
                            checkoutDataDetails.amount
                          )}
                      </Text>
                    </View>
                  )}

                  {checkoutDataDetails.cgst_applied && (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginBottom: 12,
                        alignSelf: 'flex-end',
                      }}>
                      <Text style={styles.priceSectionTextGrey}>
                        CGST ({checkoutDataDetails.amount.cgst}%):
                      </Text>
                      <Text style={[styles.contentText, {paddingLeft: 5}]}>
                        {checkoutDataDetails.amount.currency_type === 'INR'
                          ? 'Rs.'
                          : 'US$ '}
                        {checkoutDataDetails.amount.cgst_amount}
                      </Text>
                    </View>
                  )}
                  {checkoutDataDetails.sgst_applied && (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginBottom: 12,
                        alignSelf: 'flex-end',
                      }}>
                      <Text style={styles.priceSectionTextGrey}>
                        SGST ({checkoutDataDetails.amount.sgst}%):
                      </Text>
                      <Text style={[styles.contentText, {paddingLeft: 5}]}>
                        {checkoutDataDetails.amount.currency_type === 'INR'
                          ? 'Rs.'
                          : 'US$ '}
                        {checkoutDataDetails.amount.sgst_amount}
                      </Text>
                    </View>
                  )}
                  {checkoutDataDetails.igst_applied && (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginBottom: 12,
                        alignSelf: 'flex-end',
                      }}>
                      <Text style={styles.priceSectionTextGrey}>
                        IGST ({checkoutDataDetails.amount.igst}%):
                      </Text>
                      <Text style={[styles.contentText, {paddingLeft: 5}]}>
                        {checkoutDataDetails.amount.currency_type === 'INR'
                          ? 'Rs.'
                          : 'US$ '}
                        {checkoutDataDetails.amount.igst_amount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.lineStyleDark} />

              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-end',
                }}>
                <View style={{paddingBottom: 8, flexDirection: 'row'}}>
                  <Text style={styles.totalDueText}>Total Due:</Text>
                  <Text style={[styles.totalDueText, styles.brandColorText]}>
                    {checkoutDataDetails.amount.currency_type === 'INR'
                      ? 'Rs.'
                      : 'US$ '}
                    {checkoutDataDetails.amount.pay_amount}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <View style={[styles.titleBorder, styles.safecontainer24]}>
                <Text style={styles.title}>Billing Address</Text>
              </View>
              <View style={styles.safecontainer20}>
                <Text style={styles.black_items}>
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
            </View>

            <View style={styles.userEmail}>
              <Text style={styles.black_items}>{userData.email}</Text>
              <Text style={styles.orderInfo}>
                (Order information will be sent to your account e-mail.)
              </Text>
            </View>

            {checkoutDataDetails.order_comments ? (
              <View>
                <View style={[styles.titleBorder, styles.safecontainer24]}>
                  <Text style={styles.title}>Order Comment</Text>
                </View>
                <View style={styles.safecontainer20}>
                  <Text style={styles.grey_items}>
                    {checkoutDataDetails.order_comments}
                  </Text>
                </View>
              </View>
            ) : null}

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
                <Image
                  style={{
                    width: '70%',
                    height: 24,
                    marginTop: 14,
                  }}
                  source={require('@images/payment_gateway_cards.png')}
                />
              </View>
            </View>

            <View
              style={[
                StyleCSS.styles.flexDirRow,
                styles.safecontainer24,
                {marginTop: 24},
              ]}>
              <View style={{borderRadius: 5, width: '35%'}}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.navigate('BillingAddress')}>
                  <Text style={styles.backButtonText}>BACK</Text>
                </TouchableOpacity>
              </View>

              <View style={{width: '65%', marginLeft: 10}}>
                {checkoutDataDetails.amount.pay_amount === '0.00' && (
                  <TouchableOpacity
                    style={styles.completeCheckoutButton}
                    onPress={() => proceedPayment("DISCOUNT")}
                  >
                    <Text style={styles.completeCheckoutButtonText}>
                      COMPLETE CHECKOUT
                    </Text>
                  </TouchableOpacity>
                )}
                {checkoutDataDetails.amount.pay_amount != '0.00' && (
                  <>
                    {checkoutDataDetails.payment_gateway === 'PU' && (
                      <TouchableOpacity
                        style={styles.payNowButton}
                        onPress={() => proceedGatewayPayment()}
                      >
                        <Text style={styles.payNowButtonText}>
                          PAY NOW SECURELY
                        </Text>
                      </TouchableOpacity>
                    )}
                    {checkoutDataDetails.payment_gateway === 'PP' && (
                      <TouchableOpacity
                        style={styles.payNowButton}
                        onPress={() => proceedGatewayPayment()}
                      >
                        <Text style={styles.payNowButtonText}>
                          PAY NOW SECURELY
                        </Text>
                      </TouchableOpacity>
                    )}
                    {checkoutDataDetails.payment_gateway === 'PPU' && (
                      <TouchableOpacity
                        style={styles.payNowButton}
                        onPress={() => proceedGatewayPayment()}
                      >
                        <Text style={styles.payNowButtonText}>
                          PAY NOW SECURELY
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            </View>
            <View style={{height: 50}}></View>
            <View style={{marginTop: 0}}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
              >
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
                    <Image
                      source={require('@images/left_arrow.png')}
                      style={{
                        width: 23,
                        height: 18,
                        alignItems: 'center',
                        marginLeft: 12,
                      }}
                    />
                  </Pressable>
                  <View style={{flex: 1, marginTop: -6, marginLeft: 12}}>
                    <Text style={styles.innerHeaderTitle}>Continue to pay</Text>
                  </View>
                </View>
                <WebView
                    cacheEnabled={false}
                    style={{ marginTop: 50 }}
                    source={{
                      uri:
                        config.NodeBaseURL +
                        paymentURL +
                        reqData,
                    }}
                    onNavigationStateChange={(event) => {
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
    marginTop:109
  },
  stepIndicator: {
    paddingHorizontal: 0,
    marginTop: 12,
  },
  headingWrapper: {
    paddingLeft: 24,
    paddingRight: 24,
    marginTop: 30,
  },
  courseGenDetailsWrapper: {
    paddingLeft: 24,
    paddingRight: 24,
    marginTop: 23,
  },
  courseName: {
    fontSize: 18,
    color: 'rgb(44, 54, 65)',
    fontFamily: Helper.switchFont('medium'),
  },
  rowItem: {
    flex: 1,
    paddingVertical: 0,
  },
  titleBorder: {
    marginTop: 50,
    borderLeftWidth: 2,
    borderLeftColor: brandColor,
    marginBottom: 20,
  },
  title: {
    fontSize: 19,
    margin: 0,
    paddingLeft: 8,
    color: 'rgb(44, 54, 65)',
    fontFamily: helper.switchFont('medium'),
  },
  safecontainer24: {
    marginLeft: 24,
    marginRight: 24,
  },
  safecontainer20: {paddingLeft: 20, paddingRight: 20},
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
    color: 'rgb(44, 54, 65)',
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
    color: '#81878D',
    fontFamily: helper.switchFont('regular'),
    marginTop: 5,
  },
  grey_items_value: {
    fontSize: 14,
    color: 'rgb(44, 54, 65)',
    fontFamily: helper.switchFont('medium'),
    marginTop: 5,
  },
  black_item: {
    fontSize: 16,
    lineHeight: 30,
    color: 'rgb(44, 54, 65)',
    fontFamily: helper.switchFont('medium'),
  },
  black_items: {
    fontSize: 14,
    lineHeight: 21,
    color: 'rgb(44, 54, 65)',
    fontFamily: helper.switchFont('medium'),
  },
  grey_items_small: {
    fontSize: 14,
    color: '#81878D',
    lineHeight: 21,
    fontFamily: helper.switchFont('regular'),
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
    color: 'rgb(44, 54, 65)',
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
    fontFamily: helper.switchFont('regular'),
  },
  innerHeaderTitle: {
    color: 'rgb(255, 255, 255)',
    fontSize: 24,
    fontFamily: helper.switchFont('medium'),
  },
  priceSection: {
    backgroundColor: 'rgb(233, 233, 233)',
    marginTop: 24,
    padding: 24,
  },
  noteText: {
    fontSize: 11,
    color: '#81878D',
    lineHeight: 18,
    fontFamily: Helper.switchFont('regular'),
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
    flexDirection: 'row',
    marginBottom: 12,
    alignSelf: 'flex-end',
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
    fontSize: 16,
    fontFamily: Helper.switchFont('medium'),
    color: 'rgb(44, 45, 65)',
  },
  brandColorText: {
    color: brandColor,
  },
  userEmail: {
    backgroundColor: 'rgb(233, 233, 233)',
    padding: 16,
    marginTop: 30,
  },
  orderInfo: {
    fontSize: 12,
    color: '#81878D',
    fontFamily: Helper.switchFont('regular'),
    marginTop: 4,
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
});
