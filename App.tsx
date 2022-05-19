/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {StyleSheet, useColorScheme, Alert} from 'react-native';

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
  setCustomTouchableOpacity
} from 'react-native-global-props';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider} from 'react-redux';
import {NativeBaseProvider} from 'native-base';
import messaging from '@react-native-firebase/messaging';
import store, { useAppDispatch } from './src/app/store';
import {RootNavigator} from './src/navigation/Navigators';
//@ts-ignore
import VersionCheck from 'react-native-version-check';
import {BackHandler} from 'react-native';
import {Linking} from 'react-native';
import { brandColor, dropdownBorder, font1, font2, font3, lineColor, lineColor2, secondaryColor } from './src/styles/colors';
import PushController from './src/utils/PushController'
import { setFCMToken } from './src/reducers/user.slice';
import SplashScreen from 'react-native-splash-screen'

const theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    // ...DefaultTheme.colors,
     primary: dropdownBorder,
    accent: secondaryColor,
    // underlineColor:'transparent',
     placeholder: '#9AA6B2', 
          // text:font2,
          //  primary: 'white',
           underlineColor: 'transparent',    
          // background : '#0f1a2b'
  },
};

const customTextProps = {
  style: {
    fontFamily: 'PlusJakartaSans-Regular',
    color: font2,
    fontWeight:'500'
  }
};

setCustomText(customTextProps);

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const Stack = createNativeStackNavigator();
  
  // const [userDataLoaded, setUserDataLoaded] = useState(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  
  
  //   const latestVersion = await VersionCheck.getLatestVersion();
  // const currentVersion = VersionCheck.getCurrentVersion()

  useEffect(() => {
    
    //checkUpdateNeeded();
    SplashScreen.hide();
  },[]);

  // setCustomTextInput(customTextInputProps);
  

  const checkUpdateNeeded = async () => {
    let updateNeeded = await VersionCheck.needUpdate();
    console.warn(updateNeeded)
    if (updateNeeded.isNeeded) {
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
