import React from 'react';
import {View, ScrollView} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {userState} from '../reducers/user.slice';
import { useNavigation } from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootParamList } from './Navigators';
import { useAppDispatch } from '../app/store';
import { logoutUser } from '../reducers/user.slice';

const CustomDrawerContent = (props: any) => {

  const {userData, isLoggedIn} = useSelector(userState);
const dispatch = useAppDispatch();

  const doLogout=async()=>{
    await AsyncStorage.removeItem('USERDATA');
    await AsyncStorage.removeItem('USERDEVICETOKEN');
    await AsyncStorage.removeItem('USER_NOT_FIRST');
    dispatch(logoutUser());
    // navigation.navigate('Teacher');
  }

const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  return (
    <DrawerContentScrollView {...props}>
     
      <DrawerItemList {...props} />
      
      {isLoggedIn ? (
        <DrawerItem label="Logout" onPress={() => doLogout()} />
      ) : null}
    </DrawerContentScrollView>
  );

  // return (<View>
  //   <ScrollView>

  //     <DrawerItems
  //       {...props}
  //       onItemPress = {
  //         ( route, focused ) =>
  //         {
  //           props.onItemPress({ route, focused })
  //         }
  //         }
  //     />
  //     </ScrollView>
  //   </View>)
};

export default CustomDrawerContent;
