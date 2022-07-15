import {Platform, Alert, PermissionsAndroid, Linking} from 'react-native';
import Intercom, {Visibility} from '@intercom/intercom-react-native'
import config from '../config/Config'

export default class Helper{
    static formatImageUrls = (url : string) => {
        if (!url) return '';
        return config.BaseURL + url.substring(url.indexOf('/sites') + 1);
      };
    
      static strCapitalize = (str: string) => {
        if(str!==undefined){
          str = str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
          });
          
        }
        return str;
      };
    
      static pageNotFound = (url: string) => {
        Linking.openURL(url);
      };
    
      static switchFont = (type: 'medium'| 'light' | 'regular'|'semibold'| 'bold') => {
        
        switch (type) {
          case 'medium':
            return 'PlusJakartaSans-Medium';
            break;
    
          case 'light':
            return 'PlusJakartaSans-Light';
            break;
    
          case 'regular':
            // return Platform.OS === 'ios' ? undefined : 'Roboto-Regular';
            return 'PlusJakartaSans-Regular'
            break;
          case 'semibold':
              return 'PlusJakartaSans-SemiBold'
              break;
              case 'semibold':
                return 'PlusJakartaSans-Bold'
                break;
          default:
            return 'PlusJakartaSans-SemiBold';

            break;
        }
      };
    
      static downloadFile = (url :string) => {
        if (url) {
          Alert.alert(
            'Are you sure you want to download?',
            'Download File',
            [
              {text: 'Download', onPress: () => Helper.doDownload(url)},
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
        }
      };
    
      static getUrlParams = (url :string) => {
        if (url.includes('user/login')) {
          url = url.substring(url.indexOf('destination=') + 1);
        }
        //alert(url + " " + url.indexOf("destination="));
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
          params = {},
          match;
        while ((match = regex.exec(url))) {
          params[match[1]] = match[2];
        }
        return params;
      };
    
      static async doDownload(url :string) {
        // const { config, fs } = RNFetchBlob;
        // let PictureDir = fs.dirs.PictureDir;
        // let date = new Date();
        // let options = {
        //   fileCache: true,
        //   addAndroidDownloads: {
        //     //Related to the Android only
        //     useDownloadManager: true,
        //     notification: true,
        //     path:
        //       PictureDir +
        //       "/image_" +
        //       Math.floor(date.getTime() + date.getSeconds() / 2),
        //     description: "Image",
        //   },
        // };
        // config(options)
        //   .fetch("GET", url)
        //   .then((res) => {
        //     //Showing alert after successful downloading
        //     console.log("res -> ", JSON.stringify(res));
        //     alert("Image Downloaded Successfully.");
        //   });
      }
    
    
      static removeEmptyTags = HTMLContent => {
        let removedNBSP = HTMLContent;
        removedNBSP = removedNBSP
          ? removedNBSP.replace(/&nbsp;/gi, ' ')
          : removedNBSP;
        removedNBSP = removedNBSP
          ? removedNBSP.replace(/<[^\/][^>]*>\s*(<[^>]*>)*<\/[^>]*>/gs, '')
          : removedNBSP;
        return removedNBSP;
      };

      static extention(filename) {
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
      }
    
      static checkAppVersion = (
        latest_build_number,
        update_type,
        version_number,
      ) => {
        if (latest_build_number > config.build_number) {
          let updConf = [];
          if (update_type == '1') {
            updConf = [
              {
                text: 'Update',
                onPress: () => {
                  Helper.checkAppVersion(
                    latest_build_number,
                    update_type,
                    version_number,
                  );
                  Linking.openURL(config.storeLink);
                },
              },
            ];
          } else {
            updConf = [
              {
                text: 'Ask me later',
                onPress: () => console.log('Ask me later pressed'),
              },
              {
                text: 'Update',
                onPress: () => {
                  Linking.openURL(config.storeLink);
                },
              },
            ];
          }
    
          Alert.alert(
            config.messages.update_text.replace('<NUMBER>', version_number),
            config.messages.update_title,
            updConf,
            {cancelable: false},
          );
        }
      };
    
      static validatePasswordFormat = (password :  string) => {
        if (password.length < 8) return false;
        if (password.length > 15) return false;
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) return false;
        return true;
      };
    
      static removeItemFromArray = (arr, val) => {
        var index = arr.indexOf(val);
        if (index !== -1) {
          arr.splice(index, 1);
          return arr;
        }
    
        return arr;
      };
    
      static randomString = length => {
        var result = '';
        var characters =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      };
    
      // removePeople(e) {
      //   var array = [...this.state.people]; // make a separate copy of the array
      //   var index = array.indexOf(e.target.value);
      //   if (index !== -1) {
      //     array.splice(index, 1);
      //     this.setState({people: array});
      //   }
      // }
    
      static getRandomNumber = max => {
        return Math.floor(Math.random() * Math.floor(max));
      };

      static enableIntercom = () =>{
        Intercom.setLauncherVisibility(Visibility.VISIBLE);
      }
      static disableIntercom = () => {
        Intercom.setLauncherVisibility(Visibility.GONE);
      }
}