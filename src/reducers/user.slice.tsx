import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import config from '../config/Config';
import ApiGateway from '../config/apiGateway';
import {RootState} from '../app/store';
import {GoogleLogin, Login} from '../screens/Login';
import {ForgotPassswordInterface} from '../screens/Login/ForgotPassword';
import {ResetPasswordInterface} from '../screens/Login/ResetPassword';
import { RegisterDataInterface } from '../screens/SignUp';
import NoData from '../components/NoData';
import { CompleteSignupInterface } from '../screens/SignUp/UserDetail';


const initialState: any = {
  userData: [],
  isLoggedIn: false,
  userLocation: {},
  locationStatus: null,
  fcmToken: null,
  navigation:null,
  loginRedirectedFrom : null,
  signupFrom: null,
};
export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<any>) => {
      state.userData = action.payload;
      state.isLoggedIn = true;
    },
    logoutUser: state => {
      state.userData = [];
      state.isLoggedIn = false;
    },
    setFCMToken: (state, action: PayloadAction<any>)=>{
      state.fcmToken = action.payload;
    },
    setNavigation : (state, action:PayloadAction<any>) =>{
      state.navigation = action.payload;
    },
    setLoginRedirectedFrom : (state, action:PayloadAction<any>) =>{
      state.loginRedirectedFrom = action.payload;
    },
    setUserLocation : (state, action:PayloadAction<any>)=>{
      state.userLocation = action.payload;
    },
    setSignupFrom : (state, action:PayloadAction<any>) =>{
      state.signupFrom = action.payload;
    },
  },
  // extraReducers: builder => {
  //   builder.addCase(getUserLocation.pending, state => {
  //     state.locationStatus = 'loading';
  //   }),
  //     builder.addCase(
  //       getUserLocation.fulfilled,
  //       (state, action: PayloadAction<any>) => {
  //         state.userLocation = action.payload;
  //         state.locationStatus = 'success';
  //       },
  //     ),
  //     builder.addCase(
  //       getUserLocation.rejected,
  //       (state, action: PayloadAction<any>) => {
  //         state.locationStatus = 'failed';
  //         state.userLocation = action.payload;
  //       },
  //     );
  // },
});

export const {loginSuccess, logoutUser, setFCMToken, setNavigation, setLoginRedirectedFrom, setUserLocation, setSignupFrom} = userSlice.actions;

export const userState = (state: RootState) => state.user;

export default userSlice.reducer;

export const doLogin = createAsyncThunk('doLogin', async (data: Login) => {
  const response = await ApiGateway.post('account/login?format=json', data);
  return response.data; // (this is the actual data which will be returned as a payload).
});



export const socialLogin = createAsyncThunk(
  'doSocialLogin',
  async (data: GoogleLogin) => {
    const response = await ApiGateway.post('account/google-login?format=json', data);

    return response; // (this is the actual data which will be returned as a payload).
  },
);

export const doForgetPassword = createAsyncThunk(
  'forgetPwd',
  async (data: ForgotPassswordInterface) => {
    const response = await ApiGateway.post(
      'account/forgot-password-otp?format=json',
      data,
    );
    return response.data; // (this is the actual data which will be returned as a payload).
  },
);

export const resetPassword = createAsyncThunk(
  'resetPwd',
  async (data: ResetPasswordInterface) => {
    const response = await ApiGateway.post(
      'account/verify-account?format=json',
      data,
    );
    return response.data; // (this is the actual data which will be returned as a payload).
  },
);

export const resendOtp = createAsyncThunk('resendOTP', async data => {
  const response = await ApiGateway.post('account/send-otp?format=json', data);
  return response.data; // (this is the actual data which will be returned as a payload).
});

export const masquerade = createAsyncThunk(
  'user/masquerade',
  async (data: any) => {
    const response = await ApiGateway.post(
      'api/masquerade?_format=json',
      {uid: 1},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + data.authToken,
          'X-CSRF-Token': data.csrfToken,
        },
      },
    );
    return response.data; // (this is the actual data which will be returned as a payload).
  },
);

export const getSession = createAsyncThunk('user/getSession', async () => {
  const response = await ApiGateway.get('rest/session/token', false, {
    headers: {
      'Content-Type': 'application/json',
      //Authorization: authToken
    },
  });
  return response;
});

export const getStaticPage = createAsyncThunk('user/getStaticPage', 
async(pageKey: string)=>{
  const response =  await ApiGateway.get("site-config/static-page?key=" + pageKey)
  return response.data;
})

export const register  =createAsyncThunk('user/register',
async(data: RegisterDataInterface) => {
  const response = await ApiGateway.post('account/?format=json', data)
  return response;
})

export const otpVerifyAccount = createAsyncThunk('user/otpVerifyAccount',
async(data : any)=>{
  let response = ApiGateway.post('account/verify-account?format=json', data);
  return response;
})


export const completeSignUp = createAsyncThunk('user/completeSignUp',
async(data : CompleteSignupInterface)=>{
  let response = ApiGateway.patch('account/?format=json', data.data,{
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + data.userToken,
    },
  });
  return response;
})

export const getCountryList = createAsyncThunk(
  'user/getCountryList', async()=>{
    const response = await ApiGateway.get('https://media.ipassio.com/JSON/country_region.json', true);
    return response;
  }
)

export const getUserLocation = createAsyncThunk(
  'user/getUserLocation',
  async (token:string) => {
    //ad519179ea355a
    //d03fadd21eeed2 no country code
    //b52e8cf6ab40aa no country code
    const response = await ApiGateway.get('https://ipinfo.io/?token='+token, true);
    return response; // (this is the actual data which will be returned as a payload).
  },
);
// data contains your data, for example:
// const data = { fooe: 'bar', };
// data.self = data; // <-- cyclic reference
