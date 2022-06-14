---
title: "AppleScript Records: Strings as Keys"
date: 2022-06-10 15:30:00 +1100
last_modified_at: 2022-06-14 11:15:00 +1100
tags: hash dictionary apple scripting
header:
  image: /assets/images/2022-06-10/anita-jankovic-Xh-Xr7_fxBI-unsplash-header.jpg
  image_description: "red and green apple fruit"
  teaser: /assets/images/2022-06-10/anita-jankovic-Xh-Xr7_fxBI-unsplash.jpg
  overlay_image: /assets/images/2022-06-10/anita-jankovic-Xh-Xr7_fxBI-unsplash-header.jpg
  overlay_filter: 0.2
  caption: >
    Photo by <a href="https://unsplash.com/@dslr_newb">Anita Jankovic</a> on
    <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
    Unsplash
    </a>
excerpt: >
  Not as straightforward as you may think.
---

I am a [macOS][] user, and my attempts at creating programs to control my
computer have necessitated working with [AppleScript][]. Like every programming
language, it has its idiosyncrasies, but one in particular sent me down a
[rabbit hole][], which I hope this post can help you avoid should you find
yourself in similar circumstances.

Many programming languages have a built-in [key-value][] data structure, which
are known by different names: [hashes][Hash], [maps][Map], [objects][Object],
[dictionaries][Dictionary] etc. The AppleScript structure equivalent is called
a [record][Record], and they look outwardly similar to those of other languages:

```applescript
{product:"pen", price:2.34}
```

However, a big difference is that while many other languages will allow you to
use any kind of data type as a key ([strings][String], [integers][Integer] etc),
record keys can only be [Properties][Property], which are ["effectively tokens
created by AppleScript at compile time"][Record Properties], and essentially act
like [constants][Constant] (which also means there's no chance to, say,
"[constantize][]" a string received at run time). Therefore, this kind of record
is not legal:

```applescript
{"product":"pen", 5:2.34}
```

The result of this is that a script must always know in advance what keys it
plans to use to look up values in a record: no lookup is possible using, say,
some variable that references a string.

This is unfortunate, because I wanted to perform dynamic lookups on a record by
fetching values from it based on some string I would receive from the result of
a [handler][] (function) call. Here is a code snippet indicating what I
_attempted_ to write in order to perform a "zoom in", which would send different
shortcut keystrokes depending on what application was currently in focus:

```applescript
# Chrome Zoom In keyboard shortcut is ⌘+, while Postman is ⌘=
# NOTE: This record will raise a syntax error.
property zoomInKeys : {"Google Chrome":"+", "Postman":"="}
tell application "System Events"
    # returns a string like "Google Chrome" for the application currently in focus
    set activeApp to name of first application process whose frontmost is true
end tell
# Fetch the appropriate "zoom in" value from the record based on the `activeApp` key
set zoomInKey to activeApp of zoomInKeys

# Perform the keyboard shortcut
tell application "System Events" to tell process activeApp
    keystroke zoomInKey using {command down}
end tell
```

I initially thought that perhaps the reason for the error was because the record
key properties follow the rules of [Identifiers][Identifier], which have a
limited set of characters they are allowed to use (that do not include spaces).
But...

> "AppleScript provides a loophole \[...\]: identifiers whose first
> and last characters are vertical bars (|) can contain any characters".

So, I figured that changing the record definition to:

```applescript
property zoomInKeys : {|Google Chrome|:"+", |Postman|:"="}
```

or

```applescript
property zoomInKeys : {|"Google Chrome"|:"+", |"Postman"|:"="}
```

would work. Alas, they did not. The workaround for getting this code running
correctly was to fall back to a traditional `if` statement:

```applescript
tell application "System Events"
    set activeApp to name of first application process whose frontmost is true
end tell

if activeApp is "Google Chrome" then
    set zoomInKey to "+"
else if activeApp is "Postman" then
    set zoomInKey to "="
else
  display notification "Cannot zoom in" with title "Error"
  return
end if

# Perform the keyboard shortcut
tell application "System Events" to tell process activeApp
    keystroke zoomInKey using {command down}
end tell
```

At this point, the sane thing to do is to accept that you now have working code
that is fit for purpose, and move on.

But, I could not shake the feeling that there _must_ be a way for string keys to
work, even though hours of internet searching turned up nothing. How could every
other programming language I know of do this, but not AppleScript? It did not
make sense to me.

So, I asked the [bird site][Twitter] in a [last ditch attempt][Twitter thread],
and it delivered in the form of [Takaaki Naganoya][], whose efforts in creating
a [solution][] using the [Foundation][] framework led me to be able to change
the original code to:

```applescript
use AppleScript version "2.4"
use framework "Foundation"
use scripting additions

property zoomInKeys : {|Google Chrome|:"+", |Postman|:"="}

set zoomInKeysDict to ¬
    current application's NSDictionary's dictionaryWithDictionary:zoomInKeys

tell application "System Events"
    set activeApp to name of first application process whose frontmost is true
end tell

set zoomInKey to (zoomInKeysDict's valueForKey:activeApp) as anything

tell application "System Events" to tell process activeApp
    keystroke zoomInKey using {command down}
end tell
```

Now, this code _works_. But, the [shotgun approach][] of bringing in a whole
framework and other random handlers just to solve this small problem, coupled
with the awkward readability of some of the [API][]s (looking at you,
`dictionaryWithDictionary`), means that I think the code is now more difficult
to understand, for very negligible benefit. So, `if` statements it is.

If I wanted to dive even further down the rabbit hole, I could have attempted
adapting Takaaki's [other solution][] to the same problem, which was done in
vanilla AppleScript, without using Foundation. But, at this point, I think I'm
good.

If you are interested in seeing how I ended up using AppleScript for my own use
case of mapping [stenography][] chords to macOS keyboard shortcuts, check out my
[steno dictionaries GitHub repository][steno-dictionaries commands].

[API]: https://en.wikipedia.org/wiki/API
[AppleScript]: https://en.wikipedia.org/wiki/AppleScript
[Constant]: https://en.wikipedia.org/wiki/Constant_(computer_programming)
[constantize]: https://api.rubyonrails.org/classes/String.html#method-i-constantize
[Dictionary]: https://docs.python.org/3/tutorial/datastructures.html#dictionaries
[Foundation]: https://developer.apple.com/documentation/foundation
[handler]: https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_about_handlers.html#//apple_ref/doc/uid/TP40000983-CH206-CJBIDBJH
[Hash]: https://ruby-doc.org/core/Hash.html
[Identifier]: https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_lexical_conventions.html#//apple_ref/doc/uid/TP40000983-CH214-SW4
[Integer]: https://en.wikipedia.org/wiki/Integer
[key-value]: https://en.wikipedia.org/wiki/Key%E2%80%93value_database
[macOS]: https://en.wikipedia.org/wiki/MacOS
[Map]: https://hexdocs.pm/elixir/Map.html
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[other solution]: https://twitter.com/Piyomaru/status/1517770289597513730
[Property]: https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_fundamentals.html#//apple_ref/doc/uid/TP40000983-CH218-SW5
[rabbit hole]: https://en.wiktionary.org/wiki/rabbit_hole
[Record]: https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_classes.html#//apple_ref/doc/uid/TP40000983-CH1g-BBCDGEAH
[Record Properties]: http://books.gigatux.nl/mirror/applescriptdefinitiveguide/applescpttdg2-CHP-13-SECT-11.html
[shotgun approach]: https://en.wiktionary.org/wiki/shotgun_approach
[solution]: https://twitter.com/Piyomaru/status/1517769013488918528
[steno-dictionaries commands]: https://github.com/paulfioravanti/steno-dictionaries/tree/main/src/command
[stenography]: https://en.wikipedia.org/wiki/Stenotype
[String]: https://en.wikipedia.org/wiki/String_(computer_science)
[Takaaki Naganoya]: http://piyocast.com/as/
[Twitter]: https://twitter.com
[Twitter thread]: https://twitter.com/paulfioravanti/status/1517743540784168960?s=20&t=ai1eJAVRQpkoQ2bwoL8W0Q
