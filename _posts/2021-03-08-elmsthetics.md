---
title: "░▒▓ＥＬＭＳＴＨＥＴＩＣＳ▓▒░"
date: 2021-03-08 21:30 +1100
last_modified_at: 2021-03-08 21:30 +1100
tags: elm synthwave retrowave 80s functional-programming soundcloud giphy
header:
  image: /assets/images/2021-03-08/synthwave-3941721_1280.jpg
  image_description: "Synthwave, Retrowave, Synth, Technology, Abstract"
  teaser: /assets/images/2021-03-08/synthwave-3941721_1280.jpg
  overlay_image: /assets/images/2021-03-08/synthwave-3941721_1280_cropped.jpg
  overlay_filter: 0.1
  caption: >
    Image by [iywbr](https://pixabay.com/users/iywbr-11282422/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3941721)
    from [Pixabay](https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3941721)
excerpt: >
  Tech moves pretty fast. If you don't stop and do a side project once in a
  while, you could miss it.
---

[80sfy.com][], by [Art Sangurai][], is a pretty cool site if you love
[synthwave][] music or the 1980s in general.

It uses a [SoundCloud][] and [Giphy][] combination for maximum
<span style="color: #ff2975; font-weight: bold;">ＡＥＳＴＨＥＴＩＣ</span>
effect to make you <span style="color: #42c6ff; font-weight: bold">ＦＥＥＬ
</span> all the nostalgias, which got it [a lot of love on Reddit][80sfy Reddit
thread].

<div style="margin: auto; text-align: center; width: 90%;">
  <figure style="display: block">
    <img src="/assets/images/2021-03-08/80sfy-screenshot.png"
         alt="80sfy.com screenshot" />
  </figure>
</div>

It is programmed primarily in [Javascript][] with the [React][] library. So, I
decided to re-create it using [Elm][] because why not but also just because...

<div style="margin: auto; text-align: center; width: 80%;">
  <figure style="display: block">
    <img src="/assets/images/2021-03-08/programming-in-elm-is-rad.jpg"
         alt="Programming in Elm is pretty rad!" />
    <figcaption style="text-align: center;">
      Retro Wave at <a href="https://photofunia.com/categories/all_effects/retro-wave">PhotoFunia</a>
    </figcaption>
  </figure>
</div>

You can see the results of those efforts here:

- [Elm 80sfy Website][80sfy Elm]
- [Elm 80sfy Codebase][80sfy Elm codebase]

But, what I would really like to share is some of the Elm-related technical
lessons I learned along the way, so let's get into it.

## "First, you gotta do the random truffle shuffle"

There are two scenarios in the application where an element of randomness is
required:

1. Shuffling the order of tracks to be played in the SoundCloud playlist
   (playing the tracks in the same order over and over would be boring...)
2. Getting a random animated GIF URL from Giphy: the application supplies a
   random descriptive tag, and Giphy sends back a URL whose metadata matches
   that tag (showing the same type of GIFs in the same order over and over would
   probably be boring...)

Unlike many other programming languages, there is no `Math.random()` or
equivalent function in Elm that allows you to summon random numbers and use
them on the spot.

Generating random numbers is the responsibility of the [Elm Runtime][]. So, you
need to:

- code up a _description_ of the kind of random number you want to generate
- send it off to Elm as a [`Cmd`][Platform.Cmd] to have the number generated for
  you
- handle the resulting message you get returned from Elm containing the random
  number

Let's have a look at a simplified-down example of the first scenario for
randomising the order of tracks in a playlist. In the 80sfy application, once it
has fetched the


## "You better shape up, 'cause I need a msg. And my heart is set on you"

## "Say 'hello' to my little façade"

## "If your love were a basic type, mine would be a universe of recursive unions"

## "All those events fired will be lost in time, like tears in rain"

## "Ports? Where we're going we don't need ports"




## When you grow up your heart dies

## Carpe Diem boys. Seize the day. Make your apps extraordinary!

## That's it, man. Game over, man. Game over!

[80sfy.com]: http://www.80sfy.com/
[80sfy codebase repo]: https://bitbucket.org/asangurai/80sfy/src/master/
[80sfy Elm]: https://www.paulfioravanti.com/80sfy/
[80sfy Elm codebase]: https://github.com/paulfioravanti/80sfy
[80sfy Reddit thread]: https://www.reddit.com/r/outrun/comments/5rdvks/my_boyfriend_made_a_website_that_plays_synthwave/
[Art Sangurai]: http://www.digitalbloc.com/
[Elm]: https://elm-lang.org/
[Elm Runtime]: https://elmprogramming.com/elm-runtime.html
[Giphy]: https://giphy.com/
[Javascript]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[Platform.Cmd]: https://package.elm-lang.org/packages/elm/core/latest/Platform.Cmd
[React]: https://reactjs.org/
[SoundCloud]: https://soundcloud.com/
[synthwave]: https://en.wikipedia.org/wiki/Synthwave
