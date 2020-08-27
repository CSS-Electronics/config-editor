import React from "react";
import { connect } from "react-redux";
import * as actionsEditor from "../editorBase/actions";
import EditorDropdown from "./EditorDropdown";

class EditorSchemaModal extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.resetFiles()
  }

  render() {
    const {
      editorUISchemaFiles,
      editorSchemaFiles,
      editorConfigFiles,
      handleUplodedUISchema,
      handleUploadedSchema,
      handleUploadedConfig,
      selecteduischema,
      selectedschema,
      selectedconfig,
      handleDropdownChange
    } = this.props;

    return (
      <div>
        <h4>Schema & config loader</h4>

        <EditorDropdown
          options={editorUISchemaFiles}
          name="Presentation Mode"
          selected={selecteduischema}
          onChange={handleDropdownChange}
          handleUploadedFile={handleUplodedUISchema}
          customBackground={true}
          comment="The UIschema affects the visual presentation of the editor. It does not impact the Configuration File. It can also be used to hide e.g. advanced settings via a Simple variant - or show all settings via an Advanced variant."
        />
        <EditorDropdown
          options={editorSchemaFiles}
          name="Rule Schema"
          selected={selectedschema}
          onChange={handleDropdownChange}
          handleUploadedFile={handleUploadedSchema}
          customBackground={true}
          comment="The Rule Schema serves as a guide for populating the Configuration File - and for automatically validating a Configuration File."
        /><hr/>
        <EditorDropdown
          options={editorConfigFiles}
          name="Configuration File"
          selected={selectedconfig}
          onChange={handleDropdownChange}
          handleUploadedFile={handleUploadedConfig}
          comment="The Configuration File contains the settings that will be used on the device. You can upload a new Configuration File via the dropdown to modify it using the editor."
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleUplodedUISchema: file =>
      dispatch(actionsEditor.handleUploadedUISchema(file)),
    handleUploadedSchema: file =>
      dispatch(actionsEditor.handleUploadedSchema(file)),
    handleUploadedConfig: file =>
      dispatch(actionsEditor.handleUploadedConfig(file)),
    resetFiles: () => dispatch(actionsEditor.resetFiles())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(EditorSchemaModal);
