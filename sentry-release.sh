#!/bin/bash
# Send release information to sentry
# ./sentry-release.sh production COMMIT_HASH

# Sometimes you want to you Sentry from NPM
# but sometimes maybe you have it already so you can change it here to
# SENTRY_PATH="/usr/local/bin/sentry-cli";
# Depends on you case.
SENTRY_PATH="./node_modules/.bin/sentry-cli"
GIT_REPO="lyczos/liki-devtalk-sentry" # we need it if we want to associate releases with commits/versions
DIST_DIR="dist/liki-devtalk-sentry/"

ENV_VAR=$1
if [ -n "$ENV_VAR" ]; then
  FILE=SENTRY_APP_VERSION # name of file that's includes app version number/hash
  if [ -f "$FILE" ]; then
    # Take app version form file SENTRY_APP_VERSION
    VERSION=$(head -n1 $FILE | tr -d '\n')
    echo "Version was taken from $FILE file:  $VERSION"
  else
    # Take app version form sentry-cli (it will use most recent commit hash)
    VERSION=$($SENTRY_PATH releases propose-version)
    echo "Version was taken from GIT: $VERSION"
  fi
  # Start new release (for Sentry)
  ./node_modules/.bin/sentry-cli releases new "$VERSION"
  # Upload source maps
  ./node_modules/.bin/sentry-cli releases files "$VERSION" upload-sourcemaps --rewrite $DIST_DIR # Path to bundle
  # Set up version to enhance error targeting
  ./node_modules/.bin/sentry-cli releases set-commits "$VERSION" --commit "$GIT_REPO""@""$VERSION"
  # Finish release and send all info to sentry.io
  ./node_modules/.bin/sentry-cli releases finalize "$VERSION"
  ./node_modules/.bin/sentry-cli releases deploys "$VERSION" new -e "$ENV_VAR"
else
    echo "ERROR: Provide an environment. Ex. './sentry-release.sh production'"
fi
