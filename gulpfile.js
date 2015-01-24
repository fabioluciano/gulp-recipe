(function () {
    'use strict';

    // Libraries to import
    var gulp = require('gulp'),
        jshint = require('gulp-jshint'),
        concat = require('gulp-concat'),
        stripDebug = require('gulp-strip-debug'),
        rimraf = require('rimraf'),
        uglify = require('gulp-uglify'),
        exec = require('child_process').exec,
        jade = require('gulp-jade'),
        less = require('gulp-less'),
        CleanCSS = require('less-plugin-clean-css'),

        // Directory structure
        directory = (function () {
            var source = (function () {
                var root = './src/',
                    assets = function () {
                        return root + 'assets/';
                    },
                    javascript = function () {
                        return assets() + 'javascript/';
                    },
                    stylesheet = function () {
                        return assets() + 'stylesheet/';
                    },
                    markup = function () {
                        return root + 'jade/';
                    },
                    vendor = function () {
                        return assets() + 'library/';
                    };

                return {
                    root : root,
                    assets : assets(),
                    javascript :  javascript(),
                    stylesheet :  stylesheet(),
                    markup : markup(),
                    vendor :  vendor()
                };
            }()),
                target = (function () {
                    var root = './dist/',
                        markup = function () {
                            return root;
                        },
                        assets = function () {
                            return root + 'assets/';
                        };

                    return {
                        root :  root,
                        markup : markup(),
                        assets :  assets()
                    };
                }());

            return {
                source : source,
                target : target
            };
        }());

    // Install dependencies in the right places
    gulp.task('bower', function () {
        return exec('bower-installer');
    });

    // Clean the target directory to a new clean project
    gulp.task('clean', function (cb) {
        rimraf(directory.target.root, cb);
    });

    // Concat all vendor javascript files, removes the debug informations and
    // reruns the uglify on minimified files
    gulp.task('javascript-vendor', ['clean'], function () {
        return gulp.src([
            directory.source.vendor + 'hammerjs/javascript/hammer.min.js',
            directory.source.vendor + 'angular/javascript/angular.min.js',
            directory.source.vendor + 'angular-animate/javascript/angular-animate.min.js',
            directory.source.vendor + 'angular-aria/javascript/angular-aria.min.js',
            directory.source.vendor + 'angular-animate/javascript/angular-animate.min.js'
        ])
            .pipe(concat('vendor.js'))
            .pipe(stripDebug())
            .pipe(uglify())
            .pipe(gulp.dest(directory.target.assets));
    });

    // Check for inconsistences of javascript application files
    gulp.task('jshint', ['clean'], function () {
        return gulp.src('./src/assets/javascript/*.js')
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });

    // Concat javascript application files, removes comments and uglify.
    gulp.task('javascript-application', ['clean'], function () {
        return gulp.src('./src/assets/javascript/*.js')
            .pipe(concat('application.js'))
            .pipe(stripDebug())
            .pipe(uglify())
            .pipe(gulp.dest(directory.target.assets));
    });

    // Compile Jade files on html files
    gulp.task('markup', ['clean'], function () {
        return gulp.src(directory.source.markup +  '*.jade')
            .pipe(jade())
            .pipe(gulp.dest(directory.target.markup));
    });

    // Compile LESS files on css files
    gulp.task('stylesheet', ['clean'], function () {
        return gulp.src(directory.source.stylesheet + 'main.less')
            .pipe(less({
                plugins: [new CleanCSS({advanced: true})]
            }))
            .pipe(gulp.dest(directory.target.assets));
    });

    gulp.task('default', ['clean', 'build']);
    gulp.task('build', ['bower', 'markup', 'javascript-vendor', 'jshint', 'javascript-application', 'stylesheet']);

}());
