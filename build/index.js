#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./polyfill");
const program = require("commander");
const profile_1 = require("./models/profile");
let profile = new profile_1.default();
program
    .description("AWS Toolbelt")
    .version("0.0.1")
    .usage("profile [options]")
    .option("-l, --list", "list existing profiles")
    .option("-s, --set <profile-name>", "set your default profile")
    .parse(process.argv);
if (program.list) {
    profile.list();
}
else if (program.set) {
    profile.set(program.set);
}
//# sourceMappingURL=index.js.map