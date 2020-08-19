import React from "react";

import EditorSection from "./EditorSection";


class EditorMainContent extends React.Component {
  render() {
    return (
      <div className={"fe-body" + (EDITOR.offline ? " fe-body-offline" : "")}>
        <header className="fe-header top-header"/>
        <EditorSection />
      </div>
    );
  }
}

export default EditorMainContent;
