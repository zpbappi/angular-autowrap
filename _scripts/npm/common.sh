#!/bin/bash

. _scripts/utility.sh

#publish_npm $version $npm_user $npm_password
publish_npm(){
  version="$1"
  npm_user="$2"
  npm_password="$3"
  
  echo "[INFO] Publishing npm package version: $version"

  saved_dir=$(pwd)
  tmp_dir=/tmp/npm-release

  # delete if it exists. though it shouldn't exist, but it is good to check.
  if [[ -d $tmp_dir ]]
  then
    rm -rf $tmp_dir
  fi
  
  mkdir $tmp_dir
  cp build/* $tmp_dir/
  cp README.md $tmp_dir/
  cp _scripts/npm/package.json $tmp_dir/
  replaceJsonProp "$tmp_dir/package.json" "version" ".*" "$version"
  cd $tmp_dir
  npm-publish --npmuser "$npm_user" --npmemail "$GIT_EMAIL" --npmpassword "$npm_password"
  cd $saved_dir
  rm -rf $tmp_dir
  
  return 0
}