---
title: "Steno Gaming: Doom Typist"
date: 2022-06-07 23:41:00 +1100
last_modified_at: 2023-11-17 19:51:00 +1100
tags: retro-gaming georgi steno doom qmk
header:
  image: /assets/images/2022-06-07/doom-typist.jpg
  image_description: "description"
  teaser: /assets/images/2022-06-07/doom-typist-close-up.jpg
  overlay_image: /assets/images/2022-06-07/doom-typist.jpg
badges:
  - image: https://img.shields.io/badge/Plover%20Blog-Jun%2013%202022-5F7F78.svg
    alt: "Plover Blog June 13, 2022"
    link: http://plover.stenoknight.com/2022/06/stenodoom.html
excerpt: >
  Demon hordes are no match for steno chords!
---

Playing games is a great way to get better at [touch typing][] with a [standard
keyboard][QWERTY].

A quick web search for typing games will likely net you results including
[Mavis Beacon][] mini-games, web-based shooters like [ZType][], and thoughtful
adventure games like [Epistory - Typing Chronicles][]. [Stenography][]
enthusiasts have some extra options, with games specifically developed for them,
like the free-to-play [Cargo Crisis][] and [Steno Arcade][].

Probably one of the most quirky typing games around is the on-rails shooter [The
Typing of the Dead][], an official [mod][] of [The House of the Dead][].
Alas, I do not have an old enough computer to play it at home, nor a [Windows][]
machine to attempt its modern sequel, [The Typing of the Dead: Overkill][].
So, I will have to [take a rain check][] on chording through those particular
zombie swarms, but are there any similar alternatives?

There most certainly are. Modders have gifted us with what I think is currently
the best typing game of them all: [Typist.pk3][][^1], a "mod for [Doom][]
\[1993\] engine games that turns them into typing exercises". "Doom engine
games" are ones that can run inside a Doom [source port][] like [GZDoom][] (eg
Doom, [Doom II][], [Heretic][], [Hexen][], and [others][List of notable WADs]).

Here are some videos of me doing some off-rails shooting with Doom Typist using
a [Georgi][] stenographic keyboard.

<div class="steno-video">
  {% include video id="a8Kp5s-jw5k" provider="youtube" %}
  <figcaption>
    Doom Typist - Episode 2 Map 1
    (<a href="https://www.youtube.com/watch?v=a8Kp5s-jw5k&list=PLNN5NpKrqwAM6zF_-hoJwaQYZs6qflv4T&index=4">Full playlist</a>)
  </figcaption>
</div>

<div class="steno-video">
  {% include video id="fxxDAYuciD8" provider="youtube" %}
  <figcaption>
    Doom Typist - Episode 1 Full Playthrough (Long)
  </figcaption>
</div>

Want to give it a try yourself? Read on!

If you are a [QWERTY][] typist, you will not have to worry about any
steno-keyboard-related technical details below. You can just:

- [Install GZDoom][GZDoom downloads]
- Buy a copy of Doom ([GOG.com][GOG.com The Ultimate Doom] \[[Windows][Microsoft
  Windows], but with options to use with other platforms\], [Steam][Steam The
  Ultimate Doom] \[Windows only\])
- [Follow the instructions][Installation and execution of ZDoom] to get Doom up
  and running with GZDoom, including extracting the [WAD][] game file from your
  copy of Doom
- [Download the latest Typist release][Typist.pk3 releases], and load it with
  GZDoom
- Bail out from the rest of this post, and enjoy your new typing game!

> The previous two blog posts to this one were both specifically written in
> service to, and as background context for, this post (though they are also
> meant to stand on their own):
>
> - _[Play Classic Doom on a Mac][]_
> - _[Flashing Georgi Firmware][]_
>
> Hopefully, you will find the answers to any specific questions this post does
> not answer in either one of them.

---

Still here? Okay, so I would wager that you are probably a [Plover][] steno
enthusiast, and maybe also a Georgi user. You may have noticed a fair bit of
non-standard keystroke [shenanigans][] going on in the video. Do not fret,
though: although we will be getting technical (ie editing [firmware][]),
all customisations will be revealed so that you, too, can chord your way through
Doom smoother than [chainsaw][]-ing through an [imp][]!

So, prepare your [boomstick][] and let's begin!

<div class="centered-image" style="width: 75%">
  <figure>
    <img src="/assets/images/2022-06-07/follow_your_dreams_by_azakachi_rd_17_d6of6bm.jpg"
         alt="Doom: Follow Your Dreams">
    <figcaption>
      Art by
      <a href="https://www.deviantart.com/azakachi-rd-17">
        AzakaChi-RD-17
      </a>
      on
      <a href="https://www.deviantart.com/azakachi-rd-17/art/Follow-your-dreams-403815874">
        Deviant Art
      </a>
    </figcaption>
  </figure>
</div>

## Between Two Worlds

A steno gamer cannot game in steno mode alone. Open up Doom, and you can
navigate the menus using your arrow key chords, but when you start the game, you
will likely find your [player character][] unable to move, regardless of what
keys you press. This is because:

- "Plover's text and formatting strokes [can't send arbitrary key
  strokes][Plover Dictionary Format Keyboard Shortcuts]", which means Plover
  cannot "press", say, arrow keys or the Return key, in the same way as a QWERTY
  keyboard does: it only _simulates_ the key presses. Unfortunately, GZDoom does
  not seem to recognise these "simulated key presses" during gameplay[^2]
- Stenotype is not really optimised for sending the [WASD][]-style repeating key
  presses needed for movement in games[^3]

But! Lucky for Georgi owners, [its firmware][Georgi firmware] has a
[Gaming mode][] that "acts like a traditional \[QWERTY\] keyboard, as opposed
to stenotype", enabling _real_ keystrokes and key repetition (Georgi's [QWERTY
mode][] \[not the same as Gaming mode\] acts like stenotype, so we cannot game
with it).

For playing Doom Typist with steno on a Georgi, this means you can:

- Use Gaming Mode when you are in <span style="color: blue">Exploration
  Mode</span> (walking around, opening doors, flipping switches)
  ![Exploration Mode][Exploration Mode]{:width="12%"}
- Use Steno Mode when you are in <span style="color: red">Combat Mode</span>
  (typing answers to hit your targets, dashing)
  ![Combat Mode][Combat Mode]{:width="30%"}

I have found some of the challenges around having one foot in steno-land, and
the other in standard-keyboard-land, within a high-tension environment that
requires quick reflexes to be:

- remembering which typing mode you are in: Steno or Gaming (unlike the
  <span style="color: blue">Exploration</span>/<span style="color: red">Combat
  </span>game mode colour difference, there is no visual cue for your current
  typing mode[^4])
- remembering to _actually_ change from Gaming to Steno mode when the game
  automatically switches you from <span style="color: blue">Exploration</span>
  to <span style="color: red">Combat</span> Mode upon encountering an enemy
- remembering to dash away when sudden close encounters with enemies occur (and
  which typing mode allows that)

The customisations I made to my Georgi layout, in both Steno and Gaming layers,
and the way I set up my player control scheme, helped at least part way in
overcoming these challenges (getting the full way will probably just require
continued practice to [git gud][]).

So, here's the full list of everything I have done so far to make playing Doom
steno-able.

> You can find the code encompassing all of the changes explained in detail
> below in my [Georgi QMK keymaps GitHub repository][].

## Controls

Setting up controls for Doom Typist was a more involved matter than I originally
planned for.

GZDoom, the Doom source port, plays more than just Doom itself: it provides a
very robust selection of [control mappings][GZDoom Customize Controls] that can
be used across a variety of games. Mapping them all to Georgi keymaps is not a
task I want to undertake right now, so I used Doom's original instruction
booklet to help filter down all the options to the ones that high-school me
would have actually used during gameplay.

<div class="centered-image" style="width: 100%">
  <figure>
    <img src="/assets/images/2022-06-07/doom-manual-controls.jpg"
         alt="Doom Manual Controls">
    <figcaption>
      Commands and Shortcuts section from the original
      <a href="https://www.starehry.eu/download/action3d/docs/Doom-Manual.pdf">
        Doom Manual
      </a>
    </figcaption>
  </figure>
</div>

All of pink-outlined controls above will need to be mapped in Georgi's Gaming
mode. I do not intend to make one-to-one mappings of the keys to their literal
equivalents in the Gaming mode keymaps, but rather focus on what form of key
patterns would feel intuitive and comfortable for the controls.

This will all be very subjective, so hopefully they can serve as a template for
you to create your own custom control schemes if you have other ideas.

> You can see what the literal Gaming Mode keys look like in the [Georgi default
> Gaming keymaps][], and compare them to
> [my personal ones][Paul's Georgi Gaming keymaps]). The literal `KC_*` keycodes
> you will see referenced from here on in code examples are based on my personal
> keymaps.

### Movement and Actions

The way I configured movement is based on [ESDF keys][] on the left side, and
[Vi][]-style [HJKL keys][] on the right.

<div class="centered-image" style="width: 100%">
  <figure>
    <img src="/assets/images/2022-06-07/movement-controls.png"
         alt="Doom Georgi Movement Controls">
  </figure>
</div>

Unlike Heretic or Hexen, Doom does not have the concept of "look up/down"
(though many of its mods do...), so the two keys between Look Left and Look
Right remain blank until I play a game that uses them. Firing weapons, opening
doors and toggling switches ("Use"), and Toggle Automap all felt like thumb
cluster keys, so that is where they reside. As for "running" and "fast turning",
I decided to combine them all together into a "Toggle Run" chord deliberately
meant to be a complex enough set of keys that I would not inadvertently press
by mistake.

Those keys get mapped in-game on the Customize Action Controls screen:

<div class="centered-image" style="width: 100%">
  <figure>
    <img src="/assets/images/2022-06-07/customize-action-controls.jpg"
         alt="GZDoom Customize Action Controls">
    <figcaption>
      Stripped down action controls
    </figcaption>
  </figure>
</div>

The Toggle Run chord is implemented as a [QMK Combo][], since it is a non-steno
chord for standard keyboards that lives in the Gaming mode layer, and is hence
outside of Plover's purview. Defining combos consists of the following three
main steps:

**`keyboards/gboards/georgi/keymaps/paulfioravanti/keymap.c`**

```c
// STEP 1: Give the combos names.
enum combos {
  // ...
  DOOM_TYPIST_TOGGLE_RUN
};

// STEP 2: Define the set of keys for the combos.
const uint16_t PROGMEM doom_typist_toggle_run_combo[] = {
    KC_U, KC_I, KC_O, KC_P, COMBO_END
};

// STEP 3: Define what keystroke the combos should send,
// and register them in `key_combos`.
combo_t key_combos[COMBO_COUNT] = {
    // ...
    [DOOM_TYPIST_TOGGLE_RUN] = COMBO(doom_typist_toggle_run_combo, KC_TAB)
};
```

> In _[Flashing Georgi Firmware][]_, I go into more detail about [QMK][] Combos
> for Georgi. Even more detail than that can be found in
> _[Chording QWERTY with QMK Combos]_.

For _every_ combo change, you _must_ change the `COMBO_COUNT` counter in your
`config.h` file to match the number of combos in `key_combos`, otherwise you
will get compilation errors. For my configuration, this looks like:

**`keyboards/gboards/georgi/keymaps/paulfioravanti/config.h`**

```c
// ...
#define COMBO_COUNT 44
```

We will see where all those other combos came from very soon.

### Weapon Selection

Each weapon in Doom is assigned a number, so I wanted to be able to use the
steno number chords for 0-9 to select them, even in Gaming mode.

<div class="centered-image" style="width: 70%">
  <figure>
    <img src="/assets/images/2022-06-07/georgi-numbers-small-looping.gif"
         alt="Georgi Numbers 0-9">
    <figcaption>
      Steno number chords for 0-9 using the <kbr>#</kbr> modifier key
    </figcaption>
  </figure>
</div>

> See _[Stenography Numbers on a Georgi][]_ for more information about number
> chords.

In the [Georgi default Gaming keymaps][], number keystrokes live in Gaming
Layer 2. To get from Gaming Layer 1 (`GAMING`) to Gaming Layer 2 (`GAMING_2`),
the layout has a key that uses the QMK [`LT(layer, kc)`][] function, which
"momentarily activates `layer` when held, and sends `kc` when tapped". In order
to mimic steno number functionality, I assigned keystrokes that call that
function to the keys that are assigned to the number keys (`#`) on Georgi's
steno layer:

<div class="centered-image" style="width: 100%">
  <figure>
    <img src="/assets/images/2022-06-07/number-chords.png"
         alt="Momentarily active Gaming Layer 2 to access number keys">
  </figure>
</div>

For `GAMING_2` access to numbers, we do not need to care too much about the `kc`
for number access (feel free to assign any key to this: I used left and right
brackets,
`LT(GAMING_2, KC_LBRC)` and `LT(GAMING_2, KC_RBRC)`, quite arbitrarily in [my
keymaps][LT function usage in personal keymaps]).

Here's what the image above looks like in layer code (non-number-related
keycodes are "commented out" with `/**/`):

**`keyboards/gboards/georgi/keymaps/paulfioravanti/keymap.c`**

```c
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    // ...
    [GAMING] = LAYOUT_georgi(
        /**/, /**/, /**/, /**/, /**/, /**/, /* | */ /**/, /**/, /**/, /**/, /**/, /**/,
        /**/, /**/, /**/, /**/, /**/, /**/, /* | */ /**/, /**/, /**/, /**/, /**/, /**/,
         LT(GAMING_2, KC_LBRC), /**/, /**/, /* | */ /**/, /**/, LT(GAMING_2, KC_RBRC)
    ),
    [GAMING_2] = LAYOUT_georgi(
        /**/, KC_1, KC_2, KC_3, KC_4, /**/, /* | */ KC_6, KC_7, KC_8, KC_9, /**/, /**/,
        /**/, /**/, /**/, /**/, /**/, /**/, /* | */ /**/, /**/, /**/, /**/, /**/, /**/,
                          /**/, KC_5, KC_0, /* | */ /**/, /**/, /**/
    )
};
```

### Automap

For Automap-related controls, rather than create specific QMK combos
to mirror stenographic words that describe their meaning (ie outlines for
"follow", "mark" etc), I decided instead to re-create the entire steno
[fingerspelling][] alphabet as combos, and leave the controls as their default
single-letter values.

The steps for creating the combos are the same as before; the general idea can
be gleaned from the abbreviated configuration below, but the entire list can be
found in [my Georgi keymaps][Georgi QMK keymaps GitHub repository]:

**`keyboards/gboards/georgi/keymaps/paulfioravanti/keymap.c`**

```c
// STEP 1: Give the combos names.
enum combos {
    STENO_A,
    // ...
    STENO_Z
}

// STEP 2: Define the set of keys for the combos.
const uint16_t PROGMEM steno_a_combo[] = {
    KC_BACKSPACE, KC_H, COMBO_END
};
// ...
const uint16_t PROGMEM steno_z_combo[] = {
    KC_A, KC_W, KC_S, KC_E, KC_D, KC_H, COMBO_END
};

// STEP 3: Define what keystroke the combos should send,
// and register them in `key_combos`.
combo_t key_combos[COMBO_COUNT] = {
    [STENO_A] = COMBO(steno_a_combo, KC_A),
    // ...
    [STENO_Z] = COMBO(steno_z_combo, KC_Z),
};
```

A big block of new chord config rarely goes 100% smooth, of course: there were
a few fingerspelling combos whose chords conflicted with the Doom movement
controls.  Hence, I ended up adding an equivalent steno `-Z` key (for my
keymaps, this ended up being `KC_QUOTE`) at the end of the fingerspelling chords
for `K`, `P`, `R`, and `W` to disambiguate them:

**`keyboards/gboards/georgi/keymaps/paulfioravanti/keymap.c`**

```c
// NOTE: KC_QUOTE/-Z needed to allow strafing left and turning left simultaneously
const uint16_t PROGMEM steno_k_combo[] = {
    KC_S, KC_H, KC_QUOTE, COMBO_END
};
// NOTE: KC_QUOTE/-Z needed to allow moving forward and turning left simultaneously
const uint16_t PROGMEM steno_p_combo[] = {
    KC_E, KC_H, KC_QUOTE, COMBO_END
};
// NOTE: KC_QUOTE/-Z needed to allow strafing right and turning left simultaneously
const uint16_t PROGMEM steno_r_combo[] = {
    KC_F, KC_H, KC_QUOTE, COMBO_END
};
// KC_QUOTE/-Z needed to allow moving backward and turning left simultaneously
const uint16_t PROGMEM steno_w_combo[] = {
    KC_D, KC_H, KC_QUOTE, COMBO_END
};
```

### Typist Controls

Now that we have the controls of Doom itself configured for Gaming Mode, it is
time to shift our focus over to adapting the [Typist.pk3 controls][].

<div class="centered-image" style="width: 80%">
  <figure>
    <img src="/assets/images/2022-06-07/typist-controls.jpg"
         alt="Typist.pk3 configurable controls">
    <figcaption>
    </figcaption>
  </figure>
</div>

Since all the "typing" in <span style="color: red">Combat Mode</span> will
actually be done with steno chords, I created a new [Doom-Typist-specific
dictionary][] in [my steno dictionaries][], encompassing controls that can be
configured in-game, as well as those that cannot:

**`dictionaries/gaming/gaming-doom-typist.json`**

```json
{
  "A*UPL": "{:CMT:return to AUto Mode}{:KEY_COMBO:CONTROL_L}",
  "K-RBGS": "{:CMT:dash left}{:ATTACH:/dl}{:KEY_COMBO:RETURN}",
  "KHRAUL": "{:CMT:CLear ALL}{:KEY_COMBO:CONTROL_L(BACKSPACE)}",
  "KPWA*T": "{:CMT:force COMBAT}{:KEY_COMBO:GRAVE}",
  "P-RBGS": "{:CMT:dash forward}{:ATTACH:/df}{:KEY_COMBO:RETURN}",
  "R-RBGS": "{:CMT:dash right}{:ATTACH:/dr}{:KEY_COMBO:RETURN}",
  "SPHRO*R": "{:CMT:force EXPLORE}{:KEY_COMBO:ESCAPE}",
  "W-RBGS": "{:CMT:dash backward}{:ATTACH:/db}{:KEY_COMBO:RETURN}"
}
```

> The inline comment (`CMT`) syntax is from the [plover-comment][] Plover
> plugin, which I use to help provide outlines with metadata, particularly
> around how I pronounce outlines in my head, how I should remember them, or
> just what they are supposed to mean. The `ATTACH` and `KEY_COMBO` syntax are
> Plover's [friendly command names][].

The non-dash outlines are all (somewhat) [phonetic][Phonetics], while dash
outlines re-use the [ESDF][ESDF keys]-style keys for dashing direction, along
with a `-RBGS` "dash chord":

<div class="centered-image" style="width: 100%">
  <figure>
    <img src="/assets/images/2022-06-07/dash-chords.png"
         alt="Doom Typist 'dash chords'">
  </figure>
</div>

Although dashing around in steno mode is all good and well, there came many
times where I would, say, move up to a door in Gaming mode, open it, and
immediately encounter an enemy. The surprise of this would make me forget that
I was in Gaming mode, and I would attempt to dash away, forgetting that I was
not yet in steno mode, where all the dashing chords were configured.

I wanted to be able to instantly dash away to put some distance between me and
the enemy, to compose myself and remember to switch to Steno mode. So, you
guessed it, it's combo time again to mirror all the dictionary entries above in
Gaming mode (noticing a pattern yet?):

**`keyboards/gboards/georgi/keymaps/paulfioravanti/keymap.c`**

```c
// STEP 1: Create some custom keycodes
enum custom_keycodes {
  DASH = SAFE_RANGE,
  DASH_BACKWARD,
  DASH_FORWARD,
  DASH_LEFT,
  DASH_RIGHT
};

// STEP 2: Give the combos names.
enum combos {
    // ...
    DOOM_TYPIST_DASH,
    DOOM_TYPIST_DASH_BACKWARD,
    DOOM_TYPIST_DASH_FORWARD,
    DOOM_TYPIST_DASH_LEFT,
    DOOM_TYPIST_DASH_RIGHT,
}

// STEP 3: Define the set of keys for the combos.
const uint16_t PROGMEM doom_typist_dash_combo[] = {
    KC_J, KC_K, KC_L, KC_SEMICOLON, COMBO_END
};
// Mirrors "W-RBGS": "{:CMT:dash backward}{:ATTACH:/db}{:KEY_COMBO:RETURN}"
const uint16_t PROGMEM doom_typist_dash_backward_combo[] = {
    KC_D, KC_J, KC_K, KC_L, KC_SEMICOLON, COMBO_END
};
// Mirrors "P-RBGS": "{:CMT:dash forward}{:ATTACH:/df}{:KEY_COMBO:RETURN}"
const uint16_t PROGMEM doom_typist_dash_forward_combo[] = {
    KC_E, KC_J, KC_K, KC_L, KC_SEMICOLON, COMBO_END
};
// Mirrors "K-RBGS": "{:CMT:dash left}{:ATTACH:/dl}{:KEY_COMBO:RETURN}"
const uint16_t PROGMEM doom_typist_dash_left_combo[] = {
    KC_S, KC_J, KC_K, KC_L, KC_SEMICOLON, COMBO_END
};
// Mirrors "R-RBGS": "{:CMT:dash right}{:ATTACH:/dr}{:KEY_COMBO:RETURN}"
const uint16_t PROGMEM doom_typist_dash_right_combo[] = {
    KC_F, KC_J, KC_K, KC_L, KC_SEMICOLON, COMBO_END
};

// STEP 4: Define what keystroke the combos should send,
// and register them in `key_combos`.
combo_t key_combos[COMBO_COUNT] = {
    // ...
    [DOOM_TYPIST_DASH] = COMBO(doom_typist_dash_combo, DASH),
    [DOOM_TYPIST_DASH_BACKWARD] = COMBO(doom_typist_dash_backward_combo, DASH_BACKWARD),
    [DOOM_TYPIST_DASH_FORWARD] = COMBO(doom_typist_dash_forward_combo, DASH_FORWARD),
    [DOOM_TYPIST_DASH_LEFT] = COMBO(doom_typist_dash_left_combo, DASH_LEFT),
    [DOOM_TYPIST_DASH_RIGHT] = COMBO(doom_typist_dash_right_combo, DASH_RIGHT),
};
```

Assuming your eyes have not glazed over at seeing _yet another_ set of combo
configuration, you may have noticed a couple of peculiar things that prompted
some questions:

- There are not any specific keycodes related to "dashing", so some new
  `custom_keycodes` were created. The combos are configured to send these
  custom keycodes on activation. But, what do those keycodes mean? What will
  get sent?
- Why does just the "dash chord" get its own combo in isolation?

> In case you are wondering about `SAFE_RANGE` above, see
> [Defining a New Keycode][] in QMK's documentation.

We can define the handling for, and hence give meaning to, custom keycodes in
the [`process_record_user`][QMK programming the Behavior of Any Keycode]
function. For example, we want the `DASH_FORWARD` keycode to type in `/df` and
then press enter, giving us an insta-dash forward when the combo is chorded:

**`keyboards/gboards/georgi/keymaps/paulfioravanti/keymap.c`**

```c
bool process_record_user(uint16_t keycode, keyrecord_t *record) {
    // ...
    switch (keycode) {
    // ...
    case DASH_FORWARD:
        if (record->event.pressed) {
            SEND_STRING("/df" SS_TAP(X_ENTER));
        }
        return false;
    }
    return true;
};
```

All the other dashing directions have similar handling in their `case`
conditions, and you can find them all in [my Georgi keymaps][Georgi QMK keymaps
GitHub repository]. Also, just by the way, custom keycodes never require any
handling by QMK (they are custom to you after all), so we always `return false`
at the end of their handling code.

As for the "dash chord" combo, the reason it exists is that I wanted to be able
to have a version of "partial chording"[^5] in Gaming mode, where I could keep
the "dash chord" held down, and just press the direction keys in rapid
succession to easily make quick getaways in any direction.

This meant that the `process_record_user` function would need to keep track of
whether we are `dashing` or not:

- `true` if the "dash chord", or any of the directional dash chords, are being
  pressed,
- `false` if they are released

Checking of the directional [ESDF keys][] in isolation would also need to be
redefined to account for whether we are `dashing` or not and:

- if so, perform a directional dash
- if not, let QMK do its normal handling

Here's how that looks in keymap configuration for just dashing forward:

**`keyboards/gboards/georgi/keymaps/paulfioravanti/keymap.c`**

```c
bool process_record_user(uint16_t keycode, keyrecord_t *record) {
    static bool dashing;

    switch (keycode) {
    case DASH:
        if (record->event.pressed) {
            dashing = true;
        } else {
            dashing = false;
        }
        return false;
    // ...
    case DASH_FORWARD:
        if (record->event.pressed) {
            SEND_STRING("/df" SS_TAP(X_ENTER));
            dashing = true;
        } else {
            dashing = false;
        }
        return false;
    // ...
    case KC_E:
        if (record->event.pressed && dashing) {
            SEND_STRING("/df" SS_TAP(X_ENTER));
            return false;
        }
        return true;
    }
    return true;
};
```

Similar configuration code for all the other dash direction keys and chords can
be found in [my Georgi keymaps][Georgi QMK keymaps GitHub repository].

Okay. _Now_ you are ready to play a bit of Doom, but there are just a couple
more non-control-related quality-of-steno-gaming-life configuration changes that
can be made.

## Layer-Switching Chord Changes

In order to reduce the amount of fat-fingered mis-chording that seemed to happen
to me while frantically attempting to toggle between moving around and shooting,
I made a couple of changes to keymap-layer switching logic.

### Steno Mode <-> Gaming Mode

The default Georgi chord to change from Steno mode to Gaming mode looks like
this:

<div class="centered-image" style="width: 100%">
  <figure>
    <img src="/assets/images/2022-06-07/georgi-steno-layer-gaming-chord.png"
         alt="Enter Gaming Mode chord">
    <figcaption>
      <code>(PWR | FN | ST4 | ST3)</code>
    </figcaption>
  </figure>
</div>

This is perfectly fine for normal steno use cases, if you are not planning on
changing back and forth between the modes at rapid-fire speed. I found that I
would frequently mis-chord it in the heat of battle, and desired a slightly
simpler chord, which ended up being just the bottom half of the original one:

<div class="centered-image" style="width: 100%">
  <figure>
    <img src="/assets/images/2022-06-07/georgi-simple-gaming-chord.png"
         alt="Simpler Steno/Gaming toggle chord">
    <figcaption>
      <code>(PWR | ST4)</code>
    </figcaption>
  </figure>
</div>

The firmware edits required to make this happen necessitated small changes
[directly to Georgi-specific stenography logic][sten.c Gaming Mode toggle]
(rather than user keymap logic, which is where most [QMK][] configuration takes
place, and where all the configurations you have seen thus far have been made):

**`qmk_firmware/keyboards/gboards/georgi/sten.c`**

```c
bool send_steno_chord_user(steno_mode_t mode, uint8_t chord[6]) {
    // ...
    // Handle Gaming Toggle,
    // Original cChord == (PWR | FN | ST4 | ST3)
    if (cChord == (PWR | ST4) && keymapsCount > 1) {
        // ...
        layer_on(1);
        goto out;
    }
    // ...
}
```

In the _[Flashing Georgi Firmware][]_ post, I go into significant detail about
this particular change, as well as the mirroring QMK combo in the Gaming layer
that returns back to Steno mode. For completeness' sake though, here's what that
combo looks like:

**`keyboards/gboards/georgi/keymaps/paulfioravanti/keymap.c`**

```c
// STEP 1: Give the combos names.
enum combos {
    // ...
    GOTO_STENO_LAYER,
}

// STEP 2: Define the set of keys for the combos.
// Mirrors the (PWR | ST4) chord used to switch to the gaming layer in `sten.c`.
const uint16_t PROGMEM goto_steno_layer_combo[] = {
    KC_LEFT_CTRL, KC_H, COMBO_END
};

// STEP 3: Define what keystroke the combos should send,
// and register them in `key_combos`.
combo_t key_combos[COMBO_COUNT] = {
    // ...
    [GOTO_STENO_LAYER] = COMBO(goto_steno_layer_combo, TO(STENO_LAYER)),
};
```

> [`TO(layer)`][] "turns on `layer` and turns off all other layers, except the
> default layer"

### QWERTY Mode

When it came to switching from Steno to QWERTY mode, I had a similar, but
opposite, problem. By default, simply pressing the `FN` key switches you to
Georgi's QWERTY mode, a "pseudo-layer" within the steno keymap layer:

<div class="centered-image" style="width: 100%">
  <figure>
    <img src="/assets/images/2022-06-07/georgi-change-to-qwerty-mode.png"
         alt="Switch to QWERTY mode">
  </figure>
</div>

I found that I would inadvertently press this button frequently when using the
new Steno-Gaming mode chord defined above. I would think I was in Gaming mode,
but was in fact in stenotype QWERTY mode, leaving me unable to move my
character, and at the mercy of whatever enemy was attacking me.

I needed to change the switch to QWERTY mode be a bit more _complex_: from a
simple button press, to a less-likely-to-occur-by-accident chord.  The easiest
change seemed to be mirroring the Steno-Gaming chord:

<div class="centered-image" style="width: 100%">
  <figure>
    <img src="/assets/images/2022-06-07/georgi-change-to-qwerty-mode-chord.png"
         alt="Switch to QWERTY mode chord">
    <figcaption>
      <code>(FN | ST3)</code>
    </figcaption>
  </figure>
</div>

The firmware edits to do this were also in Georgi's stenography logic:

**`qmk_firmware/keyboards/gboards/georgi/sten.c`**

```c
bool send_steno_chord_user(steno_mode_t mode, uint8_t chord[6]) {
    // ...
    // Original cChord == FN
    if (cChord == (FN | ST3)) {
        (cMode == STENO) ? (cMode = QWERTY) : (cMode = STENO);
        goto out;
    }
    // ...
}
```

As of this writing, both of those Georgi-steno-logic-level changes have worked
out well for me, but I have no doubt I will continue to fine-tune them.

## Next Stage

I have little doubt that my gaming-related steno configuration is going to be a
permanent work-in-progress, so here are a few of the things on my mind to look
at next, as of this writing.

### Hard to "Use"

It seems that it is impossible to open doors or toggle switches (ie use the
"Use" functionality) in steno mode. This can be a bit annoying if you encounter
multiple enemies immediately after opening a door because:

- you get auto-changed from <span style="color: blue">Exploration Mode</span> to
  <span style="color: red">Combat Mode</span>, so you have to change from Gaming
  mode to Steno mode quickly
- there usually isn't enough time to defeat all the enemies before the door
  closes
- you have to switch back to Gaming mode _just_ to re-open the door (since the
  "simulated" stenotype Enter keystrokes do not register), and _then_ switch
  back to Steno mode again to resume combat

The workaround to this problem is to remember to dash toward the enemy and away
from the door, but I would like the option to not have to do that. So, I am
thinking that having another input device would be handy: like a foot pedal
(I have my eye on a [Stream Deck Pedal][], unless there are compelling
alternatives...), which can permanently send standard keystrokes (in this case
the "Use" key), regardless of what mode the Georgi is in.

### Brutal Doom Typist

It would seem that the most popular [mod][] for Doom is [Brutal Doom][]. GZDoom
has the ability to load multiple WAD files at a time, so I was actually able to
get Brutal Doom and Typist.pk3 to load together!

<div class="centered-image" style="width: 50%">
  <figure>
    <img src="/assets/images/2022-06-07/gzdoom-multiple-wad-files.jpg"
         alt="GZDoom multiple WAD files">
    <figcaption>
      Multiple WAD files loaded: Typist.pk3, Brutal Doom itself, its new
      soundtrack, and its new sound effects.
    </figcaption>
  </figure>
</div>

I have not played it much just yet, but if you are planning to give Brutal Doom
Typist a shot, just remember to always play the game in "Purist" mode:

<div class="centered-image" style="width: 90%">
  <figure>
    <img src="/assets/images/2022-06-07/purist-mode.jpg"
         alt="Brutal Doom Purist mode">
  </figure>
</div>

This is because Classic Doom does not have the concept of looking up and down,
but Brutal Doom does. Unfortunately, it will not autoaim your typing shots at
enemies in high places when you get put in
<span style="color: red">Combat Mode</span>, leading to never being able to
defeat them. In Purist (Oldschool Mode), you get the expected "autoaim".

Here's a video of me attempting to play Brutal Doom Typist with a Georgi:

<div class="steno-video">
  {% include video id="LyeWSzbBfhY" provider="youtube" %}
  <figcaption>
    Brutal Doom Typist - Episode 1 Map 1
  </figcaption>
</div>

### Multiplayer Steno Dooming...?

After writing most of this post, I found out about [Zandronum][], another Doom
source port, which is "leading the way in newschool multiplayer Doom online",
and supports a "large number of ZDoom and GZDoom mods".

I have not tried it yet, but if it runs Typist.pk3, could this enable
multiplayer Steno Doom Typist [LAN parties][LAN party]...? Would that even be
fun...? If you end up getting Doom Typist set up yourself and you want to find
out, reach out to me and let's collaborate!

For now, though, it's time to break out my old grungy [flanelette
shirts][Flannel] and [Reebok Pumps][], and get Georgi back to hell to chord like
it's 1993! :musical_keyboard:

[^1]: [PK3][] being "an alternate extension for [ZIP][] files"

[^2]: On macOS, I even tried using the [Plover Run Shell][] plugin with an
      [outline][Learn Plover! Glossary] that maps to an entry that runs a
      [shell][] command that calls out to [AppleScript][] to trigger a Return
      keystroke:

      ```json
      "R*R": "{:COMMAND:SHELL:osascript -e 'tell application \"System Events\" to keystroke return'}"
      ```

      and that _still_ did not work with GZDoom during Doom gameplay.

[^3]: Even if you have already supercharged your steno firmware with
      [Joshua Grams][]' excellent [`steno-firmware`][], whose `STENO_REPEAT`
      functionality allows you to hold down chords to repeat them in quick
      succession, it will still not be enough.

[^4]: Typist.pk3 has no idea I'm playing using steno, and is likely not even
      expecting to receive anything but standard keystrokes from a user. So,
      naturally, there would not be the concept of any visual cues for that
      within the mod. I think if there was an [LED][] on the Georgi, or some
      kind of [UI][] widget indicating current layer existed, that would be
      useful.

[^5]: À la `STENO_1UP` functionality in [Joshua Grams][]' [`steno-firmware`][],
      which allows you to hold down common keys in between chords.

[AppleScript]: https://en.wikipedia.org/wiki/AppleScript
[boomstick]: https://evildead.fandom.com/wiki/Boomstick
[Brutal Doom]: https://en.wikipedia.org/wiki/Brutal_Doom
[Cargo Crisis]: http://qwertysteno.com/Games/CargoCrisis.php
[chainsaw]: https://doom.fandom.com/wiki/Chainsaw
[Chording QWERTY with QMK Combos]: https://www.paulfioravanti.com/blog/chording-qwerty-qmk-combos/
[Combat Mode]: /assets/images/2022-06-07/combat-mode.jpg "Combat Mode"
[Defining a New Keycode]: https://github.com/qmk/qmk_firmware/blob/master/docs/custom_quantum_functions.md#defining-a-new-keycode
[Doom]: https://en.wikipedia.org/wiki/Doom_(1993_video_game)
[Doom II]: https://en.wikipedia.org/wiki/Doom_II
[Doom Manual]: https://www.starehry.eu/download/action3d/docs/Doom-Manual.pdf
[Doom-Typist-specific dictionary]: https://github.com/paulfioravanti/steno-dictionaries/blob/b670b12696b656488a8850a490884b9337884ceb/dictionaries/gaming/gaming-doom-typist.json
[Epistory - Typing Chronicles]: https://en.wikipedia.org/wiki/Epistory_-_Typing_Chronicles
[ESDF keys]: https://en.wikipedia.org/wiki/Arrow_keys#ESDF_keys
[Exploration Mode]: /assets/images/2022-06-07/exploration-mode.jpg "Exploration Mode"
[fingerspelling]: https://www.artofchording.com/sounds/fingerspelling.html
[firmware]: https://en.wikipedia.org/wiki/Firmware
[Flannel]: https://en.wikipedia.org/wiki/Flannel
[Flashing Georgi Firmware]: https://www.paulfioravanti.com/blog/flashing-georgi-firmware/
[friendly command names]: https://github.com/openstenoproject/plover/wiki/Dictionary-Format#friendly-command-names
[Gaming mode]: http://docs.gboards.ca/docs/Unboxing-Georgi/#entering-qmk-gaming-mode
[Georgi]: https://www.gboards.ca/product/georgi
[Georgi default Gaming keymaps]: https://github.com/qmk/qmk_firmware/blob/89a5d5aea095172c23b6e886217078ffe404ecec/keyboards/gboards/georgi/keymaps/default/keymap.c#L233
[Georgi firmware]: https://github.com/qmk/qmk_firmware/tree/master/keyboards/gboards/georgi
[Georgi QMK keymaps GitHub repository]: https://github.com/paulfioravanti/qmk_keymaps/blob/master/keyboards/gboards/georgi/keymaps/paulfioravanti/README.md
[git gud]: https://en.wiktionary.org/wiki/git_gud
[GOG.com The Ultimate Doom]: https://www.gog.com/en/game/the_ultimate_doom
[GZDoom]: https://zdoom.org/wiki/GZDoom
[GZDoom downloads]: https://zdoom.org/downloads
[GZDoom Customize Controls]: https://zdoom.org/wiki/Customize_controls
[Heretic]: https://en.wikipedia.org/wiki/Heretic_(video_game)
[Hexen]: https://en.wikipedia.org/wiki/Hexen:_Beyond_Heretic
[HJKL keys]: https://en.wikipedia.org/wiki/Arrow_keys#HJKL_keys
[imp]: https://doom.fandom.com/wiki/Imp
[Installation and execution of ZDoom]: https://zdoom.org/wiki/Installation_and_execution_of_ZDoom
[Joshua Grams]: https://github.com/JoshuaGrams
[LAN party]: https://en.wikipedia.org/wiki/LAN_party
[Learn Plover! Glossary]: https://www.openstenoproject.org/learn-plover/glossary
[LED]: https://en.wikipedia.org/wiki/Light-emitting_diode
[List of notable WADs]: https://doom.fandom.com/wiki/List_of_notable_WADs
[`LT(layer, kc)`]: https://github.com/qmk/qmk_firmware/blob/master/docs/feature_layers.md#switching-and-toggling-layers-idswitching-and-toggling-layers
[LT function usage in personal keymaps]: https://github.com/paulfioravanti/qmk_keymaps/blob/2f78c94dfb233f4b11e51403826265cdfdaaec88/keyboards/gboards/georgi/keymaps/paulfioravanti/keymap.c#L566
[macOS]: https://en.wikipedia.org/wiki/MacOS
[Mavis Beacon]: https://en.wikipedia.org/wiki/Mavis_Beacon_Teaches_Typing
[Microsoft Windows]: https://en.wikipedia.org/wiki/Microsoft_Windows
[mod]: https://en.wikipedia.org/wiki/Video_game_modding
[my steno dictionaries]: https://github.com/paulfioravanti/steno-dictionaries/
[Paul's Georgi Gaming keymaps]: https://github.com/paulfioravanti/qmk_keymaps/blob/4881b7ace9403a9fbdf0ece09a18f0916c4a8a01/keyboards/gboards/georgi/keymaps/paulfioravanti/keymap.c#L418
[Phonetics]: https://en.wikipedia.org/wiki/Phonetics
[PK3]: https://doom.fandom.com/wiki/PK3
[Play Classic Doom on a Mac]: https://www.paulfioravanti.com/blog/classic-doom-mac/
[player character]: https://en.wikipedia.org/wiki/Player_character
[Plover]: https://www.openstenoproject.org/plover/
[plover-comment]: https://github.com/user202729/plover-comment
[Plover Dictionary Format Keyboard Shortcuts]: https://github.com/openstenoproject/plover/wiki/Dictionary-Format#keyboard-shortcuts
[Plover Run Shell]: https://github.com/user202729/plover_run_shell
[QMK]: https://qmk.fm/
[QMK combo]: https://github.com/qmk/qmk_firmware/blob/master/docs/feature_combo.md
[QMK custom quantum functions]: https://github.com/qmk/qmk_firmware/blob/master/docs/custom_quantum_functions.md#programming-the-behavior-of-any-keycode-idprogramming-the-behavior-of-any-keycode
[QMK programming the Behavior of Any Keycode]: https://github.com/qmk/qmk_firmware/blob/master/docs/custom_quantum_functions.md#programming-the-behavior-of-any-keycode-idprogramming-the-behavior-of-any-keycode
[QWERTY]: https://en.wikipedia.org/wiki/QWERTY
[QWERTY mode]: http://docs.gboards.ca/docs/Unboxing-Georgi/#modes
[Reebok Pumps]: https://en.wikipedia.org/wiki/Reebok_Pump
[Resident Evil 4]: https://en.wikipedia.org/wiki/Resident_Evil_4
[shell]: https://en.wikipedia.org/wiki/Shell_(computing)
[shenanigans]: https://dictionary.cambridge.org/dictionary/english/shenanigans
[source port]: https://zdoom.org/wiki/Source_port
[Steam The Ultimate Doom]: https://store.steampowered.com/app/2280/Ultimate_Doom/
[sten.c Gaming Mode toggle]: https://github.com/qmk/qmk_firmware/blob/f5d091a9d58c8349437e9d52de87294258cbd256/keyboards/gboards/georgi/sten.c#L97
[Steno Arcade]: http://www.foralltoplay.com/games/steno-arcade/index.php
[`steno-firmware`]: https://github.com/JoshuaGrams/steno-firmware
[stenography]: https://en.wikipedia.org/wiki/Stenotype
[Stenography Numbers on a Georgi]: https://www.paulfioravanti.com/blog/steno-numbers-georgi/
[Stream Deck Pedal]: https://www.elgato.com/en/stream-deck-pedal
[take a rain check]: https://dictionary.cambridge.org/dictionary/english/take-a-rain-check-on-sth
[The House of the Dead]: https://en.wikipedia.org/wiki/The_House_of_the_Dead
[The Typing of the Dead]: https://en.wikipedia.org/wiki/The_Typing_of_the_Dead
[The Typing of the Dead: Overkill]: https://en.wikipedia.org/wiki/The_House_of_the_Dead:_Overkill
[`TO(layer)`]: https://github.com/qmk/qmk_firmware/blob/master/docs/keycodes.md#layer-switching-idlayer-switching
[touch typing]: https://en.wikipedia.org/wiki/Touch_typing
[Typist.pk3]: https://github.com/mmaulwurff/typist.pk3
[Typist.pk3 controls]: https://github.com/mmaulwurff/typist.pk3#how-to-play
[Typist.pk3 releases]: https://github.com/mmaulwurff/typist.pk3/releases
[UI]: https://en.wikipedia.org/wiki/User_interface
[Vi]: https://en.wikipedia.org/wiki/Vi
[WAD]: https://doomwiki.org/wiki/WAD
[WASD]: https://en.wikipedia.org/wiki/Arrow_keys#WASD_keys
[Windows]: https://en.wikipedia.org/wiki/Microsoft_Windows
[Zandronum]: https://zandronum.com/
[ZIP]: https://en.wikipedia.org/wiki/ZIP_(file_format)
[ZType]: https://zty.pe/
