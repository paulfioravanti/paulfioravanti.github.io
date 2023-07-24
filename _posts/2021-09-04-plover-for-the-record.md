---
title: "Plover For the Record"
date: 2021-09-04 17:00 +1100
last_modified_at: 2023-07-24 16:36 +1100
tags: plover stenography court-reporting q-and-a cosplay georgi
header:
  image: /assets/images/2021-09-04/ace-attorney-cosplay.jpg
  image_description: "Ace Attorney Cosplay"
  teaser: /assets/images/2021-09-04/ace-attorney-cosplay.jpg
  overlay_image: /assets/images/2021-09-04/ace-attorney-cosplay.jpg
  overlay_filter: 0.7
  caption: >
    Photo by [William Tung](https://www.flickr.com/photos/28277470@N05/) from [Flickr](https://www.flickr.com/photos/28277470@N05/17049616945/in/album-72157651718557466/)
badges:
  - image: https://img.shields.io/badge/Plover%20Blog-Sep%2006%202021-5F7F78.svg
    alt: "Plover Blog September 06, 2021"
    link: http://plover.stenoknight.com/2021/09/plover-for-legal-material.html
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

So, put on your power suit and pack your briefcase, cause we're going to go and
act like we belong in the halls of justice!

### _[Caveat Lector][]_

I am not a lawyer, a court reporter, nor involved in the legal profession
whatsoever. I am just a stenography enthusiast who learned about the concept of
Q&A while studying [Platinum Steno][]'s (PS) [video theory lessons][Platinum
Steno Theory playlist] (more about that in my other blog post,
_[Going Platinum][]_), and what is presented here is just my interpretation
of what I discovered. Consequently, there is definitely a chance that I have
gotten some things wrong, and if I have, please reach out via public comment
below, or to me directly.

Plover theory itself does not contain any [outlines][Learn Plover! Glossary]
related to Q&A like the ones that would seem to be contained in PS's custom
software, and are taught in their [Q&A lessons][Platinum Steno Lesson 27 QA].
So, in order to actively engage in those lessons, I wondered if I could attempt
to recreate PS's Q&A outline entries (including their formatting conventions and
rules, which may be specific to them, and differ between courts in different
hierarchies/states/jurisdictions/countries etc) in a custom dictionary that
would work with Plover.

I think I was able to, and have presented the result _[pro bono publico][]_ in
the form of:

:sparkles: [My custom Q&A dictionary][Paul's Q&A dictionary] :sparkles:

Feel free to incorporate it into your own Plover dictionaries and
give the Q&A lessons a shot, or just use it to follow along with the examples
in this post!

Armed with a dictionary to use, let's learn how to use it, while getting an
introduction to Q&A itself!

## _[Ab Initio][]_

There are, broadly, two different types of Q&A testing:

- **2-Voice**: an interrogative conversation between two participants: a lawyer
  and a witness. The lawyer can be either for the [plaintiff][]/prosecution, or
  for the defense, but this detail is usually not relevant to the scope of the
  conversation.
- **4-Voice**: a cross-examination involving lawyers from each opposing party, a
  witness, and the courtroom judge. Handling multiple lawyers in either party is
  possible, so it can technically be "4-to-6-Voice", but there are typically
  only four participants.

2-Voice transcripts typically read like a simple back-and-forth question and
answer session, while 4-Voice builds on this by including added complexity like:

- marking a lawyer's "ownership" of a line of questioning
- transcribing objections raised by lawyers, and subsequent guidance by the
  judge
- specific transcribing conventions for when interruptions occur during a
  lawyer's line of questioning, causing it to veer off its original path,
  and then the subsequent "steering" of the record back to original line of
  questioning once the detour has ended

We will start off with a deep dive into using Plover for 2-Voice, and then up
ante with 4-Voice.

## 2-Voice

<div class="plover-for-the-record-image">
  <figure>
    <img src="/assets/images/2021-09-04/phoenix-and-maya.jpg"
         alt="Phoenix Wright and Maya cosplay" />
    <figcaption>
      Photo by
      <a href="https://www.deviantart.com/vivienovo">
        VivianOVO
      </a>
      on
      <a href="https://www.deviantart.com/vivienovo/art/Ace-Attorney-Maya-Fey-347872629">
        Deviant Art
      </a>
    </figcaption>
  </figure>
</div>

During Q&A, whenever someone starts speaking, you indicate this by "signing them
in", either by name, or marking them as the asker or answerer of a question.

For 2-Voice, names are not important, and we only care about marking the
question and its answer. Questioners and answerers are "signed in" using special
outlines known as question and answer "banks", which PS defines as follows:

<table class="steno-table">
  <thead>
    <tr>
      <th>Stroke</th>
      <th class="centered-heading">Outline</th>
      <th class="centered-heading">Keymap</th>
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
[phonetic][Phonetics] (indicative of how the word sounds), nor
[orthographic][Orthography] (indicative of how the word is spelled). So, I find
it easiest to remember their form, or pattern, kind of like [Tetris][] blocks.
Hence, I would wager the rectangular chunks here are meant to evoke an image of
land masses along the side of the middle `*`-key river that divides them.

Using these outlines, a simple question and answer could display as something
like the following:

<p class="steno-transcript">
  &nbsp;&nbsp;&nbsp;&nbsp;Q&nbsp;&nbsp;&nbsp;&nbsp;Where were you on the night
  of January 16?<br />
  &nbsp;&nbsp;&nbsp;&nbsp;A&nbsp;&nbsp;&nbsp;&nbsp;I was at home, practicing
  steno.
</p>

This formatting obeys the following rules:

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
speaker starts talking.

Apparently, in Q&A, the addition of an ending question mark
(<span class="steno-transcript">?</span>) or period
(<span class="steno-transcript">.</span>) to the _final sentence_ spoken before
the speaker changes is meant to be handled by the outline that signs in the next
speaker.

For example, when you switch from a question to an answer by stroking
`-FRPBLGTS`, that outline is expected to:

- Finish the question with a "<span class="steno-transcript">?</span>"
- Perform a [line break][newline]
- insert a tab
- type <span class="steno-transcript">A</span>
- insert another tab
- make sure the next word will start with a capital letter

The rule is the same when switching from an answer back to a question, but with
an ending "<span class="steno-transcript">.</span>" and a beginning
<span class="steno-transcript">Q</span>.

Regarding this ending punctuation rule, PS says that the (presumably custom)
software they use on their steno machines makes some kind of automatic
determination about whether a question was asked or an answer given, and adds in
appropriate question/answer punctuation as it deems appropriate.

PS does say that this determination is not perfect, and hence you may end up
with question marks at the end of answers, or periods that the end of questions
(which may be correct for the sentence sometimes since lawyers can make
statements, and witnesses can ask questions). The workaround to this issue, it
would seem, is to just fix the punctuation _[post-hoc][]_ when you proofread
your transcript.

Plover itself has no built-in knowledge of any kind of "Q&A-related ending
punctuation automatic determination functionality", so I attempted to mostly
replicate the PS software logic into my custom Q&A dictionary, but also make a
few quality-of-life improvements. The aim was to provide sensible defaults for
ending punctuation, but also allow for manual overriding for when you want to
explicitly specify what they should be.

With that in mind, here is a set of outlines I came up with to perform 2-Voice
in a more flexible way:

<table class="steno-table">
  <thead>
    <tr>
      <th>Stroke</th>
      <th class="centered-heading">Outline</th>
      <th class="centered-heading">Keymap</th>
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
- I chose the `H-` and `-F` keys to delineate ending questions since they are
  on the higher steno row, indicating the typical upward voice inflection of a
  spoken question, and vice versa for the `R-` and `-R` keys for statements
- I chose `-RB` for an ending dash as it marks the "sh" sound in the Plover
  "dash" outline (`TK-RB`), and use of `WR-` is just a mirror reflection of that
- No Initial Answer Bank outline was created since it would seem that there are
  never answers given without a question in Q&A
- If you are following along with
  [my custom Q&A dictionary][Paul's Q&A dictionary], you may notice that tabs
  and newline characters in the entries use the special `\t` and `\n`
  characters, rather than [Plover keyboard shortcuts][Plover Keyboard Shortcuts]
  like `{#tab}` and `{#return}`. For example, the entry for the Default Question
  Bank:

  `"STKPWHR": "{.}{^\n\t^}{^Q^}{^\t^}{-|}"`

  This is done simply to enable undoing the entire entry in one keystroke. Using
  Plover keyboard shortcuts makes what the `*` key can undo significantly less
  predictable.

  More details about the reasons behind this can be found in Plover's
  documentation on
  [Undoable Line Breaks and Tabs][Plover Undoable Line Breaks and Tabs], and
  more details about all those other characters in the entry can be found in
  [Plover's Dictionary Format][] documentation.

### 2-Voice Demos

In order to show my Q&A dictionary in action, I have recorded a few videos of
myself attempting to transcribe some of PS's initial Q&A lessons. Don't expect
stellar steno speeds (or much competence at all) in the videos below as I am
still learning :sweat_smile:

The letters on the light board behind the instructor indicate who is currently
speaking:

- **P**: Plaintiff/Prosecution
- **W**: Witness
- **C**: The Court (the Judge)
- **D**: Defense

There will be more variation in these lights once we get into 4-Voice.

The following video is of PS's very first Q&A lesson, so the conversation is
quite straightforward and slow. One thing to note, though, is that it begins
with the questioner making a statement, necessitating use of the `R-FRPBLGTS`
outline.

<div class="steno-video">
  {% include video id="xpJNxsOjFZs" provider="youtube" %}
  <figcaption>
    Transcript:
    <a href="https://docs.google.com/document/d/1JymsW65Q2joKCSJxNd5HS4mOX6TznrN77fGRnJKrM6o/edit?usp=sharing">
      Platinum Steno Theory Lesson 27 Q&A #1
    </a>
  </figcaption>
</div>

> See [Appendix A: Formatting the Record][] for how I set up [Google Docs][] to
> produce official-looking(?) court transcripts.

This next video is more of the same, but note that when the witness is asked to
spell their name, a technique called "stitching" is used. As apposed to
[fingerspelling][], stitching deliberately separates letters with dashes to
indicate that a speaker is verbally spelling out a word letter by letter.

<div class="steno-video">
  {% include video id="y-RBNZCvQLM" provider="youtube" %}
  <figcaption>
    Transcript:
    <a href="https://docs.google.com/document/d/1NGcSJzptb7JiIB0VYg-Cv-zCHtONjtdJDgtXsMNY2J4/edit?usp=sharing">
      Platinum Steno Theory Lesson 28 Q&A #2
    </a>
  </figcaption>
</div>

> See [Appendix B: Stitching][] for more about stitching, and the custom
> dictionary I created for it.

In the next video, note the use of the `STKPWHR-F` outline when the witness asks
the lawyer a question, and `R-FRPBLGTS` for when the lawyer answers.

<div class="steno-video">
  {% include video id="xl7xyRHTErY" provider="youtube" %}
  <figcaption>
    Transcript:
    <a href="https://docs.google.com/document/d/1AFuxkNO26ooOVC4zEnDHsi_CWlkOfcPuVp5nyZ8CQJY/edit?usp=sharing">
      Platinum Steno Theory Lesson 29 Q&A #3
    </a>
  </figcaption>
</div>

In the final 2-Voice demo, note the use of the `STKPWHR-RB` outline when the
lawyer interrupts the witness.

<div class="steno-video">
  {% include video id="6MwMO76V_zA" provider="youtube" %}
  <figcaption>
    Transcript:
    <a href="https://docs.google.com/document/d/1cTU4qt0HjiGPXOBd4eN-u9nkMpJAw1CWCaa53MXucn8/edit?usp=sharing">
      Platinum Steno Theory Lesson 30 Q&A #4
    </a>
  </figcaption>
</div>

Now that we have gotten the general rules of questioning and answering down, it
is time to up the ante and introduce more _[dramatis personae][]_ to the
conversation.

## 4-Voice

<div class="plover-for-the-record-image" style="width: 90%;">
  <figure>
    <img src="/assets/images/2021-09-04/ace-attorney-courtroom-judge.jpg"
         alt="Phoenix, Franziska, and Judge" />
    <figcaption>
      Photo by
      <a href="https://www.deviantart.com/mandyneko">
        MandyNeko
      </a>
      on
      <a href="https://www.deviantart.com/mandyneko/art/Phoenix-Wright-Case-3-5-210215863">
        Deviant Art
      </a>
    </figcaption>
  </figure>
</div>

Courtroom cross-examination of a witness involves more than just a single
legal team, but also the opposing side's legal team, and the court itself. We
are now beyond being able to sign in a speaker with just
<span class="steno-transcript">Q</span> and
<span class="steno-transcript">A</span>: we need to give the speakers names.

So, let's introduce the expanded cast of characters in our courtroom drama with
their designated outlines:

<table class="steno-table">
  <thead>
    <tr>
      <th>Person</th>
      <th class="centered-heading">Outline</th>
      <th class="centered-heading">Keymap</th>
      <th>Output</th>
      <th class="limited-width-heading">Notes</th>
    </tr>
  </thead>
  <tr>
    <td>Plaintiff Lawyer 1</td>
    <td class="steno-outline">
      <span>STPHAO</span>
    </td>
    <td class="steno-font">
      <span>STPHAO</span>
    </td>
    <td>
      <span class="steno-transcript">MR. STPHAO</span>
    </td>
    <td>
      Known as "Mr. Snoo"
    </td>
  </tr>
  <tr>
    <td>Plaintiff Lawyer 2</td>
    <td class="steno-outline">
      <span>SKWRAO</span>
    </td>
    <td class="steno-font">
      <span>SKWRAO</span>
    </td>
    <td>
      <span class="steno-transcript">MR. SKWRAO</span>
    </td>
    <td>
      Known as "Mr. Screw"
    </td>
  </tr>
  <tr>
    <td>The Court</td>
    <td class="steno-outline">
      <span>STPHAOEUFPLT</span>
    </td>
    <td class="steno-font">
      <span>STPHAOEUFPLT</span>
    </td>
    <td>
      <span class="steno-transcript">THE COURT</span>
    </td>
    <td>
    </td>
  </tr>
  <tr>
    <td>Defense Lawyer 1</td>
    <td class="steno-outline">
      <span>EUFPLT</span>
    </td>
    <td class="steno-font">
      <span>EUFPLT</span>
    </td>
    <td>
      <span class="steno-transcript">MR. EUFPLT</span>
    </td>
    <td>
      Known as "Mr. Ifpelt"
    </td>
  </tr>
  <tr>
    <td>Defense Lawyer 2</td>
    <td class="steno-outline">
      <span>EURBGS</span>
    </td>
    <td class="steno-font">
      <span>EURBGS</span>
    </td>
    <td>
      <span class="steno-transcript">MR. EURBGS</span>
    </td>
    <td>
      Known as "Mr. Irbs"
    </td>
  </tr>
  <tr>
    <td>Witness</td>
    <td class="steno-outline">
      <span>W-PBS/W-PBS</span>
    </td>
    <td class="steno-font">
      <span>W-PBS W-PBS</span>
    </td>
    <td>
      <span class="steno-transcript">THE WITNESS</span>
    </td>
    <td>
      This is PS's designated outline
    </td>
  </tr>
  <tr>
    <td>Witness</td>
    <td class="steno-outline">
      <span>SKWRAOEURBGS</span>
    </td>
    <td class="steno-font">
      <span>SKWRAOEURBGS</span>
    </td>
    <td>
      <span class="steno-transcript">THE WITNESS</span>
    </td>
    <td>
      This is my personal alternative outline
    </td>
  </tr>
</table>

Some further notes on this set of outlines:

- The pronounced "names" for each of the lawyers ("Mr. Snoo" etc) come from
  PS, and would seem to indicate the colloquial way they are referred to based
  on the literal steno pronunciation of the outline
- In Q&A, it is apparently rare to have multiple lawyers on any legal team, so
  you will mostly be using "Mr. Snoo" and "Mr. Ifpelt", but the full set of
  outlines is included in the custom Q&A dictionary for completeness' sake
- Since lawyers are humans, and humans typically have names that are not
  <span class="steno-transcript">MR. STPHAO</span>, the output of the lawyer
  outlines can be considered placeholders. Before a Q&A exercise starts, if you
  are given the lawyer names, you can just do a simple text find-and-replace in
  the Q&A dictionary to change <span class="steno-transcript">MR. STPHAO</span>
  to <span class="steno-transcript">MS. WEXLER</span> etc where appropriate. The
  outlines for the judge and witness are never given specific names
- The formatting for the output of all of these outlines is uppercase. What is
  not shown above, but will be shown in an extract below, is that a tab is
  output before the name, and then a colon and a space is output following the
  name
- Plover theory has already assigned the word "irks" to Defense Lawyer 2's
  `EURBGS` outline. So, _[Caveat Utilitor][]_ that if you use the Q&A outline,
  you will be mildly inconvenienced by needing to stroke the word "irks" as
  `EURBG/-S` or `EURBG/-Z`
- PS's witness outline of `W-PBS/W-PBS` felt a bit awkward to me, given the
  shapes of the other outlines, and having to stroke the same outline twice. The
  "lower row version" of The Court outline, `SKWRAOEURBGS`, was not assigned to
  anything in Plover, so it made sense to me to assign it to the witness: the
  judge sits on the "high" bench, and the witness sits in the "low" dock. Both
  sets of outlines are included in the custom Q&A dictionary, so feel free to
  use whichever outline works for you
- Like the question and answer bank outlines, each outlines above comes with a
  set of variations that marks it as the first line of the transcript, or ends
  the previous sentence with a period, question mark, or dash. Check out the
  custom dictionary itself for all those details

This is quite a lot to take in, so let's have a look at an example that uses
the new outlines above, the question/answer ones we have already seen, and one
we will have a look at later:

<p class="steno-transcript">
  BY MR. CHAMBERS:<br />
  &nbsp;&nbsp;&nbsp;&nbsp;Q&nbsp;&nbsp;&nbsp;&nbsp;All right. Miss Smith, where
  do you currently live?<br />
  &nbsp;&nbsp;&nbsp;&nbsp;A&nbsp;&nbsp;&nbsp;&nbsp;1892 Spring Drive in
  Riverside.<br />
  &nbsp;&nbsp;&nbsp;&nbsp;Q&nbsp;&nbsp;&nbsp;&nbsp;Did you live at that address
  in July of 2018?<br />
  &nbsp;&nbsp;&nbsp;&nbsp;A&nbsp;&nbsp;&nbsp;&nbsp;Yes, sir.<br />
  &nbsp;&nbsp;&nbsp;&nbsp;MR. DUGO: Your Honor, I am having a difficult time
  hearing the witness.<br />
  &nbsp;&nbsp;&nbsp;&nbsp;THE COURT: Miss Smith, I know it is tough, but have
  got to keep your voice up a little bit. It is hard to hear in this courtroom,
  okay?<br />
  &nbsp;&nbsp;&nbsp;&nbsp;THE WITNESS: Yes, your Honor.
</p>

- The first line, <span class="steno-transcript">BY MR. CHAMBERS</span>, is a
  byline, and indicates that the lawyer Mr. Chambers is in charge of, or owns,
  the current line of questioning: his questions are marked by
  <span class="steno-transcript">Q</span> and the witness's answers are marked
  by <span class="steno-transcript">A</span>. We will look more at bylines
  next up
- The next few lines are standard Q&A that we have seen before, which use the
  question and answer bank outlines
- On line 6, the opposing lawyer, Mr. Dugo, interrupts the line of questioning.
  Mr. Dugo does not own the line of questioning, so he does not get a byline,
  but instead his statement is recorded inline. From this point, we have veered
  off the current line of questioning
- On line 7, the judge addresses the witness, with the question also recorded
  inline
- On line 8, the witness answers the question. An answer sign-in using
  <span class="steno-transcript">A</span> only occurs when the witness answers
  a question posed by the lawyer who owns the current line of questioning. Since
  the witness is answering the judge's question, and not a question posed by
  Mr. Chambers, it is recorded inline as
  <span class="steno-transcript">THE WITNESS</span>. Whenever a witness talks
  out of turn without being asked a question, or is not directing an answer at
  the lawyer who owns the line of questioning (like at the judge here, or at the
  opposing lawyer), witness statements are recorded in this way

### Bylines

<div class="plover-for-the-record-image" style="width: 70%;">
  <figure>
    <img src="/assets/images/2021-09-04/briefcase-battle.jpg"
         alt="Phoenix Wright and Miles Edgeworth briefcase battle cosplay" />
    <figcaption>
      Photo by
      <a href="https://www.deviantart.com/kazzu">
        KaZzu
      </a>
      on
      <a href="https://www.deviantart.com/kazzu/art/Briefcase-Battle-80339570">
        Deviant Art
      </a>
    </figcaption>
  </figure>
</div>

Bylines are used to indicate the lawyer that owns, or is in charge of, the
current line of questioning to a witness. The outline that signs in a lawyer
outputs in the following format:

<p class="steno-transcript">
  BY &lt;TITLE&gt;. &lt;SURNAME&gt;:<br />
  &nbsp;&nbsp;&nbsp;&nbsp;Q&nbsp;&nbsp;&nbsp;&nbsp;&lt;cursor&gt;
</p>

It would seem that the convention is to output the lawyer's title and surname,
all in capital letters, and then output a question bank to kick off
cross-examination. Like specific naming in outlines mentioned earlier,
witnesses and judges also do not get bylines.

Whenever the lawyer begins questioning, they are signed in with a byline. If
they finish questioning, and a lawyer from the opposing legal team begins
questioning, they are signed in separately. If, as you saw in the transcript
above, a line of questioning is interrupted, when it re-begins again, the same
lawyer gets re-signed in.

Here is a set of outlines that can be used for the bylines of Plaintiff Lawyer 1
and Defense Lawyer 1 (check the custom Q&A dictionary for details of the other
lawyers, but they follow the same pattern):

<table class="steno-table">
  <thead>
    <tr>
      <th>Stroke</th>
      <th class="centered-heading">Outline</th>
      <th class="centered-heading">Keymap</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tr>
    <td>Plaintiff Lawyer 1 Initial Byline</td>
    <td class="steno-outline">
      <span>STPHAO*</span>
    </td>
    <td class="steno-font">
      <span>STPHAO*</span>
    </td>
    <td>
      Byline is the first line of transcript; no previous sentence punctuation
      needed.
    </td>
  </tr>
  <tr>
    <td>Plaintiff Lawyer 1 Byline following question</td>
    <td class="steno-outline">
      <span>STPHAO*F</span>
    </td>
    <td class="steno-font">
      <span>STPHAO*F</span>
    </td>
    <td>
      Ends previous sentence with "<span class="steno-transcript">?</span>"
    </td>
  </tr>
  <tr>
    <td>Plaintiff Lawyer 1 Byline following statement</td>
    <td class="steno-outline">
      <span>STPHAO*R</span>
    </td>
    <td class="steno-font">
      <span>STPHAO*R</span>
    </td>
    <td>
      Ends previous sentence with "<span class="steno-transcript">.</span>"
    </td>
  </tr>
  <tr>
    <td>Plaintiff Lawyer 1 Byline following interruption</td>
    <td class="steno-outline">
      <span>STPHAO*RB</span>
    </td>
    <td class="steno-font">
      <span>STPHAO*RB</span>
    </td>
    <td>
      Ends previous sentence with "<span class="steno-transcript">--</span>"
    </td>
  </tr>
  <tr>
    <td>Defense Lawyer 1 Initial Byline</td>
    <td class="steno-outline">
      <span>*EUFPLT</span>
    </td>
    <td class="steno-font">
      <span>*EUFPLT</span>
    </td>
    <td>
      Byline is the first line of transcript; no previous sentence punctuation
      needed.
    </td>
  </tr>
  <tr>
    <td>Defense Lawyer 1 Byline following question</td>
    <td class="steno-outline">
      <span>H*EUFPLT</span>
    </td>
    <td class="steno-font">
      <span>H*EUFPLT</span>
    </td>
    <td>
      Ends previous sentence with "<span class="steno-transcript">?</span>"
    </td>
  </tr>
  <tr>
    <td>Defense Lawyer 1 Byline following statement</td>
    <td class="steno-outline">
      <span>R*EUFPLT</span>
    </td>
    <td class="steno-font">
      <span>R*EUFPLT</span>
    </td>
    <td>
      Ends previous sentence with "<span class="steno-transcript">.</span>"
    </td>
  </tr>
  <tr>
    <td>Defense Lawyer 1 Byline following interruption</td>
    <td class="steno-outline">
      <span>WR*EUFPLT</span>
    </td>
    <td class="steno-font">
      <span>WR*EUFPLT</span>
    </td>
    <td>
      Ends previous sentence with "<span class="steno-transcript">--</span>"
    </td>
  </tr>
</table>

## 4-Voice Demos

Now that you have been formally introduced to the cast of characters in our
courtroom drama, and how they interact with each other, let's see how that all
plays out in some video demos.

The first demo shows a basic 4-Voice example using the lawyer name placeholders.
Typically, you are given the lawyer names before beginning Q&A so you can
substitute them in.

Note the switching of bylines as each lawyer begins and ends their lines of
questioning. Also note that when the lawyers indicate that they have no further
questions, since that statement is not a question directed at the witness, it is
not transcribed with a <span class="steno-transcript">Q</span>, but as a named
statement under their own byline.

<div class="steno-video">
  {% include video id="vdQXdKy0im8" provider="youtube" %}
  <figcaption>
    Transcript:
    <a href="https://docs.google.com/document/d/1ggOzm94IAh5IRKLo14qdsvLnCHoBXoislsZitnF4xEQ/edit?usp=sharing">
      Platinum Steno Theory Lesson 31 Q&A #5
    </a>
  </figcaption>
</div>

The next video is more of the same, but actually using human names for the
lawyers.

<div class="steno-video">
  {% include video id="ccxfO0W96wA" provider="youtube" %}
  <figcaption>
    Transcript:
    <a href="https://docs.google.com/document/d/1gcfaP6JoHuu5u08zlapQqnDLA0aASk3iazaLQX0Rqko/edit?usp=sharing">
      Platinum Steno Theory Lesson 32 Q&A #6
    </a>
  </figcaption>
</div>

## [Adjournment _sine die_][]

There is more to learn about Q&A than I have been able to cover here, so if you
are interested in delving even deeper, I would highly recommend checking out the
following videos specifically from the [Platinum Steno Theory playlist][]:

- [Lesson 27 QA][Platinum Steno Lesson 27 QA]
- [Lesson 31][Platinum Steno Lesson 31]

The entire set of theory lessons is great, but if you want more information
specifically on Q&A, then I think these are the main two you want to watch.

Even if you are not planning on becoming a court reporter, I think that doing
these kinds of Q&A exercises is great dictation practice in general, and I can
see the ability to be able to manage conversation threads being applicable to
captioning other kinds of conversational interactions: re-assign the outlines
for lawyers, the judge, and the witness to panelists, an adjudicator, and the
audience, and you can now transcribe a debate!

If you end up giving it a try, and perhaps improve on the methods outlined here,
be sure to reach out!

> Wondering where that cool steno keyboard font came from? Go get it from
> [Kathy][]'s [Steno Display Font Github repository][]!

## UPDATE 25 November 2021: Immediate Responses

I am now at the stage where I have completed PS's [60WPM speed building video
list][] (it only took me _five_ months, and I still do not think I am at 60WPM;
the grind continues...), and during the Q&A exercises there were enough repeated
scenarios that came up that I felt a few new outlines were in order.

They all revolve around providing immediate output for common responses to a
<span class="steno-transcript">Q</span> or
<span class="steno-transcript">A</span> upon switching speakers.

### Witnesses

Some common words and phrases that begin an answer from witnesses are:

- Affirmative statements: "Yes.", "Yes, sir.", "Yeah.", "Correct.", "Right.",
  "Sure.", "Uh-huh."
- Negative statements: "No.", "No, sir."
- Unsure statements: "I don't know."

Being able to immediately output any of these after an
<span class="steno-transcript">A</span> would be really handy.

> Notice that all of the examples above are terminated with a period.
>
> According to PS, these initial statements in isolation are considered
> _the answer_ to a question, with any further statements being extraneous
> information or just further elaborative context.
>
> So, where you may write "Yes, I did." in standard English, in a legal
> transcript, this would instead be "Yes. I did." ([YMMV][])

Given the examples above, here is the set of new outlines that I added to
[my custom Q&A dictionary][Paul's Q&A dictionary] for use with a witness:

<table class="steno-table">
  <thead>
    <tr>
      <th>Stroke</th>
      <th class="centered-heading">Outline</th>
      <th class="centered-heading">Keymap</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tr>
    <td>"Yes." and elaborate</td>
    <td class="steno-outline">
      <span>KWR-FRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>KWR-FRPBLGTS</span>
    </td>
    <td>
      Derived from the <code>KWR</code> outline for the letter "Y" for "yes",
      then the answer bank.
    </td>
  </tr>
  <tr>
    <td>"Yes, sir." and elaborate</td>
    <td class="steno-outline">
      <span>SKWR-FRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>SKWR-FRPBLGTS</span>
    </td>
    <td>
      Derived from <code>KWR</code> with an inverted <code>S</code> to make
      <code>YS</code> for "yes, sir", then the answer bank.
    </td>
  </tr>
  <tr>
    <td>"Yeah." and elaborate</td>
    <td class="steno-outline">
      <span>KWREFRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>KWREFRPBLGTS</span>
    </td>
    <td>
      Derived from Plover's <code>KWR*E</code> outline for "yeah", then the
      answer bank.
    </td>
  </tr>
  <tr>
    <td>"Correct." and elaborate</td>
    <td class="steno-outline">
      <span>KR-FRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>KR-FRPBLGTS</span>
    </td>
    <td>
      Derived from Plover's <code>KREBGT</code> outline for "correct", then the
      answer bank.
    </td>
  </tr>
  <tr>
    <td>"Right." and elaborate</td>
    <td class="steno-outline">
      <span>TR-FRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>TR-FRPBLGTS</span>
    </td>
    <td>
      Derived from a truncated and inverted version of Plover's
      <code>RAOEUT</code> outline for "right", then the answer bank.
    </td>
  </tr>
  <tr>
    <td>"Sure." and elaborate</td>
    <td class="steno-outline">
      <span>SH-FRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>SH-FRPBLGTS</span>
    </td>
    <td>
      Derived from a truncated version of Plover's <code>SHUR</code> outline for
      "sure", then the answer bank.
    </td>
  </tr>
  <tr>
    <td>"Uh-huh." and elaborate</td>
    <td class="steno-outline">
      <span>HUFRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>HUFRPBLGTS</span>
    </td>
    <td>
      Awkwardly derived from Plover's <code>*U/H*U</code> outline for "uh-huh",
      then the answer bank.
    </td>
  </tr>
  <tr>
    <td>"No.", and elaborate</td>
    <td class="steno-outline">
      <span>TPH-FRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>TPH-FRPBLGTS</span>
    </td>
    <td>
      Derived from the <code>TPH</code> outline for the letter "N" for "no",
      then the answer bank.
    </td>
  </tr>
  <tr>
    <td>"No, sir.", and elaborate</td>
    <td class="steno-outline">
      <span>STPH-FRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>STPH-FRPBLGTS</span>
    </td>
    <td>
      Derived from <code>TPH</code> with an inverted <code>S</code> to make
      <code>NS</code> for "no, sir", then the answer bank.
    </td>
  </tr>
  <tr>
    <td>"I don't know.", and elaborate</td>
    <td class="steno-outline">
      <span>KWROEFRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>KWROEFRPBLGTS</span>
    </td>
    <td>
      Derived partly from Plover's <code>KWROEPB</code> outline for "I don't
      know", then the answer bank.
    </td>
  </tr>
</table>

Sometimes, the statements above are the only thing a witness says before the
lawyer begins the next question.

Therefore, I have also added complementary `*`-flagged outlines for each of the
examples above that instantly yield control back to the questioner once the
answer has been given, and output a new <span class="steno-transcript">Q</span>.

Here is a sample:

<table class="steno-table">
  <thead>
    <tr>
      <th>Stroke</th>
      <th class="centered-heading">Outline</th>
      <th class="centered-heading">Keymap</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tr>
    <td>"Yes." and yield control</td>
    <td class="steno-outline">
      <span>KWR*FRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>KWR*FRPBLGTS</span>
    </td>
    <td>
      <code>*</code>-flagged version of <code>KWR-FRPBLGTS</code>.
    </td>
  </tr>
  <tr>
    <td>"No.", and yield control</td>
    <td class="steno-outline">
      <span>TPH*FRPBLGTS</span>
    </td>
    <td class="steno-font">
      <span>TPH*FRPBLGTS</span>
    </td>
    <td>
      <code>*</code>-flagged version of <code>TPH-FRPBLGTS</code>.
    </td>
  </tr>
</table>

See the Q&A dictionary file for full set.

### Lawyers

For lawyers, things are a bit simpler. The only common phrases I have noticed
said after a witness answers are:

- Answer acknowledgements: "Okay.", "All right."
- Question versions of those acknowledgements: "Okay?", "All right?"

The question versions, being questions, will immediately yield control over to
the witness to answer. And so, here is a set of outlines for use with a lawyer:

<table class="steno-table">
  <thead>
    <tr>
      <th>Stroke</th>
      <th class="centered-heading">Outline</th>
      <th class="centered-heading">Keymap</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tr>
    <td>"Okay." and elaborate</td>
    <td class="steno-outline">
      <span>STKPWHR-BG</span>
    </td>
    <td class="steno-font">
      <span>STKPWHR-BG</span>
    </td>
    <td>
      Derived from the question bank, and then <code>-BG</code> for a "K" sound.
    </td>
  </tr>
  <tr>
    <td>"Okay?", and yield control</td>
    <td class="steno-outline">
      <span>STKPWHR*BG</span>
    </td>
    <td class="steno-font">
      <span>STKPWHR*BG</span>
    </td>
    <td>
      <code>*</code>-flagged version of <code>STKPWHR-BG</code>.
    </td>
  </tr>
  <tr>
    <td>"All right." and elaborate</td>
    <td class="steno-outline">
      <span>STKPWHR-RT</span>
    </td>
    <td class="steno-font">
      <span>STKPWHR-RT</span>
    </td>
    <td>
      Derived from the question bank, and then <code>-RT</code> for a truncated
      version of Plover's <code>RAOEUT</code> outline for "right".
    </td>
  </tr>
  <tr>
    <td>"All right?" and yield control</td>
    <td class="steno-outline">
      <span>STKPWHR*RT</span>
    </td>
    <td class="steno-font">
      <span>STKPWHR*RT</span>
    </td>
    <td>
      <code>*</code>-flagged version of <code>STKPWHR-RT</code>.
    </td>
  </tr>
</table>

As before, see [my custom Q&A dictionary][Paul's Q&A dictionary] file for these
details, and keep a periodic eye on it on Github as that is where I will make
any updates if more come to mind.

## UPDATE 23 December 2022: Addition of NCRA Default Speakers

Platinum Steno has publicly released their [Platinum Steno Theory Dictionary][],
which you can use with Plover (instructions on how to are [here][Going Platinum
Platinum Steno Dictionary Released]). Looking through the dictionary, you can
find the Q&A outlines used in the PS videos directly, but you may also notice
that there are similar outlines for people with other specific roles who may
end up speaking during court proceedings. They are:

- Videographer
- Court Reporter
- Clerk
- Bailiff

Outlines for these four roles are apparently provided by default in the theory
used by the [National Court Reporters Association][] (NCRA), and are hence
included in PS's dictionary. In the interest of completeness, I have also added
sets of outlines for those roles to [my Q&A dictionary][Paul's Markdown Q&A
dictionary] in two different flavours:

1. Outlines based on the NCRA outline for each individual role
2. Custom variations on `THE COURT` outline (`STPHAOEUFPLT`) for each role, with
   the reasoning being that since each of the four roles works with or for the
   Court, their outlines can be grouped together

### NCRA Outlines

<table class="steno-table">
  <thead>
    <tr>
      <th>Person</th>
      <th class="centered-heading">Outline</th>
      <th class="centered-heading">Keymap</th>
      <th>Output</th>
    </tr>
  </thead>
  <tr>
    <td>Videographer</td>
    <td class="steno-outline">
      <span>SREUD/SREUD</span>
    </td>
    <td class="steno-font">
      <span>SREUD/SREUD</span>
    </td>
    <td>
      <span class="steno-transcript">THE VIDEOGRAPHER</span>
    </td>
  </tr>
  <tr>
    <td>Court Reporter</td>
    <td class="steno-outline">
      <span>RORP/RORP</span>
    </td>
    <td class="steno-font">
      <span>RORP/RORP</span>
    </td>
    <td>
      <span class="steno-transcript">THE COURT REPORTER</span>
    </td>
  </tr>
  <tr>
    <td>Clerk</td>
    <td class="steno-outline">
      <span>KHRERBG/KHRERBG</span>
    </td>
    <td class="steno-font">
      <span>KHRERBG/KHRERBG</span>
    </td>
    <td>
      <span class="steno-transcript">THE CLERK</span>
    </td>
  </tr>
  <tr>
    <td>Bailiff</td>
    <td class="steno-outline">
      <span>PWHR-F/PWHR-F</span>
    </td>
    <td class="steno-font">
      <span>PWHR-F/PWHR-F</span>
    </td>
    <td>
      <span class="steno-transcript">THE BAILIFF</span>
    </td>
  </tr>
</table>

### Custom Outlines

<table class="steno-table">
  <thead>
    <tr>
      <th>Person</th>
      <th class="centered-heading">Outline</th>
      <th class="centered-heading">Keymap</th>
      <th>Output</th>
    </tr>
  </thead>
  <tr>
    <td>Videographer</td>
    <td class="steno-outline">
      <span>STPHAEUFPLT</span>
    </td>
    <td class="steno-font">
      <span>STPHAEUFPLT</span>
    </td>
    <td>
      <span class="steno-transcript">THE VIDEOGRAPHER</span>
    </td>
  </tr>
  <tr>
    <td>Court Reporter</td>
    <td class="steno-outline">
      <span>STPHOEUFPLT</span>
    </td>
    <td class="steno-font">
      <span>STPHOEUFPLT</span>
    </td>
    <td>
      <span class="steno-transcript">THE COURT REPORTER</span>
    </td>
  </tr>
  <tr>
    <td>Clerk</td>
    <td class="steno-outline">
      <span>STPHAOEFPLT</span>
    </td>
    <td class="steno-font">
      <span>STPHAOEFPLT</span>
    </td>
    <td>
      <span class="steno-transcript">THE CLERK</span>
    </td>
  </tr>
  <tr>
    <td>Bailiff</td>
    <td class="steno-outline">
      <span>STPHAOUFPLT</span>
    </td>
    <td class="steno-font">
      <span>STPHAOUFPLT</span>
    </td>
    <td>
      <span class="steno-transcript">THE BAILIFF</span>
    </td>
  </tr>
</table>

A couple of notes about these outlines:

- None of the roles are involved with questioning a witness, so they do not get
  bylines, and hence have a similar outline set to those for `THE COURT` or `THE
  WITNESS`.
- The ordering of the roles is based on [Plover Speaker ID][]

See [my Q&A dictionary][Paul's Markdown Q&A dictionary] for details on
the outline variations for when the role first speaks, speaks after a question
or answer, or interrupts.

---

## Appendix A: Formatting the Record

If I was going to attempt these Q&A exercises, I figured that I should at least
also make an effort to make the resulting transcriptions feel somewhat
professional, and mimic the official-looking transcripts PS provides for
reference.

I chose [Google Docs][] to do this due to its accessibility to everyone, but I
am sure that you could recreate something similar on your favourite text editor
or word processor software if you wanted.

Aside from the font and text-spacing formatting rules mentioned in the post, the
court transcripts required for PS's lessons also need to obey the following
rules:

- Lines must be double-spaced
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

## Appendix B: Stitching

When someone verbally spells words during Q&A, like when they spell their name
for the record, s-t-i-t-c-h-i-n-g the words is the way to show this.

[Plover's main dictionary][] has some support for stitching via the following
set of outlines (note that `&` is the [Plover glue operator][] to allow the
strokes to "stick together"):

```json
{
  "AFPL": "{&a-}",
  "PW-PLT": "{&b-}",
  "KR-PLT": "{&c-}",
  "TK-PLT": "{&d-}",
  "EFPL": "{&e-}",
  "TKPW-PLT": "{&g-}",
  "H-PLT": "{&h-}",
  "SKWR-PLT": "{&j-}",
  "K-PLT": "{&k-}",
  "HR-PLT": "{&l-}",
  "PH-PLT": "{&m-}",
  "TPH-PLT": "{&n-}",
  "OPLT": "{&o-}",
  "P-PLT": "{&p-}",
  "KW-PLT": "{&q-}",
  "R-PLT": "{&r-}",
  "S-PLT": "{&s-}",
  "T-PLT": "{&t-}",
  "SR-PLT": "{&v-}",
  "W-PLT": "{&w-}",
  "KP-PLT": "{&x-}",
  "KWR-PLT": "{&y-}",
}
```

You may have noticed that there are a few letters absent here. I am not sure
why they are missing, but I ended up adding some of the lost letters to my own
[custom stitching dictionary][Paul's stitching dictionary] using the following
outlines:

```json
{
  "A*EUPLT": "{&a-}",
  "AO*EUPLT": "{&i-}",
  "AO*UPLT": "{&u-}",
  "STKPW-PLT": "{&z-}",
}
```

A few notes about these entries:

- Yes, there is already an outline for `{&a-}`, but I wanted one that followed
  the `-PLT` pattern like the rest. `APLT` was already taken for "amount", so I
  used `A*EUPLT` with the long "a" sound instead
- For `{&i-}` and `{&u-}`, I wanted to use `EUPLT` and `UPLT`, but they were
  also already taken for  "implement" and "ultimate", respectively, so they,
  too, got elongated vowel versions of the outlines I originally wanted

That still leaves `{&f-}` missing, though. The outline I wanted to use was
`TP-PLT`, to match the `-PLT` pattern of the other stitching outlines, but it
was already reserved for the period (`{.}`). Now, Plover already assigns 32(!)
outlines to `{.}`, so, I figured it wouldn't miss the `TP-PLT` outline if I
overrode it and gave it to `{&f-}`.

This ended up being the catalyst to create my
[custom brief overrides dictionary][Paul's brief overrides dictionary], for
cases where I have a difference of opinion from Plover's outline allocation, and
want to assign an outline to some other word.

For good measure, I also snuck in `"AO*EPLT": "{&e-}"` to the overrides
dictionary, just to make sure that _all_ stitching entries would follow the
`-PLT` pattern. Plover assigns `AO*EPLT` to "empty", but since I do not
associate the word "empty" with a long "e", I was happy to re-assign the
outline.

### Flipping the Script

After using the stitching outlines above for a little while, I came across the
following issue: whenever a speaker finished spelling their name, I would be
left with a trailing hyphen (`-`) that I would have to manually delete. In some
cases, it was just not possible to know in advance what the final letter of a
name would be until it was said, and it would be too late to switch out the
final letter with a standard fingerspelled letter.

When it comes to spelling spoken words, we definitely know when the beginning
is, but not necessarily when the end will be. So, I thought perhaps the
stitching outlines could work in the same way: use a fingerspelled letter for
the first letter, and use _backwards_-hyphened stitching for the rest of the
letters, allowing a stitched word to finish at any time.

So, I came up with the following set of outlines that use a `*PLT` suffix, which
are spread across my custom stitching and brief overrides dictionaries, but are
presented here as a single set for ease of viewing:

```json
{
  "A*PLT": "{&-a}",
  "PW*PLT": "{&-b}",
  "KR*PLT": "{&-c}",
  "TK*PLT": "{&-d}",
  "*EPLT": "{&-e}",
  "TP*PLT": "{&-f}",
  "TKPW*PLT": "{&-g}",
  "H*PLT": "{&-h}",
  "*EUPLT": "{&-i}",
  "SKWR*PLT": "{&-j}",
  "K*PLT": "{&-k}",
  "HR*PLT": "{&-l}",
  "PH*PLT": "{&-m}",
  "TPH*PLT": "{&-n}",
  "O*PLT": "{&-o}",
  "P*PLT": "{&-p}",
  "KW*PLT": "{&-q}",
  "R*PLT": "{&-r}",
  "S*PLT": "{&-s}",
  "T*PLT": "{&-t}",
  "*UPLT": "{&-u}",
  "SR*PLT": "{&-v}",
  "W*PLT": "{&-w}"
  "KP*PLT": "{&-x}",
  "KWR*PLT": "{&-y}",
  "STKPW*PLT": "{&-z}"
}
```

Which ever way you prefer to do steno stitching (if you even need to do it at
all!), hopefully this has given you some food for thought on some potential
options to get it working. If neither of these options suit your tastes, perhaps
[Ted Morin][]'s [Plover Stitching Plugin][] may provide a more viable option.

G-o-o-d L-u-c-k!

## UPDATE 5 December 2021: Plover Stitching Plugin Recommended

Forget the outlines in the dictionary above: it's definitely better, and more
straightforward, to use the [Plover Stitching Plugin][].

You can see how I've leveraged it in my [custom stitching dictionary][Paul's
stitching dictionary] and in my [Plover overrides][Paul's Plover Overrides].

[60WPM speed building video list]: https://www.youtube.com/playlist?list=PL85Y9t9lANyCGo0H6O5gSUlu3hT62XjrA
[Ab Initio]: https://en.wikipedia.org/wiki/Ab_initio
[Adjournment _sine die_]: https://en.wikipedia.org/wiki/Adjournment_sine_die
[Appendix A: Formatting the Record]: #appendix-a-formatting-the-record
[Appendix B: Stitching]: #appendix-b-stitching
[Caveat Lector]: https://en.wikipedia.org/wiki/Caveat_emptor#Caveat_lector
[Caveat Utilitor]: https://definitions.uslegal.com/c/caveat-utilitor
[cosplay]: https://en.wikipedia.org/wiki/Cosplay
[court reporter]: https://en.wikipedia.org/wiki/Court_reporter
[dramatis personae]: https://en.wikipedia.org/wiki/Dramatis_personae
[fingerspelling]: https://www.artofchording.com/sounds/fingerspelling.html#fingerspelling-alphabet
[Going Platinum]: https://www.paulfioravanti.com/blog/going-platinum/
[Going Platinum Platinum Steno Dictionary Released]: https://www.paulfioravanti.com/blog/going-platinum/#update-30-october-2022-platinum-steno-dictionary-released-tada
[Google Docs]: https://docs.google.com/
[Kathy]: https://github.com/Kaoffie
[Learn Plover! Glossary]: https://sites.google.com/site/learnplover/glossary
[Line Numbers for Google Docs plugin]: https://github.com/Line-Numbers-for-Google-Docs/chrome-extension
[Line Numbers for Google Docs Installation instructions]: https://github.com/Line-Numbers-for-Google-Docs/chrome-extension/issues/33#issuecomment-894842650
[monospaced font]: https://en.wikipedia.org/wiki/Monospaced_font
[National Court Reporters Association]: https://www.ncra.org/
[newline]: https://en.wikipedia.org/wiki/Newline
[Orthography]: https://en.wikipedia.org/wiki/Orthography
[Paul's brief overrides dictionary]: https://github.com/paulfioravanti/steno_dictionaries/blob/7191ce5a00/dictionaries/overrides/briefs.json
[Paul's Markdown Q&A dictionary]: https://github.com/paulfioravanti/steno-dictionaries/blob/9da82652830bd76a9ef075a6050cfef703003b95/dictionaries/q-and-a.md
[Paul's Plover Overrides]: https://github.com/paulfioravanti/steno-dictionaries/tree/8d90588af11e7c3a4007012bd525523e432e1d06/dictionaries/override
[Paul's Q&A dictionary]: https://github.com/paulfioravanti/steno-dictionaries/blob/b5b97066862bb5868ff4ce2dd8fe149e0c198291/dictionaries/q-and-a.json
[Paul's stitching dictionary]: https://github.com/paulfioravanti/steno-dictionaries/blob/969e0f9d179276fd0fba7bfa4e94d2f428fa6302/dictionaries/stitching.json
[Phonetics]: https://en.wikipedia.org/wiki/Phonetics
[plaintiff]: https://en.wikipedia.org/wiki/Plaintiff
[Platinum Steno]: https://platinumsteno.com/
[Platinum Steno Lesson 27 QA]: https://www.youtube.com/watch?v=tEgaJ7hWIvg&list=PL85Y9t9lANyArY9uTBE_kmy2cT_ECSHvU&index=61
[Platinum Steno Lesson 31]: https://www.youtube.com/watch?v=ABd5JcmOmg0&list=PL85Y9t9lANyArY9uTBE_kmy2cT_ECSHvU&index=70
[Platinum Steno Theory Dictionary]: https://platinumsteno.com/downloads/platinum-steno-ncrs-theory-dictionary/
[Platinum Steno Theory playlist]: https://www.youtube.com/playlist?list=PL85Y9t9lANyArY9uTBE_kmy2cT_ECSHvU
[Plover]: https://www.openstenoproject.org/
[Plover glue operator]: https://github.com/openstenoproject/plover/wiki/Dictionary-Format#glue-operator-numbers-fingerspelling
[Plover Keyboard Shortcuts]: https://github.com/openstenoproject/plover/wiki/Dictionary-Format#keyboard-shortcuts
[Plover's Dictionary Format]: https://github.com/openstenoproject/plover/wiki/Dictionary-Format
[Plover's main dictionary]: https://raw.githubusercontent.com/openstenoproject/plover/master/plover/assets/main.json
[Plover Speaker ID]: https://github.com/sammdot/plover-speaker-id
[Plover Stitching Plugin]: https://github.com/morinted/plover_stitching
[Plover Undoable Line Breaks and Tabs]: https://github.com/openstenoproject/plover/wiki/Dictionary-Format#undoable-line-breaks-and-tabs
[post-hoc]: https://en.wikipedia.org/wiki/Post_hoc
[pro bono publico]: https://en.wikipedia.org/wiki/Pro_bono
[Q&A]: http://ilovesteno.com/2014/02/03/the-different-types-of-q-a/
[Steno Display Font Github repository]: https://github.com/Kaoffie/steno_font
[stenography]: https://en.wikipedia.org/wiki/Stenotype
[Tab key]: https://en.wikipedia.org/wiki/Tab_key
[Ted Morin]: https://twitter.com/morinted
[Tetris]: https://en.wikipedia.org/wiki/Tetris
[YMMV]: https://dictionary.cambridge.org/dictionary/english/ymmv
