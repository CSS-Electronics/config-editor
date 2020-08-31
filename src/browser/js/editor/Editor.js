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

// define UIschema and Rule Schema names for auto-loading purposes
export const uiSchemaAry = [
  "uischema-01.02.json | Simple",
  "uischema-01.02.json | Advanced",
];

export const schemaAry = [
  "schema-01.02.json | CANedge2",
  "schema-01.02.json | CANedge1",
  "schema-00.07.json | CANedge2",
  "schema-00.07.json | CANedge1",
];


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
       <div className="file-explorer">
	   <div className="fe-body fe-body-offline" >
        <AlertContainer />
        <EditorSection
          editorTools={editorTools}
          showAlert={this.props.showAlert}
		  uiSchemaAry={uiSchemaAry}
          schemaAry={schemaAry}
        />
		</div>
      </div>
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
