const fs = require("fs-extra");
const path = require("path");

const bundlePath = path.join(__dirname, "/canmod-editor/bundle.js");
const htmlPath = path.join(__dirname, "/canmod-editor/index.html");
try {
  const html = fs.openSync(htmlPath, "a");
  const bundle = fs.readFileSync(bundlePath, "utf8");
  fs.appendFileSync(html, `<script>${bundle}</script>`, "utf8");
  fs.unlinkSync(bundlePath);
  console.log("CANmod editor build successfully");
} catch (error) {
  console.log(error);
  process.exit(0);
}
