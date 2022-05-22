import React, {FC} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  // Image,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import {Rating} from 'react-native-ratings';
import RenderHtml from 'react-native-render-html';
import moment from 'moment';
import {brandColor} from '../../styles/colors';
import helper from '../../utils/helperMethods';
import {SvgUri} from 'react-native-svg';
import CustomImage from '../../components/CustomImage';

const {width, height} = Dimensions.get('screen');

interface TeacherReviewProps {
  reviewModalVisible: boolean;
  setReviewModalVisible: any;
  index: number;
  teacherReviews: any;
}
const TeacherReview: FC<TeacherReviewProps> = ({
  reviewModalVisible,
  setReviewModalVisible,
  index,
  teacherReviews,
}: TeacherReviewProps) => {
  const review = teacherReviews[index];
  //const {width} = useWindowDimensions();
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={reviewModalVisible}
        onRequestClose={() => {
          setReviewModalVisible(!reviewModalVisible);
        }}
        presentationStyle="formSheet"
        // WARNING : Modal with 'formSheet' presentation style and 'transparent' value is not supported.
      >
        <View style={styles.modal}>
          <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
            {/* <SvgUri style={styles.icon} uri={`${config.media_url}images/login-close-btn.svg`}/> */}
            <Text style={styles.closeIcon}>X</Text>
          </TouchableOpacity>
          <ScrollView contentInsetAdjustmentBehavior="always">
            <View style={styles.review_rating}>
              <Rating
                // ratingColor="#277FD9"
                // type="custom"
                startingValue={review.rating}
                readonly
                ratingCount={5}
                imageSize={20}
                fractions={10}
              />
            </View>

            <Text style={styles.subHeading2}>{review.title}</Text>
            {review.review ? (
              <RenderHtml
                baseStyle={styles.body2}
                contentWidth={width}
                source={{html: helper.removeEmptyTags(review.review)}}
              />
            ) : null}
            <View style={styles.student}>
              {review.student && review.student.profile_pic ? (
                
                <CustomImage
                  style={styles.studentDp}
                  uri={review.student.profile_pic}
                />
              ) : null}
              <View>
                {review.student && review.student.name ? (
                  <Text style={styles.subHeading2}>{review.student.name}</Text>
                ) : null}
                <Text style={styles.body3}>
                  Updated{' '}
                  {moment(review.review_datetime).format('MMM DD, YYYY')}
                </Text>
              </View>
            </View>
            <Text style={[styles.verifiedBy]}>
              Verified By {review.review_source.name}
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default TeacherReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: height,
    backgroundColor: 'rgb(0,0,0)',

    opacity: 0.1,
  },
  modal: {
    //backgroundColor:'#ccc',
    height: height / 2,
    backgroundColor: '#fff',
    marginTop: 100,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingBottom: 0,
    borderRadius: 10,
  },
  review_rating: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  summary: {
    color: 'rgb(44, 54, 65)',
    lineHeight: 25,
    fontSize: 16,
    fontFamily: helper.switchFont('medium'),
  },
  icon: {
    height: 30,
    width: 30,
    resizeMode: 'cover',
  },
  closeIcon: {
    fontSize: 17,
    color: 'rgb(44, 54, 65)',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  body: {
    fontFamily: helper.switchFont('light'),
    fontSize: 20,
    lineHeight: 35,
    color: 'rgb(44, 54, 65)',
  },

  subHeading: {
    fontFamily: helper.switchFont('medium'),
    fontSize: 20,
    color: 'rgb(44, 54, 65)',
    marginBottom: 20,
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

  body2: {
    fontFamily: helper.switchFont('light'),
    fontSize: 15,
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
  verifiedBy: {
    fontFamily: helper.switchFont('light'),
    fontSize: 18,
    lineHeight: 35,
    color: 'rgb(44, 54, 65)',
    marginTop: 20,
  },
  studentDp: {
    height: 60,
    width: 60,

    resizeMode: 'cover',

    marginRight: 20,
    borderRadius: 40,
  },
  student: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
