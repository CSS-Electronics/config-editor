import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";

import EditorMainContent from "./EditorMainContent";
import AlertContainer from "../alert/AlertContainer";

import * as actionsEditor from "./actions";
import EncryptionModal from "../editorTools/EncryptionModal";
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
      editorSchemaSidebarOpen,
      filterSidebarOpen,
      bitRateSidebarOpen,
      partialConfigLoaderSidebarOpen
    } = this.props;

    return (
      <div
        className={classNames({
          "file-explorer": true,
          "encryption-padding":
            editorSchemaSidebarOpen ||
            encryptionSidebarOpen ||
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
        {partialConfigLoaderSidebarOpen ? <PartialConfigLoader /> : null}

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    encryptionSidebarOpen: state.editorTools.encryptionSidebarOpen,
    editorSchemaSidebarOpen: state.editorTools.editorSchemaSidebarOpen,
    filterSidebarOpen: state.editorTools.filterSidebarOpen,
    bitRateSidebarOpen: state.editorTools.bitRateSidebarOpen,
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
