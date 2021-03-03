import { REGISTER_SUCCESS } from "../../Utils/Constants";
import { createReducer } from "../../Utils/CreateReducer";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

const registerSuccess = (state, payload) => {
  localStorage.setItem("token", payload.token);
  return { ...state, ...payload, isAuthenticated: true, loading: false };
};

const registerFailed = (state, payload) => {
  localStorage.removeItem("token");
  return { ...state, token: null, isAuthenticated: false, loading: false };
};

export default createReducer(initialState, {
  [REGISTER_SUCCESS]: registerSuccess,
});
