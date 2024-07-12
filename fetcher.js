const fs = require('fs');
const needle = require('needle');
const readline = require('readline');


const args = process.argv.slice(2);
const url = args[0];
const localFilePath = args[1];


if (fs.existsSync(localFilePath)) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('File already exists. Overwrite? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      downloadAndSave();
    } else {
      console.log('Download aborted.');
    }
    rl.close();
  });
} else {
  downloadAndSave();
}

function downloadAndSave() {
  // Fetch resource
  needle.get(url, (error, response) => {
    if (error || response.statusCode !== 200) {
      console.error(`Error fetching URL: ${error || response.statusCode}`);
      return;
    }

    // Write to file
    fs.writeFile(localFilePath, response.body, (err) => {
      if (err) {
        console.error(`Error writing to file: ${err.message}`);
        return;
      }
      console.log(`Downloaded and saved ${response.body.length} bytes to ${localFilePath}`);
    });
  });
}
