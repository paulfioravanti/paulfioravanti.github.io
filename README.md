# Blog

This is the codebase for my personal blog at [`paulfioravanti.com`][].
Created with [Jekyll][].

## Install

```sh
git clone git@github.com:paulfioravanti/paulfioravanti.github.io.git
cd paulfioravanti.github.io
bundle install
```

### Development Dependencies

This app uses the following [Node][]-based dependencies during development:

- [Sass Lint][]: make sure styling syntax conforms to
  community standards. Note that the [gem version][scss-lint] is deprecated.
- [htmllint][] (via [htmllint-cli][]): make sure HTML
  syntax conforms to community standards.
- [markdownlint][] (via [markdownlint-cli][]): make sure Markdown syntax conforms
  to community standards.

Install dependencies in the following way, and remember to re-shim whatever
version manager is being used for Node (I use [`asdf`][]), or add the `bin`
folder of the Node installation to the `$PATH`, otherwise executables like
`sass-lint` won't be available:

```sh
npm install -g sass-lint htmllint-cli markdownlint-cli
asdf reshim nodejs
```

## Usage

### Start blog server

```sh
bundle exec jekyll liveserve --drafts
```

Then, navigate to [`localhost:4000`][].

### Monitor files

This project uses [Guard][] to monitor file changes.

Start Guard with the following command:

```sh
bundle exec guard
```

## Theme

This blog currently uses the [Minimal Mistakes][] theme. Previously, it used
the [Minima][] theme, as that seemed to be the theme that worked best out of the
box with Jekyll 3.6, and was usable on [Github Pages][].

## License

| Category |                         License                           |
|----------|-----------------------------------------------------------|
| Content  | [![License: CC-BY-4.0][license-cc-badge]][license-cc-url] |
| Code     | [![License: MIT][license-mit-badge]][license-mit-url]     |

Content in all blog posts is licensed under the
[Creative Commons Attribution 4.0 license][license-cc] (CC-BY-4.0), and all
source code in this repo, and contained within any blog posts, is licensed
under the [MIT license][license-mit].

SPDX-License-Identifier: (MIT AND CC-BY-4.0)

## Social

[![Contact][twitter-badge]][twitter-url]<br />
[![Stack Overflow][stackoverflow-badge]][stackoverflow-url]

[`asdf`]: https://github.com/asdf-vm/asdf
[Github Pages]: https://pages.github.com/
[Guard]: https://github.com/guard/guard
[htmllint]: https://github.com/htmllint/htmllint
[htmllint-cli]: https://github.com/htmllint/htmllint-cli
[`_includes`]: _includes
[Jekyll]: https://jekyllrb.com
[license-cc]: LICENSE-CC-BY-4.0.txt
[license-cc-badge]: https://licensebuttons.net/l/by/4.0/80x15.png
[license-cc-url]: https://creativecommons.org/licenses/by/4.0/
[license-mit]: LICENSE-MIT.txt
[license-mit-badge]: https://img.shields.io/badge/License-MIT-lightgrey.svg
[license-mit-url]: https://opensource.org/licenses/MIT
[`localhost:4000`]: http://localhost:4000/
[markdownlint]: https://github.com/DavidAnson/markdownlint
[markdownlint-cli]: https://github.com/igorshubovych/markdownlint-cli
[Minima]: https://github.com/jekyll/minima
[Minimal Mistakes]: https://github.com/mmistakes/minimal-mistakes
[Node]: https://github.com/nodejs/node
[`paulfioravanti.com`]: https://paulfioravanti.com
[Sass Lint]: https://github.com/sasstools/sass-lint
[scss-lint]: https://github.com/brigade/scss-lint
[stackoverflow-badge]: http://stackoverflow.com/users/flair/567863.png
[stackoverflow-url]: http://stackoverflow.com/users/567863/paul-fioravanti
[twitter-badge]: https://img.shields.io/badge/contact-%40paulfioravanti-blue.svg
[twitter-url]: https://twitter.com/paulfioravanti
