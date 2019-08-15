"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let fs = require("fs");
let os = require("os");
const chalk_1 = require("chalk");
const model_1 = require("./model");
class Profile extends model_1.default {
    constructor() {
        super();
        this.credentials = [];
        this.credentialsPath = `${os.userInfo().homedir}/.aws/credentials`;
        this.parseCredentials();
    }
    list() {
        this.credentials.forEach(credential => {
            for (const key in credential) {
                if (key === "isDefault") {
                    if (credential[key] !== undefined) {
                        console.log(`${chalk_1.default.white(key + ":")} ${credential[key] ? chalk_1.default.bold.yellow("true") : chalk_1.default.red("false")}`);
                    }
                }
                else {
                    if (credential[key]) {
                        console.log(`${chalk_1.default.white(key + ":")} ${chalk_1.default.green(credential[key])}`);
                    }
                }
            }
        });
    }
    set(project) {
        const newDefaultProfile = this.credentials.find(credential => credential && credential.project === project);
        if (newDefaultProfile) {
            const currentDefaultProfile = this.credentials.find(credential => credential && credential.isDefault);
            if (currentDefaultProfile) {
                currentDefaultProfile.isDefault = false;
                newDefaultProfile.isDefault = true;
                this.backupCredentials();
                this.outputCredentials();
                return;
            }
        }
        console.log(`${chalk_1.default.red("Error" + ":")} Unable to find ${chalk_1.default.bold(project)} in: ${this.credentialsPath}`);
    }
    backupCredentials() {
        try {
            fs.copyFileSync(this.credentialsPath, `${this.credentialsPath}.${Date.now()}`);
        }
        catch (e) {
            console.log(`${chalk_1.default.red("Error" + ":")} Unable to create backup of: ${this.credentialsPath}`);
        }
    }
    outputCredentials() {
        let data = "";
        this.credentials.forEach(credential => {
            if (credential) {
                data += `[${credential.isDefault ? "default" : credential.project}]
aws_access_key_id=${credential.id}
aws_secret_access_key=${credential.secret}
region=${credential.region}
project=${credential.project}
`;
            }
        });
        try {
            fs.writeFileSync(this.credentialsPath, data);
        }
        catch (e) {
            console.log(`${chalk_1.default.red("Error" + ":")} Unable to create file in: ${this.credentialsPath}`);
        }
    }
    parseCredentials() {
        const credentials = fs.readFileSync(this.credentialsPath, "utf8");
        const profiles = [];
        credentials.split("\n[").forEach(block => {
            this.credentials.push(this.parseBlock(block));
        });
    }
    parseBlock(block) {
        const blockRe = /^\[?([^\[\]]*)\]/;
        let blockName = "";
        const profile = {
            id: "id",
            isDefault: false,
            project: "project",
            region: "region",
            secret: "secret"
        };
        block.split("\n").forEach(line => {
            if (line.includes("=")) {
                let [key, value] = line.split("=");
                switch (key) {
                    case "aws_access_key_id":
                        profile["id"] = value;
                        break;
                    case "aws_secret_access_key":
                        profile["secret"] = value;
                        break;
                    case "project":
                        profile["project"] = value;
                        break;
                    case "region":
                        profile["region"] = value;
                        break;
                }
            }
            else {
                const name = blockRe.exec(line);
                if (name && name[0]) {
                    blockName = name[0].replace("[", "").replace("]", "");
                }
                profile["isDefault"] = blockName.toLowerCase() === "default";
                if (!profile["project"]) {
                    profile["project"] = blockName;
                }
            }
        });
        return profile;
    }
}
exports.default = Profile;
//# sourceMappingURL=profile.js.map