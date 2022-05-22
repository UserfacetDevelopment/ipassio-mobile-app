import React, {useState, useEffect,FC} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  // Image,
  StyleSheet,
  Dimensions,
  Linking,
  Platform
} from 'react-native';
import {brandColor} from '../../styles/colors';
import style from '../../styles/style';
import helper from '../../utils/helperMethods';
import {Rating} from 'react-native-ratings';
import Svg, {SvgUri} from 'react-native-svg';
import config from '../../config/Config';
import {setCurrentCourse} from '../../reducers/courses.slice';
import { setPageLoading } from '../../reducers/loader.slice';
import { useAppDispatch } from '../../app/store';
import CustomImage from '../../components/CustomImage';
const {width, height} = Dimensions.get('screen');

interface StudentsLoveCoursesProps{
  studentTestimonial: any ;
  setStudentTestimonial: any ;
}

export const StudentsLoveCourses : FC<StudentsLoveCoursesProps> = ({
  studentTestimonial,
  setStudentTestimonial
} : StudentsLoveCoursesProps) => {
  return (
    <View style={styles.studentsLoveCourses}>
      <Text style={styles.studentsLoveCoursesText}>
        Students love our courses. Do you know how we know that? Because about
        98% of our students purchase the classes again. The practical tips
        shared by our teachers can be put into use immediately.
      </Text>
      <TouchableOpacity onPress={() => setStudentTestimonial(true)}>
        
        <CustomImage
          style={styles.playButton}
          
            uri={config.media_url + 'images/home-page-images/play-icon.png'}

        />
      </TouchableOpacity>
      <Text style={styles.whatStudentsSay}>What our students say about us</Text>
    </View>
  );
};

export const HowItWorks: FC = () => {
  return (
    <View style={styles.whiteBg}>
      <Text style={styles.section_title}>How it Works</Text>
      <View style={styles.how_it_works}>
        <CustomImage
          width={80}
          height={80}
          // style={styles.how_it_works_image}
          uri={`${config.media_url}images/category/how_it_work_1.svg`}
        />
        <Text style={styles.how_it_works_text}>Select your course</Text>
      </View>
      <View style={styles.how_it_works}>
        <CustomImage
          width={80}
          height={80}
          // style={styles.how_it_works_image}
          uri={`${config.media_url}images/category/how_it_work_2.svg`}
        />
        <Text style={styles.how_it_works_text}>
          Meet teacher online before enrolling
        </Text>
      </View>
      <View style={styles.how_it_works}>
        <CustomImage
          width={80}
          height={80}
          // style={styles.how_it_works_image}
          uri={`${config.media_url}images/category/how_it_work_3.svg`}
        />
        <Text style={styles.how_it_works_text}>Choose class timings</Text>
      </View>
      <View style={styles.how_it_works}>
        <CustomImage
          width={80}
          height={80}
          // style={styles.how_it_works_image}
          uri={`${config.media_url}images/category/how_it_work_4.svg`}
          //uri={`${config.media_url}images/category/how_it_work_4.svg`}
        />
        <Text style={styles.how_it_works_text}>Make payment</Text>
      </View>
      <View style={styles.how_it_works}>
        <CustomImage
          width={80}
          height={80}
          style={styles.how_it_works_image}
          uri={`${config.media_url}images/category/how_it_work_5.svg`}
        />
        <Text style={styles.how_it_works_text}>Start learning online</Text>
      </View>
    </View>
  );
};
interface CourseCardProps{
  course: any;
  navigation: any;
  teacher: any;
}

export const CourseCard: FC<CourseCardProps> = ({course, navigation, teacher}: CourseCardProps) => {
  const dispatch= useAppDispatch();
  return (
    <TouchableOpacity
      onPress={() => {
dispatch(setPageLoading(true))
          navigation.push('CourseDetail', {
            course_slug: course.seo_slug_url,
          });
        
      }}
      style={styles.courseItemWrapper}>
      <View style={styles.levelWrapper}>
        <Text style={styles.levelText}>{course.course_level[0].name}</Text>
      </View>
      <View style={styles.contentWrapper}>
        <Text style={styles.courseTitleText}>{course.title}</Text>
        {course.rating.total_count > 0 ? (
          <View>
            <View style={styles.courseRating}>
              <Rating
                // ratingColor="#277FD9"
                // type="custom"
                startingValue={course.rating.avg_review}
                readonly
                ratingCount={5}
                imageSize={20}
                fractions={10}
              />
              <Text>{course.rating.avg_review}/5</Text>
            </View>
            <Text>{course.rating.total_count} Reviews</Text>
          </View>
        ) : null}

        <Text style={styles.courseDuration}>{course.course_duration}</Text>
        <Text>weeks</Text>
        <View style={styles.teacherInfo}>
          {/* <Image
            style={styles.teacherDp}
            source={{uri: teacher.profile_pic}}
          /> */}
          {/* <Text style={styles.teacherName}>
            By {teacher.first_name} {teacher.last_name}
          </Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const Queries = () => {
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
  return (
    <View style={styles.whiteBg}>
      <View style={styles.queries}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(
              `whatsapp://send?phone=${+919740050326}&text=Hello`,
            );
          }}>
          <CustomImage
            uri={`${config.media_url}images/course-detail/whatsapps.svg`}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={dialCall}>
          <CustomImage
            uri={`${config.media_url}images/course-detail/contacts.svg`}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.queriesText]}>For any Queries</Text>
      <View style={styles.free_meeting_wrapper}>
        <Text style={styles.free_meeting_text}>
          Start with a free meeting session now!
        </Text>
        <TouchableOpacity style={styles.free_meeting_button}>
          <Text style={styles.free_meeting_button_text}>Pick a course</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  greyBg: {
    backgroundColor: '#f9f9fa',
    padding: 15,
  },
  whiteBg: {
    backgroundColor: '#fff',
    padding: 15,
    maxWidth: width,
  },

  playButton: {
    marginTop: 24,
    height: 80,
    width: 80,
  },
  courseItemWrapper: {
    paddingVertical: 32,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 16,
    borderBottomColor: '#e85a53',
    borderBottomWidth: 4,
  },
  levelWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 30,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: '#e85a53',
  },
  courseRating: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingTop: 24,
  },
  levelText: {
    color: '#FFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 14,
  },
  contentWrapper: {
    paddingHorizontal: 32,
  },
  courseTitleText: {
    fontSize: 24,
    marginTop: 32,
    fontFamily: helper.switchFont('regular'),
    color: '#32363a',
  },
  courseDuration: {
    paddingTop: 24,

    fontSize: 60,
    color: '#32363a',
    fontFamily: helper.switchFont('medium'),
  },
  teacherInfo: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  teacherDp: {
    height: 50,
    width: 50,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  teacherName: {
    fontFamily: helper.switchFont('light'),
    fontSize: 16,
    marginLeft: 12,
    color: '#32363a',
    textTransform: 'capitalize',
  },

  textBold: {
    fontWeight: 'bold',
  },

  studentsLoveCourses: {
    backgroundColor: '#FFF',
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  studentsLoveCoursesText: {
    fontSize: 22,
    color: '#32363a',
    lineHeight: 32,
  },
  whatStudentsSay: {
    fontSize: 30,
    fontFamily: helper.switchFont('light'),
    marginVertical: 20,
    color: '#32363a',
  },
  how_it_works: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section_title: {
    fontSize: 40,
    fontFamily: helper.switchFont('light'),
    marginVertical: 20,
    color: '#32363a',
    textAlign: 'center',
  },
  how_it_works_image: {
    flex: 0.3,
  },
  how_it_works_text: {
    marginLeft: 20,
    flex: 0.7,
    fontSize: 20,
    color: '#32363a',
    fontFamily: helper.switchFont('light'),
    flexWrap: 'wrap',
    //marginVertical: 20,
  },

  queries: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  queriesText: {
    textAlign: 'center',
    color: '#32363a',
    fontSize: 28,
    marginTop: 10,
    fontFamily: helper.switchFont('light'),
  },
  free_meeting_wrapper: {
    backgroundColor: '#333641',
    padding: 30,
    marginTop: 30,
  },
  free_meeting_text: {
    color: '#fff',
    fontSize: 30,
    fontFamily: helper.switchFont('light'),
  },
  free_meeting_button: {
    marginTop: 20,
    backgroundColor: '#e94335',
    padding: 20,
    borderRadius: 30,
  },
  free_meeting_button_text: {
    textAlign: 'center',
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: helper.switchFont('medium'),
  },
});
