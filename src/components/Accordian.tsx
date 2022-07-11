import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions
} from 'react-native';
import {SvgUri} from 'react-native-svg';
import RenderHTML from 'react-native-render-html';
import helper from '../utils/helperMethods';
import config from '../config/Config';
import { background6, font1, font2 } from '../styles/colors';
const { width, height } = Dimensions.get('screen');
// import Expand from '../assets/images/expand.svg'
// import Collapse from '../assets/images/collapse.svg'
import CustomImage from './CustomImage';

interface AccordianInterface{
  title: string,
  data: string
}

const Accordian = ({title, data}: AccordianInterface) : any => {
  const [expanded, setExpanded] = useState<boolean>(false);
  // const {width} = useWindowDimensions();

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const toggleExpand = () : void => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View>
      <TouchableOpacity style={[styles.row,{backgroundColor:expanded ? '#fff' : background6, marginBottom:expanded ? 0 : 16,}]} onPress={toggleExpand}>
        <Text style={[styles.title]}>{title}</Text>
        {!expanded ? (
          <CustomImage
            height={20}
            width={20}
            uri={`${config.media_url}expand.svg`}
          />
        ) : (
          <View style={styles.collapseWrapper}>
            <CustomImage
            height={20}
            width={20}
            uri={`${config.media_url}collapse.svg`}
          />
          {/* <Collapse/> */}
          </View>
          // <SvgUri
          //   height="40"
          //   uri={`${config.media_url}images/course-detail/collapse-course-details.svg`}
          // />
        )}
      </TouchableOpacity>

      {expanded && (
          <RenderHTML
            baseStyle={styles.child}
            contentWidth={width}
            source={{html: data}}
          />
      )}
    </View>
  );
};

export default Accordian;

const styles = StyleSheet.create({
  title: {
    fontFamily: helper.switchFont('medium'),
    fontSize: 16,
    color: font1,
    // marginBottom: 20,
    overflow:'visible',
    maxWidth: '80%',
    flexWrap:'wrap'
  },
  row: {
    padding:12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    flexWrap:'wrap',
    borderRadius:10,
    
  },
  button: {
    height: 30,
    width: 30,
  },
  parentHr: {
    height: 1,

    width: '100%',
  },
  child:{
    fontFamily: helper.switchFont('regular'),
    fontWeight:'400',
    fontSize:14,
    color: font2,
    lineHeight:26,
    flexWrap:'wrap',
    maxWidth:width,
    paddingHorizontal:16,
    marginBottom:16

  },
  collapseWrapper:{width:24, height:24, alignItems:'center', justifyContent:'center'},
});
