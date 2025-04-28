import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import counterReducer from "./features/counterSlice";
import authReducer from "./features/authSlice";
import projectsReducer from "./features/projectsSlice";
import currentProjectReducer from "./features/currentProjectSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      auth: authReducer,
      projects: projectsReducer,
      currentProject: currentProjectReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
};

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
