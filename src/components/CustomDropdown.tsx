import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  TextInput,
  Modal,
} from 'react-native';
// import Modal from 'react-native-modal';
import {
  background3,
  brandColor,
  dropdownBorder,
  font1,
  font2,
  lineColor,
} from '../styles/colors';
import Helper from '../utils/helperMethods';

// import Close from '../assets/images/close.svg';

// import Search from '../assets/images/search.svg';
import {scheduledDataSuccess} from '../reducers/schedule.slice';
import SheetCss from '../styles/style';

// import Dropdown from '../assets/images/custom-dropdown.svg';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import CustomImage from './CustomImage';
import Config from '../config/Config';

interface CustomDropdownProps {
  data: any;
  selectedIds?: Array<string>;
  topLabel?: string;
  onChangeVal: any;
  label: string;
  backTitle: string;
  index?: number;
  config?: any;
  customIcon?: any;
  timezone?: boolean
}

export default function CustomDropdown({
  data,
  selectedIds,
  topLabel,
  onChangeVal,
  label,
  backTitle,
  config,
  index,
  customIcon,
  timezone
}: CustomDropdownProps) {
  const [query, setQuery] = useState('');
  const [fullData, setFullData] = useState(data);
  const [fullDataOrg, setFullDataOrg] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<Array<any>>([]);

  useEffect(() => {
    setFullData(data);
    setFullDataOrg(data);
  }, [data]);

  useEffect(() => {
    if (selectedData.length !== 0) {
      onChangeVal(selectedData, index);
    }
  }, [selectedData]);

  const handleSearch = (text: string) => {
    const formattedQuery = text.toLowerCase();
    let filteredData = fullDataOrg.filter((val: any) =>
   timezone ?
    val.label.toLowerCase().includes(formattedQuery)
  :
    val.value.toLowerCase().includes(formattedQuery)
   
      
    );
    setFullData(filteredData);
    setQuery(text);
  };

  const clearSearchText = () => {
    setFullData(fullDataOrg);
    setQuery('');
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setQuery('');
    setFullData(fullDataOrg);
  };

  //Select single val
  const selectVal = (data: any) => {
    setFullData(fullDataOrg);
    setQuery('');
    setSelectedData([data]);
    toggleModal();
  };

  const loadItems = (dt: any, index: number) => {
    return (
      <TouchableOpacity style={styles.listItem} onPress={() => selectVal(dt)}>
        <Text
          style={
            selectedData.indexOf(dt) == -1
              ? styles.option_item
              : styles.option_item_selected
          }>
          {timezone ? dt.label : dt.value}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <TouchableOpacity onPress={() => toggleModal()}>
        <View style={styles.container}>
          {topLabel ? (
            <Text style={[styles.topLabel, {backgroundColor: config.color}]}>
              {topLabel}
            </Text>
          ) : null}
          <Text
            style={[styles.label,{color: topLabel ? font1 : font2,}]}>
            {label}
          </Text>
          <View style={{width: '10%', alignItems: 'flex-end'}}>
            {/* <Image
              source={require('@images/down_arrow.png')}
              style={{
                width: 16,
                height: 9,
                alignItems: 'center',
                alignSelf: 'flex-end',
                marginTop: 5,
              }}
            /> */}
            {customIcon ? (
              customIcon
            ) : (
              <CustomImage uri={`${Config.media_url}custom-dropdown.svg`} />
            )}
          </View>
        </View>
      </TouchableOpacity>

      <Modal transparent={true} visible={isModalVisible} animationType='fade' statusBarTranslucent={true}>
        <TouchableOpacity
          // activeOpacity={1}
          onPressOut={() => setIsModalVisible(false)}
          style={styles.modalBackground}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={{
              backgroundColor: '#fff',
              borderRadius: 15,
              height: '70%',
            }}>
            <View
              style={styles.modalHeader}>
              <View style={styles.backTitleWrapper}>
                <Text style={styles.innerHeaderTitle}>{backTitle}</Text>
              </View>
              <Pressable onPress={() => toggleModal()}>
                <CustomImage
                  height={24}
                  width={24}
                  uri={`${Config.media_url}close.svg`}
                />

                {/* <Image
                      source={require("@images/left_arrow.png")}
                      style={{
                        width: 23,
                        height: 18,
                        alignItems: "center",
                      }}
                    /> */}
              </Pressable>
            </View>
            <View style={styles.inputWrapper}>
              <CustomImage
                height={24}
                width={24}
                uri={`${Config.media_url}search.svg`}
              />

              {/* <Search /> */}
              <TextInput
                // autoFocus={true}
                placeholderTextColor={font2}
                style={styles.input}
                value={query}
                onChangeText={handleSearch}
                editable={true}
                selectTextOnFocus={false}
                placeholder="Search"
              />
              {/* <TouchableOpacity
                style={styles.closeButtonParent}
                onPress={() => clearSearchText()}>
                <Image
                  style={styles.closeButton}
                  source={require('@images/close_image.png')}
                />
              </TouchableOpacity> */}
            </View>
            <View style={SheetCss.styles.lineStyleLight} />
            <FlatList
              style={{
                flexGrow: 0,
              }}
              initialNumToRender={20}
              keyExtractor={(item, index) => index.toString()}
              // data={this.props.data}
              data={fullData}
              //extraData={this.state}
              renderItem={({item, index}) => loadItems(item, index)}
            />
            {fullData.length == 0 ? (
              <View style={{alignItems: 'center'}}>
                <Text style={styles.option_item}>No items</Text>
              </View>
            ) : null}
            {/* <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgb(194, 194, 194)",
                    minHeight: 60,
                    paddingLeft: 20,
                    paddingRight: 20,
                  }}
                  underlayColor="rgb(194, 194, 194)"
                  onPress={() => this._toggleModal()}
                >
                  <Text style={styles.option_action_item}>Cancel</Text>
                </TouchableOpacity> */}
          </TouchableOpacity>
        </TouchableOpacity>
        {/* </View> */}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingVertical:12,  by ashwath
    paddingVertical:14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: dropdownBorder,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,

    fontFamily: Helper.switchFont('regular'),
    flex: 1,
  },
  option_item: {
    fontSize: 14,
    color: font1,
    fontWeight: '500',
    fontFamily: Helper.switchFont('medium'),
    paddingVertical: 16,
    lineHeight: 20,
  },
  option_item_selected: {
    fontSize: 14,
    color: brandColor,
    fontWeight: '500',
    fontFamily: Helper.switchFont('medium'),
    paddingVertical: 16,
    lineHeight: 20,
  },
  option_action_item: {
    fontSize: 14,
    color: 'rgb(44, 54, 65)',
    fontFamily: Helper.switchFont('medium'),
    borderBottomWidth: 0.5,
    borderColor: 'rgb(194, 194, 194)',
  },
  innerHeaderTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Helper.switchFont('bold'),
  },

  inputWrapper: {
    marginBottom: 16,
    marginHorizontal: 16,
    paddingTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    justifyContent: 'center',
    marginTop: 56,
    backgroundColor: background3,
    borderRadius: 8,
  },
  input: {
    color: font2,
    fontSize: 14,
    paddingHorizontal: 12,
    fontWeight: '400',
    fontFamily: Helper.switchFont('regular'),
    height: 48,
    width: '90%',
  },
  closeButton: {
    height: 25,
    width: 25,
    opacity: 0.5,
  },
  closeButtonParent: {
    // justifyContent:'flex-end',
    // alignSelf:'flex-end',
    alignItems: 'center',
    // marginRight: 5,
    // position: "absolute",
    // top: 11,
    // right: 30,
  },
  listItem: {
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: lineColor,
    minHeight: 60,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  topLabel: {
    position: 'absolute',
    top: -14,
    fontSize: 12,
    padding: 4,
    left: 7,
    color: font2,
  },
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 16,
  },
  backTitleWrapper: {flex: 1, marginTop: 0},
  modalHeader:{
    padding: 16,
    flexDirection: 'row',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    alignContent: 'center',
    zIndex: 999,
  }
});
