import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.VITE_NODE_ENV !== 'production',
});

export default store;
