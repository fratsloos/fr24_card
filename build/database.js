import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config();

// Create path of files
const directoryPath = path.join(
  process.env.DUMP1090_FOLDER,
  "/public_html/db/"
);

console.info("Scanning directory", directoryPath);

// Read the directory
fs.readdir(directoryPath, function (err, files) {
  // Handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  // Filter only JSON
  const jsonFiles = files.filter((el) => path.extname(el) === ".json");
  console.info("Found " + jsonFiles.length + " files");

  // Object with all entries
  let database = {};

  // Read content of each file
  for (let i = 0; i < jsonFiles.length; i++) {
    let entries = readFile(jsonFiles[i]);

    database = {
      ...database,
      ...entries,
    };
  }

  // Custom entries
  let entries = readDataFile();
  if (entries) {
    database = {
      ...database,
      ...entries,
    };
  }

  // Save the object
  let data = `window.fr24db = JSON.parse('${JSON.stringify(database)}');`;
  fs.writeFileSync("./dist/fr24_database.js", data);
});

function readFile(file) {
  console.info("- " + file);

  // Read content of file
  let content = fs.readFileSync(path.join(directoryPath, file), "utf8");

  // Parse content of file
  let json = JSON.parse(content);
  console.info("  " + Object.keys(json).length + " entries");

  // Build object with content of file
  let entries = {};

  for (const key in json) {
    let hex = file.replace(".json", "") + key;
    let data = json[key];

    if (data.hasOwnProperty("r")) {
      entries[hex] = data.r;
    }
  }

  return entries;
}

function readDataFile() {
  let file = "registrations.json";
  console.info("- " + file);

  // Read content of file
  let content = fs.readFileSync(path.join("./build/data/", file), "utf8");

  // Parse content of file
  let json = JSON.parse(content);
  console.info("  " + Object.keys(json).length + " entries");

  return json;
}
