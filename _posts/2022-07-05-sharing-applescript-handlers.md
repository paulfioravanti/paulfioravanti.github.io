---
title: "Sharing AppleScript Handlers"
date: 2022-07-05 09:30:00 +1100
last_modified_at: 2024-08-23 22:00:00 +1100
tags: apple scripting
header:
  image: /assets/images/2022-07-05/sliced-apples.jpg
  image_description: "Sliced red apples on a wooden board"
  teaser: /assets/images/2022-07-05/sliced-apples.jpg
  overlay_image: /assets/images/2022-07-05/sliced-apples-overlay.jpg
  overlay_filter: 0.4
  caption: >
    Photo by: Marco Verch under
    <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank">
      Creative Commons 2.0
    </a>
excerpt: >
  Navigating AppleScript's awkward handshakes between files.
---

Being able to share code between files is a great way to put programming logic
"[in its right place][Single source of truth]", and prevent single files from
containing hundreds or thousands of lines of code.

A very basic example of sharing code in [Python][] could be having a
directory called `code/`, and in it, a file called `greetings.py`. This file
contains very important business logic about how to say "hello":

**`code/greetings.py`**

```python
def hello():
    print("Hello there!")
```

Now, say I have a `greeter.py` file in the same directory, who has no idea how
to say "hello", and wants to leverage the specialised knowledge its neighbour
file has on how to do it. It can do so easily by `import`ing the `hello`
function from the `greetings` file, and using it:

**`code/greeter.py`**

```python
from greetings import hello

hello()
```

Running the `greeter` program outputs what you would expect:

```console
$ python code/greeter.py
Hello there!
```

The `from greetings import hello` line is able to find the `greetings` file
thanks to Python's [`sys.path`][], a "list of strings that specifies the search
path for modules", which includes the directory of the script being run: in this
case, the `code/` directory. Makes sense.

Many programming languages have similar mechanisms to allow sharing code in
simple, unobstructive ways. [AppleScript][] _can_ share code, but certainly not
in an intuitive way like Python. The extra steps required to do so compelled me
to make a note of them somewhere, in order to not have to scour the internet to
figure this out again.

So, I will illustrate this sharing process by [refactoring][] out [handlers][]
(read: [functions][]) into separate files using an example from [my stenography
dictionaries][], where I have employed AppleScript to control my Mac using
[stenographic chords][] (don't worry, the [stenography][] context here is not
important).

## Contextual Refreshing

I have an AppleScript file that performs a keyboard shortcut for a "refresh".

The most common [use case][] for a "refresh" on a computer would probably be
refreshing a browser window, and its keyboard shortcut on [macOS][] is ⌘R
([Command][]-R). Many other applications use the same ⌘R shortcut for their own
interpretation of "refresh", so contextually, it is quite a safe one to use.

However, when I have the very specific use case of using the [Vim][] text editor
in an [iTerm2][] terminal, I need a "refresh" to mean "refresh the [ctrlp.vim][]
fuzzy file finder's cache, so it picks up the existence of any new files", and
the shortcut for that is F5 ([Function Key][]-5).

So, the script needs to figure out what current the "active" application is, and
then "press" the appropriate keyboard shortcut (either ⌘R, or F5). Here is what
that looks like in my code:

**`src/actions/refresh.applescript`**

```applescript
on run
  set activeApp to getActiveApp()

  if activeApp is "iTerm2" then
    performiTerm2Refresh()
  else
    performRefresh(activeApp)
  end if
end run

on performiTerm2Refresh()
  set processName to getiTermProcessName()

  if processName contains "vim" then
    performVimRefresh()
  else
    display notification "Nothing to refresh." with title "Error"
  end if
end performiTerm2Refresh

on performVimRefresh()
  tell application "System Events" to tell process "iTerm2"
    # 96 = F5
    key code 96
  end tell
end performVimRefresh

on performRefresh(activeApp)
  tell application "System Events" to tell process activeApp
    keystroke "r" using {command down}
  end tell
end performRefresh

on getActiveApp()
  tell application "System Events"
    return name of first application process whose frontmost is true
  end tell
end getActiveApp

on getiTermProcessName()
  tell application "iTerm2"
    return name of current session of current window
  end tell
end getiTermProcessName
```

In this file there are six handlers, with the `on run` handler at the top being
the entry point for when the script is run. The first four handlers contain code
that is _specific_ to "refreshing", but the final two handlers, `getActiveApp()`
and `getiTermProcessName()`, contain code that is general enough that other
scripts could leverage them. Therefore, they are the perfect candidates for
extraction into some other file, where they can be shared.

Let's remove them from `refresh.applescript`, and put them into a "utilities"
file:

**`src/actions/util.applescript`**

```applescript
on getActiveApp()
  tell application "System Events"
    return name of first application process whose frontmost is true
  end tell
end getActiveApp

on getiTermProcessName()
  tell application "iTerm2"
    return name of current session of current window
  end tell
end getiTermProcessName
```

Okay, so now the big question: how can `refresh.applescript` use the code that
now lives in `util.applescript`?

## Creating Shared Libraries

AppleScript cannot just reach into neighbouring files with a line like `from
util import getActiveApp`. What needs to occur is the metamorphosis of the
utilities script into what AppleScript calls a [Script Library][], which
involves:

- Creating a compiled version of the script with the [`osacompile`][] command
  line tool (the compiled script will have a [`.scpt`][] file extension, instead
  of `.applescript`)
- Putting the compiled script in a designated "Script Libraries" folder, whose
  locations are numerous (see previous [Script Library][] link), but the one I
  have seen cited most often, and that _did_ work for me, is in the user Library
  directory, specifically: `~/Library/Script Libraries/`

After those steps are done, we can use the utility handlers again, so let's give
it a shot!

First, create the compiled script:

```console
osacompile -o util.scpt util.applescript
```

Now, move the newly created `util.scpt` script to the Script Libraries
directory. Since that directory gets used by other programs as well, let's silo
the file in its own directory called `steno-dictionaries`:

```console
mkdir -p ~/Library/Script Libraries/steno-dictionaries
mv util.scpt ~/Library/Script Libraries/steno-dictionaries
```

Now, we can change `refresh.applescript` to use the handlers in the newly-minted
Script Library:

**`src/actions/refresh.applescript`**

```applescript
property Util : script "steno-dictionaries/util"

on run
  set activeApp to Util's getActiveApp()

  # ...
end run

on performiTerm2Refresh()
  set processName to Util's getiTermProcessName()

  # ...
end performiTerm2Refresh

# ...
```

Done! Since Shared Libraries are compiled, this enables us to reference them as
a static [Property][] (here named `Util`), allowing for commands to be sent to
it using the [possessive syntax][] (`'s`).

## Shared Libraries at Scale

The example above is all well and good for compiling a single Shared Library,
but performing those commands for multiple files gets tiresome quite quickly.

In order to automate this in my [steno-dictionaries repo][], I wrote some
[shell scripts][] (that live in its [`bin/` directory][]) that "bootstrap" the
process of making the AppleScript code in the repository ready to use after
being [cloned][]. They ensure that running one command (`./bin/bootstrap`) will,
in the following order:

- Create a `~/Library/Script Libraries/steno-dictionaries` directory
- Compile all AppleScript files that will become Script Libraries into `.scpt`
  files
- Move the Script Library `.scpt` files to
  `~/Library/Script Libraries/steno-dictionaries`
- Then, compile all other AppleScript files that reference the Script Libraries
  (but are not, themselves, Script Libraries) into `.scpt` files

> (I'm assuming that running `.scpt` files are faster than `.applescript` files
> since they are compiled, but I cannot seem to find conclusive evidence to back
> up that assumption on the internet, which is weird...).

The `.scpt` scripts are executed by shell commands that run [`osascript`][]
commands, which are contained in steno chord entries in the repo's
[`src` directory][]. The one that runs the "refresh" script looks like
this:

```bash
bash -ci 'osascript $STENO_DICTIONARIES/src/actions/refresh.scpt'
```

> The shell commands run in [interactive mode][] for [reasons][].

## Caring about Sharing

I really wish that sharing code in AppleScript was not as complex as it
currently is, but I do not see that changing at all, assuming that AppleScript
itself even survives into the future.

The revamped [Apple Developer site][] would seem to ignore AppleScript's
existence altogether (all the documentation links used in this post seem to
come from the archive, implying they are now legacy and unmaintained...), but I
do not see any alternative candidate language being put forward for macOS system
automation programming.

Personally, I would be happy to change everything I have written into [Swift][],
if that was possible. But, for now, I need AppleScript, and if you do too,
hopefully this post has been able to serve as some reference.

[Apple Developer site]: https://developer.apple.com/
[AppleScript]: https://en.wikipedia.org/wiki/AppleScript
[`bin/` directory]: https://github.com/paulfioravanti/steno-dictionaries/tree/main/bin
[cloned]: https://git-scm.com/docs/git-clone
[Command]: https://en.wikipedia.org/wiki/Command_key
[ctrlp.vim]: https://github.com/ctrlpvim/ctrlp.vim
[Function Key]: https://en.wikipedia.org/wiki/Function_key
[functions]: https://en.wikipedia.org/wiki/Subroutine
[handlers]: https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_about_handlers.html#//apple_ref/doc/uid/TP40000983-CH206-CJBIDBJH
[interactive mode]: https://www.gnu.org/software/bash/manual/html_node/Interactive-Shell-Behavior.html
[iTerm2]: https://iterm2.com/
[macOS]: https://en.wikipedia.org/wiki/MacOS
[steno-dictionaries repo]: https://github.com/paulfioravanti/steno-dictionaries
[my stenography dictionaries]: https://github.com/paulfioravanti/steno-dictionaries/tree/main/src
[`osacompile`]: https://ss64.com/osx/osacompile.html
[`osascript`]: https://ss64.com/osx/osascript.html
[possessive syntax]: https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_script_objects.html#//apple_ref/doc/uid/TP40000983-CH207-SW3
[Property]: https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_fundamentals.html#//apple_ref/doc/uid/TP40000983-CH218-SW5
[Python]: https://www.python.org/
[reasons]: https://github.com/paulfioravanti/steno-dictionaries/blob/main/dictionaries/commands.md
[refactoring]: https://en.wikipedia.org/wiki/Code_refactoring
[`.scpt`]: https://fileinfo.com/extension/scpt
[Script Library]: https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_script_objects.html#//apple_ref/doc/uid/TP40000983-CH207-SW6
[shell scripts]: https://en.wikipedia.org/wiki/Shell_script
[Single source of truth]: https://en.wikipedia.org/wiki/Single_source_of_truth
[`src` directory]: https://github.com/paulfioravanti/steno-dictionaries/tree/main/src
[stenographic chords]: https://www.artofchording.com/introduction/how-steno-works.html
[stenography]: https://en.wikipedia.org/wiki/Stenotype
[Swift]: https://www.swift.org/
[`sys.path`]: https://docs.python.org/3/library/sys.html#sys.path
[use case]: https://en.wikipedia.org/wiki/Use_case
[Vim]: https://www.vim.org/
