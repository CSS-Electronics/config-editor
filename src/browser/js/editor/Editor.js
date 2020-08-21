import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import EditorSection from "./EditorSection";
import AlertContainer from "../alert/AlertContainer";
import * as actionsEditor from "./actions";


import EncryptionModal from "../editorTools/EncryptionModal";
import FilterModal from "../editorTools/FilterModal";
import BitRateModal from "../editorTools/BitRateModal";
import PartialConfigLoader from "../editorTools/PartialConfigLoader";

class Editor extends React.Component {
  componentWillMount() {
    this.props.publicUiSchemaFiles();
  }

  render() {
    const {
      encryptionSidebarOpen,
      editorSchemaSidebarOpen,
      filterSidebarOpen,
      bitRateSidebarOpen,
      partialConfigLoaderSidebarOpen,
    } = this.props;

    const modalList = [<EncryptionModal/>, <FilterModal/>, <BitRateModal/>, <PartialConfigLoader/>]
    const modalsOpen = [editorSchemaSidebarOpen, filterSidebarOpen,bitRateSidebarOpen, partialConfigLoaderSidebarOpen ]

    let sideBarOpen =
      editorSchemaSidebarOpen ||
      encryptionSidebarOpen ||
      filterSidebarOpen ||
      bitRateSidebarOpen ||
      partialConfigLoaderSidebarOpen;

    return (
      <div
        className={classNames({
          "file-explorer": true,
          "encryption-padding": sideBarOpen
        })}
      >
        <div className={"fe-body fe-body-offline"}>
          <header className="fe-header top-header" />
          <EditorSection 
            modalList={modalList}
            modalsOpen={modalsOpen}
          />
        </div>

        <AlertContainer />

        {/* {modalList.map((modal, idx) => modalsOpen[idx] ? modal : null)} */}

        {encryptionSidebarOpen ? <EncryptionModal /> : null}
        {filterSidebarOpen ? <FilterModal /> : null}
        {bitRateSidebarOpen ? <BitRateModal /> : null}
        {partialConfigLoaderSidebarOpen ? <PartialConfigLoader /> : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    encryptionSidebarOpen: state.editorTools.encryptionSidebarOpen,
    editorSchemaSidebarOpen: state.editorTools.editorSchemaSidebarOpen,
    filterSidebarOpen: state.editorTools.filterSidebarOpen,
    bitRateSidebarOpen: state.editorTools.bitRateSidebarOpen,
    partialConfigLoaderSidebarOpen:
      state.editorTools.partialConfigLoaderSidebarOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    publicUiSchemaFiles: () => dispatch(actionsEditor.publicUiSchemaFiles()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
