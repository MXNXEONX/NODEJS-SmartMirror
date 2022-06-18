"use strict";
exports.ELECTRON_GYP_DIR = void 0;
const os = require("os");
const path = require("path");
exports.ELECTRON_GYP_DIR = path.resolve(os.homedir(), '.electron-gyp');
