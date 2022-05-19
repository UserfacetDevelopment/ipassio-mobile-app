import React, {useEffect, useState, FC} from 'react';
import {useSelector} from 'react-redux';
import {
  TouchableOpacity,
  Platform,
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Linking,
  ScrollView,
  Dimensions,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {SvgUri} from 'react-native-svg';
import ReactPlayer from 'react-player';
import moment from 'moment-timezone';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Rating} from 'react-native-ratings';

// import Video from 'react-native-video';
import YoutubePlayer from 'react-native-youtube-iframe';
import Carousel from 'react-native-snap-carousel';
import config from '../../config/Config';
import {brandColor} from '../../styles/colors';
import {userState} from '../../reducers/user.slice';
import {
  getTeacherCalender,
  teacherAvailability,
  setTeacherReviews,
  courseState,
  getTeacherReviews,
  getCourseDetail,
  enrollNow
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
import {setCheckoutDataDetails} from '../../reducers/checkout.slice'
import {useAppDispatch} from '../../app/store';
import { setPage } from '../../reducers/checkout.slice';
import HeaderInner from '../../components/HeaderInner';

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

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import CustomImage from '../../components/CustomImage';

type Props = NativeStackScreenProps<RootParamList, 'CourseDetail'>;

export interface CourseEnrollInterface{
  data: any;
  userToken: string;
}

const CourseDetails: FC<Props> = ({navigation, route}: Props) => {
  const course_slug: string = route.params?.course_slug;
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

    dispatch(getCourseDetail(course_slug))
      .unwrap()
      .then(response => {
        if (response.data.status === 'success') {
          dispatch(setCurrentCourse(response.data.data));
          dispatch(setPageLoading(false));
        } else if (response.status === 'failure') {
          dispatch(setPageLoading(false));
        }
      })
      .catch(err => {
        dispatch(setPageLoading(false));
      });

      

  }, []);

  useEffect(()=>{
      course && course.pricing && setSelectedPrice(course.pricing[0])
  }, [course])

  useEffect(() => {
    if (Object.keys(course).length !== 0) {
      //Getting the teachers availability schedule
      let details: TeacherCalenderInterface = {
        teacherToken: course.user.user_token,
        classType: 'G',
        courseID: course.id,
      };
      dispatch(getTeacherCalender(details))
        .unwrap()
        .then(response => {
          if (response?.data?.status === 'success') {
            dispatch(teacherAvailability(response?.data.data));
          } else if (response?.status === 'failure') {
            //console.log(response?.data);
          }
        })
        .catch(err => {});

      //Getting Students' reviews for teacher
      let data: TeacherReviewInterface = {
        category: course.category_detail.seo_slug_url,
        teacher: course.user.seo_slug_url,
      };
      dispatch(getTeacherReviews(data))
        .unwrap()
        .then(response => {
          if (response.data.status === 'success') {
            dispatch(setTeacherReviews(response.data.data));
          } else if (response.status === 'failure') {
            //console.log(response.data);
          }
        })
        .catch(err => {
          //console.log(err);
        });
    }
  }, [course]);

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
  console.log(course)

  //function to handle the Enroll Now Button
  const handleEnrollment = (purchase_type: string) => {
    if (isLoggedIn) {
      let currency_type =
        course.user.ip_country === "India" &&
        ((!isLoggedIn && userLocation.data.country === "India") ||
          (isLoggedIn && userData.ip_country === "India"))
          ? "INR"
          : "USD";
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
          currency_type === "INR"
            ? selectedPrice.final_INR
            : selectedPrice.final_USD,
        currency_type: currency_type,
        classes_per_week: total_cpw,
        number_of_weeks: total_weeks,
        number_of_class: total_class,
        billing_first_name: userData.first_name,
        billing_last_name: userData.last_name,
        billing_street_address: "",
        billing_city: userData.ip_city,
        billing_pin_code: "",
        billing_state: userData.ip_state,
        billing_country: userData.ip_country,
        class_type: selectedPrice.id,
        purchase_type: purchase_type,
        discounts: course.discounts ? course.discounts : "",
        timezone: userData.timezone,
        device_type: Platform.OS
      };
    
      const finaldata: CourseEnrollInterface={
        data: enrollData,
        userToken: userData.token
      }


      dispatch(setPageLoading(true))
      dispatch(setPage('C'));
      dispatch(enrollNow(finaldata))
      .unwrap()
      .then((response)=>{
        dispatch(setPageLoading(false))
        console.log(response)
        if(response.data.status==='success'){
          dispatch(setCheckoutDataDetails(response.data.data));
          navigation.navigate('Checkout', {
            screen: 'CartPage',
            params:{
            checkoutToken: response.data.data.checkout_token,
            }
            
          });
        }
      })
      .catch(err=>{
        dispatch(setPageLoading(false))
        console.log(err)
      })
    } else {
      navigation.navigate('Login', {
        nextRoute: 'CourseDetail',
      });
    }
  };

  useEffect(()=>{

  })

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

  const LoadReviews = (review: any, index: number) => {
    return (
      <>
        {reviewModalVisible && (
          <TeacherReview
            reviewModalVisible={reviewModalVisible}
            setReviewModalVisible={setReviewModalVisible}
            index={reviewIndex}
            teacherReviews={teacherReviews}
          />
        )}
        <View style={[styles.reviewWrapper]}>
          <View style={styles.reviewRating}>
            <Rating
              // ratingColor="#277FD9"
              // type="custom"
              startingValue={review.item.rating}
              readonly
              ratingCount={5}
              imageSize={20}
              fractions={10}
            />
          </View>

          <Text style={styles.subHeading2}>{review.item.title}</Text>
          {teacherReviews[0].review ? (
            <View style={styles.reviewBody}>
              {/* <RenderHtml
                baseStyle={styles.body2}
                contentWidth={width}
                source={{
                  html:
                    review.item.review.length > 250
                      ? removeEmptyTags(review.item.review.substring(0, 250))
                      : removeEmptyTags(review.item.review),
                }}
              /> */}
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.readMore}
            onPress={() => handleReviewModal(review.index)}>
            <Text style={[styles.subHeading3, styles.brandColorText]}>
              Read More
            </Text>
          </TouchableOpacity>
          <View style={styles.student}>
            {review.item.student && review.item.student.profile_pic ? (
              <Image
                style={styles.studentDp}
                source={{
                  uri: review.item.student.profile_pic,
                }}
              />
            ) : null}
            <View>
              {review.item.student && review.item.student.name ? (
                <Text style={styles.subHeading2}>
                  {review.item.student.name}
                </Text>
              ) : null}
              <Text style={styles.body3}>
                Updated{' '}
                {moment(review.item.review_datetime).format('MMM DD, YYYY')}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const isCarousel = React.useRef(null);
  const course_benefits = 'Course Specific Benefits';
  const ipassio_edge = 'The ipassio Edge';
  const about_teacher = 'About Teacher';

  const handleFreeMeeting = () => {
    navigation.navigate('RequestMeeting');
  };
  return (
    <>
      {/* {loading && <DialogLoader />} */}

      
      {pageLoading ? (
        <PageLoader />
      ) : courseDetailStatus !== null ? (

        <>
        <HeaderInner 
        type={'findCourse'}
        title={''}
        back={true}
        navigation={navigation}/>
        <ScrollView style={{marginTop:config.headerHeight}}>
          {!loading && videoId ? (
            <View>
              {/* have to be changed to a non youtube specific carousal */}
              <YoutubePlayer height={220} play={false} videoId={`${videoId}`} />
            </View>
          ) : //   <View style={{height:220}}>
          //   <Video   // Can be a URL or a local file.
          //   controls
          // source={{uri: course.video_url}}                                    // Store reference
          // onError={()=>{console.log("not loading")}}       // Callback when video cannot be loaded
          // style={styles.backgroundVideo} />
          // </View>
          null}

          <View style={styles.main}>
            {(isLoggedIn && userData.user_type === 'S') || !isLoggedIn ? (
              <TouchableOpacity
                onPress={handleFreeMeeting}
                style={styles.requestFreeMeetingButton}>
                <Text style={styles.requestFreeMeetingText}>
                  Request for a free meeting
                </Text>
              </TouchableOpacity>
            ) : null}

            <Text style={style.styles.title}>{course.title}</Text>
            <TouchableOpacity
              onPress={() => {
                dispatch(setPageLoading(true));
                navigation.push('TeacherDetails', {
                  teacher_slug: course.user.seo_slug_url,
                  category_slug: course.category_slug_url,
                });
              }}>
              <Text style={styles.teacher}>
                by {course.user?.first_name} {course?.user?.last_name}
              </Text>
            </TouchableOpacity>
            {course.rating.avg_review !== 0 && (
              <View style={styles.ratingWrapper}>
                <Rating
                  // ratingColor="#277FD9"
                  // type="custom"
                  startingValue={course.rating.avg_review}
                  readonly
                  ratingCount={5}
                  imageSize={20}
                  fractions={10}
                />
                <Text style={styles.reviews}>{course.rating.avg_review}/5</Text>
                <Text style={styles.body3}>
                  {course.rating.total_count} Reviews
                </Text>
              </View>
            )}
            {/* {course.course_summary ? (
              <RenderHtml
                baseStyle={styles.summary}
                contentWidth={cardW}
                source={{html: course.course_summary}}
              />
            ) : null} */}

            {course.class_duration && (
              <View style={styles.iconWrapper}>
                <CustomImage  uri={`${config.media_url}images/course-detail/course-duration.svg`}/>
                {/* <SvgUri
                  uri={`${config.media_url}images/course-detail/course-duration.svg`}
                /> */}
                <View style={styles.info}>
                  <Text style={styles.infoHead}>Course Duration</Text>
                  <Text style={styles.infoText}>
                    {course.class_duration} Weeks
                  </Text>
                </View>
              </View>
            )}
            {course.course_level && course.course_level.length > 0 && (
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
            )}
            {course.language && course.language.length > 0 && (
              <View style={styles.iconWrapper}>
                <SvgUri
                  uri={`${config.media_url}images/course-detail/instruction-language.svg`}
                />
                <View style={styles.info}>
                  <Text style={styles.infoHead}>Instruction Language</Text>
                  <Text style={styles.infoText}>{course.language[0].name}</Text>
                </View>
              </View>
            )}
            {course.classes_taken_count > 0 && (
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
            )}
          </View>
          {course.age_groups_detail ||
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
              )}
              {course.satisfied_student ? (
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
          ) : null}

          <View style={styles.enrollWrapper}>
            <Text style={styles.price}>
              {!isLoggedIn
                ? userLocation?.data?.country === 'IN'
                  ? course?.user.ip_country === 'India'
                    ? `₹ ${course && course.pricing && course?.pricing[0].INR}`
                    : `$ ${course && course.pricing && course?.pricing[0].USD}`
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
            <TouchableOpacity
              style={styles.enrollButton}
              onPress={()=>handleEnrollment('N')}>
              <Text style={styles.whiteText}>Enroll Now</Text>
            </TouchableOpacity>
          </View>
          {course.taught_on ? (
            <View style={styles.main}>
              <Text style={[styles.subHeading, styles.center]}>Taught On</Text>

              {course.taught_on.map((platform: any) => {
                return (
                  <View key={platform.id} style={styles.taught_on}>
                    {/* one error shwoing in this svg */}
                    {/* {config.env === 'prod' ? ( */}
                    <Image
                      style={styles.iconImage}
                      source={{uri: platform.icon}}
                    />
                    {/* ) : (
                  <SvgUri uri={platform.icon} />
                )} */}
                    <Text style={styles.body2}>{platform.name}</Text>
                  </View>
                );
              })}
            </View>
          ) : null}

          {course.course_includes ? (
            <View style={styles.main}>
              <Text style={styles.subHeading}>This course includes</Text>
              {course.course_includes.map((details: any) => {
                return (
                  <View key={details.id}>
                    <SvgUri uri={details.icon} />
                    <Text style={styles.courseIncludesHead}>
                      {details.name}
                    </Text>
                    <Text style={styles.courseIncludesDetails}>
                      {details.details}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : null}
          {teacherAttendance && teacherAttendance.length > 0 && (
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
                            .tz(gaList.start_time, userLocation?.data?.timezone)
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
                  If none of the above timings work for you, just sign up for a
                  free meeting and we'll work out the timings
                </Text>
                <TouchableOpacity style={styles.freeMeetingButton}>
                  <Text style={[styles.whiteText, styles.center]}>
                    Request For a Free Meeting
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.queries}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      `whatsapp://send?phone=${+919740050326}&text=Hello`,
                    );
                  }}>
                  <SvgUri
                    uri={`${config.media_url}images/course-detail/whatsapps.svg`}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={dialCall}>
                  <SvgUri
                    uri={`${config.media_url}images/course-detail/contacts.svg`}
                  />
                </TouchableOpacity>
              </View>
              <Text style={[styles.center, styles.body]}>+91-97400-50326</Text>
              <Text style={[styles.center, styles.body2]}>
                For any Questions
              </Text>
            </View>
          )}
          <View style={styles.main}>
            <Text style={[styles.subHeading, styles.center]}>
              Educator Profile
            </Text>
            {course.user.profile_pic != '' && (
              <View style={styles.educatorPicWrapper}>
                <Image
                  style={styles.educatorProfilePic}
                  source={{uri: course.user.profile_pic}}
                />
              </View>
            )}
            <Text style={[styles.subHeading2, styles.center]}>
              {course.user.first_name} {course.user.last_name}
            </Text>
            <Text style={[styles.body3, styles.center]}>
              {course.experience} years Experience
            </Text>
            {course.user.ip_country !== '' && (
              <Text style={[styles.body3, styles.center]}>
                From {course.user.ip_country}
              </Text>
            )}
            {course.teacher_skills && course.teacher_skills.length > 0 && (
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
            )}
            {course.user &&
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
              )}
            {course.user.work_details && course.user.work_details.length > 0 && (
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
            )}
          </View>
          {teacherReviews.length > 0 ? (
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
              {/* <FlatList
          horizontal
          pagingEnabled
          data={teacherReviews.length>2 ? teacherReviews.slice(0,2) : teacherReviews}
          // keyExtractor={(_, index) => index.toString()}
          // renderItem={({review, index}) => loadReviews(review, index)}
          renderItem={({item, index}) => loadReviews(item, index)}
          keyExtractor={item => item.id}
          /> */}
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
          <View style={styles.greyBg}>
            <Text style={styles.subHeading}>Course Details</Text>
            {/* <RenderHtml
              baseStyle={styles.summary}
              contentWidth={width}
              source={{html: removeEmptyTags(course.course_description)}}
            /> */}
          </View>
          <View style={styles.additionalInfo}>
            {course.course_benefits ? (
              <Accordian
                title={course_benefits}
                data={course.course_benefits}
              />
            ) : null}
            {course.ipassio_edge ? (
              <Accordian title={ipassio_edge} data={course.ipassio_edge} />
            ) : null}
            {course.about_teacher ? (
              <Accordian title={about_teacher} data={course.about_teacher} />
            ) : null}
          </View>
          {course.faq && course.faq.length > 0 ? (
            <View style={styles.greyBg}>
              <Text style={styles.subHeading}>FAQs</Text>
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
          <View style={styles.main}>
            <Text style={styles.subHeading}>
              What Makes ipassio Your best Fit?
            </Text>

            <SvgUri
              height="80"
              uri={`${config.media_url}images/course-detail/online-classes.svg`}
            />
            <Text style={styles.courseIncludesHead}>
              Online real-time classes
            </Text>
            <Text style={styles.courseIncludesDetails}>
              From the comfort of your home, 1 on 1 online interactive classes
              are scheduled at your convenient time.
            </Text>
            <SvgUri
              height="80"
              uri={`${config.media_url}images/course-detail/pay-as-you-go.svg`}
            />
            <Text style={styles.courseIncludesHead}>Pay as you go</Text>
            <Text style={styles.courseIncludesDetails}>
              No long-term commitment. Pay for as few as 2 classes at a time.
              When you can't make it for the class, you can mutually reschedule
              with ease.
            </Text>
            <SvgUri
              height="80"
              uri={`${config.media_url}images/course-detail/world-class-performers.svg`}
            />
            <Text style={styles.courseIncludesHead}>
              World class performers as educators
            </Text>
            <Text style={styles.courseIncludesDetails}>
              Award-winning teachers customize the course just for you. Their
              structured learning methodology lets you always track your
              progress.
            </Text>
          </View>
        </ScrollView>
        </>
      ) : null}
    </>
  );
};

export default CourseDetails;

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#FFF',
    padding: 15,
  },
  reviews: {
    borderRightWidth: 1,
    borderRightColor: '#c5cbd0',
    paddingRight: 5,
    marginRight: 10,
    color: 'rgb(44, 54, 65)',
  },
  teacher: {
    color: 'rgb(44, 54, 65)',
    fontSize: 20,
    marginVertical: 10,
  },
  summary: {
    color: 'rgb(44, 54, 65)',
    lineHeight: 25,
    fontSize: 16,
    fontFamily: helper.switchFont('medium'),
  },
  iconImage: {
    height: 60,
    width: 60,
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
    height: '100%',
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
  reviewBody: {
    height: 100,
    fontFamily: helper.switchFont('light'),
    fontSize: 15,
    lineHeight: 25,
    color: 'rgb(44, 54, 65)',
  },
  infoHead: {
    fontFamily: helper.switchFont('medium'),
    fontSize: 18,
    color: 'rgb(44, 54, 65)',
  },
  body: {
    fontFamily: helper.switchFont('light'),
    fontSize: 20,
    lineHeight: 35,
    color: 'rgb(44, 54, 65)',
  },
  infoText: {
    fontFamily: helper.switchFont('light'),
    fontSize: 16,
    color: 'rgb(44, 54, 65)',
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
    height: 50,
    marginTop: 20,
    width: '100%',
    backgroundColor: brandColor,
    borderRadius: 30,
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
    fontSize: 26,
    fontWeight: 'bold',
    color: 'rgb(44, 54, 65)',
  },
  priceDetail: {
    fontFamily: helper.switchFont('regular'),
    fontSize: 16,
    color: 'rgb(44, 54, 65)',
  },
  totalReviews: {
    color: 'rgb(44, 54, 65)',
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  taught_on_icon: {
    height: 30,
    width: 30,
  },
  taught_on: {
    flexDirection: 'row',
    paddingVertical: 15,
    alignContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
    // borderWidth:1,
  },

  subHeading: {
    fontFamily: helper.switchFont('medium'),
    fontSize: 20,
    color: 'rgb(44, 54, 65)',
    marginBottom: 20,
  },
  taught_on_wrapper: {
    padding: 10,
  },
  course_includes: {
    paddingVertical: 10,
    // borderWidth:1
  },
  courseIncludesHead: {
    paddingVertical: 5,
    fontFamily: helper.switchFont('medium'),
    fontSize: 16,
    color: 'rgb(44, 54, 65)',
    // borderWidth:1
  },
  courseIncludesDetails: {
    fontFamily: helper.switchFont('regular'),
    fontSize: 14,
    marginBottom: 20,
    color: 'rgb(44, 54, 65)',
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
    width: 150,
    height: 150,
    borderRadius: 80,
    resizeMode: 'cover',
  },
  educatorPicWrapper: {
    flexDirection: 'column',
    alignSelf: 'center',
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
    color: 'rgb(44, 54, 65)',
  },
  educatorInfo: {
    paddingVertical: 15,
  },
  body2: {
    fontFamily: helper.switchFont('light'),
    fontSize: 15,
    lineHeight: 25,
    color: 'rgb(44, 54, 65)',
  },
  teacherAvailability: {
    paddingVertical: 10,
    paddingRight: 10,
    maxWidth: '50%',
  },
  body3: {
    fontFamily: helper.switchFont('light'),
    lineHeight: 20,
    color: 'rgb(44, 54, 65)',
  },
  subHeading3: {
    fontFamily: helper.switchFont('regular'),
    fontSize: 16,
    lineHeight: 20,
    color: 'rgb(44, 54, 65)',
  },
  queries: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
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
    color: 'rgb(44, 54, 65)',
  },
  prev: {
    left: 10,
    color: 'rgb(44, 54, 65)',
  },
  requestFreeMeetingButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#277fd9',
    borderRadius: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },
  requestFreeMeetingText: {
    color: '#fff',
    fontSize: 16,
  },
});
