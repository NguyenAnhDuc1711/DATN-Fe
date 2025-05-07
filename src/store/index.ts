import { configureStore } from "@reduxjs/toolkit";
import AdminReducer, { AdminState } from "./AdminSlice";
import MessageReducer, { MsgState } from "./MessageSlice";
import NotificationReducer, { NotificationState } from "./NotificationSlice";
import PostReducer, { PostState } from "./PostSlice";
import ReportReducer, { ReportState } from "./ReportSlice";
import UserReducer, { UserState } from "./UserSlice";
import UtilReducer, { UtilState } from "./UtilSlice";

export interface AppState {
  user: UserState;
  post: PostState;
  util: UtilState;
  message: MsgState;
  notification: NotificationState;
  admin: AdminState;
  report: ReportState;
}

const store = configureStore({
  reducer: {
    user: UserReducer,
    post: PostReducer,
    util: UtilReducer,
    message: MessageReducer,
    notification: NotificationReducer,
    admin: AdminReducer,
    report: ReportReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export default store;
