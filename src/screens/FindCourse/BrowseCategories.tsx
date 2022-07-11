import React, {PropsWithChildren, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  // Image,
  ScrollView,
} from 'react-native';

import {SvgUri} from 'react-native-svg';
import {
  courseState,
  getCategories,
  setNationality,
  setOffset,
  setPage,
  setShowMore,
} from '../../reducers/courses.slice';
import {
  setLoading,
  setPageLoading,
  loaderState,
} from '../../reducers/loader.slice';
import config from '../../config/Config';
import PageLoader from '../../components/PageLoader';
import helper from '../../utils/helperMethods';
import style from '../../styles/style';
import {FlatList} from 'native-base';
import {useAppDispatch} from '../../app/store';
const {width, height} = Dimensions.get('screen');
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
// import Back from '../../assets/images/arrow-dark.svg';
// import {CategoryInterface} from './index';
import HeaderInner from '../../components/HeaderInner';
import {useRoute} from '@react-navigation/native';
// import Drop from '../../assets/images/Drop.svg';
import {brandColor, font1, selectedDrop} from '../../styles/colors';
// import Others from '../../assets/images/others.svg';
// import Dropdown from '../../assets/images/dropdown.svg';
import {configureFonts} from 'react-native-paper';
import CustomImage from '../../components/CustomImage';
import Helper from '../../utils/helperMethods';

type Props = NativeStackScreenProps<RootParamList, 'BrowseCategories'>;

export default function BrowseCategories({navigation, route}: Props) {
  const dispatch = useAppDispatch();
  const {categoryData, page, nationality} = useSelector(courseState);
  // const [others, setOthers] = useState(true);
  const [othersSelected, setOthersSelected] = useState(false);
  const routes = useRoute();
  const [active, setActive] = useState('');
  const {loading} = useSelector(loaderState);

  // useEffect(() => {
  //   dispatch(setLoading(true));
  // //   if (others) {
  // //     dispatch(setPage('find_course'));
  // //   } else {
  // //     dispatch(setPage(''));
  // //   }
  //   const category_data: CategoryInterface = {
  //     page: page,
  //     nationality: nationality,
  //   };
  //   dispatch(getCategories(category_data))
  //     .then(() => dispatch(setLoading(false)))
  //     .catch(() => dispatch(setLoading(false)));
  // }, []);

  const loadCategory = (item: any, index: number): any => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.subCategories && item.subCategories.length !== 0) {
            navigation.push('Categories', {
              subcategory: item.subCategories,
              cat: item.category_name,
              backroute: routes.name,
            });
          } else {
            //call api for category page
            if (item.seo.seo_slug_url !== null) {
              dispatch(setPageLoading(true));
              navigation.navigate('CategoryDetails', {
                category_slug: item.seo.seo_slug_url,
                backroute: routes.name,
              });
            }
          }
        }}
        style={styles.category}>
        <View style={styles.categoryView}>
          {/* {route.params?.subcategory ? (
            <Image source={{uri: item.home_icon}} />
          ) : (
            <SvgUri uri={item.home_icon} />
          )} */}

          <Text style={styles.categoryText}>{item.category_name}</Text>
        </View>
        <Text style={styles.categoryText}>{item.all_course}</Text>
      </TouchableOpacity>
    );
  };

const checkNationality = (all: number, indian: number, western:number): boolean => {
    let val: boolean = false;
    if (nationality === 'INDIAN' && indian > 0) {
      val = true;
    } else if (nationality === 'WESTERN' && western >0) {
      val = true;
    }
    return val;
  };

  return (
    <>
      <HeaderInner
        backroute={route.params?.backroute}
        changingHeight={config.headerHeight}
        title={'Explore'}
        browseSelected={true}
        navigation={navigation}
        type={'findCourse'}
        back={true}
        // backroute={backroute}
      />
      <View style={styles.tabView}>
        <CustomImage
          style={styles.tabBgImage}
          uri={`${config.media_url}transactions_bg.png`}
        />
        <View style={styles.userTabsWrapper}>
          <TouchableOpacity
            style={
              nationality === 'INDIAN' ? styles.selectedTab : styles.userTab
            }
            onPress={() => {
              dispatch(setOffset(0));
              dispatch(setNationality('INDIAN'));
            }}>
            <Text
              style={
                nationality === 'INDIAN'
                  ? styles.selectedUserTabText
                  : styles.userTabText
              }>
              Indian({categoryData.extra_data.count.total_indian_course})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              nationality === 'WESTERN' ? styles.selectedTab : styles.userTab
            }
            onPress={() => {
              dispatch(setOffset(0));
              dispatch(setNationality('WESTERN'));
            }}>
            <Text
              style={
                nationality === 'WESTERN'
                  ? styles.selectedUserTabText
                  : styles.userTabText
              }>
              Western({categoryData.extra_data.count.total_western_course})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.main}>
        {route.params?.subcategory ? (
          <>
            <TouchableOpacity
              style={styles.backCategory}
              onPress={() => {
                navigation.goBack();
              }}>
              <CustomImage
                height={16}
                width={16}
                uri={`${config.media_url}arrow-dark.svg`}
              />

              {/* <Back/> */}
              <Text style={styles.backCategoryText}>Back</Text>
            </TouchableOpacity>
          </>
        ) : null}
        {categoryData && categoryData.data ? (
          <ScrollView>
            {categoryData.data.map((cd: any) => {
              return (
                <>
                  {cd.is_master &&
                  checkNationality(cd.all_course, cd.indian_course, cd.western_course) ? (
                    <>
                      <View style={{paddingBottom: 20}}>
                        <View style={styles.categoryIcon}>
                          <Text style={styles.mainCategory}>
                            {cd.category_name}
                          </Text>
                        </View>
                        {cd.subCategories && cd.subCategories.length > 0 ? (
                          <>
                            {cd.subCategories.map((sc: any) => {
                              return (
                                <>
                                {checkNationality(sc.all_course, sc.indian_course, sc.western_course) ?
                                <TouchableOpacity
                                  activeOpacity={1}
                                  onPressIn={() => {
                                    setActive(sc.seo.seo_slug_url);
                                  }}
                                  onPressOut={() => {
                                    setActive('');
                                  }}
                                  onPress={() => {
                                    if (
                                      sc.subCategories &&
                                      sc.subCategories.length !== 0
                                    ) {
                                      navigation.navigate('Subcategories', {
                                        subcategory: sc.subCategories,
                                        cat: sc.category_name,
                                        backroute: routes.name,
                                      });
                                    } else {
                                      //call api for category page
                                      if (sc.seo.seo_slug_url !== null) {
                                        dispatch(setPageLoading(true));
                                        navigation.navigate('CategoryDetails', {
                                          category_slug: sc.seo.seo_slug_url,
                                          backroute: routes.name,
                                        });
                                      }
                                    }
                                  }}
                                  style={[
                                    {
                                      // borderWidth:1,
                                      backgroundColor:
                                        active === sc.seo.seo_slug_url
                                          ? '#EFF1F2'
                                          : '#fff',
                                      borderLeftWidth:
                                        active === sc.seo.seo_slug_url ? 3 : 0,
                                      borderLeftColor:
                                        active === sc.seo.seo_slug_url
                                          ? brandColor
                                          : '#fff',
                                    },
                                    styles.listItem,
                                  ]}>
                                  <Text style={styles.subcategories}>
                                    {sc.category_name}
                                  </Text>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    {sc.subCategories &&
                                    sc.subCategories.length > 0 ? (
                                      <CustomImage
                                        height={16}
                                        width={16}
                                        uri={`${config.media_url}drop.svg`}
                                      />
                                    ) : // <Drop />
                                    null}
                                    <Text style={styles.subcategories}>
                                      {nationality === 'INDIAN' ? sc.indian_course : sc.western_course }
                                    </Text>
                                  </View>
                                </TouchableOpacity> : null }
                                </>
                              );
                            })}
                          </>
                        ) : null}
                      </View>
                      <View style={style.styles.lineStyleLight} />
                    </>
                  ) : null}
                </>
              );
            })}
            <View style={{paddingBottom: 20}}>
              <TouchableOpacity
                onPress={() => {
                  setOthersSelected(!othersSelected);
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                {/* <Image
                          style={{height: 40, width: 40}}
                          source={{uri: cd.home_icon}}
                        /> */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <CustomImage
                    height={16}
                    width={16}
                    uri={`${config.media_url}others.svg`}
                  />

                  {/* <Others /> */}
                  <Text style={styles.mainCategory}>Others</Text>
                </View>
                {othersSelected ? (
                  <View style={styles.selectedDrop}>
                    <CustomImage
                      height={16}
                      width={16}
                      uri={`${config.media_url}dropdown.svg`}
                    />
                  </View>
                ) : (
                  <CustomImage
                    height={16}
                    width={16}
                    uri={`${config.media_url}drop.svg`}
                  />
                )}
              </TouchableOpacity>
              {othersSelected && categoryData.data ? (
                <>
                  {categoryData.data.map((cd: any) => {
                    return (
                      <>
                        {!cd.is_master &&  checkNationality(cd.all_course, cd.indian_course, cd.western_course)  ? (
                          
                          <TouchableOpacity
                            activeOpacity={1}
                            onPressIn={() => {
                              setActive(cd.seo.seo_slug_url);
                            }}
                            onPressOut={() => {
                              setActive('');
                            }}
                            onPress={() => {
                              if (
                                cd.subCategories &&
                                cd.subCategories.length !== 0
                              ) {
                                navigation.navigate('Subcategories', {
                                  subcategory: cd.subCategories,
                                  cat: cd.category_name,
                                  backroute: routes.name,
                                });
                              } else {
                                //call api for category page
                                if (cd.seo.seo_slug_url !== null) {
                                  dispatch(setPageLoading(true));
                                  navigation.navigate('CategoryDetails', {
                                    category_slug: cd.seo.seo_slug_url,
                                    backroute: routes.name,
                                  });
                                }
                              }
                            }}
                            style={[
                              {
                                backgroundColor:
                                  active === cd.seo.seo_slug_url
                                    ? '#EFF1F2'
                                    : '#fff',
                                borderLeftWidth:
                                  active === cd.seo.seo_slug_url ? 3 : 0,
                                borderLeftColor:
                                  active === cd.seo.seo_slug_url
                                    ? brandColor
                                    : '#fff',
                              },
                              styles.listItem,
                            ]}>
                            <Text style={styles.subcategories}>
                              {cd.category_name}
                            </Text>

                            <View style={styles.courseNumber}>
                              {/* <Drop /> */}
                              <CustomImage
                                height={16}
                                width={16}
                                uri={`${config.media_url}drop.svg`}
                              />

                              <Text style={styles.subcategories}>
                                {nationality === 'INDIAN' ? cd.indian_course : cd.all_course-cd.indian_course}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ) : null}
                      </>
                    );
                  })}
                  <View style={style.styles.lineStyleLight} />
                </>
              ) : null}
            </View>

            {/* <View>
              <FlatList
                data={
                  route.params?.subcategory
                    ? route.params?.subcategory
                    : categoryData.data
                }
                renderItem={({item, index}) => loadCategory(item, index)}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            {route.params?.subcategory ? null : others ? (
              <TouchableOpacity
                style={[
                  {flexDirection: 'row', alignItems: 'center'},
                  styles.loadCats,
                ]}
                onPress={() => {
                  setOthers(false);
                }}>
                {loading ? (
                  <Image
                    style={styles.loader}
                    source={require('@images/loading.gif')}
                    resizeMode="contain"
                  />
                ) : null}
                <Text style={styles.loadCatsText}>Others</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setOthers(true);
                }}
                style={[
                  {flexDirection: 'row', alignItems: 'center'},
                  styles.loadCats,
                ]}>
                {loading ? (
                  <Image
                    style={styles.loader}
                    source={require('@images/loading.gif')}
                    resizeMode="contain"
                  />
                ) : null}
                <Text style={styles.loadCatsText}>Hide</Text>
              </TouchableOpacity>
                )}*/}

            <View style={{height: 100, marginBottom: 100}}></View>
          </ScrollView>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    height: height,
    marginTop: config.headerHeight,
  },
  category: {
    backgroundColor: '#2d3744',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: 'hsla(0,0%,100%,0.1)',
  },
  categoryView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainCategory: {
    fontWeight: '600',
    color: font1,
    fontSize: 16,
    marginLeft: 16,
    // lineHeight: 20.16,
  },
  backCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: selectedDrop,
    padding: 12,
  },
  backCategoryText: {
    color: font1,
    marginLeft: 16,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  categoryText: {
    marginLeft: 10,
    fontSize: 14,
    textTransform: 'uppercase',
    color: 'hsla(0,0%,100%,0.8)',
  },
  loadCatsText: {
    marginLeft: 10,
    fontSize: 12,
    textTransform: 'capitalize',
    color: '#fff',
    fontWeight: 'bold',
  },
  loadCats: {
    marginVertical: 10,
    marginLeft: 25,
  },
  loader: {
    height: 20,
    width: 20,
  },
  subcategories: {
    color: font1,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Helper.switchFont('medium'),
    marginLeft: 16,
  },
  selectedDrop: {
    padding: 8,
    backgroundColor: selectedDrop,
    borderRadius: 16,
  },
  categoryIcon: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth:1
  },
  listItem: {
    paddingVertical: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  courseNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '15%',
    justifyContent: 'space-between',
  },
  tabView: {
    width: '100%',
    height: 36,
    zIndex: 9999,
    top: config.headerHeight,
  },
  tabBgImage: {
    height: '100%',
    width: '100%',
  },
  userTabsWrapper: {
    position: 'absolute',
    top: 0,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTab: {
    width: '50%',
    justifyContent: 'center',
    height: '100%',
  },

  userTabText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: Helper.switchFont('bold'),
  },
  selectedUserTabText: {
    textAlign: 'center',
    color: 'rgb(255,255,255)',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: Helper.switchFont('bold'),
  },
  selectedTab: {
    width: '50%',
    justifyContent: 'center',
    borderBottomColor: 'rgba(255,255,255,0.8)',
    borderBottomWidth: 4,
    height: '100%',
  },
});
