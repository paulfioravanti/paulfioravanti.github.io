---
title: "\"Welcome back\""
date: 2022-07-03 13:50:00 +1100
last_modified_at: 2022-07-03 13:50:00 +1100
tags: japan work overwork software japanization j10n feature-phones 日本 ガラケー
narration_video_id: "_nkqjga6doM"
header:
  image: /assets/images/2022-07-03/working-late.jpg
  image_description: "On the beers, working late in a hotel room"
  teaser: /assets/images/2022-07-03/working-late.jpg
  overlay_image: /assets/images/2022-07-03/working-late-header.jpg
  overlay_filter: 0.4
excerpt: >
  A short story of overwork from the software trenches of Tokyo.
---

{% include audio-narration-banner.html video-id=page.narration_video_id %}

In the late [noughties][], I worked for an American software company in Japan.

That period in Tokyo, just pre-[Lehman Shock][], felt like a mini tech boom: the
company had managed to hit the jackpot by selling a colossal software and
professional services deal to a huge Japanese company.

Money from sales expense accounts flowed freely, even into the beers of the
engineers; all in an attempt to foster goodwill, encourage a successful
project implementation, and keep the customer happy.

However, I do not recall anyone on the project ever being happy.

The customer was not happy, because the software and its ecosystem did not work
as they expected, for reasons which were obvious to them, but perhaps not to
anyone outside Japan[^1].

The project implementation team were not happy, because the responsibility to
bridge the gap on these issues fell directly on them.

During the worst periods, we were working literal 18-22 hour days. There were
periods where I had no time to actually go home, and had to get my partner to
physically bring me changes of clothes to the office; I had to grab showers, and
maybe a couple of hours sleep, at my teammate's apartment close by.

Many weeks were spent on a schedule of getting an earful of frustration from the
customer about the software product during the day (as well as from our own
sales staff, who did not want to have their commissions jeopardised), then
getting on calls with the US support and development teams throughout the night,
in hopes they could create [patches][] for the product. If they could, we would
apply them, re-adapt our implementation to account for them, then rinse and
repeat this cycle of insanity: we were very figuratively repairing the
aeroplane, and replacing its parts, mid-flight.

On one particular night, when I was actually able to make it home, my
company-issued [BlackBerry][] summoned me to a 2:00am conference call with one
of the US regional offices to discuss the usual product issues found by the
customer, which I joined lying flat on the floor.

A lot of the conversation content was out of my depth, since I lacked background
context from previous projects. But, when Japan-related questions finally came
up, I was able to chime in and attempt to provide something of value, at which
point my project teammate said the words that I can still hear clearly to this
day:

{:refdef style="font-size: xx-large"}
> "Welcome back"
{:refdef}

Confused, I asked what he was talking about, and his response impacted like a
fireworks display of every red flag I had ignored about this project and the
company.

I was duly informed that I had _fallen asleep_ on the call, and our colleagues
across the [Pacific][Pacific Ocean] had decided to broadcast my snoring
_office-wide_ on their speakerphone for laughs.

As far as I was concerned, I was _fully conscious_, alert, and focused on the
discussions. But, it would seem that even in my dreams I couldn't escape this
waking nightmare of a project.

Eventually, though, the project did end ("successfully", so that everyone saved
face), and I began formulating an exit strategy.

Not fast enough to beat the start of a new assignment, though, which was shaping
up to be even worse than the previous one: the project owner was a horrid person
who, among many terrible traits, could not seem to grasp the concept of using a
[staging environment][] to preview the current state of a website being actively
developed on.

He insisted that _every page of the **website**_ be **_printed out on paper_**
periodically, and _put in a **3-ring binder**_ for his review, where he would
_**manually mark out "corrections"** he wanted with a **pen**_!

I just...yeah, no thanks.

Even without a new employer to join, I knew I was severely burnt out, and just
needed to leave _immediately_. Regardless of my youth, I could not ignore the
toll the work took on me physically, and spent the following few months
recovering before even thinking of looking for a new job.

The fire of the trenches may have forged some great friendships between myself
and former colleagues that still last to this day, but I do regret giving so
much to a company, while receiving so comparatively little in return, in order
to achieve such an inconsequential objective, that was not appreciated, which
then required me to use my own time to heal the damage it caused.

Unlike the software we implemented, which is long gone, the visceral mental
rulebook for work that resulted from my experience at the company
continues to serve me well (and has collected a few more entries over the
years). With regards to overwork, my rules are quite simple:

1. Do not overwork. It is just not worth it.
2. Do not violate Rule 1. If you are foolish enough to do so, the incentives
   received had better take into consideration all the opportunity costs of that
   extra work time, the impact to physical and mental health, and the time
   needed to recover: all of which are higher than you likely think, so go check
   yourself and read Rule 1 again.

What cannot reasonably be done today, can be done tomorrow; work is never
"done". A contract for employment is not an agreement to indentured servitude.
Charity is for charities and other good causes, not for-profit organisations.

I hope that you keep your own relationship with work healthy, and can leverage
this cautionary tale to avoid ever being "welcomed back".

[^1]: Issues that I can specifically remember with the system included:

      - Display, formatting, and encoding issues related to
        [double-byte character sets][DBCS] and [half-width _kana_][] (imagine a
        system that had problems displaying, say, English capital letters...)
      - Inability to relate _[furigana][]_ readings to _[kanji]_, meant ordering
        of words would be based on their [Unicode][] [code points][], rather
        than their _[gojūon][]_ ordering (imagine a system that couldn't sort
        words alphabetically...)
      - Garbled text (_[mojibake][]_) display when attempting to send emails to
        early Japanese mobile phones ([Galápagos phones][]) due to not being
        able to handle [Japanese character encodings][] like [ISO-2022-JP][]
        (imagine a system that only sent out emails in [dingbat][] font...)
      - Limited ability to customise the software product for their specific
        business processes (which smells to me like they were oversold on the
        software product's [extensibility][])
      - Poorly translated Japanese documentation, if there was any at all

[BlackBerry]: https://en.wikipedia.org/wiki/BlackBerry
[code points]: https://en.wikipedia.org/wiki/Code_point
[DBCS]: https://en.wikipedia.org/wiki/DBCS
[dingbat]: https://en.wikipedia.org/wiki/Dingbat
[extensibility]: https://en.wikipedia.org/wiki/Extensibility
[furigana]: https://en.wikipedia.org/wiki/Furigana
[Galápagos phones]: https://en.wikipedia.org/wiki/Gal%C3%A1pagos_syndrome#Mobile_phones
[gojūon]: https://en.wikipedia.org/wiki/Goj%C5%ABon
[ISO-2022-JP]: https://en.wikipedia.org/wiki/ISO/IEC_2022#ISO-2022-JP
[Japanese character encodings]: https://en.wikipedia.org/wiki/Japanese_language_and_computers#Character_encodings
[half-width _kana_]: https://en.wikipedia.org/wiki/Half-width_kana
[kana]: https://en.wikipedia.org/wiki/Kana
[kanji]: https://en.wikipedia.org/wiki/Kanji
[mojibake]: https://en.wikipedia.org/wiki/Mojibake
[noughties]: https://en.wiktionary.org/wiki/noughties
[Lehman Shock]: https://en.wikipedia.org/wiki/Bankruptcy_of_Lehman_Brothers
[Pacific Ocean]: https://en.wikipedia.org/wiki/Pacific_Ocean
[patches]: https://en.wikipedia.org/wiki/Patch_(computing)
[professional services]: https://en.wikipedia.org/wiki/Professional_services
[staging environment]: https://en.wikipedia.org/wiki/Deployment_environment#Staging
[Unicode]: https://en.wikipedia.org/wiki/Unicode
