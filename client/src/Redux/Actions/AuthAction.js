import axios from "axios";
import { REGISTER_FAILED, REGISTER_SUCCESS } from "../../Utils/Constants";
import { showAlert } from "./AlertAction";

export const register = ({ name, email, password }) => {
  return async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ name, email, password });
    try {
      const res = await axios.post("/api/users", body, config);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((errs) => {
          dispatch(showAlert(errs.msg, "danger"));
        });
      }
      dispatch({
        type: REGISTER_FAILED,
      });
    }
  };
};
