---
redirect_from:
  - /jekyll/2017/11/17/setting-up-a-jekyll-blog.html
  - /blog/2017/11/17/setting-up-a-jekyll-blog/
  - /blog/setting-up-a-jekyll-blog/
title: "Setting up a Jekyll Blog"
date: 2017-11-17 22:30 +1100
last_modified_at: 2023-07-24 17:06 +1100
tags: jekyll ruby meta blog
header:
  image: /assets/images/2017-11-17/wesley-caribe-63610-unsplash.jpg
  image_description: "flat lay photography of assorted-color mechanical tool set"
  teaser: /assets/images/2017-11-17/wesley-caribe-63610-unsplash.jpg
  overlay_image: /assets/images/2017-11-17/wesley-caribe-63610-unsplash.jpg
  overlay_filter: 0.7
  caption: >
    Photo by [Wesley Caribe](https://unsplash.com/photos/TtN_obfWlGw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
    on [Unsplash](https://unsplash.com/search/photos/plug?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: >
  Setting up this blog, and creating a development environment that I was happy
  with, took longer than I expected.
---

## TL;DR

- Use the [Minima][] theme and [customise it][minima-customisation] if you want
  to: it works out of the box
- Live reload pages with [Hawkins][] and [Grip][]
- Lint all files with [Sass Lint][], [htmllint][], and [markdownlint][]
- Run lints with [Guard][]
- [Set up a custom domain][namecheap-github-pages] for the blog
- [Set up SSL][cloudflare-ssl-cloudflare-blog] for the blog
- [You cannot use custom Jekyll plugins][stackoverflow-jekyll-safe-mode] when
  deploying to Github Pages

---

<br />

Setting up this blog, and creating a development environment that I was happy
with, took longer than I expected, so I thought I would document the process and
other learnings gained along the way.

This assumes that you have read Jekyll's
[getting started guide][jekyll-getting-started] and the quick start
instructions on the [Jekyll homepage][], and have got your new blog generated.

NOTE: I used Jekyll 3.6.2 to originally generate this blog, so your mileage may
vary depending on what version you use and when you read this post.

## Choosing a theme

If you are hosting outside of Github, then you can get themes from
[many][jekyllthemes.org] [different][jekyllthemes.io]
[sites][themes.jekyllrc.org], but if you are going to use
[Github Pages][] for hosting, then you are limited to their
[supported themes][github-pages-supported-themes].

After generating a few different test blogs and applying different themes, I
found that [Minima][], the default theme, is the one that works most
seamlessly out-of-the-box: it includes [all the layouts][minima-layouts] that a
newly-generated site wants by default, as well as integrations for
[Disqus comments][minima-disqus] and
[Google Analytics][minima-google-analytics]. This ease of use, coupled with my
desire to tinker with the CSS, made the minimalistic Minima a straightforward
choice, but I would encourage you to experiment and pick one that best suits
the look you want for your site.

## Creating a Development Environment

Before starting any coding on the blog itself or making any content, I wanted
to make sure I had a development environment I was comfortable with, so here
is how I set mine up.

### Live Reloading

Hitting refresh every time you want to see your changes reflected on a web page
isn't fun, so let [Hawkins][] and [Grip][] handle that for you.

#### Hawkins

Hawkins' live reload applies to any content file in the Jekyll application
itself.  Installation and usage of the Hawkins gem is well documented on
[its `README` file][hawkins-readme], so I will just simply add that I've set
it to watch draft blog posts (markdown files in the `_drafts/` folder) as well
by running my Jekyll server with the following command:

```sh
bundle exec jekyll liveserve --drafts
```

#### Grip

Hawkins does not cover any Markdown in a Jekyll application's `README` file, so
if you change it often, or just want a process to monitor it, install Grip
(I use [Homebrew][]), and run it in a separate terminal window:

```sh
brew install grip
grip --browser
```

The `--browser` flag will open a tab in your web browser immediately at
`http://localhost:6419/` and display the application `README` file.
The page gets live-reloaded as changes are made, but just be warned that if you
perform more than 60 live reloads per hour, you will need to
[authenticate your Github API requests][grip-access] with your Github
credentials.

### Linting

I'm quite fastidious about code style and quality, but do not want to have to be
too cognizant of it while developing, so I want a team of robots to look over my
shoulder and let me know when the code I am writing is not up to
"community standards". That team of robots, in this case, takes the form of
a set of [linters][lint] for each of the different file types primarily used
in a Jekyll blog: [CSS][] ([SASS][]), [HTML][], and [Markdown][].

#### Find the lints

Since Jekyll is written in [Ruby][], I started
[searching for lints at Ruby Gems][ruby-gems-lint-search], where I found
[SCSS-Lint][], [Markdown Lint][], and no options available for HTML. I found
configuring Markdown Lint confusing, and SCSS-Lint recommends using
[other Javascript-based linting tools][scss-lint-alternatives] over itself, so
I came to the conclusion that it was probably best to use front-end language
linters that were actually written in front-end languages. They ended up being:

- SCSS: [Sass Lint][]
- HTML: [htmllint][] (via [htmllint-cli][])
- Markdown: [markdownlint][] (via [markdownlint-cli][])

Install the lints using [npm][], and then make sure to update your [shims][shim]
for [Node][] if you're using a version manager for npm (I use [asdf][]):

```sh
npm install -g sass-lint htmllint-cli markdownlint-cli
asdf reshim nodejs
```

#### Run the lints

Now that the lints are all installed, there needs to be a way to run them when
files change. For Ruby and [Rails][] projects, I always use [Guard][], so I
chose it due to my familiarity with it, and because I didn't want to have to
learn how to use another front-end-based task runner at this time.
Since the lints are not Ruby gems and hence do not have their own
[Guard plugins][], I used [Guard::Process][] to run the lints as command line
processes.

To install Guard and Guard::Process, first add them to the `Gemfile`:

```ruby
group :development do
  gem "guard", "~> 2.14"
  gem "guard-process", "~> 1.2"
end
```

Next, install the gems, and then generate a `Guardfile` for task configuration:

```sh
bundle install
bundle exec guard init
```

Open up the `Guardfile` with your favourite text editor and insert the
following configuration:

```ruby
guard "process",
      command: ["htmllint", "_includes/*.html", "about.html"],
      name: "htmllint" do
  watch(%r{^_includes/.+\.html$})
  watch(%r{^about\.html$})
end

guard "process",
      command: ["markdownlint", "_posts", "_drafts", "README.md", "index.md"],
      name: "markdownlint" do
  watch(%r{^_posts/.+\.md$})
  watch(%r{^.+\.md$})
end

guard "process",
      command: ["sass-lint", "--verbose", "--no-exit"],
      name: "sass-lint" do
  watch(%r{^_sass/.+\.scss$})
  watch(%r{^assets/.+\.scss$})
end
```

`htmllint` needs specificity on what HTML files to lint, otherwise
Jekyll-generated HTML files in the `_site/` directory also get linted, which
just contributes unnecessary noise to the linter output. There are
no Markdown files generated in the `_site/` directory, but `markdownlint`
also needs a list of files for command line arguments just the same, simply
due to them being a required argument for the CLI.

Once configuration is complete, open up a terminal, and run Guard to have it
watch your files:

```sh
bundle exec guard
```

### Development Environment Summary

So, whenever I open up my Jekyll blog project, I will always currently have
four processes running to help me along with development:

- Editor: [Vim][] (substitute out your favourite text editor here)
- Server: `bundle exec jekyll liveserve --drafts`
- Guard: `bundle exec guard`
- Grip: `grip --browser`

## Overriding Styling

Customising styling of a Jekyll theme is well documented in the
[Overriding theme defaults][jekyll-overriding-themes] section of Jekyll's
documentation, and in the [Customization][minima-customisation] section of the
Minima theme's documentation, so I will just add that since I want to have
complete control over the SASS files, I did the following:

- Copied over the contents of the [Minima `_sass/` directory][minima-sass-dir]
  to my local project (this, of course, means I don't benefit from any updates
  that may be done to the Minima gem's styles)
- Linted the files with `sass-lint`, fixed any issues, and built up a set of
  SASS rules I wanted in a `.sass-lint.yml` file
- Began adding my own minor tweaks to the styles

## Overriding _include files_

I wanted to add an [Apple Touch Icon][] and remove some footer links from the
blog, which means I needed access to the application `<head>` and `<footer>`
tags.

So, I created a local `_includes/` directory and began copy
and pasting the relevant files from
[Minima's `_includes/` directory][minima-includes] into it, selectively editing
the files locally. I have no doubt I will continue to do this over the course
of the blog's life.

## Custom Domain Setup

Since I had my own custom name domain, I wanted to use it with the Jekyll blog
on Github Pages rather than the default domain of `<username>.github.io`.

Luckily, [Namecheap][], my registrar for <https://www.paulfioravanti.com>, has a
fantastic [article in their knowledge base][namecheap-github-pages] that took me
through all the steps I needed to link my domain to Github Pages. Although
specific to Namecheap, I would wager the information is generic enough to help
anyone else wanting to do the same thing.

## SSL Setup

At this point, the site may be on a custom domain, but not having the green
secure padlock in the address bar, even for a static blog site, won't make
the site look great in search rankings. So, at least for now, get
[Cloudflare][] to provide a signed [SSL][] certificate on the blog's behalf.

Good instructions on creating a Cloudflare account and enabling SSL on a Jekyll
site hosted on Github Pages can be found [here][cloudflare-ssl-goyllo-blog] and
[here][cloudflare-ssl-cloudflare-blog].

## No Foreign Plugins

As a post-script to this post, I thought I'd share the result of my time barking
up the wrong tree when wanting to have Jekyll use `ENV` variables.

I wanted to use icons from [Font Awesome][] on my About page,
and I wanted to load them from the [Font Awesome CDN][] so I wouldn't have to
download them all into my project directory. Loading them from the Font Awesome
CDN requires registering an account, upon which you are allocated an Embed Code.

I mistakenly thought that the Embed Code was "secret information", and hence
should not be stored in the blog git repository but instead loaded into an
environment variable using a Ruby gem like [dotenv][] (this is, of course,
not true since the Embed Code will be directly visible in HTML files
[and exists for these reasons][stackoverflow-fa-embed-code]).

Anyway, I followed
[a guide for using `ENV` variables with Jekyll][dotenv-jekyll-gist] that
involved creating a [Jekyll Plugin Generator][] which can inject values
computed at build time into template variables. I deployed the additions out
to Github Pages, but it did not seem to work.

Further internet searching led to the realisation that the [Github Pages gem][]
only supports a [limited list of plugins][github-pages-supported-plugins] and
[always starts Jekyll in safe mode][stackoverflow-jekyll-safe-mode], meaning
user-defined plugins are never run.

So, as long as a Jekyll site is hosted up on Github Pages, no custom plugins
can be used.

## Conclusion

Who would have thought getting a static site and its development environment
up and running "properly" would be so much work? Not me, hence this post, so
hopefully it can serve as some reference to someone else setting up their own
Jekyll site.

[Apple Touch Icon]: https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
[asdf]: https://github.com/asdf-vm/asdf
[Cloudflare]: https://www.cloudflare.com/
[cloudflare-ssl-cloudflare-blog]: https://blog.cloudflare.com/secure-and-fast-github-pages-with-cloudflare/
[cloudflare-ssl-goyllo-blog]: https://www.goyllo.com/cloudflare-ssl-for-github-pages/
[CSS]: https://en.wikipedia.org/wiki/Cascading_Style_Sheets
[dotenv]: https://github.com/bkeepers/dotenv
[dotenv-jekyll-gist]: https://gist.github.com/nicolashery/5756478
[Font Awesome]: https://fontawesome.com/
[Font Awesome CDN]: https://cdn.fontawesome.com/
[Github Pages]: https://pages.github.com/
[Github Pages gem]: https://github.com/github/pages-gem
[github-pages-supported-themes]: https://pages.github.com/themes/
[github-pages-supported-plugins]: https://pages.github.com/versions/
[Grip]: https://github.com/joeyespo/grip
[grip-access]: https://github.com/joeyespo/grip#access
[Guard]: https://github.com/guard/guard
[Guard plugins]: https://github.com/guard/guard/wiki/List-of-available-Guards
[Guard::Process]: https://github.com/guard/guard-process
[Hawkins]: https://github.com/awood/hawkins
[hawkins-readme]: https://github.com/awood/hawkins/blob/master/README.md
[Homebrew]: https://brew.sh/
[jekyll-getting-started]: https://github.com/jekyll/jekyll#getting-started
[Jekyll Homepage]: https://jekyllrb.com/
[jekyll-overriding-themes]: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
[Jekyll Plugin Generator]: https://jekyllrb.com/docs/plugins/#generators
[jekyllthemes.org]: http://jekyllthemes.org/
[jekyllthemes.io]: https://jekyllthemes.io/
[HTML]: https://en.wikipedia.org/wiki/HTML
[htmllint]: https://github.com/htmllint/htmllint
[htmllint-cli]: https://github.com/htmllint/htmllint-cli
[lint]: https://en.wikipedia.org/wiki/Lint_(software)
[Markdown]: https://en.wikipedia.org/wiki/Markdown
[markdownlint]: https://github.com/DavidAnson/markdownlint
[markdownlint-cli]: https://github.com/igorshubovych/markdownlint-cli
[Markdown Lint]: https://github.com/markdownlint/markdownlint
[Minima]: https://github.com/jekyll/minima
[minima-customisation]: https://github.com/jekyll/minima#customization
[minima-disqus]: https://github.com/jekyll/minima#enabling-comments-via-disqus
[minima-google-analytics]: https://github.com/jekyll/minima#enabling-google-analytics
[minima-includes]: https://github.com/jekyll/minima/tree/master/_includes
[minima-layouts]: https://github.com/jekyll/minima/tree/master/_layouts
[minima-sass-dir]: https://github.com/jekyll/minima/tree/master/_sass
[Namecheap]: https://www.namecheap.com/
[namecheap-github-pages]: https://www.namecheap.com/support/knowledgebase/article.aspx/9645/2208/how-do-i-link-my-domain-to-github-pages
[Node]: https://github.com/nodejs/node
[npm]: https://www.npmjs.com/
[Rails]: https://rubyonrails.org/
[Ruby]: https://www.ruby-lang.org/
[SASS]: https://en.wikipedia.org/wiki/Sass_(stylesheet_language)
[Sass Lint]: https://github.com/sasstools/sass-lint
[SCSS-Lint]: https://github.com/brigade/scss-lint
[scss-lint-alternatives]: https://github.com/brigade/scss-lint#notice-consider-other-tools-before-adopting-scss-lint
[shim]: https://en.wikipedia.org/wiki/Shim_(computing)
[SSL]: https://en.wikipedia.org/wiki/Transport_Layer_Security
[stackoverflow-fa-embed-code]: https://stackoverflow.com/questions/43743857/using-font-awesome-cdn
[stackoverflow-jekyll-safe-mode]: https://stackoverflow.com/questions/45349857/simple-jekyll-converter-plugin-not-working/45350535#45350535
[ruby-gems-lint-search]: https://rubygems.org/search?utf8=%E2%9C%93&query=lint
[themes.jekyllrc.org]: https://themes.jekyllrc.org/
[Vim]: https://www.vim.org/
