import React, {useEffect, useState, FC} from 'react';
import {useSelector} from 'react-redux';
import {
  TouchableOpacity,
  Platform,
  View,
  Text,
  StyleSheet,
  // Image,
  StatusBar,
  Linking,
  ScrollView,
  Dimensions,
  Modal,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native';
import RenderHtml from 'react-native-render-html';
// import {SvgUri} from 'react-native-svg';
import ReactPlayer from 'react-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Rating} from 'react-native-ratings';
import Video from 'react-native-video';
import YoutubePlayer from 'react-native-youtube-iframe';
import Carousel from 'react-native-snap-carousel';
import config from '../../config/Config';
// import Whatsapp from '../../assets/images/whatsapp.svg';
// import Contact from '../../assets/images/contact.svg';
// import OnlineClasses from '../../assets/images/course_details/online-classes.svg';
// import PayAsYouGo from '../../assets/images/course_details/pay-as-you-go.svg';
// import Performers from '../../assets/images/course_details/world-class-performers.svg';
// import AgeGroups from '../../assets/images/course_details/age-groups.svg';
// import SuccessRate from '../../assets/images/course_details/success-rate.svg';
// import Card from '../../assets/images/course_details/card.svg';
import {
  background6,
  brandColor,
  dropdownBorder,
  font1,
  font2,
  lineColor,
  secondaryColor,
} from '../../styles/colors';
// import Drop from '../../assets/images/Drop.svg';
// import Dot from '../../assets/images/dot.svg';
import {setLoginRedirectedFrom, userState} from '../../reducers/user.slice';
// import TP1 from '../../assets/images/course_details/teacherProfile1';
// import TP2 from '../../assets/images/course_details/teacherProfile2';

// import TP3 from '../../assets/images/course_details/teacherProfile3';

// import TP4 from '../../assets/images/course_details/teacherProfile4';

import {
  getTeacherCalender,
  teacherAvailability,
  setTeacherReviews,
  courseState,
  getTeacherReviews,
  getCourseDetail,
  enrollNow,
  iamInterestedinCourse,
} from '../../reducers/courses.slice';
import {
  setLoading,
  setPageLoading,
  loaderState,
} from '../../reducers/loader.slice';
import PageLoader from '../../components/PageLoader';
import helper from '../../utils/helperMethods';
import style from '../../styles/style';
import Accordian from '../../components/Accordian';
import TeacherReview from './TeacherReview';
import {setCurrentCourse} from '../../reducers/courses.slice';
import {
  setCheckoutDataDetails,
  cartDetails,
  setNotLoggedInCheckoutData,
} from '../../reducers/checkout.slice';
import {useAppDispatch} from '../../app/store';
import {setPage} from '../../reducers/checkout.slice';
import HeaderInner from '../../components/HeaderInner';
// @ts-ignore
import Textarea from 'react-native-textarea';
import {CartDetailsData} from '../Dashboard';
const {width, height} = Dimensions.get('screen');

export interface TeacherReviewInterface {
  category: string;
  teacher: string;
}
export interface TeacherCalenderInterface {
  teacherToken: string | undefined;
  classType: string | undefined;
  courseID: string | undefined;
  sortBy?: string | undefined;
}

export interface GetCourseDataInterface {
  course_slug: string;
  category_slug: string;
  teacher_slug: string;
  userToken: string;
  isLoggedIn: boolean;
}

import VideoPlayer from 'react-native-video-player';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import CustomImage from '../../components/CustomImage';
import StyleCSS from '../../styles/style';
import LineDashed from '../../components/LineDashed';
import Helper from '../../utils/helperMethods';
import TextField from '../../components/CustomTextField';
import TeacherReviews from '../../components/TeacherReviews';

type Props = NativeStackScreenProps<RootParamList, 'CourseDetail'>;

export interface CourseEnrollInterface {
  data: any;
  userToken: string;
}

const CourseDetails: FC<Props> = ({navigation, route}: Props) => {
  const propCourse = route.params?.course;
  const [videoId, setVideoId] = useState<string>('');
  const {loading, pageLoading} = useSelector(loaderState);
  const {teacherAttendance, teacherReviews, course, courseDetailStatus} =
    useSelector(courseState);
  const {isLoggedIn, userData, userLocation} = useSelector(userState);
  let i = 0;
  const [rating, setRating] = useState<string>('');
  const [reviewIndex, setReviewIndex] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState<any>({});
  // const {height, width} = useWindowDimensions();
  const dispatch = useAppDispatch();
  const [reviewModalVisible, setReviewModalVisible] = useState<boolean>(false);
  const cardW = width * 0.7;
  const [readMoreSummary, setReadMoreSummary] = useState<boolean>(false);
  const [readMoreDetail, setReadMoreDetail] = useState<boolean>(false);
  const [interested, setInterested] = useState(false);
  const [fullName, setFullName] = useState(
    isLoggedIn ? userData.first_name + ' ' + userData.last_name : undefined,
  );
  const [email, setEmail] = useState(isLoggedIn ? userData.email : undefined);
  const [mobile, setMobile] = useState(
    isLoggedIn ? userData.phone_number : undefined,
  );
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [subject, setSubject] = useState<string | undefined>(course.title);
  const [submitRequested, setSubmitRequested] = useState(false);
  const [validEmail, setValidEmail] = useState(true);
  const [checkoutToken, setCheckoutToken] = useState<string | undefined>(
    undefined,
  );
  const [reviewPopupOpen, setReviewPopupOpen] = useState<boolean>(false);

  const errors = {
    fullName: 'Enter full name',
    email: 'Enter an email address',
    mobile: 'Enter mobile number',
    subject: 'Please add the subject.',
    message: 'Enter a message of at least 20 characters',
  };
  const dayList = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  useEffect(() => {
    let data: GetCourseDataInterface = {
      course_slug: route.params?.course_slug,
      category_slug: route.params?.category_slug,
      teacher_slug: route.params?.teacher_slug,
      userToken: isLoggedIn ? userData.token : undefined,
      isLoggedIn: isLoggedIn,
    };
    dispatch(setPageLoading(true));
    dispatch(getCourseDetail(data))
      .unwrap()
      .then(response => {
        console.log(response)
        if (response.data.status === 'success') {
          dispatch(setCurrentCourse(response.data.data));
          dispatch(setPageLoading(false));
        } else if (response.data.status === 'failure') {
          dispatch(setPageLoading(false));
        }
      })
      .catch(err => {
        dispatch(setPageLoading(false));
      });
  }, []);

  useEffect(() => {
    Object.keys(course).length>0 && course.pricing && setSelectedPrice(course.pricing[0]);
  }, [course]);

  // useEffect(() => {
  //   if (Object.keys(course).length !== 0) {
  //     //Getting the teachers availability schedule
  //     let details: TeacherCalenderInterface = {
  //       teacherToken: course.user.user_token,
  //       classType: 'G',
  //       courseID: course.id,
  //     };
  //     dispatch(getTeacherCalender(details))
  //       .unwrap()
  //       .then(response => {
  //         if (response?.data?.status === 'success') {
  //           dispatch(teacherAvailability(response?.data.data));
  //         } else if (response?.data.status === 'failure') {
  //           //console.log(response?.data);
  //         }
  //       })
  //       .catch(err => {});

  //     //Getting Students' reviews for teacher
  //     let data: TeacherReviewInterface = {
  //       category: course.category_detail.seo_slug_url,
  //       teacher: course.user.seo_slug_url,
  //     };
  //     dispatch(getTeacherReviews(data))
  //       .unwrap()
  //       .then(response => {
  //         if (response.data.status === 'success') {
  //           dispatch(setTeacherReviews(response.data.data));
  //         } else if (response.data.status === 'failure') {
  //           //console.log(response.data);
  //         }
  //       })
  //       .catch(err => {
  //         //console.log(err);
  //       });
  //   }
  // }, [course]);

  useEffect(() => {
    if (Object.keys(course).length !== 0) {
      dispatch(setLoading(true));
      var regExp =
        /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
      var match = course.video_url.match(regExp);
      setVideoId(match[1]);
      dispatch(setLoading(false));
    }
  }, [course]);

  // const getTeacherAvailability =(token, id) =>{
  //   dispatch(getTeacherCalender(course.user.user_token, 'G', course.id))
  //     .unwrap()
  //     .then(response => {
  //       if (response.data.status === 'success') {
  //         dispatch(teacherAvailability(response.data.data));
  //       } else if (response.status === 'failure') {
  //       }
  //     })
  //     .catch(err => {
  //     });
  // }

  // const getVideoId =(video_url)=>{
  //       if(video_url){
  //   dispatch(setLoading(true));
  //   var regExp =
  //     /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  //   var match = video_url.match(regExp);
  //   setVideoId(match[1]);
  //   dispatch(setLoading(false));
  //       }
  // }

  // //Getting Teacher reviews
  // const getTeacherReview =()=>{
  //   let data = {
  //     category: course.category_detail.seo_slug_url,
  //     teacher: course.user.seo_slug_url
  //   };
  //   dispatch(getTeacherReviews(data))
  //   .unwrap()
  //     .then(response => {
  //       if (response.data.status === 'success') {
  //         dispatch(setTeacherReviews(response.data.data));
  //       } else if (response.status === 'failure') {
  //       }
  //     })
  //     .catch(err => {
  //     });
  // }

  const validateEmail = () => {
    setValidEmail(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(email));
  };

  //function to handle the Enroll Now Button
  const handleEnrollment = (purchase_type: string) => {
    if (isLoggedIn) {
      let currency_type =
        course.user.ip_country === 'India' &&
        ((!isLoggedIn && userLocation.data.country === 'India') ||
          (isLoggedIn && userData.ip_country === 'India'))
          ? 'INR'
          : 'USD';
      let total_cpw = selectedPrice.previous_purchase.classes_per_week
        ? selectedPrice.previous_purchase.classes_per_week
        : course.classes_per_week;
      let total_weeks = selectedPrice.previous_purchase.number_of_weeks
        ? selectedPrice.previous_purchase.number_of_weeks
        : 2;
      let total_class = total_weeks * total_cpw;

      let enrollData = {
        course: course.id,
        price_per_class:
          currency_type === 'INR'
            ? selectedPrice.final_INR
            : selectedPrice.final_USD,
        currency_type: currency_type,
        classes_per_week: total_cpw,
        number_of_weeks: total_weeks,
        number_of_class: total_class,
        billing_first_name: userData.first_name,
        billing_last_name: userData.last_name,
        billing_street_address: '',
        billing_city: userData.ip_city,
        billing_pin_code: '',
        billing_state: userData.ip_state,
        billing_country: userData.ip_country,
        class_type: selectedPrice.id,
        purchase_type: purchase_type,
        discounts: course.discounts ? course.discounts : '',
        timezone: userData.timezone,
        device_type: Platform.OS,
        price_per_class_inr: selectedPrice.final_INR,
      price_per_class_usd: selectedPrice.final_USD
      };

      const finaldata: CourseEnrollInterface = {
        data: enrollData,
        userToken: userData.token,
      };

      dispatch(setPageLoading(true));
      dispatch(setPage('C'));
      dispatch(enrollNow(finaldata))
        .unwrap()
        .then(response => {
          dispatch(setPageLoading(false));
          if (response.data.status === 'success') {
            dispatch(setCheckoutDataDetails(response.data.data));
            navigation.navigate('Checkout', {
              screen: 'CartPage',
              params: {
                checkoutToken: response.data.data.checkout_token,
              },
            });
          }
        })
        .catch(err => {
          dispatch(setPageLoading(false));
          console.log(err);
        });
    } else {
      dispatch(setLoginRedirectedFrom('CD'));

      
      let total_cpw = selectedPrice.previous_purchase.classes_per_week
        ? selectedPrice.previous_purchase.classes_per_week
        : course.classes_per_week;
      let total_weeks = selectedPrice.previous_purchase.number_of_weeks
        ? selectedPrice.previous_purchase.number_of_weeks
        : 2;
      let total_class = total_weeks * total_cpw;

      let data = {
        total_cpw: total_cpw,
        total_weeks: total_weeks,
        total_class: total_class,
        selectedPrice: selectedPrice
      }

      dispatch(setNotLoggedInCheckoutData(data));
      
      navigation.navigate('Login', {
        nextRoute: 'CourseDetail',
      });
    }
  };

  useEffect(() => {});

  //function to remove the empty tags in the received response in html format
  const removeEmptyTags = (HTMLContent: string) => {
    let removedNBSP = HTMLContent;
    removedNBSP = removedNBSP
      ? removedNBSP.replace(/&nbsp;/gi, ' ')
      : removedNBSP;
    removedNBSP = removedNBSP
      ? removedNBSP.replace(/<[^\/][^>]*>\s*(<[^>]*>)*<\/[^>]*>/gs, '')
      : removedNBSP;
    return removedNBSP;
  };

  //function to open the dialler
  const dialCall = (): void => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = 'tel:${+91-97400-50326}';
    } else {
      phoneNumber = 'telprompt:${+91-97400-50326}';
    }
    Linking.openURL(phoneNumber).then(supported => {
      if (supported) {
        return Linking.openURL(phoneNumber).catch(() => null);
      }
    });
  };

  const handleTeacherAvailability = () => {
    //opens calender
  };
  const handleReviewModal = (index: number) => {
    setReviewIndex(index);
    setReviewModalVisible(true);
  };
  //the arrows on the side of the caraousal hold no functionality as of now [17 feb 2022]
  //The student review card which is rendered in the flatlist

  // const LoadReviews = (review: any, index: number) => {
  //   return (
  //     <>
  //       {reviewModalVisible && (
  //         <TeacherReview
  //           reviewModalVisible={reviewModalVisible}
  //           setReviewModalVisible={setReviewModalVisible}
  //           index={reviewIndex}
  //           teacherReviews={teacherReviews}
  //         />
  //       )}
  //       <View style={[styles.reviewWrapper]}>
  //         <View style={styles.reviewRating}>
  //           <Rating
  //             // ratingColor="#277FD9"
  //             // type="custom"
  //             startingValue={review.item.rating}
  //             readonly
  //             ratingCount={5}
  //             imageSize={20}
  //             fractions={10}
  //           />
  //         </View>

  //         <Text style={styles.subHeading2}>{review.item.title}</Text>
  //         {teacherReviews[0].review ? (
  //           <View style={styles.reviewBody}>
  //             {/* <RenderHtml
  //               baseStyle={styles.body2}
  //               contentWidth={width}
  //               source={{
  //                 html:
  //                   review.item.review.length > 250
  //                     ? removeEmptyTags(review.item.review.substring(0, 250))
  //                     : removeEmptyTags(review.item.review),
  //               }}
  //             /> */}
  //           </View>
  //         ) : null}

  //         <TouchableOpacity
  //           style={styles.readMore}
  //           onPress={() => handleReviewModal(review.index)}>
  //           <Text style={[styles.subHeading3, styles.brandColorText]}>
  //             Read More
  //           </Text>
  //         </TouchableOpacity>
  //         <View style={styles.student}>
  //           {review.item.student && review.item.student.profile_pic ? (
  //             <CustomImage
  //               style={styles.studentDp}
  //               height={48}
  //               width={48}
  //               uri={review.item.student.profile_pic}
  //             />
  //           ) : // <Image
  //           //   style={styles.studentDp}
  //           //   source={{
  //           //     uri: review.item.student.profile_pic,
  //           //   }}
  //           // />
  //           null}
  //           <View>
  //             {review.item.student && review.item.student.name ? (
  //               <Text style={styles.subHeading2}>
  //                 {review.item.student.name}
  //               </Text>
  //             ) : null}
  //             <Text style={styles.body3}>
  //               Updated{' '}
  //               {moment(review.item.review_datetime).format('MMM DD, YYYY')}
  //             </Text>
  //           </View>
  //         </View>
  //       </View>
  //     </>
  //   );
  // };
  const addToCart = (data: any): void => {
    // dispatch(setCheckoutDataDetails({}));

    const finalData: CartDetailsData = {
      courseToken: data.course_token,
      classType: data.pricing[0].id,
      userToken: userData.token,
    };

    dispatch(cartDetails(finalData))
      .unwrap()
      .then(response => {
        dispatch(setPageLoading(true));
        if (response.data.status === 'success') {
          setCheckoutToken(response.data.data.checkout_token);
        } else if (response.data.status === 'failure') {
          dispatch(setPageLoading(false));
          Alert.alert('', response.data.error_message.message, [
            {text: 'Okay', style: 'cancel'},
          ]);
        }
      })
      .catch(err => {
        dispatch(setPageLoading(false));
      });
  };
  useEffect(() => {
    if (checkoutToken) {
      navigation.navigate('Checkout', {
        screen: 'CartPage',
        params: {
          checkoutToken: checkoutToken,
        },
      });
    }
  }, [checkoutToken]);

  const handleInterested = () => {
    setInterested(true);
  };
  const handleInterestedData = () => {
    setSubmitRequested(true);
    if (fullName && mobile && email && subject && message) {
      let interestedData;
      if (isLoggedIn) {
        interestedData = {
          course: course.id,
          guest_name: userData.first_name,
          guest_email: email,
          subject: course.title,
          message: message,
          phone_number: mobile,
        };
        // userToken = props.session.token;
      } else {
        interestedData = {
          course: course.id,
          guest_name: fullName,
          guest_email: email,
          subject: course.title,
          message: message,
          phone_number: mobile,
        };
      }

      const finalData = {
        data: interestedData,
        userToken: isLoggedIn ? userData.token : undefined,
        isLoggedIn: isLoggedIn,
      };
      dispatch(iamInterestedinCourse(finalData))
        .unwrap()
        .then((response: any) => {
          setInterested(false);
          dispatch(setPageLoading(false));
          if (response?.data.status === 'success') {
            navigation.navigate('ActionStatus', {
              messageStatus: 'success',
              messageTitle: 'Thank You!',
              messageDesc: response.data.error_message.message,
              timeOut: 7000,
              backRoute: 'CourseDetail',
            });
          } else if (response?.data.status === 'failure') {
            navigation.navigate('ActionStatus', {
              messageStatus: 'failure',
              messageTitle: 'Sorry!',
              messageDesc: response?.data.error_message.message,
              timeOut: 7000,
              backRoute: 'CourseDetail',
            });
          }
        })
        .catch(error => {
          dispatch(setPageLoading(false));
          Alert.alert(error);
        });
    } else {
    }
  };
  const isCarousel = React.useRef(null);
  const course_benefits = 'Course Specific Benefits';
  const ipassio_edge = 'The ipassio Edge';
  const about_teacher = 'About Teacher';
  const handleFreeMeeting = () => {
    navigation.navigate('RequestMeeting');
  };
  console.log(course)
  return (
    <>
      {/* {loading && <DialogLoader />} */}

      {pageLoading ? (
        <PageLoader />
      ) : Object.keys(course).length>0 ? (
        <>
          <StatusBar translucent  />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            {/* <Back /> */}
            
             <CustomImage
              height={32}
              width={32}
              uri={`${config.media_url}back-arrow.svg`}
            />
          </TouchableOpacity>
          {/* <HeaderInner 
        type={'findCourse'}
        title={''}
        back={true}
        navigation={navigation}/> */}
          <ScrollView
          // style={{marginTop:config.headerHeight}}
          >
           
            {!loading && videoId ? (
              <View
              style={{backgroundColor:'#000', paddingTop:Platform.OS==='ios'? 36:0}}
              >
                {/* have to be changed to a non youtube specific carousal */}
                <YoutubePlayer
                  height={222}
                  play={false}
                  videoId={`${videoId}`}
                />
              </View>
            ) : // )
            // : //   <View style={{height:220}}>
            // <VideoPlayer
            //   video={{uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'}}
            //   // videoWidth={1600}
            //   videoHeight={height}
            //   // thumbnail={{uri: 'https://i.picsum.photos/id/866/1600/900.jpg'}}
            // />
            //    <Video   // Can be a URL or a local file.
            //   //  controls
            // source={{uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'}}                                    // Store reference
            // onError={()=>{console.log("not loading")}}       // Callback when video cannot be loaded
            // style={styles.backgroundVideo}
            //  />):
            // </View>
            null}

            <View style={styles.main}>
              <View style={styles.courseWrapper}></View>
              <Text style={StyleCSS.styles.mainTitle}>{course.title}</Text>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  // dispatch(setPageLoading(true));
                  // navigation.push('TeacherDetails', {
                  //   teacher_slug: course.user.seo_slug_url,
                  //   category_slug: course.category_slug_url,
                  // });
                }}>
                <View
                  style={{
                    marginTop: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    // justifyContent: 'space-between',
                    flexWrap: 'wrap',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {course.course_level &&
                      course.course_level.map((level: any, i: number) => {
                        return (
                          <View
                            style={
                              {
                                // backgroundColor: map.get(level.code),
                                // borderRadius: 43,
                              }
                            }>
                            {i > 0 ? (
                              <Text style={styles.cardDetail}>
                                , {level.name}
                              </Text>
                            ) : (
                              <Text style={styles.cardDetail}>
                                {level.name}
                              </Text>
                            )}
                          </View>
                        );
                      })}
                  </View>

                  {course.rating && course.rating.total_count && course.rating.total_count > 0 ? (
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                      <View style={{marginHorizontal: 12}}>
                        <CustomImage
                          height={5}
                          width={5}
                          uri={`${config.media_url}dot.svg`}
                        /> 
                      </View>
                      <TouchableOpacity onPress={()=>setReviewPopupOpen(true)}>
                        <View style={styles.courseRating}>
                          <Rating
                            ratingColor={secondaryColor}
                            type="custom"
                            tintColor="#fff"
                            ratingBackgroundColor="#c8c7c8"
                            startingValue={course.rating.avg_review}
                            readonly
                            ratingCount={5}
                            imageSize={16}
                            fractions={10}
                          />
                          <View
                            style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.courseRatingCount}>
                            {course.rating.avg_review}/5{"  "} |{"  "} {course.rating.total_count} reviews{' '} 
                            </Text>
                            <CustomImage uri={`${config.media_url}drop.svg`} height={12} width={12}/>
                            {/* <View>
                              <CustomImage
                                height={12}
                                width={12}
                                uri={`${config.media_url}drop.svg`}
                              />
                            </View> */}
                          </View>
                      </View>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
                <View style={{marginVertical: 16}}>
                  <LineDashed />
                </View>
                <Text style={styles.teacher}>
                  {course.user?.first_name} {course?.user?.last_name}
                </Text>
              </TouchableOpacity>
              {course.experience ? <Text style={(StyleCSS.styles.contentText, styles.experience)}>
                {course.experience} years experience
              </Text> : null}
              {course.user && course.user.spotlight ? (
                <Text
                  style={[
                    StyleCSS.styles.contentText,
                    StyleCSS.styles.fw400,
                    {lineHeight: 20, marginTop: 16},
                  ]}>
                  {course.user.spotlight}
                </Text>
              ) : null}
              <View style={styles.courseInfo}>
                {course && course.user && 
                <Text style={styles.price}>
                  {!isLoggedIn ? (
                    userLocation?.data?.country === 'IN' ? (
                      course?.user.ip_country === 'India' ? (
                        <Text style={styles.price}>
                          {`Rs. ${
                            course && course.pricing && course?.pricing[0].INR
                          }`}{' '}
                          <Text style={StyleCSS.styles.contentText}>
                            per class (Tax Exclusive)
                          </Text>
                        </Text>
                      ) : (
                        `US $${
                          course && course.pricing && course?.pricing[0].USD
                        }`
                      )
                    ) : (
                      `US $${
                        course && course.pricing && course?.pricing[0].USD
                      }`
                    )
                  ) : userData?.ip_country === 'India' ? (
                    course?.user.ip_country === 'India' ? (
                      <Text style={styles.price}>
                        {`Rs. ${
                          course && course.pricing && course?.pricing[0].INR
                        }`}{' '}
                        <Text style={StyleCSS.styles.contentText}>
                          per class (Tax Exclusive)
                        </Text>
                      </Text>
                    ) : (
                      `US $${
                        course && course.pricing && course?.pricing[0].USD
                      }`
                    )
                  ) : (
                    `US $${course && course.pricing && course?.pricing[0].USD}`
                  )}{' '}
                </Text>}
                <Text style={[StyleCSS.styles.contentText, {marginTop: 5}]}>
                  for 1-on-1, {course.class_duration} mins class{' '}
                </Text>
                <Text style={[StyleCSS.styles.labelText, {marginTop: 16}]}>
                  Recommended
                </Text>
                <Text style={[StyleCSS.styles.contentText, {marginTop: 6}]}>
                  {course.classes_per_week}{' '}
                  {course.classes_per_week === 1 ? 'class' : 'classes'} per
                  week{' '}
                   <Text style={[StyleCSS.styles.labelText, {marginTop: 16}]}>
                    {' '}
                    |{' '}
                  </Text>
                  {course.level_up_week ? course.level_up_week :null}
                </Text>
                <View style={[{marginTop: 16}, StyleCSS.styles.fdrCenter]}>
                  <CustomImage
                    height={16}
                    width={16}
                    uri={`${config.media_url}course_details/card.svg`}
                  />
                  {course.pay_as_you_go ? <Text
                    style={[
                      StyleCSS.styles.contentText,
                      StyleCSS.styles.fw600,
                      {marginLeft: 8},
                    ]}>
                    {course.pay_as_you_go}
                  </Text> :null}
                </View>
                {!isLoggedIn && course.allow_directly && (
                  <TouchableOpacity
                    style={styles.enrollButton}
                    onPress={() => handleEnrollment('N')}>
                    <Text
                      style={[
                        StyleCSS.styles.contentText,
                        styles.enrollNowText,
                      ]}>
                      Enroll Now
                    </Text>
                  </TouchableOpacity>
                )}
                {!isLoggedIn && !course.allow_directly && (
                  <TouchableOpacity
                    style={styles.enrollButton}
                    onPress={() => handleInterested()}>
                    <Text
                      style={[
                        StyleCSS.styles.contentText,
                        styles.enrollNowText,
                      ]}>
                      I am interested
                    </Text>
                  </TouchableOpacity>
                )}
                {isLoggedIn && course && userData.user_type === 'S' ? (
                  !course.pricing[0].is_checkout ? (
                    <TouchableOpacity
                      style={styles.enrollButton}
                      onPress={() => addToCart(course)}>
                      <Text
                        style={[
                          StyleCSS.styles.contentText,
                          styles.enrollNowText,
                        ]}>
                        Refill
                      </Text>
                    </TouchableOpacity>
                  ) : course.allow_directly ? (
                    <TouchableOpacity
                      style={styles.enrollButton}
                      onPress={() => handleEnrollment('N')}>
                      <Text
                        style={[
                          StyleCSS.styles.contentText,
                          styles.enrollNowText,
                        ]}>
                        Enroll Now
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.enrollButton}
                      onPress={() => handleInterested()}>
                      <Text
                        style={[
                          StyleCSS.styles.contentText,
                          styles.enrollNowText,
                        ]}>
                        I am interested
                      </Text>
                    </TouchableOpacity>
                  )
                ) : null}
                {isLoggedIn && userData.user_type !== 'S' ? (
                  <TouchableOpacity
                    style={styles.enrollButton}
                    // onPress={() => handleInterested()}
                  >
                    <Text
                      style={[
                        StyleCSS.styles.contentText,
                        styles.enrollNowText,
                      ]}>
                      Login as Student
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {/* {isLoggedIn && userData.user_type === 'S' ?
                course.pricing && !course.pricing[0].is_checkout ? (
                  <TouchableOpacity
                    style={styles.enrollButton}
                    onPress={() => addToCart(course)}>
                    <Text
                      style={[
                        StyleCSS.styles.contentText,
                        styles.enrollNowText,
                      ]}>
                      Refill
                    </Text>
                  </TouchableOpacity>
                ) : course.allow_directly ? (
                  <TouchableOpacity
                    style={styles.enrollButton}
                    onPress={() => handleEnrollment('N')}>
                    <Text
                      style={[
                        StyleCSS.styles.contentText,
                        styles.enrollNowText,
                      ]}>
                      Enroll Now
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.enrollButton}
                    onPress={() => handleInterested()}>
                    <Text
                      style={[
                        StyleCSS.styles.contentText,
                        styles.enrollNowText,
                      ]}>
                      I am interested
                    </Text>
                  </TouchableOpacity>
                ) : isLoggedIn && userData.user_type!=='S' ? 
                <TouchableOpacity
                    style={styles.enrollButton}
                    // onPress={() => handleInterested()}
                    >
                    <Text
                      style={[
                        StyleCSS.styles.contentText,
                        styles.enrollNowText,
                      ]}>
                     Login as Student
                    </Text>
                  </TouchableOpacity> : null
              } */}

                {(isLoggedIn && userData.user_type === 'S') || !isLoggedIn ? (
                  <TouchableOpacity
                    onPress={handleFreeMeeting}
                    style={styles.requestFreeMeetingButton}>
                    <Text style={styles.requestFreeMeetingText}>
                      Request free meeting
                    </Text>
                  </TouchableOpacity>
                ) : null}
                <View style={StyleCSS.styles.marginV16}>
                  <LineDashed />
                </View>
                {course.discuss_timing ? <Text
                  style={[
                    StyleCSS.styles.contentText,
                    styles.courseInfoDetail,
                  ]}>
                  {course.discuss_timing}
                </Text> : null}
                <View style={[StyleCSS.styles.lineStyleLight]}></View>
                {/* <View style={[StyleCSS.styles.fdrCenter, {marginTop: 16}]}>
                  <View style={styles.courseGeneralDetails}>
                    <Text style={StyleCSS.styles.labelText}>
                      Course Duration
                    </Text>
                    <Text>:</Text>
                  </View>
                  <View style={{marginLeft: 8}}>
                    <Text style={StyleCSS.styles.contentText}>
                      {course.class_duration} weeks
                    </Text>
                  </View>
                </View> */}
                <View style={[StyleCSS.styles.fdrCenter, {marginTop: 16}]}>
                  <View style={styles.courseGeneralDetails}>
                    <Text style={StyleCSS.styles.labelText}>
                      Instruction Language
                    </Text>
                    <Text>:</Text>
                  </View>
                  <View style={{marginLeft: 8, width:'50%'}}>
                    <Text style={[StyleCSS.styles.contentText]}>
                      {course.language.map((lang: any, i: number) => (
                        <Text style={StyleCSS.styles.contentText} key={i}>
                          {i > 0 ? ', ' + lang.name : lang.name}
                        </Text>
                      ))}
                    </Text>
                  </View>
                </View>
                {/* <View style={[StyleCSS.styles.fdrCenter,{marginTop:16}]}>
             <View style={styles.courseGeneralDetails}>
               <Text style={StyleCSS.styles.labelText}>Learn On</Text>
               <Text>:</Text>
             </View>
             <View>
               <Text style={StyleCSS.styles.contentText}>{course.taught_on.map((platform: any, i:number) => {
                return (
                  <Text style={[styles.body2, {width:'100%'}]} key={i}>
                      {i > 0 ? ', ' + platform.name : platform.name}
                    </Text>
                  
                );
              })} weeks</Text>
             </View>
           </View> */}
              </View>
              {course.taught_on ? (
                <View style={[styles.main, styles.taught_on_wrapper]}>
                  <Text
                    style={[
                      StyleCSS.styles.contentText,
                      StyleCSS.styles.fw600,
                      StyleCSS.styles.font16,
                    ]}>
                    Learn On
                  </Text>
                  <View
                    style={[
                      StyleCSS.styles.fdrCenter,
                      {
                        flexWrap: 'wrap',
                      },
                    ]}>
                    {course.taught_on.map((platform: any) => {
                      return (
                        <View key={platform.id} style={styles.taught_on}>
                          {/* one error shwoing in this svg */}
                          {/* {config.env === 'prod' ? ( */}
                          <CustomImage
                            style={styles.iconImage}
                            uri={platform.icon}
                          />
                          {/* ) : (
                  <SvgUri uri={platform.icon} />
                )} */}
                          <Text style={styles.body2}>{platform.name}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ) : null}

              <View style={styles.courseSummary}>
                <Text style={styles.subHeading}>Course Summary</Text>
                {course.course_summary ? (
                  readMoreSummary ? (
                    <>
                    {/* new */}
                      <RenderHtml
                        baseStyle={styles.summary}
                        contentWidth={cardW}
                        source={{html: course.course_summary}}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setReadMoreSummary(false);
                        }}>
                        <Text style={[styles.summary, {color: secondaryColor, alignSelf:'flex-end', marginBottom:12}]}>
                          Read Less
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                    {/* new */}
                      <RenderHtml
                        baseStyle={styles.summary}
                        contentWidth={cardW}
                        source={{html: course.course_summary.substring(0, 200)}}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setReadMoreSummary(true);
                        }}>
                        <Text style={[styles.summary, {color: secondaryColor, alignSelf:'flex-end', marginBottom:12}]}>
                          ...Read More
                        </Text>
                      </TouchableOpacity>
                    </>
                  )
                ) : null}
              </View>
              <View
                style={[
                  StyleCSS.styles.lineStyleLight,
                  {marginHorizontal: -16},
                ]}></View>
              <View style={styles.courseSummary}>
                {/* <View style={styles.main}> */}
                <Text style={[styles.subHeading]}>Teacher's Profile</Text>
                <View style={[StyleCSS.styles.fdrCenter, {marginTop: 16}]}>
                  {course.user.profile_pic != '' && (
                    <View style={styles.educatorPicWrapper}>
                      <CustomImage
                        style={styles.educatorProfilePic}
                        height={80}
                        width={80}
                        uri={course.user.profile_pic}
                      />
                    </View>
                  )}
                  <View style={{marginLeft: 16}}>
                    <Text
                      style={[
                        StyleCSS.styles.font16,
                        StyleCSS.styles.fw600,
                        styles.teacherProfileName,
                      ]}>
                      {course.user.first_name} {course.user.last_name}
                    </Text>
                    {course.experience ? <Text style={[StyleCSS.styles.contentText]}>
                      <Text style={[StyleCSS.styles.labelText]}>
                        Experience:{' '}
                      </Text>
                      {course.experience} years
                    </Text>:null}
                    {course.user.ip_country !== '' && (
                      <Text style={[StyleCSS.styles.contentText]}>
                        <Text style={[StyleCSS.styles.labelText]}>From: </Text>
                        {course.user.ip_country}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{marginTop: 24}}>
                  {course.teacher_skills && course.teacher_skills.length > 0 ? (
                    <View
                      style={[
                        StyleCSS.styles.fdrCenter,
                        styles.teacherProfileList,
                      ]}>
                      <View style={{width:'10%'}}>
                        <CustomImage
                          height={32}
                          width={32}
                          uri={`${config.media_url}course_details/teacherProfile1.svg`}
                        />
                      </View>
                      <View style={[styles.teacherProfileListText,{width:'85%'}]}>
                        <Text
                          style={[
                            StyleCSS.styles.contentText,
                            StyleCSS.styles.fw600,
                          ]}>
                          Teacher Skill Keywords
                        </Text>
                        <Text
                          style={[
                            StyleCSS.styles.labelText,
                            StyleCSS.styles.fw400,
                            {marginTop: 5},
                          ]}>
                          {course.teacher_skills.map(
                            (skill: any, i: number) => (
                              <Text
                                style={[
                                  StyleCSS.styles.labelText,
                                  StyleCSS.styles.fw400,
                                  {marginTop: 5},
                                ]}
                                key={i}>
                                {i > 0 ? ', ' + skill.name : skill.name}
                              </Text>
                            ),
                          )}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                  {course.user &&
                  course.user.study_details &&
                  course.user.study_details.length > 0 ? (
                    <View
                      style={[
                        StyleCSS.styles.fdrCenter,
                        styles.teacherProfileList,
                      ]}>
                      <View style={{width:'10%'}}>
                        <CustomImage
                          height={32}
                          width={32}
                          uri={`${config.media_url}course_details/teacherProfile2.svg`}
                        />
                      </View>
                      <View style={[styles.teacherProfileListText,{width:'85%'}]}>
                        <Text
                          style={[
                            StyleCSS.styles.contentText,
                            StyleCSS.styles.fw600,
                          ]}>
                          Education
                        </Text>
                        <Text
                          style={[
                            StyleCSS.styles.contentText,
                            StyleCSS.styles.fw600,
                          ]}>
                          {course.user.study_details.map(
                            (s_detail: any, i: number) => (
                              <Text
                                style={[
                                  StyleCSS.styles.labelText,
                                  StyleCSS.styles.fw400,
                                  {marginTop: 5},
                                ]}
                                key={i}>
                                {s_detail.degree}{' '}
                                {s_detail.university && (
                                  <>from {s_detail.university}</>
                                )}
                              </Text>
                            ),
                          )}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                  {course.user.work_details &&
                  course.user.work_details.length > 0 ? (
                    <View
                      style={[
                        StyleCSS.styles.fdrCenter,
                        styles.teacherProfileList,
                      ]}>
                      <View style={{width:'10%'}}>
                        <CustomImage
                          height={32}
                          width={32}
                          uri={`${config.media_url}course_details/teacherProfile3.svg`}
                        />
                      </View>
                      <View style={[styles.teacherProfileListText,{width:'85%'}]}>
                        <Text
                          style={[
                            StyleCSS.styles.contentText,
                            StyleCSS.styles.fw600,
                          ]}>
                          Work Details
                        </Text>

                        {course.user.work_details.map(
                          (work: any, i: number) => (
                            <Text
                              style={[
                                StyleCSS.styles.labelText,
                                StyleCSS.styles.fw400,
                                {marginTop: 5},
                              ]}
                              key={i}>
                              {work.position + ' - ' + work.organisation}
                            </Text>
                          ),
                        )}
                      </View>
                    </View>
                  ) : null}
                </View>
                <View
                  style={[
                    StyleCSS.styles.fdrCenter,
                    styles.teacherProfileList,
                    {
                      backgroundColor: background6,
                      marginHorizontal: -16,
                      paddingHorizontal: 16,
                    },
                  ]}>
                  <View style={{width:'10%'}}>
                    <CustomImage
                      height={32}
                      width={32}
                      uri={`${config.media_url}course_details/teacherProfile4.svg`}
                    />
                  </View>
                  <View style={[styles.teacherProfileListText,{width:'85%'}]}>
                    <Text
                      style={[
                        StyleCSS.styles.contentText,
                        StyleCSS.styles.fw600,
                      ]}>
                      {course.sessions_completed.title}
                    </Text>
                    <Text
                      style={[
                        StyleCSS.styles.labelText,
                        StyleCSS.styles.fw400,
                        {marginTop: 5},
                      ]}>
                      {course.sessions_completed.details}
                    </Text>
                  </View>
                </View>
                {/* {course.teacher_skills && course.teacher_skills.length > 0 && (
              <View style={styles.educatorInfo}>
                <Image
                  style={styles.iconImage}
                  source={{
                    uri:
                      config.media_url +
                      'images/course-detail/skill-keywords.png',
                  }}
                />
                <Text style={styles.subHeading2}>Teacher Skill Keywords </Text>
                <Text>
                  {course.teacher_skills.map((skill: any, i: number) => (
                    <Text style={styles.body2} key={i}>
                      {i > 0 ? ', ' + skill.name : skill.name}
                    </Text>
                  ))}
                </Text>
              </View>
            )} */}
                {/* {course.user &&
              course.user.study_details &&
              course.user.study_details.length > 0 && (
                <View style={styles.educatorInfo}>
                  <Image
                    style={styles.iconImage}
                    source={{
                      uri:
                        config.media_url + 'images/course-detail/education.png',
                    }}
                  />
                  <Text style={styles.subHeading2}>Education </Text>
                  <Text style={styles.body2}>
                    {course.user.study_details.map(
                      (s_detail: any, i: number) => (
                        <Text key={i}>
                          {s_detail.degree}{' '}
                          {s_detail.university && (
                            <>from {s_detail.university}</>
                          )}
                        </Text>
                      ),
                    )}
                  </Text>
                </View>
              )} */}
                {/* {course.user.work_details && course.user.work_details.length > 0 && (
              <View style={styles.educatorInfo}>
                <Image
                  style={styles.iconImage}
                  source={{
                    uri:
                      config.media_url +
                      'images/course-detail/work-details.png',
                  }}
                />
                <Text style={styles.subHeading2}>Work Details </Text>
                <Text style={styles.body2}>
                  {course.user.work_details.map((work: any, i: number) => (
                    <Text key={i}>
                      {work.position + ' - ' + work.organisation}
                    </Text>
                  ))}
                </Text>
              </View>
            )} */}
                {/* </View> */}
              </View>

              {/* {course.class_duration && (
              <View style={styles.iconWrapper}>
                <CustomImage  uri={`${config.media_url}images/course-detail/course-duration.svg`}/>
                // <SvgUri
                //   uri={`${config.media_url}images/course-detail/course-duration.svg`}
                // />
                <View style={styles.info}>
                  <Text style={styles.infoHead}>Course Duration</Text>
                  <Text style={styles.infoText}>
                    {course.class_duration} Weeks
                  </Text>
                </View>
              </View>
            )} */}
              {/* {course.course_level && course.course_level.length > 0 && (
              <View style={styles.iconWrapper}>
                <SvgUri
                  uri={`${config.media_url}images/course-detail/course-level.svg`}
                />
                <View style={styles.info}>
                  <Text style={styles.infoHead}>Course Level</Text>
                  <Text style={styles.infoText}>
                    {course.course_level[0].name}
                  </Text>
                </View>
              </View>
            )} */}
              {/* {course.language && course.language.length > 0 && (
              <View style={styles.iconWrapper}>
                <SvgUri
                  uri={`${config.media_url}images/course-detail/instruction-language.svg`}
                />
                <View style={styles.info}>
                  <Text style={styles.infoHead}>Instruction Language</Text>
                  <Text style={styles.infoText}>{course.language[0].name}</Text>
                </View>
              </View>
            )} */}
              {/* {course.classes_taken_count > 0 && (
              <View style={styles.iconWrapper}>
                <SvgUri
                  uri={`${config.media_url}images/course-detail/class_taken.svg`}
                />
                <View style={styles.info}>
                  <Text style={styles.infoHead}>Classes Taken</Text>
                  <Text style={styles.infoText}>
                    {course.classes_taken_count} (for this course)
                  </Text>
                </View>
              </View>
            )} */}
            </View>
            {/* {course.age_groups_detail ||
            course.satisfied_student ||
            course.sessions_completed ? (
              <View style={styles.courseDescContent}>
                {course.age_groups_detail?.age_groups.length > 0 && (
                  <View style={styles.promo}>
                    <SvgUri
                      uri={`${config.media_url}images/course-detail/age-groups.svg`}
                    />

                    <Text style={styles.promoTitle}>
                      {course.age_groups_detail.title}
                    </Text>
                    <Text style={styles.promoDetails}>
                      {course.age_groups_detail.age_groups.map(
                        (group: any, index: number) => (
                          <Text key={index}>
                            {group.name}
                            {index !==
                              course.age_groups_detail.age_groups.length - 1 &&
                              ', '}
                          </Text>
                        ),
                      )}
                      <Text>
                        {course.age_groups_detail.age_groups.length === 4
                          ? ' - All '
                          : ''}
                        are welcome!
                      </Text>
                    </Text>
                  </View>
                )} */}
            {/* {course.satisfied_student ? (
                  <View style={styles.promo}>
                    <SvgUri
                      uri={`${config.media_url}images/course-detail/satisfied-students.svg`}
                    />
                    <Text style={styles.promoTitle}>
                      {course.satisfied_student.title}
                    </Text>
                    <Text style={styles.promoDetails}>
                      {course.satisfied_student.details}
                    </Text>
                  </View>
                ) : null}
                {course.sessions_completed ? (
                  <View style={styles.promo}>
                    <SvgUri
                      uri={`${config.media_url}images/course-detail/online-live-sessions-completed.svg`}
                    />
                    <Text style={styles.promoTitle}>
                      {course.sessions_completed.title}
                    </Text>
                    <Text style={styles.promoDetails}>
                      {course.sessions_completed.details}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null} */}

            {/* <View style={styles.enrollWrapper}>
              <Text style={styles.price}>
                {!isLoggedIn
                  ? userLocation?.data?.country === 'IN'
                    ? course?.user.ip_country === 'India'
                      ? `₹ ${
                          course && course.pricing && course?.pricing[0].INR
                        }`
                      : `$ ${
                          course && course.pricing && course?.pricing[0].USD
                        }`
                    : `$ ${course && course.pricing && course?.pricing[0].USD}`
                  : userData?.ip_country === 'India'
                  ? course?.user.ip_country === 'India'
                    ? `₹ ${course && course.pricing && course?.pricing[0].INR}`
                    : `$ ${course && course.pricing && course?.pricing[0].USD}`
                  : `$ ${
                      course && course.pricing && course?.pricing[0].USD
                    }`}{' '}
              </Text>
              <Text style={styles.priceDetail}>(1-on-1 Class)</Text>
              <Text style={styles.body2}>per Class(Tax Exclusive)</Text>
              <Text style={styles.subHeading2}>Recommended</Text>
              <Text style={styles.body2}>
                1 Week = {course.classes_per_week}{' '}
                {course.classes_per_week === 1 ? 'Class' : 'Classes'}
              </Text>
              <Text style={styles.body2}>
                1 Class = {course.class_duration} minutes
              </Text>
            </View> */}

            <View style={[styles.main, styles.courseSummary]}>
              <Text style={styles.subHeading}> About the Course</Text>
              {readMoreDetail ? (
                <>
                {/* new */}
                  <RenderHtml
                    baseStyle={styles.summary}
                    contentWidth={width}
                    source={{html: removeEmptyTags(course.course_description)}}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setReadMoreDetail(false);
                    }}>
                    <Text style={[styles.summary, {color: secondaryColor , alignSelf:'flex-end', marginBottom:12}]}>
                      Read Less
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                {/* new */}
                  <RenderHtml
                    baseStyle={styles.summary}
                    contentWidth={width}
                    source={{
                      html: removeEmptyTags(
                        course.course_description.substring(0, 200),
                      ),
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setReadMoreDetail(true);
                    }}>
                    <Text style={[styles.summary, {color: secondaryColor, alignSelf:'flex-end', marginBottom:12}]}>
                      ...Read More
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            <View style={[styles.main, {paddingTop: 16}]}>
              {course.ipassio_edge ? (
                <Accordian title={ipassio_edge} data={course.ipassio_edge} />
              ) : null}
              {course.course_prerequisites ? (
                <Accordian
                  title={'Course Prerequisites'}
                  data={course.course_prerequisites}
                />
              ) : null}
            </View>
            <View style={styles.bgGrey}>
              {course.age_groups_detail &&
              course.age_groups_detail.age_groups.length > 0 ? (
                <View
                  style={[
                    StyleCSS.styles.fdrCenter,
                    styles.teacherProfileList,
                  ]}>
                  <View>
                    <CustomImage
                      height={32}
                      width={32}
                      uri={`${config.media_url}course_details/age-groups.svg`}
                    />
                  </View>
                  <View style={styles.teacherProfileListText}>
                    <Text
                      style={[
                        StyleCSS.styles.contentText,
                        StyleCSS.styles.fw400,
                      ]}>
                      {course.age_groups_detail.title}
                    </Text>
                  </View>
                </View>
              ) : null}
              {/* {course.satisfied_student ? (
                <View
                  style={[
                    StyleCSS.styles.fdrCenter,
                    styles.teacherProfileList,
                  ]}>
                  <View>
                    <CustomImage
                      height={32}
                      width={32}
                      uri={`${config.media_url}course_details/success-rate.svg`}
                    />
                  </View>
                  <View style={styles.teacherProfileListText}>
                    <Text
                      style={[
                        StyleCSS.styles.contentText,
                        StyleCSS.styles.fw400,
                      ]}>
                      {course.satisfied_student.title}
                    </Text>
                  </View>
                </View>
              ) : null} */}
              {course.course_includes && course.course_includes.length > 0 ? (
                <>
                  <View
                    style={[
                      StyleCSS.styles.lineStyleLight,
                      {marginVertical: 8},
                    ]}></View>
                  <View>
                    {course.what_you_get  ? <Text style={styles.whatYouGet}>{course.what_you_get}</Text> : null}
                  </View>
                  {course.course_includes.map((details: any) => {
                    return (
                      <View
                        key={details.id}
                        style={[
                          StyleCSS.styles.fdrCenter,
                          {paddingVertical: 12},
                        ]}>
                        <CustomImage
                          height={24}
                          width={24}
                          uri={details.icon}
                        />

                        {/* <SvgUri uri={details.icon} /> */}

                        <Text
                          style={[styles.courseIncludesHead, {marginLeft: 16}]}>
                          {details.name}
                        </Text>
                      </View>
                    );
                  })}
                </>
              ) : null}
              {course.factoid && course.factoid.text? 
              <View style={styles.factoidWrapper}>
                <Text style={styles.factoidText}>Factoid</Text>
                <Text
                  style={[
                    StyleCSS.styles.contentText,
                    StyleCSS.styles.fw400,
                    {lineHeight: 26},
                  ]}>
                  {course.factoid.text}
                </Text>
                {course.factoid.citation!=='' ? <Text
                  style={[
                    StyleCSS.styles.labelText,
                    StyleCSS.styles.fw400,
                    {lineHeight: 26, marginTop:5, fontSize:12},
                  ]}>
                   {course.factoid.citation}
                </Text> : null}
              </View> : null}
              
            </View>
            <View style={styles.main}>
              <View style={styles.queries}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      `whatsapp://send?phone=${+919740050326}&text=Hello`,
                    );
                  }}>
                  <CustomImage
                    height={32}
                    width={32}
                    uri={`${config.media_url}whatsapp.svg`}
                  />
                  {/* <SvgUri
                      uri={`${config.media_url}images/course-detail/whatsapps.svg`}
                    /> */}
                </TouchableOpacity>
                <View>
                  <Text
                    style={[
                      styles.center,
                      StyleCSS.styles.labelText,
                      StyleCSS.styles.fw400,
                    ]}>
                    Contact us incase of any questions
                  </Text>
                  <Text style={[styles.center, styles.contact]}>
                    +91-97400-50326
                  </Text>
                </View>
                <TouchableOpacity onPress={dialCall}>
                  <CustomImage
                    height={32}
                    width={32}
                    uri={`${config.media_url}contact.svg`}
                  />
                  {/* <SvgUri
                      uri={`${config.media_url}images/course-detail/contacts.svg`}
                    /> */}
                </TouchableOpacity>
              </View>
            </View>
            {/* <View>
              <View>
                <CustomImage
                  style={{width: '100%', height: 452}}
                  uri={`${config.media_url}course_details/learning_from_artist_mobile.png`}
                />
              </View>
              <View style={{position: 'absolute', top: 40, marginBottom: 16}}>
                <Text style={styles.textOverImage}>
                  Learning from a trained
                </Text>
                <Text style={styles.textOverImage}>
                  teacher is different from
                </Text>
                <Text style={[styles.textOverImage, {color: brandColor}]}>
                  learning from an artist.
                </Text>
                <Text style={styles.textOverImageSmall}>
                  Know about your teacher before you Enroll in a course.
                </Text>
              </View>
            </View> */}
            
            {/* {teacherAttendance && teacherAttendance.length > 0 && (
              <View style={styles.greyBg}>
                <Text style={styles.subHeading}>Teacher's Availability</Text>
                <Text style={styles.body2}>
                  Generally the teacher is available on these days
                </Text>
                <TouchableOpacity
                  style={styles.viewAvailabilityButton}
                  onPress={handleTeacherAvailability}>
                  <View style={styles.viewAvailability}>
                    <SvgUri
                      height="20"
                      uri={
                        config.media_url +
                        'images/course-detail/view-teacher-schedule.svg'
                      }
                    />
                    <Text style={styles.brandColorText}>
                      View Teacher's Availability
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.teacherTimingWrapper}>
                  {teacherAttendance.map((gaList: any, i: number) => (
                    <View style={styles.teacherAvailability} key={i}>
                      <Text style={styles.subHeading3}>
                        {
                          dayList[
                            moment
                              .tz(
                                gaList.start_time,
                                userLocation?.data?.timezone,
                              )
                              .day()
                          ]
                        }
                      </Text>
                      <Text style={styles.body3}>
                        {moment
                          .tz(gaList.start_time, userLocation?.data?.timezone)
                          .format('hh:mm A') +
                          ' - ' +
                          moment
                            .tz(gaList.end_time, userLocation?.data?.timezone)
                            .format('hh:mm A')}
                        {' | '}
                      </Text>
                      <Text style={styles.body3}>
                        {userLocation?.data?.timezone}
                      </Text>
                    </View>
                  ))}
                </View>
                <View style={styles.teacherTimingsNotMatching}>
                  <Text style={[styles.freeMeetingText]}>
                    If none of the above timings work for you, just sign up for
                    a free meeting and we'll work out the timings
                  </Text>
                  <TouchableOpacity style={styles.freeMeetingButton}>
                    <Text style={[styles.whiteText, styles.center]}>
                      Request For a Free Meeting
                    </Text>
                  </TouchableOpacity>
                </View>
                
              </View>
            )} */}

            {/* {teacherReviews.length > 0 ? (
              <View
                style={[
                  styles.greyBg,
                  styles.teacherReviews,
                  {position: 'relative', zIndex: -1},
                ]}>
                <Text style={styles.subHeading}>Student Review's</Text>
                <TouchableOpacity style={[styles.arrow, styles.prev]}>
                  <Text style={{fontSize: 18}}>&lt;</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.arrow, styles.next]}>
                  <Text style={{fontSize: 20}}>&gt;</Text>
                </TouchableOpacity>
                
                <Carousel
                  ref={isCarousel}
                  data={
                    teacherReviews.length > 4
                      ? teacherReviews.slice(0, 4)
                      : teacherReviews
                  }
                  renderItem={({item, index}) => (
                    <LoadReviews index={index} item={item} />
                  )}
                  sliderWidth={width}
                  itemWidth={width * 0.9}
                />
                <TouchableOpacity>
                  {teacherReviews.length > 2 ? (
                    <Text style={[styles.subHeading3, styles.brandColorText]}>
                      See All Reviews
                    </Text>
                  ) : null}
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={styles.additionalInfo}>
              {course.course_benefits ? (
                <Accordian
                  title={course_benefits}
                  data={course.course_benefits}
                />
              ) : null}

              {course.about_teacher ? (
                <Accordian title={about_teacher} data={course.about_teacher} />
              ) : null}
            </View> */}
            {course.faq && course.faq.length > 0 ? (
              <View style={[styles.main, {paddingTop: 24}]}>
                <Text style={[styles.subHeading, {marginBottom: 16}]}>
                  FAQs
                </Text>
                {course.faq.map((faq: any) => {
                  return (
                    <Accordian
                      key={faq.id}
                      title={faq.question}
                      data={faq.answer}
                    />
                  );
                })}
              </View>
            ) : null}
            <View style={StyleCSS.styles.lineStyleLight} />
            {course.ipassio_best_fit ? <View style={styles.main}>
              {course.what_makes_ipassio ? <Text style={[styles.subHeading, {marginVertical: 24}]}>
               {course.what_makes_ipassio}
              </Text>:null}
               {course.ipassio_best_fit.map((ibf:any)=>{
                return(
<View style={styles.courseIncludedWrapper}>
                <View style={styles.svgWrapper}>
                  <CustomImage
                    height={140}
                    width={219}
                    uri={ibf.best_fit_image}
                  />
                </View>
               
                <Text
                  style={[
                    StyleCSS.styles.contentText,
                    StyleCSS.styles.fw600,
                    StyleCSS.styles.font16,
                    {marginTop: 8},
                  ]}>
                  {ibf.title}
                </Text>
                <Text
                  style={[
                    StyleCSS.styles.labelText,
                    StyleCSS.styles.fw400,
                    {lineHeight: 25},
                  ]}>
                  {ibf.description}
                </Text>
              </View>
                )
              })} 
              
              
            </View>: null}
            
          </ScrollView>
        </>
      ) : <Text style={{textAlign:'center', marginTop:height*0.4}}> An error occurred. Please try again later.</Text>}

      <Modal
        visible={interested}
        presentationStyle="overFullScreen"
        transparent={true}>
           <KeyboardAvoidingView behavior='padding'>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setInterested(false)}
          style={StyleCSS.styles.modalBackground}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={StyleCSS.styles.modalView}>
            <ScrollView>
              <View style={StyleCSS.styles.modalLine}></View>
              <Text style={StyleCSS.styles.modalTitle}>I am Interested</Text>
              <View style={styles.formInput}>
                <TextField
                  mode="outlined"
                  label="Full Name*"
                  // style={StyleCSS.styles.input}
                  value={fullName}
                  onChangeText={(text: string) => setFullName(text)}
                  editable={true}
                  selectTextOnFocus={false}
                />
                {submitRequested && !fullName ? (
                  <Text style={styles.errorMessage}>{errors.fullName}</Text>
                ) : null}
              </View>
              <View style={styles.formInput}>
                <TextField
                  mode="outlined"
                  label="Email Address*"
                  onKeyPress={validateEmail}
                  // style={StyleCSS.styles.input}
                  value={email}
                  onChangeText={(text: string) => setEmail(text)}
                  editable={true}
                  selectTextOnFocus={false}
                />
                {submitRequested && !email ? (
                  <Text style={styles.errorMessage}>{errors.email}</Text>
                ) : null}
                {validEmail ? null : (
                  <Text style={styles.errorMessage}>
                    This email address is invalid.
                  </Text>
                )}
              </View>
              <View style={styles.formInput}>
                <TextField
                  mode="outlined"
                  label="Mobile Number (preferably WhatsApp number)*"
                  // style={StyleCSS.styles.input}
                  value={mobile}
                  keyboardType="numeric"
                  onChangeText={(text: string) => setMobile(text)}
                  editable={true}
                  selectTextOnFocus={false}
                />
                {submitRequested && !mobile ? (
                  <Text style={styles.errorMessage}>{errors.mobile}</Text>
                ) : null}
              </View>
              <View style={styles.formInput}>
                <TextField
                  mode="outlined"
                  label="Subject"
                  // multiline={true}
                  // style={StyleCSS.styles.input}
                  value={subject}
                  defaultValue={course.title}
                  onChangeText={(text: string) => setSubject(text)}
                  editable={true}
                  selectTextOnFocus={false}
                />
                {submitRequested && subject === '' ? (
                  <Text style={styles.errorMessage}>{errors.subject}</Text>
                ) : null}
              </View>
              <View style={styles.formInput}>
                <Textarea
                  containerStyle={StyleCSS.styles.modalTextarea}
                  style={StyleCSS.styles.reviewTextArea}
                  onChangeText={(text: string) => {
                    setMessage(text);
                  }}
                  value={message}
                  // defaultValue={attendances[index].review}
                  placeholder={'Message *'}
                  placeholderTextColor={font2}
                  underlineColorAndroid={'transparent'}
                />
                {submitRequested && !message ? (
                  <Text style={styles.errorMessage}>{errors.message}</Text>
                ) : null}
              </View>

              <View style={[StyleCSS.styles.lineStyleLight, {marginTop: 16}]} />
              <View style={[StyleCSS.styles.modalButton]}>
                <TouchableOpacity
                  style={StyleCSS.styles.cancelButton}
                  onPress={() => {
                    setInterested(false);
                  }}>
                  <Text style={StyleCSS.styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={StyleCSS.styles.submitButton}
                  onPress={() => {
                    handleInterestedData();
                  }}>
                  <Text style={StyleCSS.styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
      <Modal visible={reviewPopupOpen} animationType='slide' transparent={true} statusBarTranslucent  presentationStyle="overFullScreen" 
     >
       <View style={{height:'100%'}}>
        <TeacherReviews setReviewPopupOpen={setReviewPopupOpen} course={course}/>
        </View>
       
      </Modal>
    </>
  );
};

export default CourseDetails;

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
  },
  reviews: {
    borderRightWidth: 1,
    borderRightColor: '#c5cbd0',
    paddingRight: 5,
    marginRight: 10,
    color: font1,
  },
  teacher: {
    color: font1,
    fontSize: 16,
    fontWeight:'600',
    textTransform: 'capitalize',
    fontFamily:Helper.switchFont('medium'),
  },
  summary: {
    color: font1,
    lineHeight: 29,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: helper.switchFont('regular'),
  },
  iconImage: {
    height: 24,
    width: 24,
    marginRight: 12,
    resizeMode: 'cover',
  },
  iconWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  info: {
    marginLeft: 10,
  },
  teacherReviews: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundVideo: {
    height: 297,
    width: width,
  },
  reviewWrapper: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    maxWidth: width - 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    borderRadius: 5,
  },
  reviewRating: {
    alignItems: 'flex-start',
    marginVertical: 15,
  },
  courseWrapper: {
    paddingTop: 16,
  },
  reviewBody: {
    height: 100,
    fontFamily: helper.switchFont('light'),
    fontSize: 15,
    lineHeight: 25,
    color: font1,
  },
  infoHead: {
    fontFamily: helper.switchFont('medium'),
    fontSize: 18,
    color: font1,
  },
  body: {
    fontFamily: helper.switchFont('light'),
    fontSize: 20,
    lineHeight: 35,
    color: font1,
  },
  infoText: {
    fontFamily: helper.switchFont('light'),
    fontSize: 16,
    color: font1,
  },
  courseDescContent: {
    backgroundColor: '#2d3744',
    padding: 15,
  },
  whiteText: {
    color: '#FFF',
  },
  readMore: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginRight: 10,
  },
  enrollButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,

    marginTop: 16,
    width: '100%',
    backgroundColor: brandColor,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: brandColor,
  },
  enrollWrapper: {
    padding: 15,
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  promo: {
    paddingVertical: 20,
  },
  promoTitle: {
    fontFamily: helper.switchFont('medium'),
    color: '#FFF',
    fontSize: 20,
    marginTop: 10,
  },
  promoDetails: {
    fontFamily: helper.switchFont('regular'),
    color: 'hsla(0,0%,100%,.8)',
    fontSize: 16,
  },
  promoIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  price: {
    fontFamily: helper.switchFont('medium'),
    fontSize: 20,
    fontWeight: '800',
    color: font1,
  },
  priceDetail: {
    fontFamily: helper.switchFont('regular'),
    fontSize: 16,
    color: font1,
  },
  totalReviews: {
    color: font1,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  taught_on_icon: {
    height: 30,
    width: 30,
    // marginRight:12
  },
  taught_on: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: dropdownBorder,
    flexDirection: 'row',
    paddingVertical: 9,
    paddingHorizontal: 12,
    alignContent: 'flex-start',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 8,
    // borderWidth:1,
  },

  subHeading: {
    fontFamily: helper.switchFont('medium'),
    fontSize: 20,
    fontWeight: '700',
    color: font1,
    // marginBottom: 16,
  },
  taught_on_wrapper: {
    borderWidth: 1,
    borderColor: dropdownBorder,
    borderRadius: 12,
    marginVertical: 8,
    paddingVertical: 16,
  },
  course_includes: {
    paddingVertical: 10,
    // borderWidth:1
  },
  courseIncludesHead: {
    paddingVertical: 5,
    fontFamily: helper.switchFont('medium'),
    fontSize: 16,
    color: font1,
    // borderWidth:1
  },
  courseIncludesDetails: {
    fontFamily: helper.switchFont('regular'),
    fontSize: 14,
    marginBottom: 20,
    color: font1,
    // borderWidth:1
  },
  greyBg: {
    backgroundColor: '#f9f9fa',
    padding: 15,
  },
  center: {
    textAlign: 'center',
  },
  educatorProfilePic: {
    width: 80,
    height: 80,
    borderRadius: 75,
    resizeMode: 'cover',
  },
  educatorPicWrapper: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  teacherTimingsNotMatching: {
    marginVertical: 15,
    backgroundColor: '#2d3744',
    padding: 15,
    borderRadius: 15,
  },
  freeMeetingButton: {
    marginVertical: 18,
    backgroundColor: '#277FD9',
    padding: 12,
    borderRadius: 20,
  },
  freeMeetingText: {
    fontFamily: helper.switchFont('regular'),
    color: '#FFF',
    fontSize: 16,
  },
  viewAvailability: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 50,
    width: '100%',
  },
  viewAvailabilityButton: {
    borderWidth: 2,
    borderColor: brandColor,
    padding: 12,
    marginVertical: 15,
    borderRadius: 30,
  },
  brandColorText: {
    color: brandColor,
  },
  subHeading2: {
    fontFamily: helper.switchFont('medium'),
    fontSize: 17,
    lineHeight: 25,
    color: font1,
  },
  educatorInfo: {
    paddingVertical: 15,
  },
  body2: {
    fontFamily: helper.switchFont('light'),
    fontSize: 15,
    lineHeight: 25,
    color: font1,
  },
  teacherAvailability: {
    paddingVertical: 10,
    paddingRight: 10,
    maxWidth: '50%',
  },
  body3: {
    fontFamily: helper.switchFont('light'),
    lineHeight: 20,
    color: font1,
  },
  subHeading3: {
    fontFamily: helper.switchFont('regular'),
    fontSize: 16,
    lineHeight: 20,
    color: font1,
  },
  queries: {
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  formInput: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  teacherTimingWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  additionalInfo: {
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
  },
  studentDp: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    marginRight: 30,
    borderRadius: 30,
  },
  errorMessage: {
    fontSize: 12,
    color: 'red',
    fontFamily: Helper.switchFont('medium'),
    fontWeight: '500',
    marginTop: 3,
  },
  student: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    position: 'absolute',
    top: 200,
    zIndex: 1000,
    height: 25,
    width: 25,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
  },
  next: {
    right: 10,
    color: font1,
  },
  prev: {
    left: 10,
    color: font1,
  },
  requestFreeMeetingButton: {
    alignItems: 'center',
    // backgroundColor: secondaryColor,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: secondaryColor,
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },
  requestFreeMeetingText: {
    color: secondaryColor,
    fontWeight: '700',
    fontSize: 14,
    fontFamily: Helper.switchFont('bold'),
  },
  backButton: {
    position: 'absolute',
    zIndex: 99,
    top: 53,
    left: 16,
  },
  cardDetail: {
    color: font1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16.38,
  },
  courseRatingCount: {
    marginLeft: 8,
    fontWeight: '400',
    fontSize: 14,
    // lineHeight: 16.38,
    color: font1,
  },
  courseRating: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  experience: {
    fontWeight: '400',
    marginTop: 5,
    color: font1,
  },
  courseInfo: {
    backgroundColor: background6,
    padding: 16,
    textAlign: 'center',
    marginVertical: 16,
    borderRadius: 10,
  },
  enrollNowText: {
    color: '#fff',
    fontWeight: '700',
  },
  courseInfoDetail: {
    lineHeight: 24,
    marginBottom: 16,
  },
  courseGeneralDetails: {
    width: '50%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  courseSummary: {
    paddingTop: 24,
    backgroundColor: 'white',
  },
  teacherProfileName: {
    color: font1,
    fontFamily: Helper.switchFont('semibold'),
    textTransform: 'capitalize',
  },
  teacherProfileList: {
    paddingVertical: 16,
  },
  teacherProfileListText: {
    marginLeft: 24,
    
  },
  bgGrey: {
    backgroundColor: background6,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  factoidWrapper: {
    backgroundColor: '#FFF5E7',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    padding: 16,
    marginVertical: 24,
  },
  factoidText: {
    fontFamily: Helper.switchFont('bold'),
    fontSize: 16,
    color: font1,
    fontWeight: '600',
    marginBottom: 8,
  },
  contact: {
    fontSize: 20,
    fontWeight: '800',
    color: font1,
    marginTop: 5,
  },
  courseIncludedWrapper: {
    backgroundColor: background6,
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },
  svgWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textOverImage: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    fontFamily: Helper.switchFont('bold'),
  },
  textOverImageSmall: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  whatYouGet: {
    marginVertical: 12,
    fontWeight: '600',
    fontSize: 16,
    color: font1,
    fontFamily: Helper.switchFont('semibold'),
  },
});

{
  /* <FlatList
                      horizontal
                      pagingEnabled
                      data={teacherReviews.length>2 ? teacherReviews.slice(0,2) : teacherReviews}
                      // keyExtractor={(_, index) => index.toString()}
                      // renderItem={({review, index}) => loadReviews(review, index)}
                      renderItem={({item, index}) => loadReviews(item, index)}
                      keyExtractor={item => item.id}
                      /> */
}
