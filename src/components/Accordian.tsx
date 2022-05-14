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
const { width, height } = Dimensions.get('screen');

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
      <TouchableOpacity style={styles.row} onPress={toggleExpand}>
        <Text style={[styles.title]}>{title}</Text>
        {!expanded ? (
          <SvgUri
            height="40"
            uri={`${config.media_url}images/course-detail/expand-course-details.svg`}
          />
        ) : (
          <SvgUri
            height="40"
            uri={`${config.media_url}images/course-detail/collapse-course-details.svg`}
          />
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
    fontSize: 18,
    color: 'rgb(44, 54, 65)',
    marginBottom: 20,
    overflow:'visible',
    maxWidth: '80%',
    flexWrap:'wrap'
  },
  row: {
    paddingVertical:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#f9f9fa',
    borderBottomWidth: 1,
    flexWrap:'wrap'
  },
  button: {
    height: 30,
    width: 30,
  },
  parentHr: {
    height: 1,
    // color: Colors.WHITE,
    width: '100%',
  },
  child:{
    fontFamily: helper.switchFont('light'),
    fontSize:15,
    color: 'rgb(44, 54, 65)',
    flexWrap:'wrap',
    maxWidth:width,

  }
});
