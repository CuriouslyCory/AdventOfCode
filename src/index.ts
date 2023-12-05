import { program } from "commander";
import { mkdir } from "fs/promises";
import { copyFiles } from "./utils/fs-helper";
import path from "path";

program.name("advent-of-code").version("0.0.1");

program
  .command("init-day")
  .argument("<day>", "Day to bootstrap")
  .action(async (str) => {
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
  .option("-p, --part <part>", "Part to run")
  .action(async (day, options) => {
    console.log(`Running day ${day}`);

    // Construct the path to the module based on the day
    const modulePath = path.join(__dirname, `day${day}/index.ts`);

    try {
      // Dynamically import the module
      const dayModule = await import(modulePath);
      if (options.part) {
        switch (options.part) {
          case "1":
            if (dayModule.part1) {
              console.log(`Results for Day ${day}:`);
              console.log(`Part 1:`, await dayModule.part1());
            } else {
              console.error(
                `The module for Day ${day} does not export part1 function.`
              );
            }
            break;
          case "2":
            if (dayModule.part2) {
              console.log(`Results for Day ${day}:`);
              console.log(`Part 2:`, await dayModule.part2());
            } else {
              console.error(
                `The module for Day ${day} does not export part2 function.`
              );
            }
            break;
          default:
            console.error(`Invalid part: ${options.part}`);
        }
      } else {
        // Check if the module has the required functions
        if (dayModule.part1 && dayModule.part2) {
          console.log(`Results for Day ${day}:`);
          console.log(`Part 1:`, await dayModule.part1());
          console.log(`Part 2:`, await dayModule.part2());
        } else {
          console.error(
            `The module for Day ${day} does not export part1 and part2 functions.`
          );
        }
      }
    } catch (error) {
      console.error(`Error loading module for Day ${day}:`, error);
    }
  });
program.parse();
