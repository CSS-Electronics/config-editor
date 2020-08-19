import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";

import EditorMainContent from "./EditorMainContent";
import AlertContainer from "../alert/AlertContainer";

import * as actionsEditor from "./actions";
import EncryptionModal from "../editorTools/EncryptionModal";
import DeviceFileModal from "../editorTools/DeviceFileModal";
import FilterModal from "../editorTools/FilterModal";
import BitRateModal from "../editorTools/BitRateModal";
import PartialConfigLoader from "../editorTools/PartialConfigLoader";

class Editor extends React.Component {
  componentWillMount() {

    const { publicUiSchemaFiles } = this.props;

    publicUiSchemaFiles();
  }

  render() {
    const {
      encryptionSidebarOpen,
      crcSidebarOpen,
      editorSchemaSidebarOpen,
      filterSidebarOpen,
      bitRateSidebarOpen,
      deviceFileTableOpen,
      partialConfigLoaderSidebarOpen
    } = this.props;

    return (
      <div
        className={classNames({
          "file-explorer": true,
          "encryption-padding":
            editorSchemaSidebarOpen ||
            encryptionSidebarOpen ||
            crcSidebarOpen ||
            filterSidebarOpen ||
            bitRateSidebarOpen ||
            partialConfigLoaderSidebarOpen
        })}
      >
        {!EDITOR.offline}
        <EditorMainContent />
        <AlertContainer />
        {encryptionSidebarOpen ? <EncryptionModal /> : null}
        {filterSidebarOpen ? <FilterModal /> : null}
        {bitRateSidebarOpen ? <BitRateModal /> : null}
        {deviceFileTableOpen ? <DeviceFileModal /> : null}
        {partialConfigLoaderSidebarOpen ? <PartialConfigLoader /> : null}

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    encryptionSidebarOpen: state.editorTools.encryptionSidebarOpen,
    editorSchemaSidebarOpen: state.editorTools.editorSchemaSidebarOpen,
    // crcSidebarOpen: state.editorTools.crcSidebarOpen,
    filterSidebarOpen: state.editorTools.filterSidebarOpen,
    bitRateSidebarOpen: state.editorTools.bitRateSidebarOpen,
    deviceFileTableOpen: state.editorTools.deviceFileTableOpen,
    partialConfigLoaderSidebarOpen: state.editorTools.partialConfigLoaderSidebarOpen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    publicUiSchemaFiles: () => dispatch(actionsEditor.publicUiSchemaFiles()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
