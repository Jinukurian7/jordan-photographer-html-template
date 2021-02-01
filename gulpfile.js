const gulp = require('gulp');
const sass = require("gulp-sass");
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const streamqueue = require("streamqueue");
const uglify = require("gulp-uglify");
const babel = require('gulp-babel');
const injectPartials = require('gulp-inject-partials');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const browserSync = require("browser-sync").create();

const paths = {
    src: '/',
    dest: '/',
    styles: {
        src: 'src/scss/**/*.scss',
        dest: 'src/css/',
    },
    scripts: {
        src: 'src/lib/**/*.js',
        dest: 'src/js/',
    },
    html: {
        src: 'src/templates/**/*.html',
        dest: 'src/',
    }
};

const sassOpts = {
    outputStyle: 'compressed',
    errLogToConsole: true
};

// SCSS styles task
gulp.task('styles', function() {
    return gulp.src(paths.styles.src)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(sass(sassOpts))
        .pipe(cleanCss())
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest));
});

// JS scripts concat and minify task
gulp.task('scripts', function() {
    gulp.src(['src/lib/**/*.js', '!src/lib/vendors/**'])
    .pipe(plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(concat('main.min.js'))
    .pipe(babel({
        presets: [
          ['@babel/env', {
            modules: false
          }]
        ]
    }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));

  // Copy vendor files
    return streamqueue({ objectMode: true },
        gulp.src('src/lib/vendors/modernizr.js'),
        gulp.src('src/lib/vendors/jquery.min.js'),
        gulp.src('src/lib/vendors/bootstrap.min.js'),
        gulp.src('src/lib/vendors/locomotive-scroll.min.js'),
        gulp.src('src/lib/vendors/TweenMax.min.js'),
        gulp.src('src/lib/vendors/ScrollMagic.min.js'),
        gulp.src('src/lib/vendors/animation.gsap.min.js'),
        gulp.src('src/lib/vendors/slick.min.js')
        )
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(concat('vendors.min.js'))
        .pipe(babel({
            presets: [
              ['@babel/env', {
                modules: false
              }]
            ]
        }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest));
});


// HTML templates render task
gulp.task('ptl_render', function() {
    return gulp.src(paths.html.src)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(injectPartials({
            removeTags: true
        }))
        .pipe(gulp.dest(paths.html.dest));
});

// Reload task 
gulp.task('bs-reload', function() {
    browserSync.reload();
});

// Browser sync task 
gulp.task('browser-sync', function(done) {
    const files = [
    paths.styles.dest,
    paths.scripts.dest,
    paths.html.dest
    ];
    browserSync.init(files, {
        server: {
            baseDir: "./src/",
            injectChanges: true
        }
    });
    done();
});

// Watch task
gulp.task('watch', function() {
    gulp.watch(paths.styles.src, gulp.series('styles')),
    gulp.watch(paths.scripts.src, gulp.series('scripts')),
    gulp.watch(paths.html.src, gulp.series('ptl_render'))
});

// Default task
gulp.task("default",gulp.series('styles','scripts','ptl_render', gulp.parallel('watch', 'browser-sync')));

// Build task
gulp.task("build",function(done){
    var prefix = "build/" ;
    console.log("CLEARING BUILD FOLDER");
    return del([ prefix ])
    .then(function(done) {
        gulp.src(paths.scripts.dest+"*.js")
        .pipe(gulp.dest(prefix+("js/")))
        .on('end', function(done) {
            console.log("SCRIPT COPIED TO BUILD FOLDER");
        });       
        gulp.src(paths.styles.dest+"*.css")
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(prefix+("css/")))
        .on('end', function(done) {
            console.log("STYLES COPIED TO BUILD FOLDER");
        });
        gulp.src("src/images/**")
        .pipe(gulp.dest(prefix+("images/")))
        .on('end', function(done) {
            console.log("IMAGES COPIED TO BUILD FOLDER");
        });
        gulp.src("src/fonts/**")
        .pipe(gulp.dest(prefix+("fonts/")))
        .on('end', function(done) {
            console.log("FONTS COPIED TO BUILD FOLDER");
        });
        gulp.src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true })) 
        .pipe(gulp.dest(prefix+("./")))
        .on('end', function(done) {
            console.log("TEMPLATES COPIED TO BUILD");
        });
        gulp.src("src/*.php")
        .pipe(gulp.dest(prefix+("./")))
        .on('end', function(done) {
            console.log("PHP FILES COPIED TO BUILD");
        });
    })    
})
