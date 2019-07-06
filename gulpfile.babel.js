import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import webpack from 'webpack';
import rimraf from 'rimraf';

const plugins = loadPlugins();
//  "webpack-dev-server --open --config ./content/webpack.dev.js"
import popupWebpackConfig from './popup/webpack.config';
import eventWebpackConfig from './event/webpack.config';
import contentWebpackConfig from './content/webpack.config';

gulp.task('popup-js', ['clean'], (cb) => {
  webpack(popupWebpackConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});

gulp.task('event-js', ['clean'], (cb) => {
  webpack(eventWebpackConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});

gulp.task('content-js', ['clean'], (cb) => {
  webpack(contentWebpackConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});

// gulp.task('content-html', ['clean'], () => {
//   return gulp.src('content/src/index.html')
//     .pipe(plugins.rename('content.html'))
//     .pipe(gulp.dest('./build'))
// });

// "icons-woff", "icons-woff2", "icons-ttf",

gulp.task('icons-woff', ['clean'], () => {
  return gulp.src('./icons.woff')
    .pipe(gulp.dest('./build'))
});

gulp.task('icons-woff2', ['clean'], () => {
  return gulp.src('icons.woff2')
    .pipe(gulp.dest('./build'))
});


gulp.task('icons-ttf', ['clean'], () => {
  return gulp.src('icons.ttf"')
    .pipe(gulp.dest('./build'))
});
gulp.task('popup-html', ['clean'], () => {
  return gulp.src('popup/src/index.html')
    .pipe(plugins.rename('popup.html'))
    .pipe(gulp.dest('./build'))
});

gulp.task('lightningreader-html', ['clean'], () => {
  return gulp.src('lightning-reader.html')
    .pipe(plugins.rename('lightning-reader.html'))
    .pipe(gulp.dest('./build'))
});

gulp.task('copy-styles', ['clean'], () => {
  return gulp.src('styles.css')
             .pipe(gulp.dest('./build'));
});

gulp.task('copy-manifest', ['clean'], () => {
  return gulp.src('manifest.json')
    .pipe(gulp.dest('./build'));
});

// gulp.task('copy-lightsvg', ['clean'], () => {
//   return gulp.src('lightsvg.svg')
//     .pipe(gulp.dest('./build'));
// });
gulp.task('copy-iconpng32', ['clean'], () => {
  return gulp.src('icon32.png')
    .pipe(gulp.dest('./build'));
});

gulp.task('copy-iconpng', ['clean'], () => {
  return gulp.src('icon64.png')
    .pipe(gulp.dest('./build'));
});
gulp.task('copy-donate-icon', ['clean'], () => {
  return gulp.src('donate.png')
    .pipe(gulp.dest('./build'));
});

gulp.task('copy-close-icon', ['clean'], () => {
  return gulp.src('close.png')
    .pipe(gulp.dest('./build'));
});
gulp.task('copy-add-icon', ['clean'], () => {
  return gulp.src('add.png')
    .pipe(gulp.dest('./build'));
});
gulp.task('copy-minus-icon', ['clean'], () => {
  return gulp.src('minus.png')
    .pipe(gulp.dest('./build'));
});
gulp.task('copy-play-icon', ['clean'], () => {
  return gulp.src('play.png')
    .pipe(gulp.dest('./build'));
});
gulp.task('copy-pause-icon', ['clean'], () => {
  return gulp.src('pause.png')
    .pipe(gulp.dest('./build'));
});
gulp.task('copy-settings-icon', ['clean'], () => {
  return gulp.src('settings.png')
    .pipe(gulp.dest('./build'));
});

gulp.task('copy-iconpng128', ['clean'], () => {
  return gulp.src('icon128.png')
    .pipe(gulp.dest('./build'));
});

gulp.task('copy-semantic', ['clean'], () => {
  return gulp.src('semantic.css')
    .pipe(gulp.dest('./build'));
});

gulp.task('copy-favicon', ['clean'], () => {
  return gulp.src('favicon.ico')
    .pipe(gulp.dest('./build'));
});


gulp.task('clean', (cb) => {
  rimraf('./build', cb);
});

gulp.task('build', [ 'copy-styles', 'copy-semantic', 
'copy-settings-icon', 'copy-close-icon', 'copy-add-icon', 'copy-minus-icon', 'copy-pause-icon', 'copy-play-icon', 
'copy-iconpng128', 'copy-favicon', 'copy-iconpng', 'copy-iconpng32', 
'copy-manifest', 'popup-js', 'popup-html', 'event-js', 'content-js']);

// gulp.task('watch', ['default'], () => {
//   gulp.watch('popup/**/*', ['build']);
//   gulp.watch('content/**/*', ['build']);
//   gulp.watch('event/**/*', ['build']);
// });

gulp.task('default', ['build']);
