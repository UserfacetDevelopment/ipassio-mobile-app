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
  teacherCreatedCourses : {},
  teacherCreatedCoursesStatus: null,
  enrolledStudents: {},
  enrolledStudentsStatus : null,
  enrolledCourses: {},
  enrolledCoursesStatus : null,
  attendances : [],
  attendancesStatus: null,
  studentAttendanceList : []
}

export const getTeacherCreatedCourses= createAsyncThunk('dashboard/getTeacherCreatedCourses', 
async(data: TeacherCreatedCoursesInterface)=> {
  const response = await ApiGateway.get('courses/?format=json&user_token='+data.userToken, false, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + data.token,
    },
  });
  return response.data;
})

export const getEnrolledStudents = createAsyncThunk('dashboard/getEnrolledStudents', async(token: string)=>{
  const response =  await ApiGateway.get('checkoutcourses/enrolled-student-list?format=json', false, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + token,
    },
  })
  return response.data;
})

export const getEnrolledCourses = createAsyncThunk('dashboard/getEnrolledCourses', async(token: string)=>{
  const response =  await ApiGateway.get('courses/course-list-detail?format=json', false, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + token,
    },
  })
  return response.data;
})

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState : initialState,
  reducers: {

    setAttendanceSuccess: (state, action :PayloadAction<any>) => {
      state.attendances = action.payload; 
      state.attendancesStatus = 'success';
    },
    setStudentAttendanceSuccess: (state, action :PayloadAction<any>) => {
      state.studentAttendanceList = action.payload; 
      state.attendancesStatus = 'success';
    },
    setAttendanceFailure:(state)=>{
      state.attendancesStatus = 'failed'
    },
    setAttendanceLoading:(state) =>{
      state.attendancesStatus = 'loading'
    }
    
  },
  extraReducers: (builder) => {
    builder.addCase(getTeacherCreatedCourses.fulfilled, (state, action: PayloadAction<any>) => {
      state.teacherCreatedCoursesStatus = 'success' ;
      state.teacherCreatedCourses = action.payload ;
    }),
    builder.addCase(getTeacherCreatedCourses.rejected, (state) => {
      state.teacherCreatedCoursesStatus = 'failed' ;
    }),
    builder.addCase(getTeacherCreatedCourses.pending, (state) => {
      state.teacherCreatedCoursesStatus = 'loading' ;
    }),
    builder.addCase(getEnrolledStudents.fulfilled, (state, action: PayloadAction<any>) => {
      state.enrolledStudentsStatus = 'success';
      state.enrolledStudents = action.payload;
    }),
    builder.addCase(getEnrolledStudents.pending, (state) => {
      state.enrolledStudentsStatus = 'loading' ;
    }),
    builder.addCase(getEnrolledStudents.rejected, (state) => {
      state.enrolledStudentsStatus = 'failed' ;
    }),
    builder.addCase(getEnrolledCourses.pending, (state) => {
      state.enrolledCoursesStatus = 'loading' ;
    })
    builder.addCase(getEnrolledCourses.fulfilled, (state, action: PayloadAction<any>) => {
      state.enrolledCoursesStatus = 'success';
      state.enrolledCourses = action.payload;
    }),
    builder.addCase(getEnrolledCourses.rejected, (state) => {
      state.enrolledCoursesStatus = 'failed' ;
    })
    // builder.addCase(getAttendenceList.fulfilled, (state, action: PayloadAction<any>) => {
    //   state.attendancesStatus = 'success' ;
    //   state.attendances = action.payload ;
    // }),
    // builder.addCase(getAttendenceList.rejected, (state) => {
    //   state.attendancesStatus = 'failed' ;
    // }),
    // builder.addCase(getAttendenceList.pending, (state) => {
    //   state.attendancesStatus = 'loading' ;
    // })
    
  }
});

export const {setAttendanceFailure, setAttendanceLoading, setStudentAttendanceSuccess, setAttendanceSuccess} = dashboardSlice.actions;

export const dashboardState = (state : RootState) => state.dashboard;

export default dashboardSlice.reducer;


export const getAttendenceList= createAsyncThunk('dashboard/getAttendenceList', 
async(data: AttendanceListInterface, {dispatch})=> {
  dispatch(setPageLoading(true));
  dispatch(setAttendanceLoading());
  let response;
  if(data.userType === "S"){
    ApiGateway.get("attendance?cr_tk=" +
    data.courseToken +
    "&price_type=" +
    data.priceType +
    "&format=json", false, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + data.token,
      },
    })
    .then(response => {
      dispatch(setPageLoading(false));
      if(response.data.status === "success"){
        dispatch(setAttendanceSuccess(response.data.data));
        dispatch(setStudentAttendanceSuccess(response.data.extra_data));
      }
      else if(response.data.status === "failure"){
        dispatch(setAttendanceFailure());
      }
    })
    .catch(err=>{
      dispatch(setPageLoading(false));
      dispatch(setAttendanceFailure());
    });
  }
  else{
    ApiGateway.get("attendance?cr_tk=" +
    data.courseToken +
    "&ur_tk=" +
    data.userToken +
    "&price_type=" +
    data.priceType+
    "&format=json", false, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + data.token,
      },
    })
    .then(response => {
      dispatch(setPageLoading(false));
      if(response.data.status === "success"){
        dispatch(setAttendanceSuccess(response.data.data));
        dispatch(setStudentAttendanceSuccess(response.data.extra_data));
      }
      else if(response.data.status === "failure"){
        dispatch(setAttendanceFailure());
      }
    })
    .catch(err=>{
      dispatch(setPageLoading(false));
      dispatch(setAttendanceFailure());
    });
  }
  
  return response;
})

export const submitMarkedAttendance= createAsyncThunk('dashboard/submitMarkedAttendace', 
async(data:any)=> {
  let response;
    response = await ApiGateway.patch('attendance/' + data.data.attendance_token + "/",
    data.finalData,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + data.userToken,
      },
    });
    return response;
  })

export const generateCertificate = createAsyncThunk('dashboard/generateCertificate',
  async(finalData: GenerateCertificateInterface) =>{
    let response = await ApiGateway.post('courses/request-certificate?format=json', finalData.data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + finalData.userToken
      },
    });
    return response;
  })
