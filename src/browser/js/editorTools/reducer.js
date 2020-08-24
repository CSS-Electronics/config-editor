import * as actionsEditorTools from "./actions";

export default (
  state = {
    encryptionSidebarOpen: false,
    filterSidebarOpen: false,
    bitRateSidebarOpen: false,
    partialConfigLoaderSidebarOpen: false,
    crc32EditorLive: "",
    crc32EditorPre: "",
    deviceFileTableOpen: false,
    editorSchemaSidebarOpen: true,
    crcSidebarOpen: false,
    devicePublicKey: "",
    serverPublicKeyBase64: "",
    symmetricKeyBase64: "",
    symmetricKey: "",
    fieldValueEncryptedBase64: ""
  },
  action
) => {
  switch (action.type) {
    case actionsEditorTools.SET_CRC32_EDITOR_LIVE:
      return {
        ...state,
        crc32EditorLive: action.crc32EditorLive
      };
    case actionsEditorTools.SET_CRC32_EDITOR_PRE:
      return {
        ...state,
        crc32EditorPre: action.crc32EditorPre
      };
    case actionsEditorTools.SET_DEVICE_PUBLIC_KEY:
      return {
        ...state,
        devicePublicKey: action.devicePublicKey
      };
    case actionsEditorTools.SET_SERVER_PUBLIC_KEY:
      return {
        ...state,
        serverPublicKeyBase64: action.serverPublicKeyBase64
      };
    case actionsEditorTools.SET_SERVER_SECRET_KEY:
      return {
        ...state,
        serverSecretKey: action.serverSecretKey
      };
    case actionsEditorTools.SET_SYMMETRIC_KEY_BASE64:
      return {
        ...state,
        symmetricKeyBase64: action.symmetricKeyBase64
      };
    case actionsEditorTools.SET_SYMMETRIC_KEY:
      return {
        ...state,
        symmetricKey: action.symmetricKey
      };
    case actionsEditorTools.SET_ENCRYPTED_FIELD:
      return {
        ...state,
        fieldValueEncryptedBase64: action.fieldValueEncryptedBase64
      };
    default:
      return state;
  }
};
