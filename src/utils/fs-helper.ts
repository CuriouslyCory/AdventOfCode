import { promises as fs } from "fs";
import path from "path";

/**
 * Copies all files from the source directory to the destination directory.
 *
 * @param sourceDir - The path of the source directory.
 * @param destinationDir - The path of the destination directory.
 */
export const copyFiles = async (sourceDir: string, destinationDir: string) => {
  try {
    const files = await fs.readdir(sourceDir);
    for (const file of files) {
      const sourceFile = path.join(sourceDir, file);
      const destFile = path.join(destinationDir, file);
      await fs.copyFile(sourceFile, destFile);
    }
    console.log(`All files copied from ${sourceDir} to ${destinationDir}`);
  } catch (error) {
    console.error("Error occurred:", error);
  }
};
