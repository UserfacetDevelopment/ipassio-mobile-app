import {createSlice , createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import ApiGateway from '../config/apiGateway';
import { GenerateCertificateInterface, TeacherCreatedCoursesInterface } from '../screens/Dashboard';
import config from '../config/Config';
import { AttendanceListInterface } from '../screens/Attendance';
import { setPageLoading } from './loader.slice';
import {Platform} from 'react-native';
import { CartDetailsData } from '../screens/Checkout/CartPage';

const initialState : any = {
  checkoutDataDetails : {},
  page: null,
}

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState : initialState,
  reducers: {

    setCheckoutDataDetails: (state, action :PayloadAction<any>) => {
      state.checkoutDataDetails = action.payload; 
    },
    setPage: (state, action :PayloadAction<any>) => {
      state.page = action.payload; 
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(getTeacherCreatedCourses.fulfilled, (state, action: PayloadAction<any>) => {
    //   state.teacherCreatedCoursesStatus = 'success' ;
    //   state.teacherCreatedCourses = action.payload ;
    // })
   
    
  }
});

export const {setCheckoutDataDetails, setPage} = checkoutSlice.actions;

export const checkoutState = (state : RootState) => state.checkout;

export default checkoutSlice.reducer;


export const cartDetails = createAsyncThunk('checkout/cartDetails',
  async(finalData: CartDetailsData) =>{
    let response = await ApiGateway
    .get(
      'checkoutcourses/refil-course?course_token=' +finalData.courseToken+
        "&class_type=" +
        finalData.classType+
        "&device_type=" +
        Platform.OS, false, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Token " + finalData.userToken,
            },
    });
    return response;
  })

  export const applyCoupon = createAsyncThunk('checkout/applyCoupon',
  async(finalData: any) =>{
    let response = await ApiGateway
    .post('coupon/apply-coupon?format=json', finalData.couponData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + finalData.userToken,
      },
    })
    return response;
  })

  export const removeCoupon = createAsyncThunk('checkout/removeCoupon',
  async(finalData: any) =>{
    let response = await ApiGateway
    .patch('checkoutcourses/checkout-course?format=json', finalData.couponData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + finalData.userToken,
      },
    })
    return response;
  })
  export const checkoutToNextPage = createAsyncThunk('checkout/checkoutNextPage',
  async(finalData: any) =>{
    let response = await ApiGateway
    .patch('checkoutcourses/checkout-course?format=json', finalData.finalReviewData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + finalData.userToken,
      },
    })
    return response;
  })

  export const checkoutUpdate = createAsyncThunk('checkout/checkoutUpdate',
  async(finalData: any) =>{
    let response = await ApiGateway
    .patch('checkoutcourses/checkout-course?format=json', finalData.finalReviewData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + finalData.userToken,
      },
    })
    return response;
  })

  export const proceedToPayment = createAsyncThunk('checkout/proceedToPayment',
  async(finalData: any) =>{
    let response = await ApiGateway
    .post('checkoutcourses/payment-summary?format=json', finalData.dataPay, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + finalData.userToken,
      },
    })
    return response;
  })

  // const getCourseCheckout = (finalData) => {
  //   return axios.get(
  //     API_URL +
  //       "/checkoutcourses/checkout-course?checkout_token=" +
  //       finalData.checkoutToken +
  //       "&format=json",
  //     { headers: authHeader() }
  //   );
  // };
  
  export const detailsCheckoutToken = createAsyncThunk('checkout/detailsCheckoutToken',
  async(finalData: any) =>{
    let response = await ApiGateway
    .get(
      "checkoutcourses/checkout-course?checkout_token="+
        finalData.checkoutToken +
        "&format=json",
        false, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Token " + finalData.userToken,
            },
    });
    return response;
  })
