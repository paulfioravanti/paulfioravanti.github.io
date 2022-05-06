---
title: "Stenography Numbers on a Georgi"
date: 2021-01-17 18:15 +1100
last_modified_at: 2022-04-25 14:24 +1100
tags: stenography georgi mechanical-keyboards
narration_video_id: "bdJtRvq7vvo"
header:
  image: /assets/images/2021-01-17/georgi.jpg
  image_description: "Georgi keyboard for stenography."
  teaser: /assets/images/2021-01-17/georgi.jpg
  overlay_image: /assets/images/2021-01-17/georgi-cropped.jpg
  overlay_filter: 0.2
excerpt: >
  Adapt your steno habits from using a number bar to a set of thumb cluster
  number keys.
---

{% include audio-narration-banner.html video-id=page.narration_video_id %}

As a present to myself for ["completing" Typey Type][I Completed Typey Type], I
picked up a [Georgi][] keyboard, and since mid-July 2020, I have been using it
as my daily driver for practising [Plover stenography][].

The Georgi's [Kailh Choc Linear][] key switches with [12g ultra light springs][]
make [chording][] a breeze. However, its compact form factor means it has
a set of number (`#`) keys in the thumb clusters of both halves of the
keyboard, rather than a [number bar][] (or row of keys that effectively
substitute for a number bar if you are using a traditional keyboard, rather than
a [stenotype machine][Stenotype]).

{: refdef: style="text-align: center;"}
![img number-bar][]{: style="margin-right: 0.5rem; width: 45%;"}
![img number-keys][]{: style="margin-left: 0.5rem; width: 45%" }
{: refdef}

This change does not interfere with the majority of how anyone would use a
stenographic keyboard, since, in general, we tend to type numbers significantly
less frequently than letters and words. However, if you do use numbers often,
then some [muscle memory][] re-wiring will be in order to adapt to the number
keys.

In order to help with memorisation, specifically around which `#` key to press
for a given [outline][Learn Plover! Glossary], I created a set of images
indicating the chords pressed for each number from 0-99, and the set of hundreds
numbers from 100-900, with the `#` key that _felt right for me_.

{: refdef: style="text-align: center;"}
![img georgi-numbers-small][]
{: refdef}

You can download a PDF containing all the images in the animated GIF above at
the following link:

- [georgi-numbers.pdf][pdf georgi-numbers]

Also, here are some compare and contrast videos of stroking Plover steno numbers
on both a Georgi and an [Ergodox EZ][] (which I originally [started learning
stenography][Starting Stenography with an Ergodox] on):

<div style="display: flex;">
  <div style="width: 50%; margin-left: 0.5rem;">
    {% include video id="Xz0aqwlIHvg" provider="youtube" %}
  </div>
  <div style="width: 50%; margin-left: 0.5rem;">
    {% include video id="Y1zQEEmivxc" provider="youtube" %}
  </div>
</div>

> I am still learning, so I am definitely not fast. Also, these videos are not
  representative of my current accuracy: it took me tens of takes to record each
  video until I was able to not make any major mistakes (and even then, they are
  not perfect runs).

## Rules

After discovering which number chords "felt right", I tried to see if I could
summarise (read: reverse-engineer) my choices into a set of _subjective_ rules.
So, here is what I came up with:

### General Rules

- Always use two hands to stroke the outline, even if it is possible to use only
  one hand. I do not want to have to remember whether a chord can be stroked
  with one hand or not, so just use two hands by default.
- When the number outline is in [steno order][] (ie for a two-digit number,
  **the first digit value is less than the last digit value**: 13, 48 etc),
  the `#` key used should be on the **opposite side** of the keyboard from the
  key of the **last digit** stroked.

  So, for 13, the `P` key for "3" is on the left half of the keyboard, so the
  right `#` key should be used. Likewise, for 48, the `-L` key for "8" is on the
  right half of the keyboard, so the left `#` key should be used.

  {: refdef: style="text-align: center;"}
  ![img 013-tiny][]{: style="margin-right: 0.5rem;"}
  ![img 048-tiny][]{: style="margin-left: 0.5rem;" }
  {: refdef}
- When the number outline is _not_ in steno order (ie for a two-digit number,
  **the first digit value is greater than the last digit value**: 31, 84 etc),
  then the `#` key used is **always on the left** since the `EU` [inversion][]
  chord must be stroked, and a thumb cannot comfortably stroke all three keys
  in the thumb cluster at once.

  {: refdef: style="text-align: center;"}
  ![img 031-tiny][]{: style="margin-right: 0.5rem;"}
  ![img 084-tiny][]{: style="margin-left: 0.5rem;" }
  {: refdef}
- The thumb cluster rule: where a number outline requires non-`#` keys in the
  thumb clusters (ie `A`, `O`, `E`, `U`), wherever possible, aim to _only_ use
  your thumbs to stroke those keys. This generally limits you to stroking the
  following adjacent keys for number outlines: `#A`, `AO`, and `EU`.

### Exceptions

- When the number outline is in steno order, the `#` key used should be on the
  **opposite side** of the keyboard from the **first digit** stroked if that
  digit is:
  1. composed of two repeated instances of the same digit (22, 66 etc),
     requiring the `-D` key

     {: refdef: style="text-align: center;"}
     ![img 022-tiny][]{: style="margin-right: 0.5rem;"}
     ![img 066-tiny][]{: style="margin-left: 0.5rem;" }
     {: refdef}
  2. a multiple of 100 under 1000 (100, 700 etc), requiring the `-Z` key

     {: refdef: style="text-align: center;"}
     ![img 100-tiny][]{: style="margin-right: 0.5rem;"}
     ![img 700-tiny][]{: style="margin-left: 0.5rem;" }
     {: refdef}

- For the thumb cluster rule above, there are unavoidable exceptions for numbers
  60, 70, 80, and 90, where the left [ring finger][] needs to be brought down
  into the left thumb cluster for stroking the `#` key in the `#O` chord.

   {: refdef: style="text-align: center;"}
   ![img 060-tiny][]{: style="margin-right: 0.5rem;"}
   ![img 090-tiny][]{: style="margin-left: 0.5rem;" }
   {: refdef}

- Since stroking the number 900 requires the `-T` and `-Z` keys, and they are
  diagonal from each other, it is impossible to stroke naturally using standard
  steno hand positions. Therefore, stroking the outline for 900 requires a
  ["Philly shift"][], where your right ring finger strokes the `-T` key, rather
  than your right [little finger][].

   {: refdef: style="text-align: center;"}
   ![img 900-tiny][]{: style="margin-left: 0.5rem;" }
   {: refdef}

  Plover does offer the `#EUT` outline to avoid needing to perform a Philly
  shift, but I do not find the Philly shift _that_ awkward to stroke given that
  the `#` keys are already moving my hands out of standard steno positions
  anyway, and I want keep building muscle memory on the `-Z` pattern and not
  have to remember this one potential exception to the 100s rule.

## All that just for numbers?

You may be reeling in horror at the need to remember so much just to chord
two-digit numbers, and vow to just stroke digits individually, or temporarily
switch to QWERTY mode to type numbers. I certainly could not argue with you!

But, I personally find this set of number outlines comfortable enough to stroke,
and plan to continue giving them a go moving forward. If you are also a student,
or a practitioner, of Plover stenography, then I hope that the materials in this
blog post serve as some reference, or at least as some amusement.

If you do end up using the chords, or have any opinions on rule variations that
you think would work better, please reach out to me or leave a comment!

[12g ultra light springs]: https://www.spritdesigns.com/product-page/choc
[chording]: https://www.artofchording.com/introduction/how-steno-works.html#chords
[Ergodox EZ]: https://ergodox-ez.com/
[Georgi]: https://www.gboards.ca/product/georgi
[I Completed Typey Type]: https://www.paulfioravanti.com/blog/completed-typey-type/
[img 013-tiny]: /assets/images/2021-01-17/013-tiny.png
[img 022-tiny]: /assets/images/2021-01-17/022-tiny.png
[img 031-tiny]: /assets/images/2021-01-17/031-tiny.png
[img 048-tiny]: /assets/images/2021-01-17/048-tiny.png
[img 060-tiny]: /assets/images/2021-01-17/060-tiny.png
[img 066-tiny]: /assets/images/2021-01-17/066-tiny.png
[img 084-tiny]: /assets/images/2021-01-17/084-tiny.png
[img 090-tiny]: /assets/images/2021-01-17/090-tiny.png
[img 100-tiny]: /assets/images/2021-01-17/100-tiny.png
[img 700-tiny]: /assets/images/2021-01-17/700-tiny.png
[img 900-tiny]: /assets/images/2021-01-17/900-tiny.png
[img georgi-numbers-small]: /assets/images/2021-01-17/georgi-numbers-small.gif
[img number-bar]: /assets/images/2021-01-17/number-bar.png
[img number-keys]: /assets/images/2021-01-17/number-keys.png
[inversion]: https://sites.google.com/site/learnplover/lesson-2-steno-order#TOC-Inversion
[Kailh Choc Linear]: http://www.kailh.com/en/Products/Ks/CS/
[Learn Plover! Glossary]: https://sites.google.com/site/learnplover/glossary
[little finger]: https://en.wikipedia.org/wiki/Little_finger
[muscle memory]: https://en.wikipedia.org/wiki/Muscle_memory
[number bar]: https://sites.google.com/site/learnplover/lesson-8-numbers#TOC-The-Number-Bar
[pdf georgi-numbers]: https://www.dropbox.com/s/5d7n1hix84mkrlz/georgi-numbers.pdf?dl=1
["Philly shift"]: https://www.artofchording.com/layout/d-and-z.html#the-d-and-z-keys
[Plover stenography]: http://www.openstenoproject.org/
[ring finger]: https://en.wikipedia.org/wiki/Ring_finger
[Starting Stenography with an Ergodox]: https://www.paulfioravanti.com/blog/starting-stenography-ergodox/
[steno order]: https://sites.google.com/site/learnplover/lesson-2-steno-order#TOC-Steno-Order
[Stenotype]: https://en.wikipedia.org/wiki/Stenotype
