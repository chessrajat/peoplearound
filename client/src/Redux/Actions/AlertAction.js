import { HIDE_ALERT, SHOW_ALERT } from "../../Utils/Constants";
import { v4 as uuidv4 } from "uuid";

export const showAlert = (msg, alertType, timeout=5000) => {
  return (dispatch) => {
    const id = uuidv4();
    dispatch({
      type: SHOW_ALERT,
      payload: {
        id: id,
        msg: msg,
        alertType: alertType,
      },
    });

    setTimeout(
      () =>
        dispatch({
          type: HIDE_ALERT,
          payload: id,
        }),
      timeout
    );
  };
};


