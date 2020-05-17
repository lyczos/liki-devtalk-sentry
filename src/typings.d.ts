// Typing for webpack/env config
// extended-webpack.config.js
// environment.ts
declare var appProcess: Process;
interface Process {
  env: { APP_VERSION_SHA: string };
}
