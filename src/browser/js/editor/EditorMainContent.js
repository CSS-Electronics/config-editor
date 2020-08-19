import React from "react";


import EditorSection from "./EditorSection";
import { pathSlice } from "../utils";
import history from "../history";


class EditorMainContent extends React.Component {
  render() {
    const { bucket, prefix } = pathSlice(history.location.pathname);

    return (
      <div className={"fe-body" + (EDITOR.offline ? " fe-body-offline" : "")}>
        <EditorSection 
          prefixCrnt={prefix}
        />
      </div>
    );
  }
}

export default EditorMainContent;
