import { configureStore } from "@reduxjs/toolkit";
import reducer from "../features/counter/counterSlice";

export const store = configureStore({ reducer });
