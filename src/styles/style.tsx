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
  dropdownBorder,
  font1,
  font2,
  font3,
  lineColor,
  secondaryColor,
  secondaryColorBorder,
} from '../styles/colors';
const {height, width} = Dimensions.get('screen');
import Helper from '../utils/helperMethods';
import { HelperText } from 'react-native-paper';

export default class StyleCSS {
  static styles = StyleSheet.create({
    mainTitle: {
      fontSize: 24,
      color:font1,
      fontWeight:'700',
      fontFamily: helper.switchFont('bold'),
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
      height: 48,
      backgroundColor: brandColor,
      borderRadius: 12,
      marginTop: 24,
      marginBottom: Platform.OS === 'ios' ? 24 : 24,
    },
    submitText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 16,
      textTransform:'capitalize'
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
        width: 5,
        height: 90,
      },
      // shadowOpacity: 0,
      shadowRadius: 30,
      elevation: 8,
    },

    shadowWrapper: {
      backgroundColor: background4,
    },
    input: {
      backgroundColor: '#FFFFFF',
      // marginTop: 24,
      height: 48,

      fontFamily: helper.switchFont('medium'),
      fontSize:14,
      // lineHeight:20,
      color:font1
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

    //cards
    profilePic: {
      width: 48,
      height: 48,
      borderRadius: 25,
      alignItems: 'center',
    },
    profilePicActive:{ 
      height:56, 
      width:56, 
      borderWidth:1.3, 
      borderColor:brandColor, 
      justifyContent:'center', 
    alignItems:'center', 
    borderRadius: 30
  },
  datePicker: {
    width:'100%',
     paddingVertical: 12,
                       paddingHorizontal: 16,
                       flexDirection: 'row',
                       flex: 1,
                       justifyContent:'space-between',
                       alignItems:'center',
                       borderWidth: 1,
                       borderColor: dropdownBorder,
                       borderRadius: 8
   },
   reviewTextArea: {
    width: '100%',
    height: 150,
    color: font1,
    fontSize: 14,
    textAlignVertical: 'top',
    borderRadius: 5,
  },
   //popup
   modalBackground: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    height: '100%',
  },
  modalView: {
position:'absolute',
bottom:0,
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    // marginTop:150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    // padding: 16,
    paddingTop:0,
    //  top:252,
    zIndex: 20,
  },
  modalLine:{alignSelf:'center', marginTop:8, borderRadius:5, borderColor: font2, borderWidth:1.5, width:56, opacity:0.3},
  modalTitle:{fontWeight:'700', fontSize: 18, color: font1, marginVertical:12, marginHorizontal:16, fontFamily: Helper.switchFont('bold')},
  modalButton: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: Platform.OS==='android' ? 16 :24,
    paddingHorizontal:16,
    paddingTop: 16,
  },
  modalTextarea:{
    height: 158,
    width: width - 32,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: dropdownBorder,
  },

  submitButton:{
    padding: 12,
    // paddingTop: 18,
    // paddingBottom: 18,
    backgroundColor: brandColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: '48%',
    zIndex: 1,
  },
  submitButtonText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: Helper.switchFont('medium'),
    fontSize: 14,
    lineHeight: 18,
  },
  cancelButton:{
    padding: 12,
    // paddingTop: 18,
    // paddingBottom: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: '49%',
    zIndex: 1,
    borderColor: secondaryColorBorder,
    borderWidth:1,
    marginRight: '3%',
  },
  cancelButtonText:{
    color: secondaryColor,
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: Helper.switchFont('bold'),
    fontSize: 14,
    lineHeight: 18,
  },
  contentText: {
    fontSize: 14,
    fontWeight: '500',
    color: font1,
    fontFamily: helper.switchFont('medium'),
  },
  labelText: {
    fontSize: 14,
    color: font2,
    fontWeight:'500',
    fontFamily: Helper.switchFont('medium'),
  },
  formFillTimeImage: {
    height: '100%',
    width: '100%',
  },
  formFillTimeTextWrapper: {
    paddingLeft: 16,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    height: 32,
    width: '100%',
    // top: 100,
  },
  formFillTimeText: {zIndex: 100, fontSize: 12, color: '#fff', opacity: 0.7},
  marginV16:{marginVertical: 16},
  font12:{fontSize:12},
  font14:{fontSize:14},
  font16:{fontSize:16},
  font18:{fontSize:18},
  font24:{fontSize:24},
  fdrCenter:{
    flexDirection:'row',
    alignItems:'center'
  },
  fw400:{
    fontWeight:'400'
  },
  fw500:{
    fontWeight:'500'
  },
  fw600:{
    fontWeight:'600'
  },
  fw700:{
    fontWeight:'700'
  },
  });
}
