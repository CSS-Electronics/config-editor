/*
 * MinIO Cloud Storage (C) 2016, 2018 MinIO, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const demoMode = false 
export const demoDate = '2020.03.25 13:46:32'


export const isValidUISchema = file => {
  const regexUiSchema = new RegExp(
    "(^server_|^)uischema-\\d{2}\\.\\d{2}\\.json",
    "g"
  );
  return regexUiSchema.test(file);
};


export const isValidSchema = file => {
  const regexSchema = new RegExp(
    "(^([0-9A-Fa-f]){8}_|server_|^)schema-\\d{2}\\.\\d{2}\\.json",
    "g"
  );
  return regexSchema.test(file);
};

export const isValidConfig = file => {
  const regexConfig = new RegExp(
    "(^([0-9A-Fa-f]){8}_|server_|^)config-\\d{2}\\.\\d{2}\\.json",
    "g"
  );
  return regexConfig.test(file);
};

export const isValidDevice = device => {
  let loggerRegex = new RegExp(/([0-9A-Fa-f]){8}\b/g);
  return loggerRegex.test(device);
};