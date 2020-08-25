import React from "react";
import { connect } from "react-redux";

import EditorSection from "./editorBase/EditorSection";

import EncryptionModal from "../editorTools/encryptionTool/EncryptionModal";
import FilterModal from "../editorTools/filterTool/FilterModal";
import BitRateModal from "../editorTools/bitRateTool/BitRateModal";

import * as actionsAlert from "../alert/actions";

class Editor extends React.Component {
  render() {
    let modalsInfo = [
      {
        name: "encryption-modal",
        comment: "Encryption tool",
        class: "fa fa-lock",
        modal: <EncryptionModal showAlert={this.props.showAlert} />,
      },
      {
        name: "filter-modal",
        comment: "Filter checker",
        class: "fa fa-filter",
        modal: <FilterModal showAlert={this.props.showAlert} />,
      },
      {
        name: "bitrate-modal",
        comment: "Bit-time calculator",
        class: "fa fa-calculator",
        modal: <BitRateModal showAlert={this.props.showAlert} />,
      },
    ];

    return (
      <EditorSection modalsInfo={modalsInfo} showAlert={this.props.showAlert} />
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAlert: (type, message) =>
      dispatch(actionsAlert.set({ type: type, message: message })),
  };
};

export default connect(null, mapDispatchToProps)(Editor);
