import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Animated,
  TouchableOpacity,
  // Image,
  StyleSheet,
  PlatformColor,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useAppDispatch} from '../../app/store';
import HeaderInner from '../../components/HeaderInner';
import {useRoute} from '@react-navigation/native';
import {
  setPage,
  getCategories,
  courseState,
  setSelectedCategories,
  setSelectedSubCategories,
  setSelectedLevels,
  setOffset,
  setSecSubcategories,
  getLookups
} from '../../reducers/courses.slice';
import SheetCSS from '../../styles/style';
import {Checkbox, configureFonts} from 'react-native-paper';
import {CategoryInterface, Loader} from './index';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootParamList} from '../../navigation/Navigators';
import axios from 'axios';
import {loaderState, setLoading} from '../../reducers/loader.slice';
import {ScrollView} from 'native-base';
import {background, brandColor, font1,font2, lineColor} from '../../styles/colors';
// import Dropdown from '../../assets/images/dropdown.svg';
// import Drop2 from '../../assets/images/drop2.svg';
import config from '../../config/Config'
import Helper from '../../utils/helperMethods';
import CustomImage from '../../components/CustomImage';
type Props = NativeStackScreenProps<RootParamList, 'FilterScreen'>;

export default function Filters({navigation, route}: Props) {
  const routes = useRoute();
  const dispatch = useAppDispatch();
  const {
    categoryData,
    showMore,
    selectedLevels,
    selectedCategories,
    selectedSubcategories,
    selectedSecsubcategories,
    nationality,
    page,
    offset,
  } = useSelector(courseState);
  const [tabState, setTabState] = useState<'C' | 'SC' | 'L'>('C');
  const [courseLevels, setCourseLevels] = useState([]);
  const [levelTemp, setLevelTemp] = useState([]);
  const [categories, setCategories] = useState(selectedCategories);
  //extra state to store the categories according to master field
  const [categoryMaster, setCategoryMaster] = useState([]);
  const [categoryNonmaster, setCategoryNonMaster] = useState([]);
  
  let [catTemp, setCatTemp] = useState([]);
  const [subCategories, setSubcategories] = useState(selectedSubcategories)
  const levels = categoryData && categoryData.status === 'success' && categoryData.extra_data
        ? categoryData.extra_data
        : undefined;
  const [others, setOthers] = useState(false);
  const [secSubCategories, setSecSubCategories] = useState(selectedSecsubcategories);
  const {loading} = useSelector(loaderState);
  const [all, setAll] = useState(false);
  const [temp, setTemp] = useState([])
const [testState, setTestState] = useState(selectedCategories);

console.log(testState);
// useEffect(()=>{
//   const date= new Date();
//   console.log("checked", date.getHours()+':' +date.getMinutes()+":"+ date.getSeconds());
//   console.log(selectedCategories)
// setCategories(testState);
// setSubcategories(selectedSecsubcategories);
// setSecSubCategories(selectedSecsubcategories)
// setLevelTemp(selectedLevels)

// },[selectedCategories, selectedSubcategories, selectedSecsubcategories])

// console.log(selectedCategories)


  const handleCategories = (category: any) => {
      setAll(false);
    let temp = [...categories];

    if (temp.includes(category.seo.seo_slug_url)) {
      setCatTemp(
        catTemp.filter(
          item => item.seo.seo_slug_url !== category.seo.seo_slug_url,
        ),
      );
      setSubcategories([]);
      temp.splice(temp.indexOf(category.seo.seo_slug_url), 1);
    } else {
      setCatTemp([...catTemp, category]);
      temp.push(category.seo.seo_slug_url);
    }
    setCategories(temp);
  };

  const handleSubcategories = (category: any) => {
      setAll(false);
    

    // if subcategory is selected then all sec sub categories should remain selected initially
    if(category.subCategories.length>0){
        // for(let i=category.subCategories.length-1; i>=0; i--){
            
        //   handleSecSubcategoriesOnParentClick(category.subCategories[i]);
        // }

        category.subCategories.forEach((element : any) => {
            handleSecSubcategoriesOnParentClick(element)
        });
    }


    let temp = [...subCategories];
    if (temp.includes(category.seo.seo_slug_url)) {
      temp.splice(temp.indexOf(category.seo.seo_slug_url), 1);
      //if the subcategory has secsubcategories, then on removing the subcategories, secsubcategories should also get removed
      category.subCategories.length>0 ? category.subCategories.map((ct) => {
handleSecSubcategories(ct)
      }) : null
      
    } else {
      temp.push(category.seo.seo_slug_url);
    }
    setSubcategories(temp);
  };

  const handleSecSubcategories = (category: any) => {
      setAll(false);
    let temp = [...secSubCategories];

    if (temp.includes(category.seo.seo_slug_url)) {
      temp.splice(temp.indexOf(category.seo.seo_slug_url), 1);
    } else {
      temp.push(category.seo.seo_slug_url);
    }
    setSecSubCategories(temp);
  };

  const handleSecSubcategoriesOnParentClick = (category: any) => {
    // setAll(false);
  let temp = [...secSubCategories];

  if (temp.includes(category.seo.seo_slug_url)) {
//nothing
  } else {
    temp.push(category.seo.seo_slug_url);
  }
  setSecSubCategories(temp);
};

  useEffect(() => {
    dispatch(getLookups())
    .unwrap()
    .then((res) => {
      if (res.data.status === 'success') {
        setCourseLevels(res.data.data.course_levels);
      }
    });
      
  }, []);

  const handleLevels = (level: any) => {
    let temp = [...levelTemp];
    if (temp.includes(level)) {
      temp.splice(temp.indexOf(level), 1);
    } else {
      temp.push(level);
    }
    setLevelTemp(temp);
  };

  const getCount = (code: string) => {
    if(nationality === 'INDIAN'){
      if (code === 'S') {
        return levels.count.india_levels_course.count_all_level;
      } else if (code === 'A') {
        return levels.count.india_levels_course.count_all_level;
      } else if (code === 'B') {
        return levels.count.india_levels_course.count_beginner;
      } else if (code === 'I') {
        return levels.count.india_levels_course.count_intermediate;
      } else if (code === 'P') {
        return levels.count.india_levels_course.count_professional;
      }
    }
    else{
      if (code === 'S') {
        return levels.count.western_levels_course.count_expert;
      } else if (code === 'A') {
        return levels.count.western_levels_course.count_all_level;
      } else if (code === 'B') {
        return levels.count.western_levels_course.count_beginner;
      } else if (code === 'I') {
        return levels.count.western_levels_course.count_intermediate;
      } else if (code === 'P') {
        return levels.count.western_levels_course.count_professional;
      }
    }
    
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


  const loadCategories = () => {
    return (
      <>
        {categoryData && categoryData.status === 'success' ? (
          <>
          {categoryMaster.map((cd: any) => {
            return (
              <>
             {checkNationality(cd.all_course, cd.indian_course, cd.western_course) ? 
              <TouchableOpacity
                onPress={() => {
                  handleCategories(cd);
                }}
                key={cd.id}
                style={styles.filterListItem}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Checkbox.Android
                    status={
                      categories.indexOf(cd.seo.seo_slug_url) > -1
                        ? 'checked'
                        : 'unchecked'
                    }
                  />
                  <Text style={styles.textColor}>{cd.category_name}</Text>
                </View>
                <Text style={styles.textColorNumber}>{nationality === 'INDIAN' ? cd.indian_course : cd.all_course-cd.indian_course}</Text>
              </TouchableOpacity> : null}
              </>
            );
          })}
          <TouchableOpacity
          hitSlop={{top:20, bottom:20, right:20, left:20}}
          style={{flexDirection: 'row', paddingVertical:8, alignItems:'center'}}
          onPress={() => setOthers(!others)}>
          {others ? <View style={styles.dropBackground}>
            <CustomImage height={16} width={16} uri={`${config.media_url}dropdown.svg`}></CustomImage>
          </View> : <View style={[styles.dropBackground, {backgroundColor:'#fff'}]}>
            <CustomImage height={16} width={16} uri={`${config.media_url}dropdown.svg`}></CustomImage>
          </View>}
          
          <Text style={styles.textColor}>{others ? 'Hide' : 'Others'}</Text>
          {/* {loading ? (
            
            <Image
              style={styles.loader}
              source={require('@images/loading.gif')}
              resizeMode="contain"
            />
          ) : null} */}
        </TouchableOpacity>
          {others ? 
          (<>
          {categoryNonmaster.map((cd: any) => {
            return (
              <>
              {checkNationality(cd.all_course, cd.indian_course, cd.western_course) ?
              <TouchableOpacity
                onPress={() => {
                  handleCategories(cd);
                }}
                key={cd.id}
                style={[styles.filterListItem, {paddingLeft:34}]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Checkbox.Android
                    status={
                      categories.indexOf(cd.seo.seo_slug_url) > -1
                        ? 'checked'
                        : 'unchecked'
                    }
                  />
                  <Text style={styles.textColor}>{cd.category_name}</Text>
                </View>
                <Text style={styles.textColorNumber}>{nationality === 'INDIAN' ? cd.indian_course : cd.all_course-cd.indian_course}</Text>
              </TouchableOpacity>:null}
              </>
            );
          })}
          </>) : null
          }
          </>
        ) : categoryData.status === 'failure' ? (
          <View style={{marginTop: 150}}>
            <Text style={styles.textColor}>Something went wrong</Text>
          </View>
        ) : (
          <View style={{marginTop: 150}}>
            <Loader />
          </View>
        )}
        
      </>
    );
  };

 
  const loadLevels = () => {
    return (
      <>
        {levels && courseLevels ? (
          <>
            {courseLevels.map((cl: any) => {
              return (
                <>
                  {getCount(cl.code) > 0 ? (
                    <TouchableOpacity
                      // key={}
                      onPress={() => {
                        handleLevels(cl.code);
                      }}
                      style={styles.filterListItem}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Checkbox.Android
                          status={
                            levelTemp.indexOf(cl.code) > -1
                              ? 'checked'
                              : 'unchecked'
                          }
                          onPress={() => {
                            handleLevels(cl.code);
                          }}
                        />
                        <Text style={styles.textColor}>{cl.name}</Text>
                      </View>
                      <Text style={styles.textColorNumber}>{getCount(cl.code)}</Text>
                    </TouchableOpacity>
                  ) : null}
                </>
              );
            })}
          </>
        ) : null}
      </>
    );
  };


  const loadSubcategories = () => {
    const loadingArr =  catTemp.length > 0 ? catTemp : !others ? categoryMaster :categoryData.data;
// loadingArr holds the catehories selected to map the subcategories

    return (
      <>
        {categoryData && categoryData.data && loadingArr.map((ct: any) => {
          return ct.subCategories.map((sc: any) => {
            return (
              <>
              {checkNationality(sc.all_course, sc.indian_course, sc.western_course) ? 
                <TouchableOpacity
                  onPress={() => {
                    handleSubcategories(sc);
                  }}
                  key={sc.id}
                  style={styles.filterListItem}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Checkbox.Android
                      status={
                        subCategories.indexOf(sc.seo.seo_slug_url) > -1
                          ? 'checked'
                          : 'unchecked'
                      }
                    />
                    <Text style={styles.textColor}>{sc.category_name}</Text>
                  </View>
                  <View style={styles.moreSc}> 
                  
                  {subCategories.indexOf(sc.seo.seo_slug_url) > -1 && sc.subCategories.length > 0 ? <View style={styles.dropBackground}>
                  <CustomImage height={16} width={16} uri={`${config.media_url}dropdown.svg`}></CustomImage>

                    </View> : sc.subCategories.length > 0 ? <View style={styles.drop}>
                    <CustomImage height={16} width={16} uri={`${config.media_url}drop2.svg`}></CustomImage>

                    </View> : null}
                  <Text style={[styles.textColorNumber, styles.moreScText]}>{nationality==='INDIAN' ? sc.indian_course : sc.western_course}</Text>
                  </View>
                </TouchableOpacity> : null}
                {subCategories.indexOf(sc.seo.seo_slug_url) > -1 &&
                sc.subCategories.length > 0 ? (
                  <View style={styles.secSubcategoryListitem}>
                    {sc.subCategories.map((ssc: any) => {
                      return (
                        <TouchableOpacity
                          key={ssc.id}
                          style={styles.filterListItem}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Checkbox.Android
                              onPress={() => {
                                handleSecSubcategories(ssc);
                              }}
                              status={
                                secSubCategories.indexOf(ssc.seo.seo_slug_url) >
                                -1
                                  ? 'checked'
                                  : 'unchecked'
                              }
                            />
                            <Text style={styles.textColor}>
                              {ssc.category_name}
                            </Text>
                          </View>
                          <Text style={styles.textColorNumber}>
                            {nationality === 'INDIAN' ? ssc.indian_course : ssc.western_course}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}
              </>
            );
          });
        })}
        <View style={{height: 100}}></View>
      </>
    );
  };

  //calling the categories api 
//   useEffect(() => {
//       dispatch(setLoading(true));
//     const category_data: CategoryInterface = {
//       page: '',
//       nationality: '',
//     };

//     dispatch(getCategories(category_data))
// .unwrap()
//     .then(()=> {dispatch(setLoading(false))
//         setCatTemp([]);
//       })
//     .catch(()=> dispatch(setLoading(false)))

//   }, []);

//if others is false that means only master categories are being shown, then we can show category array according to hide and others.

useEffect(()=>{
  if(categoryData){
  for(let i=0; i<categoryData.data.length; i++){
    if(categoryData.data[i].is_master){
      temp.push(categoryData.data[i].seo.seo_slug_url);
      categoryMaster.push(categoryData.data[i]);
    } 
    else{
      categoryNonmaster.push(categoryData.data[i]);
    }
  }}
}, [categoryData])


// useEffect(()=>{
//     let categoryTemp=[];
//     for(let i=0; i<categories.length; i++){
        
//         // catTemp.push(categoryData.data.filter(item=> return() item.seo.seo_slug_url === categories[i])[0]);

        

//         for(let j=0; j<temp.length; j++){
//             if(temp[j] === categories[i]){
//                 categoryTemp.push(categories[i]);
//             }
//         }
//     }
//     setCategories(categoryTemp);
//     categoryTemp=[];
//     setSubcategories([]);

//     for(let i=0; i<categories.length; i++){
        
//         // catTemp.push(categoryData.data.filter(item=> return() item.seo.seo_slug_url === categories[i])[0]);

//         for(let j=0; j<categoryData.data.length; j++){
//             if(categoryData.data[j].seo.seo_slug_url === categories[i]){
//                 catTemp.push(categoryData.data[j]);
                
//             }
//         }
//     }
//     console.log(temp)
// },[temp])


//updating the categories and the subcategories if the user chooses to hide the categories.
// useEffect(()=>{
//   let categoryTemp=[];
// let tempCatTemp: Array<any> = [];
//   if(!others){
//     setCatTemp([])
//     // if(categories.length>0){
//       for(let i=0; i<categories.length; i++){
//         for(let j=0; j<categoryMaster.length; j++){
//             if(categoryMaster[j].seo.seo_slug_url === categories[i]){
//               // console.log(categoryMaster[j])
//               // tempCatTemp.push(categoryMaster[j])
//               // console.log(tempCatTemp)
//                 catTemp.push(categoryMaster[j]); 
//                 // console.log('cateTemp', catTemp)
//                 categoryTemp.push(categoryMaster[j].seo.seo_slug_url)
//             }
//         }
//     }

//     // // setCatTemp([tempCatTemp]);
//     // }
    
//       setCategories(categoryTemp);
//       // until catTemp emmpty issue is resolved, till then keeping the below line to clear the selecetd categories also
//       setCategories([]);
//       // setCatTemp([tempCatTemp]);

//     categoryTemp=[];
//     setSubcategories([]);
//   }
// }, [others])

  const applyCategories = () => {
    dispatch(setSelectedCategories(categories));
    dispatch(setSelectedSubCategories(subCategories));
    dispatch(setSelectedLevels(levelTemp));
    dispatch(setOffset(0));
    dispatch(setSecSubcategories(secSubCategories));
    navigation.navigate('FindCourses');
  };

  const clearFilters = () => {
    setCategories([]);
    setCatTemp([]);
    setSubcategories([]);
    setLevelTemp([]);
    setSecSubCategories([]);
    dispatch(setSecSubcategories([]));
    dispatch(setSelectedCategories([]));
    dispatch(setSelectedSubCategories([]));
    dispatch(setSelectedLevels([]));
    dispatch(setOffset(0));
  };

  const handleAll = () => {
      setAll(!all);
      setCategories([]);
      setSubcategories([]);
      setLevelTemp([]);
      setSecSubCategories([]);
  }

  return (
    <>
      <HeaderInner
      changingHeight={config.headerHeight}
      back={true}
      // backroute = {routes.name}
        title={'Filter'}
        type={'findCourse'}
        backroute={'FindCourses'}
        navigation={navigation}
      />

      <View
        style={{
          backgroundColor: '#fff',
          zIndex: -3,
          // borderWidth: 5,
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <ScrollView style={{marginTop: config.headerHeight}}>
          <View style={{paddingHorizontal:16, marginBottom:100}}>
          {/* {tabState === 'C'
            ? <>
            <TouchableOpacity
                          style={styles.allListItem}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Checkbox.Android
                            
                            style={{borderRadius:4, borderColor:lineColor, borderWidth:1}}
                              onPress={() => {
                                handleAll();
                              }}
                              status={
                                all || categoryData.length === categories.length ||levelTemp.length===courseLevels.length
                                  ? 'checked'
                                  : 'unchecked'
                              }
                            />
                            <Text style={styles.textColor}>
                              All
                            </Text>
                          </View>
                          <Text style={styles.textColor}>
                            {route.params?.total_courses}
                          </Text>
                        </TouchableOpacity>
                        <View style={SheetCSS.styles.lineStyleDashed}/>
            {loadCategories()}</>
            : tabState === 'SC'
            ? loadSubcategories()
            : loadLevels()} */}
            <Text style={styles.title}>All Categories</Text>
            {loadCategories()}
            <Text style={styles.title}>Levels</Text>
            {loadLevels()}
            <Text style={styles.title}>Subcategories</Text>
            {loadSubcategories()}
            
            </View>
        </ScrollView>
        {all || categories.length !== 0 ||
        subCategories.length !== 0 ||
        levelTemp.length !== 0 ? (
          <View
            style={[
              {
                // bottom: 95,
                paddingTop: 16, //10 after adding tab navigation
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
                paddingHorizontal: 16,
                alignItems: 'center',
                shadowColor: '#000',

                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 3.84,
                elevation: 8,
                paddingBottom : Platform.OS==='android'? 16 : 24,
              },
            ]}>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearAll}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={applyCategories}
              style={{
                borderRadius: 8,
                backgroundColor: brandColor,
                paddingVertical: 10,
                paddingHorizontal: 24,
              }}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  textColor: {
    color: font1,
    fontSize:14,
    fontWeight:'500',
    fontFamily:Helper.switchFont('medium')
  },
  textColorNumber:{
    color: font2,
    fontWeight:'500',
    fontSize:14,
    fontFamily:Helper.switchFont('medium')

  },
  loader: {
    height: 20,
    width: 20,
  },
  filterListItem:{
     paddingVertical:8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  allListItem:{
    paddingVertical:25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearAll: {
    color: brandColor,
    fontSize:16,
    fontWeight:'500',
    fontFamily:Helper.switchFont('medium')
  },
  moreSc:{
      flexDirection:'row',
      alignItems:'center',
  },
  moreScText:{
      marginLeft:21
  },
  secSubcategoryListitem:{
      paddingLeft:34
  },
  drop:{
      marginRight:9,
  },
  dropBackground:{backgroundColor: background, padding:6, borderRadius:50, marginRight:9},
  title:{
    fontSize:18,
    color:font1,
    fontWeight:'700',
    lineHeight:23,
    marginVertical:16,
    fontFamily:Helper.switchFont('bold')
  },
  buttonText:{
    color: '#fff',
    fontSize:14,
    fontWeight:'700',
    fontFamily:Helper.switchFont('medium')
  }
});
