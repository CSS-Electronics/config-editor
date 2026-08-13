// config-editor-base's loadFile() uses a dynamic CommonJS require
// (require(`./schema/${type}/${name}`)) to pull the embedded schema files out
// of its dist/schema. Webpack turned that into a context module automatically;
// under Vite there is no `require`, so this shim emulates it with an eager
// glob. It must be imported before anything that renders the editor.
//
// react-gh-like-diff (via config-editor-base) additionally calls
// require('diff2html') lazily inside a function body, which survives Vite's
// production CommonJS conversion - serve that from here too. IMPORTANT: the
// diff2html version here must satisfy react-gh-like-diff's own range (^3.x) -
// keep the app's package.json diff2html entry in sync with it. crc and
// deepmerge are kept defensively for older config-editor-tools dists (2.0.0
// converted its requires to real imports).
import * as diff2html from 'diff2html'
import merge from 'deepmerge'
import * as crc from 'crc'

const lazyCjsModules = {
  diff2html: diff2html,
  deepmerge: merge, // must be the default FUNCTION, not a namespace object
  crc: crc
}

const schemaModules = import.meta.glob(
  '../../node_modules/config-editor-base/dist/schema/**/*.json',
  { eager: true }
)

window.require = (path) => {
  if (lazyCjsModules[path]) {
    return lazyCjsModules[path]
  }
  // loadFile passes paths like './schema/CANedge2/schema-01.09.json'
  const key = '../../node_modules/config-editor-base/dist' + path.slice(1)
  const mod = schemaModules[key]
  if (!mod) {
    throw new Error('requireShim: module not available: ' + path)
  }
  return mod.default || mod
}
