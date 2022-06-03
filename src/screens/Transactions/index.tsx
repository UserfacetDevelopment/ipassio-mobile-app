import React, {useEffect, useState, FC} from 'react';
import {
  View,
  // Image,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  LayoutAnimation,
  RefreshControl,
  Animated,
  Dimensions,
Platform
} from 'react-native';
import Moment from 'moment';
import 'moment-timezone';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import {useAppDispatch} from '../../app/store';
import CustomStatusBar from '../../components/CustomStatusBar';
import SheetCSS from '../../styles/style';
import NoData from '../../components/NoData';
//@ts-ignore
import {Bubbles} from 'react-native-loader';
import Helper from '../../utils/helperMethods';
import {useSelector} from 'react-redux';
import {userState} from '../../reducers/user.slice';
import {
  fetchTransactions,
  fetchTransactionsDataFailure,
  fetchTransactionsDataSuccess,
  withdrawalState,
} from '../../reducers/withdrawal.slice';
import config from '../../config/Config'
import {background4, brandColor} from '../../styles/colors';
import HeaderInner from '../../components/HeaderInner'
import TransactionCard from '../../components/TransactionCard';
import BottomNavigation from '../../components/BottomNavigation';
import LinearGradient from 'react-native-linear-gradient';
import { configureFonts } from 'react-native-paper';
import CustomImage from '../../components/CustomImage';

const width= Dimensions.get('screen').width;
type Props = NativeStackScreenProps<RootParamList, 'Transactions'>;

const Transaction: FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {userData} = useSelector(userState);
  const {transactionsData, transactionsDataStatus} =
    useSelector(withdrawalState);
  const [selectedTransaction, setSelectedTransaction] = useState(0);
  const [walletBalance, setWalletBalance] = useState('0.00');
  const [refreshing, setRefreshing] = useState(false);

let scrollY= new Animated.Value(0.01);
let changingHeight, titleSize, mainTitleSize, titleTop, titleSubTop, thirdTitleTop, thirdTitleLeft;

    // changingHeight = scrollY.interpolate({
    //   inputRange: [0.01, 70],
    //   outputRange: [100, 100],
    //   extrapolate: "clamp",
    // });
    let changingHeight2 = scrollY.interpolate({
      inputRange: [0.01, 70],
      outputRange: [Platform.OS === 'android' ? 68 : 72, Platform.OS === 'android' ? 36 : 40],
      extrapolate: "clamp",
    });
    titleSize = scrollY.interpolate({
      inputRange: [0.01, 35],
      outputRange: [22, 18],
      extrapolate: "clamp",
    });
    mainTitleSize = scrollY.interpolate({
      inputRange: [0.01, 35],
      outputRange: [28, 24],
      extrapolate: "clamp",
    });
    titleTop = scrollY.interpolate({
      inputRange: [0.01, 50],
      outputRange: [20,10],
      //   Platform.OS === "ios" ? 28 : 28,
      //   Platform.OS === "ios" ? 8 : 8,
      // ],
      extrapolate: "clamp",
    });
    titleSubTop = scrollY.interpolate({
      inputRange: [0.01, 50],
      outputRange: [Platform.OS === 'android'? 8 : 12, Platform.OS === 'android'? 4 :8],
      extrapolate: "clamp",
    });
    thirdTitleTop = scrollY.interpolate({
      inputRange: [0.01, 50],
      outputRange: [Platform.OS === 'android' ? 36 : 40, Platform.OS === 'android' ? 6 : 10],
      extrapolate: "clamp",
    });
    let balanceSize = scrollY.interpolate({
      inputRange : [0.01, 50],
      outputRange: [14, 16],
      extrapolate:"clamp"
    });
    thirdTitleLeft = scrollY.interpolate({
      inputRange: [0.01, 50],
      outputRange: [16, 88],
      extrapolate: "clamp",
    });
    const height = scrollY.interpolate({
      inputRange:[0.01, 50],
      outputRange:[100, 0],
      extrapolate:'clamp'
    })
    // const fontWeight =scrollY.interpolate({
    //   inputRange:[0.01, 50],
    //   outputRange:[bold, normal],
    //   extrapolate:'clamp'
    // })
    const balOpacity =scrollY.interpolate({
      inputRange:[0.01, 50],
      outputRange:[0.7, 1],
      extrapolate:'clamp'
    })

    useEffect(()=>{
    getTransactions();
  }, []);

  const onRefresh = () => {
    setRefreshing(false);
    setSelectedTransaction(0);
    // setWalletBalance('0.00');
    getTransactions();
  };

  const getTransactions = () => {
    dispatch(fetchTransactions(userData.token))
      .unwrap()
      .then(response => {
        if (response.data.status === 'success') {
          setWalletBalance(
            response.data.extra_data.currency_type === 'INR'
              ? 'Rs.' + " " +response.data.extra_data.total_balance
              : 'US$' + " " +response.data.extra_data.total_balance,
          );
          console.log(response);
          dispatch(fetchTransactionsDataSuccess(response.data.data));
        } else if (response.data.status === 'failure') {
          Alert.alert('', response.data.error_message.message, [
            {text: 'Okay', style: 'cancel'},
          ]);
        }
      })
      .catch(err => {
        dispatch(fetchTransactionsDataFailure());
        // setState({ appStatus: "failure" });
        // setState({ appStatusMessage: config.messages.common_error });

        //   setTimeout(() => {
        //     setState({ appStatus: "" });
        //     setState({ appStatusMessage: "" });
        //   }, 7000);
      });
  };

  const loaderItems = () => {
    return (
      <View style={styles.loaderWrapper}>
        <View style={styles.transactionItem}>
          <View>
            <CustomImage
              uri={`${config.media_url}default_dp.png`}
              style={styles.profilePic}
            />
          </View>
          <View style={styles.bubblesWrapper}>
            <Bubbles size={7} color={brandColor} />
          </View>
        </View>

        <View style={styles.lineStyle} />
      </View>
    );
  };

  const loadItems = (data: any, index: number) => {
    return (
      <TransactionCard data={data} index={index} selectedTransaction={selectedTransaction}  setSelectedTransaction={setSelectedTransaction} source={"Transactions"}/>
    );
  };

  return (
    <View style={[SheetCSS.styles.shadowWrapper, styles.container]}>
      <CustomStatusBar type={'inside'} />

      <View style={[styles.safecontainer,SheetCSS.styles.shadowWrapper]}>
        <HeaderInner
            thirdTitleTop={thirdTitleTop}
            thirdTitleLeft={thirdTitleLeft}
            titleSubTop={titleSubTop}
            titleSize={titleSize}
            mainTitleSize={mainTitleSize}
            titleTop={titleTop}
            backroute={'Transactions'}
            changingHeight={config.headerHeight}
            title={"Transactions"}
            walletBalance={walletBalance}
            navigation={navigation}
            logo={true}
            type={"findCourse"}
            // height={height}
          />
           {userData.user_type === 'T' ?
                    <>
                    <Animated.View style={{position:'absolute', top:config.headerHeight, height:changingHeight2}}>
                    <CustomImage
                style={{flex: 1,
                  width: width,
                  flexDirection: 'row',
                  height:config.headerHeight}}
                uri={`${config.media_url}transactions_bg.png`}
              />
              {/* <View style={{flex: 1,
                  width: width,
                  backgroundColor:'#b1281e',
                  flexDirection: 'row',
                  height:140}}/> */}
                  {/* <LinearGradient
       start={{x: 0, y: 0}} end={{x: 1, y: 0}}
        colors={['#E04033', '#A8190E']}
        style={{
          height: 140,
          top: headerHeight,
          // zIndex: 20,
          position: 'absolute',
          // opacity: 0.6,
          width: '100%',
        }}></LinearGradient> */}
              </Animated.View>
                     <Animated.View
              style={{backgroundColor:'#000',
              opacity:0.1,
              zIndex:2,
              height: changingHeight2,
              position:'absolute',
              top:config.headerHeight,
              width:'100%'
              }}>

              </Animated.View>
                    <Animated.Text
                    style={[
                      styles.walletTitle,
                      {
                       
                        marginTop: titleSubTop,
                        fontSize: titleSize,
                        position:'absolute',
                        top:config.headerHeight,
                        fontWeight:'700',
                        marginLeft: thirdTitleLeft,
                        zIndex:4,
                        color:'#fff',
                        borderColor:'#fff',
                      },
                    ]}>
                    {`${walletBalance}`}
                  </Animated.Text>
                  <Animated.Text
                    style={[
                      styles.walletSubTitle,
                      {marginTop: thirdTitleTop, position:'absolute', fontSize: balanceSize,
                      top:config.headerHeight, color:'#fff', opacity:0.9, fontWeight:'600', marginLeft: 16, marginBottom:12,
                    },
                    ]}>
                    Balance
                  </Animated.Text>
                    </> : null}

        <ScrollView
          style={userData.user_type === 'T' ? styles.scrollViewT : styles.scrollViewS}
          keyboardShouldPersistTaps={'handled'}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: false},
          )}
        >
         {userData.user_type === 'T' ? <View
              style={{ marginTop: 51}}
            ></View> : <View
            style={{ marginTop: 16 }}
          ></View> }
          {transactionsDataStatus === 'loading' ? (
            <View style={styles.transactionsWrapper}>
              {loaderItems()}
              {loaderItems()}
              {loaderItems()}
              {loaderItems()}
            </View>
          ) : (
            <View style={styles.transactionsWrapper}>
              {transactionsData.length <= 0 &&
              transactionsDataStatus === 'success' ? (
                <NoData message={'No Transactions Found'} />
              ) : (
                <View style={{paddingBottom:75}} >
                  <FlatList
                    data={transactionsData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => loadItems(item, index)}
                  />
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* <AppMessage
            status={appStatus}
            statusMessage={appStatusMessage}
          /> */}
      </View>
      <BottomNavigation navigation={navigation} selected={'T'}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background4,
  },
  safecontainer: {
    flex: 1,
    // backgroundColor: '#FEFEFE',
  },
  scrollViewS: {
    flex: 1,
    marginTop:config.headerHeight
  },
  scrollViewT:{
    marginTop:Platform.OS === 'android' ? 122 : 130
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
    marginVertical: 12,
  },
  dateWrapper:{flexDirection: 'row', marginTop: 6},
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
    borderRadius: 10,

    margin: 3,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    marginHorizontal: 16,
    paddingBottom: 16,
  },
  cardWrapperNS:{paddingHorizontal: 27},
  itemRow: {
    paddingVertical: 10,
    flexDirection: 'row',
  },
  itemRowItem: {
    width: '50%',
  },
  contentLabel: {
    fontSize: 14,
    color: 'rgb(107, 114, 122)',
    fontFamily: Helper.switchFont('regular'),
  },
  contentText: {
    color: 'rgb(44, 54, 65)',
    fontSize: 14,
    fontFamily: Helper.switchFont('medium'),
    marginTop: 5,
  },
  cardTitle: {
    fontSize: 16,
    color: 'rgb(44, 54, 65)',
    flexWrap: 'wrap',
    fontFamily: Helper.switchFont('medium'),
  },
  cardTitleWrapper:{
    marginLeft: 10,
    width: '85%',
    justifyContent: 'center',
  },
  cardTitleWrapperNS:{marginLeft: 10, width: '75%'},
  profilePic: {
    width: 48,
    height: 48,
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
  amount:{
    fontSize: 13,
    color: 'rgb(44, 54, 65)',
    width: '50%',
    textAlign: 'right',
    fontFamily: Helper.switchFont('medium'),
  },
  date:{
    fontSize: 13,
    color: 'rgb(107, 114, 122)',
    width: '50%',
    fontFamily: Helper.switchFont('regular'),
  }
});

export default Transaction;
