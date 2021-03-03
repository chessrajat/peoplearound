import { SHOW_ALERT } from "../../Utils/Constants";
import { v4 as uuidv4 } from 'uuid';

export const showAlert = (msg, alertType) => {
  return (dispatch) => {
    const id = uuidv4()
    dispatch({
      type: SHOW_ALERT,
      payload: {
        id: id,
        msg: msg,
        alertType: alertType,
      },
    });
  };
};

export const hideAlert = () => {};
