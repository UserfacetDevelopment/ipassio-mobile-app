import {Platform, Alert, PermissionsAndroid, Linking} from 'react-native';
import country_region_data from './country_region.json';

export default class Config {
  static env = 'prod';
  static version = Platform.OS === 'ios' ? '2.0.4' : '2.0.2';
  static build_number = Platform.OS === 'ios' ? 14 : 28;
  // static version = Platform.OS === "ios" ? "1.0.13" : "1.0.28";
  // static build_number = Platform.OS === "ios" ? 14 : 28;
  static headerHeight= Platform.OS === 'android' ? 86 : 90;
  static FrontendBaseURL = 'https://ipassio.com/student-signup';
  static GOOGLE_ID = '938249328963-o6gf6eao638mh7h1kl1p4sj1qd4jfrjd.apps.googleusercontent.com'
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
  static api_urls = {
    login: 'account/login?format=json',
    social_login: 'account/google-login?format=json',
    forgot_password: 'account/forgot-password-otp?format=json',
    logout: 'account/logout?format=json',
    chat_users: 'chat/chat-userlist?format=json&call_by=URL',
    chat_messages: 'chat/chat-detail?ur_tk=',
    user_location: 'https://ipinfo.io/?token=ad519179ea355a',
    auth_token: 'get-authorization?_format=json',
    fbase_token: 'fbase-token?_format=json',
    user_profile: 'user?_format=json',
    check_username: 'check-username?_format=json',
    reset_password: 'account/verify-account?format=json',
    resend_otp: 'account/send-otp?format=json',

    student: {
      enrolled_courses_dashboard: 'courses/course-list-detail?format=json',
      enrolled_courses: 'attendance/enrolled-course-student?format=json',
      enrolled_courseList: 'courses/course-list-detail?format=json',
      generate_certificate: 'courses/request-certificate?format=json',
      add_session: 'attendance/course-class?format=json',
      add_to_cart: 'checkoutcourses/refil-course?course_token=',
      add_to_cart_update: 'checkoutcourses/checkout-course?format=json',
      apply_coupon: 'coupon/apply-coupon?format=json',
      payment_summary: 'checkoutcourses/payment-summary?format=json',
      my_cart: 'api/my-cart?_format=json',
      cart_to_view: 'api/cart-to-review?_format=json',
    },
    teacher: {
      created_courses: 'courses/?format=json&user_token=',
      enrolled_students: 'checkoutcourses/enrolled-student-list?format=json',
      withdraw_request: 'withdrawal/withdrawlist?format=json',
      enrolled_course_studentList:
        'attendance/enrolled-course-student?format=json',
      add_session: 'attendance/course-class?format=json',
    },
    admin: {
      list_users: '',
    },
    mark_attendance: 'attendance/',
  };
  static messages = {
    forgot_password_msg: 'We have sent further instructions to your email.',
    common_error: 'Something went wrong! Please try again!',
    withdraw_warn: 'Are you sure you want to proceed?',
    coupon_empty: 'Please enter coupon code.',
    coupon_remove_warn: 'Are you sure you want to remove coupon?',
    common_error_missing_fields: 'Please fill up mandatory fields.',
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

  static country_listing = country_region_data;
}
