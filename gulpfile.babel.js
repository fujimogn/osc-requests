import gulp from 'gulp'
import sourcemaps from 'gulp-sourcemaps'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import browserify from 'browserify'
import watchify from 'watchify'
import babel from 'babelify'
import uglifyify from 'uglifyify'
import mocha from 'gulp-mocha'

const src = {
    js: './index.js'
}

const debug = (process.env.NODE_ENV || 'debug').toLowerCase() == 'debug'

function compile(watch) {
    var bundler = watchify(browserify('./src/index.js', { debug: debug })
                                .transform(babel)
                                .transform(uglifyify));

    function rebundle() {
        bundler.bundle()
            .on('error', function(err) { console.error(err); this.emit('end'); })
            .pipe(source('build.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./build'));
    }

    if (watch) {
        bundler.on('update', function() {
            console.log('-> bundling...');
            rebundle();
        });
    }

    rebundle();
}

function watch() {
    return compile(true);
};

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });
gulp.task('default', ['watch']);

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  return gulp.src('test/**/*.js', {read: false})
         .pipe(mocha({
          require: [__dirname + '/src-dev/jsdom.js'],
          reporter: 'nyan',
      }));
});
