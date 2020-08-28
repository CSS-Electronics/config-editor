import React from "react";
import { connect } from "react-redux";

import {
  EncryptionModal,
  FilterModal,
  BitRateModal,
} from "config-editor-tools";

import {EditorSection} from "config-editor-base";

import * as actionsAlert from "../alert/actions";
import AlertContainer from "../alert/AlertContainer";

class Editor extends React.Component {
  render() {
    let editorTools = [
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
      <React.Fragment>
        <AlertContainer />
        <EditorSection
          editorTools={editorTools}
          showAlert={this.props.showAlert}
        />
      </React.Fragment>
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
