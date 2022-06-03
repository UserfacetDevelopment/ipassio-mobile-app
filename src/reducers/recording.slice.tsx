import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../app/store';
import ApiGateway from '../config/apiGateway';
import { RecordingDataInterface } from '../screens/Recording/Recording';

interface RecordingInterface {
  recordings: any;
  currentRecording: any;
  courses:any;
}

const initialState: RecordingInterface = {
  recordings: [],
  currentRecording: {},
  courses:null
};
export const recordingSlice = createSlice({
  name: 'recording',
  initialState: initialState,
  reducers: {
    setRecordings: (state, action: PayloadAction<boolean>) => {
      state.recordings = action.payload;
    },
    setCurrentRecording: (state, action: PayloadAction<boolean>) => {
      state.currentRecording = action.payload;
    },
    setCourses: (state, action: PayloadAction<boolean>) => {
        state.courses = action.payload;
      },
  },
});

export const {setCurrentRecording, setRecordings, setCourses} = recordingSlice.actions;

export const recordingState = (state: RootState) => state.recording;

export default recordingSlice.reducer;

export const getStudentRecording = createAsyncThunk('recording/getStudentRecording',
async(data: RecordingDataInterface) =>{
   let response;
       response = ApiGateway.get('twiliovideo/class-recordings-student/?course='+data.course_slug,false,{
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + data.userToken,
        },
      })
      return response
   }
);

export const getTeacherRecording = createAsyncThunk('recording/getTeacherRecording',
async(data: RecordingDataInterface) =>{
   let response;
       response = ApiGateway.get('twiliovideo/class-recordings-teacher/?course='+data.course_slug+'&user='+data.user,false,{
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + data.userToken,
        },
      })
      return response
   }
);


