import {StyleSheet, Dimensions, Platform} from 'react-native';
import helper from '../utils/helperMethods';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  appBackground,
  background4,
  brandColor,
  font1,
  font2,
  font3,
  lineColor,
} from '../styles/colors';
const {height, width} = Dimensions.get('screen');
import Helper from '../utils/helperMethods';

export default class StyleCSS {
  static styles = StyleSheet.create({
    title: {
      fontSize: 34,
      color: 'rgb(44, 54, 65)',
      fontFamily: helper.switchFont('light'),
    },
    flexDirRow: {
      flex: 1,
      flexDirection: 'row',
    },
    justifyContentCenter: {
      justifyContent: 'center',
    },
    loginContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      alignItems: 'center',
      // height: hp('100%'),
    },
    loginSubContainer: {
      maxWidth: '100%',
      alignContent: 'center',
    },
    submit: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: 50,
      backgroundColor: brandColor,
      borderRadius: 12,
      marginTop: 24,
      marginBottom: Platform.OS === 'ios' ? 24 : 24,
    },
    submitText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 16,
    },
    heading1: {
      fontSize: 36,
      marginVertical: 24,
      paddingTop: 20,
      fontFamily: helper.switchFont('regular'),
      color: '#6d7074',
    },
    body1: {
      fontFamily: helper.switchFont('regular'),
      fontSize: 22,
      color: '#6d7074',
    },
    headingBold: {
      marginTop: 12,
      fontFamily: helper.switchFont('medium'),
      fontSize: 34,
      color: '#32363a',
      width: width / 1.5,
    },
    subheading1: {
      marginVertical: 10,
      fontFamily: helper.switchFont('regular'),
      fontSize: 24,
      color: '#32363a',
    },
    shadow: {
      shadowColor: 'rgba(223, 230, 237, 0.67)',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0,
      shadowRadius: 30,

      elevation: 0.8,
    },
    shadowWrapper: {
      backgroundColor: background4,
    },
    input: {
      backgroundColor: '#FFFFFF',
      marginTop: 24,
      height: 48,
      fontFamily: helper.switchFont('medium'),
    },
    lineStyleDashed: {
      borderRadius: 0.5,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: lineColor,
    },
    lineStyleLight: {
      borderBottomWidth: 1,
      borderColor: lineColor,
    },
    button: {
      padding: 12,
      paddingTop: 18,
      paddingBottom: 18,
      borderRadius: 8,
      backgroundColor: brandColor,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
      zIndex: 1,
      // paddingVertical: 8,
      // paddingHorizontal: 20
    },
    buttonText: {
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      fontFamily: Helper.switchFont('medium'),
      fontSize: 16,
    },
    alignCenter: {
      alignItems: 'center',
    },

    //for header tabs

    activeBorder: {
      borderBottomWidth: 4,
      borderBottomColor: '#fff',
      opacity: 0.8,
    },
    tabTextActive: {
      fontSize: 20,
      fontFamily: Helper.switchFont('medium'),
      color: '#fff',
      fontWeight: '600',
    },
    tabTextInactive: {
      fontSize: 20,
      fontFamily: Helper.switchFont('medium'),
      color: 'rgb(255, 255, 255, 0.3)',
      opacity: 0.5,
      fontWeight: '600',
    },
  });
}
