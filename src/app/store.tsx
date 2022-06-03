import {configureStore} from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux'
import userReducer from '../reducers/user.slice';
import loaderReducer from '../reducers/loader.slice';
import courseReducer from '../reducers/courses.slice';
import dashboardReducer from '../reducers/dashboard.slice'
import checkoutReducer from '../reducers/checkout.slice';
import withdrawalReducer from '../reducers/withdrawal.slice';
import scheduleSessionReducer from '../reducers/schedule.slice';
import recordingReducer from '../reducers/recording.slice';
const store = configureStore({
    reducer:{
        user: userReducer,
        loader: loaderReducer,
        course: courseReducer,
        dashboard : dashboardReducer,
        checkout: checkoutReducer,
        withdrawal: withdrawalReducer,
        scheduleSession: scheduleSessionReducer,
        recording: recordingReducer

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      })
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store;