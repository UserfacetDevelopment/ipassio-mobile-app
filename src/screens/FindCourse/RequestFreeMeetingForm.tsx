import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  //TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Keyboard,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import DropDownPicker from 'react-native-dropdown-picker';
import PhoneInput from 'react-native-phone-number-input';
import helper from '../../utils/helperMethods';
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import {
  background,
  background2,
  background6,
  brandColor,
  dropdownBorder,
  font1,
  font2,
  secondaryColor,
  secondaryColorBorder,
} from '../../styles/colors';
import {useSelector} from 'react-redux';
import {courseState, requestFreeSession, getLookups} from '../../reducers/courses.slice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import {userState} from '../../reducers/user.slice';
import {TextInput, RadioButton} from 'react-native-paper';
import CustomDropdown from '../../components/CustomDropdown';
import config from '../../config/Config';
import {useAppDispatch} from '../../app/store';
import {loaderState, setPageLoading} from '../../reducers/loader.slice';
import Helper from '../../utils/helperMethods';
import PageLoader from '../../components/PageLoader';
import HeaderInner from '../../components/HeaderInner';
import moment from 'moment';
import timezones from '../../assets/json/timezones.json';
import Add from '../../assets/images/Add.svg';
import {CurvedTransition} from 'react-native-reanimated';
import CustomForm from '../../components/CustomForm';
import StyleCSS from '../../styles/style';
import TextField from '../../components/CustomTextField';
import Textarea from 'react-native-textarea';


type Props = NativeStackScreenProps<RootParamList, 'RequestMeeting'>;

export default function RequestFreeMeetingForm({navigation, route}: Props) {
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({mode: 'onBlur'});

  const {course} = useSelector(courseState);
  const {pageLoading} = useSelector(loaderState);
  const {isLoggedIn, userData, userLocation} = useSelector(userState);
  const [selectedCountry, setSelectedCountry] = useState<any>(undefined);
  const [countryList, setCountryList] = useState<Array<any>>([]);
  let clist = config.country_listing;
  const [reason, setReason] = useState<any>(undefined);
  const [yob, setYob] = useState<any>(undefined);
  const [optionsYearList, setOptionsYearList] = useState<Array<any>>([]);
  const [submitRequested, setSubmitRequested] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState(
    isLoggedIn ? userData.phone_number : '',
  );
  const [countryCode, setCountryCode] = useState(
    isLoggedIn ? userData.country_code.substring(1) : '',
  );
  const [readMore, setReadMore] = useState(false);
  const gender = [
    {value: 'Male', label: 'M'},
    {value: 'Female', label: 'F'},
    {value: 'Others', label: 'O'},
  ];
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDateToPass, setSelectedDateToPass] = useState<
    undefined | string
  >(undefined);
  const [dSelected, setDSelected] = useState<Date | undefined>(undefined);
  const [startTimeRangeList, setStartTimeRangeList] = useState<Array<any>>([]);
  const [endTimeRangeList, setEndTimeRangeList] = useState<Array<any>>([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [additionalInfo, setAddditionalInfo] = useState('');
  const [timeSlots, setTimeSlots] = useState<Array<any>>([
    {
      date: '',
      start_time: '',
      end_time: '',
      timezone: '',
    },
  ]);
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [timezoneList, setTimezoneList] = useState([]);
  const [selectedGender, setSelectedGender] = useState<any>(undefined);
  const [meetingPlatform, setMeetingPlatform] = useState<any>(undefined);
  const [platforms, setPlatforms] = useState<Array<any>>([]);
  const [p, setP] = useState<any>(null);
  const [showField, setShowField] = useState<boolean>(false);
  const [fieldLabel, setFieldLabel] = useState('');

  

  // const showDateTimePicker = () => {
  //   Keyboard.dismiss();
  //   setIsDateTimePickerVisible(true);
  // };

  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false);
  };

  // const handleDatePicked = (selectedDate: Date, index: number) => {
  //   setDSelected(selectedDate);
  //   setSelectedDate(Moment(selectedDate).format('MMM DD YYYY'));
  //   setSelectedDateToPass(Moment(selectedDate).format('YYYY-MM-DD'));
  //   hideDateTimePicker();
  //   timeSlots[index].date = Moment(selectedDate).format('YYYY-MM-DD');
  // };

  let reasons = [
    {label: 'MT', value: 'Meet the teacher'},
    {
      label: 'SC',
      value: 'See how an online class works',
    },
    {label: 'DT', value: 'Discuss Session Timings'},
  ];

  const onSubmit = (data: any) => {
    setSubmitRequested(true);
    // if (
    //   (isLoggedIn && yob === undefined) ||
    //   (!isLoggedIn && yob !== undefined)
    // )
    // {
    //when user is not logged in and yob should be there + user logged in and yob not required
    //  if (selectedCountry !== undefined && reason !== undefined)
    if (
      selectedCountry !== undefined &&
      reason !== undefined &&
      meetingPlatform !== undefined
    ) {
      if (data[meetingPlatform.code] !== undefined) {
        if (
          timeSlots[0].date !== '' &&
          timeSlots[0].start_time !== '' &&
          timeSlots[0].end_time &&
          timeSlots[0].timezone
        ) {
          dispatch(setPageLoading(true));
          let learn_on = new Array();
          // if (course.taught_on) {
          //   course.taught_on.map((val: any, i: number) => {
          //     if (val.code !== 'I' && data[val.code] !== undefined) {
          //       learn_on.push({code: val.code, contact_id: data[val.code]});
          //     }
          //   });
          // }
          if (meetingPlatform) {
            if (meetingPlatform.code !== 'I') {
              learn_on.push({
                code: meetingPlatform.code,
                contact_id: data[meetingPlatform.code],
              });
            } else {
              learn_on.push({code: 'I', contact_id: ''});
            }
          }

          let formData;

          formData = {
            first_name: data.guest_firstname,
            last_name: data.guest_lastname,
            guest_email: data.guest_email,
            gender: selectedGender?.label,
            age: data.age,
            reason: reason.label,
            country_code: '+' + countryCode,
            phone_number: phoneNumber,
            city: data.city,
            country: selectedCountry?.value,
            add_info: data.add_info,
            timezone: userLocation.data.timezone,
            course: course.id,
            taught_on: learn_on,
            slots: timeSlots,
          };
          // if (!isLoggedIn) {
          //   formData = {
          //     course: course.id,
          //     reason: reason.label,
          //     phone_number: phoneNumber, //data.number,
          //     city: data.city,
          //     country: selectedCountry?.value,
          //     time_info: data.time_info,
          //     add_info: data.add_info,
          //     timezone: userLocation.data.timezone,
          //     taught_on: learn_on,
          //     country_code: '+' + countryCode,
          //     guest_name: data.guest_name,
          //     guest_email: data.guest_email,
          //     yob: yob.value,
          //     gender: data.gender,
          //   };
          // } else {
          //   formData = {
          //     course: course.id,
          //     reason: reason.label,
          //     phone_number: phoneNumber,
          //     city: data.city,
          //     country: selectedCountry?.value,
          //     time_info: data.time_info,
          //     add_info: data.add_info,
          //     timezone: userLocation.data.timezone,
          //     taught_on: learn_on,
          //     country_code: '+' + countryCode,
          //   };
          // }
          dispatch(setPageLoading(false));
          console.log(formData);
          let finalData = {
            formData: formData,
            userToken: userData && userData.token,
            loggedIn: isLoggedIn,
          };
          dispatch(requestFreeSession(finalData))
            .unwrap()
            .then(response => {
              dispatch(setPageLoading(false));
              console.log(response);
              if (response.data.status === 'success') {
                navigation.navigate('ActionStatus', {
                  messageStatus: 'success',
                  messageTitle: 'Success!',
                  messageDesc: response.data.error_message.message,
                  timeOut: 4000,
                  backRoute: 'CourseDetail',
                  params: {},
                });
              } else if (response.data.status === 'failure') {
                navigation.navigate('ActionStatus', {
                  messageStatus: 'failure',
                  messageTitle: 'Sorry!',
                  messageDesc: response.data.error_message.message,
                  timeOut: 4000,
                  backRoute: 'RequestMeeting',
                  params: {},
                });
              }
            })
            .catch(() => {
              dispatch(setPageLoading(false));
            });
        } else {
          Alert.alert('', 'Enter date and time slots');
        }
      } else {
        Alert.alert('Fill details', 'Add your meeting platform details');
      }
    }
    // }
  };

  useEffect(() => {
    const coeff = 1000 * 60 * 15;
    const date = new Date();
    const rounded = new Date(Math.ceil(date.getTime() / coeff) * coeff);

    const d = date.getDate();
    const month = rounded.getMonth();
    let hour = rounded.getHours();
    let minutes = rounded.getMinutes();
    let dTime = hour * 60 + minutes;
    let interval = 1425;
    let start = 0;
    if (
      dSelected &&
      dSelected.getMonth() === month &&
      dSelected.getDate() === d &&
      dSelected.getFullYear() === rounded.getFullYear()
    ) {
      //interval = 1425-dTime;
      start = dTime;
    }

    // let daytime = "am";

    // if(hour > 12){
    //   hour = hour-12;
    //   daytime="pm"
    //   interval= 705 - hour*15*4;
    // }
    // else{
    //   interval = 1425-hour*15*4;
    // }

    // populateTimeIntervalRange(hour*15*4, interval, "start");
    populateTimeIntervalRange(start, interval, 'start');
  }, [selectedDate]);

  const removeTimeSlot = (index: number) => {
    console.log(index);
    if (timeSlots.length > 1) {
      const values = [...timeSlots];
      values.splice(index, 1);
      setTimeSlots(values);
    }
  };

  const addMoreSlots: any = (index: any) => {
    // if((timeSlots[index-1].date==='' || timeSlots[index-1].start_time==='' || timeSlots[index-1].end_time==='' || timeSlots[index-1].timezone==='')){
    //     Alert.alert('', "fill the empty slot first")
    //     return;
    //   }
    //   else
    //   if(index===0){
    //     timeSlots[0].date = selectedDate;
    //     timeSlots[0].start_time = startTime;
    //     timeSlots[0].end_time = endTime;
    //     timeSlots[0].timezone = selectedTimezone.value;
    //   }

    // else {
    //         timeSlots[index-1].date = selectedDate;
    //         timeSlots[index-1].start_time = startTime;
    //         timeSlots[index-1].end_time = endTime;
    //         timeSlots[index-1].timezone = selectedTimezone.value;

    // }
    setTimeSlots([
      ...timeSlots,
      {
        date: '',
        start_time: '',
        end_time: '',
        timezone: '',
      },
    ]);
  };

  const populateTimeIntervalRange = (
    min_time: number,
    max_time: number,
    setfor: string = 'start',
  ) => {
    var hours, minutes, ampm;
    let tir = new Array();
    for (var i = min_time; i <= max_time; i += 15) {
      hours = Math.floor(i / 60);
      minutes = i % 60;
      if (minutes < 10) {
        minutes = '0' + minutes; // adding leading zero
      }
      ampm = hours % 24 < 12 ? 'AM' : 'PM';
      hours = hours % 12;
      if (hours === 0) {
        hours = 12;
      }
      if (hours < 10) {
        hours = '0' + hours; // adding leading zero
      }
      tir.push({
        label: hours + ':' + minutes + ' ' + ampm,
        value: hours + ':' + minutes + ' ' + ampm,
      });
    }
    if (setfor === 'end') {
      setEndTimeRangeList(tir);
    } else {
      setStartTimeRangeList(tir);
    }
  };

  useEffect(() => {
    if (meetingPlatform && meetingPlatform.code !== 'I') {
      setShowField(true);
    } else setShowField(false);
  }, [meetingPlatform]);

  // const [index, setIndex] = useState(timeSlots.length-1)

  // useEffect(()=>{
  //   setIndex(timeSlots.length-1);
  // },[timeSlots])
  const changeStartTime = (data: any, index) => {
    setStartTime(data[0].value);
    setEndTime(null);
    let temp = data[0].value.split(' ');
    let temp1 = temp[0].split(':');
    let time = 0;
    if (temp[1] === 'PM' && temp1[0] != 12) {
      time = (parseInt(temp1[0]) + 12) * 60 + parseInt(temp1[1]) + 15;
    } else {
      if (temp1[0] == 12 && temp[1] === 'AM') {
        temp1[0] = 0;
      }
      time = parseInt(temp1[0]) * 60 + parseInt(temp1[1]) + 15;
    }
    timeSlots[index].start_time = data[0].value;

    populateTimeIntervalRange(time, 1425, 'end');
  };

  const changeEndTime = (data: any, index) => {
    setEndTime(data[0].value);
    timeSlots[index].end_time = data[0].value;
  };

  useEffect(() => {
    setCountryList(clist);
    generateOptionsYearList();

    if (course.taught_on && course.taught_on.length > 0) {
      course.taught_on.map((item: any) => {
        platforms.push({
          label: item.custom_name,
          value: item.name,
          code: item.code,
        });
      });
    }
  }, []);

  const getCountry = (data: any) => {
    setSelectedCountry(data[0]);
  };

  const getMeetingPlatform = (data: any) => {
    setMeetingPlatform(data[0]);
  };

  const getGender = (data: any) => {
    setSelectedGender(data[0]);
  };

  const getTimezone = (data: any, index) => {
    setSelectedTimezone(data[0]);
    timeSlots[index].timezone = data[0].value;
  };
  const getReason = (data: any) => {
    setReason(data[0]);
  };

  const getBirthYear = (data: any) => {
    setYob(data[0]);
  };

  const generateOptionsYearList = () => {
    let minOffset = 3; // current year minus 3 year
    let maxOffset = 80; // Change to whatever you want
    let thisYear = new Date().getFullYear();
    let listDOB = new Array();
    let temp = {...yob};
    for (var i = minOffset; i <= maxOffset; i++) {
      var year = thisYear - i;
      // Year of Birth
      //   temp["birth_year"] = { label: year, value: year };
      listDOB.push({label: year.toString(), value: year.toString()});
    }

    // setYob(temp);
    setOptionsYearList(listDOB);
  };
  return (
    <>
      {pageLoading ? (
        <PageLoader />
      ) : (
        <View>
          {/* <View style={{position:'absolute', top:0, zIndex:1}}>
            
          <HeaderInner
            title={'Request Meeting'}
            type={'findCourse'}
            backroute={'CourseDetail'}
            back={true}
            removeRightHeader={true}
            changingHeight={config.headerHeight}
            navigation={navigation}
          />
          </View> */}
          {/* <View style={{position:'absolute', top:0,zIndex:2, height:32, width:'100%'}}>
            <Image
              style={styles.formFillTimeImage}
              source={require('@images/transactions_bg.png')}
            />
            <View
              style={styles.formFillTimeTextWrapper}>
              <Text style={styles.formFillTimeText}>
                Should take less than 48 seconds
              </Text>
            </View>
          </View> */}
          <HeaderInner
            title={'Request Meeting'}
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
          <View>
            <ScrollView
              style={styles.scrollView}
              contentInsetAdjustmentBehavior="always">
              <View style={styles.container}>
                <View style={[styles.safecontainer]}>
                  <View style={{flexDirection: 'row', marginBottom: 24}}>
                    <View>
                      <Image
                        source={{uri: course.course_image}}
                        style={styles.courseImage}></Image>
                    </View>
                    <View
                      style={{
                        maxWidth: '80%',
                        flexDirection: 'column',
                        // justifyContent: 'space-between',
                        paddingHorizontal: 16,
                        //  marginVertical: 8,
                      }}>
                      <Text
                        style={{
                          // maxWidth: '80%',
                          color: font1,
                          fontSize: 14,
                          lineHeight: 20,
                          fontWeight: '600',
                          marginBottom: 8,
                        }}>
                        {course.title}
                      </Text>
                      <Text style={{color: font2, fontSize: 14}}>
                        by {course.user.first_name} {course.user.last_name}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      // borderWidth:1,
                      padding: 16,
                      marginBottom:12,
                      backgroundColor: background6,
                      borderRadius: 8,
                      paddingHorizontal: 16,
                    }}>
                    <Text style={styles.freeMeetingQues}>
                      Why free meeting is important?
                    </Text>
                    <View>
                    
                    
                    <Text style={styles.reasonForMeeting}>
                      Our teachers are masters of their craft and their time is
                      very precious,
                    
                    {readMore ? (
                      <>
                        <Text style={styles.reasonForMeeting}>
                          but we also feel that you need to get to know your
                          teacher before signing up and hence this free session:
                        </Text>
                        

                        
                      </>
                    ) : (
                      <TouchableOpacity onPress={() => setReadMore(true)}>
                        <Text
                          style={[styles.reasonForMeeting, styles.readMore]}>
                          ...read more
                        </Text>
                      </TouchableOpacity>
                    )}
                    </Text>
                    {readMore ? 
                    <>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                          <Text>{'\u2022'}</Text>
                          <Text style={{flex: 1, paddingLeft: 5}}>
                            Discuss your learning goals and customize topics;
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 8}}>
                          <Text>{'\u2022'}</Text>
                          <Text style={{flex: 1, paddingLeft: 5}}>
                            Ask where to buy instruments;
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 8}}>
                          <Text>{'\u2022'}</Text>
                          <Text style={{flex: 1, paddingLeft: 5}}>
                            Teacher will assess and recommend the right course
                            level for you;
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 8}}>
                          <Text>{'\u2022'}</Text>
                          <Text style={{flex: 1, paddingLeft: 5}}>
                            Discuss and finalize convenient session timings.
                          </Text>

                        </View>
                        <TouchableOpacity onPress={() => setReadMore(false)}>
                          <Text
                            style={[styles.reasonForMeeting, styles.readMore, {alignSelf:'flex-end'}]}>
                            read less
                          </Text>
                        </TouchableOpacity>
                        </>
                    : 
                    null}
                    
                    </View>

                  </View>
                  {/* <Text style={styles.contactHeader}>Contact Information</Text> */}
                  {/* {isLoggedIn ? (
                    <Text style={styles.meeting_details}>
                      Your free meeting class details will be sent to this email
                      address{' '}
                      <Text style={styles.text_primary}>{userData.email}</Text>
                    </Text>
                  ) : null} */}

                  <View style={styles.formGroup}>
                    <Controller
                      control={control}
                      rules={{required: true}}
                      name="guest_firstname"
                      defaultValue={isLoggedIn ? userData.first_name : null}
                      render={({field: {onChange, value, onBlur}}) => (
                        <TextField
                          // theme={{colors: {primary: font2}}}
                          // style={styles.input}
                          mode="outlined"
                          label="First Name*"
                          value={value}
                          onBlur={onBlur}
                          onChangeText={value => onChange(value)}
                        />
                      )}
                    />
                    {errors.guest_firstname && (
                      <Text style={styles.errorText}>
                        Enter first name
                      </Text>
                    )}
                  </View>
                  <View style={styles.formGroup}>
                    <Controller
                      control={control}
                      rules={{required: true}}
                      defaultValue={isLoggedIn ? userData.last_name : undefined}
                      name="guest_lastname"
                      render={({field: {onChange, value, onBlur}}) => (
                        <TextField
                          // style={styles.input}
                          theme={{colors: {primary: font2}}}
                          mode="outlined"
                          label="Last Name*"
                          value={value}
                          onBlur={onBlur}
                          onChangeText={value => onChange(value)}
                        />
                      )}
                    />
                    {errors.guest_lastname && (
                      <Text style={styles.errorText}>
                        Enter last name
                      </Text>
                    )}
                  </View>
                  <View style={styles.formGroup}>
                    <Controller
                      control={control}
                      rules={{
                        required: true,
                        pattern: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
                      }}
                      name="guest_email"
                      defaultValue={isLoggedIn ? userData.email : null}
                      render={({field: {onChange, value, onBlur}}) => (
                        <TextField
                          // style={styles.input}
                          mode="outlined"
                          theme={{colors: {primary: font2}}}
                          label="Email Address*"
                          placeholder="Enter your email"
                          value={value}
                          onBlur={onBlur}
                          onChangeText={value => onChange(value)}
                        />
                      )}
                    />
                    {errors.guest_email && (
                      <Text style={styles.errorText}>Enter an email address</Text>
                    )}
                    {errors.guest_email &&
                      errors.guest_email.type === 'pattern' && (
                        <Text style={styles.errorText}>
                          Enter a valid email
                        </Text>
                      )}
                  </View>
                  <View style={[styles.formGroup, styles.phone]}>
                    <Text style={[styles.inputLabel, {position: 'absolute', zIndex:999, top:-5, fontSize:12, backgroundColor:'#fff', left:8, paddingHorizontal:4}]}>Mobile Number*</Text>
                    <Controller
                      control={control}
                      rules={{required: true}}
                      defaultValue={phoneNumber}
                      name="number"
                      render={({field: {onChange, value, onBlur}}) => (
                        <PhoneInput
                          containerStyle={styles.countryCode}
                          textContainerStyle={styles.mobileNumber}
                          defaultValue={value}
                          onChangeCountry={e =>
                            setCountryCode(e.callingCode[0])
                          }
                          defaultCode={
                            isLoggedIn ? userData.ip_country_code : 'IN'
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
                      <Text style={styles.errorText}>Enter mobile number</Text>
                    ) : null}
                  </View>
                  {/* <View style={styles.formGroup}>
                        <Text style={styles.inputLabel}>
                          Student's Birth Year *
                        </Text>
                        <CustomDropdown
                          config={{color: 'rgb(44, 54, 65)'}}
                          onChangeVal={getBirthYear}
                          data={optionsYearList}
                          selectedIds={[]}
                          label={yob ? yob.label : 'Select Birth Year'}
                          backTitle={'Select Birth Year'}
                        />
                        {yob === undefined && submitRequested ? (
                          <Text style={styles.errorText}>Required *</Text>
                        ) : null}
                      </View> */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                    }}>
                    {/* <View style={[styles.formGroup,{maxWidth:'48%', marginTop:10}]}>
                       
                      {/* <SelectDropdown
                      buttonStyle={{backgroundColor:'#fff', borderRadius:8, borderColor:font2, borderWidth:1, height:58, maxWidth:'100%'}}
                      data={gender}
                      onSelect={(selectedItem, index) => {
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                      }}
                      rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                      }}
                    /> 
                    </View> */}
                    <View
                      style={[styles.formGroup, {width: '48%'}]}>
                      <CustomDropdown
                     
                        topLabel={selectedGender ? 'Gender *' : undefined}
                        config={{color: '#fff'}}
                        onChangeVal={getGender}
                        data={gender}
                        selectedIds={[]}
                        label={
                          selectedGender ? selectedGender.value : 'Gender *'
                        }
                        backTitle={'Select Gender'}
                      />
                      {selectedGender === undefined && submitRequested ? (
                        <Text style={styles.errorText}>Select gender</Text>
                      ) : null}
                    </View>
                    <View style={[styles.formGroup, {width: '48%'}]}>
                      <Controller
                        control={control}
                        rules={{required: true, pattern: /^[0-9]*$/}}
                        name="age"
                        render={({field: {onChange, value, onBlur}}) => (
                          <TextField
                            // theme={{colors: {primary: font2}}}
                            // style={styles.input}
                            mode="outlined"
                            label="Age *"
                            value={value}
                            keyboardType={'numeric'}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                          />
                        )}
                      />
                      {errors.age && (
                        <Text style={styles.errorText}>Enter age</Text>
                      )}
                      {errors.age && errors.age.type === 'pattern' && (
                        <Text style={styles.errorText}>
                          Age should be a number
                        </Text>
                      )}
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                    }}>
                    <View style={[styles.formGroup, {width: '48%'}]}>
                      <Controller
                        control={control}
                        rules={{required: true}}
                        name="city"
                        defaultValue={isLoggedIn ? userData.ip_city : null}
                        render={({field: {onChange, value, onBlur}}) => (
                          <TextField
                            // style={styles.input}
                            // theme={{colors: {primary: font2}}}
                            mode="outlined"
                            label="City/Town *"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                          />
                        )}
                      />
                      {errors.city && (
                        <Text style={styles.errorText}>Enter city / town</Text>
                      )}
                    </View>
                    <View style={[styles.formGroup, {width: '48%'}]}>
                      <CustomDropdown
                        topLabel={selectedCountry ? 'Country *' : undefined}
                        config={{color: '#fff'}}
                        onChangeVal={getCountry}
                        data={countryList}
                        selectedIds={[]}
                        label={
                          selectedCountry ? selectedCountry.value : 'Country *'
                        }
                        backTitle={'Select Country'}
                      />
                      {selectedCountry === undefined && submitRequested ? (
                        <Text style={styles.errorText}>Enter Country</Text>
                      ) : null}
                    </View>
                  </View>
                  {/* <Text style={styles.inputLabel}>Student's Gender</Text>
                        <Controller
                          control={control}
                          rules={{required: true}}
                          name="gender"
                          render={({field: {onChange, value, onBlur}}) => (
                            <RadioButton.Group
                              onValueChange={newValue => onChange(newValue)}
                              value={value}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    margin: 5,
                                  }}>
                                  <RadioButton value="M" />
                                  <Text style={styles.color_primary}>Male</Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    margin: 5,
                                  }}>
                                  <RadioButton value="F" />
                                  <Text style={styles.color_primary}>
                                    Female
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    margin: 5,
                                  }}>
                                  <RadioButton value="O" />
                                  <Text style={styles.color_primary}>
                                    Others
                                  </Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          )}
                        />
                        {errors.gender && (
                          <Text style={styles.errorText}>
                            Please specify your gender *
                          </Text>
                        )} */}

                  <View style={styles.formGroup}>
                    {/* <Text style={styles.inputLabel}>
                      Reason for requesting a free class *
                    </Text> */}
                    <CustomDropdown
                      topLabel={
                        reason
                          ? 'Reason for Requesting a Free Class *'
                          : undefined
                      }
                      config={{color: '#fff'}}
                      onChangeVal={getReason}
                      data={reasons}
                      selectedIds={[]}
                      label={
                        reason
                          ? reason.value
                          : 'Reason for Requesting a Free Class *'
                      }
                      backTitle={'Select Reason'}
                    />

                    {reason === undefined && submitRequested ? (
                      <Text style={styles.errorText}>Select the reason</Text>
                    ) : null}
                    {/* <Controller
              control={control}
              name="reason"
              render={({field: {onChange, value, onBlur}}) => (
            <Picker
  selectedValue={value}
  onValueChange={(itemValue, itemIndex) =>
    onChange(itemValue)
  }>
      {reason.map(r => {
          return(
            <Picker.Item label={r.label} value={r.value} />
          )
      })}
  
// </Picker>
<DropDownPicker
zIndex={10000}
              open={open}
              value={value}
              items={reason}
              setOpen={setOpen}
              setValue={(value) => onChange(value)}
              setItems={setReason}
            />
)}/> */}
                    {/* <DropDownPicker
              open={open}
              value={value}
              items={reason}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setReason}
            /> */}
                  </View>

                  {/* <Controller
              control={control}
              name="number"
              render={({field: {onChange, value, onBlur}}) => (
                // <TextInput
                //   style={[styles.input, styles.mobileNumber]}
                //   mode="outlined"
                //   label="Mobile Number *"
                //   placeholder="Enter your number"
                //   value={value}
                //   onBlur={onBlur}
                  
                //   onChangeText={value => onChange(value)}
                // />
              )}
            /> */}

                  {/* <PhoneInput
                ref={phone}
                onPressFlag={this.onPressFlag}
                initialCountry={'us'}
                initialValue="13178675309"
                textProps={{
                    placeholder: 'Enter a phone number...'
                }}
            /> */}
                  <View style={styles.formGroup}>
                    {/* <Text style={styles.inputLabel}>
                      Meeting Platform
                    </Text> */}
                    <CustomDropdown
                      topLabel={
                        meetingPlatform ? 'Meeting Platform *' : undefined
                      }
                      config={{color: '#fff'}}
                      onChangeVal={getMeetingPlatform}
                      data={platforms}
                      selectedIds={[]}
                      label={
                        meetingPlatform
                          ? meetingPlatform.value
                          : 'Meeting Platform *'
                      }
                      backTitle={'Select a Meeting Platform'}
                    />

                    {meetingPlatform === undefined && submitRequested ? (
                      <Text style={styles.errorText}>Select the meeting platform</Text>
                    ) : null}
                  </View>
                  {showField ? (
                    <View style={styles.formGroup}>
                      <Controller
                        control={control}
                        name={meetingPlatform.code}
                        render={({field: {onChange, value, onBlur}}) => (
                          <TextField
                            // style={styles.input}
                            // theme={{colors: {primary: font2}}}
                            mode="outlined"
                            label={meetingPlatform.label}
                            value={value}
                            onBlur={onBlur}
                            onChangeText={(value : any) => onChange(value)}
                          />
                        )}
                      />
                      {/* Add error condition to this */}
                      {/* {submitRequested ? } */}
                    </View>
                  ) : null}
                  {/* {course.taught_on && course.taught_on.length > 0 ? (
                    <>
                      {course.taught_on.map((taught_on: any, index: number) => {
                        return (
                          <>
                            {taught_on.code !== 'I' ? (
                              <View key={taught_on.id} style={styles.formGroup}>
                                <Controller
                                  control={control}
                                  name={taught_on.code}
                                  render={({
                                    field: {onChange, value, onBlur},
                                  }) => (
                                    <TextInput
                                      style={styles.input}
                                      theme={{colors: {primary: font2}}}
                                      mode="outlined"
                                      label={taught_on.custom_name}
                                      value={value}
                                      onBlur={onBlur}
                                      onChangeText={value => onChange(value)}
                                    />
                                  )}
                                />
                              </View>
                            ) : null}
                          </>
                        );
                      })}
                    </>
                    ) : null}*/}

                  <Text style={styles.time_slots}>
                    Share your 3-4 preferred time slots
                  </Text>
                  {timeSlots &&
                    timeSlots.map(
                      (item: any, index: number) => (
                        <CustomForm
                          key={index}
                          index={index}
                          data={item}
                          timeSlots={timeSlots}
                          setTimeSlots={setTimeSlots}
                          addMoreSlots={addMoreSlots}
                          removeTimeSlot={removeTimeSlot}
                        />
                      ),

                      //                   <>
                      // <View style={{backgroundColor:background2, borderRadius: 15, padding:16, marginBottom: 8}}>

                      //               <View style={styles.formGroup}>

                      //               <TouchableOpacity onPress={()=>{showDateTimePicker();}}>

                      //                           <Text
                      //                             style={styles.inputText}

                      //                             onPress={()=>{showDateTimePicker()}}

                      //                             //label='Date'
                      //                             //value={selectedDate}
                      //                             >
                      //                            {selectedDate ? selectedDate : "Date"}

                      //                           </Text>
                      //                           <DateTimePickerModal
                      //                             minimumDate={new Date()}
                      //                             isVisible={isDateTimePickerVisible}
                      //                             mode="date"
                      //                             onConfirm={selectedDate => {
                      //                               handleDatePicked(selectedDate, index);
                      //                             }}
                      //                             onCancel={hideDateTimePicker}
                      //                           />
                      //                         </TouchableOpacity>
                      //                         <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:12}}>
                      //                           <View style={{width:'48%'}} >

                      //                             {/* <Text style={styles.labelContent}>From </Text> */}
                      //                             <CustomDropdown
                      //                             topLabel = {startTime ? 'From' : undefined}
                      //                               config={{ color: "#81878D" }}
                      //                               onChangeVal={changeStartTime}
                      //                               index={index}
                      //                               data={startTimeRangeList}
                      //                               selectedIds={[]}
                      //                               label={startTime ? startTime : "From"}
                      //                               backTitle={"Select Class Start Time"}
                      //                             />
                      //                           </View>

                      //                           <View style={{width:'48%'}} >
                      //                             {/* <Text style={styles.labelContent}>To</Text> */}
                      //                             <CustomDropdown
                      //                             topLabel = {endTime ? 'To' : undefined}
                      //                             index={index}
                      //                               config={{ color: "#81878D" }}
                      //                               onChangeVal={changeEndTime}
                      //                               data={endTimeRangeList}
                      //                               selectedIds={[]}
                      //                               label={endTime ? endTime : "To"}
                      //                               backTitle={"Select Class End Time"}
                      //                             />
                      //                           </View>
                      //                         </View>
                      //                       </View>
                      //                       <View style={styles.formGroup}>
                      //                 <CustomDropdown
                      //                  topLabel = {selectedTimezone ? 'Timezone' : undefined}
                      //                   config={{color: 'rgb(44, 54, 65)'}}
                      //                   onChangeVal={getTimezone}
                      //                   index={index}
                      //                   data={timezones}
                      //                   selectedIds={[]}
                      //                   label={
                      //                     selectedTimezone ? selectedTimezone.value : 'Timezone'
                      //                   }
                      //                   backTitle={'Select Timezone'}
                      //                 />
                      //                 {selectedTimezone === undefined && submitRequested ? (
                      //                   <Text style={styles.errorText}>Required *</Text>
                      //                 ) : null}
                      //               </View>
                      //               {timeSlots.length>1 ? <TouchableOpacity onPress={()=>removeTimeSlot(index)} style={{flexDirection:'row', justifyContent:'flex-end'}}>
                      //               <Text style={{color:brandColor, fontSize:14}}>Remove</Text>
                      //               </TouchableOpacity> : null}

                      //               </View>
                      //               {index===timeSlots.length-1 && timeSlots.length<4 ? <TouchableOpacity style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-start', borderWidth:1, borderColor:secondaryColorBorder, borderRadius:58, padding:7, width:'48%', marginTop:8}}
                      //               onPress={()=>addMoreSlots(index)}>
                      //                 <Add/><Text style={{color:secondaryColor, fontSize:14, fontWeight:'600', marginLeft:12}}>Add More Slots</Text>
                      //               </TouchableOpacity> : null}
                      //               </>
                    )}

                  <View style={[styles.formGroup, {marginTop: 24}]}>
                    <Controller
                      control={control}
                      name="add_info"
                      rules={{maxLength: 5000}}
                      render={({field: {onChange, value, onBlur}}) => (
                        <Textarea
                        
                    containerStyle={StyleCSS.styles.modalTextarea}
                    style={styles.reviewTextArea}
                    onChangeText={(value: any) => {
                          onChange(value);
                          setAddditionalInfo(value);
                        }}
                    defaultValue={value}
                    placeholder={'Additional Information'}
                    placeholderTextColor={font2}
                    underlineColorAndroid={'transparent'}
                  />
                        // <TextField
                        //   // theme={{colors: {primary: font2}}}
                        //   multiline
                        //   mode="outlined"
                        //   label="Additional Information"
                        //   numberOfLines={12}
                        //   style={styles.input}
                        //   placeholder="Let your teacher know about your current knowledge & experience in the art form and goals of learning)"
                        //   value={value}
                        //   onBlur={onBlur}
                        //   onChangeText={value => {
                        //     onChange(value);
                        //     setAddditionalInfo(value);
                        //   }}
                        // />
                      )}
                    />
                    {errors.add_info && (
                      <Text style={styles.errorText}>
                        Should be less than specified characters
                      </Text>
                    )}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}>
                      <Text style={{color: font2, fontSize: 14}}>
                        {additionalInfo.length}/ 5000 Character(s)
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={StyleCSS.styles.lineStyleLight}></View>
                <View style={StyleCSS.styles.modalButton}>
                  <TouchableOpacity
                    style={StyleCSS.styles.cancelButton}
                    onPress={() => {
                      navigation.navigate('CourseDetail');
                    }}>
                    <Text style={StyleCSS.styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={StyleCSS.styles.submitButton}
                    onPress={handleSubmit(onSubmit)}>
                    <Text style={StyleCSS.styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  scrollView: {
    marginTop: config.headerHeight + 32,
    backgroundColor:'white'
  },
  safecontainer: {
    padding: 16,
  },
  // input: {
  //   color: 'rgb(44, 54, 65)',
  //   margin: 0,
  //   fontSize: 14,
  //   // padding: 16,
  //   height: 51.5,
  //   backgroundColor: 'rgb(255, 255, 255)',
  //   // borderRadius: 5,
  //   fontFamily: helper.switchFont('medium'),
  //   // borderWidth: 0.5,
  //   // borderColor: 'rgb(200, 200, 200)',
  // },
  inputLabel: {
    fontFamily: helper.switchFont('medium'),
    fontSize: 14,
    color: font2,
  },
  mobileNumber: {
    flexDirection: 'row',
    justifyContent: 'center',
    color: font1,
    borderLeftColor: dropdownBorder,
  
    borderLeftWidth: 1,
   
     borderTopRightRadius:8,
     borderBottomRightRadius:8,
    
    fontSize: 14,

    backgroundColor: 'rgb(255, 255, 255)',
    // borderTopLeftRadius: 3,
    // borderBottomLeftRadius: 3,
    fontFamily: helper.switchFont('medium'),
  },
  reviewTextArea: {
    width: '100%',
    height: 150,
    color: font1,
    fontSize: 14,
    textAlignVertical: 'top',
    borderRadius: 5,
  },
  submit: {
    width: '48%',
    backgroundColor: brandColor,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 15,
    marginLeft: 5,
  },
  submitText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  formGroup: {
    marginVertical: 12,
  },
  color_primary: {
    color: '#32363a',
  },
  countryCode: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    color: font1,
    marginTop: 5,
    fontSize: 14,
    borderWidth:1,

    borderRadius: 8,

    backgroundColor: 'rgb(255, 255, 255)',
    // borderTopLeftRadius: 3,
    // borderBottomLeftRadius: 3,
    fontFamily: helper.switchFont('medium'),
    // borderWidth: 0.5,
    borderColor: dropdownBorder, //'#CDD6E0',
  },
  phone: {
    width: '100%',
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  cancel: {
    borderWidth: 1,
    borderColor: secondaryColorBorder,
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 15,
    marginRight: 5,
  },
  courseImage: {
    height: 88,
    width: 88,
    resizeMode: 'cover',
    borderRadius: 12,
  },

  cancelText: {
    color: secondaryColor,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  buttonWrapper: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 36,
    color: '#32363a',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#32363a',
    marginTop: 15,
    fontFamily: Helper.switchFont('medium'),
    // fontWeight:'700'
  },

  text_info: {
    color: '#6d7074',
  },
  meeting_details: {
    fontFamily: Helper.switchFont('regular'),
    color: '#6d7074',
    marginBottom: 20,
  },
  text_primary: {
    color: '#32363a',
    fontFamily: Helper.switchFont('medium'),
  },
  contactHeader: {
    fontSize: 30,
    color: '#30363a',
    marginTop: 30,
    fontWeight: '700',
  },
  errorText: {
    color: 'rgb(255,0,0)',
    fontFamily: Helper.switchFont('regular'),
    fontSize: 12,
    marginBottom: 5,
  },
  readMore: {
    color: secondaryColor,
  },
  reasonForMeeting: {
    fontSize: 14,
    marginTop: 8,
    color: font2,
    lineHeight: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // inputText: {
  //   color: "#81878D",
  //   margin: 0,
  //   fontSize: 14,
  //   padding: 20,
  //   backgroundColor: "transparent",
  //   borderRadius: 5,
  //   borderWidth: 0.5,
  //   borderColor: "rgb(194, 194, 194)",
  //   fontFamily: Helper.switchFont("regular"),
  // },
  time_slots: {
    fontSize: 16,
    color: font1,
    fontWeight: '700',
    marginTop: 12,
    marginBottom:12
  },
  inputText: {
    color: '#81878D',
    margin: 0,
    fontSize: 14,
    padding: 20,
    backgroundColor: 'transparent',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'rgb(194, 194, 194)',
    fontFamily: Helper.switchFont('regular'),
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
  },
  freeMeetingQues: {
    fontSize: 14,
    color: font1,
    // lineHeight: 22,
    fontWeight: '600',
  },
  formFillTimeText: {zIndex: 100, fontSize:12, color: '#fff', opacity: 0.7},
});
