/**
@module
@author iAmMichaelConnor
@desc Run from within nightfall/zkp/code
E.g. node src/tools-trusted-setup.js
*/

import { argv } from 'yargs';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { compile, setup, exportVerifier } from '@eyblockchain/zokrates.js';

const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source =>
  fs
    .readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory);

let container;

// SORT THROUGH ARGS:

// arguments to the command line:
// i - filename
const { i } = argv; // file name - //pass the my-code.code file as the '-i' parameter

// a - arguments for compute-witness
const a0 = argv.a; // arguments for compute-witness (within quotes "")
let a1 = [];
if (!(a0 === undefined || a0 === '')) {
  a1 = a0.split(' ');
} else {
  a1 = null;
}

function readdirAsync(_path) {
  return new Promise(function prm(resolve, reject) {
    fs.readdir(_path, function rdr(error, result) {
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
}

/**
 * Calls zokrates' compile, setup, and export-verifier on all directories in `/zkp/code/gm17`.
 * @param {*} a
 */
async function runSetupAll(a) {
  // Directory that contains all the code directories.
  const gm17Directory = `${process.cwd()}/code/gm17`;
  // Array of directories.
  const codeDirectories = getDirectories(gm17Directory);

  await Promise.all(
    codeDirectories.map(directory => {
      return generateZokratesFiles(directory);
    }),
  );

  console.log('done');
}

async function allOrOne() {
  if (!i) {
    console.log(
      "The '-i' option has not been specified.\nThat's OK, we can go ahead and loop through every .code or .pcode file.\nHOWEVER, if you wanted to choose just one file, cancel this process, and instead use option -i, e.g.: 'node src/tools-tar-create.js -i my-code.code'",
    );
    console.log('Be warned, this could take up to an hour!');

    // beep(2);
    const carryOn = await inquirer.prompt([
      {
        type: 'yesno',
        name: 'continue',
        message: 'Continue?',
        choices: ['y', 'n'],
      },
    ]);
    if (carryOn.continue !== 'y') return;

    try {
      runSetupAll(a1); // we'll do all .code (or .pcode) files if no option is specified
    } catch (err) {
      throw new Error(`${err}Trusted setup failed.`);
    }
  } else {
    await runSetup(a1);
  }
}

// RUN
allOrOne().catch(err => console.log(err));
