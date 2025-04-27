import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { REPORT_PATH, Route, UTIL_PATH } from "../../Breads-Shared/APIConfig";
import { POST } from "../../config/API";

export const sendReport = createAsyncThunk(
  "report/sendReport",
  async (payload: any, thunkApi) => {
    try {
      const rootState: any = thunkApi.getState();
      const userInfo = rootState.user.userInfo;
      const payloadSend = {
        userId: userInfo?._id,
        ...payload,
      };
      const data = await POST({
        path: Route.REPORT + REPORT_PATH.CREATE,
        payload: payloadSend,
      });
      return data;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue(err.response?.data);
      }
    }
  }
);
