import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import config from '../config/Config';
import ApiGateway from '../config/apiGateway';
import { RootState } from '../app/store';
import { GetParticipantListInterface, GetTokenInterface } from '../screens/VideoConferencing';


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
      return response;
    }
  );

  export const getParticipantList = createAsyncThunk(
    'twilio/getParticipantList',
    async (data : GetParticipantListInterface) => {
      let response = await ApiGateway.twilioClientGet(
        '/v1/Rooms/'+ data.roomName+'/Participants?Status='+data.status+'&PageSize=20',{
          auth: {
            username: config.twilio_api_key,
            password: config.twilio_api_secret
          }
        }
       
      );
      return response;
    }
  );

  export const getMasqueradeToken = createAsyncThunk(
    'twilio/getMasqueradeToken',
    async (userToken : any) => {
      let response = await ApiGateway.get(
        'adminpanel/generate-masquerade/',
        false,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + userToken,
          },
        },
      )
      return response;
      
    }
  );