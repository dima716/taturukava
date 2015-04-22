var gulp = require('gulp'),
    bem = require('gulp-bem'),
    concat = require('gulp-concat'),
    del = require('del'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    pack = require('gulp-bem-pack'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    csso = require('gulp-csso'),
    pngquant = require('imagemin-pngquant'),
    optipng = require('imagemin-optipng'),
    jpegoptim = require('imagemin-jpegoptim'),
    svgo = require('imagemin-svgo');


var levels = [
    'libs/plugins',
    'libs/bootstrap/levels/normalize',
    'libs/bootstrap/levels/print',
    'libs/bootstrap/levels/glyphicons',
    'libs/bootstrap/levels/scaffolding',
    'libs/bootstrap/levels/core',
    'libs/bootstrap/levels/components',
    'libs/bootstrap/levels/js',
    'levels/base',
    'levels/blocks',
    'levels/pages'
];

var tree = bem(levels);

gulp.task('js', function () {
  return tree.deps('levels/pages/index')
    .pipe(bem.src('{bem}.js'))
    .pipe(pack('index.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('uglify', ['js'], function () {
  return gulp.src('dist/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
});

gulp.task('css', function () {
  return tree.deps('levels/pages/index')
    .pipe(bem.src('{bem}.{scss,css}'))
    .pipe(concat('index.css'))
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
})

gulp.task('csso', ['css'], function () {
  return gulp.src('dist/*.css')
    .pipe(csso())
    .pipe(gulp.dest('./dist'))
})

gulp.task('html', function () {
  return tree.deps('levels/pages/index')
    .pipe(bem.src('{bem}.jade'))
    .pipe(concat({
      path: 'levels/pages/index/index.jade',
      base: 'levels/pages/index'
    }))
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
})

gulp.task('assets', function () {
  return gulp.src('assets/**')
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
})

gulp.task('imageoptim', function () {
    gulp.src('dist/img/**/*.{png,jpg,jpeg,svg}')
            .pipe(pngquant({quality: '65-80', speed: 4})())
            .pipe(optipng({optimizationLevel: 3})())
            .pipe(jpegoptim({max: 70})())
            .pipe(svgo()())
            .pipe(gulp.dest('dist/img'));
});

gulp.task('clean', function () {
  del(['./dist']);
})

gulp.task('watch', function () {
  gulp.watch('assets/**/*', ['assets']);
  gulp.watch('levels/**/*.js', ['js']);
  gulp.watch('levels/**/*.scss', ['css']);
  gulp.watch('levels/**/*.jade', ['html']);
})

gulp.task('connect', function () {
  connect.server({
    root: ['./dist'],
    livereload: true
  })
})

// Final building tasks
gulp.task('build', ['html', 'css', 'js', 'assets']);
gulp.task('production', ['build', 'imageoptim', 'uglify', 'csso' ]);
gulp.task('default', ['build', 'connect', 'watch']);
