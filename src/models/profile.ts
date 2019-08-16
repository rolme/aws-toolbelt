let fs = require("fs");
let os = require("os");
import chalk from "chalk";
import Model from "./model";

interface IProfile {
  id: string;
  isDefault: boolean;
  project: string;
  region: string;
  secret: string;
  [key: string]: any;
}

class Profile extends Model {
  private credentialsPath: string;
  private credentials: [IProfile?];

  constructor() {
    super();
    this.credentials = [];
    this.credentialsPath = `${os.userInfo().homedir}/.aws/credentials`;
    this.parseCredentials();
  }

  public list(): void {
    this.credentials.forEach(credential => {
      for (const key in credential) {
        if (key === "isDefault") {
          if (credential[key] !== undefined) {
            console.log(
              `${chalk.white(key + ":")} ${
                credential[key] ? chalk.bold.yellow("true") : chalk.red("false")
              }`
            );
          }
        } else {
          if (credential[key]) {
            console.log(
              `${chalk.white(key + ":")} ${chalk.green(credential[key])}`
            );
          }
        }
      }
    });
  }

  public set(project: string): void {
    const newDefaultProfile = this.credentials.find(
      credential => credential && credential.project === project
    );

    if (newDefaultProfile) {
      const currentDefaultProfile = this.credentials.find(
        credential => credential && credential.isDefault
      );
      if (currentDefaultProfile) {
        currentDefaultProfile.isDefault = false;
        newDefaultProfile.isDefault = true;
        this.outputCredentials();

        console.log(
          `${chalk.green("Default profile set to:")} ${chalk.bold(
            newDefaultProfile.id + " (" + newDefaultProfile.project + ")"
          )}`
        );
        return;
      }
    }
    console.log(
      `${chalk.red("Error" + ":")} Unable to find ${chalk.bold(project)} in: ${
        this.credentialsPath
      }`
    );
  }

  public backup(): void {
    const backupPath = `${this.credentialsPath}.${Date.now()}`;
    try {
      fs.copyFileSync(this.credentialsPath, backupPath);

      console.log(
        `${chalk.green("Backup created at:")} ${chalk.bold(backupPath)}`
      );
    } catch (e) {
      console.log(
        `${chalk.red("Error" + ":")} Unable to create backup of: ${
          this.credentialsPath
        }`
      );
    }
  }

  private outputCredentials(): void {
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
    } catch (e) {
      console.log(
        `${chalk.red("Error" + ":")} Unable to create file in: ${
          this.credentialsPath
        }`
      );
    }
  }

  private parseCredentials(): void {
    const credentials: string = fs.readFileSync(this.credentialsPath, "utf8");
    const profiles: [IProfile?] = [];

    credentials.split("\n[").forEach(block => {
      this.credentials.push(this.parseBlock(block));
    });
  }

  private parseBlock(block: string): IProfile {
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
      } else {
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

export default Profile;
