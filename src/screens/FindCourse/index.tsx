import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  // Image,
  StyleSheet,
  FlatList,
  TextInput,
  Animated,
  ImageBackgroundComponent,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import Geolocation from 'react-native-geolocation-service';
//import {TextInput, RadioButton} from 'react-native-paper';
import DashedLine from 'react-native-dashed-line';
import {
  courseState,
  getCourses,
  getCategories,
  setPage,
  setSearchText,
  fetchCourseSuccess,
  setOffset,
  setSelectedCategories,
} from '../../reducers/courses.slice';
import {useScrollToTop} from '@react-navigation/native';
import {OutlinedTextField} from 'react-native-material-textfield';
import {ScrollView} from 'native-base';
import helper from '../../utils/helperMethods';
import {
  setLoading,
  setPageLoading,
  loaderState,
} from '../../reducers/loader.slice';
import {userState} from '../../reducers/user.slice';
import PageLoader from '../../components/PageLoader';
import DialogLoader from '../../components/DialogLoader';
import {Rating} from 'react-native-ratings';
import {SvgUri} from 'react-native-svg';
import config from '../../config/Config';
import {setCurrentCourse} from '../../reducers/courses.slice';
import {useAppDispatch} from '../../app/store';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import HeaderInner from '../../components/HeaderInner';
// import Search from '../../assets/images/search.svg';
// import Flag from '../../assets/images/flag.svg';
// import Dot from '../../assets/images/dot.svg';
import {
  font1,
  font2,
  font3,
  lineColor,
  lineColor2,
  brandColor,
  allLevels,
  intermediate,
  beginner,
  superAdvanced,
  professional,
  lineColor2light,
  background4,
  secondaryColor,
} from '../../styles/colors';
import SheetCSS from '../../styles/style';
//@ts-ignore
import {Bubbles} from 'react-native-loader';
import Drop from '../../assets/images/more_reviews.svg';
import Filter from '../../assets/images/filter.svg';
import BottomNavigation from '../../components/BottomNavigation';
import LoginNavigation from '../../components/LoginNavigation';
import StyleCSS from '../../styles/style';
import CustomImage from '../../components/CustomImage';
import LineDashed from '../../components/LineDashed';
import CustomStatusBar from '../../components/CustomStatusBar';
type Props = NativeStackScreenProps<RootParamList, 'FindCourses'>;
const {width, height} = Dimensions.get('screen');


interface FindCoursesInterface {
  query: string;
  nationality: string;
  categories: Array<string>;
  sub_categories: Array<string>;
  second_sub_categories: Array<string>;
  levels: Array<string>;
}

export interface FindCoursesInterfaceFinal {
  data: any;
  offset: number;
}

// export interface CategoryInterface {

//   nationality: string;
// }

export const Loader = () => {
  return (
    <View style={styles.loading}>
      {/* <Image
        style={styles.loader}
        source={require('@images/loading.gif')}
        resizeMode="contain"
      /> */}

      <Bubbles size={7} color={brandColor} />

      {/* <Text style={styles.loadingText}>Loading...</Text> */}
    </View>
  );
};
export default function FindCourse({navigation, route}: Props) {
  const dispatch = useAppDispatch();
  const {
    courseData,
    searchText,
    showMore,
    page,
    nationality,
    courseStatus,
    categoryData,
    categoryStatus,
    selectedCategories,
    selectedLevels,
    selectedSubcategories,
    offset,
    selectedSecsubcategories,
  } = useSelector(courseState);
  const backroute = route.params?.backroute;
  const {isLoggedIn, userData, userLocation} = useSelector(userState);
  const [initialCategories, setInitialCategories] = useState([]);
  const {loading, pageLoading} = useSelector(loaderState);
  const [search, setSearch] = useState<boolean>(false);
  const [categories, setCategories] = useState<Array<string>>([]);
  const [subcategories, setSubcategories] = useState<Array<string>>([]);
  const [levels, setLevels] = useState<Array<string>>([]);
  //const [nationality, setNationality] = useState<"indian"|"western"|"">("");
  // const [offset, setOffset] = useState<number>(0);
  const [coursesArray, setCoursesArray] = useState<Array<any>>([]);
  const [loadingMoreCourses, setLoadingMoreCourses] = useState<boolean>(false);
  // const [handleCourseState, sethandleCourseState] = useState<boolean>(false);
  // const [page, setPage] = useState<"find_course"|"home"|"">("home");



  let scrollY = new Animated.Value(0.01);
  // let changingHeight = scrollY.interpolate({
  //   inputRange: [0.01, 50],
  //   outputRange: [132, 109],
  //   extrapolate: 'clamp',
  // });
  let fixedHeight = scrollY.interpolate({
    inputRange: [0.01, 45],
    outputRange: [36, 24],
    extrapolate: 'clamp',
  });
  let titleLeft = scrollY.interpolate({
    inputRange: [0.01, 35],
    outputRange: [0, 36],
    extrapolate: 'clamp',
  });
  let titleSize = scrollY.interpolate({
    inputRange: [0.01, 35],
    outputRange: [28, 22],
    extrapolate: 'clamp',
  });
  let titleTop = scrollY.interpolate({
    inputRange: [0.01, 35],
    outputRange: [66, 30],
    extrapolate: 'clamp',
  });
  let headFade = scrollY.interpolate({
    inputRange: [0.01, 45],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  let masqFade = scrollY.interpolate({
    inputRange: [0.01, 70],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  let subTitleFade = scrollY.interpolate({
    inputRange: [0.01, 10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  let profImageSize = scrollY.interpolate({
    inputRange: [0.01, 45],
    outputRange: [43, 30],
    extrapolate: 'clamp',
  });
  let profImageRadius = scrollY.interpolate({
    inputRange: [0.01, 45],
    outputRange: [22, 15],
    extrapolate: 'clamp',
  });

  //  const [searchText, setSearchText] = useState(false)

  // useEffect(() => {
  //   if (hasLocationPermission) {
  //     Geolocation.getCurrentPosition(
  //       position => {
  //       },
  //       error => {
  //         // See error code charts below.
  //         console.log(error.code, error.message);
  //       },
  //       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //     );
  //   }
  // }, []);

  // useEffect(() => {
  //   const category_data: CategoryInterface = {
  //     page: 'home',
  //     nationality: '',
  //   };

  //   dispatch(getCategories(category_data));
  // }, []);

  useEffect(() => {
    // if(!isLoggedIn){
    dispatch(setLoading(true));
    setLoadingMoreCourses(true);
    // dispatch(setPageLoading(true));

    const data: FindCoursesInterface = {
      query: searchText,
      nationality: nationality,
      categories:
        selectedCategories.length > 0 ? selectedCategories : initialCategories,
      sub_categories: selectedSubcategories,
      second_sub_categories: selectedSecsubcategories,
      levels: selectedLevels,
    };
    const finalData: FindCoursesInterfaceFinal = {
      data: data,
      offset: offset,
    };

    dispatch(getCourses(finalData))
      .unwrap()
      .then((response: any) => {
        dispatch(setLoading(false));
        setLoadingMoreCourses(false);
        if (response.status === 'success') {
          //  dispatch(fetchCourseSuccess(response))
          // if(offset!==0) {
          //   // console.log("3 handling courses");
          //   handleCourses();
          // }
          // else{
          if (offset === 0) {
            setCoursesArray([...response.data]);
          } else {
            setCoursesArray([...coursesArray, ...response.data]);
          }
          // }
        }
        dispatch(setPageLoading(false));
      })
      .catch(() => {
        setLoadingMoreCourses(false);
        dispatch(setLoading(false));
        // dispatch(setPageLoading(false));
      });
    // }
  }, [
    searchText,
    nationality,
    selectedCategories,
    selectedSubcategories,
    selectedLevels,
    offset,
  ]);

  console.log(courseData);
  // useEffect(() => {
  //   // if(!isLoggedIn){
  //   dispatch(setLoading(true));
  //   setLoadingMoreCourses(true);
  //   // dispatch(setPageLoading(true));

  //   const data: FindCoursesInterface = {
  //     query: searchText,
  //     nationality: nationality,
  //     categories: selectedCategories,
  //     sub_categories: selectedSubcategories,
  //     levels: selectedLevels,
  //   };
  //   const finalData: FindCoursesInterfaceFinal = {
  //     data: data,
  //     offset: offset,
  //   };

  //   dispatch(getCourses(finalData))
  //     .unwrap()
  //     .then((response: any) => {
  //       dispatch(setLoading(false));
  //       setLoadingMoreCourses(false);
  //       if (response.status === 'success') {
  //         //  dispatch(fetchCourseSuccess(response))
  //         // if(offset!==0) {
  //         //   // console.log("3 handling courses");
  //         //   handleCourses();
  //         // }
  //         // else{

  //         setCoursesArray([...response.data]);
  //         // }
  //       }
  //       dispatch(setPageLoading(false));
  //     })
  //     .catch(() => {
  //       setLoadingMoreCourses(false);
  //       dispatch(setLoading(false));
  //       // dispatch(setPageLoading(false));
  //     });
  //   // }
  // }, [searchText, nationality, selectedCategories, selectedSubcategories, selectedLevels, offset]);

  // const handleCourses = () => {
  //   setCoursesArray(val=>[...val, ...courseData.data])
  // }
  const handleSearch = (text: string) => {
    dispatch(setOffset(0));
    setCoursesArray([]);
    dispatch(setSearchText(text));
  };

  const handleOffset = () => {
    if (courseData.extra_data.count.total_count > offset + 20) {
      dispatch(setOffset(offset + 20));
    }
  };

  const education = (details: any) => {
    let str = '';
    let i;
    for (i = 0; i < details.length; i++) {
      str = str.concat(details[i].degree);
      if (str.length >= 30) {
        break;
      }
      if (details[i].university) {
        str = str + ', ';
        str = str.concat(details[i].university);
      }
      if (str.length >= 30) {
        break;
      }
    }

    if (i < details.length - 1) {
      str = str + '...';
    }
    // {details.map(
    //   (s_detail: any, i: number) => (
    //     str.concat(s_detail.degree)

    //     if(s_detail.university){
    //       str.concat(s_detail.university)
    //     }
    //       {s_detail.degree}{' '}
    //       {s_detail.university && (
    //         <>from {s_detail.university}</>
    //       )}
    //     </Text>
    //   ),
    // )}
    return str;
  };
  useEffect(() => {
    let temp: Array<string> = [];

    if (Object.keys(categoryData).length !== 0) {
      for (let i = 0; i < categoryData.data.length; i++) {
        if (categoryData.data[i].is_master) {
          temp.push(categoryData.data[i].seo.seo_slug_url);
        }
      }
      setInitialCategories(temp);
      //dispatch(setSelectedCategories(temp));
    }
  }, [categoryData]);

  const map = new Map();
  map.set('A', allLevels);
  map.set('I', intermediate);
  map.set('P', professional);
  map.set('B', beginner);
  map.set('S', superAdvanced);

  const getSubstring = (details: any) => {
    let str = '';
    let i;
    for (i = 0; i < details.length; i++) {
      str = str.concat(details[i].name);
      if (str.length >= 30) {
        break;
      }
      str = str + ', ';
    }

    if (i < details.length - 1) {
      str = str + '...';
    }
    return str;
  };

const getCategorySlug=(propCourse: any)=>{
  let category_slug;
    if (
      propCourse &&
      propCourse.second_sub_category_detail &&
      propCourse.second_sub_category_detail.seo_slug_url
    ) {
      category_slug = propCourse.second_sub_category_detail.seo_slug_url;
    } else if (
      propCourse &&
      propCourse.sub_category_detail &&
      propCourse.sub_category_detail.seo_slug_url
    ) {
      category_slug = propCourse.sub_category_detail.seo_slug_url;
    } else if (
      propCourse &&
      propCourse.sub_category_detail &&
      propCourse.category_detail.seo_slug_url
    ) {
      category_slug = propCourse.category_detail.seo_slug_url;
    }

    return category_slug;
}

  const loadCourse = (course: any, index: number) => {
    return (
      <>
        {/* <View style={styles.courseWrapper}>
          <Image
            defaultSource={require('@images/default_course_img.png')}
            style={styles.courseImage}
            source={{uri: course.course_image}}
          />
          <Text style={styles.title}>{course.title}</Text>
          <View style={styles.courseDetails}>
            <Text style={styles.colorText}>
              by {course.user.first_name} {course.user.last_name}
            </Text>
            <Text style={styles.textSmall}> */}
        {/* Check for the conditions when user is logged in or not */}
        {/* {!isLoggedIn
                ? userLocation?.data?.country === 'IN'
                  ? course.user.ip_country === 'India'
                    ? `INR ${course.pricing[0].INR}`
                    : `$ ${course.pricing[0].USD}`
                  : `$ ${course.pricing[0].USD}`
                : userData?.ip_country === 'India'
                ? course.user.ip_country === 'India'
                  ? `INR ${course.pricing[0].INR}`
                  : `$ ${course.pricing[0].USD}`
                : `$ ${course.pricing[0].USD}`}{' '}
              per class{' '}
              {course.pricing[0].members === '1'
                ? '1-on-1'
                : course.pricing[0].members}{' '}
              {course.pricing[0].members !== '1' ? ' Members' : ' Class'}
            </Text>
            <Text style={styles.colorText}>{course.course_duration} Weeks</Text>
            {course.rating.avg_review !== 0 ? (
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
                <View style={styles.rating}>
                  <Text style={styles.reviews}>
                    {course.rating.avg_review}/5
                  </Text>
                  <Text style={styles.colorText}>
                    {course.rating.total_count}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
          <View style={styles.courseDetails}>
            <Text style={styles.subHead}>
              Experience{' '}
              <Text style={styles.normalText}> {course.experience} years</Text>
            </Text>
            {course.teacher_skills && course.teacher_skills.length > 0 ? (
              <Text style={styles.subHead}>
                Expert in:{' '}
                <Text style={styles.normalText}>
                  {course.teacher_skills.map((ts_keyword: any, i: number) =>
                    i > 0 ? (
                      <Text key={i}>, {ts_keyword.name}</Text>
                    ) : (
                      <Text key={i}>{ts_keyword.name}</Text>
                    ),
                  )}
                </Text>
              </Text>
            ) : null}
          </View>
          <View style={styles.courseDetails}>
            <Text style={styles.subHead}>
              Level:{' '}
              <Text style={styles.normalText}>
                {course.course_level[0].name}
              </Text>
            </Text>
            <Text style={styles.subHead}>
              Class duration :{' '}
              <Text style={styles.normalText}>
                {course.class_duration} minutes
              </Text>
            </Text>
            <Text style={styles.subHead}>
              Classes per week :{' '}
              <Text style={styles.normalText}>{course.classes_per_week}</Text>
            </Text>
          </View>
          <View style={styles.courseAction}>
            <TouchableOpacity>
              <Text style={styles.quickView}>Quick View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(setPageLoading(true));
                navigation.navigate('CourseDetail', {
                  course_slug: course.seo.seo_slug_url,
                });
              }}>
              <Text style={styles.viewCourseButton}>View Course</Text>
            </TouchableOpacity>
          </View>
        </View> */}
        <TouchableOpacity
          onPress={() => {
            // dispatch(setPageLoading(true));
            navigation.navigate('CourseDetail', {
              course_slug: course.seo.seo_slug_url,
              category_slug: getCategorySlug(course),
              teacher_slug: course.user.seo_slug_url
            });
          }}
          style={[styles.courseWrapper, StyleCSS.styles.shadow]}>
          <View
            style={{
              height: 180,
              width: '100%',
            }}>

            <CustomImage
              // defaultSource={require('@images/default_course_img.png')}
              style={styles.courseImage}
              uri={course.course_image}
            />
          </View>
          {/* <View
            style={{
              position: 'absolute',
              paddingHorizontal: 8,
              paddingVertical: 3,
              right: 16,
              top: 16,
              borderRadius: 8,
              backgroundColor: 'rgba(0, 6, 12, 0.8)',
            }}>
            <Text style={styles.cardDetail}>
              {course.course_duration} Weeks
            </Text>
          </View> */}
          {/* <LinearGradient
            start={{x: 0.0, y: 0}}
            end={{x: 0, y: 1.0}}
            colors={['rgba(233, 67, 53, 0)', 'rgba(233, 67, 53, 1)']}
            style={{
              height: 85,
              top:95,
              zIndex: 20,
              position: 'absolute',
              opacity: 0.6,
              width: '100%',
            }}></LinearGradient> */}
          {/* <View
            style={{
              position: 'absolute',
              zIndex: 40,
              top: 120,
              flexDirection: 'row',
              margin: 16,
            }}>
            {course.course_level.map((level: any, i: number) => {
              return (
                <View
                  style={{
                    paddingVertical: 3,
                    paddingHorizontal: 8,
                    backgroundColor: map.get(level.code),
                    marginVertical: 2,
                    marginHorizontal: 2,
                    borderRadius: 43,
                  }}>
                  <Text style={styles.cardDetail}>{level.name}</Text>
                </View>
              );
            })}
          </View> */}

          <View style={styles.padding16}>
            <Text style={styles.title}>{course.title}</Text>
            {/* <Text style={styles.authorName}>
                by {course.user.first_name} {course.user.last_name}
              </Text> */}
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
                          <Text style={styles.cardDetail}>, {level.name}</Text>
                        ) : (
                          <Text style={styles.cardDetail}>{level.name}</Text>
                        )}
                      </View>
                    );
                  })}
              </View>
              

              {course.rating.total_count > 0 ? (
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <View style={{marginHorizontal: 12}}>
              <CustomImage  height={5} width={5} uri={`${config.media_url}dot.svg`}></CustomImage>

              </View>
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
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.courseRatingCount}>
                        {course.rating.total_count} reviews{' '}
                      </Text>
                      <View>
                        <Drop />
                      </View>
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
          {/* <View
            style={[
              {marginHorizontal: 16},
            ]}></View> */}
          <View style={{marginHorizontal: 16}}>
            <LineDashed/>
          </View>

          <View style={{padding: 16}}>
            <Text style={styles.authorName}>
              {course.user.first_name} {course.user.last_name}
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {course.experience ? (
                <Text style={styles.experience}>
                  {course.experience} years experience
                </Text>
              ) : null}
            </View>
            {course.teacher_spotlight !== '' ? (
              <>
                {/* <View
                style={[
                  {
                    // paddingHorizontal: 16,
                    paddingVertical: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}> */}
                {/* <Flag /> */}
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 12,
                    fontWeight: '400',
                    color: font1,
                    lineHeight: 20,
                  }}>
                  {course.teacher_spotlight}
                </Text>
                {/* </View> */}
              </>
            ) : null}
          </View>

          <View style={{marginHorizontal: 16}}>
            <LineDashed/>
          </View>
          {/* <View
            style={[
              SheetCSS.styles.lineStyleDashed,
              {marginHorizontal: 16},
            ]}></View> */}
          <View
            style={[
              styles.padding16,
              SheetCSS.styles.flexDirRow,
              SheetCSS.styles.alignCenter,
            ]}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.priceText}>
                {!isLoggedIn
                  ? userLocation?.data?.country === 'IN'
                    ? course.user.ip_country === 'India'
                      ? `Rs ${course.pricing[0].INR}`
                      : `US $${course.pricing[0].USD}`
                    : `US $${course.pricing[0].USD}`
                  : userData?.ip_country === 'India'
                  ? course.user.ip_country === 'India'
                    ? `Rs ${course.pricing[0].INR}`
                    : `US $${course.pricing[0].USD}`
                  : `US $${course.pricing[0].USD}`}
              </Text>
              <Text style={styles.perSession}>
                {/* {course.class_duration ? (
                  <Text>{course.class_duration} min</Text>
                ) : null}{' '} */}{' '}
                per
                {/* {course.pricing[0].members === '1'
                  ? '1-on-1'
                  : course.pricing[0].members}{' '}
                session */}{' '}
                class
                {course.class_duration ? (
                  <Text style={styles.perSession}> | {course.class_duration} minutes</Text>
                ) : null}
                {/* {course.classes_per_week ? (
                  <Text>, {course.classes_per_week} per week</Text>
                ) : null} */}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {loadingMoreCourses ? <Loader /> : null}
      </>
    );
  };

  return (
    <>
      {pageLoading && <PageLoader />}
      <CustomStatusBar />
      <HeaderInner
        titleSize={titleSize}
        titleTop={titleTop}
        titleLeft={titleLeft}
        fixedHeight={fixedHeight}
        headFade={headFade}
        // courseHeight={config.headerHeight}
        title={'Courses'}
        logo={true}
        coursesSelected={true}
        navigation={navigation}
        type={'findCourse'}
        backroute={backroute}
      />
      <View style={styles.main}>
        {!pageLoading && courseData.status === 'success' && courseData.data ? (
          <>
            <View style={styles.safecontainer}>
              <View style={styles.filterBox}>
                <View style={{flexDirection: 'row', alignItems: 'center',width:'73%'}}>
                  <View style={styles.searchIcon}>
                <CustomImage  height={24} width={24} uri={`${config.media_url}search.svg`}></CustomImage>
                </View>
                  {/* <Search style={styles.searchIcon} /> */}
                  <TextInput
                    style={styles.input}
                    // autoFocus={true}
                    placeholder={`Search from ${courseData.extra_data.count.total_count} Courses`}
                    value={searchText}
                    enablesReturnKeyAutomatically={true}
                    keyboardAppearance='default'
                    placeholderTextColor={font2}
                    onChangeText={(text: string) => handleSearch(text)}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('FilterScreen', {
                      total_courses: courseData.extra_data.count.total_count,
                    });
                  }}
                  style={[
                    SheetCSS.styles.flexDirRow,
                    SheetCSS.styles.alignCenter,
                    styles.filterButton,
                  ]}>
                    <CustomImage  height={24} width={24} uri={`${config.media_url}filter.svg`}></CustomImage>
                  {/* <Filter /> */}
                  <Text style={styles.filter}>Filter</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={() => navigation.navigate('Categories')}>
                  <View style={styles.wrapper}>
                    <SvgUri uri={`${config.media_url}images/bar-filter.svg`} />
                    <Text style={styles.filterBoxText}>Filter</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSearch(!search)}>
                  <View style={styles.wrapper}>
                   
                    <SvgUri uri={`${config.media_url}images/bar-search.svg`} />
                    <Text
                      style={
                        search
                          ? [styles.filterBoxText, {color: brandColor}]
                          : styles.filterBoxText
                      }>
                      Search
                    </Text> 
                  </View>
                </TouchableOpacity> */}
              </View>
              {/* {search && (
                <View style={styles.searchBarWrapper}>
                  <TextInput
                    style={styles.input}
                    //label="Search"
                    onChangeText={(text: string) => handleSearch(text)}
                    textAlignVertical="top"
                    secureTextEntry={false}
                    //tintColor=font1
                    value={searchText}
                    editable={true}
                    autoCapitalize="none"
                    returnKeyType="next"
                    autoCorrect={false}
                    selectTextOnFocus={false}
                  />
                </View>
              )} */}

              {/* <Text style={styles.totalCourseText}>
                Total Course(s) : {courseData.extra_data.count.total_count}
              </Text> */}

              {/* <ScrollView contentInsetAdjustmentBehavior="always"> */}
              {/* COURSES ARE REPEATING */}
              {courseData.data.length === 0 ? (
                <Text style={styles.wrongText}>No courses found</Text>
              ) : (
                <View
                  style={{
                    // borderWidth:2,
                    // height:'100%',
                    // paddingBottom: 460,
                    backgroundColor: background4,
                    paddingTop: Platform.OS === 'android' ? 26 : 32,
                  }}>
                  <FlatList
                    data={coursesArray}
                    renderItem={({item, index}) => loadCourse(item, index)}
                    keyExtractor={item => item.id}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleOffset}
                  />
                  {/* <View style={{marginBottom:200}}/> */}
                </View>
              )}

              {loadingMoreCourses ? <Loader /> : null}
              {/* </ScrollView> */}
              <View style={{height: 200, backgroundColor: background4}}></View>
            </View>
          </>
        ) : courseStatus === 'loading' ? (
          <View style={{backgroundColor: background4, marginTop: 250}}>
            <Loader />
          </View>
        ) : (
          <Text style={styles.wrongText}>No Data to show</Text>
        )}
      </View>
      {isLoggedIn ? (
        <BottomNavigation navigation={navigation} />
      ) : (
        <LoginNavigation navigation={navigation} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: background4,
    // paddingHorizontal: 16,
    marginTop: Platform.OS==='ios' ?  120 : 116,
    // borderWidth:3
  },
  courseWrapper: {
    position: 'relative',
    marginHorizontal: 16,
    borderRadius: 15,
    backgroundColor: '#FFF',
    marginVertical: 8,
  },
  courseImage: {
    height: '100%',
    width:'100%',
    zIndex: -1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'cover',
    // overflow:'scroll'
  },

  // courseDetails: {
  //   paddingVertical: 10,
  //   borderBottomColor: '#c5cbd0',
  //   borderBottomWidth: 1,
  //   border: 1,
  // },
  courseAction: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  loaderWrapper: {
    marginHorizontal: 16,
    zIndex: 999,
    borderRadius: 10,
    marginTop: 9,
    marginBottom: 9,
    backgroundColor: '#fff',
    flex: 1,
  },
  addBorderBottom: {
    backgroundColor: '#cdcdcd',
    height: 1,
    marginTop: 16,
    marginHorizontal: 0,
    marginBottom: 0,
  },
  loaderText: {
    color: brandColor,
    fontSize: 14,
    marginBottom: 10,
    marginTop: 25,
  },
  viewCourseButton: {
    borderRadius: 17,
    color: brandColor,
    borderColor: brandColor,
    paddingHorizontal: 18,
    paddingVertical: 6,
    textAlign: 'center',
    borderWidth: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    fontFamily: helper.switchFont('medium'),
    color: font1,
  },
  subHead: {
    fontFamily: helper.switchFont('medium'),
    fontWeight: 'bold',
    color: font1,
  },
  courseRating: {
    alignItems: 'center',
    flexDirection: 'row',

    // marginTop: 12,
  },
  cardDetail: {
    color: font1,
    fontSize: 13,
    fontWeight: '500',
    fontFamily: helper.switchFont('medium'),
  },
  textSmall: {
    fontSize: 12,
    color: font1,
  },
  filter: {
    fontSize: 14,
    color: font2,
    marginLeft: 8,
  },
  filterBox: {
    position: 'absolute',
    zIndex: 9999,
    top: Platform.OS === 'android' ? -38 : -34,
    width: width - 32,
    height: 56,
    backgroundColor: '#FFF',
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 16,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    shadowColor: 'rgba(40, 47, 54)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    elevation: 8,
    shadowRadius: 30,
  },
  wrapper: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  filterBoxText: {
    marginLeft: 10,
    color: font1,
  },
  totalCourseText: {
    fontFamily: helper.switchFont('regular'),
    fontSize: 16,
    marginBottom: 10,
    paddingHorizontal: 5,
    color: font1,
  },
  loaderTextWrapper: {
    marginTop: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBorderBottomInner: {
    backgroundColor: '#cdcdcd',
    height: 1,
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 0,
  },
  loaderBottomView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    marginRight: 4,
    height: 40,
  },
  searchBarWrapper: {
    marginVertical: 10,
  },
  rating: {
    flexDirection: 'row',
    color: font1,
    marginLeft: 10,
  },
  reviews: {
    borderRightColor: '#c5cbd0',
    borderRightWidth: 1,
    paddingRight: 5,
    color: font1,
  },
  colorText: {
    color: font1,
  },
  filterButton: {
    justifyContent:'flex-end',
    paddingHorizontal:16,
    // borderWidth:1,
    marginVertical: 10,
    borderLeftWidth: 1,
    borderLeftColor: lineColor2light,
  },
  authorName: {
    color: font1,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  },
  experience: {
    color: font2,
    fontSize: 13,
    lineHeight: 16.38,
    fontWeight: '400',
    marginTop: 5,
  },
  quickView: {
    color: font1,
    marginTop: 5,
    borderBottomColor: font1,
    borderBottomWidth: 1,
  },
  normalText: {
    fontFamily: helper.switchFont('regular'),
    fontWeight: 'normal',
    color: font1,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  searchImage: {
    height: 20,
    width: 20,
  },
  // input: {
  //   color: font1,
  //   marginBottom: 5,
  //   fontSize: 18,
  //   padding: 16,
  //   height: 55,
  //   backgroundColor: 'rgb(255, 255, 255)',
  //   borderRadius: 5,
  //   fontFamily: helper.switchFont('medium'),
  //   borderWidth: 0.5,
  //   borderColor: 'rgb(200, 200, 200)',
  // },
  wrongText: {
    color: font1,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 250,
  },
  safecontainer: {
    backgroundColor: background4,
    zIndex: -1,
// borderWidth:1,
height:'100%',
paddingBottom:Platform.OS==='ios' ? 66 : 48
    // marginTop: 105,
  },
  loader: {
    height: 20,
    width: 20,
  },
  input: {
    color: font1,
    margin: 0,
    width: '80%',
    fontSize: 14,
    height: 48,
    backgroundColor: 'rgb(255, 255, 255)',
    // borderRadius: 5,
    fontFamily: helper.switchFont('medium'),
  },
  loading: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: 180,
    marginBottom: 80,
  },
  loadingText: {
    color: font1,
    fontFamily: helper.switchFont('regular'),
    fontSize: 14,
  },
  searchIcon: {
    marginLeft: 16,
    marginRight: 8,
    marginVertical: 16,
  },
  padding16: {
    padding: 16,
  },
  contentInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  contentInfo: {
    width: '45%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentDescription: {width: '55%', paddingLeft: 12},
  contentInfoText: {
    fontSize: 16,
    color: font2,
  },
  contentDescriptionText: {
    fontSize: 16,
    color: font1,
  },
  priceText: {
    fontSize: 16,
    color: font1,
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: helper.switchFont('regular'),
  },
  perSession: {
    fontSize: 12,
    fontWeight: '500',
    color: font1,
    lineHeight: 21.28,
  },
  courseRatingCount: {
    marginLeft: 8,
    fontSize: 13,
    color: font1,
    fontFamily: helper.switchFont('regular'),
  },
});
