import React, {FC, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Animated,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import Card from '../../components/Card';
import {RadioButton} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PageLoader from '../../components/PageLoader';
import {stepIndicatorStyles} from './CartPage';
import {useSelector} from 'react-redux';
import {loaderState, setPageLoading} from '../../reducers/loader.slice';
import {brandColor} from '../../styles/colors';
import helper from '.././../utils/helperMethods';
import {checkoutState} from '../../reducers/checkout.slice';
import {useAppDispatch} from '../../app/store';
import {userState} from '../../reducers/user.slice';
import {
  checkoutToNextPage,
  setCheckoutDataDetails,
} from '../../reducers/checkout.slice';
import config from '../../config/Config';
import CustomStatusBar from '../../components/CustomStatusBar';
import HeaderInner from '../../components/HeaderInner';

type PaymentGatewayType = 'PP' | 'PU' | 'PPU' | null;

type Props = NativeStackScreenProps<RootParamList, 'PaymentPage'>;

const Payment: FC<Props> = ({route, navigation}) => {
  const currentPage = 1;
  const dispatch = useAppDispatch();
  const {userData} = useSelector(userState);
  const {pageLoading} = useSelector(loaderState);
  const [selectedPaymentGateway, setSelectedPaymentGateway] =
    useState<PaymentGatewayType>(null);
  const {checkoutDataDetails} = useSelector(checkoutState);
  const checkoutData = checkoutDataDetails;
  console.log(checkoutDataDetails);

  const checkoutNextPage = () => {
    dispatch(setPageLoading(true));
    let finalReviewData = {
      number_of_class: checkoutData.amount.number_of_class,
      classes_per_week: checkoutData.amount.classes_per_week,
      number_of_weeks: checkoutData.amount.number_of_weeks,

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
      payment_gateway: selectedPaymentGateway,
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
          navigation.navigate('BillingAddress');
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

  useEffect(()=>{
    checkoutData.amount.currency_type === 'INR' ? setSelectedPaymentGateway('PU') :  setSelectedPaymentGateway(checkoutData.course.teacher.ip_country_code === 'IN'
  ? 'PP'
  : 'PPU')
  },[])

  return (
    
    <>
      <HeaderInner
      type={'findCourse'}
      back={true}
      navigation={navigation}
      title={"Payment Mode"}
      />
      <View style={styles.container}>
      <CustomStatusBar type={"inside"} />
      {pageLoading ? (
        <PageLoader />
      ) : (
        <SafeAreaView style={styles.safecontainer}>
          {/* <HeaderInner
              iconTop={this.iconTop}
              changingHeight={this.changingHeight}
              titleSize={this.titleSize}
              titleTop={this.titleTop}
              titleLeft={this.titleLeft}
              title={"Checkout"}
              backRoute={"CartPage"}
              navigation={this.props.navigation}
              type={"innerpage"}
            /> */}
          <ScrollView
            style={{height: hp('100%'), paddingBottom: 100}}
            scrollEventThrottle={16}
            // onScroll={Animated.event(
            //   [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            //   { useNativeDriver: false }
            // )}
          >
            <View style={[styles.stepIndicator, {marginTop: 20}]}>
              <StepIndicator
                customStyles={stepIndicatorStyles}
                stepCount={4}
                direction="horizontal"
                currentPosition={currentPage}
              />
            </View>

            <View style={styles.titleBorder}>
              <Text style={styles.title}>Choose Your Payment Mode</Text>
            </View>

            <View>
              {checkoutData.amount.currency_type === 'INR' ? (
                <TouchableOpacity
                  style={styles.paymentModeButton}
                  onPress={() => {
                    setSelectedPaymentGateway('PU');
                  }}>
                  <View style={styles.infoWrapper}>
                    <View style={styles.radioButtonWrapper}>
                      <RadioButton
                        value="first"
                        color="#C3152D"
                        uncheckedColor="#000"
                        status={'checked'}
                        // status={
                        //   this.state.selected_payment_gateway
                        //     ? "checked"
                        //     : "unchecked"
                        // }
                        onPress={() => {
                          setSelectedPaymentGateway('PU');
                        }}
                      />
                    </View>

                    <View style={styles.paymentMethod}>
                      <Text style={styles.paymentMethodText}>Pay U</Text>

                      <Text style={styles.paymentMethodInfoText}>
                        PayU Money supports all Debit cards, Credit cards and
                        Net Banking options. On the next page, after you click
                        Pay Now securely button, you will be taken to PayU money
                        website,where you will be asked to enter your Card or
                        Net banking details.
                      </Text>

                      <Image
                        style={styles.paymentGatewayCards}
                        source={require('@images/payment_gateway_cards.png')}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.paymentModeButton}
                  onPress={() => {
                    setSelectedPaymentGateway(
                      checkoutData.course.teacher.ip_country_code === 'IN'
                        ? 'PP'
                        : 'PPU',
                    );
                  }}>
                  <View style={styles.infoWrapper}>
                    <View style={styles.radioButtonWrapper}>
                      <RadioButton
                        value="first"
                        color="#C3152D"
                        uncheckedColor="#000"
                        status={'checked'}
                        // status={
                        //   this.state.selected_payment_gateway
                        //     ? "checked"
                        //     : "unchecked"
                        // }
                        onPress={() => {
                          setSelectedPaymentGateway(
                            checkoutData.course.teacher.ip_country_code === 'IN'
                              ? 'PP'
                              : 'PPU',
                          );
                        }}
                      />
                    </View>

                    <View style={styles.paymentMethod}>
                      {checkoutData.course.teacher.ip_country_code === 'IN' ? (
                        <Text style={styles.paymentMethodText}>Paypal</Text>
                      ) : (
                        <Text style={styles.paymentMethodText}>Paypal USA</Text>
                      )}

                      <Text style={styles.paymentMethodInfoText}>
                        Pay easily , fast and secure with paypal.
                      </Text>

                      <Image
                        style={styles.paymentGatewayCards}
                        source={require('@images/payment_gateway_cards.png')}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.lineStyle} />

            <Text style={styles.paymentStepInfo}>
              This is Step 2 of 4. In the next page you can review your order
              and product information
            </Text>

            <TouchableOpacity
              style={styles.nextPageButton}
              onPress={() => checkoutNextPage()}>
              <Image
                source={require('@images/right_arrow.png')}
                style={styles.next}
              />
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
    </>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop:109
  },
  safecontainer: {
    marginHorizontal: 24,
    //borderWidth:1,
  },
  
  stepIndicator: {
    paddingHorizontal: 0,
    top: 20,
  },
  rowItem: {
    flex: 1,
    paddingVertical: 0,
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
    marginBottom: 24,
  },
  titleBorder: {
    marginTop: 50,
    borderLeftWidth: 2,
    borderLeftColor: brandColor,
    marginBottom:20
  },
  title: {
    fontSize: 19,
    margin: 0,
    paddingLeft: 8,
    color: 'rgb(44, 54, 65)',
    fontFamily: helper.switchFont('medium'),
  },
  paymentModeButton: {
    borderColor: brandColor,
    borderWidth: 0.5,
    paddingLeft: 17,
    paddingRight: 17,
    paddingTop: 17,
    backgroundColor: '#E9E9E9',
    marginVertical: 10,
    borderRadius: 10,
  },
  infoWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 30,
  },
  radioButtonWrapper: {width: 50, height: 50},
  paymentMethod: {width: '80%'},
  paymentMethodText: {
    paddingLeft: 0,
    color: 'rgb(44, 54, 65)',
    fontSize: 14,
    fontFamily: helper.switchFont('medium'),
    marginTop: 8,
  },
  paymentMethodInfoText: {
    paddingLeft: 0,
    color: '#81878D',
    fontSize: 11,
    lineHeight: 18,
    marginTop: 8,
    fontFamily: helper.switchFont('regular'),
  },
  paymentGatewayCards: {
    width: '90%',
    height: 24,
    marginTop: 17,
  },
  next: {
    width: 21,
    height: 16,
    alignItems: 'center',
  },
  paymentStepInfo: {
    fontSize: 11,
    color: '#6B727A',
    lineHeight: 18,
    fontFamily: helper.switchFont('regular'),
  },
});
