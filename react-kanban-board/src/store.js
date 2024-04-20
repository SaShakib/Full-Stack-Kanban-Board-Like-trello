import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import modalReducer from "./reducers/modal/modalSlice";
import boardReducer from "./reducers/board/boardSlice";
import userSlice from "./reducers/user/userSlice";

const reducers = combineReducers({
  modal: modalReducer,
  board: boardReducer,
  user: userSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
