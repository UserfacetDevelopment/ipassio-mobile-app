import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import config from '../config/Config';
import ApiGateway from '../config/apiGateway';
import { RootState } from '../app/store';
import { GetTokenInterface } from '../screens/VideoConferencing';


const initialState: any = {
  token: null,
  
};
export const twilioSlice = createSlice({
  name: 'twilio',
  initialState: initialState,
  reducers: {
    setToken: (state, action: PayloadAction<any>) => {
      state.token = action.payload;
    },
  },
  
});

export const {setToken} = twilioSlice.actions;

export const twilioState = (state: RootState) => state.twilio;

export default twilioSlice.reducer;


export const fetchToken = createAsyncThunk(
    'twilio/fetchToken',
    async (data : GetTokenInterface) => {
      let response = await ApiGateway.postNodeServer(
        'token',
        data
      );
      console.log(response)
      return response;
    }
  );