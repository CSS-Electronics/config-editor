import React from "react";
import { connect } from "react-redux";

import {
  EncryptionModal,
  FilterModal,
  BitRateModal,
} from "config-editor-tools";

import {EditorSection, OBDTool, FilterBuilderTool} from "config-editor-base";

import * as actionsAlert from "../alert/actions";
import AlertContainer from "../alert/AlertContainer";
import packageJson from "../../../../package.json";

// define editor title and version (synced with package.json version)
const title = TYPE + " config editor"
const version = "v" + packageJson.version

// define UIschema and Rule Schema names for auto-loading purposes
export const uiSchemaAry = {"CANedge": [
  "uischema-01.09.json | Simple",
  "uischema-01.09.json | Advanced"
], "CANmod": [
  "uischema-01.03.json | CANmod.gps",
  "uischema-01.04.json | CANmod.gps",
  "uischema-01.04.json | CANmod.input",
  "uischema-01.01.json | CANmod.router",
  "uischema-01.02.json | CANmod.router",
  "uischema-01.04.json | CANmod.temp",
  "uischema-01.05.json | CANmod.temp"
]}

export const schemaAry = {"CANedge": [
  "schema-01.06.json | CANedge2",
  "schema-01.06.json | CANedge1",
  "schema-01.07.json | CANedge2",
  "schema-01.07.json | CANedge1",
  "schema-01.07.json | CANedge3 GNSS",
  "schema-01.07.json | CANedge2 GNSS",
  "schema-01.07.json | CANedge1 GNSS",
  "schema-01.08.json | CANedge2",
  "schema-01.08.json | CANedge1",
  "schema-01.08.json | CANedge3 GNSS",
  "schema-01.08.json | CANedge2 GNSS",
  "schema-01.08.json | CANedge1 GNSS",
  "schema-01.09.json | CANedge2",
  "schema-01.09.json | CANedge1",
  "schema-01.09.json | CANedge3 GNSS",
  "schema-01.09.json | CANedge2 GNSS",
  "schema-01.09.json | CANedge1 GNSS"
], "CANmod": [
  "schema-01.03.json | CANmod.gps",
  "schema-01.04.json | CANmod.gps",
  "schema-01.04.json | CANmod.input",
  "schema-01.01.json | CANmod.router",
  "schema-01.02.json | CANmod.router",
  "schema-01.04.json | CANmod.temp",
  "schema-01.05.json | CANmod.temp"
]}

export const demoMode = DEMO_MODE

class Editor extends React.Component {
  render() {
    let editorTools = {"CANedge": [
      {
        name: "obd-modal",
        comment: "OBD tool",
        class: "fa fa-car",
        modal: <OBDTool showAlert={this.props.showAlert} />,
      },
      {
        name: "filter-builder-modal",
        comment: "Filter builder",
        class: "fa fa-sliders",
        modal: <FilterBuilderTool showAlert={this.props.showAlert} deviceType={TYPE} />,
      },
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
    ], "CANmod": [
      {
        name: "filter-builder-modal",
        comment: "Filter builder",
        class: "fa fa-sliders",
        modal: <FilterBuilderTool showAlert={this.props.showAlert} deviceType={TYPE} />,
      },
    ]};

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
