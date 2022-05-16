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
import {brandColor, font1, font2, font3, lineColor} from '../styles/colors';
import StyleCSS from '../styles/style';
import DashedLine from 'react-native-dashed-line';

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
             <View style={{ height:56, width:56, borderWidth:1.3, borderColor:brandColor, justifyContent:'center', alignItems:'center', borderRadius: 30}}>
                <Image
                  source={{uri:userData.user_type === 'T' ?  data.student.profile_pic : userData.user_type === 'S' ? data.course.course_image : null}}
                  style={[styles.profilePic]}
                />
              </View>
              <View style={[styles.cardTitleWrapper, {paddingVertical:userData.user_type === 'S' ? 0 : 6}]}>
                <Text style={[styles.cardTitle, {lineHeight : userData.user_type==='S' ? 20 : 18}]}>
                  {userData.user_type === 'T' && data.student.name}
                  {userData.user_type === 'S' && data.course.title}
                  {userData.user_type === 'S' &&
                    (data.class_type === '1'
                      ? ' (1-on-1 Class)'
                      : ' ( ' + data.class_type + ' Members)')}
                </Text>
                {/* <View style={[styles.dateWrapper]}>
                  <Text style={styles.date}>
                    {Moment(data.created).format('MMM DD, yyyy')}
                  </Text>
                </View> */}
                 <View style={[styles.dateWrapper, {marginTop: userData.user_type === 'S' ? 8 : 5}]}>
                  <Text style={styles.date}>
                    {Moment(data.created).format('MMM DD, yyyy')}
                  </Text>
                  </View>
              </View>
              <View
                style={{
                  width: 28,
                  height: 28,
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

          <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={5}
              dashColor={lineColor}
            />
          {userData.user_type === 'T' ? (
            <View style={styles.collapsedCard}>
              <View style={styles.itemRow}>
                <View>
                  <Text style={styles.contentLabel}>Course</Text>
                  <Text style={[styles.contentText,{fontWeight:'600',  lineHeight:20}]}>
                    {data.course.title}{' '}
                    {userData.user_type === 'T' &&
                      (data.class_type === '1'
                        ? ' (1-on-1 Class)'
                        : ' ( ' + data.class_type + ' Members)')}
                  </Text>
                </View>
              </View>

              <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={5}
              dashColor={lineColor}
            />
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

          <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={5}
              dashColor={lineColor}
            />
          <View style={styles.itemRow}>
          <View style={styles.itemRowItem}>
              {userData.user_type === 'T' ? <><Text style={styles.contentLabel}>Balance</Text>
              <Text style={[styles.contentText]}>
                {data.currency_type === 'INR' ? 'Rs.' : 'US$'}
                {data.balance}
              </Text></> : null }
            </View>
            <View style={styles.itemRowItem}>
              <Text style={[styles.contentLabel]}>Amount</Text>
              <Text
                style={[
                  styles.amount,{marginTop:5}
                ]}>
                {data.currency_type === 'INR' ? 'Rs.' : 'US$'}
                {' '}{data.amount}
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
              <View >
               
                  <Image
                    source={{uri: userData.user_type === 'T' ? data.student.profile_pic :  userData.user_type === 'S' ? data.course.course_image : null}}
                    style={[styles.profilePic]}
                  />
               
              </View>
              <View style={[styles.cardTitleWrapperNS]}>
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
                  <Dropdown/>
                </View>
                <View style={[styles.dateWrapper, {marginTop: userData.user_type === 'S' ? 8 : 5}]}>
                  <Text style={styles.date}>
                    {Moment(data.created).format('MMM DD, yyyy')}
                  </Text>
                  <Text style={[styles.amount]}>
                    {data.currency_type === 'INR' ? 'Rs.' : 'US$'}
                    {' '}{data.amount}
                  </Text>
                </View>
              </View>
              
            </View>
            
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  transactionItem: {
    flexDirection: 'row',
    width:'100%'  
  },
  dateWrapper: { flexDirection: 'row', alignItems:'center', marginTop: 5, justifyContent:'space-between', width:'100%', flex:1},
  lineStyle: {
    borderBottomWidth: 1,
    borderColor: '#E2E4E5',
    width: '95%',
    alignSelf: 'center',
  },
  highlightedWrappper: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    marginVertical: 4,
    
  },
  cardWrapperNS: {
    // borderWidth:1,
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
    // borderWidth:1,
  },
  contentLabel: {
    // borderWidth:1,
    fontSize: 14,
    color: font2,
    // lineHeight:18,
    fontWeight:'500',
    fontFamily: Helper.switchFont('medium'),
  },
  contentText: {
    // borderWidth:1,
    color: font1,
    fontSize: 14,
    fontWeight:'500',
    fontFamily: Helper.switchFont('medium'),
    marginTop: 5,
  },
  font3Color: {
    color: font3,
  },
  boldText: {
    fontWeight: 'bold',
  },
  cardTitle: {
    width: '90%',
    fontSize: 14,
    fontWeight:'600',
    color: font1,
    flexWrap: 'wrap',
    textTransform:'capitalize',
    //lineHeight:20,
    fontFamily: Helper.switchFont('medium'),
  },
  cardTitleWrapper: {
    marginLeft: 16,
    flex:1,
    // borderWidth:1,
    // flexDirection:'row',
    // width: '72%',
    justifyContent: 'space-between',
    // alignItems:'center'
  },
  cardTitleWrapperNS: {marginLeft: 16, flex:1},

  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 25,
    alignItems: 'center',
  },

  cardHeadSection: {
    flexDirection: 'row',
    paddingVertical: 16,
    justifyContent: 'center',
    // alignItems:'center',
    // borderWidth:1
  },
  amount: {
    fontSize: 14,
    color: font1,
    
    // lineHeight:18,
    fontWeight:'500',
    fontFamily: Helper.switchFont('medium'),
  },
  date: {
    fontSize: 14,
    color: font2,
    fontWeight:'500',
    fontFamily: Helper.switchFont('medium'),
  },
  collapsedCard: {
    backgroundColor: '#fff',
  },
});
