'use strict';

const gulp = require('gulp');
const newer = require('gulp-newer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');

const path = require('path');

const paths = {
  es6: 'es6/**/*.js',
  es5: 'es5',
  sourceRoot: path.join(__dirname, 'es6'), // Must be absolute or relative to source map
};
gulp.task('babel', () =>
  gulp.src(paths.es6)
    .pipe(newer(paths.es5))
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ['node5'] }))
    .pipe(sourcemaps.write('.', { sourceRoot: paths.sourceRoot }))
    .pipe(gulp.dest(paths.es5))
);
gulp.task('watch', ['babel'], () =>
  gulp.watch(paths.es6, ['babel'])
);
gulp.task('default', ['watch']);
