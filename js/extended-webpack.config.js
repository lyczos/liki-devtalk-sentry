const childProcess = require('child_process');
const webpack = require('webpack');
const fs = require('fs');

// name of the key that can be read from process.env later in environment.ts file
const versionKeyName = 'APP_VERSION_SHA';
const fileName = 'RELEASE_VERSION';
const envVarName = 'CIRCLE_SHA1';
const gitCommandSHA = 'git rev-parse HEAD'; // most recent commit
let sourceOfVersion = '';

module.exports = (config) => {
  config.plugins.push(new webpack.DefinePlugin({
    'appProcess.env': {
      [versionKeyName]:  getVersion() // config.mode === 'production' ?  getVersion() : null // can be limited to all prod only if needed
    }
  }));

  return config;
};

function getVersion() {
  console.info(`\n---------------\n[${__filename}]:\nSetting '${versionKeyName}' in environment...\n`);
  // Try to get commit hash from exported Environment Variable,
  // if fail then get it from git command
  // if there is no git command try to get it from file
  const recentCommitHash = getGitCommitHashFromEnvVar(envVarName) ||  getGitCommitHash() || getGitCommitHashFromFile(fileName)  || emptyCommitHash();

  if(recentCommitHash) {
    console.info(`${recentCommitHash} will be used as version.\nValue was taken from: ${sourceOfVersion}`);
  } else {
    console.error(`Can not find version info.\nVersion can be read from:`);
    console.info(`ENV VARIABLE: ${envVarName}`);
    console.info(`GIT command: ${gitCommandSHA}`);
    console.info(`FILE: ${fileName}`);
  }

  return JSON.stringify(recentCommitHash);
}

function getGitCommitHashFromEnvVar(nameOfVar) {
  if (!process.env[nameOfVar]) {
    console.warn(`'${nameOfVar}' do not exist on PROCESS.ENV. Trying next step...`);
  }
  sourceOfVersion = `ENVIRONMENT VARIABLE ${nameOfVar}`;

  return process.env[nameOfVar] || '';
}

function getGitCommitHash() {
  let sha = '';
  try {
    sha = childProcess.execSync(gitCommandSHA).toString().trim();
  } catch (e) {
    console.warn(`GIT command is not available. Omitting command. Trying next step...`);
  }

  sourceOfVersion = `GIT COMMAND`;

  return sha;
}

function getGitCommitHashFromFile(filePath) {
  let sha = '';
  try {
    // read file and remove new lines
    sha = fs.readFileSync(filePath, 'utf8').replace(/\r?\n|\r/g, '');
  } catch (e) {
    console.warn(`FILE: '${filePath}' do not exist. Trying next step...`);
  }

  sourceOfVersion = `FILE ${filePath}`;

  return sha;
}

function emptyCommitHash() {
  sourceOfVersion = 'NONE';
}
