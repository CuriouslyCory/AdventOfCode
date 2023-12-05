import { program } from "commander";
import { mkdir } from "fs/promises";
import { copyFiles } from "./utils/fs-helper";
import path from "path";

program.name("advent-of-code").version("0.0.1");

program
  .command("init-day")
  .argument("<day>", "Day to bootstrap")
  .action(async (str, options) => {
    // make a directory using `day-${str}`
    const destinationDirPath = path.join(__dirname, `day${str}`);
    await mkdir(destinationDirPath);

    // copy the template files into the directory
    const sourceDirPath = path.join(__dirname, "./templates");
    await copyFiles(sourceDirPath, destinationDirPath);
    console.log(`Created day ${str}`);
  });

program
  .command("day")
  .argument("<day>", "Day to run")
  .action((str, options) => {
    console.log(`Running day ${str}`);
    console.log(options);
  });
program.parse();

export {};
