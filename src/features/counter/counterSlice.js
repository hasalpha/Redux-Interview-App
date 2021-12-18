import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const counterSlice = createSlice({
  name: "registry",
  initialState,
  reducers: {
    fetch: (state, action) => {
      state.value.push(...action.payload);
    },
    del: (state, action) => {
      state.value = state.value.filter(
        (el) => el.email !== action.payload
      );
    },
  },
});

export const { fetch, del } = counterSlice.actions;
export const selectValues = (state) => state.value;
export default counterSlice.reducer;
