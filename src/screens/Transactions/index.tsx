import React, {useEffect, useState, FC} from 'react';
import {
  View,
  Image,
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
import {brandColor} from '../../styles/colors';
import HeaderInner from '../../components/HeaderInner'
import TransactionCard from '../../components/TransactionCard';
import BottomNavigation from '../../components/BottomNavigation';

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

    changingHeight = scrollY.interpolate({
      inputRange: [0.01, 70],
      outputRange: [109, 109],
      extrapolate: "clamp",
    });
    let changingHeight2 = scrollY.interpolate({
      inputRange: [0.01, 70],
      outputRange: [82, 55],
      extrapolate: "clamp",
    });
    titleSize = scrollY.interpolate({
      inputRange: [0.01, 35],
      outputRange: [24, 18],
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
      outputRange: [16, 16],
      extrapolate: "clamp",
    });
    thirdTitleTop = scrollY.interpolate({
      inputRange: [0.01, 50],
      outputRange: [48, 16],
      extrapolate: "clamp",
    });
    let balanceSize = scrollY.interpolate({
      inputRange : [0.01, 50],
      outputRange: [14, 18],
      extrapolate:"clamp"
    });
    thirdTitleLeft = scrollY.interpolate({
      inputRange: [0.01, 50],
      outputRange: [16, 90],
      extrapolate: "clamp",
    });
    const height = scrollY.interpolate({
      inputRange:[0.01, 50],
      outputRange:[100, 0],
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
            <Image
              source={require('@images/default_dp.png')}
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
            changingHeight={changingHeight}
            title={"Transactions"}
            walletBalance={walletBalance}
            navigation={navigation}
            logo={true}
            type={"findCourse"}
            // height={height}
          />
           {userData.user_type === 'T' ?
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
                      styles.walletTitle,
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
                      },
                    ]}>
                    {`${walletBalance}`}
                  </Animated.Text>
                  <Animated.Text
                    style={[
                      styles.walletSubTitle,
                      {marginTop: thirdTitleTop, position:'absolute', fontSize: balanceSize,
                      top:109, color:'#fff', opacity:0.7, fontWeight:'bold', margin: 16,
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
              style={{ marginTop: 40 }}
            ></View> : <View
            style={{ marginTop: 20 }}
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
                <View >
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
    backgroundColor: '#ffffff',
  },
  safecontainer: {
    flex: 1,
    // backgroundColor: '#FEFEFE',
  },
  scrollViewS: {
    flex: 1,
    marginTop:109
  },
  scrollViewT:{
    marginTop:164
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
