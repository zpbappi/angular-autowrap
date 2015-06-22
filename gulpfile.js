var gulp = require("gulp"),
    del = require("del"),
    concat = require("gulp-concat"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),
    babel = require("gulp-babel"),
    eslint = require("gulp-eslint");

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

gulp.task("clean-build", function(cb){
   return del(["./build/" + fileName, "./build/" + fileName + ".map"], cb); 
});

gulp.task("clean-minify", function(cb){
   return del("./build/" + minFileName, cb);
});

gulp.task("clean", ["clean-build", "clean-minify"]);

gulp.task("build", ["clean-build"], function(){
    return getSourceFiles(true)
    .pipe(sourcemaps.init())
    .pipe(concat(fileName))
    .pipe(babel())
    .pipe(sourcemaps.write("./", {includeContent: false, sourceRoot: "../src/"}))
    .pipe(gulp.dest("./build/"));  
});

gulp.task("minify", ["clean-minify"], function(){
    return getSourceFiles()
    .pipe(concat(minFileName))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest("./build/"));
});

gulp.task('default', ["build", "minify"]);