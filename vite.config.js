import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import fs from 'node:fs/promises'

// difflib (dep of react-gh-like-diff, pulled in via config-editor-base) assigns
// to function.name, a read-only property: harmless in sloppy-mode CJS (webpack),
// throws under Vite's strict-mode ESM. Stripping is behavior-identical.
// Copied from config-editor-base/example/vite.config.js.
// Throws rather than silently no-opping: if a difflib bump ever changes the
// wording, the build must fail loudly instead of reintroducing the crash.
const stripDifflibNameAssignments = (code) => {
  const patched = code.replace(/\b\w+\.name\s*=\s*'\w+';?/g, ';')
  if (patched === code) {
    throw new Error(
      'patch-difflib-strict-mode: no function.name assignment found - difflib changed, re-check the patch'
    )
  }
  return patched
}

// dev: patch during esbuild dep prebundling
const esbuildPatchDifflib = {
  name: 'patch-difflib-strict-mode',
  setup(build) {
    build.onLoad({ filter: /difflib[\\/]lib[\\/]difflib\.js$/ }, async (args) => {
      const code = await fs.readFile(args.path, 'utf8')
      return { contents: stripDifflibNameAssignments(code), loader: 'js' }
    })
  }
}

// build: patch during rollup transform (enforce pre so it runs before the
// CommonJS conversion; id may carry a ?query suffix)
const rollupPatchDifflib = {
  name: 'patch-difflib-strict-mode',
  enforce: 'pre',
  transform(code, id) {
    if (/difflib[\\/]lib[\\/]difflib\.js(\?(?!commonjs-)|$)/.test(id)) {
      return { code: stripDifflibNameAssignments(code), map: null }
    }
  }
}

// One config replaces webpack.canedge.js + webpack.canmod.js + the
// canedge-editor.js/canmod-editor.js inline-bundle scripts:
//   vite build --mode canedge  -> canedge-editor/index.html (single file)
//   vite build --mode canmod   -> canmod-editor/index.html (single file)
// TYPE and DEMO_MODE stay bare globals (same as webpack DefinePlugin), so
// Editor.js is unchanged and the build-*.bat DEMO_MODE env flow keeps working.
export default defineConfig(({ mode }) => {
  const type = mode === 'canmod' ? 'CANmod' : 'CANedge'
  return {
    base: './',
    define: {
      TYPE: JSON.stringify(type),
      DEMO_MODE: JSON.stringify(process.env.DEMO_MODE === 'true'),
      // diff2html 2.x references the Node global; webpack polyfilled it, Vite does not
      global: 'globalThis'
    },
    plugins: [
      rollupPatchDifflib,
      react(),
      viteSingleFile({ removeViteModuleLoader: true }),
      {
        name: 'html-title',
        transformIndexHtml: (html) =>
          html.replace('%TITLE%', `${type} config editor`)
      },
      {
        // the crossorigin attribute on the inlined module script makes Chrome
        // log an "unsafe attempt to load URL" error under file:// - strip it
        // (everything is inline, there is nothing to fetch cross-origin)
        name: 'strip-crossorigin',
        transformIndexHtml: {
          order: 'post',
          handler: (html) =>
            html.replace(/<script type="module" crossorigin/g, '<script type="module"')
        }
      }
    ],
    resolve: {
      dedupe: ['react', 'react-dom', 'react-redux', 'react-select']
    },
    css: {
      // Bootstrap 3 LESS uses slash division; less 4 defaults to parens-division
      preprocessorOptions: { less: { math: 'always' } }
    },
    build: {
      outDir: type === 'CANmod' ? 'canmod-editor' : 'canedge-editor',
      // single-file output: nothing to preload, and the polyfill trips a
      // (harmless but noisy) security error under file://
      modulePreload: { polyfill: false },
      // inline all fonts/images as data URIs - the output must stay a single
      // self-contained, file://-openable HTML file
      assetsInlineLimit: 100000000,
      chunkSizeWarningLimit: 5000
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: { '.js': 'jsx' },
        plugins: [esbuildPatchDifflib]
      }
    },
    // CRA-era JSX inside .js files
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.js$/,
      exclude: []
    }
  }
})
