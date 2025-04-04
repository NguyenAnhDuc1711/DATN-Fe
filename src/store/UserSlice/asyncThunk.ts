import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { initialUserState, IUser } from ".";
import {
  COLLECTION_PATH,
  Route,
  USER_PATH,
} from "../../Breads-Shared/APIConfig";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import { GET, PATCH, POST, PUT } from "../../config/API";
// import { initialMsgState } from "../MessageSlice";
import { initialPostState, updateListPost } from "../PostSlice";
import { initialUtilState } from "../UtilSlice";

export const signUp = createAsyncThunk(
  "user/signUp",
  async (payload: any, { rejectWithValue }) => {
    try {
      const data = await POST({
        path: Route.USER + USER_PATH.SIGN_UP,
        payload,
      });
      if (data) {
        // localStorage.setItem("userId", data?._id);
        return data;
      }
      return null;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (payload: any, { rejectWithValue }) => {
    try {
      let data: IUser | undefined | null;
      if (payload?.loginAsAdmin) {
        data = await GET({
          path: Route.USER + USER_PATH.ADMIN,
        });
      } else {
        data = await POST({
          path: Route.USER + USER_PATH.LOGIN,
          payload,
        });
      }
      if (data) {
        localStorage.setItem("userId", data?._id);
      }
      return data;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        return rejectWithValue(err.response?.data);
      }
    }
  }
);

export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    const rootState: any = thunkAPI.getState();
    const data = await POST({
      path: Route.USER + USER_PATH.LOGOUT,
    });
    localStorage.removeItem("userId");
    rootState.user = initialUserState;
    rootState.post = initialPostState;
    rootState.util = initialUtilState;
    // rootState.message = initialMsgState;
    return data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
});

export const getUserInfo = createAsyncThunk(
  "user/getUserInfo",
  async (payload: any, thunkAPI) => {
    try {
      const userId: string = payload.userId;
      const getCurrentUser = payload.getCurrentUser;
      const data = await GET({
        path: Route.USER + USER_PATH.PROFILE + userId,
      });
      return {
        user: data,
        getCurrentUser: getCurrentUser,
      };
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        return thunkAPI.rejectWithValue(err.response?.data);
      }
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (payload: any, thunkAPI) => {
    try {
      const userId = payload?.userId;
      if (userId) {
        delete payload.userId;
      }
      const data = await PUT({
        path: Route.USER + USER_PATH.UPDATE + userId,
        payload,
      });
      return data;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        return thunkAPI.rejectWithValue(err.response?.data);
      }
    }
  }
);

export const addPostToCollection = createAsyncThunk(
  "user/addToCollection",
  async (payload: any, thunkAPI) => {
    try {
      const { userId, postId } = payload;
      await PATCH({
        path: Route.COLLECTION + COLLECTION_PATH.ADD,
        payload: {
          userId: userId,
          postId: postId,
        },
      });
      return postId;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        return thunkAPI.rejectWithValue(err.response?.data);
      }
    }
  }
);

export const removePostFromCollection = createAsyncThunk(
  "user/removeFromCollection",
  async (payload: any, thunkAPI) => {
    try {
      const rootState: any = thunkAPI.getState();
      const dispatch = thunkAPI.dispatch;
      const displayPageData = rootState.util.displayPageData;
      const { userId, postId } = payload;
      await PATCH({
        path: Route.COLLECTION + COLLECTION_PATH.REMOVE,
        payload: {
          userId: userId,
          postId: postId,
        },
      });
      if (displayPageData === PageConstant.SAVED) {
        const newListPost = rootState.post.listPost.filter(
          (post) => post._id !== postId
        );
        dispatch(updateListPost(newListPost));
        return {
          postId: postId,
        };
      }
      return {
        postId: postId,
      };
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        return thunkAPI.rejectWithValue(err.response?.data);
      }
    }
  }
);

export const followUser = createAsyncThunk(
  "user/handleFollow",
  async (payload: any, thunkAPI) => {
    try {
      const { userFlId, userId } = payload;
      await PUT({
        path: Route.USER + USER_PATH.FOLLOW,
        payload: {
          userFlId,
          userId,
        },
      });
      return userFlId;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        return thunkAPI.rejectWithValue(err.response?.data);
      }
    }
  }
);
