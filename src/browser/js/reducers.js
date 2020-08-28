import { combineReducers } from "redux";
import alert from "./alert/reducer";

import {editor} from 'config-editor-base'

const rootReducer = combineReducers({
  alert,
  editor,
});

export default rootReducer;
