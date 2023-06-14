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

// define editor title and version
const title = TYPE + " config editor"
const version = "v1.8.2"

// define UIschema and Rule Schema names for auto-loading purposes
export const uiSchemaAry = {"CANedge": [
  "uischema-01.06.json | Simple",
  "uischema-01.06.json | Advanced",
  "uischema-01.07.json | Simple",
  "uischema-01.07.json | Advanced",
], "CANmod": []}

export const schemaAry = {"CANedge": [
  "schema-01.06.json | CANedge2",
  "schema-01.06.json | CANedge1",
  "schema-01.07.json | CANedge2",
  "schema-01.07.json | CANedge1",
  "schema-01.07.json | CANedge3 GNSS",
  "schema-01.07.json | CANedge2 GNSS",
  "schema-01.07.json | CANedge1 GNSS",
], "CANmod":[]}

export const demoMode = false

class Editor extends React.Component {
  render() {
    let editorTools = {"CANedge": [
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
    ], "CANmod": []};

    return (
       <div className="file-explorer">
         
         <header className="fe-header top-header">
           <div className="header-text">
           <span className="editor-title">{title}</span><br/>
           <span className="editor-version">{version}</span>
           </div>
           </header>
	   <div className="fe-body fe-body-offline" >
        <AlertContainer />
        <EditorSection
          editorTools={editorTools[TYPE]}
          showAlert={this.props.showAlert}
		      uiSchemaAry={uiSchemaAry[TYPE]}
          schemaAry={schemaAry[TYPE]}
          demoMode={demoMode}
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
