import React from "react";
import { connect } from "react-redux";

import Form from "react-jsonschema-form";
import applyNav from "react-jsonschema-form-pagination";
import classNames from "classnames";

import EditorSchemaModal from "../editorBaseTools/EditorSchemaModal";
import PartialConfigLoader from "../editorBaseTools/PartialConfigLoader";

import EditorToolButton from "../editorBaseTools/EditorToolButton";
import EditorToolModalWrapper from "../editorBaseTools/EditorToolModalWrapper";

import EditorNavs from "./EditorNavs";
import EditorArrayFieldTemplate from "./EditorArrayFieldTemplate";
import EditorChangesComparison from "./EditorChangesComparison";

import * as actionsEditor from "./actions";
import {getFileType} from "./utils"

const regexRevision = new RegExp("\\d{2}\\.\\d{2}\\.json", "g");
let isDownloadConfig = false;
let activatedTab;



export class EditorSection extends React.Component {
  constructor(props) {
    super(props);
    this.editorForm = React.createRef();
    this.handleCompareChanges = this.handleCompareChanges.bind(this);
    this.closeChangesModal = this.closeChangesModal.bind(this);
    this.handleError = this.handleError.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.escFunction = this.escFunction.bind(this);
    this.subMenuBtnClick = this.subMenuBtnClick.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this)

    this.state = {
      uischema: "",
      schema: "",
      config: "",
      selecteduischema: "",
      selectedschema: "",
      selectedconfig: "",
      configReview: { value: "None", label: "None" },
      revisedConfigFile: {},
      formData: {},
      changeFlag: true,
      isSubmitting: false,
      isDownloadConfig: false,
      isCompareChanges: false,
      activeSideBar: "schema-modal",
    };

    this.input = "";
  }

  escFunction(event) {
    if (event.keyCode === 27) {
      this.closeChangesModal();
    }
  }

  subMenuBtnClick(name) {
    let sideBar = this.state.activeSideBar == name ? "none" : name;

    this.setState(
      {
        activeSideBar: sideBar,
      },
      () => {
        this.props.setConfigContentPreSubmit();
      }
    );
  }

  handleDropdownChange(selection, dropdown){
    const fileType = getFileType(dropdown)
    this.setState(
      {
        [fileType]: selection,
        ["selected" + fileType]: selection,
      },
      () => {
        this.props.fetchFileContent(selection, fileType);
      }
    );
  }

  handleReviewConfigChange(selection) {
    this.setState(
      {
        configReview: selection,
      },
      () => {
        this.props.fetchConfigContent(selection.value, "review");
      }
    );
  }

  handleCompareChanges(e) {
    this.setState({
      isCompareChanges: !this.state.isCompareChanges,
    });
  }

  closeChangesModal(e) {
    this.setState({
      isCompareChanges: false,
    });
    document.body.style.overflow = "auto";
  }

  enableDownload() {
    isDownloadConfig = true;
  }

  componentWillMount() {
    this.props.publicUiSchemaFiles();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction, false);
  }

  componentWillUnMount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  componentWillReceiveProps(nextProps) {
    // ensure that if there's a new schema file list, the selection returns to the default value
    if (this.props.editorSchemaFiles != nextProps.editorSchemaFiles) {
      this.setState({
        schema: "",
        selectedschema: "",
      });
    }

    let uiLocal = nextProps.editorUISchemaFiles.filter((file) =>
      file.name.includes("(local)")
    );
    let schemaLocal = nextProps.editorSchemaFiles.filter((file) =>
      file.name.includes("(local)")
    );
    let configLocal = nextProps.editorConfigFiles.filter((file) =>
      file.name.includes("(local)")
    );

    if (uiLocal.length) {
      this.setState({
        selecteduischema: uiLocal[0].name,
      });
    }
    if (schemaLocal.length) {
      this.setState({
        selectedschema: schemaLocal[0].name,
      });
    }
    if (configLocal.length) {
      this.setState({
        selectedconfig: configLocal[0].name,
      });
    }

    // Get the initial value for the config review benchmark dropdown
    if (nextProps.editorConfigFiles.length == 0) {
      this.setState(
        {
          configReview: { value: "None", label: "None" },
        },
        () => {
          // this.props.fetchConfigContent(configName, "review");
        }
      );
    }
    if (
      this.props.editorConfigFiles.length !=
        nextProps.editorConfigFiles.length &&
      nextProps.editorConfigFiles[0] &&
      nextProps.editorConfigFiles[0].name
    ) {
      let configName = configLocal.length
        ? configLocal[0].name
        : nextProps.editorConfigFiles[0].name;

      this.setState(
        {
          configReview: { value: configName, label: configName },
        },
        () => {
          this.props.fetchConfigContent(configName, "review");
        }
      );
    }
  }

  onSubmit({ formData }) {
    if (
      this.props.schemaContent == undefined ||
      this.props.schemaContent == null
    ) {
      this.props.showAlert("info", "No Rule Schema has been loaded");
      return;
    }

    let checkSchemaList = this.props.editorSchemaFiles.length
      ? this.props.editorSchemaFiles[0].name
      : null;

    const checkSchemaUpload = this.props.editorSchemaFiles.filter((file) =>
      file.name.includes("(local)")
    );
    let checkUpload = null;

    if (checkSchemaUpload.length) {
      checkUpload = checkSchemaUpload[0].name.split(" ")[0];
    }

    this.setState(
      {
        uischema: this.state.uischema
          ? this.state.uischema
          : this.props.editorUISchemaFiles.length
          ? this.props.editorUISchemaFiles[0].key
          : null,
        schema: checkUpload
          ? checkUpload
          : this.state.schema
          ? this.state.schema
          : checkSchemaList,
        config: this.state.config
          ? this.state.config
          : this.props.editorConfigFiles.length
          ? this.props.editorConfigFiles[0].name
          : null,
        formData,
        isSubmitting: true,
      },
      () => {
        let tempJson = JSON.stringify(formData, null, 2);
        this.props.setConfigContent(JSON.parse(tempJson));

        let revisedConfigFileSchema = this.state.schema;

        let revisedConfigFile = `config-${revisedConfigFileSchema.match(
          regexRevision
        )}`;

        if (this.state.isCompareChanges === false) {
          this.setState({
            isCompareChanges: true,
            revisedConfigFile: {
              value: revisedConfigFile,
              label: revisedConfigFile,
            },
          });
          document.body.style.overflow = "hidden";
        } else {
          if (isDownloadConfig) {
            this.props.saveUpdatedConfiguration(revisedConfigFile, formData);
            isDownloadConfig = false;
            document.body.style.overflow = "auto";
            this.setState({
              isCompareChanges: false,
            });
          }
        }
      }
    );
  }

  handleError(errors) {
    isDownloadConfig = false;
    this.props.showAlert(
      "danger",
      "The config contains validation errors (see top of editor) - please review and try again"
    );
  }

  handleChange = ({ formData }) => {
    this.props.setUpdatedFormData(formData);
  };

  onNavChange = (nav) => {
    activatedTab = nav[0];
  };

  render() {
    const {
      editorSchemaFiles,
      editorConfigFiles,
      editorUISchemaFiles,
      configContent,
      uiContent,
      schemaContent,
      editorTools,
    } = this.props;

    let FormWithNav = schemaContent ? applyNav(Form, EditorNavs) : Form;

    // Update Select boxes upon a "partial refresh" (pressing Configure while in Configure mode)
    let selecteduischemaAdj = this.state.selecteduischema;
    let selectedschemaAdj = this.state.selectedschema;
    let selectedconfigAdj = this.state.selectedconfig;

    const testUISchemaLoaded = editorUISchemaFiles.filter((file) =>
      file.name.includes("(local)")
    ).length;
    const testSchemaLoaded = editorSchemaFiles.filter((file) =>
      file.name.includes("(local)")
    ).length;
    const testConfigLoaded = editorConfigFiles.filter((file) =>
      file.name.includes("(local)")
    ).length;

    if (testUISchemaLoaded === 0 && selecteduischemaAdj.includes("(local)")) {
      selecteduischemaAdj =
        editorConfigFiles[0] && editorUISchemaFiles[0].name
          ? editorUISchemaFiles[0].name
          : "";
    }

    if (testSchemaLoaded === 0 && selectedschemaAdj.includes("(local)")) {
      selectedschemaAdj =
        editorSchemaFiles[0] && editorSchemaFiles[0].name
          ? editorSchemaFiles[0].name
          : selectedschemaAdj;
    }

    if (testConfigLoaded === 0 && selectedconfigAdj.includes("(local)")) {
      selectedconfigAdj =
        editorConfigFiles[0] && editorConfigFiles[0].name
          ? editorConfigFiles[0].name
          : "";
    }

    // add the default 'base modals' to the modals list
    let editorToolsFull = editorTools.concat(
      {
        name: "partialconfig-modal",
        comment: "Partial config loader",
        class: "fa fa-plus",
        modal: <PartialConfigLoader showAlert={this.props.showAlert} />,
      },

      {
        name: "schema-modal",
        comment: "Schema & config loader",
        class: "fa fa-cog",
        modal: (
          <EditorSchemaModal
            selecteduischema={selecteduischemaAdj}
            selectedschema={selectedschemaAdj}
            selectedconfig={selectedconfigAdj}
            editorUISchemaFiles={editorUISchemaFiles}
            editorSchemaFiles={editorSchemaFiles}
            editorConfigFiles={editorConfigFiles}
            handleDropdownChange={this.handleDropdownChange}
          />
        ),
      }
    );

    return (
      <div className="file-explorer">
        <div className={"fe-body fe-body-offline"}>
          <header className="fe-header top-header" />
          <div
            className={classNames({
              "fe-header config-editor": true,
              "encryption-padding": this.state.activeSideBar != "none",
            })}
          >
            {editorToolsFull.map((modal) => (
              <div
                style={{
                  display: modal.name == this.state.activeSideBar ? "" : "none",
                }}
              >
                <EditorToolModalWrapper
                  modal={modal.modal}
                  onClick={() => this.subMenuBtnClick("none")}
                />
              </div>
            ))}

            <div>
              <br />
              <br />
              <br />
              <br />
              {schemaContent ? (
                <div>
                  <FormWithNav
                    omitExtraData={true}
                    liveOmit={true}
                    liveValidate={true}
                    noHtml5Validate={true}
                    schema={schemaContent ? schemaContent : {}}
                    uiSchema={uiContent ? uiContent : {}}
                    formData={configContent ? configContent : {}}
                    onSubmit={this.onSubmit}
                    onChange={this.handleChange}
                    onError={this.handleError}
                    onNavChange={this.onNavChange.bind(this)}
                    ArrayFieldTemplate={EditorArrayFieldTemplate}
                    activeNav={activatedTab}
                  >
                    <div
                      className={
                        this.state.isCompareChanges
                          ? "show modal-custom-wrapper"
                          : "hidden modal-custom-wrapper"
                      }
                    >
                      <div
                        className={
                          this.state.isCompareChanges
                            ? "show modal-custom"
                            : "hidden modal-custom"
                        }
                      >
                        <EditorChangesComparison
                          revisedConfigFile={this.state.revisedConfigFile}
                          options={editorConfigFiles}
                          selected={this.state.configReview}
                          handleReviewConfigChange={this.handleReviewConfigChange.bind(
                            this
                          )}
                          closeChangesModal={this.closeChangesModal}
                        />
                        <div className="modal-custom-footer">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={true}
                          >
                            {" "}
                            Submit to S3{" "}
                          </button>{" "}
                          <button
                            type="submit"
                            onClick={this.enableDownload.bind(this)}
                            className="btn btn-primary ml15"
                          >
                            {" "}
                            Download to disk{" "}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      className={
                        "config-bar fe-sidebar-shift-offline"}
                    >
                      <div className="col-xs-1" style={{ minWidth: "120px" }}>
                        <button type="submit" className="btn btn-primary">
                          {" "}
                          Review changes{" "}
                        </button>
                      </div>
                      <div className="col-xs-7" style={{ float: "left" }}>
                        {editorToolsFull.map((modal) => (
                          <EditorToolButton
                            onClick={() => this.subMenuBtnClick(modal.name)}
                            comment={modal.comment}
                            className={modal.class}
                          />
                        ))}
                      </div>
                    </div>
                  </FormWithNav>
                </div>
              ) : (
                <div
                  className={
                    "config-bar fe-sidebar-shift-offline"
                  }
                >
                  {editorToolsFull.map((modal) => (
                    <EditorToolButton
                      onClick={() => this.subMenuBtnClick(modal.name)}
                      comment={modal.comment}
                      className={modal.class}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    editorSchemaFiles: state.editor.editorSchemaFiles,
    editorConfigFiles: state.editor.editorConfigFiles,
    editorUISchemaFiles: state.editor.editorUISchemaFiles,
    configContent: state.editor.configContent,
    uiContent: state.editor.uiContent,
    schemaContent: state.editor.schemaContent,
    configUpdate: state.editor.configUpdate,
    configContentPreChange: state.editor.configContentPreChange,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchFileContent: (fileName, fileType) =>
    dispatch(actionsEditor.fetchFileContent(fileName, fileType)),
    fetchConfigContent: (filename, type) =>
      dispatch(actionsEditor.fetchConfigContent(filename, type)),
    setConfigContent: (content) =>
      dispatch(actionsEditor.setConfigContent(content)),
    saveUpdatedConfiguration: (filename, content) =>
      dispatch(actionsEditor.saveUpdatedConfiguration(filename, content)),
    setUpdatedFormData: (formData) =>
      dispatch(actionsEditor.setUpdatedFormData(formData)),
    setConfigContentPreSubmit: () =>
      dispatch(actionsEditor.setConfigContentPreSubmit()),
    publicUiSchemaFiles: () => dispatch(actionsEditor.publicUiSchemaFiles()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorSection);
