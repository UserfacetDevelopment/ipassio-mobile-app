import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import config from '../../config/Config';
import {brandColor} from '../../styles/colors';
import {userState} from '../../reducers/user.slice';
import VideoModal from './VideoModal';
import {
  getTeacherCalender,
  teacherAvailability,
  setTeacherReviews,
  courseState,
  getTeacherReviews,
  getCategoryTeacher,
} from '../../reducers/courses.slice';
import {setLoading, setPageLoading, loaderState} from '../../reducers/loader.slice';
import PageLoader from '../../components/PageLoader';
import helper from '../../utils/helperMethods';
import style from '../../styles/style';
import { CourseCard, HowItWorks, Queries, StudentsLoveCourses } from './ReusableComponents';
import { RootState, useAppDispatch } from '../../app/store';
const {width, height} = Dimensions.get('screen');
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParamList } from '../../navigation/Navigators';
import HeaderInner from '../../components/HeaderInner';

type Props = NativeStackScreenProps<RootParamList, 'TeacherDetails'>;

export interface TeacherCategory {
  teacher_slug: string;
  category_slug: string;
}

export default function TeacherDetails({navigation, route} :Props) {
  const dispatch = useAppDispatch();
  const {categoryTeacherLoading, categoryTeacher, course} = useSelector(courseState);
  const {loading, pageLoading} = useSelector(loaderState);
  const [studentTestimonial, setStudentTestimonial] = useState<boolean>(false);

  useEffect(() => {
      const data :TeacherCategory = {
        teacher_slug: course.user.seo_slug_url,
        category_slug: course.category_detail.seo_slug_url
      }
    dispatch(getCategoryTeacher(data))
    dispatch(setPageLoading(false));
  }, []);

  return (
      <>
      <HeaderInner
      type={'findCourse'}
      title={''}
      navigation={navigation}
      back={true}
      />
      {pageLoading || categoryTeacher.length ===  0 ? <PageLoader/> :
      <ScrollView style={{marginTop:109}}>
      <View style={styles.main}>
          <Text style={[styles.subHeading, styles.center]}>
            Educator Profile
          </Text>
          {categoryTeacher.profile_pic != '' && (
            <View style={styles.educatorPicWrapper}>
              <Image
                style={styles.educatorProfilePic}
                source={{uri: categoryTeacher.profile_pic}}
              />
            </View>
          )}
          <Text style={[styles.subHeading2, styles.center]}>
            {categoryTeacher.first_name} {categoryTeacher.last_name}
          </Text>
          <Text style={[styles.body3, styles.center]}>
            {course.experience} years Experience
          </Text>
          {categoryTeacher.ip_country !== '' && (
            <Text style={[styles.body3, styles.center]}>
              From {categoryTeacher.ip_country}
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
          {categoryTeacher && categoryTeacher.study_details && categoryTeacher.study_details.length > 0 && (
            <View style={styles.educatorInfo}>
              <Image
                style={styles.iconImage}
                source={{
                  uri: config.media_url + 'images/course-detail/education.png',
                }}
              />
              <Text style={styles.subHeading2}>Education </Text>
              <Text style={styles.body2}>
                {categoryTeacher.study_details.map((s_detail: any, i: number) => (
                  <Text key={i}>
                    {s_detail.degree}{' '}
                    {s_detail.university && <>from {s_detail.university}</>}
                  </Text>
                ))}
              </Text>
            </View>
          )}
          {categoryTeacher.work_details && categoryTeacher.work_details.length > 0 && (
            <View style={styles.educatorInfo}>
              <Image
                style={styles.iconImage}
                source={{
                  uri:
                    config.media_url + 'images/course-detail/work-details.png',
                }}
              />
              <Text style={styles.subHeading2}>Work Details </Text>
              <Text style={styles.body2}>
                {categoryTeacher.work_details.map((work: any, i:number) => (
                  <Text key={i}>
                    {work.position + ' - ' + work.organisation}
                  </Text>
                ))}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.courseSection}>
            <Text style={style.styles.headingBold}>Courses</Text>
            {categoryTeacher.course.map((course : any) => {
                return(
                    <CourseCard key={course.id} course={course} teacher={categoryTeacher} navigation={navigation}/>
                //     <TouchableOpacity
                //     onPress={() => {
                //         dispatch(setPageLoading(true))
                //         navigation.push('CourseDetail', {
                //           course_slug: course.seo_slug_url,
                //         });
                      
                //     }}
                //     style={styles.courseItemWrapper}>
                //     <View style={styles.levelWrapper}>
                //       <Text style={styles.levelText}>{course.course_level[0].name}</Text>
                //     </View>
                //     <View style={styles.contentWrapper}>
                //       <Text style={styles.courseTitleText}>{course.title}</Text>
                //       {course.rating.total_count > 0 ? (
                //         <View>
                //           <View style={styles.courseRating}>
                //             <Rating
                //               // ratingColor="#277FD9"
                //               // type="custom"
                //               startingValue={course.rating.avg_review}
                //               readonly
                //               ratingCount={5}
                //               imageSize={20}
                //               fractions={10}
                //             />
                //             <Text>{course.rating.avg_review}/5</Text>
                //           </View>
                //           <Text>{course.rating.total_count} Reviews</Text>
                //         </View>
                //       ) : null}
              
                //       <Text style={styles.courseDuration}>{course.course_duration}</Text>
                //       <Text>weeks</Text>
                //       <View style={styles.teacherInfo}>
                //         <Image
                //           style={styles.teacherDp}
                //           source={{uri: categoryTeacher.profile_pic}}
                //         />
                //         <Text style={styles.teacherName}>
                //           By {categoryTeacher.first_name} {categoryTeacher.last_name}
                //         </Text>
                //       </View>
                //     </View>
                //   </TouchableOpacity>
                    )
            })}
            </View>
            <StudentsLoveCourses studentTestimonial={studentTestimonial} setStudentTestimonial={setStudentTestimonial}/>
            <HowItWorks/>
            <Queries/>
        </ScrollView>
}{studentTestimonial && (
                        <VideoModal
                          video_url="https://www.youtube.com/embed/WwcHPmmxM98?rel=0&autoplay=1&enablejsapi=1&origin=https%3A%2F%2Fwww.ipassio.com&autoplay=1"
                          studentTestimonial={studentTestimonial}
                          setStudentTestimonial={setStudentTestimonial}
                        />
                      )}
        </>
  );
}

const styles = StyleSheet.create({
    main: {
      backgroundColor: '#FFF',
      padding: 15,
    },

    teacher: {
      color: 'rgb(44, 54, 65)',
      fontSize: 20,
      marginVertical: 10,
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
    body: {
      fontFamily: helper.switchFont('light'),
      fontSize: 20,
      lineHeight: 35,
      color: 'rgb(44, 54, 65)',
    },
    whiteText: {
      color: '#FFF',
    },
    subHeading: {
      fontFamily: helper.switchFont('medium'),
      fontSize: 20,
      color: 'rgb(44, 54, 65)',
      marginBottom: 20,
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
      fontSize: 16,
      lineHeight: 25,
      color: 'rgb(44, 54, 65)',
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
    courseSection:{
        padding:15,
        paddingBottom:20,
        backgroundColor:'#f4f5f9'
    }
    
  });