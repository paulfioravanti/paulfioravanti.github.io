---
title: "Thanks, Past-Me"
date: 2023-04-28 16:30 +1100
last_modified_at: 2023-07-24 17:17 1100
tags: meta blogging
narration_video_id: "8EX3aUYehNo"
header:
  image: /assets/images/2023-04-28/obama-medal.jpg
  image_description: "Obama gives medal to himself meme"
  teaser: /assets/images/2023-04-28/obama-medal.jpg
  overlay_image: /assets/images/2023-04-28/obama-medal-overlay.jpg
  overlay_filter: 0.4
excerpt: >
  Past-me wrote stuff down that benefited future-me.<br />
  Present-me needs to keep paying that forward.
---

{% include audio-narration-banner.html video-id=page.narration_video_id %}

After joining my last [Ruby on Rails][] project as a software developer, I
wanted to see if I could quickly deliver some easy wins before starting any more
difficult work. So, I decided to give my client's web application a "technical
audit".

I had done this kind of thing before on other Rails projects, but that had been
many years ago, and I can barely remember what I coded last week, let alone all
the steps on some check-list I wrote in the ancient past.

Luckily, past-me apparently had the enormous foresight to write up all the
steps he thought of in a post on a previous employer's blog:
_[Profile Your Future App][]_.

Some of the content is a bit outdated as of this writing, particularly with
regards to a few of the external services it references (which is unsurprising,
given the dynamic nature of tech), but I was able to leverage a good deal of the
post's content to improve the quality of the application I was working on,
without having to [reinvent the wheel][] (and maybe some other web developer
might, too).

So, thanks past-me, ya did good! As you figured stuff out, you wrote it down,
and it paid future dividends: a beneficial and repeatable process that anyone
can do for themselves.

That's it. That's the lesson. [Thanks for coming to my TED blog post][Thanks For
Coming To My TED Talk].

Now you, the guy writing this sentence: you reckon you can take your own advice
and keep this up?

## Happy 50th Postiversary

It has only taken over 5 years of writing, at the cracking average speed of less
than one post per month, but you are reading this blog's 50th post. In muted
celebration of this extremely modest achievement, I thought I'd mark the
occasion with a [retrospective][].

My initial reasons for attempting to kick-start a blog (after [failing once
before][Hello, Blog!]) were:

- Using it as a knowledge repository: get stuff out of my head and
  [persisted][Persistence] somewhere else, so I could "confidently forget" it
  until (maybe) future-me needed it again
- The intrinsic value of being able to share knowledge with others, in hopes
  that they, too, can benefit from it
- Get better at technical writing, and writing English in general
- Directly receive reputation-building [SEO][] "[link juice][]" for stuff I
  write, rather than just give it away for free to other third-party sites
  (though these days I guess all original content is just info-[chum][] to be
  ravenously devoured and digested as [training data][] by [AI][] [chatbots][],
  so who knows if creators will receive even a sip of whatever ends up
  substituting for link juice...)

How did all of that go? Below are the results of my _[Omphaloskepsis][]_ Report,
though the [TL;DR][] could be summed up with this tweet:

> "deeply disgusted to discover that in order to get good at a thing I have to
> do it badly first"
> &mdash; [Meg Elison][] ([@megelison][])

## What was Done Well

<div class="centered-image" style="width: 100%">
  <figure>
    <img src="/assets/images/2023-04-28/nils-gFeYSbDCJM0-unsplash.jpg"
         alt="man in black t-shirt and blue denim jeans riding motorcycle on road during daytime">
    <figcaption>
      Photo by
      <a href="https://unsplash.com/@ni_ls_h?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
        Nils
      </a>
      on
      <a href="https://unsplash.com/photos/gFeYSbDCJM0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
        Unsplash
      </a>
    </figcaption>
  </figure>
</div>

I'm going to consider "well" in the subjective: how I generally felt I
benefitted from writing the posts up to now. If I was going to attempt to
consider what was done well in the objective, then [all signs][Google
Analytics] would point toward a complete pivot to only ever writing about
[Doom on macOS][] in the future.

<div class="centered-image" style="width: 90%">
  <figure>
    <img src="/assets/images/2023-04-28/blog-page-views.jpg"
         alt="Google Analytics page views for my blog">
    <figcaption>
      Doomguy chugs more than his fair share of SEO juice
    </figcaption>
  </figure>
</div>

I may really like Doom, but I don't want to do that. So, I'd like to have a list
of positives for future-me to look back on: help keep my motivation up to
continue writing about potentially niche topics, especially when vanity metrics
show low levels of reach and impact for a particular post. Here's what I came up
with.

### Certificate of Participation

Framed against a digital wasteland of abandoned blogs, I give myself a light pat
on the back for demonstrating enough grit to actually ship fifty posts worth of
content to the internet.

There were plenty of times where I just did not want to start, or continue,
writing a post. Mustering up the enthusiasm, or summoning enough stubbornness,
to persevere in the face of any other reason I could think of, personally
beneficial or not, has been tough[^1].

I don't advocate continuing to pay [sunk costs][] where there is no benefit, but
even if no one reads this, or any of my other posts, I know I get at least some
kind of immediate fixed value from finishing a post (even if just a [dopamine][]
hit), and then hopefully some kind of variable value in the future (it gets
picked up by an [aggregator][], or future-me re-reads it etc).

Speaking of aggregators, these are the ones that picked up one or more of the
previous posts from this one, and provided nice spikes in readership (and some
warm fuzzies for me):

{: refdef:
  style="margin: auto; width: 50%; font-size: large; margin-bottom: 1rem;"
}
| Source                          | Links |
|:--------------------------------|------:|
| [Elixir Weekly][]               |     8 |
| [Elm Weekly][]                  |     3 |
| [Plover Blog][]                 |     3 |
| [Elixir Radar][]                |     1 |
| [GraphQL Weekly][]              |     1 |
| [Hacker News Blog Newsletter][] |     1 |
| [Ruby Weekly][]                 |     1 |
| [Test Automation Weekly][]      |     1 |
| **Total**                       |**18** |
{: refdef}

Two of the Elixir Weekly links are from the same article, but in different
newsletters, giving a hit rate of about 34% of the posts being apparently
deemed worthy enough to share widely: not a huge number at all, but I'll take it
over zero!

### Idea Pipeline

In order to combat the classic "I don't know what to write about" problem, that
serves as a convenient escape hatch to avoid expending any effort at all, I made
sure to create an easily accessible place where ideas could be stored, as close
as possible to the time they appear. I use [Trello][] boards and cards for this,
but any tool, digital or physical, would work fine.

An idea may just be the title of a post, a theme, keywords, random thoughts, or
a fully fleshed out plan: whatever information happens to come to hand, it goes
in the idea bucket. I may not action an idea at the time it materialises, or in
the next few months, or even ever, but they are there to be referenced whenever
it comes time to put text to web page.

Forgetting some ideas, because I did not put them anywhere when they came up,
was painful enough that even if I am in the middle of doing something else, I
will make sure to put _something_ down to follow up later. So, there is never an
issue with _what_ to write about, just the hard stuff about _how_ to allocate
the time and effort to actually do the work.

### Deep Diving

Writing about certain topics forced me to attempt to _really_ learn about them
in detail. No self-imposed deadlines meant I would often happily abseil down
every rabbit hole I encountered, and attempt to be as thorough as possible in
surfacing information for posts.

This could sometimes make writing a post feel like maintaining a long running
[Git branch][] in a codebase. All the voluminous information editing, shuffling,
and moulding needed in order to attempt to create a coherent narrative could be
taxing, and there were many times where I just wanted a post to hurry up and end
so I could finally move on to something else.

However, the goals of making a post a [one and done][] exercise, and future-me's
single point of reference for a topic[^2], enabled me to keep trudging forward,
even when it ended up taking months of preparation. Most importantly, especially
given the effort expended, I'm happy overall with the way that the posts have
turned out, even the ones that were so niche that their audiences were tiny[^3].

### Stories and Narratives

Many of my posts have revolved around explaining the processes of how to use
some kind of technology, show off a thing, or provide some kind of subjective
advice. As well as scratching an itch, justifying the time and effort it takes
to write these kinds of posts is easy within the context of being relevant to my
profession or interests, and helping out future-me.

However, I have also found great benefit in writing posts that just tell a
straight story. These posts[^4] never really get much traction in analytics ---
I guess they are not considered as "useful" as how-to guides --- but as well as
being personally fulfilling to write, I believe they have helped lift the
narrative quality of other posts.

Obviously, I never set out to write boring or dry content, but I do feel that
writing stories has been able to positively influence the structure and
word smithing of other more prescriptive posts, and make them more interesting
to read (or, at least it has for present-me looking back on them).

So, in an attempt to get better at writing, and improve my blog "voice", I plan
to pepper in more story-based posts to counterbalance the hardcore
technical-based ones.

### Blog Tinkering

Software nerds love to tinker, and this blog has provided ample opportunities
for that. From changing the theme, setting up and integrating a mailing list,
and overriding [Jekyll][] templates to get pages looking _just_ the way I want
them to.

The (sometimes painful) journeys that making those changes took me on either
[became posts][Jekyll posts], or are in my idea pipeline for future posts,
creating a [virtuous circle][] of content generation. Jekyll may not be the
coolest blog kid on the block, but there are enough people using it that someone
out there will have a similar problem to one that a post addresses, making its
creation worthwhile.

### Guest Posting

Although I mentioned earlier about wanting to keep SEO link juice to myself,
there are times where I think it is worth giving it away to get your work in
front of an audience you do not have, yet want to reach, in order to accomplish
some goal.

Back in 2021, I reached out to [ZSA][] to ask if they would consider supporting
[QMK stenography keys][] in their [Oryx][] keyboard configurator. I hoped that
by doing so, the barrier to entry to use [stenography][] on their popular
keyboards could be significantly lowered, encouraging more people to give it a
try.

I showed them my _[Starting Stenography with an Ergodox][]_ post, which led to
collaborating with the ZSA team over the following few months during
development of the feature, and culminated in writing its announcement post:
_[Stenography with ZSA Keyboards: A Tutorial][]_.

That whole process was a lot of work, potentially benefitted(?) a for-profit
company, no compensation was asked or offered, and, of course, I get no direct
link juice (though I did make sure to relevantly link as many of my own posts in
it as possible without being spammy [I hope...]). But, getting steno out into
the minds and hands of a wider audience than I ever could by myself was the
overarching goal, and I think it succeeded there, making the whole exercise
worthwhile. I am also proud of the end result, and collaborating with the ZSA
team was a really great experience.

I do see doing something like this as the exception, rather than the rule,
though. I have been approached by other organisations about writing for-pay
articles for their blogs based on what they have read here (which, in itself, is
flattering). But, the numbers offered just do not personally justify the sheer
amount of effort required for creating what I consider a good technical post
(not just the writing, but likely also development of complimenting assets like
working software programs and videos etc).

This means I would rather not get paid, and keep a post on my blog in order to
maintain ownership, than sell it for some [going rate][]. I definitely consider
this a luxury[^5].

## What could be Done Better

<div class="centered-image" style="width: 100%">
  <figure>
    <img src="/assets/images/2023-04-28/matthew-henry-kX9lb7LUDWc-unsplash.jpg"
         alt="grayscale photogaphy of man sitting on concrete bench">
    <figcaption>
      Photo by
      <a href="https://unsplash.com/@matthewhenry?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
        Matthew Henry
      </a>
      on
      <a href="https://unsplash.com/photos/kX9lb7LUDWc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
        Unsplash
      </a>
    </figcaption>
  </figure>
</div>

Not everything in the competitive and glamorous world of writing personal blog
posts is glowing praise and fawning over your words. Things can go wrong,
opportunities are potentially missed, and sometimes unwitting self-sabotage
takes place.

Here is a selection of points where I am cognisant of some kind of shortcoming,
though I am sure there are more I have just not noticed (feel free to bring any
others to my attention).

### Cadence and Releasing

I write posts on a very sporadic schedule. Regardless of having an idea
pipeline, my urge and ability to write fluctuated significantly: some months I
would be blessed with periods of extended [flow][], and be able to release up to
three posts --- others, zero (and sometimes that drought could last for many
months, like the massive gap between this post and the previous one).

On those months where I was able to write multiple posts, in my rush to get
them out the digital door and off my plate, I would sometimes release them on
consecutive days, giving the initially-released post no room to "breathe" before
the next one barreled through. I do not have any evidence that this resulted in
either post losing any short-term readership, but I think there may be the
potential for that. Therefore, I do not intend to do releases in quick
succession again, unless there is a compelling reason to do so.

Much like I have an inbound idea pipeline that stacks up and waits for me to
action them, I now understand that having an outbound post pipeline is just as
important, in order to give the impression of having some sort of cadence, and
buy me time when flow is in short supply.

### Promotion

When I release a post, my next item of business is to try and get people to read
it. I currently do this by:

- writing out a short message to send to my mailing list members
- posting links to social media: specifically, [Twitter][], [LinkedIn][], and
  [Facebook][]

Different kinds of posts seem to resonate with people on different platforms:
tech posts seem to get more traction on Twitter (aggregators are especially more
likely to pick them up if they are hashtagged correctly), while personal stories
get more interaction on Facebook, where people tend to know me personally.

Promoting to these places has generally been fine, but I wonder whether I am
missing out on promotion opportunities by not also aiming at more specific
targets like relevant [Reddit][] subreddits, [Slack][]/[Discord][] communities,
LinkedIn groups, or maybe even [Hacker News][].

I am sure many of these communities will have their own rules and etiquette
around sharing self-serving content, possibly including being a regularly
contributing community member (or maybe they just outright ban it). I do not
want to come off as a spammer or leech, so I will have to overcome my laziness
and figure out if any avenues are open to me here, and pick ones that seem the
most appropriate.

Regarding the mailing list, it is very subtly shown on the page, and although
options like having some [modal window][] pop up and shove it in your face are
available (something that apparently has been shown to increase conversions), I
know I hate them, so I will assume you do as well, and, therefore, that is not
something I would consider.

### Theming

This blog currently uses a theme: [Minimal Mistakes][]. I have benefitted
significantly from having it, as it takes care of all the stuff I am not good
at, like design. However, much like all sites that use themes, this blog looks
really similar, if not the same, as other sites that also use the same theme.

This issue is not hugely painful for me right now, since I am more focused on
just writing content, but it would be nice for this site to have at least a bit
more of a unique skin. I do feed myself by creating websites after all, but my
viewpoint on this blog using a framework (Jekyll) and theme has been "why
re-create the (blog framework/[CMS][]-shaped) wheel when I can leverage the good
work of others?". Maybe I just need to do some more interesting customisations
within this sandbox before investing the time and effort in doing a re-write.

### Voice

As an experiment, I decided to try adding voice narration to some of my posts.
Personally, I got a kick out of doing them, but their [YouTube][] metrics would
seem to indicate that they have been greeted mostly with crickets[^6].

This is not surprising at all, and matches the expectations I had for it. By all
accounts it is a failed experiment, but regardless of that, I am going to keep
doing it.

Aside from it being fun, I did get some feedback from a non-native English
speaking peer, who said they used them for listening practice, which I was
thrilled by! It just goes to show that your users will consume your content in
ways that you will not expect!

### Monetisation

Every time I look at the "Pages and screens" report on [Google Analytics][], I
always see, for every page, a display of "**Total revenue: $0.00**".

[Google][] _knows_ I do not have ads on any of my pages, so it could choose to
just _not_ display this information, but it does anyway. Of course, this has the
likely intended effect of making me think that Google sees some wasted
potential, and perhaps I _could_ make some pocket money from my posts, even if
just the Doom for macOS one.

However, consulting my blog bible, _[Technical Blogging, Second Edition][]_,
helped give me some clarity by providing a bunch of tips that brought my
monetisation ponderings crashing straight back to earth, including this one that
stops me dead in my tracks:

> Don’t place ads on your blog until you have at least 10,000 pageviews per
> month.

My best single page is but a tenth of that, with the rest not even worth a
mention. Even if I did reach that goal, the risk/reward ratio of running ads,
particularly against a technical audience, would seem to skew heavily towards
continuing to blog just for fun, which is fine by me.

## Actions for Improvement

<div class="centered-image" style="width: 80%">
  <figure>
    <img src="/assets/images/2023-04-28/alayna-tam-xmIrHafFlP0-unsplash.jpg"
         alt="person in yellow hoodie sitting on rock near lake and snow covered mountain during daytime">
    <figcaption>
      Photo by
      <a href="https://unsplash.com/@alayna_michelle?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
        Alayna Tam
      </a>
      on
      <a href="https://unsplash.com/photos/xmIrHafFlP0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
        Unsplash
      </a>
    </figcaption>
  </figure>
</div>

After all this reflection, I think the best actions I can take for improvement
are the following, in order of priority and immediate impact:

- Space out post releases by _at least_ a week
- Establish a regular blogging habit, plan for once a month
- Attempt to submit a post to at least one social network I have not used before
- Increase the ratio of narrative-based posts
- Maybe consider revamping the site, if I have nothing better to do...

Here's hoping that it yields results of some kind. Did I miss anything? I love
feedback, so let me know!

[^1]: This post was started on September 9, 2022, and has been one of the
      grindiest posts so far: delayed for some good reasons, but also
      procrastinated on for a bunch of excuses. Self-reflection is quite hard,
      it would seem. But, I made a pact with myself: I cannot proceed with any
      other post, no matter how interesting or timely, until this one gets out
      the door.

[^2]: Except for the times I would write about the same tech in
      [multiple][Using Python’s Bitcoin libraries in Elixir]
      [languages][Using C++ Bitcoin libraries in Elixir]... or when some tech
      went through a major [version][Connecting Elm to Phoenix 1.3]
      [upgrade][Connecting Elm to Phoenix 1.4 with webpack]... or when
      writing about [two][Speak at a Meetup] [sides][Organise a Meetup] of the
      same topic... or when the topic was just too big and needed to be split
      [into][Internationalisation with Phoenix LiveView]
      [multiple][Internationalisation with Phoenix LiveComponents]
      [parts][Internationalisation with Phoenix Live Layouts]... so, I made
      peace with embracing the meta, and allowing the posts to
      [rhyme][It's Like Poetry, They Rhyme] sometimes.

[^3]: There were times where I would want to make changes to a post after
      publishing, from minor typo fixes to more major updates involving
      significant amounts of content. So, even if I was not happy with a post,
      just because it is on the internet, does not mean it cannot be iterated
      on (however, I tend to consider posts with audio narration, like this one,
      frozen in time upon release so that voice and text always match). Anyone
      actually interested in seeing what a post looked like on its first release
      can just trawl through the [blog's commit history][].

[^4]: Posts like _[A Person's Character (人という字は)][]_, _[Mum's Meetup][]_,
      and _["Welcome back"][]_.

[^5]: Which sounds very lofty; more realistically, though, the first-world
      problem is likely to be that the going rate is just not high enough for
      me, nor others I know who work in information technology that have their
      own blogs and share this view. This is also probably reflective of my
      limitations as a writer: if I was faster at generating content, and could
      pump out articles easily and naturally, then the time spent to going rate
      compensation ratio might look more enticing.

[^6]: As of this writing, the top narration performer has a whopping 7 plays,
      while the least popular one languishes at 0 plays.

[A Person's Character (人という字は)]: https://www.paulfioravanti.com/blog/persons-character/
[aggregator]: https://en.wikipedia.org/wiki/News_aggregator
[AI]: https://en.wikipedia.org/wiki/Artificial_intelligence
[blog's commit history]: https://github.com/paulfioravanti/paulfioravanti.github.io/commits/release
[chatbots]: https://en.wikipedia.org/wiki/Chatbot
[chum]: https://en.wiktionary.org/wiki/chum#Etymology_2
[CMS]: https://en.wikipedia.org/wiki/Content_management_system
[Connecting Elm to Phoenix 1.3]: https://www.paulfioravanti.com/blog/elm-phoenix-13/
[Connecting Elm to Phoenix 1.4 with webpack]: https://www.paulfioravanti.com/blog/elm-phoenix-14-webpack/
[Discord]: https://discord.com/
[Doom on macOS]: https://www.paulfioravanti.com/blog/classic-doom-mac/
[dopamine]: https://en.wikipedia.org/wiki/Dopamine#Reward
[Elixir Radar]: https://elixir-radar.com/
[Elixir Weekly]: https://elixirweekly.net/
[Elm Weekly]: https://www.elmweekly.nl/
[Facebook]: https://www.facebook.com/
[flow]: https://en.wikipedia.org/wiki/Flow_(psychology)
[Git branch]: https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell
[going rate]: https://en.wiktionary.org/wiki/going_rate
[Google]: https://www.google.com/
[Google Analytics]: https://analytics.google.com/
[GraphQL Weekly]: https://www.graphqlweekly.com/
[Hacker News]: https://news.ycombinator.com/
[Hacker News Blog Newsletter]: https://hnblogs.substack.com/
[Hello, Blog!]: https://www.paulfioravanti.com/blog/hello-blog/
[Internationalisation with Phoenix LiveView]: https://www.paulfioravanti.com/blog/internationalisation-phoenix-liveview/
[Internationalisation with Phoenix LiveComponents]: https://www.paulfioravanti.com/blog/internationalisation-phoenix-live-components/
[Internationalisation with Phoenix Live Layouts]: https://www.paulfioravanti.com/blog/internationalisation-phoenix-live-layouts/
[It's Like Poetry, They Rhyme]: https://www.youtube.com/watch?v=yFqFLo_bYq0
[Jekyll]: https://jekyllrb.com/
[Jekyll posts]: https://www.paulfioravanti.com/tags/jekyll/
[link juice]: https://www.woorank.com/en/edu/seo-guides/link-juice
[LinkedIn]: https://www.linkedin.com/in/paulfioravanti/
[Meg Elison]: https://twitter.com/megelison/status/1549788560756281345?ref_src=twsrc%5Etfw
[@megelison]: https://twitter.com/megelison
[Minimal Mistakes]: https://mmistakes.github.io/minimal-mistakes/
[modal window]: https://en.wikipedia.org/wiki/Modal_window
[Mum's Meetup]: https://www.paulfioravanti.com/blog/mums-meetup/
[Omphaloskepsis]: https://en.wikipedia.org/wiki/Navel_gazing
[one and done]: https://english.stackexchange.com/a/345796/23058
[Organise a Meetup]: https://www.paulfioravanti.com/blog/organise-meetups/
[Oryx]: https://configure.zsa.io/
[Persistence]: https://en.wikipedia.org/wiki/Persistence_(computer_science)
[Plover Blog]: http://plover.stenoknight.com/
[Profile Your Future App]: https://reinteractive.com/posts/304-profile-your-future-app
[QMK stenography keys]: https://github.com/qmk/qmk_firmware/blob/master/docs/feature_stenography.md#keycode-reference-idkeycode-reference
[Reddit]: https://www.reddit.com/
[reinvent the wheel]: https://en.wikipedia.org/wiki/Reinventing_the_wheel
[retrospective]: https://en.wikipedia.org/wiki/Retrospective#Software_development
[Ruby on Rails]: https://rubyonrails.org/
[Ruby Weekly]: https://rubyweekly.com/
[SEO]: https://en.wikipedia.org/wiki/Search_engine_optimization
[Slack]: https://slack.com/
[Speak at a Meetup]: https://www.paulfioravanti.com/blog/speak-at-meetups/
[Starting Stenography with an Ergodox]: https://www.paulfioravanti.com/blog/starting-stenography-ergodox/
[stenography]: https://en.wikipedia.org/wiki/Stenotype
[Stenography with ZSA Keyboards: A Tutorial]: https://blog.zsa.io/2107-steno-tutorial/
[sunk costs]: https://en.wikipedia.org/wiki/Sunk_cost
[Thanks For Coming To My TED Talk]: https://knowyourmeme.com/memes/thanks-for-coming-to-my-ted-talk
[Technical Blogging, Second Edition]: https://pragprog.com/titles/actb2/technical-blogging-second-edition/
[Test Automation Weekly]: #
[TL;DR]: https://www.merriam-webster.com/dictionary/TL%3BDR
[training data]: https://en.wikipedia.org/wiki/Training,_validation,_and_test_data_sets#Training_data_set
[Trello]: https://trello.com/
[Twitter]: https://twitter.com/paulfioravanti
[Using C++ Bitcoin libraries in Elixir]: https://www.paulfioravanti.com/blog/c-plus-plus-bitcoin-libraries-elixir/
[Using Python’s Bitcoin libraries in Elixir]: https://www.paulfioravanti.com/blog/python-bitcoin-libraries-elixir/
[virtuous circle]: https://www.dictionary.com/browse/virtuous-circle
["Welcome back"]: https://www.paulfioravanti.com/blog/welcome-back-overwork/
[YouTube]: https://www.youtube.com/
[ZSA]: https://www.zsa.io/
