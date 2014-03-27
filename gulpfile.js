var gulp        = require('gulp'),
    uglify      = require('gulp-uglify'),
    imagemin    = require('gulp-imagemin'),
    jade        = require('gulp-jade'),
    clean       = require('gulp-clean')
    less        = require('gulp-less'),
    concat      = require('gulp-concat'),
    livereload  = require('gulp-livereload'),
    tinylr      = require('tiny-lr'),
    path        = require('path'),
    server      = tinylr();

var srcFolder           = 'src/'
    javascriptSrcFolder = srcFolder + 'javascript/',
    cssSrcFolder        = srcFolder + 'stylesheet/',
    imagesSrcFolder     = srcFolder + 'images/',
    lessSrcFolder       = srcFolder + 'less/',
    jadeSrcFolder       = srcFolder + 'jade/',

    targetFolder            = 'dist/',
    javascriptTargetFolder  = targetFolder + 'javascript/',
    cssTargetFolder         = targetFolder + 'css/',
    imagesTargetFolder      = targetFolder + 'images/',
    lessTargetFolder        = targetFolder + 'css/',
    jadeTargetFolder        = targetFolder;


gulp.task('clean', function() {
  return gulp.src(targetFolder, {read:false})
    .pipe(clean({force: true}));
});

gulp.task('javascript', function() {
  return gulp.src([javascriptSrcFolder + '*.js'])
    .pipe(uglify())
    .pipe(gulp.dest(javascriptTargetFolder))
    .pipe(livereload(server));
});

gulp.task('less', function() {
  gulp.src(lessSrcFolder + 'less/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(uglify())
    .pipe(concat('all.min.css'))
    .pipe(gulp.dest(cssTargetFolder))
    .pipe(livereload(server));
});

gulp.task('images', function() {
  return gulp.src(imagesSrcFolder + '*.(jpe?g|gif|png)')
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(imagesTargetFolder))
    .pipe(livereload(server));
});

gulp.task('jade', function() {
  return gulp.src(jadeSrcFolder + '*.jade')
    .pipe(jade())
    .pipe(gulp.dest(jadeTargetFolder))
    .pipe(livereload(server));
});

gulp.task('watch', function() {
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    }

    gulp.watch(javascriptSrcFolder + '*.js', 'javascript');
    gulp.watch(lessSrcFolder += '*.less', 'less');
    gulp.watch(imagesSrcFolder + '*.(jpe?g|gif|png)', 'images');
    gulp.watch(jadeSrcFolder + '*.jade', 'less');
  });
});


gulp.task('default', ['clean', 'less', 'javascript', 'images', 'jade', 'watch']);
