#!/bin/bash

gulp
git remote set-url --push origin $GH_REPO
git config user.name $GIT_NAME
git config user.email $GIT_EMAIL
git config credential.helper "store --file=.git/credentials"
echo "https://${GH_TOKEN}:@github.com" > .git/credentials
git add --all dist/*
git commit -m "[ci skip] travis-ci automated build number ${TRAVIS_BUILD_NUMBER}" > /dev/null 2>&1
if [ "$?" != "0" ]; then
	echo ">> Nothing new in ./dist/ to commit."
	exit 0
fi
git push --force --quiet origin HEAD:master > /dev/null 2>&1
rm -r .git/credentials
