//Packages Variable 
var gulp = require('gulp');
var compileSass = require('gulp-sass');
var concatenateFiles = require('gulp-useref');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-cssnano');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();




//Structure Variable
var SassFiles = "./Content/Sass/*.scss";
var sassCompileDestination = "./Content/Css";
var cssMainFile = sassCompileDestination + "/Site.css";

gulp.task('InitBrowserSync', function () {
    var files = [
        'Content/**/*.css',
        'Views/**/*.cshtml'
    ];

    browserSync.init(files, {

        proxy: "http://localhost:50135/"
    });
});

gulp.task('CompileSass', function () {
    return gulp.src("./Content/Sass/Site.scss")
        .pipe(compileSass())
        .pipe(gulp.dest(sassCompileDestination));
});

gulp.task('ConcatCss', function () {
    return gulp.src
        ([
            './Content/Css/Bootstrap.css',
            './Content/Css/NavBar.css',
            './Content/Css/Jumbotron.css',
            './Content/Css/Footer.css'

        ])
        .pipe(concat('Site.css'))
        .pipe(gulp.dest(sassCompileDestination));
});

gulp.task('MinifyCss', function () {
    return gulp.src(cssMainFile)
        .pipe(rename('Site.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(sassCompileDestination));
});

gulp.task('Autoprefixing', function () {
    gulp.src(sassCompileDestination + "/Site.min.css")
            .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
            .pipe(gulp.dest(sassCompileDestination));
}
);

gulp.task('CssCompileFlow', function (callback) {
    runSequence(['CompileSass'], ['MinifyCss'], ['Autoprefixing'], ['ReloadBrowser'], callback);
});

gulp.task('ReloadBrowser', function (callback) {
    browserSync.reload({
        stream: true
    });
    callback();
});


gulp.task('watch', ['InitBrowserSync'], function () {

    return gulp.watch(SassFiles, ['CssCompileFlow']);
});
