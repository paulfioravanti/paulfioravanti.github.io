---
title: "Test-Driven Fairy Tale"
date: 2021-02-20 21:30 +1100
last_modified_at: 2021-11-29 14:50 +1100
tags: ruby rspec minitest testing
narration_video_id: "Tw2QuzIErQ0"
header:
  image: /assets/images/2021-02-20/wolf.png
  image_description: "An illustration of The Big Bad Wolf from The Three Little Pigs"
  teaser: /assets/images/2021-02-20/wolf.png
  overlay_image: /assets/images/2021-02-20/wolf-face-closeup.png
  overlay_filter: 0.2
  caption: >
    Illustration by [Lee Sheppard](https://www.leesheppard.com.au)
excerpt: >
  Will the Big Bad Wolf thwart The Three Little Pigs from getting a passing
  test suite?
---

{% include audio-narration-banner.html video-id=page.narration_video_id %}

> _This story takes place when pigs spoke rhyme_<br />
> _And monkeys chewed tobacco,_<br />
> _And hens took snuff to make them tough,_<br />
> _And ducks went quack, quack, quack, O!_<br />

Have you ever told a story with your code?

No, I don't mean boring _[user stories][User story]_, I mean real,
_[make-believe][]_ stories!

The story of [The Three Little Pigs][] is a real story. A [fable][], even!

<div style="display: block; text-align: center;">
  <figure style="display: block; margin: 1em;">
    <img src="/assets/images/2021-02-20/three-little-pigs.png"
         alt="The Three Little Pigs" />
    <figcaption style="text-align: center;">
      Illustration by <a href="https://www.leesheppard.com.au">Lee Sheppard</a>.
    </figcaption>
  </figure>
</div>

It uses the [rule of three][] to tell a simple story of pigs versus a wolf:
each encounter sets up a scenario, which gets executed, results in a
pay-off that affects the state of the story, and moves the plot forward.

But, can it be coded? Can we then use its test suite to actually tell the story?
I decided to try and find out!

Nice stories deserve to be told using nice programming languages. So, I chose
[Ruby][], since [Matz][Yukihiro Matsumoto], Ruby's creator, [seems like a nice
person][MINASWAN]. For testing, I chose [RSpec][], a Ruby tool that uses
expressive language to write tests: just what I needed to `describe` the
progression of the story.

You can find the Ruby code for my interpretation of the story at [The Three
Little Pigs Github repository][], but nothing beats having someone read you a
story.

So, gather round your monitors and devices, and let's re-visit this classic
fairy tale together, which begins Once Upon A Time...

{% include video id="4NrU1YMd1qE" provider="youtube" %}

[fable]: https://en.wikipedia.org/wiki/Fable
[img three-little-pigs]: /assets/images/2021-02-20/three-little-pigs.png
[Lee Sheppard]: https://www.leesheppard.com.au
[make-believe]: https://www.collinsdictionary.com/dictionary/english/make-believe
[MINASWAN]: https://en.wiktionary.org/wiki/MINASWAN
[RSpec]: https://rspec.info/
[Ruby]: https://www.ruby-lang.org/en/
[rule of three]: https://en.wikipedia.org/wiki/Rule_of_three_(writing)
[The Three Little Pigs]: https://en.wikipedia.org/wiki/The_Three_Little_Pigs
[The Three Little Pigs Github repository]: https://github.com/paulfioravanti/three_little_pigs
[User story]: https://en.wikipedia.org/wiki/User_story
[Yukihiro Matsumoto]: https://en.wikipedia.org/wiki/Yukihiro_Matsumoto
