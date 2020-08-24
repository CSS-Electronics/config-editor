import saveAs from "file-saver";
import * as alertActions from "../../alert/actions";

export const SET_SCHEMA_LIST = "editor/SET_SCHEMA_LIST";
export const SET_CONFIG_LIST = "editor/SET_CONFIG_LIST";
export const SET_UISCHEMA_LIST = "editor/SET_UISCHEMA_LIST";
export const RESET_SCHEMA_LIST = "editor/RESET_SCHEMA_LIST";
export const RESET_UISCHEMA_LIST = "editor/RESET_UISCHEMA_LIST";
export const RESET_CONFIG_LIST = "editor/RESET_CONFIG_LIST";
export const RESET_LOCAL_UISCHEMA_LIST = "editor/RESET_LOCAL_UISCHEMA_LIST";
export const RESET_LOCAL_SCHEMA_LIST = "editor/RESET_LOCAL_SCHEMA_LIST";
export const RESET_LOCAL_CONFIG_LIST = "editor/RESET_LOCAL_CONFIG_LIST";
export const SET_CONFIG_DATA = "editor/SET_CONFIG_DATA";
export const SET_UI_SCHEMA_DATA = "editor/SET_UI_SCHEMA_DATA";
export const SET_SCHEMA_DATA = "editor/SET_SCHEMA_DATA";
export const SET_UPDATED_CONFIG = "editor/SET_UPDATED_CONFIG";
export const RESET_SCHEMA_FILES = "editor/RESET_SCHEMA_FILES";
export const RESET_UPLOADED_SCHEMA_LIST = "editor/RESET_UPLOADED_SCHEMA_LIST";
export const SET_CONFIG_DATA_PRE_CHANGE = "editor/SET_CONFIG_DATA_PRE_CHANGE";
export const SET_UPDATED_FORM_DATA = "editor/SET_UPDATED_FORM_DATA";
export const SET_ACTIVE_NAV = "editor/SET_ACTIVE_NAV";
export const SET_UISCHEMA_SOURCE = "editor/SET_UISCHEMA_SOURCE";
export const SET_CONFIG_DATA_LOCAL = "SET_CONFIG_DATA_LOCAL";
export const SET_CRC32_EDITOR_LIVE = "SET_CRC32_EDITOR_LIVE";

// Toggle demo mode on/off
const demoMode = false;

// Note: These need to be updated with future firmware revisions
const uiSchemaAry = [
  "uischema-01.02.json | Simple",
  "uischema-01.02.json | Advanced",
];

const schemaAry = [
  "schema-01.02.json | CANedge2",
  "schema-01.02.json | CANedge1",
  "schema-01.02.json | CANedge2",
  "schema-01.02.json | CANedge1",
  "schema-00.07.json | CANedge2",
  "schema-00.07.json | CANedge1",
];

// -------------------------------------------------------
// UTILS: Utils for testing schema name validity
const isValidUISchema = (file) => {
  const regexUiSchema = new RegExp(
    "(^server_|^)uischema-\\d{2}\\.\\d{2}\\.json",
    "g"
  );
  return regexUiSchema.test(file);
};

const isValidSchema = (file) => {
  const regexSchema = new RegExp(
    "(^([0-9A-Fa-f]){8}_|server_|^)schema-\\d{2}\\.\\d{2}\\.json",
    "g"
  );
  return regexSchema.test(file);
};

const isValidConfig = (file) => {
  const regexConfig = new RegExp(
    "(^([0-9A-Fa-f]){8}_|server_|^)config-\\d{2}\\.\\d{2}\\.json",
    "g"
  );
  return regexConfig.test(file);
};

const regexUISchemaPublic = new RegExp(
  /^uischema-\d{2}\.\d{2}\.json \| (Advanced|Simple)$/,
  "g"
);

// -------------------------------------------------------
// CRC32: Calculate crc32 of Configuration File
const { detect } = require("detect-browser");
const browser = detect();

let crcBrowserSupport = [
  "chrome",
  "firefox",
  "opera",
  "safari",
  "edge",
].includes(browser.name);

export const calcCrc32EditorLive = () => {
  return function (dispatch, getState) {
    let formData = getState().editor.formData;

    if (crcBrowserSupport == 1 && formData) {
      const { crc32 } = require("crc");
      let crc32EditorLive = crc32(JSON.stringify(formData, null, 2))
        .toString(16)
        .toUpperCase()
        .padStart(8, "0");

      dispatch(setCrc32EditorLive(crc32EditorLive));
    } else {
      let crc32EditorLive = `N/A`;
      dispatch(setCrc32EditorLive(crc32EditorLive));
    }
  };
};

export const setCrc32EditorLive = (crc32EditorLive) => ({
  type: SET_CRC32_EDITOR_LIVE,
  crc32EditorLive,
});

// -------------------------------------------------------
// UISCHEMA: load the Simple/Advanced default UIschema in the online & offline editor
export const publicUiSchemaFiles = () => {
  return function (dispatch) {
    dispatch(loadUISchemaSimpleAdvanced());

    // If demoMode, load the Rule Schema by default for use in the online simple editor
    if (demoMode) {
      dispatch(publicSchemaFiles("config-01.02.json"));
    }
  };
};

// load both a simple/advanced UIschema
export const loadUISchemaSimpleAdvanced = () => {
  return function (dispatch) {
    dispatch(resetUISchemaList());

    const defaultUiSchema = uiSchemaAry[0];

    const defaultUiSchemaContent = require(`../../../schema/${
      defaultUiSchema.split(" | ")[1]
    }/${defaultUiSchema.split(" ")[0]}`);

    dispatch(setUISchemaFile(uiSchemaAry));
    dispatch(setUISchemaContent(defaultUiSchemaContent));
  };
};

export const fetchUISchemaContent = (fileName) => {
  return function (dispatch) {
    dispatch(setConfigContentPreSubmit());
    dispatch(resetLocalUISchemaList());
    switch (true) {
      case fileName == "None" || fileName == undefined:
        dispatch(setUISchemaContent(null));
        break;
      case fileName.match(regexUISchemaPublic) != null:
        const uiSchemaPublic = require(`../../../schema/${
          fileName.split(" | ")[1]
        }/${fileName.split(" ")[0]}`);
        dispatch(setUISchemaContent(uiSchemaPublic));
        break;
    }
  };
};

export const handleUploadedUISchma = (file) => {
  return function (dispatch) {
    if (isValidUISchema(file.name)) {
      let fileReader = new FileReader();
      fileReader.onloadend = (e) => {
        const content = fileReader.result;
        const fileNameShort = file.name.split("_")[1]
          ? file.name.split("_")[1]
          : file.name.split("_")[0];
        try {
          dispatch(setUISchemaContent(JSON.parse(content)));
          dispatch(resetLocalUISchemaList());
          dispatch(setUISchemaFile([`${fileNameShort} (local)`]));
        } catch (error) {
          dispatch(
            alertActions.set({
              type: "danger",
              message: `Warning: UISchema ${file.name} is invalid and was not loaded`,
              autoClear: true,
            })
          );
        }
      };
      fileReader.readAsText(file);
    } else {
      dispatch(
        alertActions.set({
          type: "danger",
          message: `${file.name} is an invalid file/filename`,
          autoClear: true,
        })
      );
    }
  };
};

export const setUISchemaFile = (UISchemaFiles) => ({
  type: SET_UISCHEMA_LIST,
  UISchemaFiles: UISchemaFiles.map((file, index) => ({
    name: file,
    selected: index == 0 ? true : false,
  })),
});

export const resetUISchemaList = () => ({
  type: RESET_UISCHEMA_LIST,
  UISchemaFiles: [],
});

export const setUISchemaContent = (uiContent) => {
  return {
    type: SET_UI_SCHEMA_DATA,
    uiContent,
  };
};

export const resetLocalUISchemaList = () => ({
  type: RESET_LOCAL_UISCHEMA_LIST,
});

// -------------------------------------------------------
// RULE SCHEMA: load the relevant Rule Schema file when a user uploads a config file (based on revision)
export const publicSchemaFiles = (selectedConfig) => {
  return function (dispatch) {
    dispatch(resetSchemaFiles());

    if (selectedConfig) {
      let schemaAryFiltered = schemaAry.filter((e) =>
        e.includes(selectedConfig.substr(7, 5))
      );

      if (demoMode) {
        schemaAryFiltered = schemaAry.filter((e) => e.includes("CANedge1"));
      }

      let defaultSchema = schemaAryFiltered[0];

      if (defaultSchema) {
        const schemaPublic = require(`../../../schema/${
          defaultSchema.split(" | ")[1]
        }/${defaultSchema.split(" ")[0]}`);

        dispatch(setSchemaFile(schemaAryFiltered));
        dispatch(setSchemaContent(schemaPublic));
      }
    }
  };
};

// This is run when uploading a schema file
export const handleUploadedSchema = (file) => {
  return function (dispatch) {
    if (isValidSchema(file.name)) {
      let fileReader = new FileReader();
      fileReader.onloadend = (e) => {
        const content = fileReader.result;
        const fileNameShort = file.name.split("_")[1]
          ? file.name.split("_")[1]
          : file.name.split("_")[0];
        try {
          dispatch(setSchemaContent(JSON.parse(content)));
          dispatch(resetLocalSchemaList());
          dispatch(setSchemaFile([`${fileNameShort} (local)`]));
        } catch (error) {
          dispatch(
            alertActions.set({
              type: "danger",
              message: `Warning: Schema ${file.name} is invalid and was not loaded`,
              autoClear: true,
            })
          );
        }
      };
      fileReader.readAsText(file);
    } else {
      dispatch(
        alertActions.set({
          type: "danger",
          message: `${file.name} is an invalid file/filename`,
          autoClear: true,
        })
      );
    }
  };
};

export const setSchemaFile = (schemaFiles) => ({
  type: SET_SCHEMA_LIST,
  schemaFiles: schemaFiles.map((file, index) => ({
    name: file,
    selected: index == 0 ? true : false,
  })),
});

export const resetSchemaFiles = () => ({
  type: RESET_SCHEMA_LIST,
  schemaFiles: [],
});

export const setSchemaContent = (schemaContent) => ({
  type: SET_SCHEMA_DATA,
  schemaContent,
});

export const resetFiles = () => ({
  type: RESET_SCHEMA_FILES,
  reset: true,
});

export const resetLocalSchemaList = () => ({
  type: RESET_LOCAL_SCHEMA_LIST,
});

export const resetUploadedSchemaList = () => ({
  type: RESET_UPLOADED_SCHEMA_LIST,
});

// -------------------------------------------------------
// CONFIGURATION FILE:
export const fetchConfigContent = (fileName, type) => {
  return function (dispatch, getState) {
    if (fileName && fileName.includes("(local)")) {
      if (type == "review") {
        dispatch(
          setConfigContentPreChange(getState().editor.configContentLocal)
        );
      }
      return;
    }
    if (type == "editor") {
      dispatch(resetLocalConfigList());
    }

    if (fileName == "None" && type == "editor") {
      dispatch(setConfigContent(null));
      dispatch(setUpdatedFormData(null));
      dispatch(setConfigContentPreChange(""));
    } else if (fileName == "None" && type == "review") {
      dispatch(setConfigContentPreChange(""));
    }
  };
};

// handle when the user uploads a configuration file
export const handleUploadedConfig = (file) => {
  return function (dispatch, getState) {
    // load the matching schema files if a schema file is not already uploaded
    const localLoaded =
      getState().editor.editorSchemaFiles[0] &&
      getState().editor.editorSchemaFiles[0].name.includes("local");

    if (file && file.name && file.name.length && !localLoaded) {
      dispatch(publicSchemaFiles(file.name));
    }
    if (isValidConfig(file.name)) {
      let fileReader = new FileReader();
      fileReader.onloadend = (e) => {
        const content = fileReader.result;
        const fileNameShort = file.name.split("_")[1]
          ? file.name.split("_")[1]
          : file.name.split("_")[0];
        try {
          const jsonContent = JSON.parse(content);
          dispatch(setConfigContentLocal(content));
          dispatch(setConfigContent(jsonContent));
          dispatch(resetLocalConfigList());
          dispatch(setConfigFile([`${fileNameShort} (local)`]));
          dispatch(setUpdatedFormData(jsonContent));
          dispatch(setConfigContentPreChange(content));
        } catch (error) {
          dispatch(
            alertActions.set({
              type: "danger",
              message: `Warning: Config ${file.name} is invalid and was not loaded`,
              autoClear: true,
            })
          );
        }
      };
      fileReader.readAsText(file);
    } else {
      dispatch(
        alertActions.set({
          type: "danger",
          message: `${file.name} is an invalid file/filename`,
          autoClear: true,
        })
      );
    }
  };
};

export const setConfigFile = (configFiles) => ({
  type: SET_CONFIG_LIST,
  configFiles: configFiles.map((file, index) => ({
    name: file,
    selected: index == 0 ? true : false,
  })),
});

export const saveUpdatedConfiguration = (filename, content) => {
  return function (dispatch) {
    dispatch(setConfigContent(content));
    let blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "text/json",
    });
    saveAs(blob, `${filename}`);
  };
};

export const setUpdatedFormData = (formData) => {
  return function (dispatch) {
    dispatch(setUpdatedFormDataValue(formData));
    dispatch(calcCrc32EditorLive());
  };
};

export const setUpdatedFormDataValue = (formData) => {
  return {
    type: SET_UPDATED_FORM_DATA,
    formData,
  };
};

export const setConfigContentPreSubmit = () => {
  return function (dispatch, getState) {
    dispatch(setConfigContent(getState().editor.formData));
  };
};

export const setConfigContentPreChange = (configContentPreChange) => ({
  type: SET_CONFIG_DATA_PRE_CHANGE,
  configContentPreChange,
});

export const setConfigContentLocal = (configContentLocal) => ({
  type: SET_CONFIG_DATA_LOCAL,
  configContentLocal,
});

export const setConfigContent = (configContent) => ({
  type: SET_CONFIG_DATA,
  configContent,
});

export const setUpdatedConfig = () => ({
  type: SET_UPDATED_CONFIG,
  configUpdate: true,
});

export const resetConfigFiles = () => ({
  type: RESET_CONFIG_LIST,
  configFiles: [],
});

export const resetLocalConfigList = () => ({
  type: RESET_LOCAL_CONFIG_LIST,
});

// -------------------------------------------------------
// OTHER:
export const showValidationAlert = () => {
  return function (dispatch) {
    dispatch(
      alertActions.set({
        type: "danger",
        message: `Warning: The updated configuration contains validation errors - please review and try again`,
        autoClear: true,
      })
    );
  };
};