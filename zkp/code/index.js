/**
 * @module
 * @author iAmMichaelConnor
 * @desc Handles the setup for .code files found in `zkp/code/gm17`
 */

import fs from 'fs';
import path from 'path';
import { compile, setup, exportVerifier } from '@eyblockchain/zokrates.js';

import keyExtractor from './keyExtractor';

const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source =>
  fs
    .readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory);

/**
 * Promise wrapper around fs.readdir. Returns a Promise that resolves into an array of files.
 * @param {String} _path
 * @returns {Promise}
 */
function readdirAsync(_path) {
  return new Promise((resolve, reject) => {
    fs.readdir(_path, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Calls Zokrates compile, setup, and export-verifier on a single directory
 * @param {String} directoryPath
 */
async function generateZokratesFiles(directoryPath) {
  const files = await readdirAsync(directoryPath);

  const directoryWithSlash = directoryPath.endsWith('/') ? directoryPath : `${directoryPath}/`;

  let codeFile;
  // Look for a .code file that's not out.code. That's the file we're compiling.
  for (let i = 0; i < files.length; i += 1) {
    if (files[i].endsWith('.code') && files[i] !== 'out.code') {
      codeFile = files[i];
      break;
    }
  }

  console.log('Compiling at', `${directoryWithSlash}${codeFile}`);

  // Generate out.code and out in the same directory.
  await compile(`${directoryWithSlash}${codeFile}`, directoryWithSlash);
  console.log('Finished compiling at', directoryPath);

  // Generate verification.key and proving.key
  await setup(
    `${directoryWithSlash}out`,
    directoryWithSlash,
    'gm17',
    'verification.key',
    'proving.key',
  );
  console.log('Finished setup at', directoryPath);

  await exportVerifier(
    `${directoryWithSlash}/verification.key`,
    directoryWithSlash,
    'verifier.sol',
    'gm17',
  );
  console.log('Finished export-verifier at', directoryPath);

  const vkJson = await keyExtractor(`${directoryWithSlash}verifier.sol`, true);

  // Create a JSON with the file name but without .code
  fs.writeFileSync(`${directoryWithSlash}${codeFile.split('.')[0]}-vk.json`, vkJson, err => {
    if (err) {
      console.error(err);
    }
  });
  console.log(directoryPath, 'is done setting up.');
}

/**
 * Calls zokrates' compile, setup, and export-verifier on all directories in `/zkp/code/gm17`.
 */
async function runSetupAll() {
  // Directory that contains all the code directories.
  const gm17Directory = `${process.cwd()}/code/gm17`;

  // Array of directories.
  const codeDirectories = getDirectories(gm17Directory);

  // The files don't compile correctly when we Promise.all these, so we're doing sequentially.
  for (let i = 0; i < codeDirectories.length; i++) {
    await generateZokratesFiles(codeDirectories[i]);
  }
}

runSetupAll().catch(err => console.log(err));
