---
title: "Plover For the Record"
date: 2021-08-08 19:00 +1100
last_modified_at: 2021-08-08 19:00 +1100
tags: plover stenography court-reporting q-and-a
header:
  image: /assets/images/2021-07-25/ace-attorney-cosplay.jpg
  image_description: "Ace Attorney Cosplay"
  teaser: /assets/images/2021-07-25/ace-attorney-cosplay.jpg
  overlay_image: /assets/images/2021-07-25/ace-attorney-cosplay.jpg
  overlay_filter: 0.7
  caption: >
    Image by [William Tung](https://www.flickr.com/photos/28277470@N05/) from [Flickr](https://www.flickr.com/photos/28277470@N05/17049616945/in/album-72157651718557466/)
excerpt: >
  Want to try recording legal testimony with just your computer keyboard?
  With Plover, court is in session.
tagline: >
  <div class="steno-transcript-tagline">
    <span>
      BY MR. BIG-SHOT LAWYER:<br />
      &nbsp;&nbsp;&nbsp;&nbsp;Q&nbsp;&nbsp;&nbsp;&nbsp;You can record testimony with your computer keyboard?<br />
      &nbsp;&nbsp;&nbsp;&nbsp;A&nbsp;&nbsp;&nbsp;&nbsp;Yes. With Plover, court is in session.<br />
    </span>
  </div>
---

Dictation testing involving cross-examination of a witness by lawyers in a
courtroom is known colloquially in the [court reporting][court reporter]
profession as "[Q&A][]" (Question and Answer).

With [Plover][] open source [stenography][], you can [cosplay][] as a court
reporter, show off your ability to track the communication threads of multiple
participants in a courtroom conversation, and present them in official-looking
transcripts of testimony.

### _[Caveat Lector][]_

I am not a lawyer, a court reporter, nor involved in the legal profession
whatsoever. I am just a stenography enthusiast who learned about the concept of
Q&A while studying [Platinum Steno][]'s (PS) [video theory lessons][Platinum
Steno Theory playlist] (more about that in my other blog post,
_[Going Platinum][]_), and what is presented here is just my interpretation
of what I discovered.

Plover theory itself does not contain any [outlines][Learn Plover! Glossary]
related to Q&A like the ones that would seem to be contained in PS's custom
software, and are taught in their [Q&A lessons][Platinum Steno Lesson 27 QA].
So, in order to actively engage in those lessons, I wondered if I could attempt
to recreate PS's Q&A outline entries (including their formatting conventions and
rules, which may be specific to them, and differ between courts in different
hierarchies/states/jurisdictions/countries etc) in a custom dictionary that
would work with Plover.

The [TL;DR][] is that I think I was able to, with the result presented
_[pro bono publico][]_ in the form of [my custom Q&A dictionary][Paul's Q&A
dictionary]. Feel free to incorporate it into your own Plover dictionaries and
give the Q&A lessons a shot, or just use it to follow along with the examples
in this post!

Armed with a dictionary to use, let's learn how to actually use it while
getting an introduction to Q&A itself!

## _[Ab Initio][]_

There are, broadly, two different types of Q&A testing:

- **2-Voice**: an interrogative conversation between two participants: a lawyer
  and a witness. The lawyer can be either for the plaintiff/prosecution or for
  the defense, but this detail is usually not relevant to the scope of the
  conversation.
- **4-Voice**: a cross-examination involving a single lawyer from each opposing
  party, a witness, and the courtroom judge. Handling extra lawyers in either
  party is possible, so it's technically "4-to-6-Voice", but there are typically
  only four participants.

2-Voice transcripts typically read like a simple back-and-forth question and
answer session, while 4-Voice builds on this by including added complexity like:

- transcribing objections raised by lawyers, and subsequent guidance by the
  judge
- specific transcribing conventions for when interruptions occur during a
  lawyer's line of questioning, causing it to veer off its original path,
  and then the subsequent "steering" of the record back to original line of
  questioning once the detour has ended

We will start off with a deep dive into using Plover for 2-Voice, and then up
ante with 4-Voice.

## 2-Voice

During Q&A, whenever someone starts speaking, you indicate this by "signing them
in", either by name, or marking them as the asker or answerer of a question.

For 2-Voice, names are not important, and we only care about marking the
question and its answer. Questioners and answerers are "signed in" using special
outlines known as question and answer "banks", which PS defines as follows:

<table class="steno-table">
  <thead>
    <tr>
      <th>Stroke</th>
      <th style="text-align: center;">Outline</th>
      <th style="text-align: center;">Keymap</th>
    </tr>
  </thead>
  <tr>
    <td>Question Bank</td>
    <td class="steno-outline">
      <span>STKPWHR</span>
    </td>
    <td class="steno-font">
      <span>STKPWHR</span>
    </td>
  </tr>
  <tr>
    <td>Answer Bank</td>
    <td class="steno-outline">
      <span>-FRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>-FRPBLGTS</span>
    </td>
  </tr>
</table>

These outlines, like nearly all Q&A-related outlines, are not meant to be
phonetic, nor indicative of a word's spelling. I find it easiest to remember
their form, or pattern, kind of like [Tetris][] blocks. Hence, I would wager the
rectangular chunks here are meant to evoke an image of land masses along the
side of the `*`-key river that divides them.

Using these outlines, a simple question and answer could display as something
like the following:

<p class="steno-transcript">
  &nbsp;&nbsp;&nbsp;&nbsp;Q&nbsp;&nbsp;&nbsp;&nbsp;Where were you on the night
  of January 16?<br />
  &nbsp;&nbsp;&nbsp;&nbsp;A&nbsp;&nbsp;&nbsp;&nbsp;I was at home, practicing
  steno.
</p>

The formatting obeys the following rules:

- Questions are marked with a simple "<span class="steno-transcript">Q</span>",
  and answers with an "<span class="steno-transcript">A</span>" (no following
  colons or periods)
- <span class="steno-transcript">Q</span> and
  <span class="steno-transcript">A</span> have a [tab][tab key] character on
  either side of them
- Both questions and answers start with capital letters

Court transcripts would seem to be written using a
<span class="steno-transcript">[monospaced font][]</span>, so we will adopt that
convention as well, using the widely-available
<span class="steno-transcript">Courier New</span> font.

### Ending Punctuation

The one thing that is not apparent just by looking at the example above is the
convention around a speaker's _final sentence_ punctuation before another
speaker starts talking. Apparently, in Q&A, the addition of an ending question
mark (<span class="steno-transcript">?</span>) or period
(<span class="steno-transcript">.</span>) to the _final sentence_ spoken before
the speaker changes is meant to be handled by the outline that signs in the next
speaker.

For example, when you switch from a question to an answer by stroking
`-FRPBLGTS`, that outline is expected to:

- Finish the question with a "<span class="steno-transcript">?</span>"
- Perform a [line break][newline], insert a tab, type
  <span class="steno-transcript">A</span>, insert another tab, and make sure the
  next word will start with a capital letter

The rule is the same when switching from an answer back to a question, but with
an ending "<span class="steno-transcript">.</span>" and typing a
<span class="steno-transcript">Q</span>.

The reason that PS provides regarding this ending punctuation rule is that the
(presumably custom) software they use on their steno machines makes some kind of
automatic determination about whether what was said is a question or an answer,
and adds in punctuation it deems appropriate.

PS does say that this determination is not perfect, and hence you may end up
with question marks at the end of answers or periods that the end of questions
(which may be correct sometimes since lawyers can make statements, and witnesses
can ask questions). The workaround to this issue, it would seem, is to just fix
the punctuation _[post-hoc][]_ when you proofread your transcript.

Plover has no built-in knowledge of any kind of "Q&A-related ending punctuation
automatic determination", so I attempted to mostly replicate the PS software
logic into the custom Q&A dictionary, but also make a few quality-of-life
improvements. The aim was to provide sensible defaults for ending punctuation,
but also allow for manual overriding for when you want to explicitly specify
what they should be.

With that in mind, here is a set of outlines I came up with to perform 2-Voice
in a more flexible way:

<table class="steno-table">
  <thead>
    <tr>
      <th>Stroke</th>
      <th style="text-align: center;">Outline</th>
      <th style="text-align: center;">Keymap</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tr>
    <td>Default Question Bank</td>
    <td class="steno-outline">
      <span>STKPWHR</span>
    </td>
    <td class="steno-font">
      <span>STKPWHR</span>
    </td>
    <td>
      Ends previous witness sentence with
      "<span class="steno-transcript">.</span>"
    </td>
  </tr>
  <tr>
    <td>Initial Question Bank</td>
    <td class="steno-outline">
      <span>STKPWHR*</span>
    </td>
    <td class="steno-font">
      <span>STKPWHR*</span>
    </td>
    <td>
      Question is the first line of transcript; no previous sentence punctuation
      needed.
    </td>
  </tr>
  <tr>
    <td>Question Bank following question</td>
    <td class="steno-outline">
      <span>STKPWHR-F</span>
    </td>
    <td class="steno-font">
      <span>STKPWHR-F</span>
    </td>
    <td>
      Ends previous witness sentence with
      "<span class="steno-transcript">?</span>", for when witness asks a
      question.
    </td>
  </tr>
  <tr>
    <td>Interrupting Question Bank</td>
    <td class="steno-outline">
      <span>STKPWHR-RB</span>
    </td>
    <td class="steno-font">
      <span>STKPWHR-RB</span>
    </td>
    <td>
      Ends previous witness sentence with
      "<span class="steno-transcript">--</span>" for when lawyer interrupts
      witness.
    </td>
  </tr>
  <tr>
    <td>Question Bank following statement</td>
    <td class="steno-outline">
      <span>STKPWHR-R</span>
    </td>
    <td class="steno-font">
      <span>STKPWHR-R</span>
    </td>
    <td>
      Ends previous witness sentence with
      "<span class="steno-transcript">.</span>" (same as Default Question Bank,
      added for completeness' sake)
    </td>
  </tr>
  <tr>
    <td>Default Answer Bank</td>
    <td class="steno-outline">
      <span>-FRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>-FRPBLGTS</span>
    </td>
    <td>
      Ends previous lawyer sentence with
      "<span class="steno-transcript">?</span>"
    </td>
  </tr>
  <tr>
    <td>Answer Bank following statement</td>
    <td class="steno-outline">
      <span>R-FRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>R-FRPBLGTS</span>
    </td>
    <td>
      Ends previous sentence with "<span class="steno-transcript">.</span>",
      for when lawyer makes a statement.
    </td>
  </tr>
  <tr>
    <td>Interrupting Answer Bank</td>
    <td class="steno-outline">
      <span>WR-FRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>WR-FRPBLGTS</span>
    </td>
    <td>
      Ends previous sentence with "<span class="steno-transcript">--</span>"
      for when witness interrupts lawyer.
    </td>
  </tr>
  <tr>
    <td>Answer Bank following question</td>
    <td class="steno-outline">
      <span>H-FRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>H-FRPBLGTS</span>
    </td>
    <td>
      Ends previous sentence with "<span class="steno-transcript">?</span>"
      (same as Default Answer Bank, added for completeness' sake)
    </td>
  </tr>
</table>

Some further notes on this set of outlines:

- In Q&A, sentences would seem to only ever end in question marks, periods, or
  dashes. No exclamation marks, or any other type of punctuation, would seem to
  be used, so I did not create any outlines using them
- No Initial Answer Bank outline was created since it would seem that there are
  never answers given without a question in Q&A
- If you are following along with
  [my custom Q&A dictionary][Paul's Q&A dictionary], you may notice that tabs
  and newline characters in the entries use the special `\t` and `\n`
  characters, rather than [Plover keyboard shortcuts][Plover Keyboard Shortcuts]
  like `{#tab}` and `{#return}`. For example, the entry for the Default Question
  Bank:

  `"STKPWHR": "{.}{^\n^}{^\t^}{^Q^}{^\t^}{-|}"`

  This is done simply to allow the use of the `*` key to undo the entire entry,
  as keyboard shortcuts cannot be undone. More information about this in
  Plover's documentation on [Undoable Line Breaks and Tabs][Plover Undoable Line
  Breaks and Tabs]

### Demos

In order to show my Q&A dictionary in action, I have recorded a few videos of
myself attempting to transcribe some of PS's initial Q&A lessons.

The following video of PS's very first Q&A lesson, so the conversation is quite
straightforward. One thing to note, though, is that it begins with the
questioner making a statement, necessitating use of the `R-FRPBLGTS` outline.

<div style="width: 80%; margin: 0 auto;">
  {% include video id="f3TQJidRIbU" provider="youtube" %}
  <figcaption style="text-align: center;">
    Transcript:
    <a href="https://docs.google.com/document/d/1JymsW65Q2joKCSJxNd5HS4mOX6TznrN77fGRnJKrM6o/edit?usp=sharing">
      Platinum Steno Theory Lesson 27 Q&A #1
    </a>
  </figcaption>
</div>

> See [Appendix A: Formatting the Record][] for how I set up [Google Docs][] to
> produce official-looking(?) court transcripts.

## Appendix A: Formatting the Record

If I was going to attempt these Q&A exercises, I figured that I should at least
also make an effort to make the resulting transcriptions feel somewhat
professional, and mimic the official-looking transcripts PS provides for
reference.

I chose [Google Docs][] to do this due to its accessibility to everyone, but I
am sure that you could recreate something similar on your favourite text editor
if you wanted.

Aside from the font and text-spacing formatting rules mentioned earlier in the
post, the court transcripts required for PS's lessons also need to obey the
following rules:

- Sentences must be double-spaced
- There should be a header with the document name
- There should be a footer with the page number
- Line numbers must be visible on the page, with a maximum 25 lines per page
- Line numbers must restart on each page
- Line numbers must be added all the way to the end of the page, even
  if there is text only part-way through the page

Fulfilling all the formatting requirements in Google Docs necessitated the
following settings:

- **Line Spacing**: Format Menu > Line & paragraph spacing > Double
- **Font**
  - Choose <span class="steno-transcript">Courier New</span> from the font
    dropdown menu
  - Choose a size of 12.5 (this size and the line-spacing combination will, for
    the most part, ensure that you will have 25 lines per page)
- **Header**:
  - Insert Menu > Headers and footers > Header
  - Manually type in the document name
- **Footer**: Insert Menu > Page Numbers > Choose visual option that puts the
  page number on the bottom right-hand side of the document
- **Indentations**: Left Indent: 0.5cm, Right Indent: 15.5cm
- **Line Numbers**:
  - Not built in to Google Docs, and hence requires the free
    [Line Numbers for Google Docs plugin][] (if the plugin is not available on
    the Google Chrome Store, follow [these instructions][Line Numbers for Google
    Docs Installation instructions] to install it)
  - Once installed, refresh your page and you should see its icon added to the
    top right section of your Google Docs page. Click on it to bring up the
    Line Numbering format menu
  - **Numbering**:
    - Check Show Numbering
    - Check Restart Each Page
    - Check Count by Blank Lines
  - **Style**:
    - Size: 12
    - Color: 000000

Once you have done all of the above, you should have something approximating
what I have in my documents. Feel free to further change and customise as you
wish!

> Wondering where that cool steno keyboard font came from? Go get it from
> [Kathy][]'s [Steno Display Font Github repository][]!

[Ab Initio]: https://en.wikipedia.org/wiki/Ab_initio
[Appendix A: Formatting the Record]: #appendix-a-formatting-the-record
[Caveat Lector]: https://en.wikipedia.org/wiki/Caveat_emptor#Caveat_lector
[cosplay]: https://en.wikipedia.org/wiki/Cosplay
[court reporter]: https://en.wikipedia.org/wiki/Court_reporter
[Going Platinum]: https://www.paulfioravanti.com/blog/going-platinum/
[Google Docs]: https://docs.google.com/
[Kathy]: https://github.com/Kaoffie
[Learn Plover! Glossary]: https://sites.google.com/site/learnplover/glossary
[Line Numbers for Google Docs plugin]: https://linenumbers.app/#/?id=line-numbers-for-google-docs
[Line Numbers for Google Docs Installation instructions]: https://github.com/Line-Numbers-for-Google-Docs/chrome-extension/issues/33#issuecomment-894842650
[monospaced font]: https://en.wikipedia.org/wiki/Monospaced_font
[newline]: https://en.wikipedia.org/wiki/Newline
[Paul's Q&A dictionary]: https://github.com/paulfioravanti/steno_dictionaries/blob/main/dictionaries/q-and-a.json
[Platinum Steno]: https://platinumsteno.com/
[Platinum Steno Lesson 27 QA]: https://www.youtube.com/watch?v=tEgaJ7hWIvg&list=PL85Y9t9lANyArY9uTBE_kmy2cT_ECSHvU&index=61
[Platinum Steno Theory Lesson 27 Q&A #1]: https://docs.google.com/document/d/1JymsW65Q2joKCSJxNd5HS4mOX6TznrN77fGRnJKrM6o/edit?usp=sharing
[Platinum Steno Theory playlist]: https://www.youtube.com/playlist?list=PL85Y9t9lANyArY9uTBE_kmy2cT_ECSHvU
[Plover]: http://www.openstenoproject.org/
[Plover Keyboard Shortcuts]: https://github.com/openstenoproject/plover/wiki/Dictionary-Format#keyboard-shortcuts
[Plover Undoable Line Breaks and Tabs]: https://github.com/openstenoproject/plover/wiki/Dictionary-Format#undoable-line-breaks-and-tabs
[post-hoc]: https://en.wikipedia.org/wiki/Post_hoc
[pro bono publico]: https://en.wikipedia.org/wiki/Pro_bono
[Q&A]: http://ilovesteno.com/2014/02/03/the-different-types-of-q-a/
[Steno Display Font Github repository]: https://github.com/Kaoffie/steno_font
[stenography]: https://en.wikipedia.org/wiki/Stenotype
[Tab key]: https://en.wikipedia.org/wiki/Tab_key
[Tetris]: https://en.wikipedia.org/wiki/Tetris
[TL;DR]: https://en.wikipedia.org/wiki/Wikipedia:Too_long;_didn%27t_read

[Plover Steno on an Ergodox EZ (50 WPM) link]: https://youtu.be/f3TQJidRIbU
[Plover Steno on an Ergodox EZ (50 WPM) img]: http://img.youtube.com/vi/f3TQJidRIbU/0.jpg
