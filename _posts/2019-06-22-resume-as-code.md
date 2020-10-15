---
redirect_from: /blog/2019/06/22/resume-as-code/
title: "Resume as Code"
date: 2019-06-22 22:00 +1100
last_modified_at: 2020-10-15 22:00 +1100
tags: pdf prawn resume ruby
header:
  image: /assets/images/2019-06-22/drew-beamer-692664-unsplash.jpg
  image_description: "black rolling chairs beside brown table"
  teaser: /assets/images/2019-06-22/drew-beamer-692664-unsplash.jpg
  overlay_image: /assets/images/2019-06-22/drew-beamer-692664-unsplash.jpg
  overlay_filter: 0.5
  caption: >
    Photo by [Drew Beamer](https://unsplash.com/@drew_beamer?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
    on [Unsplash](https://unsplash.com/search/photos/interview?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: >
  Bring some fun back into the document that sells you to the world.
---

I recently got back on the job market after a lengthy hiatus, and so had to
re-visit the content of my humble resume.

As a developer, if the first recipient of your resume in a new organisation is a
non-technical person, then you will probably need to be bound by convention and
send along a [PDF file][] of some sort. However, if that person is technical, it
could be worth playing around with those conventions using the skills you know
best because...

## Resumes are Boring

No one _really_ likes to read or write resumes: you may have a duty to read them
as part of your job if you are an interviewer, and you likely begrudgingly write
them if you are an interviewee. Regardless, they are still the most widely
accepted (and expected) artefact used to sell a person at the point of first
contact.

They serve a single-use purpose: to convince someone that you are worth the
time, effort, and money to begin an interview process with. An interviewer may
use your resume as a reference to quiz you in more detail about your past work
experience, but at that point you are already through the door, so its job is
done.

But, it's that first step that's the hardest: having _your_ resume, in a sea of
similar resumes, get the attention and curiosity of someone in a position of
authority, and _convincing_ them that they should interview you.

In an attempt to achieve that goal, I chose [Ruby][] to be in my corner to add
some :sparkles:sparkles:sparkles: to a bland resume submission process.

## Resume as Script

{% capture alice_pasqual_img %}
![Alice Pasqual Image](/assets/images/2019-06-22/alice-pasqual-750261-unsplash.jpg
"food inside bucket")
{% endcapture %}
{% capture alice_pasqual_credit %}
Photo by [Alice Pasqual](https://unsplash.com/@stri_khedonia?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
on [Unsplash](https://unsplash.com/search/photos/prawn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
{% endcapture %}
<figure style="width:50%; float: right; margin-left: 10px; margin-top: 20px;">
  {% include stripped_markdown.html markdown=alice_pasqual_img %}
  <figcaption>
    {% include stripped_markdown.html markdown=alice_pasqual_credit %}
  </figcaption>
</figure>

My actual resume is _still_ ultimately a PDF document (I don't have the skills
to do something [extremely cool][interactive resume]), but the _method_ used to
make that document come into existence is where I hope to get potential new
colleagues on side.

That method is a Ruby application, using the [Prawn][] gem under the hood for
PDF generation. I send the generated PDF result to human resource contacts,
but send only the application to technical contacts, and let them run it. The
application ended up being a lot of fun for me to write and continue tweaking,
and I hope that it ends up being at least a little bit fun for those I send it
to. The intention is that it will lead to follow-on effects like:

- The resume _actually getting read_ since some minor effort was needed to
  generate it: pretty much an attempt to harness the [IKEA effect][], which
  would lead to...
- A positive response, which will then hopefully lead to an interview in a
  shorter time frame and...
- Potentially skip any coding tests, as the resume itself would also be a
  showcase code sample

You can [get the resume application][paulfioravanti/resume] from Github and try
it out yourself.

## Design

I am not a designer, but there were a few things I did want to have in the
resume document so that it looked familiar, yet not _too_ pedestrian:

- 2 pages maximum because of low attention spans; no one needs to know my life
  story, and the details of any position can be discussed in an interview.
- A line of image links at the top of the first page to various contact
  information, social media, professional, technical, and hobby accounts that I
  think are worth sharing on a resume but don't want taking up too much space
  ![Image links](/assets/images/2019-06-22/image_links.jpg){: style="width:40%;"}
- [Buzzword bingo][] below the image links to make it easier to
  matchmake my abilities at a glance with any position requirements
- [LinkedIn][]-style position and education listings with links and images
  (regardless of what I may think of LinkedIn, most people know of it and are
  familiar with the way they lay out information, so I figured it was worth
  mimicking)

My hope is that most people will get all the re-reference-able information they
_really_ want to know out of the image links and Buzzword bingo (ie the first
half of the first page of the resume), with all the rest of the information for
the most part being read-once supplementary.

## Technical Overview

The codebase of the resume has changed greatly as I've tinkered with it, but as
it stands now, it consists of two major parts:

- The command line interface (CLI) program, which handles user input, and what
  needs to happen before and after the resume gets created
- The resume itself: a series of modules that use Prawn to define individual
  parts of the resume document

### Content

There is no content in the resume app at all, so you can't just open up the code
to read the resume in plain text. Rather, the content comes from [JSON][] files
[hosted in the project Github repo][paulfioravanti/resume/resources]. All text
there is encoded in [Base64][], so you really do need to generate the resume to
read any of its content, and this is deliberate.

**`resources/resume.en.json`**

```json
{
  // ...
  "social_media_logo_set": {
    "logos": {
      "email": {
        "image": "aHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy8yYnQwOGw5MDg0YzR3NnkvcmVzdW1lX2VtYWlsLnBuZz9kbD0x",
        "link": "bWFpbHRvOnBhdWwuZmlvcmF2YW50aUBnbWFpbC5jb20/c3ViamVjdD1Zb3VyJTIwcmVzdW1lJTIwaXMlMjBhd2Vzb21lISZib2R5PUklMjB3YW50JTIwdG8lMjBnaXZlJTIweW91JTIwYSUyMGpvYiUyMHJpZ2h0JTIwbm93IQ=="
      },
      "linked_in": {
        "image": "aHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy9sdDY3NGNycnF3Y293bHcvcmVzdW1lX2xpbmtlZGluLnBuZz9kbD0x",
        "link": "aHR0cHM6Ly9saW5rZWRpbi5jb20vaW4vcGF1bGZpb3JhdmFudGk="
      },
      "twitter": {
        "image": "aHR0cHM6Ly93d3cuZHJvcGJveC5jb20vcy80cWo5YnVsem4wd200MWgvcmVzdW1lX3R3aXR0ZXIucG5nP2RsPTE=",
        "link": "aHR0cHM6Ly90d2l0dGVyLmNvbS9wYXVsZmlvcmF2YW50aQ=="
      },
    // ...
  },
  // ...
}
```

I love internationalisation, so aside from English, the content is available in
Italian and Japanese. Japanese was a tough language to get working with Prawn
initially since none of Prawn's bundled fonts support it, but I got there
eventually, and will provide further details below.

### Assets

Image assets are hosted on my Dropbox account, and when you run the resume
application for the first time, it downloads all those files and stores them
in your `tmp` directory. So, when you have generated the resume once, it will
generate quicker subsequent times (or until your system clears out your `tmp`
directory). Want to know exactly where those files are being stored? You can
find out in [IRB][] with `Dir.tmpdir`:

```sh
$ irb
irb(main):001:0> require "tmpdir"
true
irb(main):002:0> Dir.tmpdir
"/var/folders/g0/2s3h_j8n0rqcjjcmyr3v8cwh0000gn/T"
irb(main):003:0> exit
$ ls /var/folders/g0/2s3h_j8n0rqcjjcmyr3v8cwh0000gn/T | grep resume
resume_10fastfingers.png
resume_background.jpg
resume_duolingo.png
resume_email.png
resume_exercism.png
# ...
```

### Structure

The directory structure of the resume is pretty much standard for any Ruby
project, which is fine for development, but I didn't want to package up multiple
files when sending the resume to someone. So, there is a `rake` task that reads
in all the files, and writes them to a single file (which I call the "one-sheet"
resume), making it much more straightforward to, say, attach it to an email.

### Testing and Code Quality

The application is fully tested using [RSpec][], and since it's showcase code,
I have tried to add developer niceties like:

- 100% [Simplecov][] test coverage
- [Rubocop][] is generally happy with it
- Fully documented with [Yard][]

The tests are also bundled into the one-sheet resume, so you can run both the
application itself and the tests from the same file. When you generate the
one-sheet resume, it also makes sure to test itself and check its own quality:

```sh
$ rake resume
Generating one-sheet resume...
Successfully generated one-sheet resume
Running specs...
Run options: include {:focus=>true}

All examples were filtered out; ignoring {:focus=>true}
 115/115 |======================== 100 ========================>| Time: 00:00:00

Finished in 0.72365 seconds (files took 0.24667 seconds to load)
115 examples, 0 failures
Running code quality check...
 1/1 file |======================= 100 ========================>| Time: 00:00:00

1 file inspected, no offenses detected
```

## Technical Challenges

During development, I came across a quite a few challenges, but simulating image
links and getting internationalisation to work were ones that I needed to
actively get community assistance for, so I will expand upon them below.

### Prawn and Image Links

Prawn's README [states][Should You Use Prawn?]:

> One thing Prawn is not, and will never be, is an HTML to PDF generator. [...]
We do have basic support for inline styling but it is limited to a very small
subset of functionality and is not suitable for rendering rich HTML documents.

I wanted to add a set of clickable image links to the resume; Prawn supports
text links in PDFs, as you would expect, but it would seem that image links are
considered "rich HTML", and outside the scope of [Prawn's API][]. So, I wondered
if there was a way to potentially simulate the effect that I wanted, and it
turns out that there is. The high level explanation is to:

- insert an image into the PDF
- Move the [document cursor][Prawn document cursor] up to the top of the image
- draw some text over the image
- make that text a link to somewhere
- make that text transparent

And voilà, it kind of looks like you are clicking the image.

![image links][]

An abbreviated code sample would look something like this:

```ruby
# bounding_box provide bounds for flowing text, starting at a given point
bounding_box([0, cursor], width: 35) do
  image(
    open("path/to/image.jpg"),
    fit: [35, 35],
    align: :center
  )
  # moves page "cursor" up
  move_up(35)
  # 0 is transparent, 1 is opaque
  transparent(0) do
    formatted_text(
      [
        {
          text: "|||", # placeholder text
          size: 40,
          link: "http://example.com/"
        }
      ],
      align: :center
    )
  end
  # ...
end
```

More details about this can be found in
[this StackOverflow question][rails gem prawn, image and anchor], and you can
see how it is used in the resume codebase
[here][paulfioravanti/resume#transparent_link].

### Displaying Japanese Text

Japanese text cannot be rendered with Prawn's built-in fonts, and you will need
to rely on external [TrueType][] font files (extension `.ttf`) to display text.

When you attempt to generate my resume in Japanese, Ruby goes and fetches font
files from my Dropbox account, and downloads them into your `tmp` directory.
These files were originally provided by the
[Information-Technology Promotion Agency][] (IPA), but are now the concern
of the [Character Information Technology & Promotion Council][] (CITPC).
The specific set of font files are the "4 fonts package" (4書体パック) listed on
[this page][Download IPA fonts], which contains the IPA Mincho and IPA Gothic
fonts. The latest versions of these fonts can be found on the
[IPAex Font Downloads page][].

I used the IPAPMincho font (`ipamp.ttf`) for "normal" font, and IPAPGothic
(`ipagp.ttf`) for "bold"; they are different fonts, but one worked for me as
the "bold version" of the other. These fonts are configured in Prawn
on-the-fly using code that looks something like this:

```ruby
Prawn::Document.generate("MyJapaneseDocument.pdf") do |pdf|
  # assume `font_name` here is something like "IPA",
  # ie not a font that is shipped with the Prawn gem
  unless Prawn::Font::AFM::BUILT_INS.include?(font_name)
    pdf.font_families.update(
      font_name => {
        normal: "path/to/ipamp.ttf",
        bold: "path/to/ipagp.ttf"
      }
    )
  end
  pdf.font font_name
end
```

Japanese font then displays quite nicely, including [half-width kana][].

![resume top half in Japanese][]

More details about this can be found in
[this StackOverflow question][Using external TTF fonts to generate PDF with
Japanese text using prawn], and you can see how it is used in the resume
codebase [here][paulfioravanti/resume#configure].

## Final Thoughts

Coding my resume ended up becoming one of my longest, most consistently
maintained and developed projects (still going since 2013), small as it
is. I certainly did not expect this to be the case when I started, but I would
end up using it as a sandbox for ideas I wanted to test out in Ruby, and they
ended up becoming features.

Sometimes, those features would result in "bugs in production", and
technical people would end up requesting the generated PDF from me when they
would get errors trying to run the one-sheet Ruby script (though I'm pretty sure
it's okay now...). But, at least they would usually laugh them off and
acknowledge the effort to try something different (and then usually push me
forward for an interview, anyway).

Creating your resume doesn't have to be a chore: it can be as fun and rewarding
as any other software that you write, and that's all the better if doing
something a bit different can help you in your job hunting as well.

Feel free to use any or all of
[my resume][paulfioravanti/resume] if you want to generate PDFs, and happy
interviewing!

[Base64]: https://en.wikipedia.org/wiki/Base64
[Buzzword bingo]: https://en.wikipedia.org/wiki/Buzzword_bingo
[Character Information Technology & Promotion Council]: https://moji.or.jp/
[Download IPA Fonts]: https://moji.or.jp/ipafont/ipa00303/
[half-width kana]: https://en.wikipedia.org/wiki/Half-width_kana
[IKEA effect]: https://en.wikipedia.org/wiki/IKEA_effect
[image links]: /assets/images/2019-06-22/image_links.gif
[Information-technology Promotion Agency]: https://www.ipa.go.jp/
[interactive resume]: http://www.rleonardi.com/interactive-resume/
[IPAex Font Downloads page]: https://moji.or.jp/ipafont/ipafontdownload/
[IRB]: https://en.wikipedia.org/wiki/Interactive_Ruby_Shell
[JSON]: https://en.wikipedia.org/wiki/JSON
[LinkedIn]: https://www.linkedin.com/
[paulfioravanti/resume]: https://github.com/paulfioravanti/resume
[paulfioravanti/resume/resources]: https://github.com/paulfioravanti/resume/tree/master/resources
[paulfioravanti/resume#transparent_link]: https://github.com/paulfioravanti/resume/blob/6f2cca5df12b8166b2dafa98089d97f481dbeb8a/lib/resume/pdf/image_link.rb#L40
[paulfioravanti/resume#configure]: https://github.com/paulfioravanti/resume/blob/6f2cca5df12b8166b2dafa98089d97f481dbeb8a/lib/resume/pdf/font.rb#L17
[PDF file]: https://en.wikipedia.org/wiki/PDF
[Prawn]: https://github.com/prawnpdf/prawn
[Prawn's API]: http://prawnpdf.org/api-docs/
[Prawn document cursor]: http://prawnpdf.org/api-docs/2.0/Prawn/Document.html#cursor-instance_method
[Should You Use Prawn?]: https://github.com/prawnpdf/prawn/tree/c5842a27b15f912f2f0ad5818a9ef38992978b3c#should-you-use-prawn
[rails gem prawn, image and anchor]: https://stackoverflow.com/questions/8289031/rails-gem-prawn-image-and-anchor
[resume top half in Japanese]: /assets/images/2019-06-22/resume_first_half_japanese.jpg
[RSpec]: https://github.com/rspec/rspec
[Rubocop]: https://github.com/rubocop-hq/rubocop
[Ruby]: https://www.ruby-lang.org/en/
[Simplecov]: https://github.com/colszowka/simplecov
[TrueType]: https://en.wikipedia.org/wiki/TrueType
[Using external TTF fonts to generate PDF with Japanese text using prawn]: https://stackoverflow.com/questions/20463660/using-external-ttf-fonts-to-generate-pdf-with-japanese-text-using-prawn
[Yard]: https://yardoc.org/
