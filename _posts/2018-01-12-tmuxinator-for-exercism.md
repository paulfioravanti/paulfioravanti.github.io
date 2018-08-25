---
title: "Tmuxinator for Exercism"
date: 2018-01-12 17:10 +1100
categories: exercism ruby tmux tmuxinator
header:
  image: /assets/images/2018-01-12/rawpixel-788527-unsplash.jpg
  teaser: /assets/images/2018-01-12/rawpixel-788527-unsplash.jpg
  overlay_image: /assets/images/2018-01-12/rawpixel-788527-unsplash.jpg
  overlay_filter: 0.2
  caption: >
    Photo by [rawpixel](https://unsplash.com/photos/rMGdXjYjkz4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
    on [Unsplash](https://unsplash.com/search/photos/architect-plan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: >
  Creating a template for all your exercises, in any language.
---

[Vim][] and [tmux][] are the backbone of all my development environments.
[tmuxinator][] is a [Ruby][] gem that enables me to configure sets of
terminal windows and panes for tmux sessions in [YAML][] files, resulting in
being able to use a single command, `mux [project_name]`, to bring up a
terminal-based development environment personalised exactly to me.

I'm currently infatuated with [Exercism][] (see
[this post][setting-up-a-ruby-development-environment-for-exercism] about my
Exercism setup for Ruby exercises), and I wanted to use tmux with it so that
for any exercise I do, I could always open up a project that would provide me
windows for:

- a text editor
- a window for the exercise tests, preferably with a process runner that would
  run the tests automatically whenever I modified a file
- a console

Creating a YAML template that provides this kind of setup is something I do
with tmuxinator for every project that I work on, but I did not want to have
to create and maintain a new template for _every_ Exercism exercise I pull down:
I just wanted a single template that would work for any exercise in any language
that I would potentially use on Exercism.

## Dynamic tmuxinator templates

tmuxinator [supports using ERB and handling command-line arguments in project
files][tmuxinator-erb], which is something that I initially thought was
interesting when I first started using it, but did not have a valid reason to
use...until now. The support of command-line arguments would mean that I could
use a single template for Exercism that takes a programming language and
an exercise name as parameters, and results in being able to use a command like:

```sh
mux exercism <programming_language> <exercise_name>
```

I am currently doing exercises in Ruby, [Elixir][], and [Elm][], so the template
below reflects that, but you should be able to adapt it to whatever language
you may be using (and I'm sure I will adapt it to use others in the future):

**`~/.tmuxinator/exercism`**

```yaml
<% lang = @args[0] %>
<% exercise = @args[1] %>

name: exercism
# Eg: mux exercism ruby hello-world => exercism/ruby/hello-world
root: ~/exercism/<%= lang %>/<%= exercise %>

on_project_first_start:
  <% if lang == "elm" %>
  - npm install
  <% end %>

pre_window:
  <% if lang == "ruby" %>
  - asdf local ruby 2.5.0
  <% elsif lang == "elixir" %>
  - asdf local elixir 1.5.3
  - asdf local erlang 20.2
  <% elsif lang == "elm" %>
  - asdf local elm 0.18.0
  <% end %>

startup_window: editor

windows:
  - editor: vim
  <% if lang == "ruby" %>
  - tests: guard --guardfile ~/exercism/ruby/Guardfile
  - console: irb
  <% elsif lang == "elixir" %>
  - tests: # placeholder window to run tests
  - console: iex
  <% elsif lang == "elm" %>
  - tests: npm run watch
  - console: elm repl
  <% end %>
```

A couple of notes on this setup:

- `@args` is the array available in the template where passed-in command line
  arguments get stored. Arguments can also be taken in as key-value pairs
  (eg `mux exercism lang=ruby exercise=hello-world`), which would then be
  available via a `@settings` variable (eg `@settings["lang"]`), but I think
  the basic array works best for this template.
- I use [asdf][] for managing the versions of all languages, but you could use
  whatever version manager you would like in the `pre_window` config.

I keep all my tmuxinator templates in
[my dotfiles repo][dotfiles-tmuxinator-templates], so feel free to use them as
examples to build on for your own templates, and good luck with your
future Exercism-ing!

[asdf]: https://github.com/asdf-vm/asdf
[dotfiles-tmuxinator-templates]: https://github.com/paulfioravanti/dotfiles/tree/master/tmuxinator
[Elixir]: https://elixir-lang.org/
[Elm]: http://elm-lang.org/
[Exercism]: http://exercism.io/
[Ruby]: https://www.ruby-lang.org/
[setting-up-a-ruby-development-environment-for-exercism]: https://paulfioravanti.com/blog/2018/01/11/setting-up-a-ruby-development-environment-for-exercism/
[tmux]: https://github.com/tmux/tmux/wiki
[tmuxinator]: https://github.com/tmuxinator/tmuxinator
[tmuxinator-erb]: https://github.com/tmuxinator/tmuxinator#erb
[Vim]: http://www.vim.org/
[YAML]: http://yaml.org/
