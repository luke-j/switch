import gulp from 'gulp';
import browserify from 'browserify';
import babel from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import collapse from 'bundle-collapser/plugin';
import sourcemaps from 'gulp-sourcemaps';
import jsdoc from 'gulp-jsdoc3';
import eslint from 'gulp-eslint';
import mocha from 'gulp-mocha';
import istanbul from 'gulp-istanbul';
import {Instrumenter} from 'isparta';
import insert from 'gulp-insert';

const paths = {
	lib: {
		main: 'lib/Switch.js',
		files: 'lib/**/*.js'
	},
	compilation: {
		main: 'build.js',
		out: 'dist'
	},
	docs: {
		out: 'docs',
		theme: 'paper'
	},
	tests: {
		main: 'test/mocha.conf.js',
		files: '/test/**/*.js'
	}
};

gulp.task('compile', () => {
	return browserify(paths.lib.main, {debug: true})
		.plugin(collapse)
		.transform(babel)
		.bundle()
		.pipe(source(paths.compilation.main))
		.pipe(buffer())
		// this variable needs to be manually inserted into the global scope because some
		// JS shells pass arguments in different ways, even if they're the same version
		.pipe(insert.prepend('var scriptArgs = scriptArgs || arguments || [];'))
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.compilation.out));
});

gulp.task('docs', () => {
	return gulp.src(['README.md', paths.lib.files])
		.pipe(jsdoc({
			opts: {destination: paths.docs.out},
			templates: {
				theme: 'paper',
				systemName: 'Switch'
			}
		}));
});

gulp.task('lint', () => {
	return gulp.src([paths.lib.files, paths.tests.files, '!node_modules/**'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('pre-test', () => {
	return gulp.src(paths.lib.files)
		.pipe(istanbul({instrumenter: Instrumenter, includeUntested: false}))
		.pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], () => {
	return gulp.src(paths.tests.main, {read: false})
		.pipe(mocha({globals: ['environment', 'print', 'quit', 'read', 'scriptArgs']}))
		.pipe(istanbul.writeReports({reporters: ['html', 'lcov']}))
		.pipe(istanbul.enforceThresholds({thresholds: {global: {lines: 90}}}));
});

gulp.task('watch', () => {
	return gulp.watch([paths.lib.files], ['compile']);
});

gulp.task('default', ['lint', 'test', 'docs', 'compile']);