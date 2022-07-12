import {ScrollView} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import moment from 'moment';
import 'moment-timezone';
import {Rating} from 'react-native-ratings';
import {useSelector} from 'react-redux';
import {useAppDispatch} from '../app/store';
import {getReviews} from '../reducers/courses.slice';
import {userState} from '../reducers/user.slice';
import StyleCSS from '../styles/style';
import {font1, secondaryColor} from '../styles/colors';
import CustomImage from './CustomImage';
import Config from '../config/Config';
import Helper from '../utils/helperMethods';

interface TeacherReviewsInterface {
  course: any;
  setReviewPopupOpen: any;
}

export interface ReviewsInterface {
  courseToken: string;
  isLoggedIn: boolean;
  userToken: string;
  offset: number;
}

const FirstRoute = () => <View style={{flex: 1, backgroundColor: '#fff'}} />;

const SecondRoute = () => <View style={{flex: 1, backgroundColor: '#fff'}} />;

const renderScene = SceneMap({
  cr: FirstRoute,
  tr: SecondRoute,
});

export default function TeacherReviews({
  course,
  setReviewPopupOpen,
}: TeacherReviewsInterface) {
  const dispatch = useAppDispatch();
  const {userData, isLoggedIn} = useSelector(userState);
  const [reviews, setReviews] = useState<any>(null);
  const [offset, setOffset] = useState<number>(0);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [reviewData, setReviewData] = useState<Array<any>>([]);
  const layout = useWindowDimensions();

//for tab view
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: `cr`,
      title: `Class Reviews(${reviews && reviews.extra_data.total_count})`,
    },
    { key: 'tr', title: 'TrustPilot Reviews' },
  ]);

  useEffect(() => {
    let data: ReviewsInterface = {
      courseToken: course.course_token,
      isLoggedIn: isLoggedIn,
      userToken: userData.token,
      offset: offset,
    };
    dispatch(getReviews(data))
      .unwrap()
      .then(response => {
        if (response.data.status === 'success') {
          setReviews(response.data);
          if (offset === 0) {
            setReviewData(response.data.data);
          } else {
            setReviewData([...reviewData, ...response.data.data]);
          }
        } else if (response.data.status === 'failure') {
        }
      })
      .catch();
  }, [offset]);

  const handleOffset = () => {
    if (reviews) {
      if (offset + 10 < reviews.extra_data.total_count) {
        setOffset(offset + 10);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <View style={styles.main}>
        <View style={[StyleCSS.styles.fdrCenter,{justifyContent:'space-between',width:'95%'}]}>
            
                <Text style={[styles.title]}>{course.title}</Text>
                
           
            <TouchableOpacity
            style={{width:'5%'}}
                onPress={() => {
                setReviewPopupOpen(false);
                }}
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                // style={{ borderWidth:1}}
                >
                <CustomImage
                height={24}
                width={24}
                uri={`${Config.media_url}close.svg`}
                />
            </TouchableOpacity>
        </View>
        <Text style={[StyleCSS.styles.contentText, StyleCSS.styles.marginV16]}>
                by {course.user.first_name} {course.user.last_name}
                </Text>
      <ScrollView>
        
            {/* <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        /> */}
        <View style={[{marginTop: 8}]}>
          {reviewData && reviewData.length > 0 ? (
            reviewData.map((review: any, index: number) => {
              return (
                <View>
                  <View style={{alignSelf: 'flex-start'}}>
                    <Rating
                      ratingColor={secondaryColor}
                      type="custom"
                      tintColor="#fff"
                      ratingBackgroundColor="#c8c7c8"
                      startingValue={review.rating}
                      readonly
                      ratingCount={5}
                      imageSize={16}
                      fractions={10}
                    />
                  </View>
                  <Text style={[StyleCSS.styles.contentText, {marginTop: 8}]}>
                    {review.review}
                  </Text>
                  <View
                    style={[
                      StyleCSS.styles.fdrCenter,
                      {justifyContent: 'space-between', marginTop: 8},
                    ]}>
                    <View>
                      <Text style={[StyleCSS.styles.contentText]}>
                        - {review.user_name}
                      </Text>
                      <Text style={[StyleCSS.styles.labelText, {marginTop: 8}]}>
                        Class {review.classes}
                      </Text>
                    </View>
                    <Text style={StyleCSS.styles.labelText}>
                      {moment(review.class_taken).format('ddd, MMM DD, YYYY')}
                    </Text>
                  </View>
                  <View
                    style={[
                      StyleCSS.styles.lineStyleLight,
                      StyleCSS.styles.marginV16,
                    ]}
                  />
                </View>
              );
            })
          ) : (
            <Text style={[StyleCSS.styles.labelText,{marginTop:150}]}>
              Something went wrong. Please try again later
            </Text>
          )}
          {showMore ? (
            <TouchableOpacity style={{padding: 10}} onPress={handleOffset}>
              <Text style={{textAlign: 'center'}}>Show More</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    padding: 16,
    paddingTop:24,
    paddingBottom: 24,
    height: '100%',
  },
  title:{
      fontSize:18,
      marginTop:16,
      fontFamily: Helper.switchFont('bold'),
      fontWeight:'700',
      color:font1
  }
});
