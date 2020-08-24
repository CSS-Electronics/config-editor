import React from "react";
import { connect } from "react-redux";

import Form from "react-jsonschema-form";
import applyNav from "react-jsonschema-form-pagination";
import classNames from "classnames";

import EditorSchemaModal from "./EditorSchemaModal";
import PartialConfigLoader from "./PartialConfigLoader";

import EditorToolButton from "./EditorToolButton";
import ModalWrapper from "./ModalWrapper";

import EditorNavs from "./EditorNavs";
import EditorArrayFieldTemplate from "./EditorArrayFieldTemplate";
import EditorChangesComparison from "./EditorChangesComparison";
import AlertContainer from "../alert/AlertContainer";

import * as actionsEditor from "./actions";
import * as alertActions from "../alert/actions";


const regexRevision = new RegExp("\\d{2}\\.\\d{2}\\.json", "g");
let isDownloadConfig = false;
let activatedTab;


export class EditorSection extends React.Component {
  constructor(props) {
    super(props);
    this.editorForm = React.createRef();
    this.handleUiSchemaChange = this.handleUiSchemaChange.bind(this);
    this.handleSchemaChange = this.handleSchemaChange.bind(this);
    this.handleConfigChange = this.handleConfigChange.bind(this);
    this.handleCompareChanges = this.handleCompareChanges.bind(this);
    this.closeChangesModal = this.closeChangesModal.bind(this);
    this.handleError = this.handleError.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.escFunction = this.escFunction.bind(this);
    this.subMenuBtnClick = this.subMenuBtnClick.bind(this);

    this.state = {
      uischema: "",
      schema: "",
      config: "",
      selectedUISchema: "",
      selectedSchema: "",
      selectedConfig: "",
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

  handleUiSchemaChange(selection) {
    this.setState(
      {
        uischema: selection,
        selectedUISchema: selection,
      },
      () => {
        this.props.fetchUISchemaContent(this.state.uischema);
      }
    );
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

  handleSchemaChange(selection) {
    this.setState(
      {
        schema: selection,
        selectedSchema: selection,
      },
      () => {
        this.props.fetchSchemaContent(this.state.schema);
      }
    );
  }

  handleConfigChange(selection) {
    this.setState(
      {
        config: selection,
        selectedConfig: selection,
      },
      () => {
        this.props.fetchConfigContent(this.state.config, "editor");
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
        selectedSchema: "",
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
        selectedUISchema: uiLocal[0].name,
      });
    }
    if (schemaLocal.length) {
      this.setState({
        selectedSchema: schemaLocal[0].name,
      });
    }
    if (configLocal.length) {
      this.setState({
        selectedConfig: configLocal[0].name,
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
      this.props.showAlert({
        type: "info",
        message: "No Rule Schema has been loaded",
        autoClear: true,
      });
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
    this.props.showAlert({
      type: "danger",
      message:
        "The config contains validation errors (see top of editor) - please review and try again",
      autoClear: true,
    });
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
      modalsInfo,
    } = this.props;

    let FormWithNav = schemaContent ? applyNav(Form, EditorNavs) : Form;

    // Update Select boxes upon a "partial refresh" (pressing Configure while in Configure mode)
    let selectedUISchemaAdj = this.state.selectedUISchema;
    let selectedSchemaAdj = this.state.selectedSchema;
    let selectedConfigAdj = this.state.selectedConfig;

    const testUISchemaLoaded = editorUISchemaFiles.filter((file) =>
      file.name.includes("(local)")
    ).length;
    const testSchemaLoaded = editorSchemaFiles.filter((file) =>
      file.name.includes("(local)")
    ).length;
    const testConfigLoaded = editorConfigFiles.filter((file) =>
      file.name.includes("(local)")
    ).length;

    if (testUISchemaLoaded === 0 && selectedUISchemaAdj.includes("(local)")) {
      selectedUISchemaAdj =
        editorConfigFiles[0] && editorUISchemaFiles[0].name
          ? editorUISchemaFiles[0].name
          : "";
    }

    if (testSchemaLoaded === 0 && selectedSchemaAdj.includes("(local)")) {
      selectedSchemaAdj =
        editorSchemaFiles[0] && editorSchemaFiles[0].name
          ? editorSchemaFiles[0].name
          : selectedSchemaAdj;
    }

    if (testConfigLoaded === 0 && selectedConfigAdj.includes("(local)")) {
      selectedConfigAdj =
        editorConfigFiles[0] && editorConfigFiles[0].name
          ? editorConfigFiles[0].name
          : "";
    }

    // add the default 'base modals' to the modals list
    let modalsInfoFull = modalsInfo.concat(
      {
        name: "partialconfig-modal",
        comment: "Partial config loader",
        class: "fa fa-plus",
        modal: <PartialConfigLoader />,
      },

      {
        name: "schema-modal",
        comment: "Schema & config loader",
        class: "fa fa-cog",
        modal: (
          <EditorSchemaModal
            selectedUISchema={selectedUISchemaAdj}
            selectedSchema={selectedSchemaAdj}
            selectedConfig={selectedConfigAdj}
            editorUISchemaFiles={editorUISchemaFiles}
            editorSchemaFiles={editorSchemaFiles}
            editorConfigFiles={editorConfigFiles}
            handleUiSchemaChange={this.handleUiSchemaChange}
            handleSchemaChange={this.handleSchemaChange}
            handleConfigChange={this.handleConfigChange}
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
            <AlertContainer />

            {modalsInfoFull.map((modal) => (
              <div
                style={{
                  display: modal.name == this.state.activeSideBar ? "" : "none",
                }}
              >
                <ModalWrapper
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
                        "config-bar" +
                        (EDITOR.offline
                          ? " fe-sidebar-shift-offline"
                          : " fe-sidebar-shift")
                      }
                    >
                      <div className="col-xs-1" style={{ minWidth: "120px" }}>
                        <button type="submit" className="btn btn-primary">
                          {" "}
                          Review changes{" "}
                        </button>
                      </div>
                      <div className="col-xs-7" style={{ float: "left" }}>
                        {modalsInfoFull.map((modal) => (
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
                    "config-bar" +
                    (EDITOR.offline
                      ? " fe-sidebar-shift-offline"
                      : " fe-sidebar-shift")
                  }
                >
                  {modalsInfoFull.map((modal) => (
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
    updateConfigFile: (content, object) =>
      dispatch(actionsEditor.updateConfigFile(content, object)),
    fetchConfigContent: (filename, type) =>
      dispatch(actionsEditor.fetchConfigContent(filename, type)),
    fetchSchemaContent: (schema) =>
      dispatch(actionsEditor.fetchSchemaContent(schema)),
    setConfigContent: (content) =>
      dispatch(actionsEditor.setConfigContent(content)),
    fetchUISchemaContent: (uiSchema) =>
      dispatch(actionsEditor.fetchUISchemaContent(uiSchema)),
    saveUpdatedConfiguration: (filename, content) =>
      dispatch(actionsEditor.saveUpdatedConfiguration(filename, content)),
    showAlert: (alert) => dispatch(alertActions.set(alert)),
    setUpdatedFormData: (formData) =>
      dispatch(actionsEditor.setUpdatedFormData(formData)),
    setConfigContentPreSubmit: () =>
      dispatch(actionsEditor.setConfigContentPreSubmit()),
    publicUiSchemaFiles: () => dispatch(actionsEditor.publicUiSchemaFiles())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorSection);
