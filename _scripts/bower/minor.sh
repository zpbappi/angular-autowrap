#!/bin/bash

. _scripts/bower/common.sh

bower_publish "$1" "$TRAVIS_REPO_SLUG"