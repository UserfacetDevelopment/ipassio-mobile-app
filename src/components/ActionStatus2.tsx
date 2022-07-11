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
import {StackActions, useFocusEffect} from '@react-navigation/native';
import helper from '../utils/helperMethods';
import {brandColor} from '../styles/colors';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../navigation/Navigators';
// import Close from '../assets/images/close-light.svg';
// import Success from '../assets/images/success.svg';
// import Error from '../assets/images/error.svg';
import LinearGradient from 'react-native-linear-gradient';
import CustomImage from './CustomImage';
import Config from '../config/Config';
import {useSelector} from 'react-redux';
import {loginSuccess, userState} from '../reducers/user.slice';
import {checkoutState} from '../reducers/checkout.slice';
import {useAppDispatch} from '../app/store';
import {courseState} from '../reducers/courses.slice';

type Props = NativeStackScreenProps<RootParamList, 'ActionStatus'>;

export default function ActionStatus2({navigation, route}: Props) {
  return (
    <View
      style={[
        styles.container,
        route.params?.messageStatus == 'success'
          ? styles.bgSuccess
          : styles.bgError,
      ]}>
      {route.params?.messageStatus == 'success' ||
      route.params?.messageStatus == 'failure' ? (
        <View>
          <View style={styles.animImageWrapper}>
            {route.params?.messageStatus == 'success' ? (
              <CustomImage
                height={172}
                width={327}
                uri={`${Config.media_url}success.svg`}
              />
            ) : (
              <CustomImage
                height={172}
                width={327}
                uri={`${Config.media_url}error.svg`}
              />
            )}
          </View>
          {route.params?.messageTitle ? (
            <Text style={styles.title}>{route.params?.messageTitle}</Text>
          ) : null}

          <Text style={styles.message}>{route.params?.messageDesc}</Text>
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0)',
              'rgba(255, 255, 255, 1)',
              'rgba(255, 255, 255, 0)',
            ]}
            style={styles.linearGradient}
          />
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
  bgSuccess: {
    backgroundColor: '#28BE91',
  },
  bgError: {
    backgroundColor: '#E15353',
  },
  animImageWrapper: {
    // marginTop: -50,
    marginHorizontal: 24,
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
    marginHorizontal: 20,
    marginTop: 16,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 23,
    color: '#fff',
    textAlign: 'center',
    fontFamily: helper.switchFont('regular'),
  },
  title: {
    marginTop: 57,
    fontSize: 24,
    color: '#fff',
    lineHeight: 30.24,
    fontWeight: '700',
    fontFamily: helper.switchFont('medium'),

    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  remSeconds: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: '#fff',
    textAlign: 'center',
    fontFamily: helper.switchFont('bold'),
  },
  linearGradient: {
    height: 1,
    opacity: 0.3,
    marginTop: 40,
    marginHorizontal: 16,
    marginBottom: 24,
  },
});
