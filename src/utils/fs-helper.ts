import { promises as fs } from "fs";
import path from "path";

/**
 * Copies all files from the source directory to the destination directory.
 *
 * @param sourceDir - The path of the source directory.
 * @param destinationDir - The path of the destination directory.
 */
export async function copyFiles(sourceDir: string, destinationDir: string) {
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
}

/**
 * Reads the content of a file.
 *
 * @param filePath - The path of the file to read.
 * @returns A promise that resolves to the content of the file as a string.
 * @throws If there is an error reading the file.
 */
export async function readFileContent(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, { encoding: "utf-8" });
    return content;
  } catch (error) {
    console.error(`Error reading file at ${filePath}:`, error);
    throw error; // or return an empty string or a default value
  }
}
