import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  // Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TextInputBase,
  Linking,
} from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
import {
  courseState,
  getCourses,
  getCategories,
  getCategoryDetails,
  getCategoryCourseList,
  getLookups,
} from '../../reducers/courses.slice';
import LinearGradient from 'react-native-linear-gradient';
import LineDashed from '../../components/LineDashed';
// import FactDesign1 from '../../assets/images/fact1.svg';
// import FactDesign2 from '../../assets/images/fact2.svg';
// import IpassioDiff1 from '../../assets/images/ipassioDiff1.svg';
// import IpassioDiff2 from '../../assets/images/ipassioDiff2.svg';
// import IpassioDiff3 from '../../assets/images/ipassioDiff3.svg';
// import IpassioDiff4 from '../../assets/images/ipassioDiff4.svg';
// import Dot from '../../assets/images/dot.svg';

//@ts-ignore
// import {OutlinedTextField} from 'react-native-material-textfield';
import {ScrollView} from 'native-base';
import {
  brandColor,
  font1,
  font2,
  font3,
  lineColor2,
  allLevels,
  intermediate,
  professional,
  beginner,
  superAdvanced,
  font4,
  font5,
  secondaryColor,
  background4,
  background5,
} from '../../styles/colors';
import style from '../../styles/style';
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
import Svg, {SvgUri} from 'react-native-svg';
import config from '../../config/Config';
import RenderHTML from 'react-native-render-html';
import VideoModal from './VideoModal';
import {setCurrentCourse} from '../../reducers/courses.slice';
import Accordian from '../../components/Accordian';
import {HowItWorks, StudentsLoveCourses, Queries} from './ReusableComponents';
import {useAppDispatch} from '../../app/store';
const {width, height} = Dimensions.get('screen');
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import {useNavigation} from '@react-navigation/native';
import HeaderInner from '../../components/HeaderInner';
import StyleCSS from '../../styles/style';
import CustomDropdown from '../../components/CustomDropdown';
import LoginNavigation from '../../components/LoginNavigation';
import CustomImage from '../../components/CustomImage';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';

const CourseCard = ({course}: any) => {
  useEffect(() => {
    //   function get_url_extension( url ) {
    //     return url.split(/[#?]/)[0].split('.').pop().trim();
    // }
    // console.log(course.course_image.split(/[#?]/)[0].split('.').pop().trim())
  });
  const map = new Map();
  map.set('A', allLevels);
  map.set('I', intermediate);
  map.set('P', professional);
  map.set('B', beginner);
  map.set('S', superAdvanced);

  const dispatch = useAppDispatch();
  const {isLoggedIn, userData, userLocation} = useSelector(userState);
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(setPageLoading(true));
        navigation.navigate('CourseDetail', {
          course_slug: course.seo_slug_url,
          category_slug: course.category_slug_url,
          teacher_slug: course.teacher.seo_slug_url,
        });
      }}
      style={styles.courseWrapper}>
      <CustomImage style={styles.courseImage} uri={course.course_image} />

      <View style={styles.padding16}>
        <Text style={styles.title}>{course.title}</Text>
        <View
          style={{
            marginTop: 8,
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          {course.top_selling ? (
            <View style={StyleCSS.styles.topSellingWrapper}>
              <Text style={StyleCSS.styles.topSellingText}>Top Selling</Text>
            </View>
          ) : null}
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

          {/* <Dot/> */}
          {/* <View></View> */}
          {course.rating.total_count > 0 ? (
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
              <View style={{marginHorizontal: 12}}>
                <CustomImage
                  height={5}
                  width={5}
                  uri={`${config.media_url}dot.svg`}></CustomImage>
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
                    <CustomImage
                      height={12}
                      width={12}
                      uri={`${config.media_url}drop.svg`}
                    />
                  </View>
                </View>
              </View>
            </View>
          ) : null}

          {/* {course.rating.total_count > 0 ? (
                
              ) : null} */}
        </View>

        {/* <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {course.experience ? (
            <Text style={styles.authorName}>
              {course.experience} years experience
            </Text>
          ) : null}
          {course.rating.total_count > 0 ? (
            <>
              <View style={styles.courseRating}>
                <Rating
                  ratingColor="#436CD7"
                  type="custom"
                  tintColor="#fff"
                  startingValue={course.rating.avg_review}
                  readonly
                  ratingCount={5}
                  imageSize={16}
                  fractions={10}
                />
                <Text style={styles.courseRatingCount}>
                  {course.rating.total_count}{' '}
                </Text>
                <View style={styles.courseRatingCount}>
                  <Drop />
                </View>
              </View>
            </>
          ) : null}
        </View> */}
      </View>
      <View style={{marginHorizontal: 16}}>
        <LineDashed />
      </View>
      <View style={{padding: 16}}>
        <Text style={styles.authorName}>{course.teacher_name}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {course.experience ? (
            <Text style={styles.experience}>
              {course.experience} years experience
            </Text>
          ) : null}
        </View>
        {course.teacher_spotlight !== '' ? (
          <>
            <View
              style={[
                {
                  // paddingVertical: 8,
                  // flexDirection: 'row',
                  // alignItems: 'center',
                },
              ]}>
              {/* <Flag /> */}
              <Text
                style={{
                  // marginLeft: 8,
                  fontSize: 12,
                  color: font2,
                  lineHeight: 20,
                }}>
                {course.teacher_spotlight}
              </Text>
            </View>
          </>
        ) : null}
      </View>
      <View style={{marginHorizontal: 16}}>
        <LineDashed />
      </View>
      <View
        style={[
          styles.padding16,
          style.styles.flexDirRow,
          style.styles.alignCenter,
        ]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.priceText}>
            {!isLoggedIn
              ? userLocation?.data?.country_code === 'IN'
                ? course.teacher.ip_country === 'India'
                  ? `₹ ${course.pricing[0].INR}`
                  : `US $${course.pricing[0].USD}`
                : `US $${course.pricing[0].USD}`
              : userData?.ip_country === 'India'
              ? course.teacher.ip_country === 'India'
                ? `₹ ${course.pricing[0].INR}`
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
              <Text> | {course.class_duration} minutes</Text>
            ) : null}
            {/* {course.classes_per_week ? (
                  <Text>, {course.classes_per_week} per week</Text>
                ) : null} */}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

type Props = NativeStackScreenProps<RootParamList, 'CategoryDetails'>;

export default function CategoryDetails({navigation, route}: Props) {
  const category_slug: string = route.params?.category_slug;
  const dispatch = useAppDispatch();
  const {
    categoryDetails,
    categoryDetailStatus,
    categoryCourseList,
    categoryCourseListStatus,
  } = useSelector(courseState);
  const {isLoggedIn, userData, userLocation} = useSelector(userState);
  const {loading, pageLoading} = useSelector(loaderState);
  const category =
    categoryDetails && categoryDetails.data && categoryDetails.data.data
      ? categoryDetails.data.data.category
      : null;
  const rating =
    categoryDetails && categoryDetails.data && categoryDetails.data.data
      ? categoryDetails.data.data.rating
      : null;
  // const course =
  //   categoryCourseList &&
  //   categoryCourseList.data &&
  //   categoryCourseList.data.data
  //     ? categoryCourseList.data.data
  //     : null;

  const [courses, setCourses] = useState<any>(null);
  const [loadingMoreCourses, setLoadingMoreCourses] = useState(false);
  const [studentTestimonial, setStudentTestimonial] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>({value: 'Filter By', label: ''});
  const [sortBy, setSortBy] = useState<any>({value: 'None', label: 'none'});
  const [offset, setOffset] = useState<number>(0);
  const [courseLevels, setCourseLevels] = useState(null);
  const [filterList, setFilterList] = useState([]);
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(true)
  let sortList: Array<any> = [];
  let valueLow: string | null= null;
  let valueHigh: string | null= null;

  if (!isLoggedIn) {
    let location = userLocation && userLocation.data.country_name === 'India';
    valueLow = location ? 'price_low' : 'usd_price_low';
    valueHigh = location ? 'price_high' : 'usd_price_high';
  } else if (isLoggedIn) {
    let location = userData && userData.ip_country === 'India';
    valueLow = location ? 'price_low' : 'usd_price_low';
    valueHigh = location ? 'price_high' : 'usd_price_high';
  }

  sortList = [
    {value: 'None', label: 'none'},
    {value: "Teacher's Experience", label: 'experience'},
    {value: 'Price : Low to High', label: valueLow && valueLow},
    {value: 'Price : High to Low', label: valueHigh && valueHigh},
    {value: 'Popularity', label: 'popularity'},
  ];

  const getSortList = (data: any) => {
    setOffset(0);
    setSortBy(data[0]);
  };
  useEffect(() => {
    dispatch(setPageLoading(true));
    let data: any = {
      category_slug: category_slug,
      filter: filter.label,
      sort_by: sortBy.label,
      offset: offset,
    };
    dispatch(getCategoryDetails(data))
      .then(res => {
        dispatch(setPageLoading(false));
      })
      .catch(() => {
        dispatch(setPageLoading(false));
      });
  }, []);

  useEffect(() => {
    let data: any = {
      category_slug: category_slug,
      filter: filter.label,
      sort_by: sortBy.label==='none' ? '' : sortBy.label,
      offset: offset,
    };
   
      // dispatch(setPageLoading(true))
      setOnEndReachedCalledDuringMomentum(true);
      setLoadingMoreCourses(true);
      dispatch(getCategoryCourseList(data))
      .unwrap()
      .then(res => {
        setOnEndReachedCalledDuringMomentum(false);

        // dispatch(setPageLoading(false))
        if (res.data.status === 'success') {
          if (offset === 0) {
            setCourses(res.data.data);
          } 
          else {
            
            setLoadingMoreCourses(false);
            // courses.push([...res.data.data]);
            setCourses([...courses, ...res.data.data]);
          }
        }
      })
      .catch(() => {
        setOnEndReachedCalledDuringMomentum(false);
        dispatch(setPageLoading(false))
        setLoadingMoreCourses(false);
      });
   
    
  }, [filter, sortBy, offset]);



  const handleOffset = () => {
    if(!onEndReachedCalledDuringMomentum){
      if (categoryCourseList.data.extra_data.course_count > offset + 10) {
        setOffset(offset + 10);
      }
      setOnEndReachedCalledDuringMomentum(true);
  }
   
  };

  // const loadCourse = (course, index) => {
  //   return (
  //     <View style={styles.courseItemWrapper}>
  //       <View style={styles.levelWrapper}>
  //         <Text style={styles.levelText}>{course.course_level[0].name}</Text>
  //       </View>
  //       <View style={styles.contentWrapper}>
  //         <Text style={styles.courseTitleText}>{course.title}</Text>
  //         {course.rating.total_count > 0 ? (
  //           <>
  //             <View style={styles.courseRating}>
  //               <Rating
  //                 // ratingColor="#277FD9"
  //                 // type="custom"
  //                 startingValue={course.rating.avg_review}
  //                 readonly
  //                 ratingCount={5}
  //                 imageSize={20}
  //                 fractions={10}
  //               />
  //               <Text>{course.rating.avg_review}/5</Text>
  //             </View>
  //             <Text>{course.rating.total_count} Reviews</Text>
  //           </>
  //         ) : null}

  //         <Text style={styles.courseDuration}>{course.course_duration}</Text>
  //         <Text>weeks</Text>
  //         <View style={styles.teacherInfo}>
  //           <Image
  //             style={styles.teacherDp}
  //             source={{uri: course.user.profile_pic}}
  //           />
  //           <Text style={styles.teacherName}>
  //             By {course.user.first_name} {course.user.last_name}
  //           </Text>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // };



  useEffect(() => {
    dispatch(getLookups())
      .unwrap()
      .then(res => {
        if (res.data.status === 'success') {
          setCourseLevels(res.data.data.course_levels);
          res.data.data.course_levels.map((item: any) =>
            filterList.push({value: item.name, label: item.code}),
          );

          filterList.push({value: 'None', label: ''});
        }
      });
  }, []);
  //make dynamic
  // const filterList = [
  //   {value: 'All Levels', label: 'A'},
  //   {value: 'Beginner', label: 'B'},
  //   {value: 'Intermediate', label: 'I'},
  //   {value: 'Professional', label: 'P'},
  //   {value: 'Super Advanced', label: 'S'},
  //   {value: 'None', label: ''},
  // ];

  const getFilter = (data: any) => {
    setOffset(0);
    setFilter(data[0]);
  };
  return (
    <>
      {pageLoading && <PageLoader />}
      <View>
        {!pageLoading &&
          categoryDetails &&
          categoryDetails.data &&
          categoryDetails.data.data &&
          category &&
          courses && (
            <>
              <HeaderInner
                title={category.category_name}
                type={'findCourse'}
                back={true}
                navigation={navigation}
                backroute={route.params?.backroute}></HeaderInner>
              <ScrollView
                      // onScrollBeginDrag = {()=>setOnEndReachedCalledDuringMomentum(false)}
                      style={{marginTop: config.headerHeight}}
                contentInsetAdjustmentBehavior="always">
                <View style={{backgroundColor: '#fff'}}>
                  {/* <Image
                    style={{
                      height: 200,
                      width: width,
                      // resizeMode: 'contain',
                      position: 'absolute',
                    }}
                    source={{uri: category.cover_picture}}
                  /> */}

                  <CustomImage
                    // height={500}
                    width={400}
                    style={{height: 200, width: '100%', marginTop: 16}}
                    uri={category.cover_picture}
                  />
                  <View style={styles.main}>
                    <View>
                      <Text style={[styles.category_heading]}>
                        {category.cover_picture_title}
                      </Text>
                      <Text style={styles.category_desc}>
                        {category.cover_picture_description}
                      </Text>
                    </View>

                    {category.todays_facts && category.todays_facts.text ? (
                      <View style={[styles.todaysFactWrapper]}>
                        <View
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            opacity: 0.6,
                          }}>
                          <CustomImage
                            height={175}
                            width={175}
                            uri={`${config.media_url}fact1.svg`}
                          />
                        </View>
                        <View
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            opacity: 0.6,
                          }}>
                          <CustomImage
                            height={175}
                            width={175}
                            uri={`${config.media_url}fact2.svg`}
                          />
                        </View>
                        <View style={styles.factHeader}>
                          <Text style={styles.factHeaderText}>
                            Today's Fact
                          </Text>
                          {/* <TouchableOpacity style={styles.shareWrapper}>
                        <CustomImage height={24} width={24} uri={`${config.media_url}share.svg`}/>

                          
                          <Text style={styles.shareText}>Share</Text>
                        </TouchableOpacity> */}
                        </View>

                        <Text style={styles.factDesc}>
                          {category.todays_facts.text}
                        </Text>
                        <Text
                          style={[
                            styles.factDesc,
                            {color: font2, marginTop: 5, fontSize: 12},
                          ]}>
                          {category.todays_facts.citation}
                        </Text>
                      </View>
                    ) : null}
                    <View style={{marginTop: 24}}>
                      {categoryDetails.data.data.ipassio_usp_title ? (
                        <Text style={[styles.subHead, {marginBottom: 16}]}>
                          {categoryDetails.data.data.ipassio_usp_title}
                        </Text>
                      ) : null}
                    </View>
                    {categoryDetails.data.data.ipassio_usps
                      ? categoryDetails.data.data.ipassio_usps.map(
                          (usps: any) => {
                            return (
                              <>
                                <View style={styles.ipassioItems}>
                                  <View style={styles.ipassioDifferentImg}>
                                    <CustomImage
                                      height={40}
                                      width={40}
                                      uri={usps.icon}
                                    />
                                    {/* <CustomImage height={24} width={24} uri={`${config.media_url}share.svg`}/> */}

                                    {/* <IpassioDiff1 /> */}
                                  </View>
                                  <Text style={styles.ipassioDifferentText}>
                                    {usps.text}
                                  </Text>
                                </View>
                                <View style={styles.lineStyleWhite} />
                              </>
                            );
                          },
                        )
                      : null}
                  </View>

                  <View style={styles.main}>
                    <Text style={styles.subHead}>
                      {category.best_course_title}
                    </Text>
                    <Text style={styles.subsubHead}>
                      {category.best_course_by}
                    </Text>
                    <View style={styles.mainRating}>
                      <Rating
                        ratingColor={secondaryColor}
                        type="custom"
                        tintColor="#fff"
                        ratingBackgroundColor="#c8c7c8"
                        startingValue={rating.avg_review}
                        readonly
                        ratingCount={5}
                        imageSize={20}
                        fractions={10}
                      />
                      <Text style={styles.rating}>
                        <Text style={styles.textBold}>
                          {rating.avg_review}/5
                        </Text>{' '}
                        from{' '}
                        <Text style={styles.textBold}>
                          {rating.total_count}
                        </Text>{' '}
                        reviews
                      </Text>
                    </View>
                    <View style={StyleCSS.styles.lineStyleLight} />
                    <View style={styles.filterWrapper}>
                      <View style={styles.filters}>
                        <CustomDropdown
                          topLabel={
                            filter.label !== '' ? 'Filter By' : undefined
                          }
                          config={{color: '#fff'}}
                          onChangeVal={getFilter}
                          data={filterList}
                          selectedIds={[]}
                          label={
                            filter.label !== '' ? filter.value : 'Filter By'
                          }
                          backTitle={'Select Filters '}
                        />
                      </View>
                      {sortList.length>0 ? <View style={styles.filters}>
                        <CustomDropdown
                          topLabel={sortBy.label !== '' ? 'Sort By' : undefined}
                          config={{color: '#fff'}}
                          onChangeVal={getSortList}
                          data={sortList}
                          selectedIds={[]}
                          label={sortBy.label !== '' ? sortBy.value : 'Sort By'}
                          backTitle={'Select Filters '}
                        />
                      </View> : null}
                    </View>

                    {/* <CustomDropdown/>
<CustomDropdown/> */}
                  </View>
                  <View style={styles.cardBackground}>
                    <FlatList
                      data={courses}
                      renderItem={({item, index}) => (
                        <CourseCard course={item} />
                      )}
                      keyExtractor={item => item.id}
                      onEndReachedThreshold={0.5}
                      onEndReached={handleOffset}
                    />
                    {/* {course.map((course: any, i: number) => {
                      return (
                        <CourseCard key={i + ' ' + course.id} course={course} />
                      );
                    })} */}
                  </View>
                </View>
                {/* <View style={styles.whiteBg}>
                <Image
                          style={{height:200, resizeMode:'contain'}}
                          source={{uri: category.detail_icon}}
                        />
                </View>
                <View style={[styles.main, styles.whiteBg]}>
                {category.category_summary ? (
                  <View>
                    <RenderHTML
                      baseStyle={styles.courseSummaryText}
                      contentWidth={width}
                      source={{
                        html: helper.removeEmptyTags(category.category_summary),
                      }}
                    />
                  </View>
                ) : null}
                </View> */}
                {/* WILL BE ADDED LATER */}
                {/* <StudentsLoveCourses
                  studentTestimonial={studentTestimonial}
                  setStudentTestimonial={setStudentTestimonial}
                /> */}
                {/* WILL BE ADDED LATER */}
                {/* <HowItWorks />
                <View style={[styles.main, {backgroundColor:background5}]}>
                  <Text style={styles.section_title}> You May Also Like</Text>
                  {category.related_category.map((item: any, i: number) => {
                    return (
                      <View key={i} style={styles.relatedCategories}>
                        <View>
                          <Text style={styles.rcTitle}>{item.name}</Text>
                          <Text style={styles.rcTitle}>Classes</Text>
                          <Text style={styles.rcPopularCourses}>
                            Popular Courses
                          </Text>
                        </View>
                        <Image
                          style={styles.relatedCategoriesImage}
                          source={{uri: item.category_icon}}
                        />
                      </View>
                    );
                  })}
                </View>
                <Queries /> */}

                {/* WILL BE ADDED LATER */}

                {/* <View style={[styles.main,{backgroundColor:background5}]}>
                  <Text style={styles.section_title}>
                    About{' '}
                    {category && category.cover_picture_title
                      ? category.cover_picture_title
                      : null}
                  </Text>
                  <RenderHTML
                    baseStyle={styles.description}
                    contentWidth={width}
                    source={{
                      html: helper.removeEmptyTags(
                        category.category_description,
                      ),
                    }}
                  />
                  <Text style={styles.popular_category_title}>
                    Popular Categories :{' '}
                  </Text>
                  <Text>
                    {category.popular_category.map((item: any, i: number) => {
                      return (
                        <TouchableOpacity
                          style={styles.popular_category_button}
                          onPress={() => {
                            navigation.push('CategoryDetails', {
                              category_slug: item.seo_slug_url,
                            });
                          }}
                          key={i}>
                          <Text style={styles.popular_category}>
                            {item.name}{' '}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </Text>
                  {category.student_come_from ? (
                    <RenderHTML
                      baseStyle={styles.description}
                      contentWidth={width}
                      source={{
                        html: helper.removeEmptyTags(
                          category.student_come_from,
                        ),
                      }}
                    />
                  ) : null}
                </View> */}
                {/* WILL BE ADDED LATER */}
                {/* {category.faq.length > 0 ? (
                  <View style={styles.faq}>
                    <Text style={styles.faq_title}>FAQs</Text>
                    {category.faq.map((faq: any) => {
                      return (
                        <Accordian
                          key={faq.id}
                          title={faq.question}
                          data={faq.answer}
                        />
                      );
                    })}
                  </View>
                ) : null} */}
                {isLoggedIn ? null : <View style={{marginBottom: 40}} />}
              </ScrollView>
            </>
          )}
      </View>
      {studentTestimonial && (
        <VideoModal
          video_url="https://www.youtube.com/embed/WwcHPmmxM98?rel=0&autoplay=1&enablejsapi=1&origin=https%3A%2F%2Fwww.ipassio.com&autoplay=1"
          studentTestimonial={studentTestimonial}
          setStudentTestimonial={setStudentTestimonial}
        />
      )}
      {isLoggedIn ? null : <LoginNavigation navigation={navigation} />}
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    padding: 16,
    // borderWidth:2
  },
  cardBackground: {
    backgroundColor: background4,
    padding: 16,
  },
  whiteBg: {
    backgroundColor: '#fff',
  },
  courseSummary: {
    backgroundColor: '#2d3744',
    padding: 16,
  },
  playButton: {
    marginTop: 24,
    height: 80,
    width: 80,
  },
  courseSummaryText: {
    fontSize: 20,
    fontFamily: helper.switchFont('medium'),
    color: font1,
    lineHeight: 32,
    fontWeight: '600',
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
  mainRating: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginBottom: 26,
  },
  textBold: {
    fontWeight: 'bold',
  },
  rating: {
    paddingVertical: 5,
    color: '#32363a',
  },
  studentsLoveCourses: {
    backgroundColor: '#FFF',
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  ipassioItems: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: background5,
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
  relatedCategories: {
    height: 140,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
  },
  relatedCategoriesImage: {
    zIndex: -1,
    height: 120,
    width: 150,
    resizeMode: 'cover',
    // borderWidth:1,
  },
  rcTitle: {
    justifyContent: 'flex-start',
    zIndex: 2,
    fontSize: 22,
    color: '#32363a',
    fontFamily: helper.switchFont('light'),
  },
  rcPopularCourses: {
    color: 'rgba(50, 54, 58, 0.9)',
    fontSize: 16,
    fontFamily: helper.switchFont('light'),
    marginTop: 20,
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
  about: {},
  description: {
    color: '#32363a',
    fontSize: 14,
    lineHeight: 20,
    //fontFamily: helper.switchFont('medium'),
  },
  popular_category_title: {
    color: '#32363a',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: helper.switchFont('regular'),
    lineHeight: 20,
    marginVertical: 10,
  },
  popular_category_button: {
    borderBottomColor: '#32363a',
    borderBottomWidth: 0.3,
    borderEndColor: '#fff',
    borderStartColor: '#fff',
  },
  popular_category: {
    color: '#32363a',
    fontSize: 14,
    fontFamily: helper.switchFont('regular'),
    lineHeight: 20,
  },
  faq: {
    backgroundColor: '#fff',
    padding: 15,
  },
  faq_title: {
    color: '#32363a',
    fontSize: 26,
    fontFamily: helper.switchFont('medium'),
    lineHeight: 30,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  factHeaderText: {
    fontSize: 24,
    color: font4,
    fontWeight: '700',
  },
  shareWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 45,
    paddingHorizontal: 11,
    paddingVertical: 7,
    backgroundColor: '#fff',
  },
  lineStyleWhite: {
    borderWidth: 4,
    borderColor: '#fff',
  },
  factDesc: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 24,
    color: font5,
  },
  courseWrapper: {
    position: 'relative',
    borderRadius: 15,
    backgroundColor: '#FFF',
    marginVertical: 8,
  },
  courseImage: {
    height: 180,
    zIndex: -1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'cover',
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
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 30,
    color: font1,
  },
  subsubHead: {
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 25,
    marginTop: 12,
    marginBottom: 8,
    letterSpacing: 0.04,
    color: font1,
  },

  cardDetail: {
    color: font1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16.38,
  },
  textSmall: {
    fontSize: 12,
    color: font1,
  },
  filter: {
    fontSize: 16,
    color: font2,
    marginLeft: 12,
  },
  filterBox: {
    height: 50,
    backgroundColor: '#FFF',
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 16,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginVertical: 10,
    borderLeftWidth: 1,
    borderLeftColor: lineColor2,
    paddingHorizontal: 16,
  },
  authorName: {
    color: font1,
    fontSize: 14,
    // marginTop: 12,
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
  ipassioDifferentImg: {
    width: '15%',
  },
  ipassioDifferentText: {
    width: '85%',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 24,
    color: font1,
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
    marginTop: 105,
  },
  loader: {
    height: 20,
    width: 20,
  },
  input: {
    color: font1,
    margin: 0,
    width: '52%',
    fontSize: 14,
    height: 48,
    backgroundColor: 'rgb(255, 255, 255)',
    // borderRadius: 5,
    fontFamily: helper.switchFont('medium'),
    // borderWidth: 0.5,
    // borderColor: 'rgb(200, 200, 200)',
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
    font2,
    font3,
    fontFamily: helper.switchFont('regular'),
    fontSize: 14,
  },
  searchIcon: {
    marginHorizontal: 20,
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
    font2,
    font3,
  },
  priceText: {
    fontSize: 16,
    color: font1,
    fontWeight: '600',
  },
  perSession: {
    fontSize: 14,
    fontWeight: '400',
    color: font1,
  },
  courseRatingCount: {
    marginLeft: 8,
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 16.38,
  },
  category_heading: {
    color: font1,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 33,
  },
  category_desc: {
    color: font2,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 30,
  },
  shareText: {
    marginLeft: 6,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
  },
  todaysFactWrapper: {
    marginTop: 24,
    backgroundColor: '#rgba(236, 164, 55, 0.2)',
    borderRadius: 8,
    padding: 24,
  },
  filterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 33,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  filters: {
    width: '48%',
  },
});
