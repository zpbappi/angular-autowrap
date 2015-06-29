# Angular AutoWrap

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

For now, check the `example` folder. Make sure you build the source library first.