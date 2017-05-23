'use strict';

const gulp = require('gulp');

const del = require('del');

const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');

const SRC_SCSS_FILES = 'src/style/**/*.scss';
const DEST_CSS_FILES = 'dist/style/';

const SRC_HTML_FILES = 'src/**/*.html';

const SRC = 'src/';
const DEST = 'dist/';

function clean() {
    return del(DEST);
}

gulp.task('clean', clean);

const bs = browserSync.create('dev');

function serverWatch(done) {
    bs.init({
        server: {
            baseDir: [SRC, DEST]
        },
        files: [SRC_HTML_FILES, DEST_CSS_FILES],
        browser: [],
        notify: false,
        logConnections: true,
        injectChanges: true,
        watchOptions: {
            ignoreInitial: true
        }
    });

    done();
}

gulp.task('server:watch', serverWatch);

function scssCompile() {
    return gulp.src(SRC_SCSS_FILES)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 Chrome versions']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DEST_CSS_FILES));
}

function scssWatch() {
    return gulp.watch(SRC_SCSS_FILES, gulp.parallel(scssCompile));
}

gulp.task('scss:compile', scssCompile);
gulp.task('scss:watch', scssWatch);

const build = gulp.series(
    'clean',
    'scss:compile'
);

const watch = gulp.parallel(
    'scss:watch',
    'server:watch'
);

gulp.task('build', gulp.series(build));
gulp.task('watch', gulp.series(build, watch));