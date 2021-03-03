import { HIDE_ALERT, SHOW_ALERT } from "../../Utils/Constants";
import { createReducer } from "../../Utils/CreateReducer";

const initialState = [];

// {
//     id:1,
//     msg:"",
//     alertType:""
// }

const showAlert = (state, payload) => {
  return [...state, payload];
};

const hideAlert = (state, payload) => {
  return state.filter((alert) => alert.id !== payload);
};

export default createReducer(initialState, {
  [SHOW_ALERT]: showAlert,
  [HIDE_ALERT]: hideAlert,
});
