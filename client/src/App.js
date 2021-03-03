import { Route } from "react-router-dom";
import "./App.css";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Alertui from "./Components/Layout/Alertui";

function App() {
  return (
    <>
      <Alertui />
      <Route path="/register" exact>
        <Register />
      </Route>
      <Route path="/login" exact>
        <Login />
      </Route>
    </>
  );
}

export default App;
