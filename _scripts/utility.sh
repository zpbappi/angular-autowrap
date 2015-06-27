#!/bin/bash

# decides whether it is proper semver that i allow for tagging
is_proper_version(){
  version="$1"

  if [[ "$version" =~ ^[1-9][0-9]*\.[0-9]+\.[0-9]+(\-(alpha|beta|rc)(\.[1-9][0-9]*)?)?$ ]]
  then
    echo 0
    return 0
  fi

  echo 1
  return 1
}

is_major_version(){
  version="$1"
  
  if [[ "$version" =~ ^[1-9][0-9]*\.0\.0$ ]]
  then
    echo 0
    return 0
  fi

  echo 1
  return 1
}

is_prerelease_version(){
  version="$1"

  if [[ "$version" =~ ^[1-9][0-9]*\.[0-9]+\.[0-9]+\-(alpha|beta|rc)(\.[1-9][0-9]*)?$ ]]
  then
    echo 0
    return 0
  fi

  echo 1
  return 1
}

# copied from https://github.com/angular/angular.js/blob/master/scripts/utils.inc
# replaceInFile file findPattern replacePattern
replaceInFile() {
  sed -i.tmp -E "s/$2/$3/" $1
  rm $1.tmp
}

# copied from https://github.com/angular/angular.js/blob/master/scripts/utils.inc
# replaceJsonProp jsonFile propertyRegex valueRegex replacePattern
# - note: propertyRegex will be automatically placed into a
#   capturing group! -> all other groups start at index 2!
replaceJsonProp() {
  replaceInFile $1 '"('$2')"[ ]*:[ ]*"'$3'"' '"\1": "'$4'"'
}

