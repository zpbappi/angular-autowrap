var gulp = require("gulp"),
    del = require("del"),
    concat = require("gulp-concat"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),
    babel = require("gulp-babel"),
    eslint = require("gulp-eslint"),
    karma = require("gulp-karma"),
    addsrc = require("gulp-add-src");

var fileName = "angular-autowrap.js",
    minFileName = "angular-autowrap.min.js";

var sourceLocations = [
    "./src/app.js", 
    "./src/**/*.js"
];
    
var getSourceFiles = function(lint){
    var stream = gulp.src(sourceLocations);
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
    .pipe(sourcemaps.init())
    .pipe(concat(minFileName))
    .pipe(uglify())
    .pipe(sourcemaps.write("./", {includeContent: false, sourceRoot: "./"}))
    .pipe(gulp.dest("./build/"));
});

gulp.task("test", function(){
    var testFiles = [
        "test/**/*.js"
    ];
    var testDependecies = [
        'node_modules/angular/angular.js',
        'node_modules/angular-mocks/angular-mocks.js'
    ];
    
    var testSuite = [];
    testSuite.concat(testDependecies, sourceLocations, testFiles);
    
    return gulp.src(testSuite)
    .pipe(karma({
        configFile: "karma.conf.js",
        action: "run",
        reporters: ["spec"]
    }))
    .on("error", function(err){
        throw err;
    });
});

gulp.task('default', ["build"]);