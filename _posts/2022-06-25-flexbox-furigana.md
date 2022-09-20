---
title: "Flexbox Furigana"
date: 2022-06-25 11:30:00 +1100
last_modified_at: 2022-06-28 10:00:00 +1100
tags: japan japanese 日本語 振り仮名 ふりがな annotation blog jekyll
header:
  image: /assets/images/2022-06-25/menu-with-furigana.jpg
  image_description: "大和田鮨"
  teaser: /assets/images/2022-06-25/menu-with-furigana.jpg
  overlay_image: /assets/images/2022-06-25/menu-with-furigana-header.jpg
  overlay_filter: 0.4
  caption: >
    Photo by <a href="https://www.flickr.com/photos/milkway_gdh/">極地狐</a> on
    <a href="https://www.flickr.com/photos/milkway_gdh/21295392670/">Flickr</a>
excerpt: >
  Styling _kanji_ readings is a big subject for such small text.
---

_[Furigana][]_ are annotations used to indicate the Japanese reading, or
pronunciation, of Chinese _[kanji][]_ characters.

As a simple example, let's say we have a character like this[^1]:

<div class="japanese-hero">
  車
</div>

_Furigana_ for the _kanji_, written with _[hiragana][]_[^2], can be placed above
it[^3]:

<div class="japanese-hero" style="padding-top: 20px;">
  <ruby lang="ja">
    車
    <rp>(</rp>
    <rt style="ruby-align: center; text-align: center; font-size: medium;">
      くるま
    </rt>
    <rp>)</rp>
  </ruby>
</div>

This is all well and good for Japanese speakers, but what if I wanted
English-speakers to be able to read along as well? This can be done by adding
the character's pronunciation using Latin script (_[romaji][]_) as another
_furigana_-style annotation:

<div class="japanese-hero">
  <ruby lang="ja" class="japanese">
    <ruby lang="ja">
      車
      <rp>(</rp>
      <rt style="ruby-align: center; text-align: center; font-size: medium;">
        くるま
      </rt>
      <rp>, </rp>
    </ruby>
    <rt style="font-style: italic; font-size: medium;">
      kuruma
    </rt>
    <rp>)</rp>
  </ruby>
</div>

Okay, but what does this word actually mean? We could put an English translation
to the right of the word, or pile on _yet another_ annotation for the English
meaning[^4]:

<div class="japanese-hero">
  <ruby lang="en" class="japanese">
    <ruby lang="ja" class="japanese">
      <ruby lang="ja">
        車
        <rp>(</rp>
        <rt style="ruby-align: center; text-align: center; font-size: medium;">
          くるま
        </rt>
        <rp>, </rp>
      </ruby>
      <rt style="font-style: italic; font-size: medium;">
        kuruma
      </rt>
      <rp>, </rp>
    </ruby>
    <rt lang="en" style="font-weight: bold; text-align: center;">
      car
    </rt>
    <rp>) </rp>
  </ruby>
</div>

For single words, this "full-suite" of annotations could be considered
acceptable, but for complete sentences, where the objective is to have a
non-Japanese speaker read along
{% include ruby.html word="phonetically" annotation="fuh·neh·ti·kuh·lee" %}, I
think any translation needs its own dedicated section.

I did exactly this in a previous blog post, _[A Person's Character
(人という字は)][]_, where I wanted to show the
{% include ruby.html word="pronunciation" annotation="/pɹəˌnʌn.siˈeɪ.ʃən/" %}
and meaning of some lines of dialogue from the television drama
_[Kinpachi-sensei][]_. The intention was to enable English speakers to follow
the Japanese dialogue using the _romaji_ annotations, and _then_ read the
translation:

<blockquote>
  <div class="japanese-with-furigana-romaji">
    {% include japanese.html word="君"
                             furigana="きみ"
                             romaji="Kimi"
                             furigana-left-padding="4px" %}
    {% include japanese.html word="たち" romaji="tachi" %}
    {% include japanese.html word="いい" romaji="ii" %}
    {% include japanese.html word="です" romaji="desu" %}
    {% include japanese.html word="か" romaji="ka~." %}
    {% include japanese.html word="〜。" %}
    {% include japanese.html word="人"
                             furigana="ひと"
                             romaji="Hito"
                             furigana-left-padding="4px" %}
    {% include japanese.html word="と" romaji="to" %}
    {% include japanese.html word="いう" romaji="iu" %}
    {% include japanese.html word="字"
                             furigana="じ"
                             romaji="ji"
                             furigana-left-padding="4px" %}
    {% include japanese.html word="は" romaji="wa" %}
    {% include japanese.html word="ねぇ" romaji="nē," %}
    {% include japanese.html word="、" %}
    {% include japanese.html word="ひとり" romaji="hitori" %}
    {% include japanese.html word="の" romaji="no" %}
    {% include japanese.html word="「人」"
                             furigana="ひと"
                             romaji="\"hito\""
                             furigana-left-padding="8px" %}
    {% include japanese.html word="が" romaji="ga" %}
    {% include japanese.html word="もう" romaji="mō" %}
    {% include japanese.html word="ひとり" romaji="hitori" %}
    {% include japanese.html word="の" romaji="no" %}
    {% include japanese.html word="「人」"
                             furigana="ひと"
                             romaji="\"hito\""
                             furigana-left-padding="8px" %}
    {% include japanese.html word="を" romaji="o" %}
    {% include japanese.html word="支えて"
                             furigana="ささ"
                             romaji="sasaete"
                             furigana-align="left"
                             furigana-left-padding="3px" %}
    {% include japanese.html word="いる" romaji="iru" %}
    {% include japanese.html word="字"
                             furigana="じ"
                             romaji="ji"
                             furigana-left-padding="4px" %}
    {% include japanese.html word="です" romaji="desu." %}
    {% include japanese.html word="。" %}
    {% include japanese.html word="つまり" romaji="Tsumari," %}
    {% include japanese.html word="、" %}
    {% include japanese.html word="人"
                             furigana="ひと"
                             romaji="hito"
                             furigana-left-padding="4px" %}
    {% include japanese.html word="と" romaji="to" %}
    {% include japanese.html word="人"
                             furigana="ひと"
                             romaji="hito"
                             furigana-left-padding="4px" %}
    {% include japanese.html word="が" romaji="ga" %}
    {% include japanese.html words="支え,合ってる"
                             furigana="ささ,あ"
                             romaji="sasae,atteru"
                             furigana-align="left"
                             furigana-left-padding="3px,8px" %}
    {% include japanese.html word="から" romaji="kara" %}
    {% include japanese.html word="人"
                             furigana="ひと"
                             romaji="hito"
                             furigana-left-padding="4px" %}
    {% include japanese.html word="なん" romaji="nan" %}
    {% include japanese.html word="です" romaji="desu." %}
    {% include japanese.html word="。" %}
    {% include japanese.html word="人"
                             furigana="ひと"
                             romaji="Hito"
                             furigana-left-padding="4px" %}
    {% include japanese.html word="は" romaji="wa" %}
    {% include japanese.html word="人"
                             furigana="ひと"
                             romaji="hito"
                             furigana-left-padding="4px" %}
    {% include japanese.html word="に" romaji="ni" %}
    {% include japanese.html word="よって" romaji="yotte" %}
    {% include japanese.html word="支えられ"
                             furigana="ささ"
                             romaji="sasaerare,"
                             furigana-align="left"
                             furigana-left-padding="3px" %}
    {% include japanese.html word="、" %}
    {% include japanese.html word="人"
                             furigana="ひと"
                             romaji="hito"
                             furigana-left-padding="4px" %}
    {% include japanese.html word="の" romaji="no" %}
    {% include japanese.html word="間"
                             furigana="あいだ"
                             romaji="aida"
                             furigana-left-padding="5px" %}
    {% include japanese.html word="で" romaji="de" %}
    {% include japanese.html word="人間"
                             furigana="にんげん"
                             romaji="ningen"
                             furigana-left-padding="6px" %}
    {% include japanese.html word="として" romaji="toshite" %}
    {% include japanese.html word="磨かれて"
                             furigana="みが"
                             romaji="migakarete"
                             furigana-align="left"
                             furigana-left-padding="4px" %}
    {% include japanese.html word="いくん" romaji="ikun" %}
    {% include japanese.html word="です" romaji="desu." %}
    {% include japanese.html word="。" %}
  </div>
  <br />

  Can I have your attention, please. So, the character for "person" consists of
  one person holding up and sustaining another person. In other words, it is a
  "person" precisely <em>because</em> a person and another person are supporting
  each other. A person gets support from other people and their community, and
  through that support, grows and develops as a human.
</blockquote>

Figuring out the idiosyncrasies of how to mark-up and display all of these
annotations in the way I wanted using [HTML][] and [CSS][], and then developing
a way to extract that logic out into functionality that could be shared across
multiple [Markdown][]-based blog posts using [Liquid][], took me far more time
than I expected, and became the catalyst for writing this particular blog post.

So, the following is my [brain dump][] on what I learned about using annotations
on the web.

## Annotation Markup

<div class="centered-image" style="width: 60%;">
  <figure style="margin-bottom: 0; margin-top: 20px;">
    <img src="/assets/images/2022-06-25/Furigana_example.png"
         alt="Japanese word meaning 'furigana' with above smaller orange phonetic hiragana called 'furigana' helping to pronounce it.">
  </figure>
  <figcaption style="margin-bottom: 0.75em;">
    Image by Kang Seonghoon, Public domain, via
    <a href="https://commons.wikimedia.org/wiki/File:Furigana_example.svg">
      Wikimedia Commons
    </a>
  </figcaption>
</div>

_Furigana_ is a type of [Ruby character][] annotation[^5], and is marked up in
HTML using the [`<ruby>`][] tag.

Searching the internet for how to mark-up `<ruby>` elements leads to a
significant amount of conflicting information. The [W3 Ruby Annotation][]
document mentions a selection of markup tags that can appear inside a `<ruby>`
tag:

- [`<rt>`][]: ruby text (the annotation)
- [`<rp>`][]: ruby parenthesis (for when a browser does not support
  ruby annotations and the ruby text gets rendered inline)
- [`<rb>`][]: ruby base (the text that is being annotated)
- [`<rtc>`][]: ruby text container (a container for `<rt>` elements when markup
  is "complex")
- `<rbc>`: ruby base container (a container for `<rb>` elements when markup is
  "complex")

Each of the tag links in the list above is from the [Mozilla HTML
documentation][], a trustworthy source for this kind of information (in my
opinion), and they say that the `<rb>`, `<rtc>`, and `<rbc>` tags are
[deprecated][Deprecation], and should be avoided. In order to future-proof
_furigana_ annotations, it would seem that only three tags should be used:
container `<ruby>` tags, along with child `<rt>` and `<rp>` tags.

So, for the "car" _kanji_ from the example above,
{% include ruby.html word="車" annotation="くるま" %}, the markup could look
like the following:

```html
<ruby lang="ja">
  車
  <rp>(</rp>
  <rt>くるま</rt>
  <rp>)</rp>
</ruby>
```

> What are those `<rp>` tags for? In the event that a browser does not support
> ruby annotations, the code above will display as:
>
> <div class="japanese-hero" style="margin-top: -20px; font-size: xx-large;">
>   車(くるま)
> </div>
>
> <figure style="
>   float: right;
>   margin-bottom: 0;
>   margin-left: 10px;
>   margin-top: 10px;
>   width: 40%;
> ">
>   <img src="/assets/images/2022-06-25/browser-dev-tools.jpg"
>        alt="Ruby <rt> tag base CSS styles in Chrome dev tools">
> </figure>
>
> I could not find any built-in functionality that would force a modern browser
> to "pretend" it does not support annotations, but I was able to follow the
> [Inlining Ruby Annotations][] section of [CSS Ruby Annotation Layout Module][],
> and add styling via the browser developer tools to achieve the desired display
> behaviour:
>
> ```css
> rp, rt {
>   display: inline;
>   white-space: inherit;
>   font: inherit;
>   text-emphasis: inherit;
> }
> ```

Given that the [HTML spec for the `<ruby>` element][] says that a `<ruby>` tag
can contain "one or more `<rt>` elements", you may be forgiven for thinking that
adding the extra _romaji_ annotation would be a case of perhaps appending it
beneath the _furigana_:

```html
<ruby lang="ja">
  車
  <rp>(</rp>
  <rt>くるま</rt>
  <rp>, </rp>
  <rt>kuruma</rt>
  <rp>)</rp>
</ruby>
```

<div class="japanese-hero" style="padding-top: 40px;">
  <ruby lang="ja">
    車
    <rp>(</rp>
    <rt>くるま</rt>
    <rp>, </rp>
    <rt>kuruma</rt>
    <rp>)</rp>
  </ruby>
</div>

Not great. We can, however, rearrange the `<ruby>` child elements, and leverage
CSS [Flexbox][] styling, to exhert more control over the visuals (we will keep
styling [inline][inline CSS] for demonstration purposes moving forward):

```html
<ruby lang="ja" style="display: inline-flex; flex-direction: column-reverse;">
  <rp>(</rp>
  <rt>kuruma</rt>
  <rp>, </rp>
  車
  <rt>くるま</rt>
  <rp>)</rp>
</ruby>
```

<div class="japanese-hero">
  <ruby lang="ja" style="
    display: inline-flex;
    flex-direction: column-reverse;
  ">
    <rp>(</rp>
    <rt>kuruma</rt>
    <rp>, </rp>
    車
    <rt>くるま</rt>
    <rp>)</rp>
  </ruby>
</div>

This displays in a similar way to the initial example at the beginning of the
post (though the default gap between the _kanji_ and _furigana_ is a bit
concerning...). However, I think the meaning behind the child elements of the
`<ruby>` parent tag have become muddled.

What is annotating what? Is 車 annotating _kuruma_, along with くるま annotating
車? Technically, it seems these semantics are valid, but is there is another way
to communicate the desired annotations via markup?

> Note, also, that we have headed into exploitation territory for the meaning of
> the `<rp>` tag to make sure that we get **車(くるま, kuruma)** displayed when
> annotations are not supported (commas are not parentheses, after all). I do
> not currently know of a "better" way to mark this up to allow for a similar
> kind of display.

The code examples in the [HTML spec for the `<ruby>` element][] show that "a
nested `<ruby>` element" can be used for inner annotations. In our case, this
could mean that the markup should indicate that:

- くるま annotates 車 (one `<ruby>` inner nested element)
- _kuruma_ annotates the {% include ruby.html word="車" annotation="くるま" %}
  compound (another `<ruby>` outer nesting element)

Let's see how this could look in markup:

```html
<ruby lang="ja" style="display: inline-flex; flex-direction: column;">
  <ruby lang="ja">
    車
    <rp>(</rp>
    <rt>くるま</rt>
    <rp>)</rp>
  </ruby>
  <rt>kuruma</rt>
</ruby>
```

<div class="japanese-hero">
  <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
    <ruby lang="ja">
      車
      <rp>(</rp>
      <rt>くるま</rt>
      <rp>)</rp>
    </ruby>
    <rt>kuruma</rt>
  </ruby>
</div>

Looks acceptable to me, and I think the meaning of the markup is conveyed in a
clearer way.

> Nesting `<ruby>` tags like this means we have to give up the ability to
> display the _furigana_ and _romaji_ together [**車(くるま, kuruma)**], when
> annotations are not supported. But, I am prepared to accept this compromise
> because the fallback display looks good enough for the rare times it will
> probably ever be viewed:
>
> <div class="japanese-hero" style="font-size: xx-large;">
>   <div>車(くるま)</div>
>   <div>kuruma</div>
> </div>

Before concluding that we have the `<ruby>` markup and styling to use as a
foundation to build with, let's test it with a few other _kanji_ scenarios.

## Single Word, Multiple _Kanji_

Not every word in Japanese can be written with a single _kanji_; many require
multiple _kanji_ together in a compound. So, let's test the current markup's
display of _kanji_ compounds by changing the "car" into an "automobile":

```html
<ruby lang="ja" style="display: inline-flex; flex-direction: column;">
  <ruby lang="ja">
    自動車
    <rp>(</rp>
    <rt>じどうしゃ</rt>
    <rp>)</rp>
  </ruby>
  <rt>jidōsha</rt>
</ruby>
```

<div class="japanese-hero">
  <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
    <ruby lang="ja">
      自動車
      <rp>(</rp>
      <rt>じどうしゃ</rt>
      <rp>)</rp>
    </ruby>
    <rt>jidōsha</rt>
  </ruby>
</div>

This looks like it displays as expected. However, pedanticism is going to get
the best of me here: even though the _furigana_ is correct for the entire word,
they _don't quite_ line up perfectly above the individual characters they are
annotating the reading for.

Let's see if we can fix that by adding more `<rt>`/`<rp>` tag sets:

```html
<ruby lang="ja" style="display: inline-flex; flex-direction: column;">
  <ruby lang="ja">
    自
    <rp>(</rp>
    <rt>じ</rt>
    <rp>)</rp>
    動
    <rp>(</rp>
    <rt>どう</rt>
    <rp>)</rp>
    車
    <rp>(</rp>
    <rt>しゃ</rt>
    <rp>)</rp>
  </ruby>
  <rt>
    jidōsha
  </rt>
</ruby>
```

<div class="japanese-hero">
  <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
    <ruby lang="ja">
      自
      <rp>(</rp>
      <rt>じ</rt>
      <rp>)</rp>
      動
      <rp>(</rp>
      <rt>どう</rt>
      <rp>)</rp>
      車
      <rp>(</rp>
      <rt>しゃ</rt>
      <rp>)</rp>
    </ruby>
    <rt>
      jidōsha
    </rt>
  </ruby>
</div>

Ah, much better! The difference may be minor, but I think it's important!

> Doing this, unfortunately, "breaks" the `<rp>` fallback display even more, as
> the _furigana_ readings are now displayed broken down not by full word, but by
> character:
>
> <div class="japanese-hero" style="font-size: xx-large;">
>   <div>自 (じ) 動 (どう) 車 (しゃ)</div>
>   <div>jidōsha</div>
> </div>
>
> At this point, I think attempting to handle the fallback display gracefully is
> going to be prioritised to a distant second compared to getting the _furigana_
> displaying well for "normal" modern browser usage.

## Single Word, Alternating _Kanji_ and _Kana_

[Compound verbs][] in Japanese are a good example of words that alternate
between _kanji_ and _[kana][]_ in their construction. For example, in the
annotations for the word _norikomu_ (乗り込む), meaning "to get into
(a vehicle)", I would expect there to be _furigana_ over 乗 and 込, but not over
り or む. As for the _romaji_, I think a single annotation under the word would
suffice.

Let's see if we can re-use the code from the _kanji_ compound to achieve the
effect we want:

```html
<ruby lang="ja" style="display: inline-flex; flex-direction: column;">
  <ruby lang="ja">
    乗
    <rp>(</rp>
    <rt>の</rt>
    <rp>)</rp>
    り
    込
    <rp>(</rp>
    <rt>こ</rt>
    <rp>)</rp>
    む
  </ruby>
  <rt>
    norikomu
  </rt>
</ruby>
```

<div class="japanese-hero">
  <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
    <ruby lang="ja">
      乗
      <rp>(</rp>
      <rt>の</rt>
      <rp>)</rp>
      り
      込
      <rp>(</rp>
      <rt>こ</rt>
      <rp>)</rp>
      む
    </ruby>
    <rt>
      norikomu
    </rt>
  </ruby>
</div>

Hmm, not quite right: that second _furigana_ positioning is incorrect, and there
is an awkward space between 乗り and 込む. Perhaps each half of this word needs
to be its own `<ruby>` element? Let's give that a try:

```html
<ruby lang="ja" style="display: inline-flex; flex-direction: column;">
  <ruby lang="ja">
    乗
    <rp>(</rp>
    <rt>の</rt>
    <rp>)</rp>
    り
  </ruby>
  <ruby lang="ja">
    込
    <rp>(</rp>
    <rt>こ</rt>
    <rp>)</rp>
    む
  </ruby>
  <rt>norikomu</rt>
</ruby>
```

<div class="japanese-hero">
  <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
    <ruby lang="ja">
      乗
      <rp>(</rp>
      <rt>の</rt>
      <rp>)</rp>
      り
    </ruby>
    <ruby lang="ja">
      込
      <rp>(</rp>
      <rt>こ</rt>
      <rp>)</rp>
      む
    </ruby>
    <rt>norikomu</rt>
  </ruby>
</div>

The _furigana_ positioning is fixed, but since we now have three child elements
under the `<ruby>` tag, the `flex-direction: column` styling is displaying them
all vertically, which is not the result we want.

In order to get them to display as one set, we will need to wrap a container
around the 乗り and 込む `<ruby>` tags. Yet another `<ruby>` tag seems like it
could be overkill here, so, instead, let's try a plain old [`<span>`][] tag, and
give it some Flexbox styling as well:

```html
<ruby lang="ja" style="display: inline-flex; flex-direction: column;">
  <span style="display: inline-flex;">
    <ruby lang="ja">
      乗
      <rp>(</rp>
      <rt>の</rt>
      <rp>)</rp>
      り
    </ruby>
    <ruby lang="ja">
      込
      <rp>(</rp>
      <rt>こ</rt>
      <rp>)</rp>
      む
    </ruby>
  </span>
  <rt>norikomu</rt>
</ruby>
```

<div class="japanese-hero">
  <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
    <span style="display: inline-flex;">
      <ruby lang="ja">
        乗
        <rp>(</rp>
        <rt>の</rt>
        <rp>)</rp>
        り
      </ruby>
      <ruby lang="ja">
        込
        <rp>(</rp>
        <rt>こ</rt>
        <rp>)</rp>
        む
      </ruby>
    </span>
    <rt>norikomu</rt>
  </ruby>
</div>

Looks good to me! If we _did_ want to split the _romaji_, so the annotation was
under each part of the word, we have the option of changing the tag nesting
around to achieve that effect:

```html
<span style="display: inline-flex;">
  <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
    <ruby lang="ja">
      乗
      <rp>(</rp>
      <rt>の</rt>
      <rp>)</rp>
      り
    </ruby>
    <rt>nori</rt>
  </ruby>
  <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
    <ruby lang="ja">
      込
      <rp>(</rp>
      <rt>こ</rt>
      <rp>)</rp>
      む
    </ruby>
    <rt>komu</rt>
  </ruby>
</span>
```

<div class="japanese-hero">
  <span style="display: inline-flex; justify-content: center;">
    <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
      <ruby lang="ja">
        乗
        <rp>(</rp>
        <rt>の</rt>
        <rp>)</rp>
        り
      </ruby>
      <rt>nori</rt>
    </ruby>
    <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
      <ruby lang="ja">
        込
        <rp>(</rp>
        <rt>こ</rt>
        <rp>)</rp>
        む
      </ruby>
      <rt>komu</rt>
    </ruby>
  </span>
</div>

Great! We now know there are options around the display for _romaji_, for
potential readability and/or aesthetic reasons.

## Styled _Furigana_

Speaking of aesthetics, does _furigana_ still display as expected if the
CSS `font-style` changes, like how everything gets italicised on this page when
the content is within `<blockquote>` tags? Let's find out with the phrase
{% include japanese.html word="自,動,車"
                         furigana="じ,どう,しゃ"
                         romaji="jidōsha" %}
{%- include japanese.html word="に" romaji="ni" %}
{%- include japanese.html word="乗り,込む"
                         furigana="の,こ"
                         romaji="norikomu"
                         furigana-align="left"
                         furigana-left-padding="5px,7px" %}
("to get into the automobile"):

```html
<blockquote>
  <div style="align-items: baseline; display: inline-flex;">
    <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
      <ruby lang="ja">
        自
        <rp>(</rp>
        <rt>じ</rt>
        <rp>)</rp>
        動
        <rp>(</rp>
        <rt>どう</rt>
        <rp>)</rp>
        車
        <rp>(</rp>
        <rt>しゃ</rt>
        <rp>)</rp>
      </ruby>
      <rt>jidōsha</rt>
    </ruby>
    <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
      に
      <rt>ni</rt>
    </ruby>
    <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
      <span style="display: inline-flex;">
        <ruby lang="ja">
          乗
          <rp>(</rp>
          <rt>の</rt>
          <rp>)</rp>
          り
        </ruby>
        <ruby lang="ja">
          込
          <rp>(</rp>
          <rt>こ</rt>
          <rp>)</rp>
          む
        </ruby>
      </span>
      <rt>norikomu</rt>
    </ruby>
  </div>
</blockquote>
```

<blockquote>
  <div class="japanese-hero">
    <div style="align-items: baseline; display: inline-flex;">
      <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
        <ruby lang="ja">
          自
          <rp>(</rp>
          <rt>じ</rt>
          <rp>)</rp>
          動
          <rp>(</rp>
          <rt>どう</rt>
          <rp>)</rp>
          車
          <rp>(</rp>
          <rt>しゃ</rt>
          <rp>)</rp>
        </ruby>
        <rt>jidōsha</rt>
      </ruby>
      <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
        に
        <rt>ni</rt>
      </ruby>
      <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
        <span style="display: inline-flex;">
          <ruby lang="ja">
            乗
            <rp>(</rp>
            <rt>の</rt>
            <rp>)</rp>
            り
          </ruby>
          <ruby lang="ja">
            込
            <rp>(</rp>
            <rt>こ</rt>
            <rp>)</rp>
            む
          </ruby>
        </span>
        <rt>norikomu</rt>
      </ruby>
    </div>
  </div>
</blockquote>

Well, it seems that annotations do not really understand italics; they look a
tiny bit off, don't they? It would be nice to be able to nudge them a bit to
the right on an individual character basis.

Luckily, this is a simple matter of just adding in some [`text-align`][]
styling in the `<rt>` tags:

```html
<blockquote>
  <div style="...">
    <ruby lang="ja" style="...">
      <ruby lang="ja">
        自
        <rp>(</rp>
        <rt style="text-align: right;">じ</rt>
        <rp>)</rp>
        <!-- ... -->
      </ruby>
      <rt>jidōsha</rt>
    </ruby>
    <!-- ... -->
  </div>
</blockquote>
```

<blockquote>
  <div class="japanese-hero">
    <div style="align-items: baseline; display: inline-flex;">
      <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
        <ruby lang="ja">
          <span>
          自
          </span>
          <rp>(</rp>
          <rt style="text-align: right;">じ</rt>
          <rp>)</rp>
          <span>
          動
          </span>
          <rp>(</rp>
          <rt style="text-align: right;">どう</rt>
          <rp>)</rp>
          <span>
          車
          </span>
          <rp>(</rp>
          <rt style="text-align: right;">しゃ</rt>
          <rp>)</rp>
        </ruby>
        <rt>jidōsha</rt>
      </ruby>
      <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
        に
        <rt>ni</rt>
      </ruby>
      <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
        <span style="display: inline-flex;">
          <ruby lang="ja">
            乗
            <rp>(</rp>
            <rt style="text-align: right;">の</rt>
            <rp>)</rp>
            り
          </ruby>
          <ruby lang="ja">
            込
            <rp>(</rp>
            <rt style="text-align: right;">こ</rt>
            <rp>)</rp>
            む
          </ruby>
        </span>
        <rt>norikomu</rt>
      </ruby>
    </div>
  </div>
</blockquote>

This looks a tiny bit better, though it seems to be more effective for single
character _furigana_ than those for compound characters. Pushing the _furigana_
any further to the right would involve adding some [`padding-left`][] attributes
to the `<rt>` tag (which could push the _kanji_ into places you may not want),
so feel free to experiment on getting the alignment just right for your tastes.

Finally, let's just confirm the markup works for some exceptional circumstances.

## Long and Short _Furigana_

There are some words in Japanese where up to five syllables can be represented
by a single _kanji_. Let's use the markup with _uketamawaru_ a word that fits
these conditions, and means "to be told" or "to receive (an order)":

```html
<ruby lang="ja" style="display: inline-flex; flex-direction: column;">
  <ruby lang="ja">
    承
    <rp>(</rp>
    <rt>うけたまわ</rt>
    <rp>)</rp>
    る
  </ruby>
  <rt>uketamawaru</rt>
</ruby>
```

<div class="japanese-hero">
  <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
    <ruby lang="ja">
      承
      <rp>(</rp>
      <rt>うけたまわ</rt>
      <rp>)</rp>
      る
    </ruby>
    <rt>uketamawaru</rt>
  </ruby>
</div>

I think this display is _okay_, given the awkwardness of the _furigana_
to _kanji_ ratio. But, that gap between 承 and る just seems too big to me, and
makes me wonder whether allowing for more flexibility in the size of the
_furigana_ annotation would make it less unwieldy.

Let's see what happens if we give the _furigana_ a smaller absolute CSS
[`font-size`][] value:

```html
<ruby lang="ja" style="display: inline-flex; flex-direction: column;">
  <ruby lang="ja">
    承
    <rp>(</rp>
    <rt style="font-size: small;">うけたまわ</rt>
    <rp>)</rp>
    る
  </ruby>
  <rt>uketamawaru</rt>
</ruby>
```

<div class="japanese-hero">
  <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
    <ruby lang="ja">
      承
      <rp>(</rp>
      <rt style="font-size: small;">うけたまわ</rt>
      <rp>)</rp>
      る
    </ruby>
    <rt>uketamawaru</rt>
  </ruby>
</div>

Much better, I think, and it can be adjusted to preference on a per-character
basis.

Now, what about the opposite scenario, when there are more _kanji_ than
_furigana_ characters? This will only really happen with so-called
[Special Readings][], which occur frequently with geographical or human names.
So, let's try the markup with a good example of this, the surname _Hozumi_:

```html
<ruby lang="ja" style="display: inline-flex; flex-direction: column;">
  <ruby lang="ja">
    八月一日
    <rp>(</rp>
    <rt>ほずみ</rt>
    <rp>)</rp>
  </ruby>
  <rt>Hozumi</rt>
</ruby>
```

<div class="japanese-hero">
  <ruby lang="ja" style="display: inline-flex; flex-direction: column;">
    <ruby lang="ja">
      八月一日
      <rp>(</rp>
      <rt>ほずみ</rt>
      <rp>)</rp>
    </ruby>
    <rt>Hozumi</rt>
  </ruby>
</div>

I think this display of ほずみ[^6] looks fine. The spacing of the _furigana_ may
look a bit strange, but since there is no correlation between the annotation and
the pronunciation of each individual _kanji_, having them spread out evenly
across the top of the word, or center-aligned, is probably the most logical way
to display them.

## Markup Reuse

As you can see from the chunky markup blocks above, annotations can take up
a lot of coding space. Personally, I do not want to have to manually write
`<ruby>` tags every time I want to insert a Japanese word with any kind of
annotation into my blog posts, so I wanted a way to reuse that markup.

[Jekyll][] is the engine that currently powers this blog, and it allows the
usage of [Liquid][], a templating language, which has enabled me to put `<ruby>`
code into functions that take parameters to fine-tune how annotations should
display. These functions are littered throughout the [code for this blog
post][], as well as other Japanese language-related posts, and fall into two
main groups.

### Basic Ruby Tags

These are functions that wrap around `<ruby>` tags for purposes of general
annotation, and are not specific to Japanese (though they can certainly be used
that way). Some examples used in this blog post that you may have noticed are:

```liquid
{%- raw -%}
{% include ruby.html word="phonetically" annotation="fuh·neh·ti·kuh·lee" %}
{% include ruby.html word="pronunciation" annotation="/pɹəˌnʌn.siˈeɪ.ʃən/" %}
{% include ruby.html word="車" annotation="くるま" %}
{% endraw -%}
```

### Ruby Tags for Japanese

There are also functions that take in parameters which allow all the fine-tuning
customisations to _furigana_ and _romaji_ we have seen in the examples above,
and are hence specific for use with Japanese. Under the hood, they all leverage
the `{% raw %}{% include ruby.html %}{% endraw %}` function. Some examples used
in this post are:

```liquid
{%- raw -%}
{% include japanese.html word="自,動,車"
                         furigana="じ,どう,しゃ"
                         romaji="jidōsha" %}
{% include japanese.html word="に" romaji="ni" %}
{% include japanese.html word="乗り,込む"
                         furigana="の,こ"
                         romaji="norikomu"
                         furigana-align="left"
                         furigana-left-padding="5px,7px" %}
{% endraw -%}
```

Going through the details of these functions is something I will leave up to the
interested reader[^7]. You can find all the code in the
[`_includes/` directory][] of this blog's codebase.

## Much Ado About Annotations

For such small text, the coding, display, debugging, and
[refactoring][Code Refactoring] of _furigana_ has taken up a significant amount
of my time and brain space. However, I still do not _really_ know if I am doing
it "right".

The developers over at the [Japanese Language Stack Exchange][], whom I assume
are experts at all things Japanese for the web, would seem to eschew `<rp>` and
`<rt>` tags for `<span>` tags in order to represent `<rt>` and `<rb>` values for
their cool _furigana_ pop-ups:

```html
<ruby title="" class="ruby-rp popups" style="...">
  <span class="rb">終幕</span>
  <span class="rt" style="...">さいご</span>
</ruby>
```

However, [NHK Easy News][] _does_ use `<ruby>` and `<rt>` tags in the same way
as the examples in this post. However, they, too, have opted to not use `<rp>`
tags (perhaps they considered them to be legacy/unnecessary...?).

[Yahoo News Japan][] does not support _furigana_ annotations at all, preferring
instead to display `<rp>`-style parenthesised _kanji_ readings inline (perhaps
because they are a bit [Web 1.0][]-in-the-tooth, and still want to support
browsing on
{% include ruby.html word="[Galápagos phones][]"
                     annotation="ガラケー"
                     annotation-style="text-align: center" %},
which display pages using [cHTML][], a subset of HTML that [does not support
`<ruby>` tags][imode tag reference]).

Regardless, this post represents everything I think I know about _furigana_ for
the web, and now you know it, too. If new information comes up, or the
specification for use of `<ruby>`-related tags changes, I am definitely happy to
revise any content. If there is something I have missed, please reach out and
let me know!

[^1]: All Japanese character displays were confirmed to work as expected on
      [Google Chrome][]. So, if you use another browser, and explanations do not
      quite match the display, that would be why.

[^2]: _Hiragana_ is generally used for _furigana_, but you can also see
      _[katakana][]_ used to annotate some [surnames and place
      names][Furigana#Names], as well as convey [double meanings and linguistic
      puns][Furigana#Punning_and_double_meaning].

[^3]: Placed above when the _kanji_ is written left-to-right horizontally
      (_[yokogaki][]_), but placed to the right when written right-to-left
      vertically (_[tategaki][]_).

[^4]: Or, you could use a browser extension like [Rikaichan][] or [Rikaikun][],
      which display pop-up kanji readings and English translations when you
      mouse over them, making any lack of annotations irrelevant. For purposes
      of this post, we'll pretend they do not exist (I still absolutely
      recommend using them, though!).

[^5]: The name of which is from an old British typography type that had a height
      of 5.5 [points][point], and not to be confused with anything related to
      the [Ruby][] programming language.

[^6]: As well as {% include japanese.html word="ほずみ" romaji="Hozumi" %},
      八月一日 can be read as
      {% include japanese.html word="ほづみ" romaji="Hozumi" %},
      {% include japanese.html word="やぶみ" romaji="Yabumi" %}, and
      {% include japanese.html word="はっさく" romaji="Hassaku" %}.

[^7]: It was tough to keep my own interest up with Liquid since I found using
      it so frustrating, even after changing my mindset to thinking of it as
      ["smart HTML rather than dumb Ruby"][Multi-Dimensional and Associative
      Arrays in Shopify Liquid]. Nevertheless, I got what I wanted in the end
      after significant trial and error; hopefully, you can save yourself some
      time and irritation by using the code if you have similar use cases.

[A Person's Character (人という字は)]: https://www.paulfioravanti.com/blog/persons-character/
[brain dump]: https://en.wiktionary.org/wiki/brain_dump
[cHTML]: https://en.wikipedia.org/wiki/I-mode
[code for this blog post]: https://raw.githubusercontent.com/paulfioravanti/paulfioravanti.github.io/release/_posts/2022-06-25-flexbox-furigana.md
[Code Refactoring]: https://en.wikipedia.org/wiki/Code_refactoring
[Compound verbs]: https://www.wasabi-jpn.com/japanese-grammar/japanese-compound-verbs/
[CSS]: https://en.wikipedia.org/wiki/CSS
[CSS Ruby Annotation Layout Module]: https://www.w3.org/TR/css-ruby-1/
[Deprecation]: https://en.wikipedia.org/wiki/Deprecation
[Flexbox]: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
[`font-size`]: https://developer.mozilla.org/en-US/docs/Web/CSS/font-size
[Furigana]: https://en.wikipedia.org/wiki/Furigana
[Furigana#Names]: https://en.wikipedia.org/wiki/Furigana#Names
[Furigana#Punning_and_double_meaning]: https://en.wikipedia.org/wiki/Furigana#Punning_and_double_meaning
[Galápagos phones]: https://en.wikipedia.org/wiki/Gal%C3%A1pagos_syndrome#Mobile_phones
[Google Chrome]: https://www.google.com/chrome/
[hiragana]: https://en.wikipedia.org/wiki/Hiragana
[HTML]: https://en.wikipedia.org/wiki/HTML
[HTML spec for the `<ruby>` element]: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-ruby-element
[imode tag reference]: https://www.docomo.ne.jp/service/developer/make/content/browser/html/tag/
[`_includes/` directory]: https://github.com/paulfioravanti/paulfioravanti.github.io/tree/release/_includes
[inline CSS]: https://www.w3schools.com/html/html_css.asp
[Inlining Ruby Annotations]: https://www.w3.org/TR/css-ruby-1/#default-inline
[Japanese Language Stack Exchange]: https://japanese.stackexchange.com/
[Jekyll]: https://jekyllrb.com/
[kana]: https://en.wikipedia.org/wiki/Kana
[kanji]: https://en.wikipedia.org/wiki/Kanji
[katakana]: https://en.wikipedia.org/wiki/Katakana
[Kinpachi-sensei]: https://en.wikipedia.org/wiki/Kinpachi-sensei
[Liquid]: https://shopify.github.io/liquid/
[Markdown]: https://daringfireball.net/projects/markdown/
[Mozilla HTML documentation]: https://developer.mozilla.org/en-US/docs/Web/HTML
[Multi-Dimensional and Associative Arrays in Shopify Liquid]: https://ideawrights.com/shopify-associative-arrays/
[NHK Easy News]: https://www3.nhk.or.jp/news/easy/
[`padding-left`]: https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left
[point]: https://en.wikipedia.org/wiki/Point_(typography)
[`<rb>`]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rb
[Rikaichan]: https://addons.thunderbird.net/en-us/firefox/addon/rikaichan/
[Rikaikun]: https://chrome.google.com/webstore/detail/rikaikun/jipdnfibhldikgcjhfnomkfpcebammhp?hl=en
[romaji]: https://en.wikipedia.org/wiki/Romanization_of_Japanese
[`<rp>`]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rp
[`<rt>`]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rt
[`<rtc>`]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rtc
[`<ruby>`]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby
[Ruby]: https://www.ruby-lang.org/en/
[Ruby character]: https://en.wikipedia.org/wiki/Ruby_character
[`<span>`]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span
[Special Readings]: https://en.wikipedia.org/wiki/Kanji#Special_readings
[tategaki]: https://en.wikipedia.org/wiki/Horizontal_and_vertical_writing_in_East_Asian_scripts#Japanese
[`text-align`]: https://developer.mozilla.org/en-US/docs/Web/CSS/text-align
[W3 Ruby Annotation]: https://www.w3.org/TR/2001/REC-ruby-20010531/Overview.html.utf-8
[Web 1.0]: https://en.wikipedia.org/wiki/Web_2.0#Web_1.0
[Yahoo News Japan]: https://news.yahoo.co.jp/
[yokogaki]: https://en.wikipedia.org/wiki/Horizontal_and_vertical_writing_in_East_Asian_scripts#Japanese
