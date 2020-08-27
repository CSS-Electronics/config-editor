// -------------------------------------------------------
// UTILS: Utils for testing schema name validity
export const isValidUISchema = (file) => {
  const regexUiSchema = new RegExp(
    "uischema-\\d{2}\\.\\d{2}\\.json",
    "g"
  );
  return regexUiSchema.test(file);
};

export const isValidSchema = (file) => {
  const regexSchema = new RegExp(
    "schema-\\d{2}\\.\\d{2}\\.json",
    "g"
  );
  return regexSchema.test(file);
};

export const isValidConfig = (file) => {
  const regexConfig = new RegExp(
    "config-\\d{2}\\.\\d{2}\\.json",
    "g"
  );
  return regexConfig.test(file);
};

export const getFileType = (dropdown) => {
  let type = ""
  switch (true) {
    case dropdown == "Presentation Mode":
      type = "uischema"
      break;
    case dropdown == "Rule Schema":
      type = "schema"
      break;
    case dropdown == "Configuration File":
      type = "config"
      break;
    default:
      type = "invalid"
  }
  return type
}