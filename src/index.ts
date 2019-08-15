#!/usr/bin/env node

import "./polyfill";
import * as program from "commander";
import Profile from "./models/profile";

let profile = new Profile();

program
  .description("AWS Toolbelt")
  .version("0.0.1")
  .usage("profile [options]")
  .option("-l, --list", "list existing profiles")
  .option("-s, --set <profile-name>", "set your default profile")
  .parse(process.argv);

if (program.list) {
  profile.list();
} else if (program.set) {
  profile.set(program.set);
}
