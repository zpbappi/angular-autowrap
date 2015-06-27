var gulp = require("gulp"),
    del = require("del"),
    concat = require("gulp-concat"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),
    babel = require("gulp-babel"),
    eslint = require("gulp-eslint"),
    rename = require("gulp-rename");

var fileName = "angular-autowrap.js",
    minFileName = "angular-autowrap.min.js";
    
var getSourceFiles = function(lint){
    var stream = gulp.src(["./src/app.js", "./src/**/*.js"]);
    if(!lint){
        return stream;
    }
    
    return stream
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(eslint.formatEach('compact', process.stderr));
};

gulp.task('lint', function(){
   return getSourceFiles(true); 
});

gulp.task("clean", function(cb){
    return del("./build/*", cb);
});

gulp.task("build", ["clean"], function(){
    return getSourceFiles(true)
    .pipe(sourcemaps.init())
    .pipe(concat(fileName))
    .pipe(babel())
    .pipe(sourcemaps.write("./", {includeContent: false, sourceRoot: "../src/"}))
    .pipe(gulp.dest("./build/"));  
});

gulp.task("release", ["clean"], function(){
    return getSourceFiles()
    .pipe(concat(fileName))
    .pipe(babel())
    .pipe(gulp.dest("./build/"))
    .pipe(rename(minFileName))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("./", {includeContent: false, sourceRoot: "./"}))
    .pipe(gulp.dest("./build/"));
});

gulp.task('default', ["build"]);