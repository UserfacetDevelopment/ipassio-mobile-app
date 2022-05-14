import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  LayoutAnimation,
} from 'react-native';
import {useSelector} from 'react-redux';
import {userState} from '../reducers/user.slice';
import SheetCSS from '../styles/style';
import Moment from 'moment';
import Helper from '../utils/helperMethods';
import Dropdown from '../assets/images/dropdown.svg';
import {font1, font2, font3, lineColor} from '../styles/colors';
import StyleCSS from '../styles/style';

export default function TransactionCard({
  data,
  selectedTransaction,
  setSelectedTransaction,
  index,
  source,
}: any) {
  const {userData} = useSelector(userState);

  return (
    <View>
      {selectedTransaction === data.ref_id ? (
        <View style={[styles.highlightedWrappper, SheetCSS.styles.shadow]}>
          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setSelectedTransaction(0);
            }}>
            <View style={[styles.cardHeadSection]}>
              {userData.user_type === 'T' && (
                <Image
                  source={{uri: data.student.profile_pic}}
                  style={[styles.profilePic]}
                />
              )}
              {userData.user_type === 'S' && (
                <Image
                  source={{uri: data.course.course_image}}
                  style={[styles.profilePic]}
                />
              )}

              <View style={[styles.cardTitleWrapper]}>
                <Text style={styles.cardTitle}>
                  {userData.user_type === 'T' && data.student.name}
                  {userData.user_type === 'S' && data.course.title}
                  {userData.user_type === 'S' &&
                    (data.class_type === '1'
                      ? ' (1-on-1 Class)'
                      : ' ( ' + data.class_type + ' Members)')}
                </Text>
                <View style={styles.itemRowItem}>
                  <Text style={styles.contentText}>
                    {Moment(data.created).format('MMM DD, yyyy')}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: '#E0E6ED',
                  opacity: 0.8,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Dropdown />
              </View>
            </View>
          </TouchableOpacity>

          <View style={SheetCSS.styles.lineStyleDashed} />
          {userData.user_type === 'T' ? (
            <View style={styles.collapsedCard}>
              <View style={styles.itemRow}>
                <View>
                  <Text style={styles.contentLabel}>Course</Text>
                  <Text style={styles.contentText}>
                    {data.course.title}{' '}
                    {userData.user_type === 'T' &&
                      (data.class_type === '1'
                        ? ' (1-on-1 Class)'
                        : ' ( ' + data.class_type + ' Members)')}
                  </Text>
                </View>
              </View>

              <View style={SheetCSS.styles.lineStyleDashed} />
            </View>
          ) : null}
          <View style={styles.itemRow}>
            <View style={styles.itemRowItem}>
              <Text style={styles.contentLabel}>Ref. Id</Text>
              <Text style={styles.contentText}>{data.ref_id}</Text>
            </View>

            <View style={styles.itemRowItem}>
              <Text style={styles.contentLabel}>Transaction Type</Text>
              <Text style={styles.contentText}>
                {data.transaction_type.name}
              </Text>
            </View>
          </View>

          <View style={SheetCSS.styles.lineStyleDashed} />

          <View style={styles.itemRow}>
          <View style={styles.itemRowItem}>
              {userData.user_type === 'T' ? <><Text style={styles.contentLabel}>Balance</Text>
              <Text style={[styles.contentText, styles.boldText]}>
                {data.currency_type === 'INR' ? 'Rs.' : 'US$'}
                {data.balance}
              </Text></> : null }
            </View>
            <View style={styles.itemRowItem}>
              <Text style={styles.contentLabel}>Amount</Text>
              <Text
                style={[
                  styles.contentText,
                  styles.font3Color,
                  styles.boldText,
                ]}>
                {data.currency_type === 'INR' ? 'Rs.' : 'US$'}
                {data.amount}
              </Text>
            </View>
            
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
            setSelectedTransaction(data.ref_id);
          }}>
          <View style={[styles.cardWrapperNS]}>
            <View style={styles.transactionItem}>
              <View>
                {userData.user_type === 'T' && (
                  <Image
                    source={{uri: data.student.profile_pic}}
                    style={[styles.profilePic]}
                  />
                )}
                {userData.user_type === 'S' && (
                  <Image
                    source={{uri: data.course.course_image}}
                    style={[styles.profilePic]}
                  />
                )}
              </View>
              <View style={styles.cardTitleWrapperNS}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.cardTitle}>
                    {userData.user_type === 'T' && data.student.name}
                    {userData.user_type === 'S' && data.course.title}
                    {userData.user_type === 'S' &&
                      (data.class_type === '1'
                        ? ' (1-on-1 Class)'
                        : ' ( ' + data.class_type + ' Members)')}
                  </Text>
                </View>
                <View style={styles.dateWrapper}>
                  <Text style={styles.date}>
                    {Moment(data.created).format('MMM DD, yyyy')}
                  </Text>
                  <Text style={styles.amount}>
                    {data.currency_type === 'INR' ? 'Rs.' : 'US$'}
                    {data.amount}
                  </Text>
                </View>
              </View>
            </View>
            <Dropdown />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#ffffff',
  // },
  // safecontainer: {
  //   flex: 1,
  //   // backgroundColor: '#FEFEFE',
  // },
  scrollView: {
    flex: 1,
    marginTop: 90,
  },
  body: {
    flex: 1,
    fontSize: 15,
    color: '#606060',
    lineHeight: 24,
    marginRight: 8,
  },

  walletWrapper: {
    zIndex: 1,
  },
  wallet: {
    padding: 40,
    height: 154,
  },
  transactionsWrapper: {
    flex: 1,
    marginTop: -80,
    paddingTop: 75,
    zIndex: 0,
  },
  transactionItem: {
    flexDirection: 'row',
  },
  dateWrapper: {flexDirection: 'row', marginTop: 6},
  lineStyle: {
    borderBottomWidth: 1,
    borderColor: '#E2E4E5',
    width: '95%',
    alignSelf: 'center',
  },
  highlightedWrappper: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 4,
  },
  border: {
    borderWidth: 4,
  },
  cardWrapperNS: {
    marginHorizontal: 16,
    padding: 16,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
  },
  itemRow: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRowItem: {
    width: '50%',
  },
  contentLabel: {
    fontSize: 16,
    color: font2,
    fontFamily: Helper.switchFont('regular'),
  },
  contentText: {
   
    color: font1,
    fontSize: 16,
    fontFamily: Helper.switchFont('medium'),
    marginTop: 4,
  },
  font3Color: {
    color: font3,
  },
  boldText: {
    fontWeight: 'bold',
  },
  cardTitle: {
    width: '90%',
    fontSize: 18,
    color: font1,
    flexWrap: 'wrap',
    fontWeight: '500',
    fontFamily: Helper.switchFont('medium'),
  },
  cardTitleWrapper: {
    marginLeft: 10,
    width: '72%',
    justifyContent: 'center',
  },
  cardTitleWrapperNS: {marginLeft: 10, width: '75%'},

  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
  },
  bubblesWrapper: {
    flex: 1,
    marginTop: -13,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 35,
  },
  loaderWrapper: {
    paddingHorizontal: 32,
  },
  cardHeadSection: {
    flexDirection: 'row',
    paddingVertical: 16,
    justifyContent: 'center',
  },
  amount: {
    fontSize: 16,
    color: font3,
    width: '50%',
    textAlign: 'right',
    fontFamily: Helper.switchFont('medium'),
  },
  date: {
    fontSize: 16,
    color: font2,
    width: '50%',
    fontFamily: Helper.switchFont('regular'),
  },
  collapsedCard: {
    backgroundColor: '#fff',
  },
});
