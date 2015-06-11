var gulp = require("gulp"),
    del = require("del"),
    concat = require("gulp-concat"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify");

var fileName = "angular-autowrap.js",
    minFileName = "angular-autowrap.min.js";
    
var getSourceFiles = function(){
    return gulp.src(["./src/lib/**/*.js", "./src/app.js", "./src/**/*.js"]);
};

gulp.task("clean-debug", function(cb){
   return del(["./dist/" + fileName, "./dist/" + fileName + ".map"], cb); 
});

gulp.task("clean-release", function(cb){
   return del("./dist/" + minFileName, cb);
});

gulp.task("clean", ["clean-debug", "clean-release"]);

gulp.task("debug", ["clean-debug"], function(){
    return getSourceFiles()
    .pipe(sourcemaps.init())
    .pipe(concat(fileName))
    .pipe(sourcemaps.write("./", {includeContent: false, sourceRoot: "../src/"}))
    .pipe(gulp.dest("./dist/"));  
});

gulp.task("release", ["clean-release"], function(){
    return getSourceFiles()
    .pipe(concat(minFileName))
    .pipe(uglify())
    .pipe(gulp.dest("./dist/"));
});

gulp.task("all", ["debug", "release"]);

gulp.task('default', ["all"]);