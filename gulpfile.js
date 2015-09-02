//INCLUDE GULP PLUGINS

var gulp 			= require('gulp'),
	sass			= require('gulp-sass'),
	concat			= require('gulp-concat'),
	jshint			= require('gulp-jshint'),
	uglify			= require('gulp-uglify'),
	rename			= require('gulp-rename'),
	stylish			= require('jshint-stylish'),
	browserSync		= require('browser-sync').create(),
	sourcemaps		= require('gulp-sourcemaps'),
	plumber			= require('gulp-plumber'),
	iconfont		= require('gulp-iconfont'),
	imageop			= require('gulp-image-optimization'),
	minifyCss		= require('gulp-minify-css');


//PATHS TO WATCH

var paths = {
	sass: [
		'./source/elements/**/sass/*.scss',
		'./source/objects/**/sass/*.scss',
		'./source/sass/main.scss',
		'./source/sass/**/*.scss'
	],
	js: [
		'./source/elements/**/js/*.js',
		'./source/objects/**/js/*.js'
	],
	vendors: [
		'./public/library/js/vendor/bootstrap.min.js',
		'./public/library/js/vendor/jquery.responsivegrid.js'
	],
	images: [
		'./source/library/img/*'
	]
};


//SASS BUILD
gulp.task('sass', function() {
	gulp.src('./source/sass/main.scss')
		// Initialize sourcemaps
		.pipe(sourcemaps.init())
		.pipe(plumber())
        .pipe(sass())
        // Write sourcemaps to /library/css/maps
        .pipe(sourcemaps.write('./maps'))
        // CSS destination
        .pipe(gulp.dest('./public/library/css'));
});

//SASS DEPLOY
gulp.task('sass_deploy', function() {
	gulp.src('./source/sass/main.scss')
		// Initialize sourcemaps
		.pipe(sourcemaps.init())
		.pipe(plumber())
        .pipe(sass())
        // Minify CSS
        .pipe(minifyCss({compatibility: 'ie8'}))
        // CSS destination
        .pipe(gulp.dest('./public/library/css'));
});

//JAVASCRIPT BUILD
gulp.task('js', function(){
	gulp.src(paths.js)
		// Initialize Sourcemaps
		.pipe(sourcemaps.init())
		// Check for errors
		.pipe(plumber())
		// Check on syntax errors
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		// Concatenate all JS files into one
		.pipe(concat('main.min.js'))
		//Stop plumber errors
		.pipe(plumber.stop())
		// will write the source maps to ./Library/scripts/maps
		.pipe(sourcemaps.write('./maps'))
		// Where to store the finalized JS
		.pipe(gulp.dest('./public/library/js'));
});

//JAVASCRIPT DEPLOY
gulp.task('js_deploy', function(){
	gulp.src(paths.js)
		// Initialize Sourcemaps
		.pipe(sourcemaps.init())
		// Check for errors
		.pipe(plumber())
		// Check on syntax errors
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		// Concatenate all JS files into one
		.pipe(concat('main.min.js'))
		// Minify JS
		.pipe(uglify())
		//Stop plumber errors
		.pipe(plumber.stop())
		// will write the source maps to ./Library/scripts/maps
		.pipe(sourcemaps.write('./maps'))
		// Where to store the finalized JS
		.pipe(gulp.dest('./public/library/js'));
});

//JS VENDORS BUILD
gulp.task('vendors', function(){
	gulp.src(paths.vendors)
		// Concatenate all JS files into one
		.pipe(concat('vendors.min.js'))
		// Minify JS
		.pipe(uglify())
		// Where to store the finalized JS
		.pipe(gulp.dest('./public/library/js'));
});


//ICONFONT
gulp.task('iconfont', function(){
	gulp.src(['./public/library/icons/*.svg'])
		.pipe(iconfont({
			// Name of the font
			fontName: 			'stimuliz-icons',
			appendCodepoints: 	true
		}))
		.on('codepoints', function(codepoints, options) {
	        // CSS templating, e.g.
	        console.log(codepoints, options);
	    })
		.pipe(gulp.dest('./public/library/fonts'));
});

//IMAGE OPTIM.
gulp.task('images', function(){
	gulp.src(paths.images)
		.pipe(imageop({
			optimizationLevel: 5,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('./public/library/img'));
});

//BROWSER SYNC
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }

        // proxy: "http://stimuliz:8888"

    });

	gulp.watch(paths.sass, ['sass']).on('change', browserSync.reload);
    gulp.watch(paths.js, ['js']).on('change', browserSync.reload);
    gulp.watch("*.html").on('change', browserSync.reload);
});


//GULP WATCH TASK
gulp.task('watch', ['browser-sync'], function(){
	gulp.watch(paths.sass, ['sass']);
	gulp.watch(paths.js, ['js']);
});

//GULP SETUP TASK
gulp.task('setup', ['sass', 'js', 'vendors', 'images']);

//GULP BUILD TASK
gulp.task('build', ['watch', 'browser-sync']);

//DEFAULT GULP TASK

gulp.task('default', ['watch', 'browser-sync']);

//DEPLOY GULP TASK
gulp.task('deploy', ['sass_deploy', 'js_deploy', 'vendors', 'images']);
