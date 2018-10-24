source "https://rubygems.org"
ruby "2.5.3"

# Jekyll plugin for building Jekyll sites with any GitHub-hosted theme
gem "jekyll-remote-theme", "~> 0.3"
# jekyll-include-cache needed for minimal mistakes theme.
# See https://github.com/mmistakes/minimal-mistakes
gem "jekyll-include-cache", "~> 0.1"

group :development do
  # Command line tool to easily handle events on file system modifications
  gem "guard", "~> 2.14"
  # Guard extension to run cli processes
  gem "guard-process", "~> 1.2"
end

group :jekyll_plugins do
  # Bootstrap dependencies for setting up and maintaining a local Jekyll
  # environment in sync with GitHub Pages
  # NOTE: Rouge 2.x does not currently support Elm syntax highlighting, and
  # that's the version that the Github Pages gem uses. When Github Pages updates
  # to Rouge 3.1.0, then all the ```haskell code markers can be changed to Elm.
  # Until then, Haskell highlighting will give close-enough results. More info:
  # https://dmitryrogozhny.com/blog/adding-elm-lexer-to-rouge
  # NOTE: Also, Makefile syntax is not supported under 2.x, so change that to
  # ```sh highlighting for now (see C++ bitcoin blog).
  gem "github-pages", "192"
  # A Jekyll plugin that incorporates LiveReload
  gem "hawkins", "~> 2.0"
  # Archive pages for your Jekyll tags and categories
  gem "jekyll-archives", "~> 2.1"
end
