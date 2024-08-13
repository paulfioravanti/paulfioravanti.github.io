# Blog

[![Build Status][Build Status image]][Build Status url]

This is the codebase for my personal blog at
<https://www.paulfioravanti.com>. Created with [Jekyll][].

## Meta

I have written about setting up various facets of this blog, which you can find
at the following posts:

- _[Setting up a Jekyll Blog][]_
- _[Build a CI/CD pipeline for your Jekyll site][]_
- _[Flexbox Furigana][]_

## Install

```console
git clone git@github.com:paulfioravanti/paulfioravanti.github.io.git
cd paulfioravanti.github.io
bundle install
```

### Development Dependencies

This app uses the following dependencies during development:

- [Sass Lint][]: make sure styling syntax conforms to
  community standards. Note that the [gem version][scss-lint] is deprecated
- [htmllint][] (via [htmllint-cli][]): make sure HTML
  syntax conforms to community standards
- [markdownlint][] (via [markdownlint-cli][]): make sure Markdown syntax
  conforms to community standards
- [HTMLProofer][]: make sure HTML rendered files are accurate and do not have
  broken links etc

Install [Node][]-based dependencies in the following way, and remember to
re-shim whatever version manager is being used for Node (I use [`asdf`][]), or
add the `bin` folder of the Node installation to the `$PATH`, otherwise
executables like `sass-lint` won't be available:

```console
npm install --global sass-lint htmllint-cli markdownlint-cli
asdf reshim nodejs
```

HTMLProofer is a Ruby gem and so Bundler will bring it into the project.

## Usage

### Start blog server

```console
bundle exec jekyll serve --incremental --drafts --port 5000 --livereload
```

Then, navigate to <http://localhost:5000>

### Monitor files

This project uses [Guard][] to monitor file changes.

Start Guard with the following command:

```console
bundle exec guard
```

## Theme

This blog currently uses the [Minimal Mistakes][] theme.

Previously, it used the [Minima][] theme, as that seemed to be the theme that
worked best out of the box with Jekyll 3.6, and was usable on [GitHub Pages][].

## Deployment

This blog is current deployed to [GitHub Pages][], but GitHub Pages tend to be
slow at updating their Jekyll technical stack, and they only support a
[limited set of plugins][GitHub Pages Supported Plugin List].

I initially used [Travis CI][] as both a test harness and a deployment pipeline
to bypass the limitations of the [Pages gem][], and allow Jekyll to use the
latest gems, as well as plugins not supported by GitHub's `safe` mode (see my
blog post _[Build a CI/CD pipeline for your Jekyll site][]_ for more information
about how I got a Travis-GitHub Pages test/deploy pipeline working).

However, I now use [GitHub Actions][] for CI/CD. See the [`ci.yml`][] file for
details.

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

[`asdf`]: https://github.com/asdf-vm/asdf
[Build a CI/CD pipeline for your Jekyll site]: https://www.paulfioravanti.com/blog/build-a-ci-cd-pipeline-for-your-jekyll-site/
[Build Status image]: https://github.com/paulfioravanti/paulfioravanti.github.io/actions/workflows/ci.yml/badge.svg
[Build Status url]: https://github.com/paulfioravanti/paulfioravanti.github.io/actions/workflows/ci.yml
[`ci.yml`]: https://github.com/paulfioravanti/paulfioravanti.github.io/blob/release/.github/workflows/ci.yml
[Flexbox Furigana]: https://www.paulfioravanti.com/blog/flexbox-furigana/
[GitHub Actions]: https://github.com/features/actions
[GitHub Pages]: https://pages.github.com/
[GitHub Pages Supported Plugin List]: https://pages.github.com/versions/
[Guard]: https://github.com/guard/guard
[htmllint]: https://github.com/htmllint/htmllint
[htmllint-cli]: https://github.com/htmllint/htmllint-cli
[HTMLProofer]: https://github.com/gjtorikian/html-proofer
[`_includes`]: _includes
[Jekyll]: https://jekyllrb.com
[license-cc]: ./LICENSE.md
[license-cc-badge]: https://licensebuttons.net/l/by/4.0/80x15.png
[license-cc-url]: https://creativecommons.org/licenses/by/4.0/
[license-mit]: ./LICENSE-MIT.md
[license-mit-badge]: https://img.shields.io/badge/License-MIT-lightgrey.svg
[license-mit-url]: https://opensource.org/licenses/MIT
[markdownlint]: https://github.com/DavidAnson/markdownlint
[markdownlint-cli]: https://github.com/igorshubovych/markdownlint-cli
[Minima]: https://github.com/jekyll/minima
[Minimal Mistakes]: https://github.com/mmistakes/minimal-mistakes
[Node]: https://github.com/nodejs/node
[Pages gem]: https://github.com/github/pages-gem
[Sass Lint]: https://github.com/sasstools/sass-lint
[scss-lint]: https://github.com/brigade/scss-lint
[Setting up a Jekyll Blog]: https://www.paulfioravanti.com/blog/set-up-jekyll-blog/
[Travis CI]: https://travis-ci.com/
