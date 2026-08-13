# Config Editor - Load & Modify Configuration Files

This simple config editor lets you load JSON configuration files from the [CANedge](https://www.csselectronics.com/) CAN bus data logger and related modules. The tool lets you load your `config-XX.YY.json` via the Configuration File dropdown to initialize the editor. Alternatively, you can manually load a 'Rule Schema' and 'UIschema' in the editor.

The editor can be used offline, or you can upload it to a web server to use it online. You can also simply use our [hosted CANedge config editor](https://canlogger.csselectronics.com/simple-editor/#/), which always features the latest version.

See also our [documentation](https://www.csselectronics.com/screen/page/can-logger-resources) for further details on configuration. 

----

## How to install
Requires Node >= 20 (developed on Node 24). Clone this repository and run
`npm install` (peer-dependency quirks of some legacy packages are handled via
the committed `.npmrc`).

----

## How to run and build
Development server (hot reload):
```
npm start             # CANedge variant
npm run start:canmod  # CANmod variant
```

Production builds (each produces a single self-contained `index.html` that can
be opened directly from disk):
```
npm run canedge   -> canedge-editor/index.html
npm run canmod    -> canmod-editor/index.html
```

For each build, the `TYPE` variable can be used within the `Editor.js` file to change settings - e.g. modifying the title, which schema files to use and which editor tools to include. The `DEMO_MODE` environment variable is injected the same way (see `build-canedge-demo.bat`).

----

## Regarding sub modules
The CANedge config editor is very light and is based on two imported modules: 

1. [config-editor-base](https://github.com/CSS-Electronics/config-editor-base): This module serves as the "core" editor and includes the JSON Schema loader tool
2. [config-editor-tools](https://github.com/CSS-Electronics/config-editor-tools): This module contains various "extra" editor tools, which can be imported and parsed to the editor

These sub modules are also used in other projects by CSS Electronics, for example [CANcloud](https://github.com/CSS-Electronics/cancloud).

----

## Updating embedded Rule Schema and UIschema files
If the embedded schema files need to be updated, the process should be as follows:
1. Clone [config-editor-base](https://github.com/CSS-Electronics/config-editor-base)
2. Follow the README in that repo on how to add the new files, then publish a new npm package 
3. In this repo, update the `Editor.js` file with the new entries to the UIschema and Rule Schema arrays
4. Build the new config editor