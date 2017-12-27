---
redirect_from: /presenting/2017/12/18/wii-remote-is-best-presentation-remote.html
layout: post
title:  "Wii Remote is Best Presentation Remote"
date:   2017-12-19 09:40 +1100
categories: presentations
comments: true
---

![Wii Remote](/assets/images/wii-remote.jpg){:class="img-responsive"}

I use a Nintendo [Wii Remote][] as my controller whenever
[I do a presentation][my-presentations].

In my opinion, its form factor, number of configurable buttons, and general
whimsiness, make it way more interesting to use than any other commercial remote
on the market. It also helps with being remembered after the presentation is
finished ("You're using a video game controller with your slides...?!").

However, it took a surprising amount of time and effort to finally figure out how
to get a Wiimote connected to my Macbook Pro in 2017, and like plenty of
developer tools, the process is certainly not straightforward. So, it is this
process that I will attempt to shed some light on.

## Old Skool Wiimotes Only

When I first thought about the potential of connecting a Wiimote to my laptop
via Bluetooth to use as a presentation remote, I immediately went out and bought
a new [Wii Remote Plus][], because that was what was available at game stores.

Since the connection and configuration of a Wiimote is not a native feature of
Mac OS, I bought [Remote Buddy][] to help me with that, since it seemed to be
the most fully-featured software of the potential options I found.

I assumed that since the Wii Remote Plus was a superior model to the original
Wii Remote, once I got Remote Buddy working, connecting via Bluetooth would be
plug 'n' play smooth. That assumption was _completely incorrect_, and the
Wiimote was promptly ignored by Mac OS when I tried to connect it.

Searching the web led me to the site for the [Dolphin Emulator][], an emulator
for the Gamecube and Wii on PC hardware, which has a
[Wii Remote Plus connection guide][]. Reading it, I came to the understanding
that standard (earlier-model) Wii Remotes and the first batch of released Wii
Remote Pluses (both known by their device code `RVL-CNT-01`), seemed to have
different (and incompatible) Bluetooth connection drivers to later batches of
Wii Remote Pluses (device code `RVL-CNT-01-TR`). My Wii Remote Plus registered
as the latter device code, so it looked like I'd just purchased a Wii
Remote-shaped paperweight since I did not even have a Wii console to use it
with.

I was just about to go hunting on auction sites and in second-hand game shops,
when a friend reached out via Twitter who was willing to graciously swap his
old Wiimote for my latest version.  When we made the swap and I attempted a
Bluetooth connection, it showed device code `RVL-CNT-01`, so it looked like I
was perhaps in with a chance.

## How to Connect

So, if you've managed to get an old `RVL-CNT-01` Wiimote and have bought
Remote Buddy, here's how you can get connected (tested on Mac OS High Sierra):

![Press Wiimote buttons](/assets/images/press-buttons.png){:class="img-responsive"}

Open Remote Buddy and you will be greeted with the message above telling you
to "Please press 1 and 2 simultaneously on your Wiimote". You should do so.

![Bluetooth Connection Request](/assets/images/connection-request.png){:class="img-responsive"}

Then, you will get a dialog box asking you to put in a passcode to use the
Wiimote. This is, of course, impossible since Wiimotes do not have built in
keyboards.  Do not attempt to use your keyboard to type anything in, or bother
to look up whether there is some kind of master password of button-pressing
combination that you should use when you see this dialog box, as there is
literally nothing here that you should do with that text box.

Rather, the following options should work (as in, I have had success doing
either of the following):

- Ignore the dialog box and it will eventually go away
- Press the "Cancel" button

![Wiimote Connected](/assets/images/wiimote-connected.png){:class="img-responsive"}

Regardless of which option you choose, assuming everything goes well, you should
get a successful connection dialog, and you can begin configuring the Wiimote
button functionality within Remote Buddy.

## Troubleshooting

There may be times where the Wii Remote just does not want to connect or
re-connect, so here are some things to watch out for that I have experienced:

- If, while the Wiimote is connected, the Mac goes to sleep, upon waking up,
  I have found that the Wiimote connection gets lost and cannot be regained.
  In this case, either restarting Remote Buddy, restarting Bluetooth, or
  restarting Mac OS as a last resort, have resulted in being able to connect
  again.
- If, while the Wiimote is connected, you turn off the Wiimote, or it runs out
  of battery, the Mac tends to not seem to notice and thinks it is still
  connected. Resetting Bluetooth did not seem to work, but sometimes restarting
  Remote Buddy did. Otherwise, restart Mac OS.
- Overall, I've generally found it difficult to re-connect a Wiimote with Remote
  Buddy after a connection has been lost, so I have pretty much always needed
  to restart Remote Buddy to do so.
- Solutions to other issues can probably be found on [Remote Buddy's Wiimote
  Support Page].

Do you have a better way to connect a Wii Remote to a computer to use as a
Bluetooth remote, or have a favourite non-standard remote you like using for
presentations? If so, then please leave a comment as I would love to hear about
it!

[Dolphin Emulator]: https://dolphin-emu.org/
[my-presentations]: https://github.com/paulfioravanti/presentations
[Remote Buddy]: https://www.iospirit.com/products/remotebuddy/
[Remote Buddy's Wiimote Support Page]: https://www.iospirit.com/support/faqs/remotebuddy/category/2/Hardware-Wii-Remote/
[Wii Remote]: https://en.wikipedia.org/wiki/Wii_Remote
[Wii Remote Plus connection guide]: https://dolphin-emu.org/docs/guides/wii-remote-plus-rvl-cnt-01-tr-connection-guide/
[Wii Remote Plus]: https://en.wikipedia.org/wiki/Wii_Remote#Wii_Remote_Plus
