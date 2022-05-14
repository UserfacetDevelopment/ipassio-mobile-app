import {createSlice , PayloadAction} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface Loader {
  loading : boolean;
  pageLoading: any;
}

const initialState : Loader = {
  loading: false,
  pageLoading: false
}
export const loaderSlice = createSlice({
  name: 'loader',
  initialState : initialState,
  reducers: {
    setLoading: (state, action :PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPageLoading :(state, action : PayloadAction<boolean>)=>{
        state.pageLoading=action.payload;
    }
  },
});

export const {setLoading, setPageLoading} = loaderSlice.actions;

export const loaderState = (state : RootState) => state.loader;

export default loaderSlice.reducer;