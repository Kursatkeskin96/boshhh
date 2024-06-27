import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  handleSubmit: {},
};
const submitSlice = createSlice({
  name: "submitSlice",
  initialState,
  reducers: {
    setHandleSubmit: (state, action) => {
      state.handleSubmit = action.payload;
    },
  },
});

export const { setHandleSubmit } = submitSlice.actions;
export default submitSlice.reducer;
