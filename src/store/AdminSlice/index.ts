import { createSlice } from "@reduxjs/toolkit";

export interface AdminState {
  filterPostValidation: {
    user: string;
    postContent: string[];
    postType: string[];
  };
  overview: {
    dateRange: any;
  };
}

export const initialAdminState: AdminState = {
  filterPostValidation: {
    user: "",
    postContent: [],
    postType: [],
  },
  overview: {
    dateRange: [],
  },
};

const adminSlice = createSlice({
  name: "admin",
  initialState: initialAdminState,
  reducers: {
    updateFilterPostValidation: (state, action) => {
      state.filterPostValidation = action.payload;
    },
    updateDateRangeOverview: (state, action) => {
      state.overview.dateRange = action.payload;
    },
  },
});

export const { updateFilterPostValidation, updateDateRangeOverview } =
  adminSlice.actions;
export default adminSlice.reducer;
