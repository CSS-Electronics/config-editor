import { combineReducers } from "redux";
import alert from "./alert/reducer";

import editor from "./editor/editorBase/reducer";
import editorTools from "./editorTools/encryptionTool/reducer";


const rootReducer = combineReducers({
  alert,
  editor,
  editorTools
});

export default rootReducer;
