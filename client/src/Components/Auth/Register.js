import React from "react";
import { useDispatch } from "react-redux";
import { hideAlert, showAlert } from "../../Redux/Actions/AlertAction";

const Register = () => {
  const dispatch = useDispatch();

  const setAlert = () => {
    dispatch(showAlert("show button pressed", "success"));
  };
  const removeAlert = () => {
    dispatch(hideAlert());
  };

  return (
    <div>
      Register
      <button onClick={setAlert}>Show Alert</button>
      <button>Hide alert</button>
    </div>
  );
};

export default Register;
