(function () {
    'use strict';

    // Libraries to import
    var gulp = require('gulp'),
        bower = require('gulp-bower'),
        notify = require('gulp-notify'),
        jshint = require('gulp-jshint'),
        concat = require('gulp-concat'),
        rimraf = require('rimraf'),
        uglify = require('gulp-uglify'),
        ngAnnotate = require('gulp-ng-annotate'),
        less = require('gulp-less'),
        colors = require('colors'),
        less = require('gulp-less'),
        stylish = require('jshint-stylish'),
        watch = require('gulp-watch'),
        CleanCSS = require('less-plugin-clean-css');

    // Directory structure
    var directory = (function () {
            var source = (function () {
                var root = 'resources/',
                    assets = function () {
                        return root + 'assets/';
                    },
                    javascript = function () {
                        return assets() + 'javascript/';
                    },
                    less = function () {
                        return assets() + 'less/';
                    },
                    vendor = function () {
                        return assets() + 'bower/';
                    };

                return {
                    root : root,
                    assets : assets(),
                    javascript :  javascript(),
                    less :  less(),
                    vendor :  vendor()
                };
            }()),
                target = (function () {
                    var root = 'public/',
                        assets = function () {
                            return root + 'assets/';
                        },
                        javascript = function () {
                            return assets() + 'javascript/';
                        },
                        stylesheet = function () {
                            return assets() + 'stylesheet/';
                        };
                    return {
                        root :  root,
                        assets :  assets(),
                        javascript : javascript(),
                        stylesheet : stylesheet()
                    };
                }());

            return {
                source : source,
                target : target
            };
        }());

    // Install dependencies
    gulp.task('bower', function () {
        console.log('Instalando dependencias!'.green);
        return bower({ cmd : 'install'});
    });

    // Concat all vendor javascript files, removes the debug informations and
    // reruns the uglify on minimified files
    gulp.task('javascript-vendor', ['dependencies'], function () {
        var javascript = [
            directory.source.vendor + 'lodash/lodash.min.js',
            directory.source.vendor + 'angular/angular.min.js',
            directory.source.vendor + 'angular-route/angular-route.min.js',
            directory.source.vendor + 'angular-resource/angular-resource.min.js',
            directory.source.vendor + 'angular-sanitize/angular-sanitize.min.js',
            directory.source.vendor + 'angular-cookies/angular-cookies.min.js',
            directory.source.vendor + 'angular-i18n/angular-locale_pt-br.js',
            directory.source.vendor + 'angular-loading-bar/build/loading-bar.min.js',
            directory.source.vendor + 'angular-translate/angular-translate.min.js',
            directory.source.vendor + 'angular-translate-storage-local/angular-translate-storage-local.min.js',
            directory.source.vendor + 'angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
            directory.source.vendor + 'angular-flash-alert/dist/angular-flash.min.js',
            directory.source.vendor + 'angular-animate/angular-animate.min.js',
            directory.source.vendor + 'angular-ui-mask/dist/mask.min.js',
            directory.source.vendor + 'angular-bootstrap/ui-bootstrap.min.js',
            directory.source.vendor + 'angular-bootstrap/ui-bootstrap-tpls.min.js'
        ];

        return gulp.src(javascript)
            .pipe(concat('vendor.js'))
            .pipe(uglify({mangle: {toplevel: true}}))
            .pipe(gulp.dest(directory.target.javascript))
            .pipe(notify('Javascript de bibliotecas externas gerado com sucesso!'));
    });

    // Concat all application javascript files, removes the debug informations and
    // reruns the uglify on minimified files
    gulp.task('javascript-application', ['dependencies'], function () {
        var javascript = [
            directory.source.javascript + 'application.js',
            directory.source.javascript + 'configuration/**/*',
            directory.source.javascript + 'service/**/*',
            directory.source.javascript + 'controller/**/*',
        ];

        return gulp.src(javascript)
            .pipe(concat('application.js'))
            .pipe(ngAnnotate())
            // .pipe(uglify())
            .pipe(gulp.dest(directory.target.javascript))
            .pipe(notify('Javascript da aplicação gerado com sucesso!'));
    });

    // Check for inconsistences of javascript application files
    gulp.task('jshint', ['build'], function () {
        return gulp.src(directory.target.javascript + 'application.js')
            .pipe(jshint())
            .pipe(jshint.reporter(stylish));
    });

    // Compile LESS files on css files
    gulp.task('stylesheet-vendor', ['dependencies'], function () {
        return gulp.src(directory.source.less + 'vendor.less')
            .pipe(less({
                plugins: [new CleanCSS({advanced: true})]
            }))
            .pipe(gulp.dest(directory.target.stylesheet))
            .pipe(notify('Stylesheet de bibliotecas externas gerado com sucesso!'));
    });

    gulp.task('stylesheet-application', function () {
        return gulp.src(directory.source.less + 'application.less')
            .pipe(less({
                plugins: [new CleanCSS({advanced: true})]
            }))
            .pipe(gulp.dest(directory.target.stylesheet))
            .pipe(notify('Stylesheet da aplicação gerado com sucesso!'));
    });

    gulp.task('install-fonts', function () {
        var fontDirectory = [
            'resources/assets/bower/fontawesome/fonts/*',
            'resources/assets/bower/bootswatch-dist/fonts/*'
        ];

        return gulp.src(fontDirectory)
            .pipe(gulp.dest(directory.target.assets + 'fonts'));
    });

    gulp.task('watch-dependencies-bower', function () {
        var watcher = gulp.watch('bower.json', ['bower', 'javascript-vendor', 'stylesheet-vendor']);

        watcher.on('change', function(event) {
            gulp.src('bower.json').pipe(notify('O arquivo de dependencias foi modificado!'));
        });
    });

    gulp.task('watch-javascript', function () {
        var watcher = gulp.watch(directory.source.javascript + '**/*.js', ['javascript-application']);

        watcher.on('change', function(event) {
            gulp.src('gulpfile.js')
                .pipe(notify('Arquivo ' + event.path + ' foi ' + event.type));
        });
    });

    gulp.task('watch-stylesheet', function () {
        var watcher = gulp.watch(directory.source.less + '**/*', ['stylesheet-application']);

        watcher.on('change', function(event) {
            gulp.src('gulpfile.js')
                .pipe(notify('Arquivo ' + event.path + ' foi ' + event.type));
        });
    });

    gulp.task('default', ['dependencies', 'build', 'lint', 'watch']);
    gulp.task('dependencies', ['bower']);
    gulp.task('build', ['javascript', 'stylesheet']);
    gulp.task('javascript', ['javascript-vendor', 'javascript-application']);
    gulp.task('stylesheet', ['stylesheet-vendor', 'stylesheet-application', 'install-fonts']);
    gulp.task('lint', ['jshint']);
    gulp.task('watch', ['watch-dependencies-bower', 'watch-javascript', 'watch-stylesheet']);
}());
