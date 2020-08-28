import "./less/main.less";
import "../../font-awesome/css/font-awesome.css";
import "./css/diff2html.min.css"

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import configureStore from "./js/store/configure-store";
import App from "./js/App";

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
      <App />
  </Provider>,
  document.getElementById("root")
);