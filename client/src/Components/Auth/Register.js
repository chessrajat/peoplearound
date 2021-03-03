import React from "react";
import { useDispatch } from "react-redux";
import { showAlert } from "../../Redux/Actions/AlertAction";

const Register = () => {
  const dispatch = useDispatch();

  const setAlert = () => {
    dispatch(showAlert("show button pressed", "success"));
  };

  return (
    <div>
      Register
      <button onClick={setAlert}>Show Alert</button>
    </div>
  );
};

export default Register;
