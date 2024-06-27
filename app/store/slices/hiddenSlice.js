import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: "",
};
const hiddenSlice = createSlice({
  name: "hiddenSlice",
  initialState,
  reducers: {
    addHiddenData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { addHiddenData } = hiddenSlice.actions;
export default hiddenSlice.reducer;
