import { createAsyncThunk } from "@reduxjs/toolkit";
import { reloadListPost } from "../PostSlice";

type PageUpdate = {
  nextPage?: string;
  currentPage?: string;
};

export const changePage = createAsyncThunk(
  "util/changePage",
  (payload: PageUpdate, thunkApi) => {
    const dispatch = thunkApi.dispatch;
    const { nextPage, currentPage } = payload;
    dispatch(reloadListPost());
    return {
      currentPage: currentPage ?? "",
      nextPage: nextPage,
    };
  }
);
