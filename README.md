# Angular AutoWrap

[![Build Status](https://travis-ci.org/zpbappi/angular-autowrap.svg?branch=dev)](https://travis-ci.org/zpbappi/angular-autowrap)
[![Coverage Status](https://coveralls.io/repos/zpbappi/angular-autowrap/badge.svg?branch=dev)](https://coveralls.io/r/zpbappi/angular-autowrap?branch=dev)
[![Code Climate](https://codeclimate.com/github/zpbappi/angular-autowrap/badges/gpa.svg)](https://codeclimate.com/github/zpbappi/angular-autowrap)

## Why?
[Here's](http://zpbappi.com/angular-autowrap-validation-and-control-template/) the complete history, if you are interested.

## Getting it
I use git tags to build a version automatically inside travis. Each tag is released in *npm*, *bower* and *GitHub Releases* simultaneously.
Here's how you get it:
 
### npm
```sh
npm install angular-autowrap
```

### bower
```sh
bower install angular-autowrap
```

### GitHub Releases
You will find all the releases [here](https://github.com/zpbappi/angular-autowrap/releases).

## Building from source
Make sure that you have [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) installed globally. 
Then, on the project root folder, run the following commands in sequence:
```sh
npm install
gulp build
```
Output of the is ideal for development, as it is sourcemapped with individual components.
For production use, I would recommend using the version found in *npm*, *bower* or *GitHub Releases*.
However, if you want to use the latest source code, then run
```sh
gulp release
```
and use the build in your project.

## Using it
Yet TODO...

For now, check the `example` folder.

## FAQ
**1.** How come you deploy customized packages in npm, bower and GitHub from travis?
<br>
**Ans:** Isn't that cool? I know! Anyway, please check the `_scripts` folder.
`publish.sh` is the main entry point as defined in `.travis.yml`.
Feel free to use it if you want.

**2.** Why don't you write any documentation and usage example demonstrating the features?
<br>
**Ans:** The reason is quite simple. I don't like to write documentation nearly as much as I like to code.
But, trying to develop the habit now. You will see some progress soon.

**3.** Then why don't you have any tests?
<br>
**Ans:** That is a sin. I am working on that right now.
There will be no additional feature development before I have it under test coverage.
FYI, "not having test" is the main reason behind the version being `0.x.x` yet.