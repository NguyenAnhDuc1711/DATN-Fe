import { configureStore } from "@reduxjs/toolkit";
import AdminReducer, { AdminState } from "./AdminSlice";
import MessageReducer, { MsgState } from "./MessageSlice";
import NotificationReducer, { NotificationState } from "./NotificationSlice";
import PostReducer, { PostState } from "./PostSlice";
import ReportReducer, { ReportState } from "./ReportSlice";
import UserReducer, { UserState } from "./UserSlice";
import UtilReducer, { UtilState } from "./UtilSlice";
import { logout } from "./UserSlice/asyncThunk";
import { AnyAction, combineReducers } from "@reduxjs/toolkit";

export interface AppState {
  user: UserState;
  post: PostState;
  util: UtilState;
  message: MsgState;
  notification: NotificationState;
  admin: AdminState;
  report: ReportState;
}

// Combine all reducers
const appReducer = combineReducers({
  user: UserReducer,
  post: PostReducer,
  util: UtilReducer,
  message: MessageReducer,
  notification: NotificationReducer,
  admin: AdminReducer,
  report: ReportReducer,
});

// Root reducer that will handle resetting all state on logout
const rootReducer = (state: AppState | undefined, action: AnyAction) => {
  // When logout action is fulfilled, reset the state of all slices
  if (action.type === logout.fulfilled.type) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export default store;
