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

gulp.task("clean-build", function(cb){
   return del(["./build/" + fileName, "./build/" + fileName + ".map"], cb); 
});

gulp.task("clean-minify", function(cb){
   return del("./build/" + minFileName, cb);
});

gulp.task("clean", ["clean-build", "clean-minify"]);

gulp.task("build", ["clean-build"], function(){
    return getSourceFiles()
    .pipe(sourcemaps.init())
    .pipe(concat(fileName))
    .pipe(sourcemaps.write("./", {includeContent: false, sourceRoot: "../src/"}))
    .pipe(gulp.dest("./build/"));  
});

gulp.task("minify", ["clean-minify"], function(){
    return getSourceFiles()
    .pipe(concat(minFileName))
    .pipe(uglify())
    .pipe(gulp.dest("./build/"));
});

gulp.task('default', ["build", "minify"]);