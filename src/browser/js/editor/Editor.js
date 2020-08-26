import React from "react";
import { connect } from "react-redux";

import {EncryptionModal, FilterModal, BitRateModal} from 'config-editor-tools'

import EditorSection from "./editorBase/EditorSection";

import * as actionsAlert from "../alert/actions";

import Form from "react-jsonschema-form";
import applyNav from "react-jsonschema-form-pagination";
import EditorNavs from "./editorBase/EditorNavs";




class Editor extends React.Component {
  constructor(props) {
    super(props);
  // this.setUpdatedFormData = this.setUpdatedFormData.bind(this)
  
  // this.state = {
  //   formDataTest: {}
  // }  

  this.FormWithNav = applyNav(Form, EditorNavs)


  }

  // setUpdatedFormData = (formData) => {
  //   console.log("we update formData", formData)
  //   this.setState({
  //     formDataTest: formData,
  //   });
  // };



  render() {
    let modalsInfo = [
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

    let Form = this.FormWithNav
    return (
      <EditorSection modalsInfo={modalsInfo} showAlert={this.props.showAlert} 
      Form={Form}
      // setUpdatedFormData={this.setUpdatedFormData}
       />
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
