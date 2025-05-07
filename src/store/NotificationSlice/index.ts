import { createSlice } from "@reduxjs/toolkit";
import { getNotificattions } from "./asyncThunk";

export interface NotificationState {
  notifications: any;
  hasNewNotification: boolean;
  isLoading: boolean;
}

export const initialNotificationState: NotificationState = {
  notifications: [],
  hasNewNotification: false,
  isLoading: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialNotificationState,
  reducers: {
    updateHasNotification: (state, action) => {
      state.hasNewNotification = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNotificattions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getNotificattions.fulfilled, (state, action) => {
      const notifications = action.payload;
      if (state.notifications.length) {
        state.notifications.push(...notifications);
      } else {
        state.notifications = notifications;
      }
      state.isLoading = false;
    });
  },
});

export const { updateHasNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
