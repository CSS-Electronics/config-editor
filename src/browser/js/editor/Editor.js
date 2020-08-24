import React from "react";

import EditorSection from "./EditorSection";

import EncryptionModal from "../editorTools/encryptionTool/EncryptionModal";
import FilterModal from "../editorTools/filterTool/FilterModal";
import BitRateModal from "../editorTools/bitRateTool/BitRateModal";

class Editor extends React.Component {
  render() {
    
    let modalsInfo = [
      {
        name: "encryption-modal",
        comment: "Encryption tool",
        class: "fa fa-lock",
        modal: <EncryptionModal />,
      },
      {
        name: "filter-modal",
        comment: "Filter checker",
        class: "fa fa-filter",
        modal: <FilterModal />,
      },
      {
        name: "bitrate-modal",
        comment: "Bit-time calculator",
        class: "fa fa-calculator",
        modal: <BitRateModal />,
      }
    ];

    return <EditorSection modalsInfo={modalsInfo} />;
  }
}

export default Editor;
