import React, {FC, useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  Platform,
  LayoutAnimation,
  UIManager,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import PageLoader from '../../components/PageLoader';
import CustomStatusBar from '../../components/CustomStatusBar';
import SheetCSS from '../../styles/style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
//import AppMessage from "@helpers/AppMessage.js";
import NoData from '../../components/NoData';
// @ts-ignore
import {Bubbles} from 'react-native-loader';
//import HeaderInner from "@components/Elements/HeaderInner.js";
import Moment from 'moment';
import {RootParamList} from '../../navigation/Navigators';
import {useSelector} from 'react-redux';
import {userState} from '../../reducers/user.slice';
import {loaderState} from '../../reducers/loader.slice';
import {brandColor, font1, font2, lineColor, secondaryColor, secondaryColorBorder} from '../../styles/colors';
import Helper from '../../utils/helperMethods';
import config from '../../config/Config';
import {
  setWithdrawMethods,
  withdrawalState,
  withdrawList,
  withdrawMethods,
  withdrawRequest,
  fetchWithdrawalDataSuccess,
  fetchWithdrawalsDataFailure
} from '../../reducers/withdrawal.slice';
import {useAppDispatch} from '../../app/store';
import HeaderInner from '../../components/HeaderInner'
import BottomNavigation from '../../components/BottomNavigation';
import DashedLine from 'react-native-dashed-line';

type Props = NativeStackScreenProps<RootParamList, 'Withdraw'>;

interface WithdrawRequestInterface {
  withdrawl_id: Array<any>;
  status: string;
  withdraw_method: string | null;
}

export interface FinalWithdrawRequestInterface {
  data: WithdrawRequestInterface;
  userToken: string;
}
const width= Dimensions.get('screen').width;

const Withdrawal: FC<Props> = ({navigation, route}) => {
  const dispatch = useAppDispatch();
  const {userData} = useSelector(userState);
  const {pageLoading} = useSelector(loaderState);
  const {withdrawalData, withdrawalDataStatus, withdrawMethod} =
    useSelector(withdrawalState);
  const [selectedIds, setSelectedIds] = useState<Array<string>>([]);
  const [selectedTransaction, setSelectedTransaction] = useState(0);
  const [walletBalance, setWalletBalance] = useState('0.00');
  const [refreshing, setRefreshing] = useState(false);
  // const [isLoadMore, setIsLoadMore] = useState(false);
   const [lockLoadMore, setLockLoadMore] = useState(false);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);
  const routes = useRoute();
  let scrollY = new Animated.Value(0.01);
  let changingHeight = scrollY.interpolate({
    inputRange: [0.01, 70],
    outputRange: [109, 109],
    extrapolate: "clamp",
  });
  let changingHeight2 = scrollY.interpolate({
    inputRange: [0.01, 70],
    outputRange: [82, 55],
    extrapolate: "clamp",
  });
  let titleSize = scrollY.interpolate({
    inputRange: [0.01, 35],
    outputRange: [24, 18],
    extrapolate: "clamp",
  });
  let mainTitleSize = scrollY.interpolate({
    inputRange: [0.01, 35],
    outputRange: [28, 24],
    extrapolate: "clamp",
  });
  let titleTop = scrollY.interpolate({
    inputRange: [0.01, 50],
    outputRange: [20,10],
    //   Platform.OS === "ios" ? 28 : 28,
    //   Platform.OS === "ios" ? 8 : 8,
    // ],
    extrapolate: "clamp",
  });
  let titleSubTop = scrollY.interpolate({
    inputRange: [0.01, 50],
    outputRange: [16, 16],
    extrapolate: "clamp",
  });
  let thirdTitleTop = scrollY.interpolate({
    inputRange: [0.01, 50],
    outputRange: [48, 16],
    extrapolate: "clamp",
  });
  let balanceSize = scrollY.interpolate({
    inputRange : [0.01, 50],
    outputRange: [14, 18],
    extrapolate:"clamp"
  });
  let thirdTitleLeft = scrollY.interpolate({
    inputRange: [0.01, 50],
    outputRange: [16, 90],
    extrapolate: "clamp",
  });
  const height = scrollY.interpolate({
    inputRange:[0.01, 50],
    outputRange:[100, 0],
    extrapolate:'clamp'
  })

  useEffect(() => {
    // setting appstatus ad appstatusMessage
 

    getWithdrawList();
    getWithdrawMethod();
  }, []);

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const onRefresh = () => {
    setRefreshing(false);
    setSelectedIds([]);
    setWalletBalance("0.00")
    getWithdrawList();
    getWithdrawMethod();
    // });
  };

  const getWithdrawList = () => {
    setLockLoadMore(true);

    dispatch(withdrawList(userData.token))
      .unwrap()
      .then(response => {
        if (response.data.status === 'success') {
          setWalletBalance(
            response.data.extra_data.currency_type === 'INR'
              ? 'Rs.' + response.data.extra_data.total_balance
              : 'US$' + response.data.extra_data.total_balance,
          );

          dispatch(fetchWithdrawalDataSuccess(response.data.data));
        } else if (response.data.status === 'failure') {
          Alert.alert('', response.data.error_message.message, [
            {text: 'Okay', style: 'cancel'},
          ]);
        }
      })
      .catch(err => {
        dispatch(fetchWithdrawalsDataFailure());
        setLockLoadMore(false);
        // this.setState({
        //  
        //   appStatus: "failure",
        //   
        //   appStatusMessage: config.messages.common_error,
        //   
        // });

        // setTimeout(() => {
        //   this.setState({ appStatus: "" });
        //   this.setState({ appStatusMessage: "" });
        // }, 7000);
      });
  };

  const getWithdrawMethod = () => {
    dispatch(withdrawMethods(userData.token))
      .unwrap()
      .then(response => {
        if (response.data.status === 'success') {
          let APIData = response.data.data;
          for (var i = 0; i < APIData.length; i++) {
            if (APIData[i].default_method) {
              dispatch(setWithdrawMethods(APIData[i].id));
              break;
            } else {
              dispatch(setWithdrawMethods(APIData[0].id));
              break;
            }
          }
        }
      })
      .catch(err => {});
  };

  const doWithdrawRequest = (nid = 0) => {
    let ids: Array<number | string> = selectedIds;
    if (nid) {
      ids = [nid];
    }

    let data: WithdrawRequestInterface = {
      withdrawl_id: ids,
      status: 'P',
      withdraw_method: withdrawMethod ? withdrawMethod : null,
    };

    let finalData: FinalWithdrawRequestInterface = {
      data: data,
      userToken: userData.token,
    };
    // isLoadingPost is also not doing anything
    // this.setState({ isLoadingPost: true });
    dispatch(withdrawRequest(finalData))
      .unwrap()
      .then(response => {
        // this.setState({ isLoadingPost: false });
        cancelSelections();
        if (response.data.status == 'success') {
          navigation.navigate('ActionStatus', {
            messageStatus: 'success',
            messageTitle: 'Congratulations!',
            messageDesc: response.data.error_message.message,
            timeOut: 4000,
            backRoute: 'Withdraw',
          });
          getWithdrawList();
          getWithdrawMethod();
        } else if (response.data.status === 'failure') {
          navigation.navigate('ActionStatus', {
            messageStatus: 'failure',
            messageTitle: 'Sorry!',
            messageDesc: response.data.error_message.message,
            timeOut: 4000,
            backRoute: 'Withdraw',
          });
        }
      })
      .catch(error => {
        // this.setState({ isLoadingPost: false });

        navigation.navigate('ActionStatus', {
          messageStatus: '',
          messageTitle: 'Sorry!',
          messageDesc: config.messages.common_error,
          timeOut: 4000,
          backRoute: 'Withdraw',
        });
      });
  };

  //not used since on press onlt setting the selecteTeransaction state to true
  //const expandTransaction = () => {};

  const cancelSelections = () => {
    setSelectedIds([]);
    setSelectedTransaction(0);
  };

  const loaderItems = () => {
    return (
      <View style={[styles.transactionBox, SheetCSS.styles.shadow]}>
        <TouchableOpacity style={SheetCSS.styles.flexDirRow}>
          <View style={SheetCSS.styles.justifyContentCenter}>
            <Image
              source={require('@images/default_dp.png')}
              style={styles.profilePic}
            />
          </View>
          
            <View style={styles.bubblesWrapper}>
              <Bubbles size={7} color={brandColor} />
            </View>
         
        </TouchableOpacity>
      </View>
    );
  };

  const addId = (nid: any) => {
    if (!selectedIds.includes(nid)) {
      setSelectedIds([...selectedIds, nid]);
    } else {
      let temp = selectedIds.filter(id => {
        return id !== nid;
      });
      setSelectedIds(temp);
    }
  };

  const loadItems = (data: any, index: number) => {
    return (
      <View>
        {selectedTransaction == data.id ? (
          <View style={[styles.highlightedWrappper, SheetCSS.styles.shadow]}>
            <View style={styles.cardHeadSection}>
              <TouchableOpacity
                style={SheetCSS.styles.flexDirRow}
                onPress={() => {
                  setSelectedTransaction(0);
                }}>
                <View style={SheetCSS.styles.justifyContentCenter}>
                  <View style={{height:56, width:56, borderRadius:30, borderWidth:1.3, borderColor:brandColor, justifyContent:'center', alignItems:'center'}}>
                  <Image
                    source={{uri: data.student.profile_pic}}
                    style={styles.profilePic}
                  />
                  </View>
                </View>
                <View style={styles.cardHeadSelected}>
                  <Text style={styles.cardTitle}>
                    {userData.user_type === 'T' && data.student.name}
                    {userData.user_type === 'S' && data.course.title}
                    {userData.user_type === 'S' &&
                      (data.class_type === '1'
                        ? '(1-on-1 Class)'
                        : '( ' + data.class_type + ' Members)')}
                  </Text>
                  <View style={styles.dateWrapper}>
                    {/* <Text style={styles.amount}>
                      {data.currency_type === 'INR' ? 'Rs.' : 'US$ '}
                      {data.amount}
                    </Text> */}
                    <Text style={styles.date}>
                      {Moment.tz(data.created, userData.timezone).format(
                        // 'ddd, MMM DD, YYYY',
                        'MMM DD, YYYY',
                      )}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.addIdWrapper}>
                {data.status.code === 'A' ||
                data.status.code === 'C' ||
                data.status.code === 'P' ? null : (
                  <TouchableOpacity
                    onPress={() => {
                      addId(data.id);
                    }}>
                    <Image
                      style={styles.radioButtonImage}
                      source={
                        selectedIds.includes(data.id)
                          ? require('@images/checked.png')
                          : require('@images/unchecked.png')
                      }
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            
            <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={5}
              dashColor={lineColor}
            />
            {userData.user_type === 'T' ? (
              <View>
                <View style={styles.itemRow}>
                  <View>
                    <Text style={styles.contentLabel}>Course</Text>
                    <Text style={styles.contentText}>
                      {data.course.title}{' '}
                      {userData.user_type === 'T' &&
                        (data.class_type === '1'
                          ? '(1-on-1 Class)'
                          : '( ' + data.class_type + ' Members)')}
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
                <Text style={styles.contentLabel}>Attended On</Text>
                <Text style={styles.contentText}>
                  {data.attended_on
                    ? Moment.tz(data.attended_on, userData.timezone).format(
                        'ddd, MMM DD, YYYY',
                      )
                    : '-'}
                </Text>
              </View>
              <View style={styles.itemRowItem}>
                <Text style={styles.contentLabel}>Amount</Text>
                <Text style={styles.contentText}>
                      {data.currency_type === 'INR' ? 'Rs.' : 'US$ '}
                      {data.amount}
                    </Text>
              </View>
             
              
            </View>

            {data.status ? (
              <>
               <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={5}
              dashColor={lineColor}
            />
              <View style={styles.itemRow}>
                <View style={[styles.itemRowItem, {flexDirection:'row', alignItems:'center'}]}>
                  <Text style={styles.contentLabel}>Status</Text>
                  {data.status.code === 'RW' && (
                    <Text style={[styles.contentStatus, styles.status_text_rw]}>
                      {data.status.name}
                    </Text>
                  )}
                  {data.status.code === 'P' && (
                    <Text style={[styles.contentStatus, styles.status_text_p]}>
                      {data.status.name}
                    </Text>
                  )}
                  {data.status.code === 'A' && (
                    <Text style={[styles.contentStatus, styles.status_text_a]}>
                      {data.status.name}
                    </Text>
                  )}
                  {data.status.code === 'C' && (
                    <Text style={[styles.contentStatus, styles.status_text_c]}>
                      {data.status.name}
                    </Text>
                  )}
                  {data.status.code === 'R' && (
                    <Text style={[styles.contentStatus, styles.status_text_r]}>
                      {data.status.name}
                    </Text>
                  )}
                  </View>
                </View>
                </>
              ) : null}
            {selectedIds.length > 0 ||
            data.status.code === 'A' ||
            data.status.code === 'C' ||
            data.status.code === 'P' ? null : (
              <View style={[styles.itemRow, {alignItems: 'center', paddingTop:8}]}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    cancelSelections();
                  }}>
                  <Text style={styles.cancelText}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.withdrawButton}
                  onPress={() => {
                    Alert.alert('', config.messages.withdraw_warn, [
                      {text: 'Cancel', style: 'cancel'},
                      {
                        text: 'OK',
                        onPress: () => doWithdrawRequest(data.id),
                      },
                    ]);
                  }}>
                  <Text style={styles.withdrawText}>Withdraw</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.transactionBox, SheetCSS.styles.shadow]}>
            <TouchableOpacity
              style={SheetCSS.styles.flexDirRow}
              onPress={() => {
                setSelectedTransaction(data.id);
                // expandTransaction(
                //   data.id,
                //   !(
                //     data.status.code === "A" ||
                //     data.status.code === "C" ||
                //     data.status.code === "P"
                //   )
                // );
              }}>
              <View style={SheetCSS.styles.justifyContentCenter}>
                <Image
                  source={{uri: data.student.profile_pic}}
                  style={styles.profilePic}
                />
              </View>
              <View style={styles.cardHeadNSelected}>
                <Text style={styles.cardTitle}>{data.student.name}
                  {/* {userData.user_type === 'T' && data.student.name}
                  {userData.user_type === 'S' && data.course.title}
                  {userData.user_type === 'S' &&
                    (data.class_type === '1'
                      ? '(1-on-1 Class)'
                      : '( ' + data.class_type + ' Members)')} */}
                </Text>
                <View
                  style={styles.amtDateWrapper}>
                  <Text
                    style={styles.amount}>
                    {data.currency_type === 'INR' ? 'Rs. ' : 'US $'}
                    {data.amount}
                  </Text>
                  
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.addIdWrapper2}>
              
              {data.status.code === 'A' ||
              data.status.code === 'C' ||
              data.status.code === 'P' ? null : (
                <TouchableOpacity
                  onPress={() => {
                    // data.status.code === 'A' ||
                    // data.status.code === 'C' ||
                    // data.status.code === 'P'
                    //   ? null
                    //   :
                    addId(data.id);
                  }}>
                  <Image
                    style={styles.radioButtonImage}
                    source={
                      // data.status.code === 'A' ||
                      // data.status.code === 'C' ||
                      // data.status.code === 'P'
                      //   ? require('@images/dchecked.png')
                      //   :
                      selectedIds.includes(data.id)
                        ? require('@images/checked.png')
                        : require('@images/unchecked.png')
                    }
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.status}>
            <Text style={styles.date}>
                    {Moment.tz(data.created, userData.timezone).format(
                      // 'ddd, MMM DD, YYYY',
                      'MMM DD, YYYY',
                    )}
                  </Text>
            
              {data.status.code === 'A' ||
              data.status.code === 'C' ||
              data.status.code === 'P' ? (
                <>
                  {data.status.code === 'RW' && (
                    <Text style={[styles.contentText, styles.status_text_rw]}>
                      {data.status.name}
                    </Text>
                  )}
                  {data.status.code === 'P' && (
                    <Text style={[styles.contentText, styles.status_text_p]}>
                      {data.status.name}
                    </Text>
                  )}
                  {data.status.code === 'A' && (
                    <Text style={[styles.contentText, styles.status_text_a]}>
                      {data.status.name}
                    </Text>
                  )}
                  {data.status.code === 'C' && (
                    <Text style={[styles.contentText, styles.status_text_c]}>
                      {data.status.name}
                    </Text>
                  )}
                  {data.status.code === 'R' && (
                    <Text style={[styles.contentText, styles.status_text_r]}>
                      {data.status.name}
                    </Text>
                  )}
                </>
              ) : selectedIds.length <= 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert('', config.messages.withdraw_warn, [
                      {text: 'Cancel', style: 'cancel'},
                      {
                        text: 'OK',
                        onPress: () => doWithdrawRequest(data.id),
                      },
                    ]);
                  }}>
                  <Text style={styles.mainLink}>Withdraw</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, SheetCSS.styles.shadowWrapper]}>
      <CustomStatusBar />
      {pageLoading ? (
        <PageLoader />
      ) : (
        <View style={styles.safecontainer}>
          <HeaderInner
              mainTitleSize={mainTitleSize}
              thirdTitleTop={thirdTitleTop}
              thirdTitleLeft={thirdTitleLeft}
              titleSubTop={titleSubTop}
              titleSize={titleSize}
              titleTop={titleTop}
              changingHeight={changingHeight}
              walletHeight={250}
              logo={true}
              title={"Withdraw"}
              walletBalance={walletBalance}
              navigation={navigation}
              type={"findCourse"}
              backroute={routes.name}
            />
            <>
                    <Animated.View style={{position:'absolute', top:109, height:changingHeight2}}>
                    <Image
                style={{flex: 1,
                  width: width,
                  flexDirection: 'row',
                  height:140}}
                source={require('@images/header_bg.png')}
              />
              </Animated.View>
                     <Animated.View
              style={{backgroundColor:'#000',
              opacity:0.1,
              zIndex:2,
              height: changingHeight2,
              position:'absolute',
              top:109,
              width:'100%'
              }}>

              </Animated.View>
                    <Animated.Text
                    style={[
                      {
                       
                        marginTop: titleSubTop,
                        fontSize: titleSize,
                        position:'absolute',
                        top:109,
                        fontWeight:'700',
                        marginLeft: thirdTitleLeft,
                        zIndex:4,
                        color:'#fff',
                        borderColor:'#fff',
                      }
                    ]}>
                    {`${walletBalance}`}
                  </Animated.Text>
                  <Animated.Text
                    style={[
                      {marginTop: thirdTitleTop, position:'absolute', fontSize: balanceSize,
                      top:109, color:'#fff', opacity:0.7, fontWeight:'bold', margin: 16,
                    },
                    ]}>
                    Balance
                  </Animated.Text>
                    </>

          <ScrollView
            style={[styles.scrollView]}
            keyboardShouldPersistTaps={'handled'}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
          >
            <View style={{marginTop:39}}/>
            <View style={styles.loaderWrapper}>
              {withdrawalDataStatus === 'loading' ? (
                <View style={styles.transactionsWrapper}>
                  {loaderItems()}
                  {loaderItems()}
                  {loaderItems()}
                  {loaderItems()}
                </View>
              ) : (
                <View style={styles.transactionsWrapper}>
                  {withdrawalData.length <= 0 &&
                  withdrawalDataStatus === 'success' ? (
                    <NoData message={'No Data Found'} />
                  ) : (
                    <View>
                      <FlatList
                        data={withdrawalData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => loadItems(item, index)}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
            
          </ScrollView>
          {/* <AppMessage
              status={this.state.appStatus}
              statusMessage={this.state.appStatusMessage}
            /> */}
          {selectedIds.length > 0 ? (
            <View style={styles.bottomBarWrapper}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  cancelSelections();
                }}>
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.withdrawButton}
                onPress={() => {
                  Alert.alert('', config.messages.withdraw_warn, [
                    {text: 'Cancel', style: 'cancel'},
                    {
                      text: 'OK',
                      onPress: () => doWithdrawRequest(),
                    },
                  ]);
                }}>
                <Text style={styles.withdrawText}>
                  WITHDRAW ({selectedIds.length})
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      )}
      <BottomNavigation navigation={navigation} selected={'W'}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safecontainer: {
    flex: 1,
    //backgroundColor: "#FEFEFE",
  },
  scrollView: {
    flex: 1,
    marginTop:164
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
    // marginTop: -60,
    // paddingTop: 75,
    zIndex: 0,
  },
  transactionItem: {
    flexDirection: 'row',
    marginVertical: 12,
    marginHorizontal: 24,
    zIndex: 9999,
  },
  lineStyle: {
    borderBottomWidth: 1,
    borderColor: '#E2E4E5',
    width: '95%',
    alignSelf: 'center',
  },
  lineStyleFull: {
    borderBottomWidth: 1,
    borderColor: '#E2E4E5',
    width: '100%',
    alignSelf: 'center',
  },
  highlightedWrappper: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  itemRow: {
    paddingVertical: 16,
    flexDirection: 'row',
  },
  itemRowItem: {
    width: '50%',
  },
  contentLabel: {
    fontSize: 14,
    color: font2,
    fontWeight:'500',
    lineHeight:18,
    fontFamily: Helper.switchFont('medium'),
  },
  contentText: {
    color: font1,
    fontSize: 14,
    fontWeight:'500',
    fontFamily: Helper.switchFont('medium'),
    marginTop: 5,
  },
  status_text_rw: {
    color: 'rgb(82, 85, 91)',
  },
  status_text_p: {
    color: 'rgb(255, 165, 0)',
  },
  status_text_a: {
    color: 'rgb(39, 127, 217)',
  },
  status_text_c: {
    color: 'rgba(40, 190, 145, 1)'
  },
  status_text_r: {
    color: brandColor
  },

  mainLink: {
    fontWeight:'700',
    // borderWidth:1,
    fontSize: 14,
    color: brandColor,
    fontFamily: Helper.switchFont('medium'),
  },
  transactionBox: {
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    padding: 16,
  },
  cardTitle: {
    fontSize: 14,
    color: font1,
    fontWeight:'600',
    flexWrap: 'wrap',
    textTransform:'capitalize',
    fontFamily: Helper.switchFont('semibold'),
  },
  cancelText: {
    color: secondaryColor,
    fontSize: 14,
    fontWeight:'700',
    textAlign: 'center',
    lineHeight:18,
    fontFamily: Helper.switchFont('bold'),
  },
  cancelButton: {
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: 'fff',
    borderColor: secondaryColorBorder,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: '49%',
    zIndex: 1,
    borderWidth: 1,
    marginRight: '3%',
  },
  withdrawText: {
    color: '#fff',
    textAlign: 'center',
lineHeight:18,
fontWeight:'700',
    fontSize: 14,
    fontFamily: Helper.switchFont('bold'),
  },
  withdrawButton: {
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: brandColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: '49%',
    zIndex: 1,
  },
  amount: {
    fontSize: 14,
    color: font1,
    fontWeight:'500',
    fontFamily: Helper.switchFont('medium'),
  },
  date: {
    fontSize: 14,
    color: font2,
    fontWeight:'500',
    lineHeight:18,
    fontFamily: Helper.switchFont('medium'),
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
  },
  bubblesWrapper: {
    flex: 1,
    marginTop: -5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 35,
    
  },
  cardHeadSection: {
    flexDirection: 'row',
    paddingVertical: 16,
    justifyContent: 'center',
  },
  cardHeadNSelected:{marginLeft: 12, flex:1},
  radioButtonImage: {
    height: 20,
    width: 20,
  },
  bottomBarWrapper: {
    alignItems: 'center',
    paddingVertical: 30, //10 after adding tab navigation
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    bottom:64
    
  },
  cardHeadSelected:{marginLeft: 12, marginTop: 6, flex:1},
  dateWrapper:{flexDirection: 'row', marginTop: 5},
  addIdWrapper:{position: 'absolute', right: 0, top: 39},
  addIdWrapper2:{position: 'absolute', right: 24, top: 39,},
  status:{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop: 10},
  amtDateWrapper:{marginTop: 5},
  loaderWrapper:{
    flex: 1, 
    // borderWidth:1,
    // marginTop: 20, 
    marginBottom:80},
    contentStatus:{
      fontSize:14,
      fontWeight:'700',
      lineHeight:18,
      fontFamily: Helper.switchFont('bold'),
      marginLeft:8,
      fontStyle:'italic'

    }
});


export default Withdrawal;
