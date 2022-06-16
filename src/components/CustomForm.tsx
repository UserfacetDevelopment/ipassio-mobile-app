import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Alert,
  Dimensions,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomDropdown from './CustomDropdown';
import Moment from 'moment';
import 'moment-timezone';
import timezoneList from '../assets/json/timezones.json';
import Helper from '../utils/helperMethods';
// import Add from '../assets/images/Add.svg';
import {
  background,
  background2,
  background5,
  background6,
  brandColor,
  font1,
  font2,
  secondaryColor,
  secondaryColorBorder,
} from '../styles/colors';
import {useSelector} from 'react-redux';
import {userState} from '../reducers/user.slice';
import CustomDateTimePicker from './CustomDateTimePicker';
import CustomImage from './CustomImage';
import Config from '../config/Config';

const width = Dimensions.get('screen').width;

export default function CustomForm({
  index,
  data,
  timeSlots,
  setTimeSlots,
  removeTimeSlot,
  addMoreSlots,
}: any) {
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDateToPass, setSelectedDateToPass] = useState<
    undefined | string
  >(undefined);
  const [dSelected, setDSelected] = useState<Date | undefined>(undefined);
  const [startTimeRangeList, setStartTimeRangeList] = useState<Array<any>>([]);
  const [endTimeRangeList, setEndTimeRangeList] = useState<Array<any>>([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState<any>('');
  const [submitRequested, setSubmitRequested] = useState<boolean>(false);
  const {isLoggedIn, userData, userLocation} = useSelector(userState);
const [timezones,setTimezones] = useState<any>(null)

console.log(index);

  const showDateTimePicker = () => {
    Keyboard.dismiss();
    setIsDateTimePickerVisible(true);
  };

  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false);
  };

  const handleDatePicked = (selectedDate: Date) => {
    setDSelected(selectedDate);
    setSelectedDate(Moment(selectedDate).format('MMM DD YYYY'));
    setSelectedDateToPass(Moment(selectedDate).format('YYYY-MM-DD'));
    hideDateTimePicker();
    timeSlots[index].date = Moment(selectedDate).format('YYYY-MM-DD');
  };

 
  const getTimezone = (data: any) => {
    setSelectedTimezone(data[0]);
    timeSlots[index].timezone = data[0].value;
  };

  console.log(timeSlots);

  useEffect(() => {
    const coeff = 1000 * 60 * 15;
    const date = new Date();
    const rounded = new Date(Math.ceil(date.getTime() / coeff) * coeff);
    const d = date.getDate();
    const month = rounded.getMonth();
    let hour = rounded.getHours();
    let minutes = rounded.getMinutes();
    let dTime = hour * 60 + minutes;
    let interval = 1425;
    let start = 0;
    if (
      dSelected &&
      dSelected.getMonth() === month &&
      dSelected.getDate() === d &&
      dSelected.getFullYear() === rounded.getFullYear()
    ) {
      start = dTime;
    }
    populateTimeIntervalRange(start, interval, 'start');
  }, [selectedDate]);

  //
  useEffect(() => {
    if (data.date !== '') {
      setSelectedDate(data.date);
    }
    if (data.start_time !== '') {
      setStartTime(data.start_time);
    }
    if (data.end_time !== '') {
      setEndTime(data.end_time);
    }
    if (data.timezone !== '') {
      setSelectedTimezone({label: data.timezone, value: data.timezone});
    }
  }, [timeSlots]);

  const populateTimeIntervalRange = (
    min_time: number,
    max_time: number,
    setfor: string = 'start',
  ) => {
    var hours, minutes, ampm;
    let tir = new Array();
    for (var i = min_time; i <= max_time; i += 15) {
      hours = Math.floor(i / 60);
      minutes = i % 60;
      if (minutes < 10) {
        minutes = '0' + minutes; // adding leading zero
      }
      ampm = hours % 24 < 12 ? 'AM' : 'PM';
      hours = hours % 12;
      if (hours === 0) {
        hours = 12;
      }
      if (hours < 10) {
        hours = '0' + hours; // adding leading zero
      }
      tir.push({
        label: hours + ':' + minutes + ' ' + ampm,
        value: hours + ':' + minutes + ' ' + ampm,
      });
    }
    if (setfor === 'end') {
      setEndTimeRangeList(tir);
    } else {
      setStartTimeRangeList(tir);
    }
  };

  useEffect(() => {
    let tz = isLoggedIn
      ? {label: userData.timezone, value: userData.timezone}
      : {label: userLocation.data.timezone, value: userLocation.data.timezone};
      setTimezones(timezoneList);
      setSelectedTimezone(timezoneList.filter((timezone: any) => timezone.value===tz.value)[0]) 
    timeSlots[index].timezone = timeSlots[index].timezone==='' ? isLoggedIn
      ? userData.timezone
      : userLocation.data.timezone
      :timeSlots[index].timezone;
  }, []);

  const changeStartTime = (data: any) => {
    setStartTime(data[0].value);
    setEndTime(null);
    let temp = data[0].value.split(' ');
    let temp1 = temp[0].split(':');
    let time = 0;
    if (temp[1] === 'PM' && temp1[0] != 12) {
      time = (parseInt(temp1[0]) + 12) * 60 + parseInt(temp1[1]) + 15;
    } else {
      if (temp1[0] == 12 && temp[1] === 'AM') {
        temp1[0] = 0;
      }
      time = parseInt(temp1[0]) * 60 + parseInt(temp1[1]) + 15;
    }
    timeSlots[index].start_time = data[0].value;
    populateTimeIntervalRange(time, 1425, 'end');
  };

  const changeEndTime = (data: any) => {
    setEndTime(data[0].value);
    timeSlots[index].end_time = data[0].value;
  };

  return (
    <>
      <View style={styles.formWrapper}>
        <View style={[{flexDirection: 'row', justifyContent: 'space-between'}]}>
          <CustomDateTimePicker
            width={width -64}
            config={{color: background6}}
            showDateTimePicker={showDateTimePicker}
            selectedValue={selectedDate}
            label={'Date*'}
            minimumDate={new Date()}
            isVisible={isDateTimePickerVisible}
            mode="date"
            onConfirm={(selectedDate: any) => {
              handleDatePicked(selectedDate);
            }}
            onCancel={hideDateTimePicker}
          />
          <View style={{width: '40%'}}>
            <View></View>
          </View>
        </View>
        <View style={styles.formRow}>
          <View style={{width: '48%'}}>
            <CustomDropdown
              topLabel={startTime ? 'From' : undefined}
              config={{color: background6}}
              onChangeVal={changeStartTime}
              data={startTimeRangeList}
              selectedIds={[]}
              label={startTime ? startTime : 'From'}
              backTitle={'Select Class Start Time'}
            />
          </View>

          <View style={{width: '48%'}}>
            <CustomDropdown
              topLabel={endTime ? 'To' : undefined}
              config={{color: background6}}
              onChangeVal={changeEndTime}
              data={endTimeRangeList}
              selectedIds={[]}
              label={endTime ? endTime : 'To'}
              backTitle={'Select Class End Time'}
            />
          </View>
        </View>
        {timezones ? <View style={{marginTop:16}}>
          <View>
            <CustomDropdown
            timezone={true}
              topLabel={selectedTimezone ? 'Timezone' : undefined}
              config={{color: background6}}
              onChangeVal={getTimezone}
              data={timezones}
              selectedIds={[]}
              label={selectedTimezone ? selectedTimezone.label : 'Timezone'}
              backTitle={'Select Timezone'}
            />
            {selectedTimezone === undefined && submitRequested ? (
              <Text style={styles.errorText}>Required *</Text>
            ) : null}
          </View> 
        </View>:null}
        {timeSlots.length > 1 ? (
          <TouchableOpacity
            onPress={() => removeTimeSlot(index)}
            style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {index === timeSlots.length - 1 && timeSlots.length < 4 ? (
        <TouchableOpacity
          style={styles.addMoreSlots}
          onPress={() => addMoreSlots(index)}>
          <CustomImage
            height={20}
            width={20}
            uri={`${Config.media_url}add.svg`}
          />
          {/* <Add /> */}
          <Text style={styles.addMoreSlotsText}>Add More Slots</Text>
        </TouchableOpacity>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  scrollView: {
    marginTop: 134,
  },
  safecontainer: {
    padding: 16,
  },
  input: {
    color: 'rgb(44, 54, 65)',
    margin: 0,
    fontSize: 14,
    backgroundColor: 'rgb(255, 255, 255)',
    fontFamily: Helper.switchFont('medium'),
  },
  inputLabel: {
    fontFamily: Helper.switchFont('medium'),
    fontSize: 14,
    color: 'rgb(44, 54, 65)',
  },
  mobileNumber: {
    flexDirection: 'row',
    justifyContent: 'center',
    color: 'rgb(44, 54, 65)',
    borderLeftColor: '#CDD6E0',
    borderLeftWidth: 1,
    margin: 3,
    fontSize: 14,

    backgroundColor: 'rgb(255, 255, 255)',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    fontFamily: Helper.switchFont('medium'),
  },
  submit: {
    width: '50%',
    backgroundColor: brandColor,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 15,
    marginLeft: 5,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
  formGroup: {
    marginVertical: 5,
  },
  color_primary: {
    color: '#32363a',
  },
  countryCode: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    color: 'rgb(44, 54, 65)',
    marginTop: 5,
    fontSize: 14,
    borderRadius: 8,

    backgroundColor: 'rgb(255, 255, 255)',
    fontFamily: Helper.switchFont('medium'),
    borderWidth: 0.5,
    borderColor: font2, //'#CDD6E0',
  },
  phone: {
    width: '100%',
  },
  cancel: {
    borderWidth: 1,
    borderColor: 'rgb(44, 54, 65)',
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 15,
    marginRight: 5,
  },
  courseImage: {
    height: 88,
    width: 88,
    resizeMode: 'cover',
    borderRadius: 12,
  },

  cancelText: {
    color: 'rgb(44, 54, 65)',
    fontSize: 16,
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 36,
    color: '#32363a',
    marginTop: 20,
  },
  errorText: {
    color: 'rgb(255,0,0)',
    fontFamily: Helper.switchFont('regular'),
    fontSize: 12,
    marginBottom: 5,
  },
  readMore: {
    color: secondaryColor,
  },
  reasonForMeeting: {
    fontSize: 16,
    marginTop: 8,
    color: font2,
    lineHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  time_slots: {
    fontSize: 16,
    color: font1,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 6,
  },
  inputText: {
    color: font2,
    margin: 0,
    fontSize: 14,
    padding: 20,
    backgroundColor: 'transparent',
    borderRadius: 5,
    borderWidth: 0.7,
    borderColor: font2,
    fontFamily: Helper.switchFont('regular'),
  },
  formWrapper: {
    backgroundColor: background6,
    borderRadius: 15,
    padding: 16,
    marginBottom: 8,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  removeButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  removeButtonText: {
    color: brandColor,
    fontSize: 14,
    fontFamily: Helper.switchFont('medium'),
    fontWeight: '500',
  },
  addMoreSlotsText: {
    color: secondaryColor,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
    fontFamily: Helper.switchFont('semibold'),
  },
  addMoreSlots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: secondaryColorBorder,
    borderRadius: 58,
    padding: 7,
    width: '48%',
    // marginTop: 8,
  },
});
