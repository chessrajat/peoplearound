
import { combineReducers } from "redux";
import AlertReducer from "./AlertReducer";


const rootReducer = combineReducers({
    alert:AlertReducer
});

export default rootReducer;
