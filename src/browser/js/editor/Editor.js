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

    let modalsInfo = [
      {name: "encryption-modal", comment: "Encryption tool", class:"fa fa-lock", modal: <EncryptionModal />},
      {name: "filter-modal", comment: "Filter checker", class:"fa fa-filter", modal: <FilterModal />},
      {name: "bitrate-modal", comment: "Bit-time calculator", class:"fa fa-calculator", modal:<BitRateModal />},
      {name: "partialconfig-modal", comment: "Partial config loader", class:"fa fa-plus", modal:<PartialConfigLoader />}
    ]

    return (
      <div className="file-explorer">
        <div className={"fe-body fe-body-offline"}>
          <header className="fe-header top-header" />
          <EditorSection modalList={modalList} modalsOpen={modalsOpen} modalsInfo={modalsInfo}/>
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
