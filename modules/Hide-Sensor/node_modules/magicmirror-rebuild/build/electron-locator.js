"use strict";
exports.locateElectronModule = void 0;
const fs = require("fs-extra");
const path = require("path");
const search_module_1 = require("./search-module");
const electronModuleNames = ['electron', 'electron-prebuilt', 'electron-prebuilt-compile'];
async function locateModuleByRequire() {
    for (const moduleName of electronModuleNames) {
        try {
            const modulePath = path.resolve(require.resolve(path.join(moduleName, 'package.json')), '..');
            if (await fs.pathExists(path.join(modulePath, 'package.json'))) {
                return modulePath;
            }
        }
        catch (_error) { // eslint-disable-line no-empty
        }
    }
    return null;
}
async function locateElectronModule(projectRootPath) {
    for (const moduleName of electronModuleNames) {
        const electronPath = await (0, search_module_1.searchForModule)(process.cwd(), moduleName, projectRootPath)[0];
        if (electronPath && await fs.pathExists(path.join(electronPath, 'package.json'))) {
            return electronPath;
        }
    }
    return locateModuleByRequire();
}
exports.locateElectronModule = locateElectronModule;
