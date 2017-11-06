# Blog

This is the codebase for my personal blog at [`paulfioravanti.com`][blog-url].
Created with [Jekyll][jekyll-url].

## Install

```
$ git clone git@github.com:paulfioravanti/paulfioravanti.github.io.git
$ cd paulfioravanti.github.io
$ bundle install
```

## Usage

### Start blog server

```
$ bundle exec jekyll start
```

Then, navigate to [`localhost:4000`][localhost].

### Monitor files

This project uses [Guard][guard] to monitor file changes on the following types
of files:

- SCSS files: runs [`scss-lint`][scss-lint] to make sure styling syntax conforms
  to community standards.
  
Start Guard with the following command:

```
$ bundle exec guard
```

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
[guard]: https://github.com/guard/guard
[jekyll-url]: https://jekyllrb.com
[license-cc]: LICENSE-CC-BY-4.0.txt
[license-mit]: LICENSE-MIT.txt
[localhost]: http://localhost:4000/
[scss-lint]: https://github.com/brigade/scss-lint
[twitter-badge]: https://img.shields.io/badge/contact-%40paulfioravanti-blue.svg
[twitter-url]: https://twitter.com/paulfioravanti
