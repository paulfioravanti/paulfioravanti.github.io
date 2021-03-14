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

## First, you gotta do the Random Truffle Shuffle

There are two scenarios in the application where an element of randomness is
required:

<div style="float: right; width: 35%;">
  <figure style="display: block; margin-top: 5px; margin-left: 10px;">
    <img src="/assets/images/2021-03-08/chunk-moshed.jpg"
         alt="Chunk from the Goonies" />
  </figure>
</div>

1. Shuffling the order of tracks to be played in the SoundCloud playlist
2. Getting a random animated GIF URL from Giphy: the application supplies a
   random descriptive tag, and Giphy sends back a URL that is relevant to
   that tag

Unlike many other programming languages, there is no `Math.random()` or
equivalent function in Elm that allows you to summon random numbers and use
them on the spot.

Generating random numbers is the responsibility of the [Elm Runtime][]. So, in
order get one, you need to:

- code up a _description_ of the kind of random number you want to generate
- send that description off to the Elm Runtime as a [`Cmd`][Platform.Cmd] to
  have the number generated for you
- handle the resulting message you get returned from Elm Runtime containing the
  random number

### Creating a Random List of Numbers

Let's have a look at a simplified-down example of the first scenario for
randomising the order of tracks in a playlist. First though, a bit of context
around how the SoundCloud [IFrame][] widget interacts with the Elm application.

The [SoundCloud Widget API][] has a `getSounds(callback)` method that returns
the list of sound objects in its playlist. In the Elm application, we don't need
all of that information: as long as we can get the _length_ of the widget's
playlist, we can build up our own list of integer track indexes to determine the
order that tracks should play.

When the Elm application wants to tell the SoundCloud player to play a track, it
sends over an index number `n`, and the SoundCloud player "skips" over to track
`n` in its playlist.

<div style="margin: auto; text-align: center; width: 100%;">
  <figure style="display: block">
    <img src="/assets/images/2021-03-08/andy-organ-moshed.jpg"
         alt="The Goonies on the bone piano" />
  </figure>
</div>

So, let's pick up our story at the point when an Elm
[`Sub` subscription][Platform.Sub] has:

- received the `playlistLength` via an incoming [Port][Elm Ports] message from
  Javascript
- wrapped it in a `PlaylistLengthFetched` message
- sent the message off to the Elm Runtime...
- ...which is then handled in the `update` function for the `AudioPlayer`

```elm
update : Msg -> AudioPlayer -> ( AudioPlayer, Cmd Msg )
update msg audioPlayer =
    case msg of
        -- ...
        PlaylistLengthFetched playlistLength ->
            let
                generatePlaylist =
                    Playlist.generate playlistLength
            in
            ( { audioPlayer | playlistLength = playlistLength }
            , generatePlaylist
            )
```

Here, the `playlistLength` is passed off to a `Playlist.generate` function,
which defines the generation a shuffled list of track indexes, and returns a
`Cmd` to get the Elm Runtime to do the work of actually generating the playlist.
Let's have a look at how that randomness is created:

```elm
module Playlist exposing (..)

import Random
import Random.List

-- ...

generate : Int -> Cmd Msg
generate playlistLength =
    let
        trackList =
            List.range 0 (playlistLength - 1)

        generator =
            Random.List.shuffle trackList
    in
    Random.generate PlaylistGenerated generator
```

Here, we specify that:

- `List.range` should build a simple list of integers
- the [`Random.List.shuffle`][] function from the [`Random.Extra`][] package,
  which returns a [`Generator`][] from the [`Random`][] package, should shuffle
  the list

We now have our recipe defined for the `generator` (_how_ we want a
random number generated), so we:

- specify that we want to have the generated playlist sent back to us wrapped in
  a `PlaylistGenerated` message (defined as `PlaylistGenerated (List Int)` so
  the message has a place to hold the playlist)
- send it off to the Elm Runtime with the [`Random.generate`][] function
- handle the `PlaylistGenerated` message from the Elm Runtime in the `update`
  function

```elm
update : Msg -> AudioPlayer -> ( AudioPlayer, Cmd Msg )
update msg audioPlayer =
    case msg of
        -- ...

        PlaylistGenerated generatedPlaylist ->
            let
                ( playlist, cmd ) =
                    Playlist.handleNextTrackNumberRequest
                        generatedPlaylist
                        audioPlayer.playlistLength
            in
            ( { audioPlayer | playlist = playlist }, cmd )
```

The details of the `Playlist.handleNextTrackNumberRequest` function are not
needed for this example, but it essentially pops off the first number in the
randomised `generatedPlaylist`, tells the SoundCloud widget to play the track in
its playlist located at that index, and stores the remaining `playlist` in the
`audioPlayer` model.

But, the main point here is that we have requested the Elm Runtime to generate
a random list of integers for us, it has done so, and we have been able to store
in our model! If you want to dig deeper, check out [the real `Playlist`
code][AudioPlayer.Playlist].

We have covered audio playlist generation, but in this application, you
cannot have random tracks without random GIFs as well! This time though, rather
than generate a list, we want to be able to randomly _pick_ a tag from a static
list and send it off to Giphy, so let's see how to do that.

### Randomly Picking from a List

When the Elm application first starts, it goes and fetches a list of descriptive
string tags from a local `tags.json` file, emitting a `TagsFetched` message once
that has been attempted, which is then handled in the `update` function for the
application's `Config` model in a similar way to the following:

```elm
update : Msg -> Config -> ( Config, Cmd Msg )
update msg config =
    case msg of
        -- ...
        TagsFetched (Ok tags) ->
            let
                generateRandomTagForVideoPlayer videoPlayerId =
                    Tag.generateRandomTag videoPlayerId tags

                -- ...
            in
            ( { config | tags = tags }
            , Cmd.batch
                [ generateRandomTagForVideoPlayer "1"
                , generateRandomTagForVideoPlayer "2"
                , -- ...
                ]
            )

        TagsFetched (Err error) ->
            -- ...
```

Once the tags have been read in, we store them in the `config` model, and then
send out two `Cmd`s to generate random tags, one for each `videoPlayer` in the
application (yes, there are two, which [crossfade][] between each other).

Let's take a closer look at the `Tag.generateRandomTag` function, that, like
the `Playlist.generate` function earlier, is responsible for creating a random
generator:

```elm
module Tag exposing (..)

import Random


generateRandomTag : String -> List String -> Cmd msg
generateRandomTag videoPlayerId tags =
    let
        tagsLength =
            List.length tags - 1

        randomTagIndex =
            Random.int 0 tagsLength

        generator =
            Random.map (atIndex tags) randomTagIndex

        msg =
            (RandomTagGenerated videoPlayerId)
    in
    Random.generate msg generator


atIndex : List String -> Int -> Tag
atIndex tags index =
    let
        defaultTag =
            "80s"
    in
    tags
        |> List.drop index
        |> List.head
        |> Maybe.withDefault defaultTag
```

Okay, it looks like randomly picking from a static list is a little bit more
involved than generating a new random list, so what's going on?


- We specify that [`Random.int`][] should generate a random index number between
  zero and the length of the `tags` list
<div style="float: right; width: 45%;">
  <figure style="display: block; margin-top: 10px; margin-left: 10px;">
    <img src="/assets/images/2021-03-08/doubloon-fratellis-moshed.jpg"
         alt="The Fratellis looking at the Doubloon" />
  </figure>
</div>
- We then use [`Random.map`][] to create the generator that transforms that
  random index into the tag at the `randomTagIndex` from the `tags` list. (All
  lists in Elm are [linked lists][Linked List], with the potential to contain
  `Nothing` when we interrogate their contents, which explains the ceremony
  contained in the `atIndex` function, and why we cannot just write something
  like `tags[index]`)
- We then specify that we want to have the tag sent back to us wrapped in
  a `RandomTagGenerated` message (defined as `RandomTagGenerated String String`
  so the message has a place to hold both the `videoPlayerId` the tag is for,
  as well as the generated tag itself)
- Finally, like in the previous example, we call [`Random.generate`][] with the
  message to be handled in the `update` function, and the `generator` itself

```elm
update : Msg -> Config -> ( Config, Cmd Msg )
update msg config =
    case msg of
        -- ...
        RandomTagGenerated videoPlayerId tag ->
            let
                randomGifUrlFetchedMsg =
                    RandomGifUrlFetched videoPlayerId

                fetchRandomGifUrl =
                    Gif.fetchRandomGifUrl
                        randomGifUrlFetchedMsg
                        config.giphyApiKey
                        tag
            in
            ( config, fetchRandomGifUrl )
```

Once the Elm Runtime returns the randomly generated `tag` in the
`RandomTagGenerated` message, along with the `videoPlayerId` we specified
ourselves in the `generateRandomTag` function, we use a `Gif.fetchRandomGifUrl`
function to make a HTTP call out to Giphy to request a GIF URL (details of which
are available in [the codebase][80sfy Elm codebase], but check out the [the
real `Tag` code][Tag] for the details on picking random tags).

<div style="margin: auto; text-align: center; width: 100%;">
  <figure style="display: block">
    <img src="/assets/images/2021-03-08/goonies-end-scene-moshed.jpg"
         alt="The Goonies looking out at the Inferno" />
  </figure>
</div>

For more information on random generators, see the [The Elm Guide][]'s
[Random section][The Elm Guide Random]. If these two examples were too
scoff-inducing-ly simple and you want some Hard Mode in your randomness, go
check out [Charlie Koster][]'s article _[Randomness in Elm][]_, and let him bend
your mind a bit.

## I am a Msg, like my Father before me

## Say 'hello' to my little façade

## If your love were a basic type, mine would be a universe of recursive unions

## All those events fired will be lost in time, like tears in rain

## Ports? Where we're going we don't need ports




## When you grow up your heart dies

## That's it, man. Game over, man. Game over!

[80sfy.com]: http://www.80sfy.com/
[80sfy codebase repo]: https://bitbucket.org/asangurai/80sfy/src/master/
[80sfy Elm]: https://www.paulfioravanti.com/80sfy/
[80sfy Elm codebase]: https://github.com/paulfioravanti/80sfy
[80sfy Reddit thread]: https://www.reddit.com/r/outrun/comments/5rdvks/my_boyfriend_made_a_website_that_plays_synthwave/
[Art Sangurai]: http://www.digitalbloc.com/
[AudioPlayer.Playlist]: https://github.com/paulfioravanti/80sfy/blob/b1858f085eb602d0db939f0b404ff6efc8812d6d/src/AudioPlayer/Playlist.elm
[Charlie Koster]: https://github.com/ckoster22
[crossfade]: https://en.wikipedia.org/wiki/Dissolve_(filmmaking)
[Elm]: https://elm-lang.org/
[Elm Ports]: https://guide.elm-lang.org/interop/ports.html
[Elm Runtime]: https://elmprogramming.com/elm-runtime.html
[`Generator`]: https://package.elm-lang.org/packages/elm/random/latest/Random#Generator
[Giphy]: https://giphy.com/
[IFrame]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
[Javascript]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[Linked List]: https://en.wikipedia.org/wiki/Linked_list
[Platform.Cmd]: https://package.elm-lang.org/packages/elm/core/latest/Platform.Cmd
[Platform.Sub]: https://package.elm-lang.org/packages/elm/core/latest/Platform.Sub
[`Random`]: https://package.elm-lang.org/packages/elm/random/latest/Random
[`Random.Extra`]: https://package.elm-lang.org/packages/elm-community/random-extra/latest
[`Random.int`]: https://package.elm-lang.org/packages/elm/random/latest/Random#int
[`Random.generate`]: https://package.elm-lang.org/packages/elm/random/latest/Random#generate
[`Random.List.shuffle`]: https://package.elm-lang.org/packages/elm-community/random-extra/latest/Random-List#shuffle
[`Random.map`]: https://package.elm-lang.org/packages/elm/random/latest/Random#map
[Randomness in Elm]: https://ckoster22.medium.com/randomness-in-elm-8e977457bf1b
[React]: https://reactjs.org/
[SoundCloud]: https://soundcloud.com/
[SoundCloud Widget API]: https://developers.soundcloud.com/docs/api/html5-widget
[synthwave]: https://en.wikipedia.org/wiki/Synthwave
[Tag]: https://github.com/paulfioravanti/80sfy/blob/7a0e5e0c0b93b9b542340b7ba0022d37e3c0a1c2/src/Tag.elm
[The Elm Guide]: https://guide.elm-lang.org/
[The Elm Guide Random]: https://guide.elm-lang.org/effects/random.html
