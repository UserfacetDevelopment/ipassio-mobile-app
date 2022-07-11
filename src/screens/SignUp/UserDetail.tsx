import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {useSelector} from 'react-redux';
import PhoneInput, {isValidNumber} from 'react-native-phone-number-input';
import Intercom, {Visibility} from '@intercom/intercom-react-native'
import TextField from '../../components/CustomTextField';
import HeaderInner from '../../components/HeaderInner';
import Config from '../../config/Config';
import {Checkbox} from 'react-native-paper';
import {
  completeSignUp,
  loginSuccess,
  setSignupFrom,
  userState,
} from '../../reducers/user.slice';
import {useForm, Controller} from 'react-hook-form';
import DocumentPicker from 'react-native-document-picker';
import {
  dropdownBorder,
  font1,
  font2,
  lineColor,
  secondaryColor,
  selectedDrop,
} from '../../styles/colors';
import StyleCSS from '../../styles/style';
import Helper from '../../utils/helperMethods';
import RNFetchBlob from 'rn-fetch-blob';
import CustomDropdown from '../../components/CustomDropdown';
import CustomImage from '../../components/CustomImage';
// @ts-ignore
import Close from '../../assets/images/signup/chip_close';
import Passionate from '../../assets/images/signup/passionate';
import {FlatList} from 'native-base';
import {courseState} from '../../reducers/courses.slice';
import {useAppDispatch} from '../../app/store';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
interface ChipInterface {
  data: any;
  removeCategory: any;
}

export interface CompleteSignupInterface{
    data:any;
    userToken: string;
}

const Chip = ({data, removeCategory}: ChipInterface) => {
  return (
    <TouchableOpacity
      onPress={() => {
        removeCategory(data);
      }}
      style={styles.chip}>
      <Text style={StyleCSS.styles.contentText}>{data.category_name}</Text>
      <View style={{marginLeft: 8}}>
      
        <CustomImage uri={`${Config.media_url}images/signup/chip_close.svg`} height={16} width={16}/>
      </View>

      {/* <CustomImage uri={``}/> */}
    </TouchableOpacity>
  );
};
export default function UserDetail({navigation, route}) {
  const {userLocation, isLoggedIn, loginRedirectedFrom} = useSelector(userState);
  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({mode: 'onBlur'});

  const dispatch = useAppDispatch();
  const userData = route.params?.userSession;
  const {categoryData} = useSelector(courseState);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passionate, setPassionate] = useState<Array<any>>([]);
  const [selectedGender, setSelectedGender] = useState<any>(undefined);
  const [mobile, setMobile] = useState<string | number | null>(null);
  const [countryCode, setCountryCode] = useState<string | number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | number | null>(null);
  const [age, setAge] = useState<number | string | null>(null);
  const [masterArr, setMasterArr] = useState<Array<any>>([]);
  const [nonMasterArr, setNonMasterArr] = useState<Array<any>>([]);
  const [catArr, setCatArr] = useState<Array<any>>([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCats, setLoadingCats] = useState<Array<any>>([]);
  const [passionateSlug, setPassionateSlug] = useState<Array<any>>([]);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [submitRequested, setSubmitRequested] = useState(false);
  const [fileResponse, setFileResponse] = useState<any>([]);
  const [tProfile, setTProfile] = useState<any>(null);
  const [base64File, setBase64File] = useState<any>(null);
  const [bioType, setBioType] = useState<any>(null);
  const [isValidNum, setIsValidNum] = useState(false);
  const [passionateError, setPassionateError] = useState(false);

  const gender = [
    {value: 'Male', label: 'M'},
    {value: 'Female', label: 'F'},
    {value: 'Others', label: 'O'},
  ];
  const phoneInput = useRef(null);

useEffect(()=>{
  if(userData.user_type ==='S' && passionateSlug.length===0){
setPassionateError(true)
  }
  else{
    setPassionateError(false)
  }
},[passionateSlug])

  useEffect(() => {
    setCountryCode('91');
  }, []);

  useEffect(() => {
    if (phoneNumber === null) {
      setIsValidNum(true);
    } else {
      if (phoneInput.current?.isValidNumber(phoneNumber)) {
        setIsValidNum(true);
      } else {
        setIsValidNum(false);
      }
    }
  }, [phoneNumber]);

  useEffect(() => {
    categoryData.data.map((cat: any) => {
      cat.is_master === true ? masterArr.push(cat) : nonMasterArr.push(cat);
    });
    // setCatArr(masterArr);
    setCatArr([...masterArr, 'Others']);
  }, []);

  useEffect(() => {
    if (catArr.length > 0) {
      setSelectedCategory(catArr[0].seo.seo_slug_url);
      setLoadingCats(catArr[0].subCategories);
    }
  }, [catArr]);

  useEffect(() => {
    if (userData.user_type === 'T' && fileResponse.length > 0) {
      RNFetchBlob.fs
        .readFile(fileResponse[0].uri, 'base64')
        .then(data => {
          setBase64File(data);
          console.log('data', data);
        })
        .catch(err => {});
    }
  }, [fileResponse]);


  const finishSignUp = (data: any) => {
    setSubmitRequested(true);
    if(isValidNum && selectedGender && !passionateError){
        let params = {};
        if (userData.user_type === 'S') {
          params = {
            first_name: data.firstname,
            last_name: data.lastname,
            passionate_about: passionateSlug,
            age: parseInt(data.age),
            phone_number: phoneNumber,
            gender: selectedGender.label,
            country_code: '+' + countryCode,
          };
        } else if (userData.user_type === 'T') {
            if(base64File){
                params = {
                    first_name: data.firstname,
                    last_name: data.lastname,
                    age: parseInt(data.age),
                    phone_number: phoneNumber,
                    gender: selectedGender.label,
                    country_code: '+' + countryCode,
                    bio_image_base64: base64File ? base64File : '',
                    bio_type: bioType ? bioType : '',
                    website: data.website ? data.website : '',
                  };
            }
            else{
                params = {
                    first_name: data.firstname,
                    last_name: data.lastname,
                    age: parseInt(data.age),
                    phone_number: phoneNumber,
                    gender: selectedGender.label,
                    country_code: '+' + countryCode,
                    website: data.website ? data.website : '',
                  };
            }
          
          
        }
    
        let finalData : CompleteSignupInterface = {
          data: params,
          userToken: userData.token,
        };

        console.log(finalData);
    
        dispatch(completeSignUp(finalData))
          .then((response: any) => {
            if (response.payload.data.status === 'success') {
              //welcome to ipassio     
              navigation.navigate('ActionStatus2', {
                messageStatus: 'success',
                messageTitle: 'Congratulations!',
                messageDesc: response.payload.data.error_message.message,
                // timeOut: 3000,
                close: true,
                data:response.payload.data.data,
                // backRoute: loginRedirectedFrom!=='CD' ? 'Dashboard' : 'Checkout',
                params: {},
              });
              if(loginRedirectedFrom ==='CD'){
                dispatch(setSignupFrom('UD'));
              }
              setTimeout(()=>{
             
                dispatch(loginSuccess(response.payload.data.data));
                  Intercom.registerIdentifiedUser({email:response.payload.data.data.email, userId: response.payload.data.data.id})
              Intercom.updateUser({
                email: response.payload.data.data.email,
                userId: response.payload.data.data.id,
                name: response.payload.data.data.first_name+ ' '+response.payload.data.data.last_name,
                phone: response.payload.data.data.country_code+response.payload.data.data.phone_number,
              });
              }, 3000)
            } else if (response.payload.data.status === 'failure') {
              Alert.alert('', response.payload.data.error_messsage.message);
            }
          })
          .catch(error => {
            console.log(error);
          });
    } 
  };

  const getGender = (data: any) => {
    setSelectedGender(data[0]);
  };

  const handlePassionateSelection = (category: any) => {
    let temp = [...passionate];
    let tempSlug = [...passionateSlug];

    if (tempSlug.includes(category.seo.seo_slug_url)) {
      let i = tempSlug.indexOf(category.seo.seo_slug_url);
      tempSlug.splice(i, 1);
      temp.splice(i, 1);
    } else {
      tempSlug.push(category.seo.seo_slug_url);
      temp.push(category);
    }
    setPassionateSlug(tempSlug);
    setPassionate(temp);
  };

  const removeCategory = (category: any) => {
    let temp = [...passionate];
    let tempSlug = [...passionateSlug];
    let i = tempSlug.indexOf(category.seo.seo_slug_url);
    tempSlug.splice(i, 1);
    temp.splice(i, 1);
    setPassionateSlug(tempSlug);
    setPassionate(temp);
  };

  console.log(fileResponse);
  console.log(phoneNumber);
  console.log(countryCode);
  console.log(isValidNum);

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
      });
      setFileResponse(response);

      const temp = await RNFetchBlob.fs.readFile(response[0].uri, 'base64');
      setBioType(response[0].type);
      console.log(temp);
      setBase64File(temp);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const loadCats = (data: any, index: number) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (data !== 'Others') {
            setSelectedCategory(data.seo.seo_slug_url);
            setLoadingCats(data.subCategories);
          } else {
            setSelectedCategory(data);
            let loading: Array<any> = [];
            nonMasterArr.map(item => {
              item.subCategories.map((i: any) => {
                loading.push(i);
              });
            });
            setLoadingCats(loading);
          }
        }}
        style={[
          (selectedCategory &&
            data !== 'Others' &&
            selectedCategory === data.seo.seo_slug_url) ||
          (selectedCategory && data === 'Others' && selectedCategory === data)
            ? styles.selectedCategory
            : styles.tabCategory,
        ]}>
        <Text
          style={[
            StyleCSS.styles.contentText,
            StyleCSS.styles.font16,
            StyleCSS.styles.fw600,
          ]}>
          {data === 'Others' ? 'Others' : data.category_name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <HeaderInner
        type={'findCourse'}
        logo={true}
        title={'Sign Up'}
        navigation={navigation}></HeaderInner>
         <KeyboardAvoidingView  style={styles.scrollView} behavior='height'>
      <ScrollView  >
      
        <View style={styles.main}>
          <Text style={styles.title}>Help us customize your experience!</Text>
          <View style={{paddingTop: 8}}>
            <View style={styles.formGroup}>
              <Controller
                control={control}
                rules={{required: true, minLength: 2}}
                name="firstname"
                //   defaultValue={isLoggedIn ? userData.first_name : null}
                render={({field: {onChange, value, onBlur}}) => (
                  <TextField
                    // theme={{colors: {primary: font2}}}
                    // style={styles.input}
                    mode="outlined"
                    label="First Name*"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value: any) => onChange(value)}
                  />
                )}
              />
              {errors.firstname ? (
                errors.firstname.type === 'required' ? (
                  <Text style={StyleCSS.styles.errorText}>
                    Enter first name
                  </Text>
                ) : (
                  <Text style={StyleCSS.styles.errorText}>
                    Enter a valid first name
                  </Text>
                )
              ) : null}
             
            </View>
            <View style={styles.formGroup}>
              <Controller
                control={control}
                rules={{required: true, minLength: 1}}
                //   defaultValue={isLoggedIn ? userData.last_name : undefined}
                name="lastname"
                render={({field: {onChange, value, onBlur}}) => (
                  <TextField
                    // style={styles.input}
                    // theme={{colors: {primary: font2}}}
                    mode="outlined"
                    label="Last Name*"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value: any) => onChange(value)}
                  />
                )}
              />
              {errors.lastname ? (
                errors.lastname.type === 'required' ? (
                  <Text style={StyleCSS.styles.errorText}>Enter last name</Text>
                ) : (
                  <Text style={StyleCSS.styles.errorText}>
                    Enter a valid last name
                  </Text>
                )
              ) : null}
             
            </View>
            {userData.user_type === 'S' ? (
              <View style={styles.formGroup}>
                {passionate.length > 0 ? (
                  <Text
                    style={{
                      color: font2,
                      fontSize: 12,
                      fontFamily: Helper.switchFont('medium'),
                      fontWeight: '500',
                      position: 'absolute',
                      top: -8,
                      left: 8,
                      zIndex: 99,
                      backgroundColor: '#fff',
                      paddingHorizontal: 4,
                    }}>
                    What are you passionate to learn?*
                  </Text>
                ) : null}

                <TouchableOpacity
                  onPress={() => {
                    setShowCategoriesModal(true);
                  }}
                  activeOpacity={1}
                  style={styles.modalTextarea}>
                  <View
                    style={[
                      StyleCSS.styles.flexDirRow,
                      StyleCSS.styles.fdrCenter,
                      {width: '95%', flexWrap: 'wrap'},
                    ]}>
                    {passionate.length > 0 ? (
                      passionate.map(data => {
                        return (
                          <Chip data={data} removeCategory={removeCategory} />
                        );
                      })
                    ) : (
                      <Text> What are you passionate to learn?*</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setShowCategoriesModal(true);
                    }}
                    style={{width: '5%'}}>
                    {/* <Passionate /> */}
                    <CustomImage uri={`${Config.media_url}images/signup/passionate.svg`} height={24} width={24}/>
                  </TouchableOpacity>
                </TouchableOpacity>
                {submitRequested && passionateError ? <Text style={StyleCSS.styles.errorText}>Select atleast one category.</Text> : null}
              </View>
            ) : null}

            <View style={styles.formGroup}>
              <Text
                style={[
                  StyleCSS.styles.labelText,
                  StyleCSS.styles.font10,
                  {
                    position: 'absolute',
                    zIndex: 999,
                    top: -5,
                    fontSize: 12,
                    backgroundColor: '#fff',
                    left: 8,
                    paddingHorizontal: 4,
                  },
                ]}>
                Mobile Number*
              </Text>
              <Controller
                control={control}
                rules={{required: true}}
                //   defaultValue={phoneNumber}
                name="number"
                render={({field: {onChange, value, onBlur}}) => (
                  <PhoneInput
                    ref={phoneInput}
                    containerStyle={styles.countryCode}
                    textContainerStyle={styles.mobileNumber}
                    defaultValue={value}
                    onChangeCountry={e => setCountryCode(e.callingCode[0])}
                    defaultCode={
                      userLocation && //api with diff token(1)st
                      userLocation.data &&
                      userLocation.data.country_code
                        ? userLocation.data.country_code
                        : 'IN'
                    }
                    placeholder="Phone Number"
                    onChangeText={text => {
                      setPhoneNumber(text);
                    }}
                    onChangeFormattedText={text => {
                      onChange(text);
                    }}
                    //   ref={phone}
                  />
                )}
              />
              {errors.number ? (
                <Text style={StyleCSS.styles.errorText}>
                  Enter mobile number
                </Text>
              ) : null}
              {isValidNum ? null : (
                <Text style={StyleCSS.styles.errorText}>
                  Enter a valid mobile number
                </Text>
              )}
              
            </View>
            <View style={[styles.formGroup, StyleCSS.styles.flexDirRow]}>
              <View style={{width: '40%', justifyContent: 'flex-end'}}>
                <CustomDropdown
                  topLabel={selectedGender ? 'Gender *' : undefined}
                  config={{color: '#fff'}}
                  onChangeVal={getGender}
                  data={gender}
                  selectedIds={[]}
                  label={selectedGender ? selectedGender.value : 'Gender *'}
                  backTitle={'Select Gender'}
                />
              </View>
              <View
                style={{
                  width: '30%',
                  justifyContent: 'flex-end',
                  marginLeft: 24,
                }}>
                <Controller
                  //   defaultValue={isLoggedIn ? userData.age : null}
                  control={control}
                  rules={{required: true, pattern: /^[0-9]*$/}}
                  name="age"
                  render={({field: {onChange, value, onBlur}}) => (
                    <TextField
                      mode="outlined"
                      label="Age*"
                      value={value}
                      keyboardType={'numeric'}
                      onBlur={onBlur}
                      onChangeText={(value: number) => onChange(value)}
                    />
                  )}
                />
              </View>
            </View>
            <View style={StyleCSS.styles.flexDirRow}>
              <View style={{width: '40%', justifyContent: 'flex-end'}}>
                {selectedGender === undefined && submitRequested ? (
                  <Text style={StyleCSS.styles.errorText}>Select gender</Text>
                ) : null}
              </View>
              <View
                style={{
                  width: '30%',
                  justifyContent: 'flex-end',
                  marginLeft: 24,
                }}>
                {errors.age && errors.age.type === 'required' && (
                  <Text style={StyleCSS.styles.errorText}>Enter age</Text>
                )}
                {errors.age && errors.age.type === 'pattern' && (
                  <Text style={StyleCSS.styles.errorText}>
                    Age should be a number
                  </Text>
                )}
              </View>
            </View>
            {userData.user_type === 'T' ? (
              <>
                {/* <View style={[styles.formGroup]}>
                  {fileResponse.length > 0 ? (
                    <Text
                      style={[
                        StyleCSS.styles.labelText,
                        StyleCSS.styles.font10,
                        {
                          position: 'absolute',
                          zIndex: 999,
                          top: -8,
                          fontSize: 12,
                          backgroundColor: '#fff',
                          left: 8,
                          paddingHorizontal: 4,
                        },
                      ]}>
                      Bio Upload
                    </Text>
                  ) : null}
                  <TouchableOpacity
                    onPress={handleDocumentSelection}
                    style={{
                      height: 50,
                      borderWidth: 1,
                      padding: 12,
                      borderRadius: 8,
                      borderColor: dropdownBorder,
                    }}>
                    {fileResponse.length <= 0 ? (
                      <View
                        style={[
                          StyleCSS.styles.flexDirRow,
                          StyleCSS.styles.fdrCenter,
                          {justifyContent: 'space-between'},
                        ]}>
                        <Text
                          style={[
                            StyleCSS.styles.labelText,
                            StyleCSS.styles.font14,
                          ]}>
                          Bio Upload
                        </Text>
                        <Text style={StyleCSS.styles.contentText}>
                          Choose File
                        </Text>
                      </View>
                    ) : null}
                    {fileResponse.map((file: any, index: number) => (
                      <View
                        style={[
                          StyleCSS.styles.flexDirRow,
                          StyleCSS.styles.fdrCenter,
                          {width: '90%'},
                        ]}>
                        <Text
                          key={index.toString()}
                          style={[StyleCSS.styles.contentText]}
                          numberOfLines={1}
                          ellipsizeMode={'middle'}>
                          {file?.uri}
                        </Text>
                        <TouchableOpacity
                          onPress={() => setFileResponse([])}
                          style={{marginLeft: 8, width: '10%'}}>
                         
        <CustomImage uri={`${Config.media_url}images/signup/chip_close.svg`} height={16} width={16}/>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </TouchableOpacity>
                </View> */}
<View style={styles.formGroup}>
              <Controller
                control={control}
                rules={{pattern:/^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/}}
                name="website"
                //   defaultValue={isLoggedIn ? userData.first_name : null}
                render={({field: {onChange, value, onBlur}}) => (
                    <TextField
                    mode="outlined"
                    label="Your website or LinkedIn profile"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value: number) => onChange(value)}
                  />
                )}
              />
              {errors.website &&
                errors.website.type === 'pattern' ? (
                  <Text style={StyleCSS.styles.errorText}>
                    Enter a valid url(e.g. https://www.example.com).
                  </Text>
                 
              ) : null}
              {/* <TextField
                mode="outlined"
                label="First Name*"
                // style={StyleCSS.styles.input}
                value={firstName}
                onChangeText={(text: string) => setFirstName(text)}
                editable={true}
                selectTextOnFocus={false}
              /> */}
            </View>
                
              </>
            ) : null}

            <View style={[styles.formGroup]}>
              <Text style={[StyleCSS.styles.contentText, {lineHeight: 26}]}>
                By signing up with ipassio, you agree to our{' '}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('StaticPage', {
                      nid: 'privacy_policy',
                      web_title: 'Privacy Policy',
                    });
                  }}>
                  <Text style={StyleCSS.styles.readMore}>Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={[StyleCSS.styles.contentText]}> & </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('StaticPage', {
                      nid: 'terms_of_service',
                      web_title: 'Terms of Service',
                    });
                  }}>
                  <Text style={StyleCSS.styles.readMore}>Terms of Service</Text>
                </TouchableOpacity>
                .
              </Text>
            </View>
            <View style={[styles.formGroup, {marginBottom: 100}]}>
              <TouchableOpacity
                onPress={handleSubmit(finishSignUp)}
                style={[StyleCSS.styles.submitButton, {width: '100%'}]}>
                <Text style={StyleCSS.styles.submitButtonText}>
                  Finish Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
       
      </ScrollView>
      </KeyboardAvoidingView>
      
      <Modal
        visible={showCategoriesModal}
        transparent={true}
        statusBarTranslucent={true}
        animationType="slide">
        <TouchableOpacity
          onPress={() => {
            setShowCategoriesModal(false);
          }}
          activeOpacity={1}
          style={StyleCSS.styles.modalBackground}>
          <TouchableOpacity
            activeOpacity={1}
            style={[StyleCSS.styles.modalView, {width: '100%', height: '75%'}]}>
            <View style={StyleCSS.styles.modalLine} />
            <Text style={StyleCSS.styles.modalTitle}>
              What are you passionate to learn?
            </Text>

            <View
              style={{
                marginHorizontal: 16,
                borderBottomWidth: 0.5,
                borderBottomColor: lineColor,
              }}>
              <FlatList
                horizontal
                data={catArr}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => loadCats(item, index)}
              />
            </View>
            <ScrollView contentInsetAdjustmentBehavior="always">
              {loadingCats.length > 0
                ? loadingCats.map((lc: any) => {
                    return (
                      <TouchableOpacity
                        onPress={() => handlePassionateSelection(lc)}
                        style={[
                          StyleCSS.styles.flexDirRow,
                          StyleCSS.styles.alignCenter,
                          {marginHorizontal:10, marginVertical:2}
                        ]}>
                        <Checkbox.Android
                          status={
                            passionateSlug.indexOf(lc.seo.seo_slug_url) > -1
                              ? 'checked'
                              : 'unchecked'
                          }
                        />
                        <Text>{lc.category_name}</Text>
                      </TouchableOpacity>
                    );
                  })
                : null}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  mainView:{
    backgroundColor: '#fff',
    // marginTop: Config.headerHeight,
  },
  scrollView: {
    marginTop: Config.headerHeight,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    color: font1,
    fontWeight: '700',
    fontFamily: Helper.switchFont('bold'),
    marginTop: 40,
    textAlign: 'center',
    lineHeight: 30,
  },
  main: {
    paddingHorizontal: 16,
  },
  formGroup: {
    marginTop: 24,
  },
  reviewTextArea: {
    width: '100%',
    height: 48,
    color: font1,
    fontSize: 14,
    textAlignVertical: 'top',
    borderRadius: 5,
  },
  countryCode: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    color: font1,
    marginTop: 5,
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'rgb(255, 255, 255)',
    fontFamily: Helper.switchFont('medium'),
    borderColor: dropdownBorder, //'#CDD6E0',
  },
  modalTextarea: {
    minHeight: 48,
    width: width - 32,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 8,
    paddingTop: 12,
    paddingBottom: 13,
    paddingHorizontal: 12,
    borderWidth: 1,
    paddingRight: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: dropdownBorder,
  },
  mobileNumber: {
    flexDirection: 'row',
    justifyContent: 'center',
    color: font1,
    borderLeftColor: dropdownBorder,
    borderLeftWidth: 1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    fontSize: 14,
    backgroundColor: 'rgb(255, 255, 255)',
    fontFamily: Helper.switchFont('medium'),
  },
  chip: {
    backgroundColor: selectedDrop,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingTop: 7,
    paddingBottom: 6,
    marginRight: 5,
    marginVertical: 2,
    flexDirection: 'row',
  },
  tabCategory: {
    paddingHorizontal: 8,
    maxHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
  },
  selectedCategory: {
    paddingHorizontal: 8,
    maxHeight: 40,
    paddingBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: secondaryColor,
    borderBottomWidth: 4,
  },
});
