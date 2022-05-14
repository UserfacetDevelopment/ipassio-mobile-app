import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../app/store';
import ApiGateway from '../config/apiGateway';
import config from '../config/Config';
import {FinalWithdrawRequestInterface} from '../screens/Withdrawal';

const initialState: any = {
  withdrawalData: [],
  withdrawalDataStatus: 'loading',
  transactionsData: [],
  transactionsDataStatus: 'loading',
  withdrawMethod: 0,
};

export const withdrawalSlice = createSlice({
  name: 'withdrawal',
  initialState: initialState,
  reducers: {
    fetchWithdrawalDataSuccess: (state, action: PayloadAction<any>) => {
      state.withdrawalData = action.payload;
      state.withdrawalDataStatus = 'success';
    },
    fetchWithdrawalsDataFailure: state => {
      state.withdrawalDataStatus = 'failed';
    },
    fetchTransactionsDataSuccess: (state, action: PayloadAction<any>) => {
      state.transactionsData = action.payload;
      state.transactionsDataStatus = 'success';
    },
    fetchTransactionsDataFailure: state => {
      state.transactionsDataStatus = 'failed';
    },
    setWithdrawMethods: (state, action: PayloadAction<any>) => {
      state.withdrawMethod = action.payload;
    },
  },
});

export const {
  fetchTransactionsDataSuccess,
  fetchTransactionsDataFailure,
  setWithdrawMethods,
  fetchWithdrawalDataSuccess, fetchWithdrawalsDataFailure
} = withdrawalSlice.actions;

export const withdrawalState = (state: RootState) => state.withdrawal;

export default withdrawalSlice.reducer;

export const withdrawList = createAsyncThunk(
  'withdrawal/withdrawList',
  async (userToken: string) => {
    let response = await ApiGateway.get(
      'withdrawal/withdrawlist?format=json',
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

export const withdrawRequest = createAsyncThunk(
  'withdrawal/withdrawRequest',
  async (finalData: FinalWithdrawRequestInterface) => {
    console.log(finalData)
    let response = await ApiGateway.patch(
      config.api_urls.teacher.withdraw_request,
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

export const withdrawMethods = createAsyncThunk(
  'withdrawal/withdrawMethods',
  async (userToken: string) => {
    let response = await ApiGateway.get(
      'withdrawal/methods/?format=json',
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

export const fetchTransactions = createAsyncThunk(
  'withdrawal/fetchTransactions',
  async (userToken: string) => {

    let response = await ApiGateway.get(
      "withdrawal/transaction-history?format=json",
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
