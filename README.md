# Blog

This is the codebase for my personal blog at [`paulfioravanti.com`][blog-url].
Created with [Jekyll][jekyll-url].

## Install

```
$ git clone git@github.com:paulfioravanti/paulfioravanti.github.io.git
$ cd paulfioravanti.github.io
$ bundle install
```

### Development Dependencies

This app uses the following [Node][node]-based dependencies during development:

- [Sass Lint][sass-lint]: make sure styling syntax conforms to
  community standards. Note that the [gem version][scss-lint] is deprecated.
- [htmllint][htmllint] (via [htmllint-cli][htmllint-cli]): make sure HTML
  syntax conforms to community standards.

Install dependencies in the following way, and remember to re-shim whatever
version manager is being used for Node, or add the `bin` folder of the Node
installation to the `$PATH`, otherwise executables like `sass-lint` won't be
readily available:

```
$ npm install -g sass-lint htmllint-cli
$ asdf reshim nodejs
```

## Usage

### Start blog server

```
$ bundle exec jekyll start
```

Then, navigate to [`localhost:4000`][localhost].

### Monitor files

This project uses [Guard][guard] to monitor file changes.
  
Start Guard with the following command:

```
$ bundle exec guard
```

## Theme

This blog uses the [Minima][minima] theme, as that seemed to be the theme that
worked best out of the box with Jekyll 3.6 and was usable on
[Github Pages][github-pages], but I'm gradually copying over and overwriting
files with customisations (see the [`_includes`](_includes) directory), with
the intent to eventually leave the theme behind and fully customise everything.

## License

Content in all blog posts are licensed under the
[Creative Commons Attribution 4.0 license][license-cc], and all
source code in this repo and contained within any blog posts is licensed under
the [MIT license][license-mit].

## Social

[![Contact][twitter-badge]][twitter-url]

<a href="http://stackoverflow.com/users/567863/paul-fioravanti">
  <img src="http://stackoverflow.com/users/flair/567863.png" width="208" height="58" alt="profile for Paul Fioravanti at Stack Overflow, Q&amp;A for professional and enthusiast programmers" title="profile for Paul Fioravanti at Stack Overflow, Q&amp;A for professional and enthusiast programmers">
</a>

[blog-url]: https://paulfioravanti.com
[github-pages]: https://pages.github.com/
[guard]: https://github.com/guard/guard
[htmllint]: https://github.com/htmllint/htmllint
[htmllint-cli]: https://github.com/htmllint/htmllint-cli 
[jekyll-url]: https://jekyllrb.com
[license-cc]: LICENSE-CC-BY-4.0.txt
[license-mit]: LICENSE-MIT.txt
[minima]: https://github.com/jekyll/minima
[localhost]: http://localhost:4000/
[node]: https://github.com/nodejs/node
[sass-lint]: https://github.com/sasstools/sass-lint
[scss-lint]: https://github.com/brigade/scss-lint
[twitter-badge]: https://img.shields.io/badge/contact-%40paulfioravanti-blue.svg
[twitter-url]: https://twitter.com/paulfioravanti
