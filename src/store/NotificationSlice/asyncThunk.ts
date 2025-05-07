import { createAsyncThunk } from "@reduxjs/toolkit";
import { POST } from "../../config/API";
import { Route, NOTIFICATION_PATH } from "../../Breads-Shared/APIConfig";
import { AxiosError } from "axios";

export const getNotificattions = createAsyncThunk(
  "notification/getNotifications",
  async (payload: any, thunkApi) => {
    try {
      const { userId, page, limit } = payload;
      const data = await POST({
        path: Route.NOTIFICATION + NOTIFICATION_PATH.GET,
        payload: {
          userId: userId,
          page: page,
          limit: limit,
        },
      });
      return data;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        thunkApi.rejectWithValue(err.response?.data);
      }
    }
  }
);
