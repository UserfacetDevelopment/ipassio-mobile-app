import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../app/store';
import ApiGateway from '../config/apiGateway';
import config from '../config/Config';
import {setPageLoading} from './loader.slice';
import {Platform} from 'react-native';
import {CreateSessionInterfaceFinal} from '../screens/Schedules/AddSession';

const initialState: any = {
  scheduledData: [],
  scheduledDataStatus: 'loading',
};

export const scheduleSessionSlice = createSlice({
  name: 'scheduleSession',
  initialState: initialState,
  reducers: {
    scheduledDataSuccess: (state, action: PayloadAction<any>) => {
      state.scheduledData = action.payload;
      state.scheduledDataStatus = 'success';
    },
    scheduledDataFailure: state => {
      state.scheduledDataStatus = 'failed';
    },
  },
  extraReducers: builder => {
    // builder.addCase(getTeacherCreatedCourses.fulfilled, (state, action: PayloadAction<any>) => {
    //   state.teacherCreatedCoursesStatus = 'success' ;
    //   state.teacherCreatedCourses = action.payload ;
    // })
  },
});

export const {scheduledDataFailure, scheduledDataSuccess} =
  scheduleSessionSlice.actions;

export const schedulesState = (state: RootState) => state.scheduleSession;

export default scheduleSessionSlice.reducer;

export const getSchedule = createAsyncThunk(
  'scheduleSession/getSchedule',
  async (userToken: string) => {
    let response = await ApiGateway.get(
      'attendance/get-upcoming-class-list?class_type=C&format=json',
      false,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + userToken,
        },
      },
    );
    return response;
  },
);

export const addSession = createAsyncThunk(
  'scheduleSession/addSession',
  async (finalData: CreateSessionInterfaceFinal) => {
    let response = await ApiGateway.post(
      'attendance/create-class?format=json',
      finalData.params,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + finalData.userToken,
        },
      },
    );

    return response;
  },
);

export const editSession = createAsyncThunk(
  'scheduleSession/editSession',
  async (finalData: CreateSessionInterfaceFinal) => {
    let response = await ApiGateway.patch(
      'attendance/course-class?format=json',
      finalData.params,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + finalData.userToken,
        },
      },
    );

    return response;
  },
);

export const deleteSession = createAsyncThunk(
  'scheduleSession/deleteClass',
  async (finalData: any) => {
    let response = await ApiGateway.post(
      'attendance/delete-class?format=json',
      finalData.data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + finalData.userToken,
        },
      },
    );
    return response;
  },
);

export const getEnrolledStudentsList = createAsyncThunk(
  'scheduleSession/getEnrolledStudentsList',
  async (userToken: string) => {
    let response = await ApiGateway.get(
      'attendance/enrolled-course-student?format=json',
      false,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + userToken,
        },
      },
    );

    return response;
  },
);
