const { src, dest, series } = require('gulp');

const htmlmin = require('gulp-htmlmin');
const del = require('del');

const clear = () => {
    return del('build');
}

const html = () => {
    return src('src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('build'))
}

const css = () => {
    return src('src/css/*.css')
        .pipe(dest('build/css'))
}

const icons = () => {
    return src('src/icon/*.svg')
        .pipe(dest('build/icons'))
}

exports.html = html;
exports.default = series(clear, html, css, icons);