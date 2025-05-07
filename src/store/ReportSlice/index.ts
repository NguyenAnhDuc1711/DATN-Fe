import { createSlice } from "@reduxjs/toolkit";
import { sendReport } from "./asyncThunk";

export interface ReportState {
  openPopup: boolean;
  reportInfo: {
    content: string;
    media: any;
  };
}

export const intialReportState = {
  openPopup: false,
  reportInfo: {
    content: "",
    media: [],
  },
};

const reportSlice = createSlice({
  name: "report",
  initialState: intialReportState,
  reducers: {
    openPopup: (state) => {
      state.openPopup = !state.openPopup;
    },
    updateReportInfo: (state, action) => {
      const { key, value } = action.payload;
      state.reportInfo[key] = value;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendReport.fulfilled, (state, action) => {
      state = intialReportState;
      state.openPopup = false;
    });
    builder.addCase(sendReport.rejected, (state, action) => {
      state = intialReportState;
      state.openPopup = false;
    });
  },
});

export const { updateReportInfo, openPopup } = reportSlice.actions;
export default reportSlice.reducer;
