import {Platform, Alert, PermissionsAndroid, Linking} from 'react-native';

export default class Config {
  static env = 'dev';
  static version = Platform.OS === 'ios' ? '2.0.4' : '2.0.2';
  static build_number = Platform.OS === 'ios' ? 14 : 28;
 
  static headerHeight= Platform.OS === 'android' ? 86 : 90;

  static FrontendBaseURL = 'https://ipassio.com/student-signup';
static FrontendURL = "https://ipassio.com"
static videoURL="/video/";

  static GOOGLE_ID = "484842528758-73tvvgoq71j0jfq05q2p3rgej77ummt6.apps.googleusercontent.com"; //releaese
  //484842528758-59aa3rc1ft6jmkkf3vvceoa292tg2d7t.apps.googleusercontent.com" // debug
  //"484842528758-hic9kjju8une4iaestoahv22056f7001.apps.googleusercontent.com"
  //'938249328963-o6gf6eao638mh7h1kl1p4sj1qd4jfrjd.apps.googleusercontent.com'
    //'142571675590-ujj8t4901kejoiddm2a1qop3ivekfisn.apps.googleusercontent.com';
  static BaseURL =
    Config.env == 'prod'
      ? 'https://safeapis.ipassio.com/api'
      : 'https://neoapis.ipassio.com/api';
  static NodeBaseURL =
    Config.env == 'prod'
      ? 'https://node.ipassio.com/'
      : 'https://neonode.ipassio.com/';
  static storeLink =
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/us/app/ipassio-learn-hobbies-online/id1449104526'
      : 'https://play.google.com/store/apps/details?id=com.ipassio.apps';

  static media_url = 'https://media.ipassio.com/mobile_app/';
  
  static messages = {
    forgot_password_msg: 'We have sent further instructions to your email.',
    common_error: 'Something went wrong! Please try again!',
    withdraw_warn: 'Are you sure you want to proceed?',
    coupon_empty: 'Please enter coupon code.',
    coupon_remove_warn: 'Are you sure you want to remove coupon?',
    common_error_missing_fields: 'Fill in all the required fields. ',
    no_certificate: 'Certificate is not available!',
    download_error: 'Download failed. Please try again later!',
    denied_permission: 'Download failed as you denied permission.',
    login_not_allowed:
      'You are not allowed to Log In to the app. Please use ipassio website.',
    coupon_validation: 'Please enter a valid coupon code.',
    taking_long: 'It is taking longer than expected.',
    connection_error_title: 'Connection Error!',
    payment_status_connection_error:
      "We are unable to connect to the server, but don't worry you can check the status later!",
    checking_payment_status_title: 'Checking Payment Status.',
    payment_status_message:
      'Please wait while we are checking your payment status.',
    refillPopupTitle: 'Refill',
    refillPopupMessage:
      'All your purchased classes are now consumed! To maintain the continuity of your learning, would you like to refill / buy more classes now?',
    different_user_warn:
      'It seems the link you clicked is invalid for the user who logged in the app',
    update_title: 'New update is available!',
    update_text:
      'Update <NUMBER> is available to download. \nDownloading this update you will get the latest features, improvements and bug fixes of ipassio apps.',
    ps_reset_invalid_link:
      'This password reset link cannot be used as you are already logged in. Please logout and try again!',
    //"page_not_found" : "The link you clicked is not available in app. Would you like to open it in web?"
  };

  static chat_file_types_allowed = 'jpg, jpeg, gif, png'; //txt, doc, xls, pdf, ppt, pps, odt, ods, odp, docx, pptx, xlsx, mp3, mp4, ogg, avi, mkv
}
