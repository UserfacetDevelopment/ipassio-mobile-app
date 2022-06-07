import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {RadioButton} from 'react-native-paper';
import moment from 'moment';
import 'moment-timezone';
import Config from '../config/Config';
import CustomImage from './CustomImage';
import StyleCSS from '../styles/style';
import {useSelector} from 'react-redux';
import {userState} from '../reducers/user.slice';
import {useAppDispatch} from '../app/store';
import {deleteSession} from '../reducers/schedule.slice';

interface DeletePopupInterface {
  data: any;
  // checked: 'all' | 'once';
  // setChecked: any;
  setShowDeletePopup: any;
  navigation: any;
  onRefresh: any;
}

export default function DeleteClassPopup({
  data,
  // checked,
  // setChecked,
  setShowDeletePopup,
  navigation,
  onRefresh,
}: DeletePopupInterface) {
  const {userData} = useSelector(userState);
  const [checked, setChecked] = useState<'once'|'all'>('once');
  const dispatch = useAppDispatch();

  const deleteClass = () => {

      setShowDeletePopup(false);

    let deleteData;
    if (checked === 'once') {
      deleteData = {
        id: data.id,
      };
    } else if (checked === 'all') {
      deleteData = {
        delete_all: 'all',
        recurring_class: data.recurring_class,
      };
    }

    const finalData = {
      data: deleteData,
      userToken: userData.token,
    };
    dispatch(deleteSession(finalData))
      .unwrap()
      .then(response => {
        console.log(response);
        if (response.data.status === 'success') {
          onRefresh();
          navigation.navigate('ActionStatus', {
            messageStatus: 'success',
            // messageTitle: 'Congratulations!',
            messageDesc: response.data.error_message.message,
            timeOut: 7000,
            backRoute: 'Schedules',
          });
        } else if (response.data.status === 'failure') {
          navigation.navigate('ActionStatus', {
            messageStatus: 'failure',
            // messageTitle: 'Sorry!',
            messageDesc: response.data.error_message.message,
            timeOut: 7000,
            backRoute: 'Schedules',
          });
        }
      })
      .catch(() => {});
  };

  console.log(data)
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
      }}>
      <View>
        <TouchableOpacity
          onPress={() => setShowDeletePopup(false)}
          hitSlop={{top:20, bottom:20, left:20, right:20}}
          style={{alignSelf: 'flex-end'}}>
          <CustomImage
            height={24}
            width={24}
            uri={`${Config.media_url}close.svg`}
          />
        </TouchableOpacity>
        <Text style={[StyleCSS.styles.contentText, StyleCSS.styles.font16, StyleCSS.styles.fw600 ]}>Are you sure you want to delete this class?</Text>
        
        <View style={StyleCSS.styles.fdrCenter}>
            <TouchableOpacity style={StyleCSS.styles.fdrCenter} onPress={() => setChecked('once')}>
          <RadioButton.Android
            value="first"
            status={checked === 'once' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('once')}
          />
          <Text style={StyleCSS.styles.contentText}>Delete this class</Text>
          </TouchableOpacity>
        </View>
        <Text style={StyleCSS.styles.labelText}>
          {moment.tz(data.start_time, userData.timezone).format('ddd, MMM D, YYYY hh:mm A', )} -{' '}
          {moment.tz(data.end_time, userData.timezone).format('hh:mm A')} | {userData.timezone}
        </Text>
        {data.recurring_count > 1 ? (
          <View style={StyleCSS.styles.fdrCenter}>
              <TouchableOpacity style={StyleCSS.styles.fdrCenter} onPress={() => setChecked('all')}>
            <RadioButton.Android
              value="first"
              status={checked === 'all' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('all')}
            />
            <Text style={StyleCSS.styles.contentText}>Delete all recurring classes</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={[StyleCSS.styles.fdrCenter, {marginTop: 16}]}>
          <TouchableOpacity
            onPress={() => {
              setShowDeletePopup(false);
            }}
            style={StyleCSS.styles.cancelButton}>
            <Text style={StyleCSS.styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deleteClass}
            style={StyleCSS.styles.submitButton}>
            <Text style={StyleCSS.styles.submitButtonText}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
