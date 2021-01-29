// add the plug-ins to the project so you can use it in your code (need to add the plug-ins on a per project basis to include them in the package.json file. Do not need to install gulp again.)
// require it from the package.json (what it's called in the package.json file)

var gulp = require('gulp')

// var sass = require("gulp-sass") removed so we can use PostCSS

var cleanCss = require("gulp-clean-css") // plug-in to minimize the code in css file
var postcss = require("gulp-postcss")
var sourcemaps = require("gulp-sourcemaps")
// this will set the source maps as .scss file and the correct line number when you're in Chrome Developer Tools (without it, it shows everything on .css line 1 because of the css minify)

var concat = require("gulp-concat")

var browserSync = require("browser-sync").create()
// browser refresh
// .create() creates a new server

var imagemin = require("gulp-imagemin")
// minify the images to save load speed
// when you run gulp, it will show you how many images were minified and how many kB saved

var ghpages = require("gh-pages")

// sass.compiler = require("node-sass") removed so we can use PostCSS
// task will run when you type "sass" in command line
// changed "sass and .scss" to "css and .css" so we can use PostCSS
gulp.task("css", function() {
    return gulp.src([
        "src/css/reset.css",
        "src/css/typography.css",
        "src/css/style.css"
        // returns these files from src (we need to package them together because they are no longer imported through sass since it was removed)
    ])
        .pipe(sourcemaps.init())
        // src produces a Node stream, locates matching files and reads them into memory to pass through the stream. Returns the style.scss file located in the css folder.
        // get the file (style.scss), do one thing to it (sass) and then do another thing (cleanCss) and then send it off to a final destination (style.css)
        .pipe(
            postcss([
                require("autoprefixer"),
                require("postcss-preset-env")({
                    stage: 1,
                    browser: ["IE 11", "last 2 versions"]
                    // supports Internet Explorer 11 and last 2 versions of any b
                })
            ])
        )
        // .pipe(sass()) removed so we can use PostCSS
        .pipe(concat("style.css"))
        // joins the three .css files into one called style.css and outputs it into the dist folder below
        .pipe(
            cleanCss({
                compatibility: 'ie8'
                // cleans it up
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"))
        // the main API of a stream is the .pipe() method for chaining Transform and Writable streams
        // dest() is given as an output directory. When it recieves a file passed through the piepline, it writes the contents and other details out to the filesystem at a given directory. So if we make a change in the .scss file, it will change it in the css file after we run "sass" or "gulp" in the command line.
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
        server: {
            baseDir: "dist"
            //  base directory is the dist folder
            //  the wesbite will open in a new tab after you run gulp
        }
    })

    gulp.task('reload', function(){
        browserSync.reload()
        // call the reload method as a separate task
        // this fixed the browser not reloading automatically when changes saved
    })

    // .watch watches out for changes. Once you save, it will automatically run the scripts and do the functions
    gulp.watch("src/*.html", ["html"]).on("change", browserSync.reload)
    // run "html" script and update any html changes to the browser automatically
    gulp.watch("src/css/*", ["css"])
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
// "sass" was changed to "css"
gulp.task('default', ["html", "css", "fonts", "images", "watch"])


// removed sass so we can use PostCSS
// .scss files were changed to .css