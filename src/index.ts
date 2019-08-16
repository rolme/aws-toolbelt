#!/usr/bin/env node

import "./polyfills";
import * as program from "commander";
import Profile from "./models/profile";

let profile = new Profile();

program
  .description("AWS Toolbelt")
  .version("0.0.1")
  .usage("[options]")
  .option("-b, --backup", "backup your existing profile")
  .option("-l, --list", "list existing profiles")
  .option("-s, --set <profile-name>", "set your default profile")
  .parse(process.argv);

if (program.list) {
  profile.list();
} else if (program.backup) {
  profile.backup();
} else if (program.set) {
  profile.set(program.set);
}
