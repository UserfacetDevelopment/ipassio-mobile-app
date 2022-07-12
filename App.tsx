/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {StyleSheet, useColorScheme, Alert, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
  setCustomImage,
  setCustomTouchableOpacity,
} from 'react-native-global-props';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider} from 'react-redux';
import {NativeBaseProvider} from 'native-base';
import messaging from '@react-native-firebase/messaging';
import store, {useAppDispatch} from './src/app/store';
import {RootNavigator} from './src/navigation/Navigators';
//@ts-ignore
import VersionCheck from 'react-native-version-check';
import {BackHandler} from 'react-native';
import {Linking} from 'react-native';
import {
  brandColor,
  dropdownBorder,
  font1,
  font2,
  font3,
  lineColor,
  lineColor2,
  secondaryColor,
} from './src/styles/colors';
import {setFCMToken, userState} from './src/reducers/user.slice';
import SplashScreen from 'react-native-splash-screen';
import {number} from 'prop-types';

const theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    primary: dropdownBorder,
    accent: secondaryColor,
    // underlineColor:'transparent',
    placeholder: '#9AA6B2',
    text: font1,
    underlineColor: 'transparent',
  },
};

const customTextProps = {
  style: {
    fontFamily: 'PlusJakartaSans-Regular',
    color: font2,
    fontWeight: '500',
  },
};

setCustomText(customTextProps);

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const Stack = createNativeStackNavigator();
  // const [userDataLoaded, setUserDataLoaded] = useState(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [permissions, setPermissions] = useState({});
  // const [latestVersion, setLatestVersion] = useState<number|undefined>(undefined);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      //Do nothing
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  // useEffect(()=>{
  //   VersionCheck.getLatestVersion().then((res:any)=>{
  //     console.log(res)
  //     setLatestVersion(res);
  //   });
  // },[])

  // const currentVersion = VersionCheck.getCurrentVersion()
  // console.log('latestVersion', parseFloat(latestVersion));
  // console.log('currentVersion', parseFloat(currentVersion));

  useEffect(() => {
    checkUpdateNeeded();
    SplashScreen.hide();
  }, []);

  // setCustomTextInput(customTextInputProps);

  const checkUpdateNeeded = async () => {
    let updateNeeded: any;
    VersionCheck.needUpdate().then((res: any) => {
      updateNeeded = res;
      console.log(res)
    });

    // console.log(updateNeeded)
    if (updateNeeded.isNeeded){
      //Alert the user and direct to the app url
      Alert.alert(
        'Please Update',
        'Update your app to the latest version to continue',
        [
          {
            text: 'Update',
            onPress: () => {
              BackHandler.exitApp();
              Linking.openURL(updateNeeded.storeUrl);
            },
          },
        ],
      );
    }
  };

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NativeBaseProvider>
          <RootNavigator />
        </NativeBaseProvider>
      </PaperProvider>
      <Toast />
    </Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
