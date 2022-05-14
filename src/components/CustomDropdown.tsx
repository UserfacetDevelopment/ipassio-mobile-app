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
} from 'react-native';
import Modal from 'react-native-modal';
import {background3, dropdownBorder, font1, font2, lineColor} from '../styles/colors';
import Helper from '../utils/helperMethods';
// @ts-ignore
import Close from '../assets/images/close.svg';
// @ts-ignore
import Search from '../assets/images/search.svg';
import { scheduledDataSuccess } from '../reducers/schedule.slice';
import SheetCss from '../styles/style';
// @ts-ignore
import Dropdown from '../assets/images/custom-dropdown.svg';

interface CustomDropdownProps {
  data: any;
  selectedIds?: Array<string>;
  topLabel?: string;
  onChangeVal: any;
  label: string;
  backTitle: string;
  index?:number;
  config?: any;
  customIcon?:any;
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
  customIcon
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
      val.value.toLowerCase().includes(formattedQuery),
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
      <TouchableOpacity
        style={{
          alignItems: 'flex-start',
          borderBottomWidth: 0.5,
          borderColor: lineColor,
          minHeight: 60,
          justifyContent: 'center',
          paddingLeft: 20,
          paddingRight: 20,
        }}
        onPress={() => selectVal(dt)}>
        <Text
          style={
            selectedData.indexOf(dt) == -1
              ? styles.option_item
              : styles.option_item_selected
          }>
          {dt.value}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <TouchableOpacity onPress={() => toggleModal()}>
        <View style={styles.container}>
          <Text
            style={[
              {
                position: 'absolute',
                top: -7,
                fontSize: 12,
                marginHorizontal: 2,
                backgroundColor: '#fff',
                left: 7,
                // color:
                //   config && config.color
                //     ? config.color
                //     : font2,
                color: font2,
              },
            ]}>
            {topLabel ? topLabel : null}
          </Text>
          <Text
            style={[
              styles.label,
              {
                // color:
                //   config && config.color
                //     ? config.color
                //     : "rgb(44, 54, 65)",
                color: font1,
              },
            ]}>
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
            {customIcon ? customIcon : <Dropdown/>}
          </View>
        </View>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
            <View style={{backgroundColor:'rgba(0,0,0,0.3)'}}>
          <View
            style={{
              // flexDirection:'row',
              backgroundColor: '#fff',
              borderRadius: 15,
              width: '100%',
              height: '90%',
            }}>
              
            <View
              style={{
                // backgroundColor: "rgb(232, 67, 53)",
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
              }}>
              <View style={{flex: 1, marginTop: 0, marginLeft: 12}}>
                <Text style={styles.innerHeaderTitle}>{backTitle}</Text>
              </View>
              <Pressable onPress={() => toggleModal()}>
                <Close />
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
            <View
              style={
                styles.inputWrapper
              }>
                
              <Search />
              <TextInput
                autoFocus={true}
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
            <View style={SheetCss.styles.lineStyleLight}/>
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
          </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    borderColor: dropdownBorder,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: Helper.switchFont('regular'),
    width: '90%',
  },
  option_item: {
    fontSize: 14,
    color: 'rgb(44, 54, 65)',
    fontFamily: Helper.switchFont('regular'),
    padding: 10,
  },
  option_item_selected: {
    fontSize: 14,
    // color: "#aaa",
    color: 'rgb(44, 54, 65)',
    fontFamily: Helper.switchFont('medium'),
    padding: 10,
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
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Helper.switchFont('medium'),
  },

  inputWrapper: {
    marginBottom:16,
    marginHorizontal: 16,
    paddingTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
     paddingHorizontal: 16,
    justifyContent: 'center',
    marginTop: 60,
    backgroundColor: background3,
    borderRadius: 8,
  },
  input: {
    color: font2,

    fontSize: 14,
    paddingHorizontal: 20,

    // borderWidth: 1,
    // borderColor: ,

    fontFamily: Helper.switchFont('regular'),
    height: 50,
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
});