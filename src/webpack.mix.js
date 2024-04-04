const mix = require('laravel-mix')

mix.options({
  terser: {
    extractComments: false,
  }
})

mix
  .setPublicPath('../assets')
  .js('js/helpers.js', 'js/')
  .js('js/app.js', 'js/')
  .js('js/home.js', 'js/')
  .js('js/post.js', 'js/')
  .js('js/lightbox.js', 'js/')
  .extract()
  .sass('sass/app.scss', 'css/')
  .sass('sass/home.scss', 'css/')
  .sass('sass/post.scss', 'css/')
  .sass('sass/tags.scss', 'css/')
  .sass('sass/tag.scss', 'css/')
  .sass('sass/authors.scss', 'css/')
  .sass('sass/author.scss', 'css/')
  .sass('sass/hero.scss', 'css/')
  .sass('sass/membership.scss', 'css/')
  .sass('sass/auth.scss', 'css/')
  .sass('sass/account.scss', 'css/')
  .sass('sass/404.scss', 'css/')
  .options({
    processCssUrls: false
  })
  .browserSync({
    proxy: "localhost:2368",
    files: [
      '../assets/js/**/*.js',
      '../assets/css/**/*.css',
      '../**/*.hbs'
    ]
  })
  .copy('sass/fonts/galerie/*.*', '../assets/fonts/galerie/')
  .copy('sass/fonts/atkinson/*.*', '../assets/fonts/atkinson/')
  .copyDirectory('vendor', '../assets/vendor')
