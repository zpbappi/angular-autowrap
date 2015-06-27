#!/bin/bash

. _scripts/utility.sh
. _scripts/github.sh

version="$1"
echo "[INFO] Creating GitHub release for version $version"

gh_release "$GH_TOKEN" "$version"