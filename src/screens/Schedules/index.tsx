import React, {useEffect, useState, FC} from 'react';
import {
  View,
  // Image,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform,
  Animated,
  Dimensions,
  RefreshControl,
  ToastAndroid,
  KeyboardAvoidingView,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  ShadowPropTypesIOS,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
// @ts-ignore
import {Bubbles} from 'react-native-loader';
import Moment from 'moment';
import 'moment-timezone';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import {useAppDispatch} from '../../app/store';
import CustomStatusBar from '../../components/CustomStatusBar';
import {setPageLoading} from '../../reducers/loader.slice';
import Toast from 'react-native-toast-message';
import {
  deleteSession,
  getSchedule,
  scheduledDataSuccess,
  schedulesState,
} from '../../reducers/schedule.slice';
import {userState} from '../../reducers/user.slice';
import SheetCSS from '../../styles/style';
import {fetchWithdrawalDataSuccess} from '../../reducers/withdrawal.slice';
import Helper from '../../utils/helperMethods';
import {
  appBackground,
  brandColor,
  font1,
  font2,
  font3,
  lineColor,
  secondaryColor,
} from '../../styles/colors';
import NoData from '../../components/NoData';
import HeaderInner from '../../components/HeaderInner';
import {useRoute} from '@react-navigation/native';
// import Dropdown from '../../assets/images/dropdown.svg'
import config from '../../config/Config';
const {width, height} = Dimensions.get('screen');

// import Copy from '../../assets/images/copy.svg'
// import AddSession from '../../assets/images/addSession.svg';
import AddSessionCmp, { CreateSessionInterfaceFinal } from './AddSession';
import Clipboard from '@react-native-clipboard/clipboard';
import BottomNavigation from '../../components/BottomNavigation';
import DashedLine from 'react-native-dashed-line';
import CustomImage from '../../components/CustomImage';
import StyleCSS from '../../styles/style';
import ShareLinkPopup from '../../components/ShareLinkPopup';
import DeleteClassPopup from '../../components/DeleteClassPopup';

type Props = NativeStackScreenProps<RootParamList, 'AddSession'>;

interface LoadItemInterface {
  data: any;
  index?: number;
  selectedCard: number;
  setSelectedCard: any;
  setEditClassData: any;
  setShowAddSessionModal: any;
  setDeleteClassData: any;
  setTitle: any;
  navigation:any;
  onRefresh:any;
  setShowDeletePopup: any;
}

const LoadItem = ({
  data,
  index,
  selectedCard,
  setSelectedCard,
  setEditClassData,
  setShowAddSessionModal,
  setTitle,
  setDeleteClassData,
  navigation,
  onRefresh,
  setShowDeletePopup
 }: LoadItemInterface) => {
  const {userData} = useSelector(userState);
  
  const dispatch = useAppDispatch();
  
  const editClass = () => {
    setEditClassData(data);
    setShowAddSessionModal(true);
    setTitle('Edit');
  };
  
  const deleteClass = () => {
    setDeleteClassData(data);
    setShowDeletePopup(true);
  
  
  }
  
  const joinClass = () =>{
    navigation.navigate('Video',{
      data: data
    });
  }
  
  const daysRemaining = (current_date: string, start_date: string) => {
    let dateFormat = 'DD MMM YYYY hh:mm A';
    var date1 = Moment(start_date, dateFormat);
    var date2 = Moment(current_date, dateFormat);
  
    let months = date1.diff(date2, 'months');
    date2.add(months, 'months');
    months = months;
  
    let days = date1.diff(date2, 'days');
    date2.add(days, 'days');
    days = days;
  
    if (months === 0 && days === 0) {
      return true;
    }
  };
  
  const getDaysDiff = (current_date: string, start_date: string) => {
    let dateFormat = 'DD MMM YYYY hh:mm A';
    var date1 = Moment(start_date, dateFormat);
    var date2 = Moment(current_date, dateFormat);
  
    let years = date1.diff(date2, 'year');
    date2.add(years, 'years');
    years = years;
  
    let months = date1.diff(date2, 'months');
    date2.add(months, 'months');
    months = months;
  
    let days = date1.diff(date2, 'days');
    date2.add(days, 'days');
    days = days;
  
    let hours = date1.diff(date2, 'hours');
    date2.add(hours, 'hours');
    hours = hours;
  
    let minutes = date1.diff(date2, 'minutes');
    date2.add(minutes, 'minutes');
    minutes = minutes;
  
    if (months < 0 || days < 0 || hours < 0 || minutes < 0) {
      return 'Class Ongoing';
    } else {
      return (
        (years > 0 ? years + ' years ' : '') +
        (months > 0
          ? months == 1
            ? months + ' month '
            : months + ' months '
          : '') +
        (days > 0 ? (days == 1 ? days + ' day ' : days + ' days ') : '') +
        (hours > 0 ? hours + ' hrs ' : '') +
        (minutes > 0 ? minutes + ' mins ' : '')
      );
    }
  };
  
  
  return (
    <View
      style={[
        styles.scheduleSingleWrapper,
        SheetCSS.styles.shadow,
        selectedCard == data.class_token
          ? {marginHorizontal: 0, borderRadius: 0}
          : null,
      ]}>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          selectedCard == data.class_token
            ? setSelectedCard(0)
            : setSelectedCard(data.class_token);
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
          {daysRemaining(
            Moment.tz(new Date(), 'Asia/Calcutta').format(
              'DD MMM, YYYY hh:mm A',
            ),
            Moment.tz(data.start_time, 'Asia/Calcutta').format(
              'DD MMM, YYYY hh:mm A',
            ),
          ) ? (
            <View style={styles.highlightTimerRed}>
              <Text
                style={{
                  color: '#FE5858',
                  fontSize: 14,
                  fontWeight: '500',
                  fontFamily: Helper.switchFont('medium'),
                }}>
                {getDaysDiff(
                  Moment.tz(new Date(), 'Asia/Calcutta').format(
                    'DD MMM, YYYY hh:mm A',
                  ),
                  Moment.tz(data.start_time, 'Asia/Calcutta').format(
                    'DD MMM, YYYY hh:mm A',
                  ),
                )}
              </Text>
            </View>
          ) : (
            <View style={styles.highlightTimerGreen}>
              <Text
                style={{
                  color: font3,
                  fontSize: 14,
                  fontWeight: '500',
                  fontFamily: Helper.switchFont('medium'),
                }}>
                {getDaysDiff(
                  Moment.tz(new Date(), 'Asia/Calcutta').format(
                    'DD MMM, YYYY hh:mm A',
                  ),
                  Moment.tz(data.start_time, 'Asia/Calcutta').format(
                    'DD MMM, YYYY hh:mm A',
                  ),
                )}
              </Text>
            </View>
          )}
          {/* <View
          style={
            daysRemaining(
              Moment.tz(new Date(), 'Asia/Calcutta').format(
                'DD MMM, YYYY hh:mm A',
              ),
              Moment.tz(data.start_time, 'Asia/Calcutta').format(
                'DD MMM, YYYY hh:mm A',
              ),
            )
              ? styles.highlightTimerRed
              : styles.highlightTimerGreen
          }>
          <Text
            style={{
              color: '#fff',
              fontSize: 12,
              fontFamily: Helper.switchFont('medium'),
            }}>
            {getDaysDiff(
              Moment.tz(new Date(), 'Asia/Calcutta').format(
                'DD MMM, YYYY hh:mm A',
              ),
              Moment.tz(data.start_time, 'Asia/Calcutta').format(
                'DD MMM, YYYY hh:mm A',
              ),
            )}
          </Text>
        </View> */}
          <View
            style={
              selectedCard == data.class_token ? styles.dropBackground : null
            }>
            <CustomImage
              height={16}
              width={16}
              uri={`${config.media_url}dropdown.svg`}
            />
          </View>
        </View>
        <View style={{paddingTop: 12}}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              fontFamily: Helper.switchFont('medium'),
              color: font1,
            }}>
            {data.course.title}{' '}
            {/* {data.course.class_type && data.course.class_type.members === '1'
              ? ' (1-on-1 Class)'
              : ' ( ' + data.course.class_type.members + ' Members)'} */}
          </Text>
  
          {userData.user_type === 'T' && (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 8,
                }}>
                <Text style={[styles.contentLabel, styles.itemRowItem]}>
                  With{' '}
                  {data.class_student.length !== 0
                    ? data.class_student[0].name
                    : ''}
                </Text>
                <Text style={[styles.contentLabel, styles.itemRowItem]}>
                  {Moment.tz(data.start_time, userData.timezone).format(
                    'ddd, MMM DD, YYYY',
                  )}{' '}
                </Text>
              </View>
              {selectedCard == data.class_token ? (
                <View style={{marginBottom: 16}} />
              ) : null}
            </View>
          )}
          {userData.user_type === 'S' && (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 8,
                }}>
                <Text style={[styles.contentLabel, styles.itemRowItem]}>
                  by {data.course.teacher.name}
                </Text>
                <Text style={[styles.contentLabel, styles.itemRowItem]}>
                  {Moment.tz(data.start_time, userData.timezone).format(
                    'ddd, MMM DD, YYYY',
                  )}
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
  
      {
        selectedCard == data.class_token ? (
          <View>
            <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={5}
              dashColor={lineColor}
            />
  
            <View style={styles.itemRow}>
              <View style={styles.itemRowItem}>
                <Text style={styles.contentLabel}>Time</Text>
                <Text style={styles.contentText}>
                  {Moment.tz(data.start_time, userData.timezone).format(
                    'hh:mm A',
                  )}
                  {' - '}
                  {Moment.tz(data.end_time, userData.timezone).format(
                    'hh:mm A',
                  )}
                </Text>
                <Text
                  style={[styles.contentText, {fontSize: 12, marginTop: 2}]}>
                  {userData.timezone}
                </Text>
              </View>
              <View style={styles.itemRowItem}>
                <Text style={styles.contentLabel}>Taught On</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {data.taught_on.icon ? (
                    <CustomImage
                      style={{height: 20, width: 20, marginRight: 8}}
                      uri={data.taught_on.icon}
                    />
                  ) : null}
                  <Text style={styles.contentText}>{data.taught_on.name}</Text>
                </View>
              </View>
            </View>
            {data.class_url && data.class_url !== "" ? (
              <>
                <DashedLine
                  dashLength={5}
                  dashThickness={1}
                  dashGap={5}
                  dashColor={lineColor}
                />
                <View style={{paddingTop: 16}}>
                  <Text style={styles.contentLabel}>Session URL</Text>
                  <View style={styles.sessionURL}>
                    <Text
                      selectable={true}
                      style={[styles.contentText, {flex: 1, marginTop: 0}]}>
                      {(config.FrontendURL+config.videoURL+data.class_url).length > 30
                        ? `${(config.FrontendURL+config.videoURL+data.class_url).substring(0, 30)}...`
                        : config.FrontendURL+config.videoURL+data.class_url}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        Toast.show({
                          type: 'info',
                          text1: 'Copied',
                          // text2: 'This is some something 👋'
                        });
                        Clipboard.setString(config.FrontendURL+config.videoURL+data.class_url);
                      }}
                      style={styles.copy}>
                      <CustomImage
                        height={24}
                        width={24}
                        uri={`${config.media_url}copy.svg`}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            ) : null}
          </View>
        ) : null
        // (
        //   <View style={{flex: 1, alignItems: 'flex-end', paddingHorizontal: 24}}>
        //     <TouchableOpacity
        //       style={{flexDirection: 'row'}}
        //       onPress={() => {
        //         LayoutAnimation.configureNext(
        //           LayoutAnimation.Presets.easeInEaseOut,
        //         );
        //         selectedCard == data.class_token
        //           ? setSelectedCard(0)
        //           : setSelectedCard(data.class_token);
        //       }}>
        //       <Image
        //         source={require('@images/down_arrow.png')}
        //         style={{
        //           width: 16,
        //           height: 9,
        //           alignItems: 'center',
        //         }}
        //       />
        //     </TouchableOpacity>
        //   </View>
        // )
      }
      <View style={[{ alignSelf: 'flex-end', },StyleCSS.styles.fdrCenter]}>
      {data.taught_on.code === 'I' ? <TouchableOpacity
      onPress={joinClass}
      >
        <Text
          style={[
            StyleCSS.styles.contentText,
            StyleCSS.styles.fw700,
            {
              color: font3,
            
              marginTop: selectedCard == data.class_token ? 0 : 12, marginRight:32
            },
          ]}>
          Join Class
        </Text>
      </TouchableOpacity> : null}
      <TouchableOpacity
      onPress={deleteClass}
      >
        <Text
          style={[
            StyleCSS.styles.contentText,
            StyleCSS.styles.fw700,
            {
              color: brandColor,
            
              marginTop: selectedCard == data.class_token ? 0 : 12, marginRight:32
            },
          ]}>
          Delete
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={editClass}>
        <Text
          style={[
            StyleCSS.styles.contentText,
            StyleCSS.styles.fw700,
            {
              color: secondaryColor,
            
              marginTop: selectedCard == data.class_token ? 0 : 12,
            },
          ]}>
          Edit
        </Text>
      </TouchableOpacity>
      </View>
    </View>
  );
 };
 

export default function Schedules({navigation , route}: Props) {
  const dispatch = useAppDispatch();
  const {scheduledData, scheduledDataStatus} = useSelector(schedulesState);
  const {userData} = useSelector(userState);
  const [selectedCard, setSelectedCard] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [editClassData, setEditClassData] = useState<any>(null);
  const [title, setTitle] = useState<'Add' | 'Edit'>('Add');
  const [shareLinkPopup, setShareLinkPopup] = useState(false)
  const [childData, setChildData] = useState(null)
const [url, setURL]= useState(null);
const [taughtOnCode, setTaughtOnCode] = useState(null)
const [deleteClassData, setDeleteClassData] = useState(null);
// const [joinClassData, setJoinClassData] = useState
const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);


  const routes = useRoute();
  const doNothing = () => {
    console.log('closing the ');
  };
  let scrollY = new Animated.Value(0.01);
  // let changingHeight = scrollY.interpolate({
  //   inputRange: [0.01, 50],
  //   outputRange: [100, 100],
  //   extrapolate: 'clamp',
  // });
  let titleSize = scrollY.interpolate({
    inputRange: [0.01, 50],
    outputRange: [28, 22],
    extrapolate: 'clamp',
  });
  let titleTop = scrollY.interpolate({
    inputRange: [0.01, 50],
    outputRange: [48, 40],
    //   Platform.OS === 'ios' ? 48 : 48,
    //   Platform.OS === 'ios' ? 40 : 40,
    // ],
    extrapolate: 'clamp',
  });

  let buttonTop = scrollY.interpolate({
    inputRange: [0.01, 50],
    outputRange: [85, 20],
    extrapolate: 'clamp',
  });
  let buttonWidth = scrollY.interpolate({
    inputRange: [0.01, 50],
    outputRange: [170, 80],
    extrapolate: 'clamp',
  });
  let buttonTextOpacity = scrollY.interpolate({
    inputRange: [0.01, 10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  let buttonTextWidth = scrollY.interpolate({
    inputRange: [0.01, 25],
    outputRange: ['90%', '0%'],
    extrapolate: 'clamp',
  });
  let buttonPadding = scrollY.interpolate({
    inputRange: [0.01, 50],
    outputRange: [16, 8],
    extrapolate: 'clamp',
  });
  let buttonRadius = scrollY.interpolate({
    inputRange: [0.01, 50],
    outputRange: [10, 50],
    extrapolate: 'clamp',
  });
  let buttonMaxHeight = scrollY.interpolate({
    inputRange: [0.01, 60],
    outputRange: [75, 60],
    extrapolate: 'clamp',
  });
  let buttonShadowHeight = scrollY.interpolate({
    inputRange: [0.01, 60],
    outputRange: [0, 6],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    getSchedules();
  }, []);

  const getSchedules = () => {
    dispatch(setPageLoading(true));

    dispatch(getSchedule(userData.token))
      .unwrap()
      .then(response => {
        if (response.data.status === 'success') {
          dispatch(setPageLoading(false));
          dispatch(scheduledDataSuccess(response.data.data));
        }
      })
      .catch(err => {
        dispatch(setPageLoading(false));
      });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getSchedules();
    setSelectedCard(0);
    setRefreshing(false);
  };

  const addSession = () => {
    setShowAddSessionModal(true);
    setTitle('Add');
  };

  return (
   
    <View style={styles.container}>
      <CustomStatusBar type={'inside'} />

      <View style={[styles.safecontainer, SheetCSS.styles.shadowWrapper]}>
        <HeaderInner
          titleSize={titleSize}
          titleTop={titleTop}
          logo={true}
          changingHeight={config.headerHeight}
          title={'Schedules'}
          navigation={navigation}
          type={'findCourse'}
          backroute={routes.name}
        />
        

        <View style={styles.addSessionWrapper}>
          <TouchableOpacity
            onPress={addSession}
            style={styles.addSessionButton}>
            <View style={styles.addSession}>
              <CustomImage
                height={16}
                width={16}
                uri={`${config.media_url}addSession.svg`}
              />

              <Text
                style={{
                  color: '#fff',
                  fontFamily: Helper.switchFont('bold'),
                  fontSize: 14,
                  fontWeight: '700',
                  marginLeft: 8,
                  width: '100%',
                }}>
                Add Class
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={[styles.scrollView]}
          keyboardShouldPersistTaps={'handled'}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} 
            onRefresh={onRefresh} 
            />
          }
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: false},
          )}>
          <View>
            {scheduledDataStatus === 'loading' ? (
              <View style={styles.layoutWrapper}>
                <View
                  style={[
                    styles.scheduleSingleWrapper,
                    SheetCSS.styles.shadow,
                  ]}>
                  <View style={styles.highlightTimerRed}>
                    <Text style={{color: '#fff', fontSize: 12}}></Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      height: 0.3 * height,
                      marginTop: -50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#C3152D',
                        fontSize: 14,
                        marginBottom: 10,
                        marginTop: 50,
                      }}>
                      Please wait..
                    </Text>
                    <Bubbles size={7} color={brandColor} />
                  </View>
                </View>

                <View
                  style={[
                    styles.scheduleSingleWrapper,
                    SheetCSS.styles.shadow,
                  ]}>
                  <View style={styles.highlightTimerGreen}>
                    <Text style={{color: '#fff', fontSize: 12}}></Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      height: 0.3 * height,
                      marginTop: -50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#C3152D',
                        fontSize: 14,
                        marginBottom: 10,
                        marginTop: 50,
                      }}>
                      Please wait..
                    </Text>
                    <Bubbles size={7} color={brandColor} />
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.layoutWrapper}>
                {scheduledDataStatus === 'success' ? (
                  scheduledData.length <= 0 ? (
                    <NoData message={'No Sessions Scheduled!'} />
                  ) : (
                    <View style={{flex: 1, paddingBottom: 120}}>
                      <FlatList
                        data={scheduledData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => (
                          <LoadItem
                          key={index}
                          setShowDeletePopup={setShowDeletePopup}
                          onRefresh={onRefresh}
                          navigation={navigation}
                            data={item}
                            setDeleteClassData={setDeleteClassData}
                            index={index}
                            selectedCard={selectedCard}
                            setSelectedCard={setSelectedCard}
                            setEditClassData={setEditClassData}
                            setShowAddSessionModal={setShowAddSessionModal}
                            setTitle={setTitle}
                          />
                        )}
                      />
                    </View>
                  )
                ) : null}
              </View>
            )}
          </View>
        </ScrollView>
        {/* <AppMessage
            status={appStatus}
            statusMessage={appStatusMessage}
          /> */}
      </View>

      {showAddSessionModal ? (
        <Modal presentationStyle="overFullScreen" transparent={true} statusBarTranslucent={true}>
          
          <TouchableOpacity
            activeOpacity={1}
            onPressOut={() => {
              setShowAddSessionModal(false);
            }}
            style={[SheetCSS.styles.modalBackground]}>
            <View
             style={[StyleCSS.styles.modalView]}
            //  style={{backgroundColor:'#fff',alignSelf:'flex-end'}}
            >
              <TouchableOpacity activeOpacity={1} onPress={doNothing}>
                <>
                  <View style={SheetCSS.styles.modalLine}></View>
                  <Text style={SheetCSS.styles.modalTitle}>
                    {title === 'Edit'
                      ? `${title} Class - ${editClassData.course.title}`
                      : `${title} Class`}
                  </Text>
                  <ScrollView contentInsetAdjustmentBehavior="always">
                  <AddSessionCmp
                  setTaughtOnCode={setTaughtOnCode}
                  setShareLinkPopup={setShareLinkPopup}
                  setChildData={setChildData}
                  setURL={setURL}
                    editClassData={title === 'Edit' ? editClassData : null}
                    title={title}
                    onRefresh={onRefresh}
                    setShowAddSessionModal={setShowAddSessionModal}
                    navigation={navigation}
                  />
                 </ScrollView>
                </>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          
        </Modal>
      ) : null}
      <Modal visible={shareLinkPopup} transparent={true} statusBarTranslucent>
        <TouchableOpacity activeOpacity={1} onPress={()=> setShareLinkPopup(false)} style={{flexDirection:'row',height:'100%', backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity activeOpacity={1}>
          <ShareLinkPopup class_url={title==='Edit' ? childData && childData.class_url : url} taught_on_code={title==='Edit' ? childData && childData.taught_on_code : taughtOnCode} setShareLinkPopup={setShareLinkPopup}/>
          </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        <Modal visible={showDeletePopup} transparent={true} statusBarTranslucent>
        <TouchableOpacity activeOpacity={1} onPress={()=> setShowDeletePopup(false)} style={{flexDirection:'row',height:'100%', backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity activeOpacity={1}>
          <DeleteClassPopup onRefresh={onRefresh} navigation={navigation} data={deleteClassData}  setShowDeletePopup={setShowDeletePopup}/>
          </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      <BottomNavigation navigation={navigation} selected={'S'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appBackground,
  },
  safecontainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    marginTop: config.headerHeight,
  },
  body: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
    lineHeight: 24,
    marginRight: 8,
  },
  lineStyle: {
    borderWidth: 1,
    borderColor: '#E2E4E5',
  },
  layoutWrapper: {
    marginTop: 12,
  },
  scheduleSingleWrapper: {
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  highlightTimerRed: {
    // width: '45%',
    // borderBottomRightRadius: 15,
    // borderTopRightRadius: 15,
    borderRadius: 6,
    backgroundColor: 'rgba(254, 88, 88, 0.1)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    // color:
  },
  highlightTimerGreen: {
    // width: '45%',
    // borderBottomRightRadius: 15,
    // borderTopRightRadius: 15,
    borderRadius: 6,
    backgroundColor: 'rgba(40, 190, 145, 0.1)',
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  itemRow: {
    paddingVertical: 16,
    flexDirection: 'row',
  },
  itemRowItem: {
    width: '50%',
    flexDirection: 'column',
  },
  contentLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: font2,
    fontFamily: Helper.switchFont('medium'),
  },
  contentText: {
    color: font1,
    fontWeight: '500',
    fontSize: 14,
    fontFamily: Helper.switchFont('medium'),
    marginTop: 5,
  },
  sessionURL: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 5,
    padding: 15,
    backgroundColor: '#F7F9FA',
    borderRadius: 12,
  },
  add_schedule: {
    width: 43,
    height: 43,
    marginHorizontal: 5,
  },
  buttonClass: {
    shadowColor: '#2b3a4b',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 4,
  },
  copy: {
    width: 48,
    alignItems: 'flex-end',
  },
  addSessionWrapper: {
    position: 'absolute',
    bottom: 80,
    zIndex: 1000,
    paddingHorizontal: 16,
    width: '100%',
  },
  addSessionButton: {
    backgroundColor: brandColor,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 11,
    borderRadius: 8,
  },
  addSession: {flexDirection: 'row', alignItems: 'center', width: '29%'},
  dropBackground: {borderRadius: 50, padding: 6, backgroundColor: lineColor},
});
