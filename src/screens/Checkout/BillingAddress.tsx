import React, {useState, FC, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  Animated,
  //TextInput,
} from 'react-native';
// @ts-ignore
import Textarea from 'react-native-textarea';
import {TextInput} from 'react-native-paper';
import StepIndicator from 'react-native-step-indicator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {stepIndicatorStyles} from './CartPage';
import HeaderInner from '../../components/HeaderInner'
import {useSelector} from 'react-redux';
import {
  checkoutState,
  checkoutToNextPage,
  setCheckoutDataDetails,
} from '../../reducers/checkout.slice';
import {userState} from '../../reducers/user.slice';
import {loaderState, setPageLoading} from '../../reducers/loader.slice';
import PageLoader from '../../components/PageLoader';
import {brandColor, font1, font2, secondaryColor, secondaryColorBorder} from '../../styles/colors';
import Helper from '../../utils/helperMethods';
import CustomDropdown from '../../components/CustomDropdown';
import config from '../../config/Config';
import {useAppDispatch} from '../../app/store';
import { Select } from 'native-base';
import CustomStatusBar from '../../components/CustomStatusBar';
import StyleCSS from '../../styles/style';
import TextField from '../../components/CustomTextField';

type Props = NativeStackScreenProps<RootParamList, 'BillingAddress'>;

const BillingAddress: FC<Props> = ({navigation}) => {
  const currentPage = 2;
  const dispatch = useAppDispatch();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [orderComment, setOrderComment] = useState<string>('');
  const [countryList, setCountryList] = useState<Array<any>>([]);
  const [stateList, setStateList] = useState<Array<any>>([]);
  const [selectedCountry, setSelectedCountry] = useState<any|undefined>(undefined);
  const [selectedState, setSelectedState] = useState<any| undefined>(
    undefined
  );
  const [country, setCountry] = useState(undefined);
  const [region, setRegion] = useState<string>('');
  const {checkoutDataDetails} = useSelector(checkoutState);
  const {userData} = useSelector(userState);
  const {pageLoading} = useSelector(loaderState);
  const [countryArr, setCountryArr] = useState<Array<any>>([]);

  useEffect(() => {
    setFirstName(checkoutDataDetails.billing_first_name);
    setLastName(checkoutDataDetails.billing_last_name);
    setStreetAddress(checkoutDataDetails.billing_street_address);
    setCity(checkoutDataDetails.billing_city);
    setPostalCode(checkoutDataDetails.billing_pin_code);
    setState(checkoutDataDetails.billing_state);
    setCountry(checkoutDataDetails.billing_country);
    setOrderComment(checkoutDataDetails.order_comments);

    let clist = config.country_listing;

    setCountryArr(
      clist.filter(i => {
        return (i.value === checkoutDataDetails.billing_country)
      }),
    );

    if (countryList) {
      setCountryList(clist);
    }
  }, []);

  useEffect(() => {
    if (countryArr && countryArr.length > 0) {
      setSelectedCountry(countryArr[0]);

      setSelectedState(
        countryArr[0].regions.filter((i: any) => {
          return (i.value === checkoutDataDetails.billing_state)
        })[0],
      );
    }
  }, [countryArr]);

  useEffect(()=>{
    if(countryArr.length!==0){
      setStateList(countryArr[0].regions);
    }
  },[countryArr]);

  const getCountry = (data: any) => {
    setStateList(data[0].regions);
    setSelectedCountry(data[0]);
    setSelectedState(undefined);
  };

  const getSelState = (data: any) => {
    setSelectedState(data[0]);
  };

  const updateUserBillingAddress = () => {

    if (
      !selectedCountry ||
      !firstName ||
      !lastName||
      !streetAddress ||
      !city||
      !postalCode ||
      !selectedState
    ) {
      Alert.alert("", config.messages.common_error_missing_fields, [
        { text: "Okay", style: "cancel" },
      ]);
      return false;
    }

    dispatch(setPageLoading(true));
    let finalReviewData = {
      number_of_class: checkoutDataDetails.amount.number_of_class,
      classes_per_week: checkoutDataDetails.amount.classes_per_week,
      number_of_weeks: checkoutDataDetails.amount.number_of_weeks,

      coupon_code: checkoutDataDetails.amount.coupon_code,
      coupon_discount_amount: checkoutDataDetails.amount.coupon_discount_amount,
      currency_type: checkoutDataDetails.amount.currency_type,
      price_per_class: checkoutDataDetails.amount.price_per_class,

      checkout_token: checkoutDataDetails.checkout_token,
      course: checkoutDataDetails.course.id,
      purchase_type: checkoutDataDetails.purchase_type,
      class_type: checkoutDataDetails.class_type.id,
      billing_first_name: checkoutDataDetails.billing_first_name,
      billing_last_name: checkoutDataDetails.billing_last_name,
      payment_gateway: checkoutDataDetails.payment_gateway,

      billing_pin_code: postalCode,
      billing_state: selectedState.value,
      billing_street_address: streetAddress,
      order_comments: orderComment,
      billing_city: city,
      billing_country: selectedCountry.value,
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
          navigation.navigate('Review');
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
    <HeaderInner
            title={'Checkout'}
            type={'findCourse'}
            // backroute={route?.params?.backroute}
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
    <View style={styles.container}>
      <CustomStatusBar type={"inside"} />
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
              title={"Checkout"}
              backRoute={"PaymentPage"}
              navigation={this.props.navigation}
              type={"innerpage"}
            /> */}
          <KeyboardAwareScrollView
            scrollEventThrottle={16}
            // onScroll={Animated.event(
            //   [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            //   { useNativeDriver: false }
            // )}
          >
            <ScrollView>
              <View style={styles.safecontainer}>
              <View style={[styles.stepIndicator ,{marginTop:32}]}>
                <StepIndicator
                  customStyles={stepIndicatorStyles}
                  stepCount={4}
                  direction="horizontal"
                  currentPosition={currentPage}
                />
              </View>

              <View style={styles.titleBorder}>
                <Text style={styles.title}>Billing Address</Text>
              </View>

              <View style={styles.formInput}>
                {/* <Text style={styles.inputLabel}>First Name *</Text> */}

                <TextField
                mode="outlined"
                label='First Name'
                // style={StyleCSS.styles.input}
                  value={firstName}
                  onChangeText={(text : string)=> setFirstName(text)}
                  editable={true}
                  selectTextOnFocus={false}
                />
              </View>

              <View  style={styles.formInput}>
                {/* <Text style={styles.inputLabel}>Last Name *</Text> */}

                <TextField
                mode="outlined"
                label='Last Name'
                // style={StyleCSS.styles.input}
                  value={lastName}
                  onChangeText={text => setState(text)}
                  editable={true}
                  selectTextOnFocus={false}
                />
              </View>

              <View  style={styles.formInput}>
                {/* <Text style={styles.inputLabel}>Street Address *</Text> */}

                <TextField
                mode="outlined"
                label='Street Address *'
                style={StyleCSS.styles.input}
                  value={streetAddress}
                  onChangeText={text => setStreetAddress(text)}
                  editable={true}
                  selectTextOnFocus={false}
                />
              </View>

              <View  style={styles.formInput}>
                {/* <Text style={styles.inputLabel}>City *</Text> */}

                <TextField
                mode="outlined"
                label='City *'
                  style={StyleCSS.styles.input}
                  value={city}
                  onChangeText={text => setCity(text)}
                  editable={true}
                  selectTextOnFocus={false}
                />
              </View>

              <View  style={styles.formInput}>
                {/* <Text style={styles.inputLabel}>Postal Code *</Text> */}

                <TextField
                mode="outlined"
                label='Postal Code *'
                // style={StyleCSS.styles.input}
                  keyboardType="numeric"
                  value={postalCode ? postalCode : ''}
                  onChangeText={(text:string) => setPostalCode(text)}
                  editable={true}
                  selectTextOnFocus={false}
                />
              </View>
              {checkoutDataDetails && countryList ? (
                <>
                  <View  style={styles.formInput}>
                    {/* <Text style={styles.inputLabel}>Country *</Text> */}
                    <CustomDropdown
                    topLabel='Country *'
                      config={{color: '#fff'}}
                      onChangeVal={getCountry}
                      data={countryList}
                      selectedIds={[]}
                      label={
                        selectedCountry
                          ? selectedCountry.value
                          : 'Select Country'
                      }
                      backTitle={'Select Country'}
                    />
                  </View>

                  <View  style={styles.formInput}>
                    {/* <Text style={styles.inputLabel}>State *</Text> */}
                    <CustomDropdown
                    topLabel='State *'
                    config={{color: '#fff'}}
                      onChangeVal={getSelState}
                      data={stateList}
                      selectedIds={[]}
                      label={
                        selectedState ? selectedState.value : state? state : 'Select State'
                      }
                      backTitle={'Select State'}
                    />
                  </View>
                </>
              ) : null}

              <View  style={styles.formInput}>
              <View>
                  {/* <Text style={styles.row_title}>
                          Review
                          <Text style={styles.req}>
                            *
                          </Text>
                        </Text> */}
                  <Textarea
                    containerStyle={StyleCSS.styles.modalTextarea}
                    style={styles.reviewTextArea}
                    onChangeText={(text: string) => setOrderComment(text)}
                    defaultValue={orderComment}
                    placeholder={'Order Comments'}
                    placeholderTextColor={font2}
                    underlineColorAndroid={'transparent'}
                  />
                </View>
             
                {/* <Text style={styles.inputLabel}>Order Comments</Text> */}

                {/* <Textarea
                  // containerStyle={[styles.input, styles.textarea]}
                  // style={styles.orderComments}
                  onChangeText={(text: string) => setOrderComment(text)}
                  defaultValue={orderComment}
                  placeholder={'Order Comments'}
                  placeholderTextColor={'#c7c7c7'}
                  underlineColorAndroid={'transparent'}
                /> */}
              </View>

              
              </View>
              <View style={[StyleCSS.styles.lineStyleLight,{marginVertical:16}]} />

              <Text style={styles.stepInfoText}>
                This is Step 3 of 4. In the next page you can review your order
                and product information
              </Text>

              {/* <View style={styles.buttonWrapper}> */}
                {/* <View style={styles.cancelButtonWrapper}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      navigation.navigate("Dashboard",{
                      screen:'DashboardPage'
                    })}}
                    >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View> */}

                {/* <View style={styles.reviewOrderButtonWrapper}>
                  <TouchableOpacity
                    style={styles.reviewOrderButton}
                    onPress={() => updateUserBillingAddress()}>
                    <Text style={styles.reviewOrderButtonText}>
                      Review Your Order
                    </Text>
                    <Image
                      source={require('@images/right_arrow.png')}
                      style={styles.next}
                    />
                  </TouchableOpacity>
                </View> */}
                <View
                  style={[
                   StyleCSS.styles.modalButton
                  ]}>
                  <TouchableOpacity
                    style={StyleCSS.styles.cancelButton}
                    onPress={() => {
                      navigation.goBack()
                     
                    }}>
                    <Text
                      style={StyleCSS.styles.cancelButtonText}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={StyleCSS.styles.submitButton}
                    onPress={() => updateUserBillingAddress()}>
                    
                    <Text
                      style={StyleCSS.styles.submitButtonText}>
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
            </ScrollView>
          </KeyboardAwareScrollView>
        </View>
      )}
    </View>
    </>
  );
};

export default BillingAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop:config.headerHeight
  },
  stepIndicator: {
    paddingHorizontal: 0,
    top: 20,
  },
  rowItem: {
    flex: 1,
    paddingVertical: 0,
  },
  safecontainer: {
    marginHorizontal: 16,
    // marginTop: 16,
  },
  titleBorder: {
    marginTop:16,
    marginBottom:4,
  },
  title: {
    marginTop: 16,
    fontSize: 18,
    color: font1,
    fontWeight: '700',
    fontFamily: Helper.switchFont('bold'),
  },
  body: {
    flex: 1,
    fontSize: 15,
    color: '#606060',
    lineHeight: 24,
    marginRight: 8,
  },
  lineStyle1: {
    borderWidth: 1.0,
    borderColor: '#E2E4E5',
    top: 160,
    width: '88%',
    margin: 18,
  },
  lineStyle2: {
    borderWidth: 1.0,
    borderColor: '#E2E4E5',
    top: 60,
    width: '88%',
    margin: 18,
  },
  lineStyle3: {
    borderWidth: 1.0,
    borderColor: '#E2E4E5',
    top: 60,
    width: '88%',
    margin: 18,
  },
  lineStyle4: {
    borderWidth: 0.5,
    borderColor: '#E2E4E5',
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    marginVertical: 24,
  },
  input: {
    color: '#81878D',
    margin: 0,
    fontSize: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'rgb(194, 194, 194)',
    fontFamily: Helper.switchFont('regular'),
    height: 50,
  },
  inputLabel: {
    fontSize: 14,
    margin: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: 24,
    color: 'rgb(44, 54, 65)',
    // marginBottom: -27,
    fontFamily: Helper.switchFont('medium'),
    marginBottom: 5,
  },
  cancelText: {
    fontSize: 14,
    color: 'rgb(108, 108, 108)',
    textDecorationLine: 'underline',
    fontFamily: Helper.switchFont('medium'),
  },
  reviewOrderButton: {
    backgroundColor: brandColor,
    justifyContent: 'center',
    borderRadius: 3,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    // selfAlign: "flex-end",
    width: 190,
  },
  reviewOrderButtonText: {
    color: 'white',
    fontSize: 14,
    justifyContent: 'center',
    fontFamily: Helper.switchFont('medium'),
    marginRight: 15,
  },
  next: {
    width: 21,
    height: 16,
    alignItems: 'center',
  },
  orderComments: {
    height: 150,
    fontSize: 14,
    textAlignVertical: 'top',
    borderRadius: 5,
    color: '#81878D',
    fontFamily: Helper.switchFont('regular'),
  },
  textarea: {
    height: 158,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 5,
    padding: 10,
  },
  stepInfoText: {
    marginHorizontal:16,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Helper.switchFont('regular'),
    color: font2,
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderRadius: 3,
    zIndex: 1,
    marginTop: 17,
  },
  buttonWrapper: {
    flex: 1,
    flexDirection: 'row',
    zIndex: 1,
    marginBottom: 48,
  },
  cancelButtonWrapper: {width: '30%', height: 50, zIndex: 1},
  reviewOrderButtonWrapper: {width: '70%', height: 50, alignItems: 'flex-end'},
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
  formInput:{
    marginVertical:12
  },
  reviewTextArea: {
    width: '100%',
    height: 150,
    color: font1,
    fontSize: 14,
    textAlignVertical: 'top',
    borderRadius: 5,
  },
});
