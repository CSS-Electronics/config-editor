# Config Editor - Load & Modify CANedge Config Files

This simple config editor lets you load JSON configuration files from the [CANedge](https://www.csselectronics.com/) CAN bus data logger and related modules. The tool lets you simply load your `config-XX.YY.json` via the Configuration File dropdown to initialize the editor. Alternatively, you can also manually load a 'Rule Schema' and 'UIschema' in the editor.

The editor can be used offline, or you can upload it to a web server to use it online. You can of course also simply use our [hosted CANedge config editor](https://canlogger.csselectronics.com/simple-editor/#/), which always features the latest version.

----

## How to install
Clone this repository and run `npm install`. 

To build the editor, run `npm run simple`. 

----

## Regarding sub modules
The CANedge config editor is very light and is based on two imported modules: 

1. [config-editor-base](https://github.com/CSS-Electronics/config-editor-base): This module serves as the "core" editor and includes the JSON Schema loader tool, as well as the 'partial config loader' tool. 
2. [config-editor-tools](https://github.com/CSS-Electronics/config-editor-tools): This module contains various "extra" editor tools, which can be imported and parsed to the base editor. The extra tools will be available from the editor submenu

These sub modules are also used in other projects by CSS Electronics, for example [CANcloud](https://github.com/CSS-Electronics/cancloud).

