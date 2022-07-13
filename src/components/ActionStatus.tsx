import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
//@ts-ignore
import {Bubbles} from 'react-native-loader';
import Intercom from '@intercom/intercom-react-native'
import {StackActions, useFocusEffect} from '@react-navigation/native';
import helper from '../utils/helperMethods';
import { brandColor } from '../styles/colors';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParamList } from '../navigation/Navigators';
import LinearGradient from 'react-native-linear-gradient';
import CustomImage from './CustomImage';
import Config from '../config/Config';

type Props = NativeStackScreenProps<RootParamList, 'ActionStatus'>;

export default function ActionStatus({navigation, route} : Props) {

  const [remainingSeconds, setRemainingSeconds] = useState<number>(route.params?.timeOut / 1000);
  const [isRedirected, setIsRedirected] = useState<boolean>(false);

  let myInterval: number=0;

  useFocusEffect(
    useCallback(() => {
      timer();
      return () => {clearInterval(myInterval)}
    }, []),
  );


    // Intercom.hideIntercom();
    // Intercom.setLauncherVisibility(Visibility.GONE);

  // useEffect(()=>{
  //   timer();
  //   return () => {clearInterval(myInterval)};
  // },[])
  const backRoute= route.params?.backRoute;
  const params = route.params?.params;

  const cleanup=()=>{
    clearInterval(myInterval)
    setRemainingSeconds(0);
  }

useEffect(()=>{
  if(isRedirected){
    setRemainingSeconds(0);
  clearInterval(myInterval);
  if (route.params?.backRoute == 'startagain') {
    navigation.dispatch(StackActions.popToTop());
  } else if(route.params.navigator !==undefined){   
    navigation.navigate(route.params?.navigator, {
      screen: backRoute,
      params: params
    });
  }
  else {
      navigation.navigate(backRoute , params);
  }}
},[isRedirected])

  const timer = () => {
    setTimeout(() => {
      if (!isRedirected) {
        setIsRedirected(true);
        if (route.params?.backRoute == 'startagain') {
          navigation.dispatch(StackActions.popToTop());
        } else {
          navigation.navigate(backRoute , params);
        }
        // navigation.goBack();
      }
    }, route.params.timeOut);

    myInterval = setInterval(() => {
      if (remainingSeconds <= 0) {
        if (isRedirected === false) {
          setIsRedirected(true);
          
        }
      } else {
        setRemainingSeconds(secs => secs - 1);
      }
    }, 1000);
  };

  return (
    <View style={[styles.container, route.params?.messageStatus == 'success' ? styles.bgSuccess : styles.bgError ]}>
      {route.params?.messageStatus !='' ? (
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setIsRedirected(true);
            //   clearInterval(myInterval);
            //   if(route.params.navigator){
                
            //     navigation.navigate(route.params?.navigator, {
            //       screen: backRoute,
            //       params: params
            //     });
            //   }
            //   else {
            //     navigation.navigate(route.params?.backRoute, {
            //     email: route.params?.email
            //   });
            // }
            }}>
            {/* <Image
              source={require('@images/close_image.png')}
              style={styles.closeButton}
            /> */}
            <View  style={styles.closeButton}>
              <CustomImage
           height={24}
           width={24}
           uri={`${Config.media_url}close.svg`}
         />
            </View>
          </TouchableOpacity>
        </View>
      ) : null}

      {route.params?.messageStatus == 'success' ||
      route.params?.messageStatus == 'failure' ? (
        <View >
          <View style={styles.animImageWrapper}>
            {route.params?.messageStatus == 'success'
                  ? 
                  <CustomImage
           height={172} width={327}
            uri={`${Config.media_url}success.svg`}
          />
                  : 
                  <CustomImage
                  height={172} width={327}
                  uri={`${Config.media_url}error.svg`}/>
                  }
          
          </View>
{route.params?.messageTitle ? <Text style={styles.title}>{route.params?.messageTitle}</Text>:null}
          
          <Text style={styles.message}>{route.params?.messageDesc}</Text>
          <LinearGradient colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)','rgba(255, 255, 255, 0)']} style={styles.linearGradient} />
          <Text style={styles.message}>
            You will be redirected in{' '}
            
            
          </Text>
          <Text style={styles.remSeconds}>{remainingSeconds} seconds</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <Bubbles size={7} color="rgb(197, 15, 39)" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  bgSuccess:{
    backgroundColor: '#28BE91',
  },
  bgError:{
    backgroundColor: '#E15353',
  },
  animImageWrapper: {
    // marginTop: -50,
   marginHorizontal:24
  },
  buttonWrapper: {
    position: 'absolute',
    right: 20,
    top: 50,
    zIndex: 2,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeButton: {
    width: 25,
    height: 25,
    opacity: 0.5,
  },
  message: {
    marginHorizontal:20,
    marginTop:16,
    fontSize:16,
    fontWeight:'400',
    lineHeight:23,
    color: '#fff',
    textAlign: 'center',
    fontFamily: helper.switchFont('regular'),
  },
  title: {
    marginTop:57,
    fontSize: 24,
    color: '#fff',
    lineHeight:30.24,
    fontWeight:'700',
    fontFamily: helper.switchFont('medium'),
    
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  remSeconds:{
    fontSize:16,
    fontWeight:'700',
    lineHeight:24,
    color: '#fff',
    textAlign: 'center',
    fontFamily: helper.switchFont('bold'),
  },
  linearGradient:{
    height:1, opacity:0.3, marginTop:40, marginHorizontal:16, marginBottom: 24},
});