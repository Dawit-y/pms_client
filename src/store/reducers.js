import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './auth/authSlice';
import layoutReducer from './layout/layoutSlice';

const rootReducer = combineReducers({
  layout: layoutReducer,
  auth: authReducer,
});

export default rootReducer;
