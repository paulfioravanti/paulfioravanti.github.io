---
title: "Play Classic Doom on a Mac"
date: 2022-05-13 18:25:00 +1100
last_modified_at: 2023-07-24 16:36 +1100
tags: gaming
header:
  image: /assets/images/2022-05-13/doom-mac-desktop.jpg
  image_description: "Doom on Mac"
  teaser: /assets/images/2022-05-13/doom-mac-desktop.jpg
  overlay_image: /assets/images/2022-05-13/doom-mac-desktop.jpg
  overlay_filter: 0.4
badges:
  - image: https://img.shields.io/badge/HN%20Blog%20Newsletter-16%2F5%2F22-ED702E.svg
    alt: "Hacker News Blogs Newsletter 16/5/22"
    link: https://hnblogs.substack.com/p/hn-blogs-16522
excerpt: >
  Send <a href="https://en.wikipedia.org/wiki/Doomguy">Doomguy</a> to hell
  without having to migrate to Windows.
---

The 1993 video game [Doom][], by [id Software][], was [released for Mac on
November 4, 1994][List_of_Doom_ports#macOS]. But, good luck if you want to:

<ol style="list-style-type: lower-alpha">
  <li>
    find
    <a href="https://doomwiki.org/wiki/Doom_(Apple_Macintosh)">that version</a>
  </li>
  <li>
    figure out a way to run it within some kind of emulation of
    <a href="https://en.wikipedia.org/wiki/Mac_OS_9">Mac OS 9</a> on
    your modern <a href="https://en.wikipedia.org/wiki/MacOS">macOS</a>-running
    computer (is that even possible?).
  </li>
</ol>

Fortunately for us, [GZDoom][][^1] ([official site][]), a "3D-accelerated Doom
[source port][] based on [ZDoom][][^2]", has our backs. It enables us to play the
game as long as we can extract the [WAD][] file from the Doom [.exe][] file for
[Windows][].

If getting from zero to fighting demon hordes on macOS was a straightforward
course of action, there would be no need for this blog post. But, it's a bit of
an involved process, so here is the missing manual to get you up and running.

> I currently use an [Intel-based Macbook Pro][] running [macOS Monterey][], so
> that is what the following guide has been tested on.  The process should still
> hopefully work for [Apple Silicon][]-based Macs and/or other macOS versions,
> but [your mileage may vary][].<br />
> **Update 6 October 2022**: I now use a [M1][] Macbook Pro, and Doom with
> GZDoom works just fine. Apple Silicon-based Mac users can keep reading.

## Get GZDoom

<figure style="width:50%; float: right; margin-left: 10px; margin-top: 0;">
  <img src="/assets/images/2022-05-13/gzdoom-download.jpg"
       alt="GZDoom downloads page">
</figure>

It is possible to get GZDoom from its [downloads page][GZDoom Downloads].

You can click on the Macintosh link to download it, and install it like you
would any other macOS application.

_However_, since you are going to have to get comfortable with using the
[Terminal][] application during this guide, I would suggest using this
installation as the first opportunity to try it out (assuming you are not
already comfortable, and have your own [terminal emulator][] of choice).

You are going to need to get [Homebrew][], a [package manager][] for macOS. Go
to the Homebrew [homepage][Homebrew], copy the installation command, open up
your terminal, paste the command, and press enter.

Once Homebrew is installed, you should be able to run the `brew` command in the
terminal, so let's do that using the following command to install GZDoom:

```console
brew install gzdoom
```

If everything was successful, you should see output that looks something like
this:

```console
$ brew install gzdoom
==> Downloading https://github.com/coelckers/gzdoom/releases/download/g4.7.1/gzdoom-4-7-1-macOS.zip
==> Downloading from https://objects.githubusercontent.com/github-production-release-asset-2e65be/10879376/59b36246-0a5b-4b9e-8fd8-90c6fce651f9?X-Amz-Algorith
######################################################################## 100.0%
==> Installing Cask gzdoom
==> Moving App 'GZDoom.app' to '/Applications/GZDoom.app'
🍺  gzdoom was successfully installed!
```

Open up your Applications folder, and you should find GZDoom there, ready to go.

<div class="centered-image" style="width: 80%">
  <figure>
    <img src="/assets/images/2022-05-13/gzdoom-in-applications.jpg"
         alt="GZDoom in the macOS Applications directory">
  </figure>
</div>

However, if you double-click the icon and open GZDoom, you will likely find
yourself greeted with an error message that looks like the following:

<div class="centered-image" style="width: 80%">
  <figure style="margin-bottom: 0.5em">
    <img src="/assets/images/2022-05-13/gzdoom-needs-wad-file.jpg"
         alt="GZDoom cannot find a Doom WAD file">
  </figure>
</div>

GZDoom needs WAD files to run (and for you to place them in your local Library
directory, `~/Library/Application Support/gzdoom`, which we will get to
later...).

GZDoom's purpose is to run Doom, and is not, itself, the game Doom. So, it's off
to the store to go get it!

## Get Doom

_[The Ultimate Doom][]_ may be [available on Steam][Steam The Ultimate Doom],
but we are going to need a file that is only provided in the version
[available on GOG.com][GOG.com The Ultimate Doom].

So, if you have not got a [GOG.com][] account yet, create one, then go and buy
your copy of _The Ultimate Doom_.

<div class="centered-image" style="width: 90%">
  <figure>
    <img src="/assets/images/2022-05-13/gog-doom.jpg"
         alt="GOG.com The Ultimate Doom purchase page">
    <figcaption>
      The price displayed here is in
      <a href="https://en.wikipedia.org/wiki/Australian_dollar">AUD</a>. Your
      price will likely reflect your region.
    </figcaption>
  </figure>
</div>

All paid up and ready to go? Great! Go to the game detail page for your copy of
_The Ultimate Doom_ and let's have a look at the files that are available to
download.

<div class="centered-image" style="width: 90%">
  <figure>
    <img src="/assets/images/2022-05-13/gog-doom-download.jpg"
         alt="Download the Doom Offline Backup Game Installers from GOG.com">
  </figure>
</div>

See that big blue "DOWNLOAD AND INSTALL NOW" button that GOG.com is trying to
guide you toward? Ignore it. The file downloaded from that button is for Windows
users only, and cannot be used on a Mac.

What we want is the less obvious "Offline Backup Game Installer". Download the
file linked from there, which will have a name like
`setup_the_ultimate_doom_1.9_(28044).exe`. Although we cannot directly use this `.exe`
file on Mac, it contains the Doom WAD file that we seek to extract.

## Extract WAD File

The extraction process is going to generate a lot of new files, so I would
suggest first creating a new directory somewhere that can contain them.

I just created a temporary `TheUltimateDoom` directory on my home Desktop, and
put the setup file in there (feel free to do the same, or name it whatever you
would like):

<div class="centered-image" style="width: 60%">
  <figure>
    <img src="/assets/images/2022-05-13/setup-exe-file.jpg"
         alt="The offline backup game installer in its own directory">
    <figcaption>
      Terminal path: <code>~/Desktop/TheUltimateDoom</code>
    </figcaption>
  </figure>
</div>

In order to perform the extraction, you will need to install a new program
called [`innoextract`][] ([source code][innoextract source code]).

<div class="centered-image" style="width: 90%">
  <figure>
    <img src="/assets/images/2022-05-13/innoextract.jpg"
         alt="innoextract web page screenshot">
  </figure>
</div>

`innoextract` is a "tool to unpack installers created by [Inno Setup][]", which
is a "tool to create installers for Microsoft Windows applications". Of
particular interest to us is that it supports GOG.com's Inno Setup-based game
installers, which the "Offline Backup Game Installer" you downloaded most
definitely is.

Like with GZDoom, you install `innoextract` using Homebrew with the following
command:

```console
brew install innoextract
```

> Unlike with GZDoom, using Homebrew is the _only_ installation option
> available. So, if you ignored the last suggestion to install GZDoom using a
> terminal, now is the time to acquaint yourself with the command line.

If everything is successful, you should get output that looks something like
this:

```console
$ brew install innoextract
==> Downloading https://ghcr.io/v2/homebrew/core/innoextract/manifests/1.9_1
######################################################################## 100.0%
==> Downloading https://ghcr.io/v2/homebrew/core/innoextract/blobs/sha256:7206f8b88483356746d682b1e631d214e6172b808bd7b8b0567cb9c0f0906abb
==> Downloading from https://pkg-containers.githubusercontent.com/ghcr1/blobs/sha256:7206f8b88483356746d682b1e631d214e6172b808bd7b8b0567cb9c0f0906abb?se=2022-05-13T23%3A25%3A00Z&sig=AvLqNPFvkGI%2B9T1AJqz%2FWNuK0AW%2FzO%2FrIVjRHJeiBc4%3D&sp=r&spr=https&s
######################################################################## 100.0%
==> Pouring innoextract--1.9_1.monterey.bottle.tar.gz
🍺  /usr/local/Cellar/innoextract/1.9_1: 7 files, 622.9KB
==> Running `brew cleanup innoextract`...
```

Let's now put `innoextract` into action. In your terminal, change directory
([`cd`][]) to the location where you put the Offline Backup Game Installer file,
and run `innoextract` against it.

For the directory and installer filename above, that would be:

```console
cd ~/Desktop/TheUltimateDoom
innoextract setup_the_ultimate_doom_1.9_(28044).exe
```

If everything is successful, you will get a whole bunch of output on your
screen, that will include something like the following:

<div class="centered-image" style="width: 100%">
  <figure style="margin: 0">
    <img src="/assets/images/2022-05-13/innoextract-wad.jpg"
         alt="Extract WAD file from Offline Backup Game Installer file">
  </figure>
</div>

And there is your payload: `DOOM.WAD`. Let's go and introduce it to GZDoom!

## Play Doom with GZDoom

Open up a Finder window, go to the directory where all of your now-extracted
files are, and find `DOOM.WAD`:

<div class="centered-image" style="width: 90%">
  <figure style="margin: 0">
    <img src="/assets/images/2022-05-13/wad-file-location.jpg"
         alt="Locate DOOM.WAD file in a Finder window">
  </figure>
</div>

Copy `DOOM.WAD` into your local Library files under a `gzdoom` directory, so
that GZDoom knows where to find it. If a `gzdoom` directory does not exist
already, you can create it:

<div class="centered-image" style="width: 90%">
  <figure>
    <img src="/assets/images/2022-05-13/application-support-doom-wad.jpg"
         alt="Copy DOOM.WAD over to your local Library files">
    <figcaption>
      Terminal path: <code>~/Library/Application Support/gzdoom</code>
    </figcaption>
  </figure>
</div>

Once you have done this, you can safely delete your `TheUltimateDoom` directory
where you extracted all of Doom's files.

Now, all that is left is to run GZDoom! Double-click GZDoom in your Applications
directory, and you should be greeted with a familiar title screen:

<div class="centered-image" style="width: 90%">
  <figure style="margin: 0">
    <img src="/assets/images/2022-05-13/doom-mac-desktop.jpg"
         alt="Doom on Mac using GZDoom">
  </figure>
</div>

If you ever buy any other titles that also have WAD files, like [Doom II][], or
[Heretic][] (or get any of the other [list of notable WADs][]), repeat the same
process, and you should also be able to play them in GZDoom.

But for now, don your helmet and armour, load your shotgun, and get yourself
back to Mars for some classic [2.5D][] fragging fun!

---

### More Doom-Related Content

Check out my _[Steno Gaming: Doom Typist][]_ post to see how to turn Doom into
a typing game with [Typist.pk3][], and then use it with [Plover stenography][].
Here it is in action!

<div class="steno-video">
  {% include video id="fxxDAYuciD8" provider="youtube" %}
</div>

[^1]: GZDoom is named after [Graf Zahl][], the German name for [Sesame Street][]
     character [Count von Count][], which [Christoph Oelckers][], GZDoom's coder
     and maintainer, uses as an online [moniker][].

[^2]: The meaning (and pronunciation) of the "Z" in ZDoom would seem to be
      [up][REALLY stupid Zdoom Question.] [for][Why is ZDOOM called "Z"DOOM?]
      [debate][Why the name ZDoom?].

[2.5D]: https://en.wikipedia.org/wiki/2.5D
[Apple Silicon]: https://en.wikipedia.org/wiki/Apple_silicon
[`cd`]: https://en.wikipedia.org/wiki/Cd_(command)
[Christoph Oelckers]: https://github.com/coelckers
[Count von Count]: https://en.wikipedia.org/wiki/Count_von_Count
[Doom]: https://en.wikipedia.org/wiki/Doom_(1993_video_game)
[Doom II]: https://en.wikipedia.org/wiki/Doom_II
[.exe]: https://en.wikipedia.org/wiki/.exe
[GOG.com]: https://www.gog.com/
[GOG.com The Ultimate Doom]: https://www.gog.com/en/game/the_ultimate_doom
[Graf Zahl]: https://de.wikipedia.org/wiki/Sesamstra%C3%9Fe#Graf_Zahl
[GZDoom]: https://zdoom.org/wiki/GZDoom
[GZDoom Downloads]: https://zdoom.org/downloads
[Heretic]: https://en.wikipedia.org/wiki/Heretic_(video_game)
[Homebrew]: https://brew.sh/
[id Software]: https://en.wikipedia.org/wiki/Id_Software
[`innoextract`]: https://constexpr.org/innoextract/
[innoextract source code]: https://github.com/dscharrer/innoextract
[Inno Setup]: https://jrsoftware.org/isinfo.php
[Intel-based Macbook Pro]: https://en.wikipedia.org/wiki/MacBook_Pro_(Intel-based)
[List_of_Doom_ports#macOS]: https://en.wikipedia.org/wiki/List_of_Doom_ports#macOS
[list of notable WADs]: https://doom.fandom.com/wiki/List_of_notable_WADs
[M1]: https://en.wikipedia.org/wiki/Apple_M1
[macOS Monterey]: https://en.wikipedia.org/wiki/MacOS_Monterey
[moniker]: https://www.merriam-webster.com/dictionary/moniker
[official site]: https://zdoom.org/index
[package manager]: https://en.wikipedia.org/wiki/Package_manager
[Plover stenography]: https://www.openstenoproject.org/
[REALLY stupid Zdoom Question.]: https://forum.zdoom.org/viewtopic.php?t=290
[Sesame Street]: https://en.wikipedia.org/wiki/Sesame_Street
[source port]: https://zdoom.org/wiki/Source_port
[Steam The Ultimate Doom]: https://store.steampowered.com/app/2280/Ultimate_Doom/
[Steno Gaming: Doom Typist]: https://www.paulfioravanti.com/blog/steno-gaming-doom-typist/
[Terminal]: https://en.wikipedia.org/wiki/Terminal_(macOS)
[terminal emulator]: https://en.wikipedia.org/wiki/Terminal_emulator
[The Ultimate Doom]: https://doomwiki.org/wiki/The_Ultimate_Doom
[Typist.pk3]: https://github.com/mmaulwurff/typist.pk3
[WAD]: https://doomwiki.org/wiki/WAD
[Why is ZDOOM called "Z"DOOM?]: https://forum.zdoom.org/viewtopic.php?t=1112
[Why the name ZDoom?]: https://forum.zdoom.org/viewtopic.php?t=3761
[Windows]: https://en.wikipedia.org/wiki/Microsoft_Windows
[your mileage may vary]: https://en.wiktionary.org/wiki/your_mileage_may_vary#Phrase
[ZDoom]: https://zdoom.org/wiki/ZDoom
