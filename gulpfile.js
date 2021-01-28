// this adds the plug-ins to the project so you can use it in your code (need to add the plug-ins on a per project basis to include them in the package.json file. Do not need to install gulp again.)
// require it from the package.json (what it's called in the package.json file i.e. gulp, gulp-sass, gulp-sourcemaps)
var gulp = require('gulp')
var sass = require('gulp-sass')
var cleanCss = require("gulp-clean-css") // plug-in to minimize the code in css file so it's all on one line
var sourcemaps = require("gulp-sourcemaps")
// this will set the source maps as .scss file and the correct line number when you're in Chrome Developer Tools (without it, it shows everything on .css line 1 because of the css minify)
const { sync } = require('gulp-sass')

var browserSync = require("browser-sync").create()
// .create() creates a new server

var imagemin= require("gulp-imagemin")
// minify the images to save load speed
// when you run gulp, it will show you how many images were minified and how many kB saved

var ghpages = require("gh-pages")

sass.compiler = require('node-sass')


// task will run when you type "sass" in command line
gulp.task("sass", function() {
    return gulp.src("src/css/style.scss")
        .pipe(sourcemaps.init())
        // src produces a Node stream, locates matching files and reads them into memory to pass through the stream. Returns the style.scss file located in the css folder.
        // get the file (style.scss), do one thing to it (sass) and then do another thing (cleanCss) and then send it off to a final destination (style.css)
        .pipe(sass())
        .pipe(
            cleanCss({
                compatibility: 'ie8'
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"))
        // the main API of a stream is the .pipe() method for chaining Transform and Writable streams
        // dest() is given as an output directory. When it recieves a file passed through the piepline, it writes the contents and other details out to the filesystem at a given directory. So if we make a change in the scss file, it will change it in the css file after we run "sass" or "gulp" in the command line.
        .pipe(browserSync.stream())
        // automatically streams the changes to the browser and updates when you save
})


gulp.task("html", function () {
    return gulp.src("src/*.html")
        .pipe(gulp.dest("dist"))
        // if you make a change in src, it will update it in dir folder
        // use *.html so it will run on any file with .html since you might have more than one page (i.e. index, about, etc.) 
})

gulp.task("fonts", function () {
    return gulp.src("src/fonts/*")
    // * means match any of these fonts in the folder
        .pipe(gulp.dest("dist/fonts"))
})

gulp.task("images", function () {
    return gulp.src("src/img/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"))
})


gulp.task("watch", function () {
    browserSync.init({
        server:{
            baseDir:"dist"
            //  base directory is the dist folder
            //  the wesbite will open in a new tab after you run gulp
        }
    })

    // .watch watches out for changes. Once you save, it will automatically run the scripts and do the functions
    gulp.watch("src/*.html", ["html"]).on("change", browserSync.reload)
    // run "html" script and update any html changes to the browser automatically
    gulp.watch("src/css/style.scss", ["sass"])
    // run "sass" script and do the above sass function
    gulp.watch("src/fonts/*", ["fonts"])
    // run "fonts" script and move them to the dist folder
    gulp.watch("src/img/*", ["images"])
    // run "images" script and move them to the dist folder
})

// when you run "gulp deploy", it will publish to github pages from the dist folder
// make sure to change the branch to "gh-pages" in Github Pages settings before 
gulp.task("deploy", function (){
    ghpages.publish("dist")
})

// DEFAULT TASK when you run "gulp" in command line
// first it will do the changes and then keep watch
gulp.task('default', ["html", "sass", "fonts", "images", "watch"])