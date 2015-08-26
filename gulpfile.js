var gulp = require("gulp"),
	less = require("gulp-less"),
	autoprefixer = require("gulp-autoprefixer"),
	minifycss = require("gulp-minify-css"),
	jshint = require("gulp-jshint"),
	uglify = require("gulp-uglify"),
	babel = require('gulp-babel'),
	rename = require("gulp-rename"),
	concat = require("gulp-concat"),
	notify = require("gulp-notify"),
	del = require("del"),
	watch = require("gulp-watch");

var lessFiles = "src/styles/*.less";
var outputStyles = "dist/styles";
var scriptFiles = "src/scripts/*.js";
var outputSscripts = "dist/scripts";


// 样式表单个编译
function less2css(files) {
	return gulp.src(files)
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ["last 3 version", "ie > 8", "Android >= 3", "Safari >= 5.1", "iOS >= 5"]
		}))
		.pipe(gulp.dest(outputStyles))
		.pipe(minifycss())
		.pipe(gulp.dest(outputStyles));
	// .pipe(notify({
	// 	message: "样式表任务完成。"
	// }));
}

// 脚本单个编译
function scriptFn(files) {
	return gulp.src(files)
		.pipe(jshint())
		.pipe(jshint.reporter("default"))
		.pipe(babel())
		.pipe(gulp.dest(outputSscripts))
		.pipe(uglify())
		.pipe(rename({
			suffix: "-min"
		}))
		.pipe(gulp.dest(outputSscripts))
		.pipe(notify({
			message: "脚本任务完成。"
		}));
}



// 编译所有样式表
gulp.task("styles", function() {
	less2css(lessFiles);
});

// 编译所有脚本
gulp.task("scripts", function() {
	scriptFn(scriptFiles);
});

// 全部编译
gulp.task("build", function() {
	less2css(lessFiles);
	scriptFn(scriptFiles);
});
// CLEAN
gulp.task("clean", function(cb) {
	del([outputStyles, outputSscripts], cb);
});

// 如有变动，全部重新编译
gulp.task("run", function() {
	// Watch .LESS files
	watch(lessFiles, ["styles"]);
	// Watch .js files
	watch(scriptFiles, ["scripts"]);
});


// 默认任务
gulp.task("default", function() {
	console.log("监控启动。");
	watch(lessFiles, function(event) {
		console.log("样式表：" + event.path + " 事件类型：" + event.type);
		less2css(event.path);
	});
	watch(scriptFiles, function(event) {
		console.log("脚本文件：" + event.path + "  事件类型：" + event.type);
		scriptFn(event.path);
	});
});