---
title: "Creating Plover Plugins with Python"
date: 2024-01-19 14:20:00 +1100
last_modified_at: 2024-01-19 14:20:00 +1100
tags: plover python steno stenography plugin
header:
  image: /assets/images/2024-01-19/doc-brown-cable-connect.jpg
  image_description: "Doc Brown from the movie Back to the Future connecting a plug and socket"
  teaser: /assets/images/2024-01-19/doc-brown-cable-connect.jpg
  overlay_image: /assets/images/2024-01-19/doc-brown-cable-connect.jpg
  overlay_filter: 0.1
excerpt: >
  Level up your steno chording with the power of Python! Hook into Plover
  plugins, and discover a world beyond keystrokes.
---

[Plover][] stenography enables anyone to write text and perform [keyboard
shortcuts][] faster than they could on a traditional keyboard. Its open system
architecture also allows you to tap into many of its core functionalities,
expanding the possibilities of what you can do with steno, limited only by your
imagination!

It does this through the use of [plugins][Plover Plugin Guide][^1], created with
[Python][], the programming language in which [Plover itself][Plover GitHub] is
written. There are a [eight different types of plugins][Plover Plugin types]
that Plover currently supports, but this post will focus on three specific
plugin types that can allow us to use Python to perform some kind of task:

- [Commands][] (_Our task: open a [URL][] in a web browser_)
- [Metas][] (_Our task: output a random number between 1 and 10_)
- [Extensions][] (_Our task: output, and keep a [cache][] of, values contained
  in computer [environment variables][]_)

One of the best things about creating plugins is being able to share them with
fellow Plover users, so we will also go through the steps get them to appear
inside everyone's [Plover Plugin Manager][].

This post will be fairly technical in nature, so a basic knowledge of Python or
computer programming (or a desire to learn!), is recommended in order to follow
along.

## Python Environment

Since we are building something that is meant to run inside Plover's
environment, in order to avoid any unexpected errors during development, we need
to make sure the code we write is compatible with it.

When you download the Plover application, it comes bundled with Python version
3.9[^2]. Therefore, in order to ensure maximum compatibility with Plover, a good
choice would be to set your local Python version to use the latest [patch
version][Semantic versioning] of Python 3.9, which would be [Python 3.9.18][]
as of this writing[^3].

In order to change your Python version, I would recommend installing a [version
manager][Python version manager]. This will enable you to easily use Plover's
Python version while developing the plugin, but use the latest (or any other)
version of Python with other projects.

[pyenv][] would seem to be the most popular Python-specific choice, but I
personally use [asdf][] ([Getting Started documentation][asdf Getting Started],
[Python plugin][asdf Python plugin]) as my one version manager to rule all
programming languages[^4].

When you have chosen, installed, and set up a version manager to work with
Python, you will be ready to move on to some coding.

Ready? Let's start building!

## Setup Plugin Project

We are going to create a plugin project called "Plover Practice
Plugin", using the [Initial Setup][Plover Plugin Guide Initial Setup]
directions in the official [Plover Plugin Guide][] as our main reference.

Create a directory on your computer called `plover-practice-plugin`[^5], and
then add the following files underneath it (we will use a
[package-based structure][Plover Plugin Guide Package-based Structure] for
the files[^6]):

```console
plover-practice-plugin/
|-- plover_practice_plugin/
|   '-- __init__.py
|-- README.md
|-- setup.cfg
|-- setup.py
```

The [`__init__.py`][] file is blank, but needs to be present within the
`plover_practice_plugin` directory so we can use it like a [regular package][].

The `README.md` is a [Markdown][] document containing information about the
plugin. We will get the Plover Plugin Manager to read in information from here
and display it. For now, just give it the bare minimum of a simple heading:

**`plover-practice-plugin/README.md`**

```markdown
# Plover Practice Plugin
```

[^1]: Plover's plugin system is built on top of [Setuptools][]: specifically,
      the concept of [entry points][Setuptools entry points] that "allow a
      package to open its functionalities for customization via plugins". Many
      of Plover's core functionalities are, themselves, [exposed as entry
      points][Plover entry points].

[^2]: You can confirm this in the [GitHub action][] that Plover uses to [build
      application distributions][Plover Platform builds] for its supported
      platforms (Windows, macOS, Linux).

[^3]: The latest version of Python as of this writing is [Python 3.12.1][].
      I initially started building Plover plugins using Python 3.11. However, I
      found out the hard way that things like the [`match` statement][] in my
      code was introduced in Python 3.10. This meant that although my plugin
      code tested fine locally, when I attempted to run it within Plover, it
      errored out since Python 3.9 has no idea what a `match` statement is.
      Locally developing on your target platform is definitely recommended!

[^4]: See also my [asdf installation script][] and [asdf zsh config][] for more
      asdf setup examples.

[^5]: It would seem that the naming conventions for project directories is to
      [dasherize][] them. This is probably to distinguish them from the
      [snake case][] naming convention used here for [modules][Python modules]
      and [packages][Python packages].

[^6]: This seems like a good guiding principle for any plugin, rather than a
      [module-based structure][Plover Plugin Guide Module-based Structure],
      unless you really know the scope of your plugin is going to be very small,
      and will always stay that way.

[asdf]: https://github.com/asdf-vm/asdf
[asdf Getting Started]: https://asdf-vm.com/guide/getting-started.html 
[asdf installation script]: https://github.com/paulfioravanti/dotfiles/blob/3c35334c219ff472b428d49531fb81d38bfc9b33/asdf/setup.sh
[asdf Python plugin]: https://github.com/asdf-community/asdf-python
[asdf zsh config]: https://github.com/paulfioravanti/dotfiles/blob/3c35334c219ff472b428d49531fb81d38bfc9b33/zshrc#L56
[cache]: https://en.wikipedia.org/wiki/Cache_(computing)
[Commands]: https://plover.readthedocs.io/en/latest/plugin-dev/commands.html
[dasherize]: https://en.wiktionary.org/wiki/dasherize
[environment variables]: https://en.wikipedia.org/wiki/Environment_variable
[Extensions]: https://plover.readthedocs.io/en/latest/plugin-dev/extensions.html
[GitHub action]: https://docs.github.com/en/actions
[`__init__.py`]: https://docs.python.org/3/reference/import.html#regular-packages
[Keyboard shortcuts]: https://en.wikipedia.org/wiki/Keyboard_shortcut
[Markdown]: https://daringfireball.net/projects/markdown/
[`match` statement]: https://docs.python.org/3/reference/compound_stmts.html#match
[Metas]: https://plover.readthedocs.io/en/latest/plugin-dev/metas.html
[`pip`]: https://pypi.org/project/pip/
[Plover]: https://www.openstenoproject.org/
[Plover entry points]: https://github.com/openstenoproject/plover/blob/53c416fd893d62ab9ede5898129da3be856e910d/setup.cfg#L56
[Plover GitHub]: https://github.com/openstenoproject/plover
[Plover platform builds]: https://github.com/openstenoproject/plover/blob/main/.github/workflows/ci/workflow_context.yml#L11
[Plover Plugin Guide]: https://plover.readthedocs.io/en/latest/plugins.html
[Plover Plugin Guide Initial Setup]: https://plover.readthedocs.io/en/latest/plugin-dev/setup.html#initial-setup
[Plover Plugin Guide Module-based Structure]: https://plover.readthedocs.io/en/latest/plugin-dev/setup.html#module-based-structure
[Plover Plugin Guide Package-based Structure]: https://plover.readthedocs.io/en/latest/plugin-dev/setup.html#package-based-structure
[Plover Plugin Manager]: https://docs.stenokeyboards.com/customize/plover-plugins.html#plugins-manager
[Plover Plugin types]: https://plover.readthedocs.io/en/latest/plugins.html#types-of-plugins
[pyenv]: https://github.com/pyenv/pyenv
[Python]: https://www.python.org/
[Python 3.9.18]: https://www.python.org/downloads/release/python-3918/
[Python 3.12.1]: https://www.python.org/downloads/release/python-3121/
[Python modules]: https://docs.python.org/3/tutorial/modules.html
[Python packages]: https://docs.python.org/3/tutorial/modules.html#packages
[Python version manager]: https://github.com/bernardoduarte/awesome-version-managers?tab=readme-ov-file#python
[regular package]: https://docs.python.org/3/glossary.html#term-regular-package
[Semantic versioning]: https://en.wikipedia.org/wiki/Software_versioning#Semantic_versioning
[Setuptools]: https://setuptools.pypa.io/en/latest/index.html
[Setuptools entry points]: https://setuptools.pypa.io/en/latest/userguide/entry_point.html
[snake case]: https://en.wiktionary.org/wiki/snake_case
[URL]: https://en.wikipedia.org/wiki/URL
