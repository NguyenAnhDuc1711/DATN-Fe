import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateHasMoreData } from "../UtilSlice";
import { formatDateToDDMMYYYY } from "../../util";
import { GET } from "../../config/API";
import { Route } from "../../Breads-Shared/APIConfig";
import { AxiosError } from "axios";

export const getConversations = createAsyncThunk(
  "message/getConversations",
  async (payload: any, thunkApi) => {
    try {
      const data = payload.data;
      const isLoadNew = payload.isLoadNew;
      const dispatch = thunkApi.dispatch;
      const hasMoreData = data?.length !== 0 ? true : false;
      dispatch(updateHasMoreData(hasMoreData));
      return { data, isLoadNew };
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue(err.response?.data);
      }
    }
  }
);

export const getMsgs = createAsyncThunk(
  "message/getMsgs",
  (data: any, thunkApi) => {
    try {
      const { msgs, isNew } = data;
      const dateSet = [
        ...new Set(
          msgs.map((msg) => formatDateToDDMMYYYY(new Date(msg?.createdAt)))
        ),
      ];
      const splitMsgsByDate: Record<string, any> = {};
      dateSet.forEach((date: any) => {
        const msgsByDate = msgs.filter(
          (msg) => formatDateToDDMMYYYY(new Date(msg?.createdAt)) === date
        );
        splitMsgsByDate[date] = msgsByDate;
      });
      return { msgs: splitMsgsByDate, isNew: isNew };
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue(err.response?.data);
      }
    }
  }
);

export const getConversationById = createAsyncThunk(
  "message/getConversation",
  async (conversationId: string, thunkApi) => {
    try {
      const rootState: any = thunkApi.getState();
      const userId = rootState.user.userInfo._id;
      const conversation = await GET({
        path: Route.MESSAGE + `/conversation/${conversationId}`,
        params: {
          conversationId: conversationId,
          userId: userId ? userId : localStorage.getItem("userId"),
        },
      });
      return conversation;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue(err.response?.data);
      }
    }
  }
);

export const getMsgsFromSearchValue = createAsyncThunk(
  "message/getMsgsFromSearchValue",
  async (payload, thunkApi) => {
    try {
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue(err.response?.data);
      }
    }
  }
);
