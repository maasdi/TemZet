var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var less = require('gulp-less');
var path = require('path');

var conf = {
  HTML: 'src/index.html',
  LESS: 'src/less/*.less',
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  DEST: 'dist',
  DEST_BUILD: 'dist/build',
  DEST_SRC: 'dist/src',
  ENTRY_POINT: 'src/js/App.js'
};

gulp.task('copy', function(){
  gulp.src(conf.HTML)
    .pipe(gulp.dest(conf.DEST));
});

gulp.task('less', function () {
  return gulp.src(conf.LESS)
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest(conf.DEST_SRC + '/css'));
});

gulp.task('compile', function() {
    browserify({
        entries: [conf.ENTRY_POINT],
        transform: [reactify],
        debug: true
    }).bundle()
      .pipe(source(conf.OUT))
      .pipe(gulp.dest(conf.DEST_SRC + '/js'));
});

gulp.task('watch', function() {
  gulp.watch(conf.HTML, ['copy']);
  gulp.watch(conf.LESS, ['less']);

  var watcher  = watchify(browserify({
    entries: [conf.ENTRY_POINT],
    transform: [reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: false
  }));

  return watcher.on('update', function () {
    watcher.bundle()
      .pipe(source(conf.OUT))
      .pipe(gulp.dest(conf.DEST_SRC + '/js'))
      console.log('Javascript files updated');
  })
    .bundle()
    .pipe(source(conf.OUT))
    .pipe(gulp.dest(conf.DEST_SRC + '/js'));
});

gulp.task('default', ['less','copy', 'watch']);

gulp.task('build', function(){
  browserify({
    entries: [conf.ENTRY_POINT],
    transform: [reactify]
  })
    .bundle()
    .pipe(source(conf.MINIFIED_OUT))
    .pipe(streamify(uglify(conf.MINIFIED_OUT)))
    .pipe(gulp.dest(conf.DEST_BUILD + '/js'));

  gulp.src(conf.LESS)
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest(conf.DEST_BUILD + '/css'));

});

gulp.task('replaceHTML', function(){
  gulp.src(conf.HTML)
    .pipe(htmlreplace({
	  'css': 'build/css/styles.css',
      'js': 'build/js/' + conf.MINIFIED_OUT
    }))
    .pipe(gulp.dest(conf.DEST));
});

gulp.task('production', ['replaceHTML', 'build']);