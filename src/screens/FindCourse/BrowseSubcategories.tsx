import React, {PropsWithChildren, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  ScrollView,
} from 'react-native';

import {SvgUri} from 'react-native-svg';
import {
  courseState,
  getCategories,
  setPage,
  setShowMore,
} from '../../reducers/courses.slice';
import {
  setLoading,
  setPageLoading,
  loaderState,
} from '../../reducers/loader.slice';
import PageLoader from '../../components/PageLoader';
import helper from '../../utils/helperMethods';
import style from '../../styles/style';
import {FlatList} from 'native-base';
import {useAppDispatch} from '../../app/store';
const {width, height} = Dimensions.get('screen');
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import Back from '../../assets/images/arrow-dark.svg';
import {CategoryInterface} from './index';
import HeaderInner from '../../components/HeaderInner';
import {useRoute} from '@react-navigation/native';
import Drop from '../../assets/images/Drop.svg';
import {brandColor, font1, selectedDrop} from '../../styles/colors';
import Others from '../../assets/images/others.svg';
import Dropdown from '../../assets/images/dropdown.svg';
import config from '../../config/Config'
import CustomImage from '../../components/CustomImage';
type Props = NativeStackScreenProps<RootParamList, 'BrowseCategories'>;

export default function BrowseSubcategories({navigation, route}: Props) {
  const dispatch = useAppDispatch();
  const {categoryData, page, nationality} = useSelector(courseState);
  const [othersSelected, setOthersSelected] = useState(false);
  const routes = useRoute();
const categories = route.params?.subcategory;
  const {loading} = useSelector(loaderState);
const [active, setActive] = useState('');

  return (
      
    <>
      <HeaderInner
        backroute={route.params?.backroute}
        changingHeight={config.headerHeight}
        title={'Browse'}
        browseSelected={true}
        navigation={navigation}
        type={'findCourse'}
        back={true}
        // backroute={backroute}
      />
      <View style={styles.main}>
        {route.params?.subcategory ? (
        <>
          <TouchableOpacity
            style={styles.backCategory}
            onPress={() => {
              navigation.goBack();
            }}>
             <CustomImage height={24} width={24} uri={`${config.media_url}arrow-dark.svg`}/>
             
            {/* <Back/> */}
            <Text style={styles.backCategoryText}>Back</Text>
          </TouchableOpacity>
          </>
        ) : null}
        {categoryData && categoryData.data ? (
          <ScrollView>
                <View style={{paddingBottom: 20}}>
                        <View
                          style={{
                            // paddingHorizontal: 16,
                            paddingTop: 16,
                            paddingBottom:12,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                            {/* <SvgUri uri={cd.top_navigation_icon} /> */}
                          
                          <Text style={styles.mainCategory}>
                            {route.params?.cat}
                          </Text>
                        </View>
                        {categories && categories.length > 0 ? (
                          <>
                            {categories.map((sc: any) => {
                              return (
                                <TouchableOpacity
                                activeOpacity={1}
                                onPressIn={()=>{setActive(sc.seo.seo_slug_url)}}
                                onPressOut={()=>{setActive('')}}
                                onPress={() => {
                                  if (sc.subCategories && sc.subCategories.length !== 0) {
                                    navigation.navigate('Subcategories', {
                                      subcategory: sc.subCategories,
                                      cat: sc.category_name,
                                      backroute: "Categories",
                                    });
                                  } else {
                                    //call api for category page
                                    if (sc.seo.seo_slug_url !== null) {
                                      dispatch(setPageLoading(true));
                                      navigation.navigate('CategoryDetails', {
                                        category_slug: sc.seo.seo_slug_url,
                                        backroute: "Categories",
                                      });
                                    }
                                  }
                                }}
                                  style={{
                                    backgroundColor: active === sc.seo.seo_slug_url ? '#EFF1F2' : '#fff',
                                    borderLeftWidth:active === sc.seo.seo_slug_url ? 2 : 0,
                                    borderLeftColor:active === sc.seo.seo_slug_url ? brandColor : '#fff',
                                    paddingVertical : 16,
                                    paddingRight:16,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}>
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
                                      <CustomImage height={16} width={16} uri={`${config.media_url}drop.svg`}/>

                                    ) : null}
                                    <Text style={styles.subcategories}>
                                      {sc.toral_course}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              );
                            })}
                          </>
                        ) : null}
                      </View>
          
        

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
    marginLeft:16,
    // lineHeight: 20.16,
  },
  backCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: selectedDrop,
    padding: 16,
  },
  backCategoryText: {
    color: font1,
    marginLeft:16,
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
    marginLeft:16
  },
  selectedDrop:{
    padding:8,
    backgroundColor:selectedDrop,
    borderRadius:16
  }
});
