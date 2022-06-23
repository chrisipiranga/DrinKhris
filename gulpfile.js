//"use strict";

const gulp = require("gulp");
var run = require("gulp-run");
const sass = require("gulp-sass")(require("sass"));
const del = require("del");

gulp.task("sass", () => {
  return gulp
    .src([
      "assets/sass/**/*.scss",
      "!assets/sass/**/custom.scss",
      "!assets/sass/**/variables.scss",
    ])
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./src/css/"));
});

gulp.task("watch", () => {
  gulp.watch("assets/sass/**/*.scss", (done) => {
    gulp.task("default")(done);
  });
});

gulp.task("clean", () => {
  return del(["src/css/**/*.*"]);
});

gulp.task("build", function () {
  return run("npm run build").exec();
});

gulp.task("deploy", gulp.series(["clean", "sass", "build"]));

gulp.task("default", gulp.series(["clean", "sass"]));
