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
var purify = require('gulp-purifycss');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var deleteLines = require('gulp-delete-lines');




//Structure Variable
var SassFiles = "./Content/Sass/**/*.scss";
var cshtmlFiles = 'Views/**/*.cshtml';
var sassCompileDestination = "./Content/Css";
var cssMainFile = sassCompileDestination + "/Site.css";
var DevScriptFolder = "./Scripts/";


gulp.task('ConcatBootstrap', function () {
    var bootsrapFiles = [
        "./Scripts/Bootstrap/util.js",
        "./Scripts/Bootstrap/tooltip.js",
        "./Scripts/Bootstrap/tab.js",
        "./Scripts/Bootstrap/scrollspy.js",
        "./Scripts/Bootstrap/popover.js",
        "./Scripts/Bootstrap/modal.jss",
        "./Scripts/Bootstrap/dropdown.js",
        "./Scripts/Bootstrap/collapse.js",
        "./Scripts/Bootstrap/carousel.js",
        "./Scripts/Bootstrap/button.js",
        "./Scripts/Bootstrap/alert.js"
    ];

    return gulp.src(bootsrapFiles)
        .pipe(deleteLines({ 'filters': [/^(import|export)/] }))
        .pipe(concat("Bootstrap.js"))
        .pipe(gulp.dest(DevScriptFolder));
});

gulp.task('ConcatTether', function () {
    var bootsrapFiles = [
        "./Scripts/Tether/utils.js",
        "./Scripts/Tether/tether.js",
        "./Scripts/Tether/shift.js",
        "./Scripts/Tether/markAttachment.js",
        "./Scripts/Tether/constraint.js",
        "./Scripts/Tether/abutment.js",
    ];

    return gulp.src(bootsrapFiles)      
        .pipe(concat("Tether.js"))
        .pipe(gulp.dest(DevScriptFolder));
});

gulp.task('images', function () {
    return gulp.src('./Content/Images/**/*.*')
        .pipe(imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 })]),
            imagemin.svgo({ plugins: [{ removeViewBox: true }, { cleanupIDs: true }] })
        )

        .pipe(gulp.dest('./Content/Distribution'));
});
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

gulp.task('PurifyCss', function () {
    return gulp.src(cssMainFile)
        .pipe(purify(['Views/**/*.cshtml']))
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

    return gulp.watch([SassFiles, cshtmlFiles], ['CssCompileFlow']);
});
