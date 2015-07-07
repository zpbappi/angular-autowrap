#!/bin/bash

. _scripts/utility.sh
. _scripts/github.sh

version="$1"
echo "[INFO] Creating GitHub release for version $version"

gh_release "$GH_TOKEN" "$version" "$TRAVIS_REPO_SLUG"
upload_url=$( get_assets_url "$GH_TOKEN" "$TRAVIS_REPO_SLUG" "$version" )
add_files_to_release "$GH_TOKEN" "$upload_url" "./build/angular-autowrap.js" "angular-autowrap.js" "application/javascript"
add_files_to_release "$GH_TOKEN" "$upload_url" "./build/angular-autowrap.min.js" "angular-autowrap.min.js" "application/javascript"
add_files_to_release "$GH_TOKEN" "$upload_url" "./build/angular-autowrap.min.js.map" "angular-autowrap.min.js.map" "application/json"