---
redirect_from:
  - /blog/2018/01/11/setting-up-a-ruby-development-environment-for-exercism/
  - /blog/setting-up-a-ruby-development-environment-for-exercism/
title: "Setting up a Ruby development environment for Exercism"
date: 2018-01-11 15:35 +1100
last_modified_at: 2022-06-10 20:30:00 +1100
tags: exercism ruby guard rubocop
header:
  image: /assets/images/2018-01-11/toa-heftiba-183789-unsplash.jpg
  image_description: "Royal Guard outside building"
  teaser: /assets/images/2018-01-11/toa-heftiba-183789-unsplash.jpg
  overlay_image: /assets/images/2018-01-11/toa-heftiba-183789-unsplash.jpg
  overlay_filter: 0.5
  caption: >
    Photo by [Toa Heftiba](https://unsplash.com/photos/PxM8hw4j3ZY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
    on [Unsplash](https://unsplash.com/search/photos/royal-guard?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: >
  Test-drive your exercises with Guard.
---

I'm extremely late to the [Exercism][] party, but I've been having lots of fun
working my way through [its Ruby track][exercism-ruby-track]
(see [my Exercism profile][exercism-profile-link]). The only thing I have
missed while working on the exercises is the automated workflows that I would
normally have: specifically, having tests and [Rubocop][] run automatically
after any file has changed.

When I work on any Ruby or [Rails][] project, I immediately reach for [Guard][]
to help me out with running these kinds of processes, and this time will be no
different. However, the structure of a (completed) Ruby Exercism exercise
(located by default under `~/exercism/ruby/`) does not look like a typical Ruby
project:

```text
my_exercise
├── README.md
├── my_exercise.rb
└── my_exercise_test.rb
```

It is a single directory with both the implementation and test file in it,
which is not the kind of project setup that Guard expects will be used with
Ruby. So, Guard will need some extra help on the configuration side of things
to figure out how to deal with this. But first, let's install some gems to
get started.

## Install Gems

As well as Guard itself, we're going to want to install the following other
gems:

- [Guard::Minitest][]: Tests in Exercism are written using [Minitest][], so this
  gem will make sure Guard launches the tests with the Minitest framework.
- [guard-rubocop][]: Runs Rubocop when files are modified.

Since there is no [Bundler][] or [`Gemfile`][] in sight, we will be installing
these gems globally:

> If you use the [asdf][] version manager, add these gems to
your [default gems file][] so that you don't need to worry about manually
installing them globally again if you update your Ruby version.

```sh
gem install guard guard-minitest guard-rubocop
```

## Generate Guardfile

After installing the gems, change into your `exercism/ruby` directory
(wherever it is installed on your system), and generate the `Guardfile`:

```sh
guard init
```

> If you find this command does not work, depending on your Ruby version manager,
you may need to perform a reshim of Ruby executables.

Typically, you will have one `Guardfile` per Ruby project, but rather than have
one per Exercism exercise, which will get old very fast, the plan is to have a
single `Guardfile` that any Ruby exercise can use, and that's why we generated
it in the top level Ruby directory.

The generated `Guardfile` will look something like this:

```ruby
guard :minitest do
  # with Minitest::Unit
  watch(%r{^test/(.*)\/?test_(.*)\.rb$})
  watch(%r{^lib/(.*/)?([^/]+)\.rb$}) { |m| "test/#{m[1]}test_#{m[2]}.rb" }
  watch(%r{^test/test_helper\.rb$})  { 'test' }

  # with Minitest::Spec
  # watch(%r{^spec/(.*)_spec\.rb$})
  # ...

  # Rails 4
  # watch(%r{^app/(.+)\.rb$}) { |m| "test/#{m[1]}_test.rb" }
  # ...

  # Rails < 4
  # ...
end

guard :rubocop do
  watch(%r{.+\.rb$})
  watch(%r{(?:.+/)?\.rubocop(?:_todo)?\.yml$}) { |m| File.dirname(m[0]) }
end
```

## Guard Minitest configuration

First, delete all the non-`Minitest::Unit` configuration to get that out of the
way, and let's take a closer look at exactly what the remaining configuration
does:

```ruby
guard :minitest do
  # When a test file (defined as a Ruby file that starts with `test_`)
  # located under the `test/` directory is modified, run that test.
  watch(%r{^test/(.*)\/?test_(.*)\.rb$})
  # When a Ruby file located under the `lib/` directory is modified,
  # run the test file located under the `test/` directory for that Ruby file.
  watch(%r{^lib/(.*/)?([^/]+)\.rb$}) { |m| "test/#{m[1]}test_#{m[2]}.rb" }
  # When the `test/test_helper.rb` file is modified, run the entire test suite.
  watch(%r{^test/test_helper\.rb$})  { 'test' }
end
```

Unfortunately, it looks like we cannot use _any_ of Guard's default
configuration here as-is because:

- In Exercism, everything is in the same directory, so there are no `lib/` or
  `test/` directories to go looking in.
- The naming for Exercism test files is `*_test.rb`, not `test_*.rb`.
- There is no `test_helper.rb` file.

So, we're going to have to re-write the configuration from scratch, but before
we do that, let's determine what we actually want Guard to do for us within
an Exercism exercise directory. For me at least, what I would want is:

- If I modify the test file under the exercise root directory, run it again
- If I modify the implementation file under the exercise root directory, run its
  test file, which is also located under the exercise root directory

To do that, I came up with the following:

```ruby
guard :minitest, test_folders: ["."] do
  # Re-test test files when they're modified.
  watch(%r{\A.+_test\.rb\z}) { |m| "./#{m[1]}" }
  # Run the test file of the implementation (non-test) file that was modified.
  watch(%r{\A(.+)(?<!_test)\.rb\z}) { |m| "./#{m[1]}_test.rb" }
end
```

Let's examine some of the reasons behind these lines:

- The `test_folders` flag was added to specifically tell Guard::Minitest that
  test files are located in the current directory (`"."`) because [by default
  it will look inside `test` or `spec` directories][guard-minitest-options].
- The string values in the blocks for both `watch` functions need to resemble
  a path, otherwise no processes would run. For example,
  `watch(%r{\A.+_test\.rb\z}) { |m| "#{m[1]}" }` would not work: the block
  value _needs_ to be `"./#{m[1]}"` (figuring this out was a painful gotcha).
- Since both implementation and test file are in the same directory, the last
  statement uses a [negative lookbehind assertion][] (`(?<!_test)`) to make
  sure that when `./bob.rb` is modified, `./bob_test.rb` is run, but when
  `./bob_test.rb` is modified, Guard does not attempt to run a non-existent
  `./bob_test_test.rb` file.

## Guard Rubocop configuration

Much like it is easier to have one `Guardfile` that can be used for all Exercism
exercises, the same is true for your Rubocop configuration file
(`.rubocop.yml`). If you have a specific `.rubocop.yml` file that you want to
use just for Exercism, then place it under your `exercism/ruby` directory, and
[it will get found when you run the `rubocop` command][rubocop-configuration].

For the guard-rubocop configuration, we will need to re-write the first rule
slightly (`watch(%r{.+\.rb$})`) because it currently will run Rubocop over all
Ruby files, including the Exercism test file, which is not written by us (and
therefore we are not responsible for whether it is written to Rubocop's
standards). So, we'll use a similar negative lookbehind assertion to fix that
problem:

```ruby
guard :rubocop do
  # Only run Rubocop over implementation files
  # as test files are not written by students.
  watch(%r{\A(.+)(?<!_test)\.rb\z})
  watch(%r{(?:.+/)?\.rubocop\.yml\z}) { |m| File.dirname(m[0]) }
end
```

## Putting it all together

My final `~/exercism/ruby/Guardfile`, with some extra bits of configuration,
looks like the following:

```ruby
# frozen_string_literal: true

group :red_green_refactor, halt_on_fail: true do
  guard :minitest, all_on_start: false, test_folders: ["."] do
    # Re-test test files when they're edited.
    watch(%r{\A.+_test\.rb\z}) { |m| "./#{m[1]}" }
    # Run the test file of the file that was edited.
    watch(%r{\A(.+)(?<!_test)\.rb\z}) { |m| "./#{m[1]}_test.rb" }
  end

  guard :rubocop, all_on_start: false, cli: ["--display-cop-names"] do
    # Only run Rubocop over implementation files
    # as test files are not written by me.
    watch(%r{\A(.+)(?<!_test)\.rb\z})
    watch(%r{(?:.+/)?\.rubocop\.yml\z}) { |m| File.dirname(m[0]) }
  end
end
```

The optional `red_green_refactor` group idea is lifted directly from the
[guard-rubocop `README` file][guard-rubocop-advanced-tips], and makes perfect
sense to me: get your tests passing first, and only then worry about whether
your code looks nice.

This configuration might change over time, so you can always get the latest
version from [my Exercism Github repo][].

## Running Guard

Now that the `Guardfile` is set up with Minitest and Rubocop, you will need to
make sure to tell Guard where to find this configuration when you run it:

```sh
guard --guardfile ~/exercism/ruby/Guardfile
```

And that should be it! You should now have a pair of friendly robots looking
over your shoulder while you're solving the exercises, helping you to submit
the best solution that you can.

[asdf]: https://github.com/asdf-vm/asdf
[Bundler]: http://bundler.io/
[default gems file]: https://github.com/asdf-vm/asdf-ruby#default-gems
[Exercism]: http://exercism.io/
[exercism-ruby-track]: https://exercism.io/tracks/ruby
[exercism-profile-link]: https://exercism.io/profiles/paulfioravanti
[`Gemfile`]: https://bundler.io/gemfile.html
[Guard]: https://github.com/guard/guard
[guard-rubocop]: https://github.com/yujinakayama/guard-rubocop
[guard-rubocop-advanced-tips]: https://github.com/yujinakayama/guard-rubocop#advanced-tips
[Guard::Minitest]: https://github.com/guard/guard-minitest
[guard-minitest-options]: https://github.com/guard/guard-minitest#list-of-available-options
[Minitest]: https://github.com/seattlerb/minitest
[my Exercism Github repo]: https://github.com/paulfioravanti/exercism
[negative lookbehind assertion]: https://ruby-doc.org/core-2.5.0/Regexp.html#class-Regexp-label-Anchors
[Rails]: https://rubyonrails.org/
[Rubocop]: https://github.com/bbatsov/rubocop
[rubocop-configuration]: http://rubocop.readthedocs.io/en/latest/configuration/
