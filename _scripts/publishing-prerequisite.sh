#!/bin/bash

. _scripts/utility.sh


install_prerequisites(){
  echo "[INFO] Installing publishing prerequisites..."
  
  npm install -g ci-npm-publish
  
}


ret=$( is_proper_version "$TRAVIS_TAG" )
echo $TRAVIS_TAG
echo $ret
if [[ $ret == 0 ]]
then
  install_prerequisites
else
  echo "[INFO] No prerequisite installation required."
fi
