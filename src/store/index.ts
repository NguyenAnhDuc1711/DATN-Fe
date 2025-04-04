import { configureStore } from "@reduxjs/toolkit";
import PostReducer, { PostState } from "./PostSlice";
import UserReducer, { UserState } from "./UserSlice";
import UtilReducer, { UtilState } from "./UtilSlice";

export interface AppState {
  user: UserState;
  post: PostState;
  util: UtilState;
}

const store = configureStore({
  reducer: {
    user: UserReducer,
    post: PostReducer,
    util: UtilReducer,
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
