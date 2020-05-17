#!/bin/bash
# Send release information to sentry
# ./sentry-release.sh production

# If you use Sentry-cli from the NPM package added to the project,
# leave the current value. However, sometimes you can have it installed earlier
# in this case set the path here or just enter "sentry-cli"
SENTRY="./node_modules/.bin/sentry-cli"

# if we want to associate releases with commits/versions
GIT_REPO="lyczos/liki-devtalk-sentry"

# if is because our app is under sub directory https://lyczos.github.io/liki-devtalk-sentry/
# if we have our app in main directory (ex https://lyczos.github.io/ )
# we should update it to "dist/liki-devtalk-sentry/":
DIST_DIR="dist/"

# Name of file that's includes app version number/hash
# You can generate that file during build process and set version to ex. 1.0.2
# in case when file doesn't exist, script will try to use most recent commit hash
# in place of version
FILENAME_WITH_VERSION="RELEASE_VERSION"

ENV_VAR=$1
if [ -n "$ENV_VAR" ]; then
  if [ -f "$FILENAME_WITH_VERSION" ]; then
    # Take app version form file RELEASE_VERSION
    VERSION=$(head -n1 $FILENAME_WITH_VERSION | tr -d '\n')
    echo "Version was taken from $FILENAME_WITH_VERSION file:  $VERSION"
  else
    # Take app version form sentry-cli (it will use most recent commit hash)
    VERSION=$($SENTRY releases propose-version)
    echo "Version was taken from GIT: $VERSION"
  fi
  # Start new release (for Sentry)
  $SENTRY releases new "$VERSION"
  # Upload source maps
  $SENTRY releases files "$VERSION" upload-sourcemaps --rewrite $DIST_DIR # Path to bundle
  # Set up version to enhance error targeting
  $SENTRY releases set-commits "$VERSION" --commit "$GIT_REPO""@""$VERSION"
  # Finish release and send all info to sentry.io
  $SENTRY releases finalize "$VERSION"
  $SENTRY releases deploys "$VERSION" new -e "$ENV_VAR"
else
    echo "ERROR: Provide an environment. Ex. './sentry-release.sh production'"
fi
