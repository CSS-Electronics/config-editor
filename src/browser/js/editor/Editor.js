import React from "react";
import { connect } from "react-redux";

import EditorSection from "./EditorSection";

import EncryptionModal from "../editorTools/EncryptionModal";
import FilterModal from "../editorTools/FilterModal";
import BitRateModal from "../editorTools/BitRateModal";
import PartialConfigLoader from "../editorTools/PartialConfigLoader";

class Editor extends React.Component {
  render() {
    const {
      encryptionSidebarOpen,
      filterSidebarOpen,
      bitRateSidebarOpen,
      partialConfigLoaderSidebarOpen,
    } = this.props;

    const modalList = [
      <EncryptionModal />,
      <FilterModal />,
      <BitRateModal />,
      <PartialConfigLoader />,
    ];
    
    const modalsOpen = [
      encryptionSidebarOpen,
      filterSidebarOpen,
      bitRateSidebarOpen,
      partialConfigLoaderSidebarOpen,
    ];

    return (
      <div className="file-explorer">
        <div className={"fe-body fe-body-offline"}>
          <header className="fe-header top-header" />
          <EditorSection modalList={modalList} modalsOpen={modalsOpen} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    encryptionSidebarOpen: state.editorTools.encryptionSidebarOpen,
    filterSidebarOpen: state.editorTools.filterSidebarOpen,
    bitRateSidebarOpen: state.editorTools.bitRateSidebarOpen,
    partialConfigLoaderSidebarOpen:
      state.editorTools.partialConfigLoaderSidebarOpen,
  };
};

export default connect(mapStateToProps, null)(Editor);
