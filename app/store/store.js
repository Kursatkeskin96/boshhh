"use client";
import { configureStore } from "@reduxjs/toolkit";
import hiddenSlice from "./slices/hiddenSlice";
import submitSlice from "./slices/submitSlice";
export const store = configureStore({
  reducer: {
    hiddenData: hiddenSlice,
    handleSubmit: submitSlice,
  },
});
