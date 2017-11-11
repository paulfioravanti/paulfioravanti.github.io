# Blog

This is the codebase for my personal blog at [`paulfioravanti.com`][blog-url].
Created with [Jekyll][jekyll-url].

## Install

```sh
git clone git@github.com:paulfioravanti/paulfioravanti.github.io.git
cd paulfioravanti.github.io
bundle install
```

### Development Dependencies

This app uses the following [Node][node]-based dependencies during development:

- [Sass Lint][sass-lint]: make sure styling syntax conforms to
  community standards. Note that the [gem version][scss-lint] is deprecated.
- [htmllint][htmllint] (via [htmllint-cli][htmllint-cli]): make sure HTML
  syntax conforms to community standards.

Install dependencies in the following way, and remember to re-shim whatever
version manager is being used for Node (I use [`asdf`][asdf]), or add the `bin`
folder of the Node installation to the `$PATH`, otherwise executables like
`sass-lint` won't be available:

```sh
npm install -g sass-lint htmllint-cli
asdf reshim nodejs
```

## Usage

### Start blog server

```sh
bundle exec jekyll start
```

Then, navigate to [`localhost:4000`][localhost].

### Monitor files

This project uses [Guard][guard] to monitor file changes.

Start Guard with the following command:

```sh
bundle exec guard
```

## Theme

This blog uses the [Minima][minima] theme, as that seemed to be the theme that
worked best out of the box with Jekyll 3.6 and was usable on
[Github Pages][github-pages], but I'm gradually copying over and overwriting
files with customisations (see the [`_includes`](_includes) directory), with
the intent to eventually leave the theme behind and fully customise everything.

## License

| Category |                         License                           |
|----------|-----------------------------------------------------------|
| Content  | [![License: CC BY 4.0][license-cc-badge]][license-cc-url] |
| Code     | [![License: MIT][license-mit-badge]][license-mit-url]     |

Content in all blog posts is licensed under the
[Creative Commons Attribution 4.0 license][license-cc], and all
source code in this repo, and contained within any blog posts, is licensed
under the [MIT license][license-mit].

## Social

[![Contact][twitter-badge]][twitter-url]<br />
[![Stack Overflow][stackoverflow-badge]][stackoverflow-url]

[asdf]: https://github.com/asdf-vm/asdf
[blog-url]: https://paulfioravanti.com
[github-pages]: https://pages.github.com/
[guard]: https://github.com/guard/guard
[htmllint]: https://github.com/htmllint/htmllint
[htmllint-cli]: https://github.com/htmllint/htmllint-cli
[jekyll-url]: https://jekyllrb.com
[license-cc]: LICENSE-CC-BY-4.0.txt
[license-cc-badge]: https://licensebuttons.net/l/by/4.0/80x15.png
[license-cc-url]: https://creativecommons.org/licenses/by/4.0/
[license-mit]: LICENSE-MIT.txt
[license-mit-badge]: https://img.shields.io/badge/License-MIT-lightgrey.svg
[license-mit-url]: https://opensource.org/licenses/MIT
[localhost]: http://localhost:4000/
[minima]: https://github.com/jekyll/minima
[node]: https://github.com/nodejs/node
[sass-lint]: https://github.com/sasstools/sass-lint
[scss-lint]: https://github.com/brigade/scss-lint
[stackoverflow-badge]: http://stackoverflow.com/users/flair/567863.png
[stackoverflow-url]: http://stackoverflow.com/users/567863/paul-fioravanti
[twitter-badge]: https://img.shields.io/badge/contact-%40paulfioravanti-blue.svg
[twitter-url]: https://twitter.com/paulfioravanti
