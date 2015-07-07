#!/bin/bash

# git_url_from_slug $slug
github_url_from_slug(){
  echo "https://github.com/$1.git"
}

# git_clone dir url
git_clone(){
	if [[ -d $1 ]]
	then
	  rm -rf $1
	fi
	
	git clone $2 $1
}

# github_auth $name $email $gh_token $repo_dir
github_auth(){
  cwd=$(pwd)
  cd $4
  git config user.name "$1"
  git config user.email "$2"
  git config credential.helper "store --file=.git/credentials"
  echo "https://${3}:@github.com" > .git/credentials
  cd $cwd
}

# gh_branch_exists $gh_token $repo_slug $branch_name
gh_branch_exists(){
  gh_token="$1"
  repo_slug="$2"
  branch_name="$3"
  
  status=$(curl -H "Authorization: token $gh_token" -s -o //null -w "%{http_code}" https://api.github.com/repos/$repo_slug/branches/$branch_name)
  
  if [[ "$status" == "200" ]]
  then
    echo 0
    return 0
  fi
  
  echo 1
  return 1
}

# git_commit_n_push $message $branch
git_commit_n_push(){
  branch="master"
  if [[ -n "$2" ]]
  then
    branch="$2"
  fi
  
  git commit -q -m "$1" > /dev/null 2>&1
  if [ "$?" == "0" ]; then
    git push --force --quiet origin HEAD:$branch > /dev/null 2>&1
  fi
}

# gh_release $gh_token $tag $repo_slug $description? $is_prerelease?[true|false]
gh_release(){
  gh_token="$1"
  tag="$2"
  repo_slug="$3"
  description="$4"
  is_prerelease="false"
  gh_release_endpoint=https://api.github.com/repos/$repo_slug/releases
  
  if [[ -z "$description" ]]
  then
    description="Automatically released version $tag using API. Details to follow soon."
  fi
  
  if [[ "$5" == "true" ]]
  then
    is_prerelease="true"
  fi
  
  data='{"tag_name":"'$tag'","prerelease":'$is_prerelease',"body":"'$description'"}'
  
  curl -i -H "Authorization: token $gh_token" -d "$data" $gh_release_endpoint > /dev/null 2>&1
}

# get_assets_url $gh_token $repo_slug $tag
get_assets_url() {
  url=`curl --silent -X GET -H "Authorization: token $1" https://api.github.com/repos/$2/releases/tags/$3 | grep -Po '"upload_url"[ ]*:[ ]*"\K([^"]*)(?="[ ]*,)' | grep -Po '\K([^\{]*)(?=\{.*)' | cat`
  echo $url
  return 0
}

# add_files_to_release $gh_token $url $file_path $file_name $content_type
add_files_to_release(){
  curl --silent -i -X POST -H "Authorization: token $1" -H "Content-Type: $5" --data @"$3" "$2?name=$4" > /dev/null 2>&1
}
