import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {dropdownBorder, font1, font2} from '../styles/colors';
import Helper from '../utils/helperMethods';
// import Calender from '../assets/images/calender.svg';
import CustomImage from './CustomImage';
import Config from '../config/Config';

interface CustomDateTimePickerProps {
  selectedValue: any;
  showDateTimePicker: any;
  minimumDate?: any;
  maximumDate?: any;
  mode: any;
  isVisible: boolean;
  onConfirm: any;
  onCancel: any;
  label: string;
  width:any;
  config?:any;
}

const width = Dimensions.get('screen').width;

export default function CustomDateTimePicker({
  minimumDate,
  maximumDate,
  selectedValue,
  showDateTimePicker,
  onConfirm,
  onCancel,
  isVisible,
  label,
  width,
  config
}: CustomDateTimePickerProps) {
  return (
    <View>
      <TouchableOpacity
        style={[styles.input, {width:width}]}
        onPress={() => {
          showDateTimePicker();
        }}>
        <Text
          style={{
            color: selectedValue ? font1 : font2,
            fontSize: 14,
            fontFamily: Helper.switchFont('medium'),
          }}>
          {selectedValue ? selectedValue : label}
        </Text>

        {selectedValue ? (
          <Text
            style={[styles.labelText, {backgroundColor: config? config.color : 'transparent'}]}>
            {label}
          </Text>
        ) : null}
        <View>
          <CustomImage height={24} width={24} uri={`${Config.media_url}calender.svg`}/>
          {/* <Calender /> */}
        </View>
        <DateTimePickerModal
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          isVisible={isVisible}
          mode="date"
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  input: {
    width: width-32,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: dropdownBorder,
    borderRadius: 8,
  },
  labelText:{
    position: 'absolute',
    top: -8,
    left: 7,
    paddingHorizontal: 4,
    backgroundColor: '#fff',
    fontSize: 12,
    color: font2,
  }
});
