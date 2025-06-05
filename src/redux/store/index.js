import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../reducers/authReducer";
import tavoliReducer from "../reducers/tavoliReducer";
import repartiReducer from "../reducers/repartiReducer";
import ordiniReducer from "../reducers/ordiniReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  tavoli: tavoliReducer,
  reparti: repartiReducer,
  ordini: ordiniReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
