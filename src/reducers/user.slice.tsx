import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import config from '../config/Config';
import ApiGateway from '../config/apiGateway';
import {RootState} from '../app/store';
import {GoogleLogin, Login} from '../screens/Login';
import {ForgotPassswordInterface} from '../screens/Login/ForgotPassword';
import {ResetPasswordInterface} from '../screens/Login/ResetPassword';

export const getUserLocation = createAsyncThunk(
  'user/getUserLocation',
  async () => {
    const response = await ApiGateway.get('https://ipinfo.io/?token=ad519179ea355a', true);
    return response; // (this is the actual data which will be returned as a payload).
  },
);

const initialState: any = {
  userData: [],
  isLoggedIn: false,
  userLocation: {},
  locationStatus: null,
  fcmToken: null,
  navigation:null,
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
    }
  },
  extraReducers: builder => {
    builder.addCase(getUserLocation.pending, state => {
      state.locationStatus = 'loading';
    }),
      builder.addCase(
        getUserLocation.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.userLocation = action.payload;
          state.locationStatus = 'success';
        },
      ),
      builder.addCase(
        getUserLocation.rejected,
        (state, action: PayloadAction<any>) => {
          state.locationStatus = 'failed';
          state.userLocation = action.payload;
        },
      );
  },
});

export const {loginSuccess, logoutUser, setFCMToken, setNavigation} = userSlice.actions;

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
// export const socialLogin = (data) = (dispatch) => {
//   ApiGateway
//     .post("https://safeapis.ipassio.com/api/account/google-login?format=json", data)
//     .then(response => {
//       if (response.data.status === 'success') {
//         dispatch(loginSuccess(response.data))
//       } else if (response.data.status === 'failure') {
//         dispatch(loginFailure());
//         // setIsLoading(false);
//         // Alert.alert('', response.data.error_message.message, [
//         //   {text: 'Okay', style: 'cancel'},
//         // ]);
//       }
//     })
//     .catch((err) => {
//       console.log(err)
//     });
// }

// export const doForgetPassword = (data, navigation)  => {
//   ApiGateway.post(config.api_urls.forgot_password, data)
//         .then((response) => {
//           // this.setState({ isLoading: false });
//           // this.setState({ username: "" });
//           // global.not_first = true;                          //????????????????????????????????????????
//           if (response.data.status === "success") {
//             //  navigation.navigate("ActionStatus", {
//             //   messageStatus: "success",
//             //   messageTitle: "Congratulations!",
//             //   messageDesc: config.messages.forgot_password_msg,
//             //   timeOut: 4000,
//             //   backRoute: "Login",
//             //   params: {},
//             // });
//           } else if (response.data.status === "failure") {
//             // this.props.navigation.navigate("ActionStatus", {
//             //   messageStatus: "failure",
//             //   messageTitle: "Sorry!",
//             //   messageDesc: response.data.error_message.message,
//             //   timeOut: 4000,
//             //   backRoute: "ForgotPassword",
//             //   params: {},
//             // });
//           }
//         })
//         .catch((err) => {
//           alert(JSON.stringify(err));
//           // this.setState({ isLoading: false });
//         });
// }

// data contains your data, for example:
// const data = { foo: 'bar', };
// data.self = data; // <-- cyclic reference
